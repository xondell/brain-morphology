/** Regression check against canonical OBJ identifiers from
 * zlatnaspirala/anatomy-system/systems/optimisation-157/Nervous/cns.
 * The GLB uses these identifiers as its mesh/node names. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const src = fs.readFileSync(path.join(__dirname,'../brain3d.js'),'utf8');
const point = src.indexOf('let Three,renderer');
assert(point>1000,'Cannot find 3D region mapping definitions');
const code = src.slice(0,point) + '\n globalThis._test={matches,category,isHit,pickedKey,state};';
const context={matchMedia:()=>({matches:false})};
vm.runInNewContext(code,context,{timeout:1000,filename:'brain3d.js'});
const {matches,category,isHit,pickedKey,state}=context._test;
const cases={
 frontal:['left-superior-frontal-gyrus','right-superior-frontal-gyrus','left-middle-frontal-gyrus','right-middle-frontal-gyrus','left-inferior-frontal-gyrus','right-inferior-frontal-gyrus','left-precentral-gyrus','right-precentral-gyrus'],
 parietal:['left-postcentral-gyrus','right-postcentral-gyrus','left-superior-parietal-lobule','right-superior-parietal-lobule','left-angular-gyrus','right-angular-gyrus','left-supramarginal-gyrus','right-supramarginal-gyrus'],
 temporal:['left-middle-temporal-gyrus','right-middle-temporal-gyrus','left-inferior-temporal-gyrus','right-inferior-temporal-gyrus','left-fusiform-gyrus','right-fusiform-gyrus','left-parahippocampal-gyrus','right-parahippocampal-gyrus','posterior-part-of-superior-temporal-gyrus','subdivision-of-superior-temporal-gyrus','segment-of-gyrus-of-cerebral-hemisphere','segment-of-gyrus-of-cerebral-hemisphere-1'],
 occipital:['left-occipital-lobe','right-occipital-lobe'],
 insula:['left-insula','right-insula'],
 precentral:['left-precentral-gyrus','right-precentral-gyrus'],
 postcentral:['left-postcentral-gyrus','right-postcentral-gyrus'],
 hippocampus:['left-hippocampus','right-hippocampus'],
 cerebellum:['cerebellum','cerebellum2'],
 thalamus:['thalamus','thalamus-1'],
 hypothalamus:['hypothalamus','hypothalamus2'],
 pituitary:['pituitary-gland'],
 pons:['pons','pons2'],
 medulla:['medulla-oblongata','medulla-oblongata2']
};
let checks=0;
for(const [key,names] of Object.entries(cases)){
 for(const name of names){
   assert(matches(name,key),`Expected ${name} to be matched for ${key}`);
   assert(isHit(name,category(name),key),`Expected ${name} to be highlighted for ${key}`);
   checks+=2;
 }
 console.log(`✓ ${key}: ${names.length} original BodyParts3D meshes`);
}
assert.equal(matches('right-hippocampus','occipital'),false);
assert.equal(matches('left-insula','frontal'),false);
for(const [slide,names,selected] of [
 ['lobes',['left-insula','left-occipital-lobe','left-superior-parietal-lobule','right-inferior-frontal-gyrus'],['insula','occipital','parietal','frontal']],
 ['cortex',['left-precentral-gyrus','right-postcentral-gyrus','left-insula'],['precentral','postcentral','insula']],
 ['deep',['left-hippocampus','right-hippocampus'],['hippocampus','hippocampus']]
]){
 state.slide=slide;
 names.forEach((name,i)=>{assert.equal(pickedKey(name,category(name)),selected[i]);checks++});
}
// Exercise the real applyFocus() with mock mesh/material objects (no WebGL needed).
const a=src.indexOf('function applyFocus(){');
const b=src.indexOf('function targetView(){',a);
assert(a>0 && b>a,'Cannot find highlight renderer');
const mock={
 meshes:[], ghostMaterial:{uniforms:{uAlpha:{value:1}}},
 colorMat:hex=>({hex,transparent:true,depthTest:false}),
 palette:{frontal:0xa18dea,parietal:0x4eb8a9,occipital:0x70a2e0,insula:0xcd86c1,hippocampus:0xb792d9},
 state:{slide:'lobes'}, key:'frontal',
 isHit,deriveKey(){return this.key},request(){},console
};
vm.runInNewContext(src.slice(a,b)+'\n globalThis.renderFocus=applyFocus;',mock);
for(const [key,names] of Object.entries(cases)){
 mock.state.slide=key==='hippocampus'?'deep':key==='precentral'||key==='postcentral'?'cortex':'lobes';
 mock.key=key;
 const fixtures=[...names,'cerebellum','midbrain','left-insula','left-hippocampus'];
 mock.meshes=fixtures.map(name=>({name,cat:category(name),obj:{}}));
 mock.renderFocus();
 const visible=mock.meshes.filter(p=>p.active);
 assert(visible.length>=names.length,`${key} produced no highlighted meshes`);
 for(const p of visible){
  assert.equal(p.obj.renderOrder,20,`${key} did not render selected part last`);
  assert.equal(p.obj.material.depthTest,false,`${key} failed X-ray visibility`);
 }
 for(const p of mock.meshes.filter(p=>!p.active))assert.equal(p.obj.renderOrder,0);
 checks++;
}
console.log(`PASS: ${checks} anatomical mapping, picking & focus checks`);

