/**
 * Full-screen imported BodyParts3D model (CC BY-SA 2.1 JP).
 * No procedural anatomical geometry is used. Attribution in docs/ASSET_CREDITS.md.
 * One shared renderer; region meshes highlighted, other parts ghosted using Fresnel outlines.
 */
const MODEL_URLS=['./assets/brain.glb','https://raw.githubusercontent.com/Rickaym/brain-game/e4c2e6dc0df6976b33426f17c164c2c50c711587/public/models/brain.glb'];
const CORE_CDN='https://cdn.jsdelivr.net/npm/three@0.181.0/+esm';
const LOADER_CDN='https://cdn.jsdelivr.net/npm/three@0.181.0/examples/jsm/loaders/GLTFLoader.js/+esm';
const $=(s,r=document)=>r.querySelector(s);
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const targets={
 frontal:['superior-frontal-gyrus','middle-frontal-gyrus','inferior-frontal-gyrus','precentral-gyrus'],
 parietal:['postcentral-gyrus','superior-parietal-lobule','angular-gyrus','supramarginal-gyrus'],
 temporal:['posterior-part-of-superior-temporal-gyrus','subdivision-of-superior-temporal-gyrus','segment-of-gyrus-of-cerebral-hemisphere','segment-of-gyrus-of-cerebral-hemisphere-1','middle-temporal-gyrus','inferior-temporal-gyrus','fusiform-gyrus','parahippocampal-gyrus'],
 occipital:['occipital-lobe'],insula:['insula'],precentral:['precentral-gyrus'],postcentral:['postcentral-gyrus'],
 hippocampus:['hippocampus'],cerebellum:['cerebellum','cerebellum2'],
 midbrain:['midbrain','midbrain2','left-superior-colliculus','right-superior-colliculus','inferior-colliculus','right-inferior-colliculus'],
 pons:['pons','pons2'],medulla:['medulla-oblongata','medulla-oblongata2'],
 thalamus:['thalamus','thalamus-1'],hypothalamus:['hypothalamus','hypothalamus2'],pituitary:['pituitary-gland'],
 lateral:['left-lateral-ventricle','right-lateral-ventricle'],third:['third-ventricle'],fourth:['fourth-ventricle']
};
const palette={frontal:0xa18dea,parietal:0x4eb8a9,temporal:0xefaa75,occipital:0x70a2e0,insula:0xcd86c1,precentral:0x60b9ab,postcentral:0xecaf7b,
 cerebrum:0xa29bdb,cerebellum:0xeb9b7e,stem:0x53afb0,cortex:0xaaa0e4,hippocampus:0xb792d9,midbrain:0x53a8bf,pons:0x53c4b1,medulla:0x3c8da2,
 thalamus:0x64c8a5,hypothalamus:0xe8ac70,pituitary:0xe89097,dura:0x95b7df,arachnoid:0x66c1c4,pia:0xee9a95,
 lateral:0x73abe4,third:0x55c6bc,aqueduct:0xf2b26b,fourth:0xb195dc,subarachnoid:0x74baa5,forebrain:0xa497e2,hindbrain:0xf4a779};
