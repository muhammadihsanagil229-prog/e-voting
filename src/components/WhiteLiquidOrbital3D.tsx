import {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface OrbitalStateRef {
  progress: number;
  swirlSpeed: number;
  scale: number;
  rippleProgress: number;
  opacity: number;
}

interface WhiteLiquidOrbital3DProps {
  orbitalStateRef: React.MutableRefObject<OrbitalStateRef>;
}

const _dummyObj = new THREE.Object3D();
const _particleColor = new THREE.Color();

function detectSoftwareWebGL(): {supported: boolean; isSoftwareGl: boolean} {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl =
      probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return {supported: false, isSoftwareGl: true};
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    const isSoftwareGl =
      /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    return {supported: true, isSoftwareGl};
  } catch {
    return {supported: false, isSoftwareGl: true};
  }
}

export function WhiteLiquidOrbital3D({
  orbitalStateRef,
}: WhiteLiquidOrbital3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglFallback, setWebglFallback] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const {supported, isSoftwareGl} = detectSoftwareWebGL();
    if (!supported) {
      setWebglFallback(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFallback(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2)
    );
    renderer.setClearColor(0x000000, 0);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.15, 4.7);
    camera.lookAt(0, 0, 0);

    // Procedural Studio Reflection Map (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // 3-Point Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xdbeafe, 1.3);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(3.5, 4.5, 4.0);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe0edff, 1.8);
    rimLight.position.set(-4.0, 2.0, -3.5);
    scene.add(rimLight);

    const coreLight = new THREE.PointLight(0xffffff, 2.5, 10);
    coreLight.position.set(0, 0, 0.35);
    scene.add(coreLight);

    // Root Group for Composite 3D Liquid Sphere
    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    // 1. Inner Pearl Luminous Core
    const coreGeo = new THREE.IcosahedronGeometry(0.56, 4);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xeef5ff,
      emissiveIntensity: 0.75,
      roughness: 0.12,
      metalness: 0.0,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.94,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    orbGroup.add(coreMesh);

    // 2. Main 3D Translucent Liquid Vortex Sphere (custom GLSL wave displacement via onBeforeCompile)
    const liquidGeo = new THREE.IcosahedronGeometry(1.0, isSoftwareGl ? 4 : 6);
    const liquidShaderUniforms = {
      uTime: {value: 0},
      uSwirlSpeed: {value: 1.0},
    };
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.05,
      metalness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      ior: 1.36,
      thickness: 1.35,
      transmission: isSoftwareGl ? 0 : 0.72,
      attenuationColor: new THREE.Color(0xdbeafe),
      attenuationDistance: 2.4,
      envMapIntensity: 1.45,
      transparent: true,
      opacity: isSoftwareGl ? 0.78 : 0.96,
    });

    liquidMat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = liquidShaderUniforms.uTime;
      shader.uniforms.uSwirlSpeed = liquidShaderUniforms.uSwirlSpeed;
      shader.vertexShader =
        `
        uniform float uTime;
        uniform float uSwirlSpeed;
        varying float vVortexBand;
      ` +
        shader.vertexShader.replace(
          '#include <begin_vertex>',
          `
          #include <begin_vertex>
          float theta = atan(position.z, position.x);
          float phi = acos(clamp(position.y, -1.0, 1.0));
          float spiral1 = sin(theta * 4.0 + phi * 5.0 - uTime * 2.4 * uSwirlSpeed);
          float spiral2 = cos(theta * 3.0 - phi * 6.0 - uTime * 1.9 * uSwirlSpeed);
          float ripple = sin(phi * 9.0 - uTime * 3.1);
          float disp = (spiral1 * 0.042 + spiral2 * 0.028 + ripple * 0.016);
          transformed += normal * disp;
          vVortexBand = spiral1 * 0.5 + 0.5;
        `
        );

      shader.fragmentShader =
        `
        varying float vVortexBand;
      ` +
        shader.fragmentShader.replace(
          '#include <color_fragment>',
          `
          #include <color_fragment>
          vec3 iceTint = vec3(0.89, 0.94, 1.0);
          vec3 pureWhite = vec3(1.0, 1.0, 1.0);
          diffuseColor.rgb = mix(iceTint, pureWhite, smoothstep(0.2, 0.85, vVortexBand));
        `
        );
    };

    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    orbGroup.add(liquidMesh);

    // 3. Swirling 3D Orbital Liquid Ribbons (3 tilted helical streams)
    const ribbonConfigs = [
      {radius: 1.24, tiltX: 0.42, tiltZ: -0.28, tube: 0.022, opacity: 0.75},
      {radius: 1.38, tiltX: -0.58, tiltZ: 0.36, tube: 0.017, opacity: 0.6},
      {radius: 1.52, tiltX: 0.24, tiltZ: 0.62, tube: 0.013, opacity: 0.48},
    ];
    const ribbonMeshes: THREE.Mesh[] = [];
    const ribbonGeos: THREE.BufferGeometry[] = [];
    const ribbonMats: THREE.Material[] = [];

    ribbonConfigs.forEach((cfg, idx) => {
      const pts: THREE.Vector3[] = [];
      const segments = 48;
      for (let i = 0; i < segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        const rWave = cfg.radius + Math.sin(a * 3 + idx) * 0.06;
        const yWave = Math.sin(a * 2 + idx * 1.4) * 0.14;
        pts.push(new THREE.Vector3(Math.cos(a) * rWave, yWave, Math.sin(a) * rWave));
      }
      const curve = new THREE.CatmullRomCurve3(pts, true);
      const geo = new THREE.TubeGeometry(curve, 96, cfg.tube, 8, true);
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0xe0edff,
        emissiveIntensity: 0.55,
        roughness: 0.08,
        metalness: 0.0,
        clearcoat: 1.0,
        transparent: true,
        opacity: cfg.opacity,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.set(cfg.tiltX, idx * 0.8, cfg.tiltZ);
      orbGroup.add(mesh);
      ribbonMeshes.push(mesh);
      ribbonGeos.push(geo);
      ribbonMats.push(mat);
    });

    // 4. Orbiting Micro Liquid Water Droplets (InstancedMesh)
    const particleCount = 64;
    const particleGeo = new THREE.SphereGeometry(0.024, 10, 10);
    const particleMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xbfdbfe,
      emissiveIntensity: 0.5,
      roughness: 0.08,
      metalness: 0.0,
      transparent: true,
      opacity: 0.85,
    });
    const particleMesh = new THREE.InstancedMesh(
      particleGeo,
      particleMat,
      particleCount
    );
    particleMesh.frustumCulled = false;

    const particleMeta = Array.from({length: particleCount}, (_, i) => ({
      radius: 1.18 + (i % 7) * 0.11,
      angle: (i / particleCount) * Math.PI * 2 * 3,
      speed: 0.75 + (i % 5) * 0.28,
      yOffset: ((i % 9) - 4) * 0.14,
      tilt: ((i % 6) - 2.5) * 0.22,
      scale: 0.65 + (i % 4) * 0.25,
    }));

    particleMeta.forEach((_, i) => {
      _particleColor.setHex(i % 3 === 0 ? 0xffffff : 0xdbeafe);
      particleMesh.setColorAt(i, _particleColor);
    });
    if (particleMesh.instanceColor) {
      particleMesh.instanceColor.needsUpdate = true;
    }
    orbGroup.add(particleMesh);

    // 5. Phase 3 Expanding White Ripple Waves
    const rippleRings: Array<{
      mesh: THREE.Mesh;
      mat: THREE.MeshBasicMaterial;
      offset: number;
    }> = [];
    const rippleGeo = new THREE.RingGeometry(0.95, 1.05, 72);
    for (let i = 0; i < 3; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: i === 0 ? 0xffffff : 0xdbeafe,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(rippleGeo, mat);
      mesh.rotation.x = -Math.PI * 0.18 + i * 0.12;
      scene.add(mesh);
      rippleRings.push({mesh, mat, offset: i * 0.22});
    }

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function updateScene() {
      const elapsed = clock.getElapsedTime();
      const st = orbitalStateRef.current;

      liquidShaderUniforms.uTime.value = elapsed;
      liquidShaderUniforms.uSwirlSpeed.value = st.swirlSpeed;

      // Smoothly scale and spin the 3D liquid orb
      const s = Math.max(0.01, st.scale);
      orbGroup.scale.setScalar(s);
      orbGroup.rotation.y = elapsed * 0.55 * st.swirlSpeed;
      orbGroup.rotation.x = Math.sin(elapsed * 0.8) * 0.12;

      coreMesh.rotation.y = -elapsed * 0.9 * st.swirlSpeed;
      coreMat.opacity = 0.94 * st.opacity;
      liquidMat.opacity = (isSoftwareGl ? 0.78 : 0.96) * st.opacity;
      coreLight.intensity = 2.4 * st.opacity + st.rippleProgress * 3.5;

      // Rotate orbital liquid ribbons
      ribbonMeshes.forEach((mesh, idx) => {
        mesh.rotation.y += 0.014 * (idx + 1) * st.swirlSpeed;
        mesh.rotation.z += 0.004 * (idx % 2 === 0 ? 1 : -1) * st.swirlSpeed;
        const mat = ribbonMats[idx] as THREE.MeshPhysicalMaterial;
        mat.opacity = ribbonConfigs[idx].opacity * st.opacity;
      });

      // Update orbiting water particles
      particleMat.opacity = 0.85 * st.opacity;
      for (let i = 0; i < particleCount; i++) {
        const p = particleMeta[i];
        const a = p.angle + elapsed * p.speed * st.swirlSpeed;
        const r = p.radius + st.rippleProgress * 0.65;
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r;
        const y = p.yOffset + Math.sin(a * 2.0 + p.tilt) * 0.18;
        _dummyObj.position.set(x, y, z);
        _dummyObj.scale.setScalar(p.scale * st.opacity);
        _dummyObj.updateMatrix();
        particleMesh.setMatrixAt(i, _dummyObj.matrix);
      }
      particleMesh.instanceMatrix.needsUpdate = true;

      // Phase 3 expanding white ripple waves
      rippleRings.forEach((ring) => {
        const localP = THREE.MathUtils.clamp(
          (st.rippleProgress - ring.offset) / (1 - ring.offset),
          0,
          1
        );
        if (localP <= 0) {
          ring.mat.opacity = 0;
          ring.mesh.scale.setScalar(0.5);
        } else {
          const eased = 1 - Math.pow(1 - localP, 3);
          ring.mesh.scale.setScalar(0.9 + eased * 4.4);
          ring.mat.opacity = Math.sin(localP * Math.PI) * 0.55;
        }
      });

      renderer.render(scene, camera);
    }

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync =
        typeof gl.fenceSync === 'function'
          ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0)
          : null;
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (sync && state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      updateScene();
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = window.requestAnimationFrame(tick);
      }
    }

    tick();

    function handleResize() {
      if (!container || disposed) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(
        isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2)
      );
    }

    window.addEventListener('resize', handleResize);

    return () => {
      disposed = true;
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);

      coreGeo.dispose();
      coreMat.dispose();
      liquidGeo.dispose();
      liquidMat.dispose();
      ribbonGeos.forEach((g) => g.dispose());
      ribbonMats.forEach((m) => m.dispose());
      particleGeo.dispose();
      particleMat.dispose();
      rippleGeo.dispose();
      rippleRings.forEach((r) => r.mat.dispose());
      envTarget.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [orbitalStateRef]);

  if (webglFallback) {
    return (
      <div
        aria-hidden="true"
        className="w-full h-full flex items-center justify-center"
      >
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-[radial-gradient(circle_at_30%_28%,#FFFFFF_0%,#F1F5F9_35%,#DBEAFE_72%,#93C5FD_100%)] shadow-[0_0_70px_rgba(255,255,255,0.95),0_0_45px_rgba(59,130,246,0.22)] animate-spin [animation-duration:4s]" />
      </div>
    );
  }

  return <div ref={mountRef} className="w-full h-full" aria-hidden="true" />;
}
