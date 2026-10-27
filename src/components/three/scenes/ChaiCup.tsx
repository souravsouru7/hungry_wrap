"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { BRAND, seeded } from "../util";

// Cup profile, revolved around Y. Outer wall up to the rim, then back down the
// inside so the cup has real thickness and a visible interior.
const CUP_PROFILE = [
  [0.001, 0],
  [0.5, 0],
  [0.56, 0.04],
  [0.6, 0.15],
  [0.8, 1.25],
  [0.82, 1.3],
  [0.78, 1.32],
  [0.75, 1.27],
  [0.56, 0.16],
  [0.001, 0.14],
].map(([x, y]) => new THREE.Vector2(x, y));

const SAUCER_PROFILE = [
  [0.001, 0],
  [1.1, 0.02],
  [1.25, 0.1],
  [1.28, 0.13],
  [1.2, 0.12],
  [0.001, 0.05],
].map(([x, y]) => new THREE.Vector2(x, y));

const INNER_BOTTOM = 0.16;
const INNER_TOP = 1.27;
const MIN_LEVEL = 0.18;
const MAX_LEVEL = 1.16;

/** Inner wall radius at height `y`, so the tea surface always meets the glaze. */
const innerRadius = (y: number) => 0.56 + ((y - INNER_BOTTOM) / (INNER_TOP - INNER_BOTTOM)) * (0.75 - 0.56);

const steamVertex = /* glsl */ `
  uniform float uTime;
  uniform float uDensity;
  uniform float uSize;
  attribute float aSeed;
  attribute float aSpeed;
  varying float vAlpha;
  void main() {
    float life = fract(uTime * aSpeed + aSeed * 7.31);
    vec3 p = position;
    p.y = life * 1.7;
    p.x += sin(life * 6.0 + aSeed * 40.0) * 0.2 * life;
    p.z += cos(life * 5.0 + aSeed * 25.0) * 0.14 * life;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.6 + life * 1.9) * (300.0 / -mv.z);
    float on = step(aSeed, uDensity);
    vAlpha = on * smoothstep(0.0, 0.15, life) * (1.0 - smoothstep(0.5, 1.0, life)) * 0.32;
  }
`;

const steamFragment = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(1.0, 0.985, 0.96, vAlpha * smoothstep(0.5, 0.0, d));
  }
`;

/** Rising steam particles. `radius` is the footprint they rise from. */
export function Steam({ count, density, radius = 0.38 }: { count: number; density: () => number; radius?: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const rand = seeded(7);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * radius;
      positions.set([Math.cos(a) * r, 0, Math.sin(a) * r], i * 3);
      seeds[i] = rand();
      speeds[i] = 0.18 + rand() * 0.22;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    return g;
  }, [count, radius]);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uDensity: { value: 0 }, uSize: { value: 0.9 } }),
    [],
  );

  useFrame((state) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = state.clock.elapsedTime;
    material.current.uniforms.uDensity.value = density();
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={steamVertex}
        fragmentShader={steamFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

type ChaiCupModelProps = {
  /** 0 → empty, 1 → brimming. Read every frame. */
  fill: () => number;
  /** 0 → plain rim, 1 → glowing gold "Best Seller" rim. */
  glow?: () => number;
  steamCount?: number;
};

/** A glazed chai cup on a saucer, with a live tea level and rising steam. */
export function ChaiCupModel({ fill, glow = () => 0, steamCount = 140 }: ChaiCupModelProps) {
  const surface = useRef<THREE.Mesh>(null);
  const steam = useRef<THREE.Group>(null);
  const rim = useRef<THREE.MeshStandardMaterial>(null);

  const cupGeometry = useMemo(() => new THREE.LatheGeometry(CUP_PROFILE, 72), []);
  const saucerGeometry = useMemo(() => new THREE.LatheGeometry(SAUCER_PROFILE, 72), []);
  const gold = useMemo(() => new THREE.Color(BRAND.gold), []);
  const plain = useMemo(() => new THREE.Color(BRAND.orange), []);

  useFrame(() => {
    const f = fill();
    const level = MIN_LEVEL + f * (MAX_LEVEL - MIN_LEVEL);
    if (surface.current) {
      surface.current.visible = f > 0.01;
      surface.current.position.y = level;
      const r = innerRadius(level);
      surface.current.scale.set(r, r, 1);
    }
    if (steam.current) steam.current.position.y = level;
    if (rim.current) {
      const g = glow();
      rim.current.color.copy(plain).lerp(gold, g);
      rim.current.emissive.copy(gold);
      rim.current.emissiveIntensity = g * 1.6;
    }
  });

  return (
    <group>
      <mesh geometry={saucerGeometry} position-y={-0.06}>
        <meshPhysicalMaterial color="#fff4e6" roughness={0.3} clearcoat={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={cupGeometry}>
        <meshPhysicalMaterial color="#fff4e6" roughness={0.22} clearcoat={1} clearcoatRoughness={0.15} side={THREE.DoubleSide} />
      </mesh>
      {/* Orange glaze band */}
      <mesh position-y={0.95} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.748, 0.035, 12, 72]} />
        <meshPhysicalMaterial color={BRAND.orange} roughness={0.3} clearcoat={1} />
      </mesh>
      {/* Rim: glows gold for the Best Seller plan */}
      <mesh position-y={1.31} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.8, 0.028, 12, 72]} />
        <meshStandardMaterial ref={rim} color={BRAND.orange} roughness={0.25} metalness={0.4} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.72, 0.72, 0]} rotation-z={-Math.PI / 2}>
        <torusGeometry args={[0.27, 0.065, 16, 40, Math.PI]} />
        <meshPhysicalMaterial color="#fff4e6" roughness={0.22} clearcoat={1} />
      </mesh>
      <mesh ref={surface} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[1, 64]} />
        <meshPhysicalMaterial color="#c4823f" roughness={0.12} clearcoat={0.9} />
      </mesh>
      <group ref={steam}>
        <Steam count={steamCount} density={() => 0.25 + fill() * 0.75} />
      </group>
    </group>
  );
}