const state={slide:'intro',key:'cerebrum',quizIndex:0,panelOpen:true};
const defaultViews={intro:[-.52,-.07],architecture:[-.95,-.08],lobes:[-.77,-.02],cortex:[-.9,-.17],deep:[1.55,.05],stem:[2.33,-.16],meninges:[-.26,.02],ventricles:[1.63,.08],development:[-.42,-.12],quiz:[-.8,-.06]};
const eligibleOptions={intro:['cerebrum','cerebellum','stem'],architecture:['cerebrum','cerebellum','stem'],lobes:['frontal','parietal','temporal','occipital','insula'],cortex:['cortex','precentral','postcentral','insula'],deep:['thalamus','hypothalamus','pituitary','hippocampus'],stem:['midbrain','pons','medulla','cerebellum'],ventricles:['lateral','third','aqueduct','fourth','subarachnoid'],development:['forebrain','midbrain','hindbrain']};
// BodyParts3D contains separate LEFT and RIGHT hemisphere meshes, e.g.
// `left-precentral-gyrus`, while our UI uses the shared anatomical term.
// The previous exact comparison missed those meshes, leaving the whole brain ghosted.
const matches=(name,which)=>{
 const requested=targets[which];
 if(!requested)return false;
 const full=String(name).toLowerCase().replace(/[_.\s]+/g,'-');
 const base=full.replace(/^(left|right)-/,'');
 return requested.some(part=>[full,base].some(n=>n===part||n===part+'-1'||n===part+'-2'));
};
const groups=['cerebellum','midbrain','pons','medulla','frontal','parietal','temporal','occipital','insula','thalamus','hypothalamus','pituitary','hippocampus','lateral','third','fourth'];
const category=(name)=>groups.find(g=>matches(name,g))||'other';
const stemNames=['midbrain','pons','medulla'];
function isHit(name,cat,key){
 if(!key)return true;
 if(key==='cerebrum')return !(['cerebellum',...stemNames].includes(cat));
 if(key==='stem')return stemNames.includes(cat);
 if(key==='cortex')return ['frontal','parietal','temporal','occipital','insula'].includes(cat);
 if(key==='forebrain')return !(['cerebellum',...stemNames].includes(cat));
 if(key==='hindbrain')return ['cerebellum','pons','medulla'].includes(cat);
 if(key==='aqueduct')return matches(name,'midbrain');
 if(key==='subarachnoid')return ['frontal','parietal','temporal','occipital','insula'].includes(cat);
 if(['dura','arachnoid','pia'].includes(key))return true;
 return matches(name,key);
}
function resolveQuizKey(i){return ['precentral','insula','cerebrum','cerebellum','pia','third','forebrain'][Math.max(0,Math.min(6,i))]}
function deriveKey(){return state.slide==='quiz'?resolveQuizKey(state.quizIndex):state.key;}
function pickedKey(name,cat){if(state.slide==='meninges'||state.slide==='quiz')return null;
 const available=eligibleOptions[state.slide]||[];
 // Prioritize the exact anatomical mesh over broad groups (e.g. cortex).
 const specific=available.find(opt=>targets[opt]&&matches(name,opt));
 if(specific)return specific;
 for(const opt of available){if(opt==='cortex'&&['frontal','parietal','temporal','occipital'].includes(cat))return opt;
  if(opt==='forebrain'&&isHit(name,cat,'forebrain'))return opt;
  if(opt==='hindbrain'&&isHit(name,cat,'hindbrain'))return opt;
  if(opt==='stem'&&stemNames.includes(cat))return opt;
  if(opt==='cerebrum'&&isHit(name,cat,'cerebrum'))return opt;
  if(isHit(name,cat,opt))return opt;
 }
 return null;
}
let Three,renderer,camera,scene,brainGroup,sourceGroup,pivot,ghostMaterial,meshes=[],colorMaterials=new Map();
let running=false,ready=false,spin=!reduced,dragging=false,moved=false,previous={x:0,y:0},pointerStart={x:0,y:0},pointerId=null;
let aimYaw=-.52,aimPitch=-.07,yaw=-.52,pitch=-.07,zoom=1,targetZoom=1,clock=0,raf=0;
let baseScale=1,tweenColor=null,hovered=null,lastSlide='intro',contextLost=false;
function message(ok,text){document.dispatchEvent(new CustomEvent('neuro:loaded',{detail:{ok,message:text}}));}
async function importDeps(){
 try{const T=await import('three');const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');return {T,GLTFLoader};}
 catch(e){console.info('Vendor Three.js unavailable, trying pinned CDN.',e.message);}
 const T=await import(CORE_CDN);const {GLTFLoader}=await import(LOADER_CDN);return {T,GLTFLoader};
}
function colorMat(hex){
 if(!colorMaterials.has(hex))colorMaterials.set(hex,new Three.MeshStandardMaterial({
  color:hex,roughness:.77,metalness:.03,side:Three.DoubleSide,
  emissive:hex,emissiveIntensity:.52,
  // Both ghost and selected meshes must share the transparent render queue.
  // The selected region is drawn LAST (renderOrder) so small/deep parts remain
  // visible THROUGH the faint outline of the surrounding anatomy.
  transparent:true,opacity:1,depthWrite:false,depthTest:false
 }));
 return colorMaterials.get(hex);
}
function baseGhost(){return new Three.ShaderMaterial({
 transparent:true,depthWrite:false,depthTest:true,side:Three.DoubleSide,uniforms:{uColor:{value:new Three.Color(0x6a9b98)},uAlpha:{value:1}},
 vertexShader:`varying vec3 vNormal;varying vec3 vView;void main(){vec4 world=modelMatrix*vec4(position,1.);vec4 eye=viewMatrix*world;vNormal=normalize(normalMatrix*normal);vView=normalize(-eye.xyz);gl_Position=projectionMatrix*eye;}`,
 fragmentShader:`uniform vec3 uColor;uniform float uAlpha;varying vec3 vNormal;varying vec3 vView;void main(){float rim=pow(1.-abs(dot(normalize(vNormal),normalize(vView))),3.6);float a=(.012+rim*.24)*uAlpha;gl_FragColor=vec4(uColor,a);}`
 });}
function loadGLB(url,loader){return new Promise((resolve,reject)=>{
 const timer=setTimeout(()=>reject(new Error('GLB timeout')),20000);
 loader.load(url,data=>{clearTimeout(timer);resolve(data)},undefined,error=>{clearTimeout(timer);reject(error)});
 });}
async function loadAsset(loader){for(const u of MODEL_URLS){try{return await loadGLB(u,loader);}catch(e){console.warn('GLB source unavailable:',u,e);}}
 throw Error('Model not available from local assets or source repo.');}
async function init(){try{
 if(!window.WebGLRenderingContext)throw Error('WebGL недоступен в этом браузере.');
 const {T,GLTFLoader}=await importDeps();Three=T;
 renderer=new Three.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));
 renderer.setClearColor(0xe8f1ef,0);renderer.outputColorSpace=Three.SRGBColorSpace;
 renderer.toneMapping=Three.ACESFilmicToneMapping;renderer.toneMappingExposure=1.33;
 const container=$('#brainCanvas');container.appendChild(renderer.domElement);
 renderer.domElement.setAttribute('tabindex','0');renderer.domElement.setAttribute('aria-label','3D-атлас головного мозга: вращайте перетаскиванием, масштабируйте колёсиком.');
 scene=new Three.Scene();
 scene.add(new Three.HemisphereLight(0xffffff,0xa9c4bf,2.6));
 const light=new Three.DirectionalLight(0xffffff,2.6);light.position.set(-3,6,8);scene.add(light);
 const fill=new Three.DirectionalLight(0xc1e5df,1.65);fill.position.set(4,-2,-4);scene.add(fill);
 camera=new Three.PerspectiveCamera(34,1,.01,100);camera.position.set(0,0,6.75);
 const glb=await loadAsset(new GLTFLoader());
 sourceGroup=new Three.Group();sourceGroup.rotation.x=-Math.PI/2;sourceGroup.add(glb.scene);scene.updateMatrixWorld(true);
 const bounds=new Three.Box3().setFromObject(sourceGroup);
 if(bounds.isEmpty())throw Error('В GLB нет видимых анатомических сеток');
 const size=bounds.getSize(new Three.Vector3());baseScale=3.6/Math.max(size.x,size.y,size.z,.001);
 sourceGroup.position.sub(bounds.getCenter(new Three.Vector3()));
 pivot=new Three.Group();pivot.add(sourceGroup);pivot.scale.setScalar(baseScale);
 brainGroup=new Three.Group();brainGroup.add(pivot);scene.add(brainGroup);
 ghostMaterial=baseGhost();
 glb.scene.traverse(obj=>{
  if(!obj.isMesh)return;
  const name=obj.name.toLowerCase(),cat=category(name);
  obj.userData.regionName=name;obj.userData.regionCat=cat;
  if(obj.geometry && !obj.geometry.getAttribute('normal'))obj.geometry.computeVertexNormals();
  meshes.push({obj,name,cat,active:false});
 });
 if(meshes.length<12)throw Error('GLB не содержит ожидаемую сегментированную анатомию');
 const absent=Object.keys(targets).filter(which=>!meshes.some(p=>matches(p.name,which)));
 if(absent.length)console.warn('[NEURO 3D] Region names absent in model:',absent);
 applyFocus();resize();attachPointer();ready=true;request();message(true,'');
 }catch(e){console.warn('[NEURO cinematic 3D]',e);message(false,'3D не загрузилась; доступна учебная 2D-схема. Для офлайн-работы модели запустите скрипт установки.');}}
