/* NEURO 3D · полноэкранный образовательный режим. 3D-геометрия — BodyParts3D (см. docs/ASSET_CREDITS.md). */
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const names = {
 cerebrum:'Большой мозг',cerebellum:'Мозжечок',stem:'Ствол мозга',
 frontal:'Лобная доля',parietal:'Теменная доля',temporal:'Височная доля',occipital:'Затылочная доля',insula:'Островковая доля',
 cortex:'Кора и извилины',precentral:'Прецентральная извилина',postcentral:'Постцентральная извилина',hippocampus:'Гиппокамп',
 thalamus:'Таламус',hypothalamus:'Гипоталамус',pituitary:'Гипофиз',midbrain:'Средний мозг',pons:'Мост',medulla:'Продолговатый мозг',
 dura:'Твёрдая оболочка',arachnoid:'Паутинная оболочка',pia:'Мягкая оболочка',
 lateral:'Боковые желудочки',third:'III желудочек',aqueduct:'Водопровод мозга',fourth:'IV желудочек',subarachnoid:'Подпаутинное пространство',
 forebrain:'Передний мозговой пузырь',hindbrain:'Задний мозговой пузырь'
};
const selections = {
 intro:['cerebrum','cerebellum','stem'],architecture:['cerebrum','cerebellum','stem'],
 lobes:['frontal','parietal','temporal','occipital','insula'],
 cortex:['cortex','precentral','postcentral','insula'],
 deep:['thalamus','hypothalamus','pituitary','hippocampus'],
 stem:['midbrain','pons','medulla','cerebellum'],
 meninges:['dura','arachnoid','pia'],
 ventricles:['lateral','third','aqueduct','fourth','subarachnoid'],
 development:['forebrain','midbrain','hindbrain']
};
const colors={cerebrum:'#938ac7',cerebellum:'#e9a17c',stem:'#308e92',frontal:'#9b8ce8',parietal:'#47afa3',temporal:'#ec9b6c',occipital:'#6b9cda',insula:'#bc78b5',cortex:'#837ccc',precentral:'#56b3a4',postcentral:'#edac72',thalamus:'#54b28f',hypothalamus:'#e3a166',pituitary:'#e28081',hippocampus:'#ab83cc',midbrain:'#328aa4',pons:'#59b8ad',medulla:'#206e80',dura:'#8ca8cf',arachnoid:'#58bcbc',pia:'#e68b88',lateral:'#63a5d1',third:'#60bbbe',aqueduct:'#dca666',fourth:'#ac86d0',subarachnoid:'#5ea79a',forebrain:'#9587d3',hindbrain:'#ea9c71'};
const cortexDetail={
 cortex:{tag:'Кора больших полушарий',title:'Кора и её складки',body:'Кора — наружный слой серого вещества. Извилины (gyri) разделены бороздами (sulci); ниже располагается белое вещество.'},
 precentral:{tag:'Gyrus precentralis',title:'Прецентральная извилина',body:'Находится спереди от центральной борозды в лобной доле. Здесь располагается первичная моторная кора.'},
 postcentral:{tag:'Gyrus postcentralis',title:'Постцентральная извилина',body:'Лежит сзади от центральной борозды в теменной доле; содержит первичную соматосенсорную кору.'},
 insula:details.lobes.insula
};
details.deep.hippocampus={title:"Гиппокамп",tag:"Hippocampus",body:"Парная структура медиальной височной области, участвующая в формировании эпизодической памяти. Она находится глубже наружной поверхности полушария."};
const introDetail={
 cerebrum:{tag:'01 · Полушария',title:'Большой мозг',body:'Составляет основной объём головного мозга. Покрыт корой с бороздами и извилинами; содержит белое вещество и глубокие ядра.'},
 cerebellum:details.overview.cerebellum,stem:details.overview.stem
};
const ventDetails={lateral:flowData[0],third:flowData[1],aqueduct:flowData[2],fourth:flowData[3],subarachnoid:flowData[4]};
const allDetails={intro:introDetail,architecture:details.overview,lobes:details.lobes,cortex:cortexDetail,deep:details.deep,stem:details.stem,meninges:details.meninges,ventricles:ventDetails,development:details.embryo};
const initialKeys={intro:'cerebrum',architecture:'cerebrum',lobes:'frontal',cortex:'cortex',deep:'thalamus',stem:'midbrain',meninges:'dura',ventricles:'lateral',development:'forebrain'};
const selected={...initialKeys};
const qs={index:0,chosen:null,score:0};
const userPrefersReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let index=Math.max(0,slides.findIndex(s=>'#'+s.id===location.hash)),panelOpen=true;
const root=$('#experience');
window.neuroState={getSlide:()=>slides[index].id,getKey:()=>selected[slides[index].id],getQuizIndex:()=>qs.index,getIndex:()=>index};
function sceneSpec(){
 const slide=slides[index].id;
 return {slide,key:selected[slide]||null,quizIndex:qs.index, panelOpen};
}
function signal(){document.dispatchEvent(new CustomEvent('neuro:scene',{detail:sceneSpec()}));}
function detailFor(slide,key){return allDetails[slide]?.[key]||null;}
function drawOptions(slide){let keys=selections[slide];if(!keys)return '';
 return `<div class="section-label">${slide==='meninges'?'Условная визуализация слоёв':slide==='development'?'Анатомические производные':slide==='ventricles'?'Путь движения ликвора':slide==='intro'?'Исследуйте модель':'Выберите структуру'}</div><div class="region-options" role="group" aria-label="Выделить часть мозга">${keys.map((key,i)=>`<button type="button" class="region-option" data-pick="${key}" aria-pressed="${selected[slide]===key}"><span class="region-mark" style="--dot-color:${colors[key]||'#619d96'}"></span><span>${names[key]}</span><span class="option-index">${String(i+1).padStart(2,'0')}</span></button>`).join('')}</div><section class="focus-detail" aria-live="polite" id="detailPanel"></section>${slide==='meninges'?'<p class="callout">В исходном GLB нет отдельных сеток оболочек. Переключение показывает условный цветовой акцент на поверхности мозга, не форму оболочки.</p>':''}${slide==='development'?'<p class="callout">Это отделы мозга взрослого человека. Подсветка показывает их эмбриональное происхождение, а не форму эмбриональных пузырей.</p>':''}${slide==='ventricles'?'<p class="callout">Водопровод и субарахноидальное пространство не имеют отдельных достоверных мешей в этой модели: соответствующая подсветка условна.</p>':''}`;
}
function focusHTML(slide,key){const d=detailFor(slide,key);if(!d)return '';
 return `<div class="focus-tag">${d.tag||'АНАТОМИЧЕСКАЯ СТРУКТУРА'}</div><h3>${d.title||names[key]}</h3><p>${d.body||''}</p>`;
}
function drawQuiz(){
 if(qs.index>=quiz.length){const pct=Math.round(100*qs.score/quiz.length);
  return `<div class="section-label">Завершение</div><div class="quiz-question">${qs.score} / ${quiz.length} — ${pct}% правильных ответов</div><p class="lesson-lead">${pct===100?'Все вопросы решены верно.':'Повторите основные структуры на предыдущих слайдах и попробуйте снова.'}</p><button class="quiz-next" type="button" id="quizRestart">Пройти снова ↻</button>`;
 }
 const q=quiz[qs.index];return `<div class="quiz-progress">ВОПРОС ${String(qs.index+1).padStart(2,'0')} / ${quiz.length} · ПРАВИЛЬНО ${qs.score}</div><div class="quiz-question">${q.q}</div><div class="quiz-answers">${q.answers.map((a,i)=>`<button type="button" class="quiz-choice ${qs.chosen!==null?(i===q.correct?'correct':i===qs.chosen?'wrong':''):''}" data-answer="${i}" ${qs.chosen!==null?'disabled':''}>${String.fromCharCode(65+i)} · ${a}</button>`).join('')}</div>${qs.chosen===null?'':`<div class="quiz-result"><b>${qs.chosen===q.correct?'Верно.':'Правильный ответ: '+q.answers[q.correct]+'.'}</b> ${q.why}</div><button class="quiz-next" type="button" id="quizNext">${qs.index===quiz.length-1?'Посмотреть результат →':'Следующий вопрос →'}</button>`}`;
}
function renderQuizOnly(){const el=$('#quizBody');if(!el)return;el.innerHTML=drawQuiz();
 $('#sceneCaption').innerHTML=`<strong>${qs.index>=quiz.length?'РЕЗУЛЬТАТ':`ВОПРОС ${qs.index+1} / ${quiz.length}`}</strong><span>3D подсветка меняется вместе с вопросом</span>`;
 $$('[data-answer]',el).forEach(btn=>btn.addEventListener('click',()=>{if(qs.chosen!==null)return;qs.chosen=+btn.dataset.answer;if(qs.chosen===quiz[qs.index].correct)qs.score++;renderQuizOnly();signal()}));
 $('#quizNext',el)?.addEventListener('click',()=>{qs.index++;qs.chosen=null;renderQuizOnly();signal()});
 $('#quizRestart',el)?.addEventListener('click',()=>{qs.index=0;qs.chosen=null;qs.score=0;renderQuizOnly();signal()});
}
function render(){const slide=slides[index];const hasInteractive=!!selections[slide.id];
 $('#lessonInner').innerHTML=`<div class="eyebrow">${slide.eyebrow}</div><h1 class="lesson-title">${slide.title}</h1><p class="lesson-lead">${slide.lead}</p>${hasInteractive?drawOptions(slide.id):'<div class="section-label">Проверьте свои знания</div><div id="quizBody"></div>'}`;
 $('#lessonPanel').scrollTop=0;
 if(hasInteractive){for(const btn of $$('[data-pick]'))btn.addEventListener('click',()=>select(btn.dataset.pick));
  updateDetail();}
 else renderQuizOnly();
 $('#slideCount').innerHTML=`${String(index+1).padStart(2,'0')} <span>/ ${String(slides.length).padStart(2,'0')}</span>`;
 $('#slideName').textContent=slide.short;
 $('#backButton').disabled=index===0;$('#forwardButton').disabled=index===slides.length-1;
 $$('.chapter-dot').forEach((b,i)=>i===index?b.setAttribute('aria-current','step'):b.removeAttribute('aria-current'));
 history.replaceState(null,'','#'+slide.id);
 signal();
}
function updateDetail(){const s=slides[index].id;const key=selected[s];
 $$('[data-pick]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pick===key)));
 const dp=$('#detailPanel');if(dp)dp.innerHTML=focusHTML(s,key);
 const captionKey=key ? names[key]:slides[index].short;
 $('#sceneCaption').innerHTML=`<strong>${captionKey?.toUpperCase()||'МОЗГ'}</strong><span>потяните для вращения · колёсико для масштаба</span>`;
}
function select(key){const slide=slides[index].id;if(!selections[slide]?.includes(key))return;selected[slide]=key;updateDetail();signal();}
function navigate(to){if(!Number.isFinite(to))return;index=Math.max(0,Math.min(slides.length-1,Math.round(to)));render();}
function togglePanel(){panelOpen=!panelOpen;root.dataset.panel=panelOpen?'open':'closed';$('#togglePanel').setAttribute('aria-expanded',String(panelOpen));$('#togglePanel').setAttribute('aria-label',panelOpen?'Скрыть текст':'Показать текст');$('#togglePanel').innerHTML=panelOpen?'◧ <span>Скрыть текст</span>':'◨ <span>Показать текст</span>';signal();}
const canvasControl=id=>document.dispatchEvent(new CustomEvent('neuro:control',{detail:{id}}));
function toggleFullscreen(){if(document.fullscreenElement){document.exitFullscreen().catch(()=>{});}else{document.documentElement.requestFullscreen?.().catch(()=>{});}}
function openModal(kind){const d=$('#infoDialog');$('#dialogTitle').textContent=kind==='sources'?'Научные источники':'Заметки ведущего';
 if(kind==='notes'){$('#dialogBody').innerHTML=`<p class="callout">Заметки в этом окне видны на проекторе, если вы показываете этот же экран.</p><p></p>`;$('#dialogBody p:last-child').textContent=slides[index].notes;}
 else{$('#dialogBody').innerHTML=`<p>3D-геометрия основана на открытой модели BodyParts3D © The Database Center for Life Science, CC BY-SA 2.1 Japan. Меши собраны автором Brain Anatomy Game (Pyae Sone Myo). Лицензия требует указания авторства и сохранения ShareAlike для модифицированной модели.</p><p><a href="https://github.com/Rickaym/brain-game" target="_blank" rel="noopener noreferrer">Репозиторий модели</a> · <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html" target="_blank" rel="noopener noreferrer">Лицензия данных</a></p><ol>${sources.map(s=>`<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label}</a> — ${s.note}</li>`).join('')}</ol>`;}
 if(!d.open)d.showModal();}
