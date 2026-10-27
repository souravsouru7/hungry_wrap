import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

/**
 * Keeps a scene framed in any container shape.
 *
 * Each scene declares the world-space radius it needs. The camera is pushed
 * back far enough that a sphere of that radius fits both the vertical and the
 * horizontal field of view, so the same model reads correctly in a wide
 * desktop panel, a short mobile band and a tall narrow column alike.
 *
 * The scene's authored camera position sets the viewing *angle*; this only
 * changes the distance along that direction.
 */
export function useFitCamera(radius: number, { lift = 0, lerp = 6 } = {}) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const current = useRef(0);

  useFrame((_, delta) => {
    if (!("fov" in camera)) return;
    const aspect = Math.max(size.width / Math.max(size.height, 1), 0.0001);
    const vFov = (camera.fov * Math.PI) / 180;
    const fitHeight = radius / Math.tan(vFov / 2);
    // Horizontal fov narrows as the container gets taller than it is wide.
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const fitWidth = radius / Math.tan(hFov / 2);
    const target = Math.max(fitHeight, fitWidth) + lift;

    // Ease so an orientation change glides instead of snapping.
    current.current = current.current
      ? current.current + (target - current.current) * (1 - Math.exp(-delta * lerp))
      : target;

    const length = camera.position.length() || 1;
    camera.position.multiplyScalar(current.current / length);
    camera.updateProjectionMatrix();
  });
}
