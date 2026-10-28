"use client";

import { ContactShadows } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { seeded, smooth, span, windowed, type SceneProps } from "../util";
import { useFitCamera } from "../useFitCamera";
import { ChaiCupModel } from "./ChaiCup";
import MomoSteamer from "./MomoSteamer";

/* ------------------------------------------------------------- tortilla --- */

const TORTILLA_LENGTH = 2.6;
const TORTILLA_WIDTH = 3.3;

const SIZE = 1024;

/**
 * A tawa-toasted paratha, painted once onto two canvases: colour (mottled dough,
 * flour specks, brown blisters with charred cores) and a matching bump map so
 * the blisters catch the light.
 */
function useTortillaMaps() {
  return useMemo(() => {
    const make = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = SIZE;
      return [canvas, canvas.getContext("2d")!] as const;
    };
    const [colorCanvas, c] = make();
    const [bumpCanvas, b] = make();
    const rand = seeded(11);

    c.fillStyle = "#e9c98f";
    c.fillRect(0, 0, SIZE, SIZE);
    b.fillStyle = "#808080";
    b.fillRect(0, 0, SIZE, SIZE);

    const blot = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, inner: string, outer: string) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, inner);
      g.addColorStop(1, outer);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * (0.6 + rand() * 0.5), rand() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    };

    // Uneven dough tone.
    for (let i = 0; i < 60; i++) {
      const light = rand() > 0.5;
      blot(c, rand() * SIZE, rand() * SIZE, 60 + rand() * 140, light ? "rgba(250,228,180,0.35)" : "rgba(200,150,80,0.22)", "rgba(0,0,0,0)");
    }
    // Toasted blisters: golden halo, brown body, near-black core; raised in the bump map.
    for (let i = 0; i < 140; i++) {
      const x = rand() * SIZE;
      const y = rand() * SIZE;
      const r = 6 + Math.pow(rand(), 2) * 38;
      blot(c, x, y, r * 1.8, "rgba(196,128,52,0.45)", "rgba(196,128,52,0)");
      blot(c, x, y, r, `rgba(128,66,20,${0.55 + rand() * 0.35})`, "rgba(128,66,20,0)");
      if (rand() > 0.45) blot(c, x, y, r * 0.4, "rgba(52,24,8,0.85)", "rgba(52,24,8,0)");
      blot(b, x, y, r * 1.4, "rgba(255,255,255,0.7)", "rgba(255,255,255,0)");
    }
    // Flour dust and tiny pores.
    for (let i = 0; i < 9000; i++) {
      const x = rand() * SIZE;
      const y = rand() * SIZE;
      const dark = rand() > 0.7;
      c.fillStyle = dark ? `rgba(140,90,40,${rand() * 0.35})` : `rgba(255,248,230,${rand() * 0.45})`;
      c.fillRect(x, y, 1 + rand() * 2, 1 + rand() * 2);
      b.fillStyle = dark ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.2)";
      b.fillRect(x, y, 2, 2);
    }

    const map = new THREE.CanvasTexture(colorCanvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    return { map, bumpMap };
  }, []);
}

/* ------------------------------------------------------- filling shapes --- */

/** Displaces a sphere into an irregular lump; returns smooth, indexed geometry. */
function lumpy(radius: number, detail: number, amount: number, seed: number) {
  let g: THREE.BufferGeometry = new THREE.IcosahedronGeometry(radius, detail);
  g.deleteAttribute("normal");
  g.deleteAttribute("uv");
  g = mergeVertices(g);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n =
      Math.sin(v.x * 23 + seed) * Math.sin(v.y * 19 + seed * 1.7) * Math.sin(v.z * 21 + seed * 2.3) +
      0.5 * Math.sin(v.x * 47 + v.z * 31 + seed);
    v.multiplyScalar(1 + n * amount);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

/** Seared tikka chunk: golden-orange flesh with dark char where the surface bulges. */
function chickenGeometry() {
  const g = lumpy(0.1, 3, 0.22, 4).scale(1.45, 0.8, 1);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const base = new THREE.Color("#d4843a");
  const sear = new THREE.Color("#4a230c");
  const pale = new THREE.Color("#f0c48a");
  const col = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const char = Math.max(0, Math.sin(x * 60) * Math.sin(z * 55 + 1) * Math.sin(y * 40 + 2));
    col.copy(base).lerp(pale, Math.max(0, -y * 6) * 0.5).lerp(sear, Math.min(1, char * 1.6));
    col.toArray(colors, i * 3);
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return g;
}

/** A ruffled lettuce leaf: cupped, frilly at the rim, pale at the rib and deep green at the edge. */
function lettuceGeometry() {
  const g = new THREE.RingGeometry(0.02, 0.5, 72, 10);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const rib = new THREE.Color("#e4f2a6");
  const edge = new THREE.Color("#4e8d1f");
  const col = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i);
    const r = Math.hypot(x, y) / 0.5;
    const a = Math.atan2(y, x);
    const frill = (Math.sin(a * 13) + 0.5 * Math.sin(a * 29 + 1)) * 0.06 * r * r;
    pos.setXYZ(i, x * 1.3, y, frill - r * r * 0.14);
    col.copy(rib).lerp(edge, Math.min(1, r * 1.15 + Math.abs(Math.sin(a * 13)) * 0.15));
    col.toArray(colors, i * 3);
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  g.rotateX(-Math.PI / 2);
  g.computeVertexNormals();
  return g;
}