$('#timeline').innerHTML=slides.map((s,i)=>`<button type="button" class="chapter-dot" data-index="${i}" aria-label="${i+1}. ${s.short}" title="${s.short}"></button>`).join('');
$$('.chapter-dot').forEach(b=>b.addEventListener('click',()=>navigate(+b.dataset.index)));
$('#togglePanel').addEventListener('click',togglePanel);
$('#backButton').addEventListener('click',()=>navigate(index-1));$('#forwardButton').addEventListener('click',()=>navigate(index+1));
$('#notesButton').addEventListener('click',()=>openModal('notes'));
$('#sourcesButton').addEventListener('click',()=>openModal('sources'));
$('#fullscreenButton').addEventListener('click',toggleFullscreen);
$('#closeDialog').addEventListener('click',()=>$('#infoDialog').close());
$('#infoDialog').addEventListener('click',e=>{if(e.target===$('#infoDialog'))e.target.close()});
[['spinButton','spin'],['resetButton','reset'],['zoomIn','zoom-in'],['zoomOut','zoom-out']].forEach(([id,command])=>$('#'+id).addEventListener('click',()=>{canvasControl(command);if(command==='spin'){$('#spinButton').setAttribute('aria-pressed',String($('#spinButton').getAttribute('aria-pressed')!=='true'));}}));
document.addEventListener('neuro:picked',e=>{const key=e.detail.key;if(key)select(key)});
document.addEventListener('neuro:loaded',e=>{root.dataset.loaded=String(e.detail.ok);if(!e.detail.ok)$('#modelStatus').textContent=e.detail.message||'3D недоступна. Показана 2D-схема.';});
document.addEventListener('keydown',e=>{
 if(e.altKey||e.metaKey||e.ctrlKey||e.isComposing)return;
 if($('#infoDialog').open)return;
 const el=e.target;
 const editing=el?.matches?.('input,textarea,select,[contenteditable],button,a');
 if(editing)return;
 if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();navigate(index+1)}
 if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();navigate(index-1)}
 if(e.key.toLowerCase()==='h'){e.preventDefault();togglePanel()}
 if(e.key.toLowerCase()==='n'){e.preventDefault();openModal('notes')}
 if(e.key.toLowerCase()==='f'){e.preventDefault();toggleFullscreen()}
});
try{$('#fallbackArt').innerHTML=lateralSVG('full-screen-backup','overview').replace(/tabindex="0"/g,'').replace(/role="button"/g,'').replace(/data-region="[^"]+"/g,'');}catch(e){console.warn('SVG fallback unavailable',e)}
render();
})();
