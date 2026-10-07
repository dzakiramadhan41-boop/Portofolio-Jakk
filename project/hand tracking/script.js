const PARTICLE_COUNT  = 8000;
const DEBOUNCE_FRAMES = 5;
const LERP_SPEED      = 0.13;

let scene, camera, renderer, particles, geometry;
let currentPositions = new Float32Array(PARTICLE_COUNT * 3);
let targetPositions  = new Float32Array(PARTICLE_COUNT * 3);
let currentColors    = new Float32Array(PARTICLE_COUNT * 3);
let targetColors     = new Float32Array(PARTICLE_COUNT * 3);
let activeShapeIndex = 0;

// Shape builders
function mkCloud() {
  const p = new Float32Array(PARTICLE_COUNT*3), c = new Float32Array(PARTICLE_COUNT*3);
  for (let i=0;i<PARTICLE_COUNT;i++) {
    const th=Math.random()*Math.PI*2, ph=Math.acos(2*Math.random()-1), r=3+Math.random()*4;
    p[i*3]=r*Math.sin(ph)*Math.cos(th)+(Math.random()-.5)*2;
    p[i*3+1]=r*Math.sin(ph)*Math.sin(th)+(Math.random()-.5)*2;
    p[i*3+2]=r*Math.cos(ph)+(Math.random()-.5)*2;
    c[i*3]=0.2+Math.random()*0.6; c[i*3+1]=0.2+Math.random()*0.6; c[i*3+2]=0.6+Math.random()*0.4;
  }
  return {p,c};
}