function applyFocus(){if(!meshes.length)return;
 const key=deriveKey();const conceptual=state.slide==='meninges';
 let highlighted=0;
 for(const p of meshes){let hit=isHit(p.name,p.cat,key);
  if(conceptual){hit=p.cat!=='other' && !['lateral','third','fourth'].includes(p.cat);}
  if(conceptual&&key==='arachnoid')hit=false;
  p.active=hit;
  const color=palette[key]||palette[p.cat]||0xa1b9ba;
  p.obj.material=hit?colorMat(color):ghostMaterial;
  // The atlas contains overlapping meshes. Rendering the chosen meshes after
  // ghost meshes makes the actual part visible instead of hiding in the wire-like
  // silhouette, including the insula and hippocampus inside the hemispheres.
  p.obj.renderOrder=hit?20:0;
  if(hit)highlighted++;
 }
 if(state.slide==='meninges'&&key==='arachnoid')ghostMaterial.uniforms.uAlpha.value=.75;
 else if(state.slide==='meninges'&&key==='dura')ghostMaterial.uniforms.uAlpha.value=.34;
 else if(['insula','hippocampus','thalamus','hypothalamus','pituitary'].includes(key))ghostMaterial.uniforms.uAlpha.value=.2;
 else ghostMaterial.uniforms.uAlpha.value=.37;
 if(!highlighted&&key!=='arachnoid')console.warn('[NEURO 3D] No matching GLB meshes for',key,'on slide',state.slide);
 request();}
