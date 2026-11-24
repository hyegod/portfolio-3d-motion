"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import type { Studio3DScrollState } from "@/context/ShowreelContext";

export const PORTAL_CUT_P = 0.44;
export const TWIN_START_P = 0.24;

interface SceneRigAndFXProps {
  rawScrollRef: React.MutableRefObject<Studio3DScrollState>;
  twinScrollRef: React.MutableRefObject<Studio3DScrollState>;
  roomGroupRef: React.RefObject<THREE.Group | null>;
  twinGroupRef: React.RefObject<THREE.Group | null>;
  crtShaderMatRef: React.RefObject<THREE.ShaderMaterial | null>;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

interface CameraKeyframe {
  p: number;
  pos: [number, number, number];
  lookAt: [number, number, number];
  roll: number;
  fov: number;
}

/**
 * PHASE 1: CREATIVE 6-WAYPOINT EVENLY-SPACED (0.0, 0.2, 0.4, 0.6, 0.8, 1.0) CINEMA ONE-TAKE!
 * - p = 0.00: Sunlit Window Blinds & Potted Cactus left-corner reveal gazing at the Live-3D CRT!
 * - p = 0.20: Sweeping wide Golden-Hour crane arc across the sunlit room!
 * - p = 0.40: Dramatic low macro desk-skim framing Steaming Mug, Mouse & Typing Keycaps + Live CRT behind!
 * - p = 0.60: Counter-banked left keyboard sweep past the coral ESC keycap!
 * - p = 0.80: Center lock-on aligned directly with the CRT screen normal!
 * - p = 1.00: Seamless Zero-Cut Portal Crossing straight through the CRT glass!
 */
const RETRO_ROOM_KEYFRAMES: CameraKeyframe[] = [
  { p: 0.0, pos: [-0.48, 0.72, 1.88], lookAt: [-0.26, 0.56, -0.06], roll: -0.045, fov: 46 },
  { p: 0.2, pos: [0.92, 0.86, 2.22], lookAt: [-0.2, 0.56, -0.06], roll: 0.05, fov: 44 },
  { p: 0.4, pos: [0.76, 0.33, 1.24], lookAt: [0.02, 0.35, 0.06], roll: 0.08, fov: 48 },
  { p: 0.6, pos: [-0.48, 0.31, 1.15], lookAt: [0.04, 0.38, 0.06], roll: -0.065, fov: 46 },
  { p: 0.8, pos: [0.05, 0.57, 0.58], lookAt: [0.05, 0.57, 0.04], roll: 0.0, fov: 45 },
  { p: 1.0, pos: [0.05, 0.57, 0.21], lookAt: [0.05, 0.57, -0.2], roll: 0.0, fov: 45 },
];

/**
 * PHASE 2: INSIDE THE COMPUTER (twinP = TWIN_START_P 0.24 -> 1.00)
 * Entry keyframe at p = 0.24 matches the exact live portalCam inside the CRT screen!
 */
const TWIN_KEYFRAMES: CameraKeyframe[] = [
  { p: 0.24, pos: [-2.55, 1.56, 4.95], lookAt: [0.0, 0.84, 0.0], roll: 0.0, fov: 45 },
  { p: 0.4, pos: [-2.15, 1.18, 2.95], lookAt: [0.3, 0.86, 0.0], roll: 0.11, fov: 47 },
  { p: 0.54, pos: [1.85, 1.62, 3.45], lookAt: [0.0, 0.88, 0.0], roll: -0.09, fov: 44 },
  { p: 0.66, pos: [0.0, 1.22, 4.65], lookAt: [0.0, 0.96, 0.0], roll: 0.0, fov: 46 },
  { p: 0.8, pos: [-0.24, 1.07, 4.15], lookAt: [0.0, 1.07, 0.84], roll: 0.02, fov: 38 },
  { p: 1.0, pos: [0.0, 1.07, 4.48], lookAt: [0.0, 1.07, 0.84], roll: 0.0, fov: 36 },
];

function evalScalarKeyframes(list: CameraKeyframe[], p: number) {
  let a = list[0];
  let b = list[list.length - 1];
  for (let i = 0; i < list.length - 1; i++) {
    if (p >= list[i].p && p <= list[i + 1].p) {
      a = list[i];
      b = list[i + 1];
      break;
    }
  }
  const segT = smoothstep(a.p, b.p, p);
  return {
    px: THREE.MathUtils.lerp(a.pos[0], b.pos[0], segT),
    py: THREE.MathUtils.lerp(a.pos[1], b.pos[1], segT),
    pz: THREE.MathUtils.lerp(a.pos[2], b.pos[2], segT),
    lx: THREE.MathUtils.lerp(a.lookAt[0], b.lookAt[0], segT),
    ly: THREE.MathUtils.lerp(a.lookAt[1], b.lookAt[1], segT),
    lz: THREE.MathUtils.lerp(a.lookAt[2], b.lookAt[2], segT),
    roll: THREE.MathUtils.lerp(a.roll, b.roll, segT),
    fov: THREE.MathUtils.lerp(a.fov, b.fov, segT),
  };
}

export function SceneRigAndFX({
  rawScrollRef,
  twinScrollRef,
  roomGroupRef,
  twinGroupRef,
  crtShaderMatRef,
}: SceneRigAndFXProps) {
  const { camera, gl, scene, size } = useThree();

  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetLook = useMemo(() => new THREE.Vector3(), []);
  const smoothLook = useMemo(() => new THREE.Vector3(-0.26, 0.56, -0.06), []);
  const drawBufSize = useMemo(() => new THREE.Vector2(1440, 900), []);
  const splinePosTmp = useMemo(() => new THREE.Vector3(), []);
  const splineLookTmp = useMemo(() => new THREE.Vector3(), []);

  // Evenly-spaced 6-point Catmull-Rom 3D Splines (getPoint(u) matches p = 0, 0.2, 0.4, 0.6, 0.8, 1.0 exactly!)
  const { roomPosSpline, roomLookSpline } = useMemo(
    () => ({
      roomPosSpline: new THREE.CatmullRomCurve3(
        RETRO_ROOM_KEYFRAMES.map((k) => new THREE.Vector3(...k.pos)),
        false,
        "catmullrom",
        0.32
      ),
      roomLookSpline: new THREE.CatmullRomCurve3(
        RETRO_ROOM_KEYFRAMES.map((k) => new THREE.Vector3(...k.lookAt)),
        false,
        "catmullrom",
        0.32
      ),
    }),
    []
  );

  // Offscreen Portal Camera & High-DPI RenderTarget for the CRT Monitor Screen!
  const portalCam = useMemo(
    () => new THREE.PerspectiveCamera(45, 1.6, 0.1, 45),
    []
  );
  const crtFbo = useMemo(() => {
    const supportsHalfFloat =
      gl.capabilities.isWebGL2 &&
      Boolean(gl.extensions.get("EXT_color_buffer_float"));
    return new THREE.WebGLRenderTarget(1280, 800, {
      type: supportsHalfFloat ? THREE.HalfFloatType : THREE.UnsignedByteType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: true,
      samples: 4,
    });
  }, [gl]);

  useEffect(() => {
    const dpr = gl.getPixelRatio();
    const w = Math.max(2, Math.min(1920, Math.round(size.width * dpr)));
    const aspect = size.width / Math.max(1, size.height);
    const h = Math.max(2, Math.round(w / aspect));
    crtFbo.setSize(w, h);
  }, [crtFbo, gl, size.height, size.width]);

  useEffect(() => {
    return () => {
      crtFbo.dispose();
    };
  }, [crtFbo]);

  const roomBgColor = useMemo(() => new THREE.Color("#8B6E52"), []);
  const studioColor = useMemo(() => new THREE.Color("#07111E"), []);
  const skyColor = useMemo(() => new THREE.Color("#1E6FD9"), []);
  const currentBg = useMemo(() => new THREE.Color("#8B6E52"), []);

  const smoothRollRef = useRef(-0.045);
  const smoothFovRef = useRef(46);
  const lastInRoomRef = useRef<boolean | null>(null);

  const roomLightsRef = useRef<THREE.Group>(null);
  const twinLightsRef = useRef<THREE.Group>(null);
  const shadowGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const dt = Math.min(0.05, delta);
    const { progress: rawP, mouseX, mouseY } = rawScrollRef.current;

    const inRetroRoom = rawP < PORTAL_CUT_P;
    const twinP = inRetroRoom
      ? TWIN_START_P
      : TWIN_START_P +
        clamp01((rawP - PORTAL_CUT_P) / (1 - PORTAL_CUT_P)) *
          (1 - TWIN_START_P);

    twinScrollRef.current.progress = twinP;
    twinScrollRef.current.mouseX = mouseX;
    twinScrollRef.current.mouseY = mouseY;

    const aspect = size.width / Math.max(1, size.height);
    const portraitFactor = clamp01((1.28 - aspect) / 0.82);
    const zTwinBoost = portraitFactor * 3.55;
    const fovTwinBoost = portraitFactor * 11;

    if (inRetroRoom) {
      const roomP = clamp01(rawP / PORTAL_CUT_P);
      const portalBlend = smoothstep(0.68, 0.96, roomP);

      // 1. Position portalCam at the exact opening pose of Babak 2 (TWIN_START_P = 0.24)
      const twinStartKf = TWIN_KEYFRAMES[0];
      const twinParallax = 1 - portraitFactor * 0.65;
      portalCam.aspect = aspect;
      portalCam.fov = twinStartKf.fov + fovTwinBoost;
      portalCam.position.set(
        twinStartKf.pos[0] + mouseX * 0.24 * twinParallax,
        twinStartKf.pos[1] + mouseY * 0.14 * twinParallax,
        twinStartKf.pos[2] + zTwinBoost
      );
      portalCam.up.set(0, 1, 0);
      portalCam.lookAt(
        twinStartKf.lookAt[0],
        twinStartKf.lookAt[1],
        twinStartKf.lookAt[2]
      );
      portalCam.updateProjectionMatrix();

      // 2. Render LIVE Babak 2 3D Digital Twin into crtFbo for the CRT Monitor Screen!
      if (roomGroupRef.current) roomGroupRef.current.visible = false;
      if (twinGroupRef.current) twinGroupRef.current.visible = true;
      if (roomLightsRef.current) roomLightsRef.current.visible = false;
      if (twinLightsRef.current) twinLightsRef.current.visible = true;
      if (shadowGroupRef.current) shadowGroupRef.current.visible = true;
      scene.background = studioColor;

      const prevTarget = gl.getRenderTarget();
      gl.setRenderTarget(crtFbo);
      gl.clear(true, true, false);
      gl.render(scene, portalCam);
      gl.setRenderTarget(prevTarget);

      // Mutate the LIVE compiled ShaderMaterial uniforms directly!
      gl.getDrawingBufferSize(drawBufSize);
      const mat = crtShaderMatRef.current;
      if (mat) {
        mat.uniforms.uFboTex.value = crtFbo.texture;
        (mat.uniforms.uResolution.value as THREE.Vector2).copy(drawBufSize);
        mat.uniforms.uCanvasAspect.value = aspect;
        mat.uniforms.uPortalBlend.value = portalBlend;
      }

      // 3. Restore Cozy Golden-Hour Retro Room for the main screen render!
      if (twinGroupRef.current) twinGroupRef.current.visible = false;
      if (roomGroupRef.current) roomGroupRef.current.visible = true;
      if (twinLightsRef.current) twinLightsRef.current.visible = false;
      if (roomLightsRef.current) roomLightsRef.current.visible = true;
      if (shadowGroupRef.current) shadowGroupRef.current.visible = false;
      scene.background = roomBgColor;

      // 4. Evaluate Creative 6-Waypoint Room Camera Spline!
      roomPosSpline.getPoint(roomP, splinePosTmp);
      roomLookSpline.getPoint(roomP, splineLookTmp);
      const scalarKf = evalScalarKeyframes(RETRO_ROOM_KEYFRAMES, roomP);

      const diveTaper = 1 - smoothstep(0.6, 0.86, roomP);
      const zRoomBoost = portraitFactor * 0.95 * diveTaper;
      const fovRoomBoost = THREE.MathUtils.lerp(
        fovTwinBoost,
        portraitFactor * 6,
        diveTaper
      );
      const mParallax = diveTaper * (1 - portraitFactor * 0.5);

      targetPos.set(
        splinePosTmp.x + mouseX * 0.14 * mParallax,
        splinePosTmp.y + mouseY * 0.08 * mParallax,
        splinePosTmp.z + zRoomBoost
      );
      targetLook.copy(splineLookTmp);

      const targetRoll = scalarKf.roll;
      const targetFov = scalarKf.fov + fovRoomBoost;

      if (lastInRoomRef.current !== true) {
        lastInRoomRef.current = true;
        camera.position.copy(targetPos);
        smoothLook.copy(targetLook);
        smoothRollRef.current = targetRoll;
        smoothFovRef.current = targetFov;
      } else {
        const lambda = THREE.MathUtils.lerp(8.5, 22.0, portalBlend);
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPos.x, lambda, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPos.y, lambda, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.z, lambda, dt);

        smoothLook.x = THREE.MathUtils.damp(smoothLook.x, targetLook.x, lambda, dt);
        smoothLook.y = THREE.MathUtils.damp(smoothLook.y, targetLook.y, lambda, dt);
        smoothLook.z = THREE.MathUtils.damp(smoothLook.z, targetLook.z, lambda, dt);
        smoothRollRef.current = THREE.MathUtils.damp(smoothRollRef.current, targetRoll, lambda, dt);
        smoothFovRef.current = THREE.MathUtils.damp(smoothFovRef.current, targetFov, lambda, dt);
      }
    } else {
      // PHASE 2: Direct Rendering Inside the Computer (Zero FBO overhead, 100% seamless continuation!)
      if (roomGroupRef.current) roomGroupRef.current.visible = false;
      if (twinGroupRef.current) twinGroupRef.current.visible = true;
      if (roomLightsRef.current) roomLightsRef.current.visible = false;
      if (twinLightsRef.current) twinLightsRef.current.visible = true;
      if (shadowGroupRef.current) {
        shadowGroupRef.current.visible = twinP < 0.54;
      }

      const kf = evalScalarKeyframes(TWIN_KEYFRAMES, twinP);
      const parallaxFactor =
        (1 - smoothstep(0.72, 0.84, twinP)) * (1 - portraitFactor * 0.65);

      targetPos.set(
        kf.px + mouseX * 0.24 * parallaxFactor,
        kf.py + mouseY * 0.14 * parallaxFactor,
        kf.pz + zTwinBoost
      );
      targetLook.set(kf.lx, kf.ly, kf.lz);

      const targetRoll = kf.roll;
      const targetFov = kf.fov + fovTwinBoost;

      if (lastInRoomRef.current !== false) {
        lastInRoomRef.current = false;
        camera.position.copy(targetPos);
        smoothLook.copy(targetLook);
        smoothRollRef.current = targetRoll;
        smoothFovRef.current = targetFov;
      } else {
        const lambda = 8.5;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPos.x, lambda, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPos.y, lambda, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.z, lambda, dt);

        smoothLook.x = THREE.MathUtils.damp(smoothLook.x, targetLook.x, lambda, dt);
        smoothLook.y = THREE.MathUtils.damp(smoothLook.y, targetLook.y, lambda, dt);
        smoothLook.z = THREE.MathUtils.damp(smoothLook.z, targetLook.z, lambda, dt);
        smoothRollRef.current = THREE.MathUtils.damp(smoothRollRef.current, targetRoll, lambda, dt);
        smoothFovRef.current = THREE.MathUtils.damp(smoothFovRef.current, targetFov, lambda, dt);
      }

