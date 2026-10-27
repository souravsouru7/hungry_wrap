"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { BRAND, clamp01, easeOutBack, seeded, smooth } from "../util";
import { Steam } from "./ChaiCup";

/** Woven bamboo: alternating warm bands with fine vertical slats. */
function useBambooTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#d9a560";
    ctx.fillRect(0, 0, 512, 64);
    for (let y = 0; y < 64; y += 16) {
      ctx.fillStyle = y % 32 === 0 ? "rgba(150, 95, 35, 0.28)" : "rgba(255, 230, 180, 0.22)";
      ctx.fillRect(0, y, 512, 8);
    }
    ctx.strokeStyle = "rgba(120, 70, 20, 0.25)";
    ctx.lineWidth = 2;
    for (let x = 0; x < 512; x += 12) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 64);
      ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(3, 1);
    return texture;
  }, []);
}

/** Speckled noise used as a bump map: the kurkura crumb coating. */
function useCrumbTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 256, 256);
    const rand = seeded(29);
    for (let i = 0; i < 2600; i++) {
      const v = Math.floor(rand() * 255);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      const s = 1 + rand() * 4;
      ctx.fillRect(rand() * 256, rand() * 256, s, s);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }, []);
}

const MOMO_HEIGHT = 0.46;

/**
 * One dumpling: a revolved teardrop whose wall is rippled into 14 pleats that
 * deepen and twist toward a pinched knot at the top.
 */
function useMomoGeometry() {
  return useMemo(() => {
    const profile: THREE.Vector2[] = [];
    for (let i = 0; i <= 28; i++) {
      const t = i / 28;
      const y = t * MOMO_HEIGHT;
      // Flat base, round belly, pinched neck, small twisted knot.
      const belly = 0.31 * Math.sin(Math.PI * Math.min(t * 1.08, 1)) ** 0.7;
      const knot = t > 0.84 ? 0.05 * Math.sin(((t - 0.84) / 0.16) * Math.PI) : 0;
      const r = t < 0.06 ? 0.22 + t * 1.2 : belly + knot;
      profile.push(new THREE.Vector2(Math.max(r, 0.002), y));
    }
    const g = new THREE.LatheGeometry(profile, 64);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const h = smooth(Math.min(v.y / MOMO_HEIGHT, 1));
      const angle = Math.atan2(v.z, v.x) + h * 1.1; // the twist
      const pleat = 1 + 0.12 * h * h * Math.sin(angle * 14);
      const radius = Math.hypot(v.x, v.z) * pleat;
      pos.setXYZ(i, Math.cos(angle) * radius, v.y, Math.sin(angle) * radius);
    }
    g.computeVertexNormals();
    return g;
  }, []);
}

const STEAMED = new THREE.Color("#f7f0e3");
const FRIED = new THREE.Color("#d98a32");
const KURKURA = new THREE.Color("#b8501a");
const tint = new THREE.Color();

type Spot = { x: number; y: number; z: number; ry: number; tilt: number; s: number };

const BASKET_WALL = 0.32;
const SCHEZWAN = new THREE.Vector3(0.78, 0.2, 1.7);
// Reused every frame by the dunking momo, so the loop allocates nothing.
const home = new THREE.Vector3();
const above = new THREE.Vector3(SCHEZWAN.x, 1.25, SCHEZWAN.z);
const dunked = new THREE.Vector3(SCHEZWAN.x, SCHEZWAN.y - 0.05, SCHEZWAN.z);
const path = new THREE.Vector3();

export type MomoSteamerProps = {
  /** 0 → 1 as the momo section arrives: momos drop into the basket, staggered. */
  arrive: () => number;
  /** 0 → lid on, 1 → lid lifted and steam pouring out. */
  open: () => number;
  /** 0 → 1 through Fried Momos: golden-brown. */
  fried: () => number;
  /** 0 → 1 through Kurkura Momos: deep orange with a crumb coating. */
  crunch: () => number;
  /** 0 → 1 through Momo Dips: bowls slide in and a momo dunks on a loop. */
  dip: () => number;
  lite: boolean;
};

