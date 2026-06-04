"use client";

import { useEffect, useRef } from "react";

export function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let mounted = true;
    let animId: number;

    (async () => {
      const THREE = await import("three");
      if (!mounted) return;

      // ── Renderer ──────────────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      // ── Scene / Camera ────────────────────────────────────────────
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, el.clientWidth / el.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 5);

      // ── Lights ────────────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xf9f4e8, 0.5));

      const lA = new THREE.PointLight(0xc9792a, 90, 14);
      lA.position.set(3, 3, 2);
      scene.add(lA);

      const lB = new THREE.PointLight(0xd4a82b, 65, 12);
      lB.position.set(-3, -2, 1);
      scene.add(lB);

      const lC = new THREE.PointLight(0x6b3f1f, 35, 10);
      lC.position.set(0, -4, -2);
      scene.add(lC);

      // ── Central sphere — dark metallic ────────────────────────────
      const gSphere = new THREE.IcosahedronGeometry(1.15, 5);
      const mSolid = new THREE.MeshStandardMaterial({
        color: 0x2c1a0e,
        roughness: 0.3,
        metalness: 0.65,
        transparent: true,
        opacity: 0.9,
      });
      const sphere = new THREE.Mesh(gSphere, mSolid);
      scene.add(sphere);

      // Wireframe shell — gold
      const gWire = new THREE.IcosahedronGeometry(1.24, 2);
      const mWire = new THREE.MeshBasicMaterial({
        color: 0xd4a82b,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
      });
      const wire = new THREE.Mesh(gWire, mWire);
      scene.add(wire);

      // ── Orbit rings ───────────────────────────────────────────────
      const makeRing = (r: number, tube: number, color: number, opacity: number) => {
        const m = new THREE.Mesh(
          new THREE.TorusGeometry(r, tube, 8, 90),
          new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
        );
        scene.add(m);
        return m;
      };
      const ring1 = makeRing(1.62, 0.016, 0xc9792a, 0.5);
      ring1.rotation.x = Math.PI / 4;
      const ring2 = makeRing(1.82, 0.01, 0xd4a82b, 0.28);
      ring2.rotation.x = -Math.PI / 3;
      ring2.rotation.z = Math.PI / 6;
      const ring3 = makeRing(2.05, 0.008, 0xf9f4e8, 0.12);
      ring3.rotation.y = Math.PI / 5;
      ring3.rotation.z = Math.PI / 3;

      // ── Particles ─────────────────────────────────────────────────
      const N = 140;
      const pos = new Float32Array(N * 3);
      const col = new Float32Array(N * 3);
      const palette = [
        new THREE.Color(0xc9792a),
        new THREE.Color(0xd4a82b),
        new THREE.Color(0xf9f4e8),
        new THREE.Color(0xb8855a),
        new THREE.Color(0x6b3f1f),
      ];

      for (let i = 0; i < N; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(2 * Math.random() - 1);
        const r     = 2.2 + Math.random() * 2.8;
        pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
        pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i*3+2] = r * Math.cos(phi);
        const c = palette[Math.floor(Math.random() * palette.length)];
        col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
      }

      const gPts = new THREE.BufferGeometry();
      gPts.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      gPts.setAttribute("color",    new THREE.BufferAttribute(col, 3));
      const pts = new THREE.Points(gPts, new THREE.PointsMaterial({
        size: 0.065, vertexColors: true, transparent: true, opacity: 0.7, sizeAttenuation: true,
      }));
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

      // ── Loop ──────────────────────────────────────────────────────
      const clock = new THREE.Clock();

      const tick = () => {
        if (!mounted) return;
        animId = requestAnimationFrame(tick);
        const t = clock.getElapsedTime();

        // Sphere
        const breathe = 1 + Math.sin(t * 0.7) * 0.022;
        sphere.rotation.y = t * 0.16;
        sphere.rotation.x = Math.sin(t * 0.11) * 0.14;
        sphere.scale.setScalar(breathe);

        // Wire
        wire.rotation.y = -t * 0.11;
        wire.rotation.z =  t * 0.07;
        wire.scale.setScalar(breathe * 1.03);

        // Rings
        ring1.rotation.y  =  t * 0.2;
        ring1.rotation.z  =  t * 0.08;
        ring2.rotation.x  = -Math.PI / 3 + t * 0.14;
        ring2.rotation.y  =  t * 0.17;
        ring3.rotation.z  =  t * 0.11;
        ring3.rotation.x  =  Math.PI / 5 - t * 0.09;

        // Particles drift
        pts.rotation.y = t * 0.035;
        pts.rotation.x = t * 0.022;

        // Lights dance
        lA.position.set(Math.sin(t * 0.38) * 3.5, Math.cos(t * 0.28) * 2.5, 2);
        lB.position.set(Math.cos(t * 0.32) * -3, Math.sin(t * 0.42) * -2, 1);

        // Camera parallax
        camera.position.x += (mx * 0.55 - camera.position.x) * 0.035;
        camera.position.y += (-my * 0.38 - camera.position.y) * 0.035;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };
      tick();

      // Cleanup stored on the ref
      mountRef.current && (
        (mountRef.current as HTMLDivElement & { _threeCleanup?: () => void })._threeCleanup = () => {
          window.removeEventListener("mousemove", onMouse);
          window.removeEventListener("resize", onResize);
          renderer.dispose();
          if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
        }
      );
    })();

    return () => {
      mounted = false;
      cancelAnimationFrame(animId);
      const stored = (mountRef.current as HTMLDivElement & { _threeCleanup?: () => void } | null)?._threeCleanup;
      stored?.();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="hero-canvas"
      aria-hidden="true"
    />
  );
}
