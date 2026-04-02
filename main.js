/* ═══════════════════════════════════════════════
   BILAL PORTFOLIO — main.js  v2
   Three.js particle field + rich interactions
═══════════════════════════════════════════════ */

/* ── CURSOR ── */
const cur  = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx=0, my=0, rx=0, ry=0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx+'px'; cur.style.top = my+'px';
});
(function animRing() {
  rx += (mx-rx)*0.11; ry += (my-ry)*0.11;
  ring.style.left = rx+'px'; ring.style.top = ry+'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a,button,.pill,.cert,.exp-item,.edu-card,.leader-card,.tag,.sphere-outer,.submit-btn').forEach(el => {
  el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
});

/* ── PROGRESS BAR ── */
const prog = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  prog.style.width = pct+'%';
});

/* ── NAV SCROLL ── */
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── THEME TOGGLE ── */
const themeBtn   = document.getElementById('theme-btn');
const themeLabel = document.getElementById('theme-label');
themeBtn.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeLabel.textContent = isDark ? 'Light' : 'Dark';
  setTimeout(initParticles, 300); // re-init after theme transition
});

/* ── MOBILE MENU ── */
const menuBtn   = document.getElementById('menu-btn');
const mobileNav = document.getElementById('mobile-nav');
menuBtn.addEventListener('click', () => mobileNav.classList.toggle('open'));
document.querySelectorAll('.mobile-link').forEach(a => {
  a.addEventListener('click', () => mobileNav.classList.remove('open'));
});

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (Math.floor(i % 4) * 0.08) + 's';
  revealObs.observe(el);
});

/* ── ANIMATED NUMBER COUNTERS ── */
function animateCounter(el, target, suffix) {
  const dur = 1800;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.floor(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const count = parseInt(el.dataset.count || '0');
      const suffix = el.dataset.suffix || '';
      if (count) animateCounter(el, count, suffix);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

/* ── TYPEWRITER ── */
const heroSub = document.querySelector('.hero-sub');
if (heroSub) {
  const text = heroSub.textContent.trim();
  heroSub.textContent = '';
  heroSub.style.borderRight = '2px solid var(--violet-lt)';
  let idx = 0;
  function type() {
    if (idx < text.length) {
      heroSub.textContent += text[idx++];
      setTimeout(type, 20);
    } else {
      setTimeout(() => { heroSub.style.borderRight = 'none'; }, 700);
    }
  }
  setTimeout(type, 1600);
}

/* ── 3D TILT CARD ── */
const card3d   = document.getElementById('card3d');
const cardWrap = document.getElementById('about-card-3d');
if (card3d && cardWrap) {
  cardWrap.addEventListener('mousemove', e => {
    const r  = cardWrap.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width  - 0.5;
    const cy = (e.clientY - r.top)  / r.height - 0.5;
    card3d.style.transform = `perspective(900px) rotateY(${cx*22}deg) rotateX(${-cy*22}deg)`;
  });
  cardWrap.addEventListener('mouseleave', () => {
    card3d.style.transform = 'perspective(900px) rotateY(0) rotateX(0)';
  });
}

/* ── LEADER & EDU CARD MOUSE GLOW ── */
document.querySelectorAll('.leader-card, .edu-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(108,63,200,0.12) 0%, transparent 55%), var(--surface)`;
  });
  card.addEventListener('mouseleave', () => { card.style.background = ''; });
});

/* ── MAGNETIC BUTTON ── */
document.querySelectorAll('.btn-primary, .submit-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const cx = e.clientX - r.left - r.width  / 2;
    const cy = e.clientY - r.top  - r.height / 2;
    btn.style.transform = `translateY(-3px) translate(${cx*0.10}px,${cy*0.10}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ── PILL RIPPLE ── */
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', e => {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(0);
      width:200%;padding-top:200%;border-radius:50%;
      background:rgba(108,63,200,0.18);animation:ripple .5s ease forwards;pointer-events:none;
    `;
    pill.style.position = 'relative'; pill.style.overflow = 'hidden';
    pill.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});
// Inject ripple keyframe
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes ripple { to { transform:translate(-50%,-50%) scale(1); opacity:0; } }
  @keyframes ring3d1 { 0%,100%{transform:rotateX(65deg) rotateZ(0deg)} 50%{transform:rotateX(65deg) rotateZ(180deg)} }
  @keyframes ring3d2 { 0%,100%{transform:rotateX(65deg) rotateZ(45deg)} 50%{transform:rotateX(65deg) rotateZ(225deg)} }
  @keyframes ring3d3 { 0%,100%{transform:rotateX(0deg) rotateZ(0deg)} 50%{transform:rotateX(10deg) rotateZ(180deg)} }