/** Cut face of a tomato slice: skin ring, flesh, seed-filled gel pockets and septa. */
function tomatoFaceTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const rand = seeded(21);
  ctx.fillStyle = "#b8170f";
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = "#e0402e";
  ctx.beginPath();
  ctx.arc(128, 128, 112, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.4;
    const cx = 128 + Math.cos(a) * 58;
    const cy = 128 + Math.sin(a) * 58;
    ctx.fillStyle = "#f2834a";
    ctx.beginPath();
    ctx.ellipse(cx, cy, 34, 24, a, 0, Math.PI * 2);
    ctx.fill();
    for (let s = 0; s < 9; s++) {
      ctx.fillStyle = "#f7e2a0";
      ctx.beginPath();
      ctx.ellipse(cx + (rand() - 0.5) * 40, cy + (rand() - 0.5) * 28, 4, 2.5, rand() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.fillStyle = "#f06048";
  ctx.beginPath();
  ctx.arc(128, 128, 20, 0, Math.PI * 2);
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
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
  material,
  progress,
}: {
  items: Filling[];
  geometry: THREE.BufferGeometry;
  material: THREE.Material | THREE.Material[];
  progress: () => number;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  // No two pieces of food are quite the same shade.
  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const rand = seeded(items.length * 7 + 1);
    const c = new THREE.Color();
    items.forEach((_, i) => m.setColorAt(i, c.setScalar(0.86 + rand() * 0.22)));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [items]);

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
    <instancedMesh ref={mesh} args={[geometry, material, items.length]} frustumCulled={false} />
  );
}

function WrapAssembly({ progress }: { progress: () => number }) {
  const { map, bumpMap } = useTortillaMaps();
  const sheet = useRef<THREE.Mesh>(null);
  const lastK = useRef(-1);

  const { geometry, base } = useMemo(() => {
    const g = new THREE.PlaneGeometry(TORTILLA_LENGTH, TORTILLA_WIDTH, 48, 40);
    return { geometry: g, base: Float32Array.from(g.attributes.position.array) };
  }, []);

  useLayoutEffect(() => rollSheet(geometry, base, 0), [geometry, base]);

  const sets = useMemo(
    () => ({
      lettuce: makeFillings(13, 3, [0.11, 0.17], [0.85, 0.85, 0.75]),
      tomato: makeFillings(7, 5, [0.2, 0.26], [1, 1, 1]),
      chicken: makeFillings(10, 9, [0.28, 0.36], [1, 1, 1]),
      onion: makeFillings(6, 13, [0.24, 0.3], [1, 1, 1]),
    }),
    [],
  );

  const geos = useMemo(
    () => ({
      lettuce: lettuceGeometry(),
      tomato: new THREE.CylinderGeometry(0.15, 0.14, 0.04, 40),
      chicken: chickenGeometry(),
      onion: new THREE.TorusGeometry(0.12, 0.016, 10, 32, Math.PI * 1.15),
    }),
    [],
  );

  const mats = useMemo(() => {
    const tomatoFace = new THREE.MeshPhysicalMaterial({ map: tomatoFaceTexture(), roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.2 });
    return {
      lettuce: new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.45,
        clearcoat: 0.35,
        clearcoatRoughness: 0.3,
        sheen: 0.4,
        sheenColor: new THREE.Color("#f2ffd0"),
        side: THREE.DoubleSide,
      }),
      // Cylinder groups: skin around the side, the cut face on both caps.
      tomato: [new THREE.MeshPhysicalMaterial({ color: "#c41e12", roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1 }), tomatoFace, tomatoFace],
      chicken: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55 }),
      onion: new THREE.MeshPhysicalMaterial({ color: "#a8417c", roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.2, sheen: 0.5, sheenColor: new THREE.Color("#fff0f8") }),
    };
  }, []);

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
        <meshPhysicalMaterial
          map={map}
          bumpMap={bumpMap}
          bumpScale={2.5}
          roughness={0.78}
          sheen={0.35}
          sheenColor="#fff3dc"
          side={THREE.DoubleSide}
        />
      </mesh>
      <FillingMesh items={sets.lettuce} geometry={geos.lettuce} material={mats.lettuce} progress={progress} />
      <FillingMesh items={sets.tomato} geometry={geos.tomato} material={mats.tomato} progress={progress} />
      <FillingMesh items={sets.chicken} geometry={geos.chicken} material={mats.chicken} progress={progress} />
      <FillingMesh items={sets.onion} geometry={geos.onion} material={mats.onion} progress={progress} />
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
