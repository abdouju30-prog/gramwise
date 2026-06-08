"use client";

import { useEffect, useRef } from "react";

type HeroCanvasProps = {
  className?: string;
};

export function HeroCanvas({ className = "" }: HeroCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let mounted = true;
    let animId = 0;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");
      if (!mounted) return;

      // ── Renderer ──────────────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      // ── Scene / Camera ────────────────────────────────────────────
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, el.clientWidth / el.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 9);

      // ── Warm ambient light only — flour dust needs soft diffuse glow ─
      scene.add(new THREE.AmbientLight(0xf9e8c0, 1.8));

      // ── Golden Flour Dust Particles ──────────────────────────────
      // Each particle has individual velocity — this is what creates
      // the authentic "flour cloud in a professional kitchen" feel
      // instead of a uniform rotating point cloud.
      const N = 520;
      const posArr  = new Float32Array(N * 3);
      const colArr  = new Float32Array(N * 3);
      const velY    = new Float32Array(N); // upward drift speed
      const velX    = new Float32Array(N); // horizontal drift
      const phaseOff = new Float32Array(N); // sin phase for sway

      // All warm amber/gold/chocolate — no cream (invisible on cream bg)
      const palette = [
        new THREE.Color(0xc9792a), // burnt amber
        new THREE.Color(0xD4941F), // amber gold — the brand colour
        new THREE.Color(0x9a5a12), // dark amber
        new THREE.Color(0xe8a840), // warm honey
        new THREE.Color(0x6b3f1f), // dark chocolate
        new THREE.Color(0xb8862e), // golden brown
        new THREE.Color(0xd4791a), // deep orange-amber
        new THREE.Color(0xf0b850), // light gold
      ];

      for (let i = 0; i < N; i++) {
        posArr[i*3]     = (Math.random() - 0.5) * 18;  // x — wide spread
        posArr[i*3 + 1] = (Math.random() - 0.5) * 18;  // y — full height
        posArr[i*3 + 2] = (Math.random() - 0.5) * 6;   // z — slight depth

        velY[i]      = 0.005 + Math.random() * 0.014;   // upward drift
        velX[i]      = (Math.random() - 0.5) * 0.003;   // gentle x drift
        phaseOff[i]  = Math.random() * Math.PI * 2;     // sway phase

        const c = palette[Math.floor(Math.random() * palette.length)];
        colArr[i*3] = c.r; colArr[i*3+1] = c.g; colArr[i*3+2] = c.b;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
      geo.setAttribute("color",    new THREE.BufferAttribute(colArr, 3));

      const mat = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.72,
        sizeAttenuation: true,
      });

      const pts = new THREE.Points(geo, mat);
      scene.add(pts);

      // ── Mouse parallax ────────────────────────────────────────────
      let mx = 0, my = 0;
      const onMouse = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
        my = ((e.clientY - r.top)  / r.height - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouse);

      // ── Resize ────────────────────────────────────────────────────
      const onResize = () => {
        camera.aspect = el.clientWidth / el.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(el.clientWidth, el.clientHeight);
      };
      window.addEventListener("resize", onResize);

      const clock = new THREE.Clock();
      const positions = geo.attributes.position.array as Float32Array;

      // ── Loop ──────────────────────────────────────────────────────
      const tick = () => {
        if (!mounted) return;
        animId = requestAnimationFrame(tick);
        const t = clock.getElapsedTime();

        // Drift each particle upward with sinusoidal x sway
        // This mimics the turbulent airflow in a real pastry kitchen
        for (let i = 0; i < N; i++) {
          positions[i*3]     += velX[i] + Math.sin(t * 0.35 + phaseOff[i]) * 0.0007;
          positions[i*3 + 1] += velY[i];

          // Wrap: particle reaches top → reset at bottom with random x
          if (positions[i*3 + 1] > 9) {
            positions[i*3 + 1] = -9;
            positions[i*3]     = (Math.random() - 0.5) * 18;
          }
        }
        geo.attributes.position.needsUpdate = true;

        // Camera drifts gently with mouse — gives parallax depth
        camera.position.x += (mx * 0.55 - camera.position.x) * 0.022;
        camera.position.y += (-my * 0.38 - camera.position.y) * 0.022;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };
      tick();

      cleanup = () => {
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        geo.dispose();
        mat.dispose();
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      };
    })();

    return () => {
      mounted = false;
      cancelAnimationFrame(animId);
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`hero-canvas ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