`;
document.head.appendChild(styleSheet);

/* ── SECTION ACCENT BANDS ── */
// Adds an animated gradient top band on each section when scrolled into view
const sectionAccents = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('section-entered');
  });
}, { threshold: 0.05 });
document.querySelectorAll('section').forEach(s => sectionAccents.observe(s));


/* ══════════════════════════════════════════
   THREE.JS — PARTICLE FIELD
═══════════════════════════════════════════ */
let threeRenderer = null, animFrameId = null;
let mouse3d = { x:0, y:0 };

function initParticles() {
  if (typeof THREE === 'undefined') return;

  // Cleanup
  if (animFrameId)  cancelAnimationFrame(animFrameId);
  if (threeRenderer) { threeRenderer.dispose(); }
  const canvas = document.getElementById('hero-canvas');
  canvas.innerHTML = '';

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const W = canvas.offsetWidth, H = canvas.offsetHeight;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, W/H, 0.1, 1000);
  camera.position.z = 5;

  threeRenderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  threeRenderer.setSize(W, H);
  threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  threeRenderer.setClearColor(0x000000, 0);
  canvas.appendChild(threeRenderer.domElement);

  /* — Particle geometry — */
  const COUNT = 2000;
  const positions = new Float32Array(COUNT * 3);
  const colors    = new Float32Array(COUNT * 3);
  const sizes     = new Float32Array(COUNT);

  const palette = isDark ? [
    new THREE.Color('#9b6ef3'),
    new THREE.Color('#00c9a7'),
    new THREE.Color('#f5c842'),
    new THREE.Color('#3de8cc'),
    new THREE.Color('#e8446c'),
  ] : [
    new THREE.Color('#6c3fc8'),
    new THREE.Color('#007d68'),
    new THREE.Color('#d4942a'),
    new THREE.Color('#3d1f8a'),
    new THREE.Color('#e8446c'),
  ];

  for (let i = 0; i < COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 3.5 + Math.random() * 7;
    positions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i*3+2] = r * Math.cos(phi);
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i*3]   = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
    sizes[i] = Math.random() * 2.8 + 0.6;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = color;
        vec4 mvPos = modelViewMatrix * vec4(position,1.0);
        vAlpha = smoothstep(-9.0, 2.0, mvPos.z);
        gl_PointSize = size * (300.0 / -mvPos.z);
        gl_Position  = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, d) * vAlpha * ${isDark ? '0.88' : '0.65'};
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent:true, vertexColors:true, depthWrite:false,
    blending: THREE.AdditiveBlending,
  });

  const mesh = new THREE.Points(geo, mat);
  scene.add(mesh);

  /* — Connecting Lines (web effect) — */
  const lineMat = new THREE.LineBasicMaterial({
    color: isDark ? 0x6c3fc8 : 0x9b6ef3,
    transparent:true, opacity: isDark ? 0.08 : 0.05,
    blending: THREE.AdditiveBlending,
  });
  const lineGeo = new THREE.BufferGeometry();
  const linePositions = [];
  const sample = 80; // only connect a subset
  for (let i = 0; i < sample; i++) {
    for (let j = i+1; j < sample; j++) {
      const ax=positions[i*3], ay=positions[i*3+1], az=positions[i*3+2];
      const bx=positions[j*3], by=positions[j*3+1], bz=positions[j*3+2];
      const dist = Math.sqrt((ax-bx)**2+(ay-by)**2+(az-bz)**2);
      if (dist < 3.5) {
        linePositions.push(ax,ay,az, bx,by,bz);
      }
    }
  }
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  /* — Mouse tracking — */
  document.addEventListener('mousemove', e => {
    mouse3d.x = (e.clientX / window.innerWidth)  * 2 - 1;
    mouse3d.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  /* — Resize — */
  window.addEventListener('resize', () => {
    const W2 = canvas.offsetWidth, H2 = canvas.offsetHeight;
    camera.aspect = W2 / H2;
    camera.updateProjectionMatrix();
    threeRenderer.setSize(W2, H2);
  });

  /* — Animate — */
  let t = 0;
  function animate() {
    animFrameId = requestAnimationFrame(animate);
    t += 0.003;
    mesh.rotation.y = t * 0.06 + mouse3d.x * 0.25;
    mesh.rotation.x = t * 0.03 + mouse3d.y * 0.12;
    lines.rotation.y = mesh.rotation.y;
    lines.rotation.x = mesh.rotation.x;
    threeRenderer.render(scene, camera);
  }
  animate();
}

function waitForThree() {
  if (typeof THREE !== 'undefined') initParticles();
  else setTimeout(waitForThree, 60);
}
waitForThree();


/* ══════════════════════════════════════════
   FLOATING 3D SHAPES in SKILLS SECTION
═══════════════════════════════════════════ */
function initSkillsCanvas() {
  if (typeof THREE === 'undefined') return;
  const wrap = document.querySelector('.sphere-wrap');
  if (!wrap) return;

  // Add a subtle Three.js mini canvas behind sphere
  const miniCanvas = document.createElement('div');
  miniCanvas.style.cssText = `
    position:absolute;inset:0;z-index:0;border-radius:50%;overflow:hidden;pointer-events:none;
  `;
  wrap.style.position = 'relative';
  wrap.prepend(miniCanvas);

  const W = 340, H = 340;
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 3.8;

  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setSize(W, H);
  renderer.setClearColor(0,0);
  miniCanvas.appendChild(renderer.domElement);
  renderer.domElement.style.cssText = 'width:100%;height:100%;border-radius:50%;';

  // Torus knot
  const knotGeo = new THREE.TorusKnotGeometry(0.6, 0.18, 120, 16);
  const knotMat = new THREE.MeshBasicMaterial({ color:0x9b6ef3, wireframe:true, opacity:0.22, transparent:true });
  const knot = new THREE.Mesh(knotGeo, knotMat);
  scene.add(knot);

  // Small icosahedron
  const icoGeo = new THREE.IcosahedronGeometry(0.28, 0);
  const icoMat = new THREE.MeshBasicMaterial({ color:0x00c9a7, wireframe:true, opacity:0.35, transparent:true });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  ico.position.set(0.8, 0.5, 0);
  scene.add(ico);

  let t2 = 0;
  function animateSkills() {
    requestAnimationFrame(animateSkills);
    t2 += 0.01;
    knot.rotation.x = t2 * 0.4;
    knot.rotation.y = t2 * 0.6;
    ico.rotation.x  = -t2 * 0.8;
    ico.rotation.y  = t2 * 1.0;
    ico.position.x  = Math.cos(t2 * 0.5) * 0.8;
    ico.position.y  = Math.sin(t2 * 0.7) * 0.5;
    renderer.render(scene, camera);
  }
  animateSkills();
}

function waitForThreeSkills() {
  if (typeof THREE !== 'undefined') initSkillsCanvas();
  else setTimeout(waitForThreeSkills, 100);
}
waitForThreeSkills();


/* ══════════════════════════════════════════
   FLOATING GEOMETRY in HERO (right side)
   Adds 3 small wireframe shapes near the ring
═══════════════════════════════════════════ */
function initHeroShapes() {
  if (typeof THREE === 'undefined') return;
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  const shapeCanvas = document.createElement('div');
  shapeCanvas.id = 'hero-shapes';
  shapeCanvas.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;';
  heroSection.appendChild(shapeCanvas);

  const W = heroSection.offsetWidth, H = heroSection.offsetHeight;
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setSize(W, H);
  renderer.setClearColor(0,0);
  shapeCanvas.appendChild(renderer.domElement);

  const color1 = isDark ? 0x9b6ef3 : 0x6c3fc8;
  const color2 = isDark ? 0x00c9a7 : 0x007d68;
  const color3 = isDark ? 0xf5c842 : 0xd4942a;

  const shapes = [];

  // Octahedron
  const g1 = new THREE.OctahedronGeometry(0.4);
  const m1 = new THREE.MeshBasicMaterial({ color:color1, wireframe:true, opacity:.35, transparent:true });
  const s1 = new THREE.Mesh(g1, m1);
  s1.position.set(2.8, 1.2, -1); scene.add(s1); shapes.push({ mesh:s1, rx:.8, ry:1.2, ox:0 });

  // Tetrahedron
  const g2 = new THREE.TetrahedronGeometry(0.35);
  const m2 = new THREE.MeshBasicMaterial({ color:color2, wireframe:true, opacity:.4, transparent:true });
  const s2 = new THREE.Mesh(g2, m2);
  s2.position.set(3.2, -1.0, -0.5); scene.add(s2); shapes.push({ mesh:s2, rx:1.0, ry:-0.7, ox:1 });

  // Dodecahedron
  const g3 = new THREE.DodecahedronGeometry(0.3);
  const m3 = new THREE.MeshBasicMaterial({ color:color3, wireframe:true, opacity:.3, transparent:true });
  const s3 = new THREE.Mesh(g3, m3);
  s3.position.set(1.6, -1.8, 0); scene.add(s3); shapes.push({ mesh:s3, rx:-0.5, ry:1.4, ox:2 });

  window.addEventListener('resize', () => {
    const W2 = heroSection.offsetWidth, H2 = heroSection.offsetHeight;
    camera.aspect = W2/H2; camera.updateProjectionMatrix();
    renderer.setSize(W2, H2);
  });

  let t3 = 0;
  function animShapes() {
    requestAnimationFrame(animShapes);
    t3 += 0.008;
    shapes.forEach(({ mesh, rx, ry, ox }) => {
      mesh.rotation.x = t3 * rx;
      mesh.rotation.y = t3 * ry;
      mesh.position.y += Math.sin(t3 + ox * 1.5) * 0.002;
    });
    renderer.render(scene, camera);
  }
  animShapes();
}

function waitForThreeHeroShapes() {
  if (typeof THREE !== 'undefined') initHeroShapes();
  else setTimeout(waitForThreeHeroShapes, 120);
}
waitForThreeHeroShapes();


/* ══════════════════════════════════════════
   PARALLAX SCROLL on hero orbs
═══════════════════════════════════════════ */
const orbs = document.querySelectorAll('.orb');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  orbs.forEach((orb, i) => {
    const speed = [0.08, 0.13, 0.06][i] || 0.08;
    orb.style.transform = `translateY(${scrollY * speed}px)`;
  });
}, { passive: true });


/* ══════════════════════════════════════════
   ACTIVE NAV HIGHLIGHT on scroll
═══════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const activeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.style.color = 'var(--violet-lt)';
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => activeObs.observe(s));
