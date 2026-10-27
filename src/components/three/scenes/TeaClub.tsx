"use client";

import { ContactShadows } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

import { smooth, span, type SceneProps } from "../util";
import { useFitCamera } from "../useFitCamera";
import { ChaiCupModel } from "./ChaiCup";

/**
 * /subscription. Scrolling through the three plans fills the cup, lights the
 * Best Seller rim gold over the Monthly plan, and slides a second cup in for
 * the Double Dose.
 */
export default function TeaClub({ progress, lite }: SceneProps) {
  const rig = useRef<Group>(null);
  const cupA = useRef<Group>(null);
  const cupB = useRef<Group>(null);
  const p = useRef(0);
  useFitCamera(2.6);

  useFrame((state, delta) => {
    p.current += (progress.current - p.current) * (1 - Math.exp(-delta * 4));
    const s = p.current;
    const t = state.clock.elapsedTime;
    const double = smooth(span(s, 0.62, 0.82));

    if (rig.current) {
      rig.current.rotation.y = -0.45 + s * 1.3 + state.pointer.x * 0.3;
      rig.current.rotation.x = state.pointer.y * -0.08;
      rig.current.position.y = -0.75 + Math.sin(t * 1.2) * 0.05;
    }
    if (cupA.current) cupA.current.position.x = -1.05 * double;
    if (cupB.current) {
      cupB.current.position.x = 1.15 + (1 - double) * 3.6;
      cupB.current.rotation.y = (1 - double) * -2.4;
      cupB.current.visible = double > 0.001;
    }
  });

  const fill = () => smooth(span(p.current, 0, 0.3));
  const glow = () => smooth(span(p.current, 0.3, 0.4)) * (1 - smooth(span(p.current, 0.6, 0.7)));
  const fillB = () => smooth(span(p.current, 0.72, 0.95));

  return (
    <>
      <group ref={rig}>
        <group ref={cupA}>
          <ChaiCupModel fill={fill} glow={glow} steamCount={lite ? 50 : 110} />
        </group>
        <group ref={cupB} scale={0.9}>
          <ChaiCupModel fill={fillB} steamCount={lite ? 30 : 80} />
        </group>
      </group>
      {!lite && <ContactShadows position={[0, -0.84, 0]} opacity={0.35} scale={9} blur={2.6} far={3} resolution={256} />}
    </>
  );
}