      const skyMix = smoothstep(0.54, 0.69, twinP);
      currentBg.copy(studioColor).lerp(skyColor, skyMix);
      scene.background = currentBg;
    }

    camera.up.set(0, 1, 0);
    camera.lookAt(smoothLook);
    camera.rotateZ(smoothRollRef.current);

    if (camera instanceof THREE.PerspectiveCamera) {
      if (Math.abs(camera.fov - smoothFovRef.current) > 0.02) {
        camera.fov = smoothFovRef.current;
        camera.updateProjectionMatrix();
      }
    }
  });

  return (
    <>
      <group ref={roomLightsRef}>
        <ambientLight intensity={0.72} color="#FFEBD0" />
        <hemisphereLight args={["#FFF1D6", "#5C4028", 0.85]} />
        <directionalLight
          position={[-3.6, 2.8, 2.2]}
          intensity={3.1}
          color="#FFD188"
        />
        <pointLight
          position={[0.05, 0.55, 0.35]}
          intensity={0.75}
          distance={1.6}
          color="#38BDF8"
        />
      </group>

      <group ref={twinLightsRef} visible={false}>
        <ambientLight intensity={0.72} color="#E0F2FE" />
        <hemisphereLight args={["#BAE6FD", "#0F172A", 0.9]} />
        <directionalLight position={[5.5, 7.5, 4.5]} intensity={2.5} color="#FFF7E6" />
        <directionalLight position={[-5.5, 3.5, 2.5]} intensity={1.25} color="#38BDF8" />

        <Sparkles
          count={56}
          scale={[7.8, 4.4, 5.5]}
          position={[0, 1.35, 0.2]}
          size={2.4}
          speed={0.38}
          opacity={0.6}
          color="#E0F2FE"
        />
      </group>

      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.8}
          color="#FFFBEB"
          scale={[8, 4, 1]}
          position={[4, 5, 4]}
          target={[0, 0.8, 0]}
        />
        <Lightformer
          form="ring"
          intensity={2.0}
          color="#38BDF8"
          scale={6}
          position={[-5, 3, 2]}
          target={[0, 0.8, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          color="#FDE68A"
          scale={[6, 2, 1]}
          position={[0, -3, 3]}
          target={[0, 0.8, 0]}
        />
      </Environment>

      <group ref={shadowGroupRef} visible={false}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.236, 0]}>
          <circleGeometry args={[3.4, 48]} />
          <meshBasicMaterial
            color="#02060D"
            transparent
            opacity={0.46}
            depthWrite={false}
          />
        </mesh>
      </group>
    </>
  );
}