function mkHeart() {
  const p = new Float32Array(PARTICLE_COUNT*3), c = new Float32Array(PARTICLE_COUNT*3);
  for (let i=0;i<PARTICLE_COUNT;i++) {
    const t=Math.random()*Math.PI*2;
    p[i*3]=(16*Math.pow(Math.sin(t),3))*0.28;
    p[i*3+1]=(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*0.28;
    p[i*3+2]=(Math.random()-.5)*1.5;
    c[i*3]=0.95+Math.random()*0.05; c[i*3+1]=0.05+Math.random()*0.15; c[i*3+2]=0.15+Math.random()*0.25;
  }
  return {p,c};
}

function mkPlanet() {
  const p = new Float32Array(PARTICLE_COUNT*3), c = new Float32Array(PARTICLE_COUNT*3);
  for (let i=0;i<PARTICLE_COUNT;i++) {
    if (i<PARTICLE_COUNT*.45) {
      const u=Math.random()*Math.PI*2, v=Math.random()*Math.PI, r=2.5;
      p[i*3]=r*Math.sin(v)*Math.cos(u); p[i*3+1]=r*Math.sin(v)*Math.sin(u); p[i*3+2]=r*Math.cos(v);
      c[i*3]=0.35+Math.random()*.15; c[i*3+1]=0.85+Math.random()*.15; c[i*3+2]=0.9+Math.random()*.1;
    } else {
      const th=Math.random()*Math.PI*2, r=3.8+Math.random()*2.8;
      p[i*3]=r*Math.cos(th); p[i*3+1]=(Math.random()-.5)*.25; p[i*3+2]=r*Math.sin(th);
      c[i*3]=0.25+Math.random()*.15; c[i*3+1]=0.75+Math.random()*.2; c[i*3+2]=0.85+Math.random()*.15;
    }
  }
  return {p,c};
}

let _text = null;
function mkText() {
  if (_text) return _text;
  const cv=document.createElement('canvas'); cv.width=600; cv.height=120;
  const cx=cv.getContext('2d');
  cx.fillStyle='black'; cx.fillRect(0,0,600,120);
  cx.fillStyle='white'; cx.font='bold 52px Arial'; cx.textAlign='center';
  cx.fillText('I LOVE YOU',300,78);
  const d=cx.getImageData(0,0,600,120).data, vp=[];
  for(let y=0;y<120;y+=2) for(let x=0;x<600;x+=2)
    if(d[(y*600+x)*4]>128) vp.push({x:(x-300)*.03, y:-(y-60)*.03});
  const p=new Float32Array(PARTICLE_COUNT*3), c=new Float32Array(PARTICLE_COUNT*3);
  for(let i=0;i<PARTICLE_COUNT;i++){
    const pt=vp[i%vp.length];
    p[i*3]=pt.x+(Math.random()-.5)*.03; p[i*3+1]=pt.y+(Math.random()-.5)*.03; p[i*3+2]=(Math.random()-.5)*.12;
    c[i*3]=0; c[i*3+1]=1; c[i*3+2]=0.8;
  }
  _text={p,c}; return _text;
}

function mkWave() {
  const p=new Float32Array(PARTICLE_COUNT*3), c=new Float32Array(PARTICLE_COUNT*3);
  for(let i=0;i<PARTICLE_COUNT;i++){
    const x=(Math.random()-.5)*14, z=(Math.random()-.5)*4;
    const y=Math.sin(x*.8)*1.5+Math.sin(x*1.6+1)*.7+(Math.random()-.5)*.5;
    p[i*3]=x; p[i*3+1]=y; p[i*3+2]=z;
    const t=i/PARTICLE_COUNT;
    c[i*3]=t*.1; c[i*3+1]=0.5+t*.5; c[i*3+2]=0.8+t*.2;
  }
  return {p,c};
}

function mkFlame() {
  const p=new Float32Array(PARTICLE_COUNT*3), c=new Float32Array(PARTICLE_COUNT*3);
  for(let i=0;i<PARTICLE_COUNT;i++){
    const t=Math.random(), a=Math.random()*Math.PI*2;
    const r=(1-t)*2.5*(.4+Math.random()*.6);
    p[i*3]=r*Math.cos(a)+(Math.random()-.5)*.3;
    p[i*3+1]=t*7-3+(Math.random()-.5)*.4;
    p[i*3+2]=r*Math.sin(a)*.5;
    const tt=i/PARTICLE_COUNT;
    c[i*3]=1; c[i*3+1]=0.1+tt*.6; c[i*3+2]=tt*.1;
  }
  return {p,c};
}

function mkDiamond() {
  const verts=[
    [0,4,0],[3,0,3],[-3,0,3],[0,4,0],[3,0,3],[3,0,-3],
    [0,4,0],[-3,0,3],[-3,0,-3],[0,4,0],[3,0,-3],[-3,0,-3],
    [0,-2.5,0],[3,0,3],[-3,0,3],[0,-2.5,0],[3,0,3],[3,0,-3],
    [0,-2.5,0],[-3,0,3],[-3,0,-3],[0,-2.5,0],[3,0,-3],[-3,0,-3],
  ];
  const p=new Float32Array(PARTICLE_COUNT*3), c=new Float32Array(PARTICLE_COUNT*3);
  for(let i=0;i<PARTICLE_COUNT;i++){
    const f=Math.floor(Math.random()*8)*3;
    const a=verts[f],b=verts[f+1],cc2=verts[f+2];
    const v=Math.random(), u=Math.random()*(1-v), w=1-u-v;
    p[i*3]=a[0]*u+b[0]*v+cc2[0]*w;
    p[i*3+1]=a[1]*u+b[1]*v+cc2[1]*w;
    p[i*3+2]=a[2]*u+b[2]*v+cc2[2]*w;
    const t=Math.random();
    c[i*3]=0.5+t*.5; c[i*3+1]=0.7+t*.3; c[i*3+2]=0.9+t*.1;
  }
  return {p,c};
}

function mkSpiral() {
  const p=new Float32Array(PARTICLE_COUNT*3), c=new Float32Array(PARTICLE_COUNT*3);
  for(let i=0;i<PARTICLE_COUNT;i++){
    const arm=i%3, t=Math.random();
    const th=t*Math.PI*5+(arm/3)*Math.PI*2, r=t*6+Math.random()*.8;
    p[i*3]=r*Math.cos(th); p[i*3+1]=(Math.random()-.5)*.5*(1-t); p[i*3+2]=r*Math.sin(th);
    const tt=i/PARTICLE_COUNT;
    c[i*3]=0.8-tt*.5; c[i*3+1]=0.3+tt*.5; c[i*3+2]=0.9;
  }
  return {p,c};
}

const S0=mkCloud(), S1=mkHeart(), S2=mkPlanet(), S3=mkText(),
      S4=mkWave(),  S5=mkFlame(), S6=mkDiamond(), S7=mkSpiral();

const SHAPES = [
  { pos:S0.p, col:S0.c, rot:(p,t)=>{ p.rotation.y+=0.004; } },
  { pos:S1.p, col:S1.c, rot:(p,t)=>{ p.rotation.y+=0.009; p.rotation.x=THREE.MathUtils.lerp(p.rotation.x,0,.08); } },
  { pos:S2.p, col:S2.c, rot:(p,t)=>{ p.rotation.y+=0.011; p.rotation.x+=0.007; p.rotation.z+=0.003; } },
  { pos:S3.p, col:S3.c, rot:(p,t)=>{ ['x','y','z'].forEach(ax=>{ p.rotation[ax]=THREE.MathUtils.lerp(p.rotation[ax],0,.08); }); } },
  { pos:S4.p, col:S4.c, rot:(p,t)=>{ p.rotation.y+=0.006; p.rotation.z=Math.sin(t)*.08; } },
  { pos:S5.p, col:S5.c, rot:(p,t)=>{ p.rotation.y+=0.003; p.rotation.z=Math.sin(t*2)*.04; } },
  { pos:S6.p, col:S6.c, rot:(p,t)=>{ p.rotation.y+=0.013; p.rotation.x+=0.005; } },
  { pos:S7.p, col:S7.c, rot:(p,t)=>{ p.rotation.y+=0.007; p.rotation.z+=0.002; } },
];

// Three.js init
function initThreeJS() {
  scene  = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,1000);
  camera.position.z = 12;
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(innerWidth,innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  document.body.appendChild(renderer.domElement);
  geometry = new THREE.BufferGeometry();
  const s0 = SHAPES[0];
  for(let i=0;i<PARTICLE_COUNT*3;i++){
    currentPositions[i]=s0.pos[i]; targetPositions[i]=s0.pos[i];
    currentColors[i]   =s0.col[i]; targetColors[i]   =s0.col[i];
  }
  geometry.setAttribute('position',new THREE.BufferAttribute(currentPositions,3));
  geometry.setAttribute('color',   new THREE.BufferAttribute(currentColors,3));
  particles = new THREE.Points(geometry, new THREE.PointsMaterial({
    size:0.065, vertexColors:true,
    blending:THREE.AdditiveBlending, transparent:true, opacity:0.88, depthWrite:false
  }));
  scene.add(particles);
  window.addEventListener('resize',()=>{
    camera.aspect=innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight);
  });
  animate();
}