function targetView(){const v=defaultViews[state.slide]||[-.5,0];aimYaw=v[0];aimPitch=v[1];
 if(state.key==='insula'||state.key==='hippocampus'||state.key==='thalamus'||state.key==='hypothalamus'||state.key==='pituitary')aimYaw=1.45;
 if(state.key==='cerebellum'||state.key==='pons'||state.key==='medulla')aimYaw=2.25;
}
function request(){if(!raf && renderer && ready && !document.hidden&&!contextLost)raf=requestAnimationFrame(frame);}
function frame(time){raf=0;const dt=Math.min(.05,(time-clock)/1000||.016);clock=time;
 if(!renderer||!ready||document.hidden)return;
 if(!dragging){const d=((aimYaw-yaw+Math.PI*3)%(2*Math.PI))-Math.PI;
   yaw+=d*.055; pitch+=(aimPitch-pitch)*.07;
   if(spin)aimYaw+=dt*.082;
 }
 zoom+=(targetZoom-zoom)*.12;
 pivot.rotation.set(pitch,yaw,0);
 pivot.scale.setScalar(baseScale*zoom*responsiveScale());
 brainGroup.position.x+=(offsetX()-brainGroup.position.x)*.09;
 renderer.render(scene,camera);
 if(spin||Math.abs(aimYaw-yaw)>.001||Math.abs(aimPitch-pitch)>.001||Math.abs(targetZoom-zoom)>.001||Math.abs(offsetX()-brainGroup.position.x)>.001)request();
}
function responsiveScale(){return innerWidth<600?.64:innerWidth<950?.78:1;}
function offsetX(){if(!state.panelOpen)return 0;return innerWidth<600?.44:innerWidth<950?.76:1.04;}
function resize(){if(!renderer)return;const r=$('#brainCanvas').getBoundingClientRect();if(!r.width||!r.height)return;
 renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();request();}
