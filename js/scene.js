/* ============================================================
   3D Background — monochrome particle wave (Three.js)
   Subtle, performant, mouse + scroll reactive.
   ============================================================ */
(function () {
  if (typeof THREE === "undefined") return;

  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080808, 0.18);

  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 1.2, 6);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /* ---- particle grid plane ---- */
  const COLS = 90;
  const ROWS = 90;
  const SEP = 0.28;
  const total = COLS * ROWS;

  const positions = new Float32Array(total * 3);
  const base = new Float32Array(total * 2); // store x,z for wave calc
  let i = 0,
    j = 0;
  for (let x = 0; x < COLS; x++) {
    for (let z = 0; z < ROWS; z++) {
      const px = (x - COLS / 2) * SEP;
      const pz = (z - ROWS / 2) * SEP;
      positions[i] = px;
      positions[i + 1] = 0;
      positions[i + 2] = pz;
      base[j] = px;
      base[j + 1] = pz;
      i += 3;
      j += 2;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  // soft round sprite so points aren't harsh squares
  const sprite = makeDot();
  const mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.045,
    map: sprite,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geo, mat);
  points.rotation.x = -Math.PI / 2.6;
  scene.add(points);

  /* ---- interaction state ---- */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let scrollY = 0;

  window.addEventListener("mousemove", (e) => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  window.addEventListener(
    "scroll",
    () => {
      scrollY = window.scrollY || window.pageYOffset;
    },
    { passive: true }
  );

  /* ---- animation loop ---- */
  let raf;
  const clock = new THREE.Clock();

  function animate() {
    raf = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const pos = geo.attributes.position.array;

    for (let k = 0, b = 0; k < pos.length; k += 3, b += 2) {
      const x = base[b];
      const z = base[b + 1];
      const d = Math.sqrt(x * x + z * z);
      pos[k + 1] =
        Math.sin(d * 0.9 - t * 0.9) * 0.45 +
        Math.cos(x * 0.5 + t * 0.4) * 0.18;
    }
    geo.attributes.position.needsUpdate = true;

    // easing the mouse
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;

    points.rotation.z = mouse.x * 0.12;
    camera.position.x = mouse.x * 0.7;
    camera.position.y = 1.2 - mouse.y * 0.4 - scrollY * 0.0012;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  /* ---- resize ---- */
  let rt;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 150);
  });

  // pause when tab hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else animate();
  });

  /* ---- helper: radial gradient dot texture ---- */
  function makeDot() {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.4, "rgba(255,255,255,0.6)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.Texture(c);
    tex.needsUpdate = true;
    return tex;
  }
})();
