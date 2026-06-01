import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { scrollState, SECTION_THEMES } from '../lib/scrollStore';

/**
 * WebGL depth world that sits behind everything. The camera slowly dollies
 * forward as you scroll (genuine z-translation through a volume of drifting
 * sakura petals + dust), tilts with the pointer, and the whole scene's fog and
 * petal tint cross-fade between the per-"episode" accent colours. This is what
 * gives the page its real 3D, "flying through an anime scene" feel.
 */

const PETAL_COUNT = 420;
const DUST_COUNT = 900;
const VOLUME = { x: 60, y: 50, z: 140 };

function makePetalTexture(): THREE.Texture {
  const s = 128;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d')!;
  // Soft cherry-blossom petal — a rounded teardrop with a notch.
  const grad = ctx.createRadialGradient(s * 0.5, s * 0.55, 4, s * 0.5, s * 0.55, s * 0.5);
  grad.addColorStop(0, 'rgba(255,255,255,0.95)');
  grad.addColorStop(0.45, 'rgba(255,225,235,0.95)');
  grad.addColorStop(1, 'rgba(255,180,200,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(s * 0.5, s * 0.1);
  ctx.bezierCurveTo(s * 0.82, s * 0.25, s * 0.9, s * 0.7, s * 0.5, s * 0.92);
  ctx.bezierCurveTo(s * 0.1, s * 0.7, s * 0.18, s * 0.25, s * 0.5, s * 0.1);
  ctx.fill();
  // little notch at the tip
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(s * 0.5, s * 0.12, s * 0.06, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface PetalDatum {
  pos: THREE.Vector3;
  rot: THREE.Euler;
  rotSpeed: THREE.Vector3;
  fallSpeed: number;
  swayAmp: number;
  swayFreq: number;
  swayPhase: number;
  scale: number;
}

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const fogColor = new THREE.Color(SECTION_THEMES[0].fog);
    scene.fog = new THREE.FogExp2(fogColor.getHex(), 0.0085);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      400
    );
    camera.position.set(0, 0, 30);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ---- Lighting (subtle, petals are mostly emissive-looking via texture) ----
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const key = new THREE.DirectionalLight(0xffe8f0, 0.6);
    key.position.set(5, 10, 8);
    scene.add(key);

    // ---- Sakura petals (instanced) ----
    const petalTex = makePetalTexture();
    const petalGeo = new THREE.PlaneGeometry(1.1, 1.4);
    const petalMat = new THREE.MeshBasicMaterial({
      map: petalTex,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      opacity: 0.92,
      blending: THREE.NormalBlending,
    });
    const petals = new THREE.InstancedMesh(petalGeo, petalMat, PETAL_COUNT);
    petals.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const petalColor = new THREE.Color(SECTION_THEMES[0].accent);
    const petalData: PetalDatum[] = [];
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    for (let i = 0; i < PETAL_COUNT; i++) {
      petalData.push({
        pos: new THREE.Vector3(
          rand(-VOLUME.x, VOLUME.x),
          rand(-VOLUME.y, VOLUME.y),
          rand(-VOLUME.z, 20)
        ),
        rot: new THREE.Euler(rand(0, Math.PI), rand(0, Math.PI), rand(0, Math.PI)),
        rotSpeed: new THREE.Vector3(rand(-0.4, 0.4), rand(-0.5, 0.5), rand(-0.3, 0.3)),
        fallSpeed: rand(1.2, 3.4),
        swayAmp: rand(0.4, 1.6),
        swayFreq: rand(0.3, 0.9),
        swayPhase: rand(0, Math.PI * 2),
        scale: rand(0.5, 1.5),
      });
      petals.setColorAt(i, petalColor);
    }
    scene.add(petals);

    // ---- Dust / light motes (points, additive) ----
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      dustPos[i * 3] = rand(-VOLUME.x, VOLUME.x);
      dustPos[i * 3 + 1] = rand(-VOLUME.y, VOLUME.y);
      dustPos[i * 3 + 2] = rand(-VOLUME.z, 25);
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xfff2f6,
      size: 0.18,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // ---- Soft bokeh glow sprites for far-depth atmosphere ----
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 128;
    const gctx = glowCanvas.getContext('2d')!;
    const gg = gctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gg.addColorStop(0, 'rgba(255,210,225,0.8)');
    gg.addColorStop(1, 'rgba(255,210,225,0)');
    gctx.fillStyle = gg;
    gctx.fillRect(0, 0, 128, 128);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glows: THREE.Sprite[] = [];
    for (let i = 0; i < 14; i++) {
      const m = new THREE.SpriteMaterial({
        map: glowTex,
        transparent: true,
        opacity: rand(0.15, 0.4),
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const sp = new THREE.Sprite(m);
      sp.position.set(rand(-40, 40), rand(-30, 30), rand(-VOLUME.z, -10));
      const sc = rand(6, 18);
      sp.scale.set(sc, sc, 1);
      scene.add(sp);
      glows.push(sp);
    }

    // ---- Resize ----
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ---- Animation loop ----
    const dummy = new THREE.Object3D();
    const clock = new THREE.Clock();
    const targetFog = new THREE.Color();
    const targetAccent = new THREE.Color();
    let running = true;
    let camX = 0;
    let camY = 0;

    const onVisibility = () => {
      running = !document.hidden;
      if (running) clock.getDelta(); // discard the long hidden delta
    };
    document.addEventListener('visibilitychange', onVisibility);

    const animate = () => {
      if (!running) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const { progress, pointerX, pointerY, speed, section } = scrollState;

      // Camera dollies forward through the volume as you scroll, with a gentle
      // float and pointer parallax — feels like a slow cinematic push-in.
      const targetZ = 30 - progress * VOLUME.z * 0.62;
      camera.position.z += (targetZ - camera.position.z) * 0.06;
      const tiltX = pointerX * 4 - 0;
      const tiltY = -pointerY * 3;
      camX += (tiltX - camX) * 0.04;
      camY += (tiltY + Math.sin(t * 0.4) * 0.6 - camY) * 0.04;
      if (!reduceMotion) {
        camera.position.x = camX;
        camera.position.y = camY;
      }
      camera.lookAt(0, 0, camera.position.z - 40);
      camera.rotation.z = Math.sin(t * 0.15) * 0.01 + pointerX * 0.02;

      // Theme cross-fade
      const theme = SECTION_THEMES[Math.min(section, SECTION_THEMES.length - 1)];
      targetFog.set(theme.fog);
      targetAccent.set(theme.accent);
      (scene.fog as THREE.FogExp2).color.lerp(targetFog, 0.03);

      // Petal motion
      const sway = reduceMotion ? 0 : 1;
      for (let i = 0; i < PETAL_COUNT; i++) {
        const p = petalData[i];
        p.pos.y -= p.fallSpeed * dt * sway;
        p.pos.x += Math.sin(t * p.swayFreq + p.swayPhase) * p.swayAmp * dt * sway;
        p.pos.z += Math.cos(t * p.swayFreq * 0.7 + p.swayPhase) * 0.4 * dt * sway;
        // Recycle relative to the camera so the field is endless as we fly in.
        if (p.pos.y < camera.position.y - VOLUME.y) {
          p.pos.y = camera.position.y + VOLUME.y;
          p.pos.x = rand(-VOLUME.x, VOLUME.x);
          p.pos.z = rand(camera.position.z - VOLUME.z, camera.position.z - 8);
        }
        p.rot.x += p.rotSpeed.x * dt * sway;
        p.rot.y += p.rotSpeed.y * dt * sway;
        p.rot.z += p.rotSpeed.z * dt * sway;
        dummy.position.copy(p.pos);
        dummy.rotation.copy(p.rot);
        const s = p.scale;
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        petals.setMatrixAt(i, dummy.matrix);
      }
      petals.instanceMatrix.needsUpdate = true;
      // tint petals toward the active accent
      petalColor.lerp(targetAccent, 0.04);
      for (let i = 0; i < PETAL_COUNT; i++) petals.setColorAt(i, petalColor);
      if (petals.instanceColor) petals.instanceColor.needsUpdate = true;

      // Dust drifts slowly upward + reacts to scroll speed (slight stretch feel)
      dust.rotation.y += dt * 0.02;
      dustMat.opacity = 0.5 + Math.min(speed, 1) * 0.4;

      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    // ---- Cleanup ----
    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      mount.removeChild(renderer.domElement);
      petalGeo.dispose();
      petalMat.dispose();
      petalTex.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      glowTex.dispose();
      glows.forEach((g) => g.material.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 6 }}
      aria-hidden
    />
  );
}