/**
 * Momos piled high in a shallow bamboo steamer. They drop in as the momo
 * section arrives, turn golden for Fried, crumb-coated for Kurkura, and one
 * takes a dunk in schezwan for the Dips.
 */
export default function MomoSteamer({ arrive, open, fried, crunch, dip, lite }: MomoSteamerProps) {
  const bamboo = useBambooTexture();
  const crumbs = useCrumbTexture();
  const momoGeo = useMomoGeometry();
  const lid = useRef<THREE.Group>(null);
  const bowls = useRef<THREE.Group>(null);
  const nodes = useRef<(THREE.Group | null)[]>([]);
  const materials = useRef<(THREE.MeshPhysicalMaterial | null)[]>([]);

  // A mound: centre + ring of six on the bed, three more stacked on top.
  const spots = useMemo<Spot[]>(() => {
    const rand = seeded(91);
    const ring = Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2 + 0.3;
      return { x: Math.cos(a) * 0.68, y: 0.06, z: Math.sin(a) * 0.68, ry: rand() * Math.PI, tilt: 0.12, s: 1.12 };
    });
    const top = Array.from({ length: 3 }, (_, i) => {
      const a = (i / 3) * Math.PI * 2 + 0.9;
      return { x: Math.cos(a) * 0.3, y: 0.34, z: Math.sin(a) * 0.3, ry: rand() * Math.PI, tilt: 0.28, s: 1.08 };
    });
    return [{ x: 0, y: 0.06, z: 0, ry: 0.4, tilt: 0, s: 1.18 }, ...ring, ...top];
  }, []);

  // The momo that goes for the dunk: front-most on the top layer.
  const dunker = spots.length - 1;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const a = arrive();
    const o = open();
    const f = fried();
    const k = crunch();
    const d = dip();

    if (lid.current) {
      lid.current.position.set(0.95 * o, BASKET_WALL + o * 1.35 + Math.sin(t * 1.6) * 0.03 * o, -0.7 * o);
      lid.current.rotation.set(-0.3 * o, 0, -0.6 * o);
    }
    if (bowls.current) {
      bowls.current.position.z = (1 - smooth(d)) * 2.2;
      bowls.current.visible = d > 0.01;
      bowls.current.scale.setScalar(Math.max(smooth(d), 0.001));
    }

    // Colour story: steamed → golden fried → deep kurkura.
    tint.copy(STEAMED).lerp(FRIED, f).lerp(KURKURA, k);
    const shimmer = Math.sin(clamp01(f) * Math.PI) * 0.45 * (1 - k);
    materials.current.forEach((m) => {
      if (!m) return;
      m.color.copy(tint);
      m.roughness = 0.42 - f * 0.08 + k * 0.4;
      m.bumpScale = k * 3;
      m.emissiveIntensity = shimmer;
    });

    spots.forEach((spot, i) => {
      const node = nodes.current[i];
      if (!node) return;
      // Staggered drop with an overshoot bounce.
      const local = clamp01((a - i * 0.055) / 0.4);
      const landed = easeOutBack(local);
      node.visible = local > 0;
      node.position.set(spot.x, spot.y + (1 - landed) * 2.8, spot.z);
      node.rotation.set(spot.tilt * Math.sin(spot.ry), spot.ry + (1 - local) * 2, spot.tilt * Math.cos(spot.ry));
      node.scale.setScalar(spot.s * Math.max(Math.min(local * 3, 1), 0.001));

      if (i === dunker && d > 0.01) {
        // Lift out → hop over to the schezwan → dunk → back, on a loop.
        const loop = (t * 0.42) % 1;
        home.set(spot.x, spot.y, spot.z);
        const p = path;
        if (loop < 0.3) {
          const u = smooth(loop / 0.3);
          p.lerpVectors(home, above, u);
          p.y += Math.sin(u * Math.PI) * 0.6;
        } else if (loop < 0.45) p.lerpVectors(above, dunked, smooth((loop - 0.3) / 0.15));
        else if (loop < 0.55) p.copy(dunked);
        else if (loop < 0.7) p.lerpVectors(dunked, above, smooth((loop - 0.55) / 0.15));
        else {
          const u = smooth((loop - 0.7) / 0.3);
          p.lerpVectors(above, home, u);
          p.y += Math.sin(u * Math.PI) * 0.6;
        }
        node.position.lerp(p, smooth(d));
        node.rotation.z += Math.sin(loop * Math.PI * 2) * 0.4 * d;
      }
    });
  });

  return (
    <group>
      {/* Shallow steamer basket */}
      <mesh position-y={BASKET_WALL / 2}>
        <cylinderGeometry args={[1.12, 1.06, BASKET_WALL, 56, 1, true]} />
        <meshStandardMaterial map={bamboo} roughness={0.75} side={THREE.DoubleSide} />
      </mesh>
      {[0.02, BASKET_WALL].map((y) => (
        <mesh key={y} position-y={y} rotation-x={Math.PI / 2}>
          <torusGeometry args={[y < 0.1 ? 1.07 : 1.13, 0.05, 10, 64]} />
          <meshStandardMaterial color="#b98140" roughness={0.7} />
        </mesh>
      ))}
      <mesh position-y={0.05} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[1.06, 56]} />
        <meshStandardMaterial color="#efe3c8" roughness={0.9} />
      </mesh>

      {spots.map((_, i) => (
        <group
          key={i}
          ref={(g) => {
            nodes.current[i] = g;
          }}
          visible={false}
        >
          <mesh geometry={momoGeo}>
            <meshPhysicalMaterial
              ref={(m) => {
                materials.current[i] = m;
              }}
              color={STEAMED}
              roughness={0.42}
              clearcoat={0.35}
              clearcoatRoughness={0.4}
              sheen={0.6}
              sheenColor="#ffffff"
              bumpMap={crumbs}
              bumpScale={0}
              emissive="#ff9a3c"
              emissiveIntensity={0}
            />
          </mesh>
        </group>
      ))}

      {/* Steam: heavy for steamed momos, thinning once they're fried */}
      <group position-y={BASKET_WALL + 0.2} scale={[2.3, 1, 2.3]}>
        <Steam count={lite ? 50 : 130} density={() => open() * (1 - fried() * 0.7)} radius={0.36} />
      </group>

      {/* Lid */}
      <group ref={lid} position-y={BASKET_WALL}>
        <mesh scale={[1, 0.42, 1]}>
          <sphereGeometry args={[1.16, 48, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial map={bamboo} roughness={0.75} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation-x={Math.PI / 2}>
          <torusGeometry args={[1.15, 0.05, 10, 64]} />
          <meshStandardMaterial color="#b98140" roughness={0.7} />
        </mesh>
        <mesh position-y={0.5}>
          <cylinderGeometry args={[0.14, 0.18, 0.12, 24]} />
          <meshStandardMaterial color="#b98140" roughness={0.7} />
        </mesh>
      </group>

      {/* Dips: mayonnaise and schezwan, sliding in for the Momo Dips section */}
      <group ref={bowls} visible={false}>
        {[
          { x: -SCHEZWAN.x, color: "#fbf6ea" },
          { x: SCHEZWAN.x, color: BRAND.red },
        ].map((b) => (
          <group key={b.x} position={[b.x, 0, SCHEZWAN.z]}>
            <mesh position-y={0.14}>
              <cylinderGeometry args={[0.4, 0.27, 0.28, 40, 1, true]} />
              <meshPhysicalMaterial color="#ffffff" roughness={0.25} clearcoat={1} side={THREE.DoubleSide} />
            </mesh>
            <mesh position-y={0.01} rotation-x={-Math.PI / 2}>
              <circleGeometry args={[0.27, 40]} />
              <meshPhysicalMaterial color="#ffffff" roughness={0.25} clearcoat={1} />
            </mesh>
            <mesh position-y={0.22} rotation-x={-Math.PI / 2}>
              <circleGeometry args={[0.37, 40]} />
              <meshPhysicalMaterial color={b.color} roughness={0.2} clearcoat={0.8} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
