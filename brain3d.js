/**
 * NEURO 3D scene. Anatomical geometry is NOT procedural:
 * Brain Anatomy Game GLB by Pyae Sone Myo, based on BodyParts3D © DBCLS,
 * CC BY-SA 2.1 JP. See docs/ASSET_CREDITS.md and docs/3D_MODEL.md.
 *
 * 3D is a progressive enhancement. All slides remain readable as 2D SVG
 * when WebGL, the external modules or the licensed model are unavailable.
 */
const MODEL_SOURCES = [
  './assets/brain.glb',
  'https://raw.githubusercontent.com/Rickaym/brain-game/e4c2e6dc0df6976b33426f17c164c2c50c711587/public/models/brain.glb'
];
const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.181.0/+esm';
const LOADER_URL = 'https://cdn.jsdelivr.net/npm/three@0.181.0/examples/jsm/loaders/GLTFLoader.js/+esm';

const $ = (s, root=document) => root.querySelector(s);
const rootFrames = [...document.querySelectorAll('[data-brain3d]')];
const sceneToType = {architecture:'overview', lobes:'lobes', deep:'deep', stem:'stem'};
const surfaceClasses = {
  frontal:['superior-frontal-gyrus','middle-frontal-gyrus','inferior-frontal-gyrus','precentral-gyrus'],
  parietal:['postcentral-gyrus','superior-parietal-lobule','angular-gyrus','supramarginal-gyrus'],
  temporal:['posterior-part-of-superior-temporal-gyrus','subdivision-of-superior-temporal-gyrus','segment-of-gyrus-of-cerebral-hemisphere','segment-of-gyrus-of-cerebral-hemisphere-1','middle-temporal-gyrus','inferior-temporal-gyrus','fusiform-gyrus'],
  occipital:['occipital-lobe'],
  insula:['insula'],
  cerebellum:['cerebellum','cerebellum2'],
  stem:['midbrain','midbrain2','pons','pons2','medulla-oblongata','medulla-oblongata2','left-superior-colliculus','right-superior-colliculus','inferior-colliculus','right-inferior-colliculus'],
  thalamus:['thalamus','thalamus-1'],
  hypothalamus:['hypothalamus','hypothalamus2'],
  pituitary:['pituitary-gland'],
  midbrain:['midbrain','midbrain2'],
  pons:['pons','pons2'],
  medulla:['medulla-oblongata','medulla-oblongata2'],
  ventricles:['left-lateral-ventricle','right-lateral-ventricle','third-ventricle','fourth-ventricle']
};
const colors = {
  frontal:0xac8de8,parietal:0x51bdb4,temporal:0xf6a878,occipital:0x74a5e7,
  insula:0xd58fc6,cerebellum:0xf09c86,stem:0x3f999b,thalamus:0x6ebf9d,
  hypothalamus:0xefaa74,pituitary:0xe47784,midbrain:0x45adba,
  pons:0x69c9c1,medulla:0x2a858b,ventricles:0x70b6ea,cerebrum:0x9e8cda
};
const hasMesh = (name, target) => (surfaceClasses[target]||[]).some(v=>name===v || name===`${v}_1` || name===`${v}.001`);
const classify = name => {
  for(const key of ['frontal','parietal','temporal','occipital','insula','cerebellum','stem','thalamus','hypothalamus','pituitary','ventricles'])
    if(hasMesh(name,key)) return key;
  return 'other';
};

