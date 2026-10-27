"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { useState } from "react";
import type { ReactNode } from "react";

type StageProps = {
  active: boolean;
  camera: { position: [number, number, number]; fov?: number };
  /** Phones and weaker GPUs: lower resolution cap and no image-based lighting. */
  lite: boolean;
  children: ReactNode;
};

/**
 * The R3F canvas every scene renders into. Lighting is built from local
 * Lightformers rather than a downloaded HDR, so nothing is fetched at runtime.
 * Pointer events are read from the whole document, so scenes that sit behind
 * page copy still react to the cursor.
 */
export default function Stage({ active, camera, lite, children }: StageProps) {
  const ceiling = lite ? 1.25 : 1.5;
  // Starts sharp, then trades resolution for frame rate on slower GPUs.
  const [dpr, setDpr] = useState(ceiling);
  const [ready, setReady] = useState(false);

  return (
    <Canvas
      dpr={[1, dpr]}
      frameloop={active ? "always" : "never"}
      camera={{ position: camera.position, fov: camera.fov ?? 40, near: 0.1, far: 80 }}
      gl={{ antialias: !lite, alpha: true, powerPreference: "high-performance" }}
      eventSource={document.documentElement}
      eventPrefix="client"
      // Shaders compile on the first frame; fading in hides that hitch instead of popping.
      onCreated={() => requestAnimationFrame(() => setReady(true))}
      style={{ pointerEvents: "none", opacity: ready ? 1 : 0, transition: "opacity 700ms ease" }}
    >
      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
        onIncline={() => setDpr((d) => Math.min(ceiling, d + 0.25))}
        flipflops={3}
        onFallback={() => setDpr(1)}
      />
      <ambientLight intensity={lite ? 0.85 : 0.55} />
      <directionalLight position={[4, 7, 5]} intensity={1.7} color="#fff1e0" />
      <directionalLight position={[-5, 3, -2]} intensity={0.6} color="#ffd2a6" />
      {lite ? (
        // An Environment builds a cube render target, which mobile GPUs pay for
        // every mount. Two cheap fills stand in for the lightformer rig.
        <>
          <directionalLight position={[0, 4, 6]} intensity={0.9} color="#ffe2c2" />
          <pointLight position={[3, 1, 3]} intensity={12} distance={14} color="#ffb15c" />
        </>
      ) : (
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={2.2} color="#ffe2c2" position={[0, 5, -6]} scale={[12, 4, 1]} />
          <Lightformer form="rect" intensity={1.4} color="#ffffff" position={[-6, 2, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
          <Lightformer form="circle" intensity={1.2} color="#ffb15c" position={[6, 1, 3]} rotation-y={-Math.PI / 2} scale={3} />
        </Environment>
      )}
      {children}
    </Canvas>
  );
}