function pointerPick(e){if(!ready)return;
 const rect=renderer.domElement.getBoundingClientRect();if(!rect.width)return;
 const p=new Three.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
 const ray=new Three.Raycaster();ray.setFromCamera(p,camera);
 // Only front-visible anatomical parts count. Do not select unrelated ghost surfaces.
 const hits=ray.intersectObjects(pivot.children,true);
 for(const hit of hits){const obj=hit.object;if(!obj?.userData?.regionName)continue;
  const key=pickedKey(obj.userData.regionName,obj.userData.regionCat);
  if(key){document.dispatchEvent(new CustomEvent('neuro:picked',{detail:{key}}));break;}
 }
}
function attachPointer(){const c=renderer.domElement;
 c.addEventListener('pointerdown',e=>{if(e.button!==0&&e.pointerType==='mouse')return;dragging=true;moved=false;pointerId=e.pointerId;previous={x:e.clientX,y:e.clientY};pointerStart={...previous};c.setPointerCapture(e.pointerId);});
 c.addEventListener('pointermove',e=>{if(!dragging||e.pointerId!==pointerId)return;
  const dx=e.clientX-previous.x,dy=e.clientY-previous.y;
  if(Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)>5)moved=true;
  aimYaw=yaw+=dx*.008;aimPitch=pitch=Math.min(.6,Math.max(-.6,pitch+dy*.006));previous={x:e.clientX,y:e.clientY};request();});
 c.addEventListener('pointerup',e=>{if(!dragging||e.pointerId!==pointerId)return;dragging=false;pointerId=null;if(!moved)pointerPick(e);request();});
 c.addEventListener('pointercancel',()=>{dragging=false;pointerId=null;request()});
 c.addEventListener('wheel',e=>{e.preventDefault();targetZoom=Math.min(2.15,Math.max(.56,targetZoom*(e.deltaY>0?.91:1.09)));request();},{passive:false});
 c.addEventListener('webglcontextlost',e=>{e.preventDefault();contextLost=true;message(false,'WebGL-контекст потерян: показана учебная схема.');});
 c.addEventListener('webglcontextrestored',()=>{contextLost=false;message(true,'');request()});
}
document.addEventListener('neuro:scene',e=>{
 const s=e.detail||{};const changed=s.slide!==state.slide;
 state.slide=s.slide||'intro';state.key=s.key||'cerebrum';state.quizIndex=Number.isFinite(s.quizIndex)?s.quizIndex:0;state.panelOpen=s.panelOpen!==false;
 if(changed)targetView();
 else if(['deep','architecture','stem','lobes','cortex','ventricles','development'].includes(state.slide))targetView();
 applyFocus();request();
});
document.addEventListener('neuro:control',e=>{
 const id=e.detail?.id;if(id==='spin'){spin=!spin;request()}
 if(id==='reset'){const v=defaultViews[state.slide]||[-.52,-.07];aimYaw=v[0];aimPitch=v[1];targetZoom=1;request()}
 if(id==='zoom-in'){targetZoom=Math.min(2.15,targetZoom*1.2);request()}
 if(id==='zoom-out'){targetZoom=Math.max(.56,targetZoom/1.2);request()}
});
window.addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',()=>{clock=0;request()});
if(window.neuroState){state.slide=window.neuroState.getSlide();state.key=window.neuroState.getKey()||'cerebrum';state.quizIndex=window.neuroState.getQuizIndex();targetView();}
init();
