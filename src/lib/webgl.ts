/**
 * Safe client-side WebGL capability check that immediately releases the
 * temporary test context so mobile browsers (especially iOS Safari) never
 * burn one of their limited WebGL context slots during detection.
 */
export function detectWebGLSupport(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return true;
  }
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: false });
    if (!gl) return false;
    const ext = gl.getExtension("WEBGL_lose_context");
    ext?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Covers BOTH phones AND tablets (iPad / Android tablets up to 1280px with touch,
 * plus any narrow viewport <= 1024px) so tile-based mobile GPUs always use the
 * ultra-fast low-overdraw rendering tier.
 */
export function isCompactViewport(): boolean {
  if (typeof window === "undefined") return false;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const touchCapable =
    typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;
  return (
    window.innerWidth <= 1024 ||
    coarse ||
    (touchCapable && window.innerWidth <= 1280)
  );
}