function setShape(idx) {
  if (activeShapeIndex===idx) return;
  activeShapeIndex=idx;
  const s=SHAPES[idx];
  for(let i=0;i<PARTICLE_COUNT*3;i++){
    targetPositions[i]=s.pos[i];
    targetColors[i]   =s.col[i];
  }
  updateHUD(idx);
}

let animTime=0;
function animate() {
  requestAnimationFrame(animate);
  animTime+=0.016;
  const pos=geometry.attributes.position.array;
  const col=geometry.attributes.color.array;
  for(let i=0;i<PARTICLE_COUNT*3;i++){
    pos[i]+=(targetPositions[i]-pos[i])*LERP_SPEED;
    col[i]+=(targetColors[i]-col[i])   *LERP_SPEED;
  }
  geometry.attributes.position.needsUpdate=true;
  geometry.attributes.color.needsUpdate   =true;
  SHAPES[activeShapeIndex].rot(particles,animTime);
  renderer.render(scene,camera);
}

// Gesture detection
let pendingGesture=-1, pendingCount=0;
const lockRingCtx=document.getElementById('lock-ring').getContext('2d');

function up(lm,tip,pip){ return lm[tip].y < lm[pip].y - 0.02; }

function thumbExtended(lm){
  const aboveIP = lm[4].y < lm[3].y - 0.04;
  const dx=lm[4].x-lm[8].x, dy=lm[4].y-lm[8].y;
  return aboveIP && Math.sqrt(dx*dx+dy*dy) > 0.10;
}

