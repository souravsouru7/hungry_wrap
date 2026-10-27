"use client";

import { ContactShadows } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { BRAND, seeded, smooth, span, windowed, type SceneProps } from "../util";
import { useFitCamera } from "../useFitCamera";
import { ChaiCupModel } from "./ChaiCup";
import MomoSteamer from "./MomoSteamer";

/* ------------------------------------------------------------- tortilla --- */

const TORTILLA_LENGTH = 2.6;
const TORTILLA_WIDTH = 3.3;

/** A toasted tortilla, painted once onto a canvas: warm base, scorch spots, grill bars. */
function useTortillaTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#f0cf8e";
    ctx.fillRect(0, 0, 512, 512);
    const rand = seeded(11);
    for (let i = 0; i < 170; i++) {
      const x = rand() * 512;
      const y = rand() * 512;
      const r = 2 + rand() * 11;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(150, 82, 24, ${0.25 + rand() * 0.45})`);
      g.addColorStop(1, "rgba(150, 82, 24, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(160, 90, 30, 0.22)";
    ctx.lineWidth = 9;
    for (let x = 40; x < 512; x += 72) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 40, 512);
      ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

/**
 * Rolls a flat sheet into a tube. Each vertex across the width is bent onto a
 * circle whose circumference is the sheet width divided by `k`, so k → 0 is
 * flat and k = 1 closes the wrap. The middle stays on the plate; both edges
 * rise and meet over the filling.
 */
function rollSheet(geometry: THREE.PlaneGeometry, base: Float32Array, k: number) {
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  const curl = Math.max(k * 0.97, 0.0001);
  const radius = TORTILLA_WIDTH / (2 * Math.PI * curl);
  for (let i = 0; i < pos.count; i++) {
    const u = base[i * 3];
    const v = base[i * 3 + 1];
    if (k < 0.002) {
      pos.setXYZ(i, u, 0, v);
    } else {
      const theta = v / radius;
      pos.setXYZ(i, u, radius - radius * Math.cos(theta), radius * Math.sin(theta));
    }
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
}

/* -------------------------------------------------------------- fillings --- */

type Filling = {
  start: THREE.Vector3;
  end: THREE.Vector3;
  orbitSpeed: number;
  spin: THREE.Euler;
  endRot: THREE.Euler;
  scale: THREE.Vector3;
  order: number;
};

function makeFillings(count: number, seed: number, layer: [number, number], scale: [number, number, number]) {
  const rand = seeded(seed);
  return Array.from({ length: count }, (_, i): Filling => {
    const angle = rand() * Math.PI * 2;
    const r = 2.1 + rand() * 1.3;
    return {
      start: new THREE.Vector3(Math.cos(angle) * r, -0.3 + rand() * 2.4, Math.sin(angle) * r),
      end: new THREE.Vector3(-1.0 + (i / Math.max(count - 1, 1)) * 2.0 + (rand() - 0.5) * 0.15, layer[0] + rand() * (layer[1] - layer[0]), (rand() - 0.5) * 0.4),
      orbitSpeed: 0.2 + rand() * 0.25,
      spin: new THREE.Euler(rand() * 3, rand() * 3, rand() * 3),
      endRot: new THREE.Euler((rand() - 0.5) * 0.3, rand() * Math.PI, (rand() - 0.5) * 0.3),
      scale: new THREE.Vector3(...scale),
      order: rand(),
    };
  });
}

const dummy = new THREE.Object3D();
const tmp = new THREE.Vector3();

function FillingMesh({
  items,
  geometry,
  color,
  roughness = 0.5,
  progress,
}: {
  items: Filling[];
  geometry: THREE.BufferGeometry;
  color: string;
  roughness?: number;
  progress: () => number;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const q = progress();
    const t = state.clock.elapsedTime;
    items.forEach((it, i) => {
      const f = smooth(span(q, 0.06 + it.order * 0.18, 0.3 + it.order * 0.18));
      const a = t * it.orbitSpeed;
      tmp.set(
        it.start.x * Math.cos(a) - it.start.z * Math.sin(a),
        it.start.y + Math.sin(t + i) * 0.12,
        it.start.x * Math.sin(a) + it.start.z * Math.cos(a),
      );
      dummy.position.lerpVectors(tmp, it.end, f);
      dummy.position.y += Math.sin(f * Math.PI) * 0.9; // arc up and over on the way in
      dummy.rotation.set(
        it.spin.x * (1 - f) + t * 0.6 * (1 - f) + it.endRot.x * f,
        it.spin.y * (1 - f) + t * 0.4 * (1 - f) + it.endRot.y * f,
        it.spin.z * (1 - f) + it.endRot.z * f,
      );
      dummy.scale.copy(it.scale);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, items.length]} frustumCulled={false}>
      <meshStandardMaterial color={color} roughness={roughness} />
    </instancedMesh>
  );
}

function WrapAssembly({ progress }: { progress: () => number }) {
  const texture = useTortillaTexture();
  const sheet = useRef<THREE.Mesh>(null);
  const lastK = useRef(-1);

  const { geometry, base } = useMemo(() => {
    const g = new THREE.PlaneGeometry(TORTILLA_LENGTH, TORTILLA_WIDTH, 48, 40);
    return { geometry: g, base: Float32Array.from(g.attributes.position.array) };
  }, []);

  useLayoutEffect(() => rollSheet(geometry, base, 0), [geometry, base]);

  const sets = useMemo(
    () => ({
      lettuce: makeFillings(10, 3, [0.11, 0.17], [0.34, 0.05, 0.24]),
      tomato: makeFillings(7, 5, [0.2, 0.26], [1, 1, 1]),
      chicken: makeFillings(8, 9, [0.28, 0.36], [1, 1, 1]),
      cheese: makeFillings(4, 13, [0.24, 0.27], [1, 1, 1]),
    }),
    [],
  );

  const geos = useMemo(
    () => ({
      lettuce: new THREE.IcosahedronGeometry(1, 1),
      tomato: new THREE.CylinderGeometry(0.15, 0.15, 0.045, 24),
      chicken: new THREE.CapsuleGeometry(0.055, 0.3, 6, 12).rotateZ(Math.PI / 2),
      cheese: new THREE.BoxGeometry(0.3, 0.02, 0.26),
    }),
    [],
  );

  useFrame(() => {
    const k = smooth(span(progress(), 0.55, 0.86));
    if (Math.abs(k - lastK.current) > 0.0005) {
      rollSheet(geometry, base, k);
      lastK.current = k;
    }
  });

  return (
    <group>
      <mesh ref={sheet} geometry={geometry}>
        <meshStandardMaterial map={texture} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      <FillingMesh items={sets.lettuce} geometry={geos.lettuce} color={BRAND.green} roughness={0.45} progress={progress} />
      <FillingMesh items={sets.tomato} geometry={geos.tomato} color={BRAND.red} roughness={0.3} progress={progress} />
      <FillingMesh items={sets.chicken} geometry={geos.chicken} color="#c27a35" roughness={0.6} progress={progress} />
      <FillingMesh items={sets.cheese} geometry={geos.cheese} color={BRAND.yellow} roughness={0.4} progress={progress} />
    </group>
  );
}

/* ------------------------------------------------------------- showcase --- */

/**
 * /menu. The scene follows the real menu down the page: the kathi roll builds
 * itself from orbiting fillings and rolls shut; at the momos a bamboo steamer
 * lifts its lid and the dumplings turn golden through the fried and kurkura
 * sections; at the drinks, a full cup of THW Special Chai steams.
 */
export default function MenuShowcase({ progress, lite, phases }: SceneProps) {
  const p = useRef(0);
  const wrap = useRef<THREE.Group>(null);
  const momoGroup = useRef<THREE.Group>(null);
  const chai = useRef<THREE.Group>(null);
  const rig = useRef<THREE.Group>(null);
  useFitCamera(2.9);

  // Where Steamy, Fried, Kurkura, Dips and Beverages begin, measured from the
  // page (see MENU_PHASE_STARTS); sensible defaults until they are.
  const bounds = () => {
    const [m = 0.42, f = 0.52, k = 0.6, dp = 0.7, d = 0.78] = phases?.current ?? [];
    return { m, f, k, dp, d };
  };
  const wrapProgress = () => span(p.current, 0, Math.max(bounds().m - 0.04, 0.1));
  const momo = {
    arrive: () => span(p.current, bounds().m - 0.06, bounds().m + 0.05),
    open: () => smooth(span(p.current, bounds().m - 0.04, bounds().m + 0.02)),
    fried: () => smooth(span(p.current, bounds().f - 0.03, bounds().f + 0.03)),
    crunch: () => smooth(span(p.current, bounds().k - 0.03, bounds().k + 0.03)),
    dip: () => {
      const { dp, d } = bounds();
      return windowed(p.current, dp - 0.03, dp + 0.03, d - 0.05, d);
    },
  };

  useFrame((state, delta) => {
    p.current += (progress.current - p.current) * (1 - Math.exp(-delta * 4));
    const s = p.current;
    const t = state.clock.elapsedTime;
    const { m, d } = bounds();
    const momoVis = windowed(s, m - 0.06, m + 0.01, d - 0.05, d + 0.02);

    const show = (g: THREE.Group | null, vis: number, from: number) => {
      if (!g) return;
      g.visible = vis > 0.002;
      g.scale.setScalar(Math.max(vis, 0.001));
      g.position.y = (1 - vis) * from;
    };

    show(wrap.current, 1 - smooth(span(s, m - 0.05, m + 0.02)), -1.2);
    show(momoGroup.current, momoVis, 1.4);
    // Momos are the star here: bigger, and the camera tips down to look into the steamer.
    if (momoGroup.current) momoGroup.current.scale.setScalar(Math.max(momoVis * 1.22, 0.001));
    show(chai.current, smooth(span(s, d - 0.02, d + 0.06)), -1.4);

    if (wrap.current) {
      const q = wrapProgress();
      const done = smooth(span(q, 0.8, 1));
      wrap.current.rotation.x = 0.55 * (1 - done) + 0.12 * done;
      wrap.current.rotation.y = -0.5 * done + Math.sin(t * 0.5) * 0.15 * done;
    }
    if (momoGroup.current) momoGroup.current.rotation.y = -0.4 + Math.sin(t * 0.35) * 0.3;
    if (chai.current) chai.current.rotation.y = -0.5 + Math.sin(t * 0.4) * 0.3;
    if (rig.current) {
      rig.current.rotation.y = state.pointer.x * 0.35;
      rig.current.rotation.x = state.pointer.y * -0.1 + momoVis * 0.42;
    }
  });

  return (
    <>
      <group ref={rig} position-y={-0.55}>
        <group ref={wrap}>
          <WrapAssembly progress={wrapProgress} />
        </group>
        <group ref={momoGroup}>
          <MomoSteamer {...momo} lite={lite} />
        </group>
        <group ref={chai}>
          <ChaiCupModel fill={() => 1} steamCount={lite ? 50 : 100} />
        </group>
      </group>
      {!lite && <ContactShadows position={[0, -0.62, 0]} opacity={0.32} scale={9} blur={2.6} far={3} resolution={256} />}
    </>
  );
}