if(rootFrames.length){
  let T, gltfLoader, renderer, camera, model, pivot, materialList=[], raycaster, pointer, stageHost;
  let activeFrame=null, ready=false, loadStarted=false, loadError=false;
  let selectedBySlide={architecture:'cerebrum',lobes:'frontal',deep:'thalamus',stem:'midbrain'};
  let currentMode='presentation', autoSpin=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let yaw=-.5, pitch=-.10, scale=1, isDragging=false, dragMoved=false, pointerDown=null, lastFrame=0, raf=0;
  let resizeObserver=null, modelBounds=null, waitingForAttach=false;
  const visible = () => !!activeFrame && (currentMode==='explore'||!activeFrame.closest('.scene')?.hidden);
  const stateLabel = frame => $('.brain3d-state',frame);
  function status(frame,message){const b=stateLabel(frame);b.textContent=message;b.hidden=!message;}
  function toggleFallback(frame,yes){frame.classList.toggle('is-2d',yes);const b=$('[data-brain-tool="2d"]',frame);if(b){b.setAttribute('aria-pressed',String(yes));$('span',b).textContent=yes?'3D-модель':'2D-схема';}}
  function setToolbar(frame){const b=$('[data-brain-tool="spin"]',frame);if(b){b.setAttribute('aria-pressed',String(autoSpin));$('span',b).textContent=autoSpin?'Вращение':'Пауза';}}
  async function startLoad(){
    if(loadStarted)return;loadStarted=true;
    if(!window.WebGLRenderingContext){fail('WebGL недоступен. Показана 2D-схема.');return;}
    try{
      const [three,loader] = await Promise.race([Promise.all([import(THREE_URL),import(LOADER_URL)]),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Three.js CDN timeout')),14000))]);
      T=three;
      gltfLoader=new loader.GLTFLoader();
      renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
      renderer.setPixelRatio(Math.min(1.8,window.devicePixelRatio||1));
      renderer.setClearColor(0xffffff,0);
      renderer.outputColorSpace=T.SRGBColorSpace;
      renderer.toneMapping=T.ACESFilmicToneMapping;
      renderer.toneMappingExposure=1.55;
      renderer.domElement.setAttribute('aria-label','Трёхмерный мозг: тяните мышкой для вращения, прокруткой изменяйте масштаб');
      renderer.domElement.setAttribute('tabindex','0');
      renderer.domElement.style.cursor='grab';
      model=new T.Scene();
      model.add(new T.HemisphereLight(0xeef8ff,0xb3bec0,2.55));
      const key=new T.DirectionalLight(0xffffff,2.7);key.position.set(5,7,8);model.add(key);
      const back=new T.DirectionalLight(0xb2ebdb,1.3);back.position.set(-4,-3,-6);model.add(back);
      const rim=new T.DirectionalLight(0xe9d5ff,.85);rim.position.set(1,2,-5);model.add(rim);
      camera=new T.PerspectiveCamera(34,1,.01,100);
      camera.position.set(0,.22,5.4);
      raycaster=new T.Raycaster();pointer=new T.Vector2();
      pivot=new T.Group();model.add(pivot);
      const blob=await loadGeometry();
      const oriented=new T.Group();oriented.rotation.x=-Math.PI/2;oriented.add(blob.scene);
      // Normalize and center the source atlas without inventing geometry.
      oriented.updateMatrixWorld(true);
      const bounds=new T.Box3().setFromObject(oriented);
      const dims=bounds.getSize(new T.Vector3());
      const factor=2.45/Math.max(dims.x,dims.y,dims.z,1e-8);
      const core=new T.Group();core.add(oriented);
      const c=bounds.getCenter(new T.Vector3());
      oriented.position.sub(c);pivot.scale.setScalar(factor);
      pivot.add(core);
      modelBounds=bounds;
      const collected=[];
      blob.scene.traverse(obj=>{
        if(!obj.isMesh)return;
        const meshName=obj.name.toLowerCase();
        const cat=classify(meshName);
        const mate=new T.MeshStandardMaterial({color:0xb5caca,metalness:.01,roughness:.81,transparent:true,opacity:.15,depthWrite:false,side:T.DoubleSide});
        obj.material=mate;
        obj.userData.neuroName=meshName;
        obj.userData.neuroCategory=cat;
        collected.push({obj,mate,name:meshName,cat});
      });
      materialList=collected;
      if(!materialList.length)throw Error('В GLB нет анатомических мешей');
      ready=true;
      for(const frame of rootFrames){frame.classList.add('is-ready');status(frame,'');}
      bindCanvas();attachVisible();selectForActive();requestFrame();
    }catch(error){console.warn('[NEURO 3D]',error);fail('3D не загрузилась — сохранена интерактивная 2D-схема.');}
  }
  function loadOne(url){return new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(new Error('GLB download timeout: '+url)),16000);gltfLoader.load(url,scene=>{clearTimeout(t);resolve(scene)},undefined,error=>{clearTimeout(t);reject(error)});});}
  async function loadGeometry(){
    let error=null;
    for(const url of MODEL_SOURCES){try{return await loadOne(url)}catch(e){error=e;}}
    throw error||new Error('3D-файл недоступен');
  }
  function fail(message){loadError=true;ready=false;for(const frame of rootFrames){toggleFallback(frame,true);frame.classList.remove('is-ready');status(frame,message);const button=$('[data-brain-tool="2d"]',frame);if(button){button.disabled=true;button.title='3D недоступна в текущем браузере или сети';}}}
  function bindCanvas(){
    const c=renderer.domElement;
    c.addEventListener('pointerdown',e=>{
      if(e.button!==0)return;
      pointerDown={x:e.clientX,y:e.clientY,yaw,pitch};isDragging=true;dragMoved=false;
      autoSpin=false;rootFrames.forEach(setToolbar);
      c.setPointerCapture(e.pointerId);c.style.cursor='grabbing';
    });
    c.addEventListener('pointermove',e=>{
      if(!isDragging||!pointerDown)return;
      const dx=e.clientX-pointerDown.x,dy=e.clientY-pointerDown.y;
      if(Math.hypot(dx,dy)>5)dragMoved=true;
      yaw=pointerDown.yaw+dx*.0105;
      pitch=Math.min(.63,Math.max(-.63,pointerDown.pitch+dy*.008));requestFrame();
    });
    c.addEventListener('pointerup',e=>{
      if(!isDragging)return;isDragging=false;c.style.cursor='grab';
      if(!dragMoved)pick(e);
      pointerDown=null;
    });
    c.addEventListener('pointercancel',()=>{isDragging=false;pointerDown=null;c.style.cursor='grab'});
    c.addEventListener('wheel',e=>{e.preventDefault();scale=Math.max(.67,Math.min(2.15,scale*(e.deltaY>0?.92:1.08)));requestFrame()},{passive:false});
    c.addEventListener('keydown',e=>{
      let changed=true;
      if(e.key==='ArrowLeft')yaw-=.12;
      else if(e.key==='ArrowRight')yaw+=.12;
      else if(e.key==='ArrowUp')pitch=Math.max(-.63,pitch-.10);
      else if(e.key==='ArrowDown')pitch=Math.min(.63,pitch+.10);
      else if(e.key==='+')scale=Math.min(2.15,scale*1.12);
      else if(e.key==='-')scale=Math.max(.67,scale/1.12);
      else changed=false;
      if(changed){e.preventDefault();e.stopPropagation();autoSpin=false;rootFrames.forEach(setToolbar);requestFrame();}
    });
    c.addEventListener('webglcontextlost',e=>{e.preventDefault();fail('WebGL-контекст потерян. Используйте 2D-схему.');});
  }
  function pick(event){
    if(!ready||!activeFrame)return;
    const rect=renderer.domElement.getBoundingClientRect();
    if(rect.width<1||rect.height<1)return;
    pointer.set(((event.clientX-rect.left)/rect.width)*2-1,-((event.clientY-rect.top)/rect.height)*2+1);
    raycaster.setFromCamera(pointer,camera);
    const hits=raycaster.intersectObjects(pivot.children,true);
    // When background meshes are translucent they can occlude; prefer opaque parts.
    for(const hit of hits){
      const name=hit.object.userData.neuroName,cat=hit.object.userData.neuroCategory;
      if(!name)continue;
      const id=activeFrame.dataset.brain3d;
      let key=null;
      if(id==='architecture')key=['cerebellum','stem'].includes(cat)?cat:'cerebrum';
      if(id==='lobes')key=['frontal','parietal','temporal','occipital','insula'].includes(cat)?cat:null;
      if(id==='deep'){
        for(const k of ['thalamus','hypothalamus','pituitary','midbrain'])if(hasMesh(name,k)){key=k;break;}
      }
      if(id==='stem'){
        for(const k of ['midbrain','pons','medulla','cerebellum'])if(hasMesh(name,k)){key=k;break;}
      }
      if(!key)continue;
      const btn=document.querySelector(`#${id} .region-chip[data-select="${key}"]`);
      if(btn)btn.click();
      break;
    }
  }
  function applyMaterials(){
    if(!ready||!activeFrame)return;
    const slide=activeFrame.dataset.brain3d;
    const key=selectedBySlide[slide]||null;
    for(const p of materialList){
      const target=key===null;
      let hit=false;
      if(!key)hit=true;
      else if(slide==='architecture'&&key==='cerebrum')hit=!['cerebellum','stem'].includes(p.cat);
      else if(slide==='architecture')hit=p.cat===key;
      else hit=hasMesh(p.name,key);
      const m=p.mate;
      const clr=colors[key]||colors[p.cat]||0xa7bcbf;
      m.color.setHex(hit?clr:0xaebfc6);
      m.emissive.setHex(hit?clr:0x3f575d);
      m.emissiveIntensity=hit?(target?.15:.31):0;
      m.opacity=hit?1:.085;
      m.depthWrite=hit;
      m.wireframe=false;
      m.needsUpdate=true;
      // Silhouette of the remaining brain remains perceptible as a ghosted shell.
    }
  }
  function selectForActive(){
    if(!activeFrame)return;
    const slide=activeFrame.dataset.brain3d;
    if(slide==='deep'&&selectedBySlide[slide]==='callosum'){
      toggleFallback(activeFrame,true);
      status(activeFrame,'Мозолистое тело не выделено отдельным мешем в этой открытой модели. Показана учебная 2D-схема.');
      return;
    }
    if(ready){status(activeFrame,'');if(!activeFrame.dataset.manual2d)toggleFallback(activeFrame,false);applyMaterials();requestFrame();}
  }
  function handleSelection(detail){
    const {slide,key}=detail||{};if(!rootFrames.some(el=>el.dataset.brain3d===slide))return;
    selectedBySlide[slide]=key;
    if(activeFrame?.dataset.brain3d===slide){
      if(key!=='callosum'&&activeFrame.dataset.manual2d){/* honor 2D explicit choice */}
      else if(key!=='callosum')delete activeFrame.dataset.manual2d;
      selectForActive();
    }
  }
  function renderStep(now){
    raf=0;if(!ready||!renderer||!visible()||activeFrame.classList.contains('is-2d'))return;
    if(!document.hidden&&autoSpin&&!isDragging&&lastFrame)yaw+=(Math.min(now-lastFrame,50)/1000)*.21;
    lastFrame=now;
    pivot.rotation.y=yaw;pivot.rotation.x=pitch;
    pivot.scale.setScalar((2.45/Math.max(modelBounds.getSize(new T.Vector3()).x,modelBounds.getSize(new T.Vector3()).y,modelBounds.getSize(new T.Vector3()).z,1e-8))*scale);
    renderer.render(model,camera);
    if(autoSpin&&!document.hidden)requestFrame();
  }
  function requestFrame(){if(!raf&&ready)raf=requestAnimationFrame(renderStep);}
  function resize(){if(!ready||!activeFrame)return;
    const host=$('.brain3d-host',activeFrame),r=host.getBoundingClientRect();
    if(r.width<10||r.height<10)return;
    renderer.setSize(Math.floor(r.width),Math.floor(r.height),false);
    camera.aspect=r.width/r.height;camera.updateProjectionMatrix();requestFrame();
  }
  function attachTo(frame){
    if(!ready||!frame)return;
    if(activeFrame!==frame){activeFrame=frame;$('.brain3d-host',frame).appendChild(renderer.domElement);}
    setToolbar(frame);resize();selectForActive();
  }
  function attachVisible(){
    if(!ready)return;
    const activeId=document.querySelector('#deck .scene:not([hidden])')?.id||'intro';
    if(currentMode==='presentation')attachTo(rootFrames.find(f=>f.dataset.brain3d===activeId)||null);
    else attachNearest();
  }
  function attachNearest(){
    if(!ready||currentMode!=='explore')return;
    const choices=rootFrames.map(f=>({f,rect:f.getBoundingClientRect()})).filter(x=>x.rect.bottom>20&&x.rect.top<innerHeight);
    if(choices.length){choices.sort((a,b)=>Math.abs((a.rect.top+a.rect.bottom)/2-innerHeight/2)-Math.abs((b.rect.top+b.rect.bottom)/2-innerHeight/2));attachTo(choices[0].f);}
  }
  function resetView(){yaw=-.5;pitch=-.1;scale=1;requestFrame();}
  for(const frame of rootFrames){
    const id=frame.dataset.brain3d;
    $('[data-brain-tool="spin"]',frame)?.addEventListener('click',()=>{autoSpin=!autoSpin;rootFrames.forEach(setToolbar);requestFrame()});
    $('[data-brain-tool="reset"]',frame)?.addEventListener('click',resetView);
    $('[data-brain-tool="2d"]',frame)?.addEventListener('click',()=>{
      const to2d=!frame.classList.contains('is-2d');
      if(to2d)frame.dataset.manual2d='true';else delete frame.dataset.manual2d;
      toggleFallback(frame,to2d);if(!to2d){status(frame,'');requestFrame();}
    });
    // Fallback remains interactive through the pre-existing SVG and selectors.
  }
  document.addEventListener('neuro:select',e=>handleSelection(e.detail));
  document.addEventListener('neuro:slide',e=>{if(!ready)return;requestAnimationFrame(()=>{const f=rootFrames.find(x=>x.dataset.brain3d===e.detail.id);if(f)attachTo(f);else{activeFrame=null;cancelAnimationFrame(raf);raf=0;}})});
  document.addEventListener('neuro:mode',e=>{currentMode=e.detail.mode;requestAnimationFrame(()=>{attachVisible();requestFrame();})});
  document.addEventListener('visibilitychange',()=>{lastFrame=0;requestFrame()});
  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('scroll',()=>{if(currentMode==='explore')attachNearest()},{passive:true});
  resizeObserver=new ResizeObserver(()=>resize());rootFrames.forEach(frame=>resizeObserver.observe($('.brain3d-host',frame)));
  // Start asynchronously after the existing slide content and controls have mounted.
  startLoad();
}