function detectGesture(lm) {
  const I=up(lm,8,6), M=up(lm,12,10), R=up(lm,16,14), P=up(lm,20,18);
  const T=thumbExtended(lm);
  if (!I && !M && !R && !P) {
    const highAboveWrist = lm[4].y < lm[0].y - 0.15;
    if (T && highAboveWrist) return 5;
    return 1;
  }
  if (T && I && !M && !R && P)  return 6;
  if (T && !I && !M && !R && P) return 4;
  if (I && M && R && P)          return 0;
  if (!T && I && M && R && P)    return 7;
  if (I && M && !R && !P)        return 3;
  if (I && !M && !R && !P)       return 2;
  return activeShapeIndex;
}

function processGesture(g) {
  if (g===activeShapeIndex) { pendingGesture=-1; pendingCount=0; drawLockRing(0); return; }
  if (g!==pendingGesture) { pendingGesture=g; pendingCount=0; }
  pendingCount++;
  drawLockRing(pendingCount/DEBOUNCE_FRAMES);
  if (pendingCount>=DEBOUNCE_FRAMES) {
    setShape(pendingGesture);
    pendingGesture=-1; pendingCount=0; drawLockRing(0);
  }
}

function drawLockRing(pct) {
  const c=lockRingCtx;
  c.clearRect(0,0,40,40);
  if(pct<=0) return;
  c.beginPath();
  c.arc(20,20,15,-Math.PI/2,-Math.PI/2+Math.PI*2*pct);
  c.strokeStyle=`hsl(${160+pct*60},100%,65%)`;
  c.lineWidth=3; c.lineCap='round'; c.stroke();
}

// Landmark overlay — ukuran canvas disesuaikan dengan webcam display
const lmCanvas=document.getElementById('landmark-canvas');
const lmCtx   =lmCanvas.getContext('2d');
const CONN=[
  [0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],[0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],[5,9],[9,13],[13,17]
];
function drawLandmarks(lm) {
  const W=lmCanvas.width, H=lmCanvas.height;
  lmCtx.clearRect(0,0,W,H);
  if (!lm) return;
  // MediaPipe sudah normalisasi x dengan mirror (0=kanan, 1=kiri dari sudut pandang user)
  // Video di-mirror via CSS scaleX(-1), jadi koordinat landmark sudah match langsung
  const sx=pt=>pt.x*W, sy=pt=>pt.y*H;
  lmCtx.strokeStyle='rgba(0,255,180,0.75)'; lmCtx.lineWidth=1.8;
  CONN.forEach(([a,b])=>{
    lmCtx.beginPath(); lmCtx.moveTo(sx(lm[a]),sy(lm[a])); lmCtx.lineTo(sx(lm[b]),sy(lm[b])); lmCtx.stroke();
  });
  const tips=new Set([4,8,12,16,20]);
  lm.forEach((pt,i)=>{
    lmCtx.beginPath(); lmCtx.arc(sx(pt),sy(pt),tips.has(i)?4:2.5,0,Math.PI*2);
    lmCtx.fillStyle=i===0?'#fff':tips.has(i)?'#ffff00':'rgba(0,255,180,0.9)';
    lmCtx.fill();
  });
}

// HUD
const guideItems=document.querySelectorAll('.g-item');
const confBar   =document.getElementById('conf-bar');
function updateHUD(idx) { guideItems.forEach((el,i)=>el.classList.toggle('active',i===idx)); }
function updateConf(v)  { confBar.style.width=(v*100).toFixed(0)+'%'; }

// MediaPipe
function onResults(res) {
  if (res.multiHandLandmarks && res.multiHandLandmarks.length>0) {
    const lm=res.multiHandLandmarks[0];
    drawLandmarks(lm);
    processGesture(detectGesture(lm));
    const wlm=res.multiHandWorldLandmarks;
    const score=wlm?wlm[0].reduce((s,p)=>s+(p.visibility||0.8),0)/21:0.85;
    updateConf(Math.min(1,score));
  } else {
    drawLandmarks(null); updateConf(0);
    pendingGesture=-1; pendingCount=0; drawLockRing(0);
  }
}

// Bootstrap
const videoEl =document.getElementById('webcam');
const errorMsg=document.getElementById('error-msg');

// Guide toggle (mobile/tablet)
function toggleGuide() {
  const guide = document.getElementById('guide');
  const btn   = document.getElementById('guide-toggle');
  guide.classList.toggle('open');
  btn.classList.toggle('active');
  btn.textContent = guide.classList.contains('open') ? '✕ Close' : '🖐️ Gestures';
}
// Close guide when tapping a gesture item on mobile
document.querySelectorAll('.g-item').forEach(function(el) {
  el.addEventListener('click', function() {
    var guide = document.getElementById('guide');
    var btn   = document.getElementById('guide-toggle');
    if (guide.classList.contains('open')) {
      guide.classList.remove('open');
      btn.classList.remove('active');
      btn.textContent = '🖐️ Gestures';
    }
  });
});

// Sync canvas resolution dengan ukuran display webcam yang aktual
function syncCanvasToWebcam() {
  const webcamEl = document.getElementById('webcam');
  const displayW = webcamEl.offsetWidth;
  const displayH = webcamEl.offsetHeight;
  if (displayW > 0 && displayH > 0) {
    lmCanvas.width  = displayW;
    lmCanvas.height = displayH;
  }
}

// Pilih resolusi kamera berdasarkan ukuran layar
function getCameraResolution() {
  const w = window.innerWidth;
  if (w <= 480) return { width: 320, height: 240 };   // mobile kecil
  if (w <= 768) return { width: 480, height: 360 };   // tablet / mobile besar
  return { width: 640, height: 480 };                  // desktop
}

initThreeJS();
updateHUD(0);

// Re-sync canvas saat resize
window.addEventListener('resize', syncCanvasToWebcam);

const hands=new Hands({ locateFile:f=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}` });
hands.setOptions({ maxNumHands:1, modelComplexity:1, minDetectionConfidence:0.6, minTrackingConfidence:0.55 });
hands.onResults(onResults);

const camRes = getCameraResolution();
navigator.mediaDevices.getUserMedia({
  video: {
    width:      { ideal: camRes.width },
    height:     { ideal: camRes.height },
    facingMode: 'user'
  }
})
  .then(stream => {
    videoEl.srcObject = stream;
    // Sync canvas setelah video metadata loaded (ukuran sudah render)
    videoEl.addEventListener('loadedmetadata', syncCanvasToWebcam, { once: true });
    new Camera(videoEl, {
      onFrame: async () => {
        // Sync canvas tiap frame pertama jika belum tersync
        if (lmCanvas.width === 0) syncCanvasToWebcam();
        await hands.send({ image: videoEl });
      },
      width:  camRes.width,
      height: camRes.height
    }).start();
  })
  .catch(err => { console.error(err); errorMsg.style.display = 'block'; });
