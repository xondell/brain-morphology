/* NEURO — интерактивная учебная веб-презентация. Работает без сети. */
(() => {
'use strict';
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const sources = [
  {label:'NCBI Bookshelf · The Lateral Surface of the Brain', url:'https://www.ncbi.nlm.nih.gov/books/NBK10811/', note:'Доли полушарий, центральная и латеральная борозды, островок, топография.'},
  {label:'NCBI Bookshelf · The Anatomy of the Cerebral Cortex', url:'https://www.ncbi.nlm.nih.gov/books/NBK575742/', note:'Извилины, борозды, внешние анатомические ориентиры коры.'},
  {label:'Cleveland Clinic · Brain: Parts, Function, How It Works', url:'https://my.clevelandclinic.org/health/body/22638-brain', note:'Макроотделы, мозжечок, ствол, таламус, гипоталамус.'},
  {label:'Cleveland Clinic · Cerebrum', url:'https://my.clevelandclinic.org/health/body/23083-cerebrum', note:'Полушария, мозолистое тело, серое и белое вещество.'},
  {label:'NCBI Bookshelf · Organization of the Cerebellum', url:'https://www.ncbi.nlm.nih.gov/books/NBK11132/', note:'Структура мозжечка, червь, полушария, ножки.'},
  {label:'Cleveland Clinic · Meninges', url:'https://my.clevelandclinic.org/health/articles/22266-meninges', note:'Три мозговые оболочки и субарахноидальное пространство.'},
  {label:'NCBI Bookshelf · Neuroanatomy, Cerebrospinal Fluid', url:'https://www.ncbi.nlm.nih.gov/books/NBK470578/', note:'Маршрут движения ликвора через желудочки и отверстия.'},
  {label:'NCBI Bookshelf · Neuroanatomy, Ventricular System', url:'https://www.ncbi.nlm.nih.gov/books/NBK532932/', note:'Желудочки, связь с развитием мозговых пузырей.'}
];

const details = {
  overview: {
    cerebrum:{title:'Большой мозг',tag:'01 / Конечный мозг',body:'Два полушария, соединённые спайками, прежде всего мозолистым телом. Снаружи расположена кора, в глубине — белое вещество и подкорковые ядра.'},
    cerebellum:{title:'Мозжечок',tag:'02 / Задняя черепная ямка',body:'Расположен позади ствола мозга, имеет два полушария и червь. Его поверхность образует множество узких листков.'},
    stem:{title:'Ствол мозга',tag:'03 / Продолжение спинного мозга',body:'Состоит из среднего мозга, моста и продолговатого мозга. Расположен между промежуточным мозгом и спинным мозгом.'}
  },
  lobes: {
    frontal:{title:'Лобная доля',tag:'Lobus frontalis',body:'Расположена спереди от центральной борозды. Находятся прецентральная извилина и участки префронтальной коры.'},
    parietal:{title:'Теменная доля',tag:'Lobus parietalis',body:'Располагается позади центральной борозды, над латеральной бороздой. Включает постцентральную извилину.'},
    temporal:{title:'Височная доля',tag:'Lobus temporalis',body:'Занимает нижнебоковую часть полушария под латеральной бороздой. Имеет верхнюю, среднюю и нижнюю височные извилины.'},
    occipital:{title:'Затылочная доля',tag:'Lobus occipitalis',body:'Находится в задней части полушария. На медиальной поверхности здесь располагается шпорная борозда.'},
    insula:{title:'Островковая доля',tag:'Insula',body:'Скрыта в глубине латеральной борозды под участками лобной, теменной и височной долей: снаружи её почти не видно.'}
  },
  deep: {
    callosum:{title:'Мозолистое тело',tag:'Corpus callosum',body:'Крупный пучок комиссуральных волокон белого вещества, соединяющий левое и правое полушария.'},
    thalamus:{title:'Таламус',tag:'Thalamus',body:'Парное скопление серого вещества промежуточного мозга, находящееся по сторонам III желудочка.'},
    hypothalamus:{title:'Гипоталамус',tag:'Hypothalamus',body:'Часть промежуточного мозга под таламусом; анатомически связана с гипофизом через воронку.'},
    pituitary:{title:'Гипофиз',tag:'Hypophysis',body:'Небольшая эндокринная железа под гипоталамусом, расположенная в турецком седле клиновидной кости.'},
    midbrain:{title:'Средний мозг',tag:'Mesencephalon',body:'Верхняя часть ствола мозга, расположенная между промежуточным мозгом и мостом. Через него проходит водопровод мозга.'}
  },
  stem: {
    midbrain:{title:'Средний мозг',tag:'Верхний отдел ствола',body:'Располагается ниже промежуточного мозга и выше моста. Содержит ножки мозга и пластинку четверохолмия.'},
    pons:{title:'Мост',tag:'Средний отдел ствола',body:'Выраженное утолщение ствола впереди мозжечка; с мозжечком связан средними мозжечковыми ножками.'},
    medulla:{title:'Продолговатый мозг',tag:'Нижний отдел ствола',body:'Расположен ниже моста, постепенно переходит в спинной мозг. На передней поверхности находятся пирамиды и оливы.'},
    cerebellum:{title:'Мозжечок',tag:'Позади ствола',body:'Состоит из двух полушарий и срединного червя; с различными отделами ствола соединён тремя парами мозжечковых ножек.'}
  },
  meninges: {
    dura:{title:'Твёрдая оболочка',tag:'Dura mater',body:'Наружная прочная соединительнотканная оболочка. В полости черепа прилежит к внутренней поверхности костей.'},
    arachnoid:{title:'Паутинная оболочка',tag:'Arachnoidea mater',body:'Тонкая средняя оболочка. Между ней и мягкой оболочкой находится заполненное ликвором подпаутинное пространство.'},
    pia:{title:'Мягкая оболочка',tag:'Pia mater',body:'Внутренняя тонкая сосудистая оболочка, плотно повторяющая извилины и борозды головного мозга.'}
  },
  embryo: {
    forebrain:{title:'Передний мозговой пузырь',tag:'Prosencephalon',body:'Образует конечный мозг (полушария) и промежуточный мозг (в том числе таламус и гипоталамус).'},
    midbrain:{title:'Средний мозговой пузырь',tag:'Mesencephalon',body:'Даёт начало среднему мозгу. Его полость превращается в узкий водопровод мозга.'},
    hindbrain:{title:'Задний мозговой пузырь',tag:'Rhombencephalon',body:'Подразделяется на задний мозг (мост и мозжечок) и продолговатый мозг.'}
  }
};

function lateralSVG(id, mode='lobes') {
  const prefix = `b-${id}`;
  const isOverview = mode === 'overview';
  const rAttr = key => `data-region="${isOverview ? 'cerebrum':key}" tabindex="0" role="button" aria-label="${isOverview?'Большой мозг': ({frontal:'Лобная доля',parietal:'Теменная доля',temporal:'Височная доля',occipital:'Затылочная доля'})[key]}"`;
  return `<svg class="anatomy-svg lateral-svg" viewBox="0 0 580 450" role="group" aria-label="Авторская схематическая латеральная проекция головного мозга: спереди слева, сзади справа">
<defs>
  <linearGradient id="${prefix}-f" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#dbd0f7"/><stop offset="1" stop-color="#bbaceb"/></linearGradient>
  <linearGradient id="${prefix}-p" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d7efe6"/><stop offset="1" stop-color="#8ecac2"/></linearGradient>
  <linearGradient id="${prefix}-t" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffe7c7"/><stop offset="1" stop-color="#f0b795"/></linearGradient>
  <linearGradient id="${prefix}-o" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#bdd6f0"/><stop offset="1" stop-color="#89b1db"/></linearGradient>
  <linearGradient id="${prefix}-c" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#7fbdb3"/><stop offset="1" stop-color="#326d72"/></linearGradient>
  <clipPath id="${prefix}-clip"><path d="M77 192 C62 169 69 138 95 119 C98 94 120 80 149 76 C166 55 204 54 226 66 C248 45 279 44 307 57 C335 41 365 52 389 70 C419 64 452 81 467 108 C493 115 504 146 497 170 C512 189 510 218 494 236 C496 260 472 278 448 283 C426 304 394 305 373 291 C355 310 325 304 306 289 C276 305 252 299 233 286 C209 298 174 289 165 276 C137 284 113 270 105 252 C80 247 69 219 77 192Z"/></clipPath>
</defs>
<g class="brainstem-group ${isOverview?'selectable-region':''}" data-region="stem" tabindex="0" role="button" aria-label="Ствол мозга">
  <path d="M323 251 C317 270 314 294 318 308 Q319 331 310 351 L318 403 Q327 420 341 417 L355 357 C363 336 374 315 373 281Z" fill="#6b9894" stroke="#376e70" stroke-width="3"/>
  <path d="M323 318 C340 324 352 323 366 308" fill="none" stroke="#d4f0e4" stroke-width="3" opacity=".8"/><path d="M323 341 C337 349 350 345 357 337" fill="none" stroke="#23565b" stroke-width="2" opacity=".65"/>
</g>
<g class="cerebellum-group ${isOverview?'selectable-region':''}" data-region="cerebellum" tabindex="0" role="button" aria-label="Мозжечок">
  <path d="M350 252 C368 230 404 236 430 249 C456 245 488 260 490 287 C495 319 464 353 425 356 C390 365 356 353 342 328 C329 303 338 270 350 252Z" fill="url(#${prefix}-c)" stroke="#467b78" stroke-width="3"/>
  <g fill="none" stroke="#e5f7e9" stroke-width="3" opacity=".75"><path d="M354 276 Q400 260 477 291"/><path d="M348 293 Q408 275 487 303"/><path d="M350 309 Q418 294 481 318"/><path d="M355 324 Q415 313 470 331"/><path d="M374 340 Q420 329 455 344"/><path d="M368 261 Q419 250 463 274"/></g>
</g>
<path d="M77 192 C62 169 69 138 95 119 C98 94 120 80 149 76 C166 55 204 54 226 66 C248 45 279 44 307 57 C335 41 365 52 389 70 C419 64 452 81 467 108 C493 115 504 146 497 170 C512 189 510 218 494 236 C496 260 472 278 448 283 C426 304 394 305 373 291 C355 310 325 304 306 289 C276 305 252 299 233 286 C209 298 174 289 165 276 C137 284 113 270 105 252 C80 247 69 219 77 192Z" fill="#dbeae6" stroke="#476d71" stroke-width="4"/>
<g clip-path="url(#${prefix}-clip)">
 <g class="lobe-region" ${rAttr('frontal')}><path d="M48 100 L238 23 Q284 39 304 54 C292 101 299 147 302 205 C266 222 204 240 156 261 L64 259Z" fill="url(#${prefix}-f)" /></g>
 <g class="lobe-region" ${rAttr('parietal')}><path d="M304 42 Q377 30 438 77 L444 221 Q372 203 301 207 C292 160 296 99 304 42Z" fill="url(#${prefix}-p)"/></g>
 <g class="lobe-region" ${rAttr('occipital')}><path d="M433 68 Q520 85 526 160 L514 274 L444 304 L412 237 C426 190 425 126 433 68Z" fill="url(#${prefix}-o)"/></g>
 <g class="lobe-region" ${rAttr('temporal')}><path d="M168 221 Q243 203 310 199 Q373 206 427 213 L451 304 L281 320 L147 282Z" fill="url(#${prefix}-t)"/></g>
 <g class="gyri" fill="none" stroke="#618688" stroke-width="3" opacity=".48" stroke-linecap="round">
 <path d="M100 146 Q146 103 174 128 T225 109 Q235 79 269 83"/><path d="M91 181 Q133 172 139 145 Q154 121 166 145 T198 166 Q216 166 229 139 T272 139"/><path d="M108 217 Q148 198 168 216 T224 187 Q251 191 279 170"/><path d="M121 108 Q152 95 158 80 M194 100 Q211 73 229 73"/>
 <path d="M328 86 Q345 116 328 138 T343 176 Q368 191 362 215"/><path d="M370 74 Q393 102 373 122 Q357 144 388 150 Q415 148 408 180"/><path d="M323 238 Q351 225 376 239 T418 242"/><path d="M188 248 Q215 233 238 250 Q262 252 281 234"/><path d="M231 275 Q264 260 284 276 Q305 273 320 256"/><path d="M337 272 Q359 251 394 265"/><path d="M453 112 Q474 140 451 161 Q443 184 469 194"/><path d="M460 230 Q471 248 458 270"/>
 </g>
 <path d="M304 65 C297 98 310 121 297 149 C285 169 308 185 304 209" stroke="#3c7777" stroke-width="4" stroke-linecap="round" fill="none" opacity=".65"/>
 <path d="M159 225 C217 203 266 200 304 203 S379 214 427 218" stroke="#56817c" stroke-width="4" stroke-linecap="round" fill="none" opacity=".65"/>
</g>
<path d="M77 192 C62 169 69 138 95 119 C98 94 120 80 149 76 C166 55 204 54 226 66 C248 45 279 44 307 57 C335 41 365 52 389 70 C419 64 452 81 467 108 C493 115 504 146 497 170 C512 189 510 218 494 236 C496 260 472 278 448 283 C426 304 394 305 373 291 C355 310 325 304 306 289 C276 305 252 299 233 286 C209 298 174 289 165 276 C137 284 113 270 105 252 C80 247 69 219 77 192Z" fill="none" stroke="#3e7777" stroke-width="2.5"/>
<g class="orientations" font-family="Inter,Arial,sans-serif" fill="#708889" font-size="13" font-weight="750"><text x="80" y="40">← ВПЕРЁД</text><text x="408" y="40">НАЗАД →</text></g>
</svg>`;
}

function sagittalSVG(id, mode='deep'){
const p='s-'+id;
const h=(key,x,y,label)=>`<g class="hot" data-hot="${key}" tabindex="0" role="button" aria-label="${label}"><circle cx="${x}" cy="${y}" r="18" fill="#ffffffba"/><circle class="hot-dot" cx="${x}" cy="${y}" r="10" fill="#377f7e" stroke="#fff" stroke-width="3"/></g>`;
return `<svg class="anatomy-svg sagittal-svg" viewBox="0 0 575 470" role="group" aria-label="Авторская упрощённая схема срединного сагиттального среза мозга">
<defs><linearGradient id="${p}-a" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d5c8f0"/><stop offset="1" stop-color="#f2e3e6"/></linearGradient><linearGradient id="${p}-b" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#86b9b2"/><stop offset="1" stop-color="#4d817c"/></linearGradient></defs>
<!-- мозг, ориентирован спереди влево -->
<path d="M81 215 Q51 185 70 145 Q66 118 94 97 Q105 65 148 67 Q179 39 210 61 Q251 42 279 61 Q315 43 352 65 Q403 62 436 97 Q478 120 489 173 Q499 209 465 248 Q438 270 404 271 Q385 257 354 266 Q321 283 278 271 Q244 284 215 271 Q180 278 149 262 Q112 265 90 242Z" fill="url(#${p}-a)" stroke="#7c839c" stroke-width="3"/>
<g fill="none" stroke="#a294b4" stroke-width="3" opacity=".57" stroke-linecap="round"><path d="M102 128 Q144 96 167 114 T217 89 Q239 75 265 95"/><path d="M100 168 Q131 143 158 153 T215 124"/><path d="M120 209 Q156 188 177 199 T211 183"/><path d="M285 84 Q303 106 287 127 T299 168"/><path d="M345 82 Q372 108 358 138 T378 178"/><path d="M405 110 Q425 136 404 153 T434 200"/></g>
<!-- white matter central -->
<path d="M166 186 Q187 121 264 120 Q330 118 376 153 Q400 177 388 211 Q374 241 330 243 Q295 237 272 252 Q239 257 218 239 Q182 236 166 186Z" fill="#f9f9f5" stroke="#d3d9d2" stroke-width="2"/>
<!-- c-shaped corpus callosum -->
<path d="M184 194 Q197 151 237 140 Q283 127 326 148 Q348 163 354 183 Q335 174 321 164 Q275 144 239 156 Q211 165 197 203 Q191 214 178 214 Z" fill="#eceacb" stroke="#a1a387" stroke-width="2.5" />
<!-- thalamus -->
<ellipse cx="283" cy="213" rx="44" ry="30" fill="#a8d2bf" stroke="#689a8b" stroke-width="2.5"/>
<!-- hypothalamus -->
<path d="M259 244 Q276 227 305 242 Q297 259 282 270 Q262 263 259 244Z" fill="#eab58f" stroke="#c48f70" stroke-width="2" />
<!-- pituitary stalk and gland -->
<path d="M278 265 L266 298" stroke="#b78065" stroke-width="7" stroke-linecap="round"/><ellipse cx="258" cy="310" rx="17" ry="12" fill="#cf918e" stroke="#b27978" stroke-width="2"/>
<!-- midbrain and pons stem -->
<path d="M330 245 Q351 242 368 260 Q380 286 363 305 Q387 321 379 352 Q366 373 364 394 L357 447 L330 447 Q323 391 306 357 Q293 339 303 319 Q298 283 318 256Z" fill="url(#${p}-b)" stroke="#5e8c88" stroke-width="3"/>
<path d="M310 314 Q348 296 376 317 Q396 340 369 357 Q342 367 311 344Z" fill="#81bbb2" stroke="#467f79" stroke-width="2"/>
<path d="M341 360 Q343 384 347 433" fill="none" stroke="#cae7d8" stroke-width="3"/>
<!-- cerebellum -->
<path d="M376 281 Q405 247 441 262 Q477 252 496 276 Q519 308 491 341 Q462 364 419 353 Q381 347 373 314 Z" fill="#f0c2ad" stroke="#b68482" stroke-width="3"/>
<g fill="none" stroke="#b48481" stroke-width="3" opacity=".7"><path d="M393 289 Q425 270 484 300"/><path d="M386 305 Q437 288 496 311"/><path d="M388 324 Q449 311 488 330"/><path d="M404 339 Q445 332 474 343"/></g>
<g font-family="Inter,Arial,sans-serif" fill="#788b8d" font-size="12" font-weight="800"><text x="90" y="45">← ВПЕРЁД</text><text x="405" y="45">НАЗАД →</text></g>
${mode==='deep' ? h('callosum',261,149,'Мозолистое тело')+h('thalamus',284,213,'Таламус')+h('hypothalamus',283,250,'Гипоталамус')+h('pituitary',256,308,'Гипофиз')+h('midbrain',341,278,'Средний мозг') : h('midbrain',341,278,'Средний мозг')+h('pons',348,335,'Мост')+h('medulla',343,397,'Продолговатый мозг')+h('cerebellum',445,313,'Мозжечок')}
</svg>`;
}

function tissueSVG(){return `<svg class="anatomy-svg tissue-svg" viewBox="0 0 570 415" role="img" aria-label="Схема извилин, борозд и распределения серого и белого вещества в полушарии"><defs><clipPath id="tissue-mask"><path class="gray-tissue" d="M81 160 Q68 111 109 95 Q143 50 204 82 Q243 36 288 70 Q338 35 382 79 Q436 62 470 110 Q502 142 486 185 Q502 241 459 278 Q404 323 340 293 Q277 339 217 305 Q164 325 123 274 Q80 263 87 216 Q57 192 81 160Z"/></clipPath></defs><path d="M81 160 Q68 111 109 95 Q143 50 204 82 Q243 36 288 70 Q338 35 382 79 Q436 62 470 110 Q502 142 486 185 Q502 241 459 278 Q404 323 340 293 Q277 339 217 305 Q164 325 123 274 Q80 263 87 216 Q57 192 81 160Z" fill="#cedbdc" stroke="#628e8c" stroke-width="5"/><path class="white-tissue" d="M108 164 Q111 116 153 119 Q183 91 210 113 Q247 80 279 102 Q315 83 348 109 Q393 99 427 132 Q459 172 439 214 Q420 250 378 244 Q343 279 303 248 Q267 268 236 248 Q198 267 173 234 Q127 246 113 211Z" fill="#fafcf7" stroke="#a3bcb9" stroke-width="4"/><g clip-path="url(#tissue-mask)" fill="none" stroke="#7fa39e" stroke-width="4" opacity=".85" stroke-linecap="round"><path d="M85 163 Q130 170 140 121"/><path d="M136 95 Q177 114 178 145"/><path d="M204 87 Q229 118 204 159"/><path d="M268 69 Q281 109 252 134"/><path d="M338 67 Q329 103 352 131"/><path d="M400 101 Q381 126 404 155"/><path d="M458 164 Q429 176 452 216"/><path d="M427 269 Q405 228 368 245"/><path d="M347 294 Q320 266 296 280"/><path d="M221 301 Q236 270 207 250"/><path d="M127 271 Q157 240 147 214"/></g><circle cx="156" cy="123" r="11" fill="#357d7c" stroke="white" stroke-width="5"/><circle cx="286" cy="210" r="11" fill="#e7a381" stroke="white" stroke-width="5"/><path d="M156 123 L119 53 L44 53 M286 210 L400 370 L513 370" stroke="#668f8a" stroke-width="2" fill="none"/><g font-family="Arial,sans-serif" font-size="16" font-weight="800" fill="#3b686a"><text x="44" y="42">КОРА</text><text x="401" y="360">БЕЛОЕ ВЕЩЕСТВО</text></g><g font-family="Arial,sans-serif" font-size="13" fill="#859793"><text x="44" y="75">серое вещество</text><text x="420" y="389">проводящие пути</text></g></svg>`}

function embryoSVG(){return `<svg class="embryo-svg" viewBox="0 0 600 370" role="img" aria-label="Схема развития трёх первичных мозговых пузырей в пять вторичных и отделы зрелого мозга"><g stroke="#b9cdca" stroke-width="3" fill="none"><path d="M122 127 V185 H481 M301 185 V209 M122 185 V209 M481 185 V209"/></g><g font-family="Arial,sans-serif"><rect data-embryo="forebrain" x="31" y="45" width="177" height="74" rx="19" fill="#d0c5f1" stroke="#9286bf" stroke-width="2"/><text x="120" y="72" font-size="16" font-weight="800" text-anchor="middle" fill="#3d4265">ПЕРЕДНИЙ</text><text x="120" y="92" font-size="12" text-anchor="middle" fill="#65637b">prosencephalon</text><rect data-embryo="midbrain" x="213" y="45" width="177" height="74" rx="19" fill="#d4eae3" stroke="#88b9ae" stroke-width="2"/><text x="301" y="72" font-size="16" font-weight="800" text-anchor="middle" fill="#315e5c">СРЕДНИЙ</text><text x="301" y="92" font-size="12" text-anchor="middle" fill="#5a837d">mesencephalon</text><rect data-embryo="hindbrain" x="395" y="45" width="177" height="74" rx="19" fill="#f6ddc5" stroke="#d8b599" stroke-width="2"/><text x="482" y="72" font-size="16" font-weight="800" text-anchor="middle" fill="#875d4c">ЗАДНИЙ</text><text x="482" y="92" font-size="12" text-anchor="middle" fill="#a47f6b">rhombencephalon</text>
<path d="M120 119 V179 M301 119 V178 M482 119 V179" stroke="#adc5c0" stroke-width="3" stroke-linecap="round" fill="none"/>
<rect data-embryo="forebrain" x="17" y="217" width="207" height="90" rx="18" fill="#f1edfa" stroke="#cabee8" stroke-width="2"/><text x="120" y="250" text-anchor="middle" fill="#584e85" font-size="15" font-weight="850">Конечный</text><text x="120" y="269" text-anchor="middle" fill="#584e85" font-size="15" font-weight="850">+ промежуточный</text><text x="120" y="291" text-anchor="middle" font-size="11" fill="#8379a1">полушария, таламус…</text>
<rect data-embryo="midbrain" x="232" y="217" width="138" height="90" rx="18" fill="#e4f2eb" stroke="#add1c5" stroke-width="2"/><text x="301" y="251" text-anchor="middle" fill="#336f67" font-size="15" font-weight="850">Средний мозг</text><text x="301" y="274" text-anchor="middle" font-size="11" fill="#6f9991">водопровод</text>
<rect data-embryo="hindbrain" x="378" y="217" width="207" height="90" rx="18" fill="#fbede0" stroke="#e8c8ac" stroke-width="2"/><text x="481" y="250" text-anchor="middle" fill="#8f634e" font-size="15" font-weight="850">Мост, мозжечок</text><text x="481" y="270" text-anchor="middle" fill="#8f634e" font-size="15" font-weight="850">и продолговатый</text>
</g><g opacity=".8" fill="none" stroke="#b6c9c4" stroke-width="2"><path d="M45 338 H555"/></g><text x="300" y="356" font-size="12" fill="#7a9190" text-anchor="middle" font-family="Arial,sans-serif">От трёх первичных пузырей → к отделам головного мозга</text></svg>`}

const slides = [
 {id:'intro',short:'Введение',eyebrow:'01 / ВВЕДЕНИЕ',title:'Морфология<br><em>головного мозга.</em>',lead:'Как устроен самый сложный орган нервной системы — от полушарий и борозд до скрытых структур и полостей.', foot:'Интерактивный анатомический атлас · учебный уровень · 10 класс',type:'hero',notes:'Начните с ориентира: на всех латеральных схемах передняя часть мозга — слева. Объясните, что морфология изучает форму, взаимное расположение и строение частей, а не только функции.'},
 {id:'architecture',short:'Общий план',eyebrow:'02 / МАКРОСТРУКТУРА',title:'Три главные<br><em>области.</em>',lead:'Сначала найдём крупные отделы. Нажмите на подпись или на соответствующую часть схемы.',type:'overview',notes:'Покажите на схеме полушария, мозжечок и ствол. Заметьте: промежуточный мозг здесь не выделен отдельным цветом, он располагается глубже; его разберём на следующем срезе.'},
 {id:'lobes',short:'Доли',eyebrow:'03 / ПОЛУШАРИЯ',title:'Карта<br><em>долей мозга.</em>',lead:'Борозды разграничивают области коры. Четыре доли видны снаружи; островок скрыт в глубине латеральной борозды.',type:'lobes',notes:'Нажмите на лобную, теменную, височную и затылочную доли. Укажите две важные борозды: центральную (лобная/теменная) и латеральную (височная/лобная и теменная). Островок скрыт на латеральной поверхности.'},
 {id:'cortex',short:'Кора',eyebrow:'04 / ПОВЕРХНОСТЬ',title:'Складки<br><em>и вещество.</em>',lead:'Извилины (gyri) и борозды (sulci) увеличивают площадь поверхности коры в пределах черепа.',type:'cortex',notes:'Разведите понятия: серое вещество коры на поверхности, под ним белое вещество. Однако серое вещество есть также глубоко — в виде ядер. На рисунке изображена схематическая, а не гистологически точная картина.'},
 {id:'deep',short:'В глубине',eyebrow:'05 / СРЕДИННЫЙ СРЕЗ',title:'Что скрыто<br><em>внутри.</em>',lead:'Сагиттальный срез открывает структуры, которые невозможно увидеть на наружной поверхности полушария.',type:'deep',notes:'Обратите внимание на С-образное мозолистое тело, овальный таламус, расположенный ниже гипоталамус и гипофиз. Водопровод проходит через средний мозг. Срез намеренно упрощён.'},
 {id:'stem',short:'Ствол и мозжечок',eyebrow:'06 / ЗАДНЯЯ ЯМКА',title:'Ствол<br><em>и мозжечок.</em>',lead:'Ствол — вертикальная «ось» между головным и спинным мозгом. Мозжечок находится позади него.',type:'stem',notes:'Назовите три части ствола сверху вниз: средний мозг, мост, продолговатый мозг. Затем покажите мозжечок с полушариями и червём. IV желудочек находится между стволом и мозжечком.'},
 {id:'meninges',short:'Оболочки',eyebrow:'07 / ЗАЩИТНЫЕ СЛОИ',title:'Три оболочки.<br><em>Одна защита.</em>',lead:'От кости внутрь идут твёрдая, паутинная и мягкая мозговые оболочки. Между двумя последними циркулирует ликвор.',type:'meninges',notes:'Покажите порядок слоёв снаружи внутрь. Подчеркните, что нормальное субдуральное «пространство» потенциальное, тогда как субарахноидальное реально заполнено жидкостью. Схема послойная, не в масштабе.'},
 {id:'ventricles',short:'Желудочки',eyebrow:'08 / ПОЛОСТНАЯ СИСТЕМА',title:'Путь<br><em>ликвора.</em>',lead:'В мозге есть сообщающиеся полости, наполненные спинномозговой жидкостью. Пройдите путь по шагам.',type:'flow',notes:'Латеральные желудочки соединяются с III через межжелудочковые отверстия; III с IV — через водопровод среднего мозга. Через отверстия IV желудочка ликвор поступает в субарахноидальное пространство. Основное производство ликвора происходит в сосудистых сплетениях.'},
 {id:'development',short:'Развитие',eyebrow:'09 / ЭМБРИОЛОГИЧЕСКИЙ ПЛАН',title:'Почему отделы<br><em>такие разные.</em>',lead:'Отделы мозга формируются из трёх первичных мозговых пузырей. Их происхождение объясняет общую анатомическую схему.',type:'embryo',notes:'Простой мост между эмбриологией и морфологией: передний пузырь → конечный и промежуточный; средний остаётся средним; задний → мост и мозжечок, продолговатый. Упомяните пять вторичных пузырей.'},
 {id:'quiz',short:'Проверка',eyebrow:'10 / ПОВТОРЕНИЕ',title:'Проверьте<br><em>себя.</em>',lead:'Семь коротких вопросов на распознавание частей и их взаимного расположения. Выберите один ответ.',type:'quiz',notes:'Вы можете предложить аудитории отвечать вслух, прежде чем нажимать на вариант. После каждого ответа появляется короткое объяснение. На итоговом экране можно начать заново.'}
];

const quiz = [
{q:'Какая борозда разделяет лобную и теменную доли?',answers:['Латеральная','Центральная','Шпорная','Обонятельная'],correct:1,why:'Центральная борозда отделяет лобную долю от теменной; по её краям лежат прецентральная и постцентральная извилины.'},
{q:'Какая доля почти не видна на латеральной поверхности?',answers:['Лобная','Височная','Островковая','Затылочная'],correct:2,why:'Островок скрыт в глубине латеральной борозды под покрышками соседних долей.'},
{q:'Что соединяет два больших полушария?',answers:['Мозолистое тело','Таламус','Мост','IV желудочек'],correct:0,why:'Мозолистое тело содержит комиссуральные нервные волокна между полушариями.'},
{q:'Какой отдел НЕ входит в состав ствола мозга?',answers:['Средний мозг','Мост','Мозжечок','Продолговатый мозг'],correct:2,why:'Мозжечок расположен рядом со стволом, но не является его частью.'},
{q:'Какой слой оболочек ближе всего к ткани мозга?',answers:['Твёрдая','Паутинная','Мягкая','Черепная кость'],correct:2,why:'Мягкая мозговая оболочка плотно покрывает поверхность мозга, в том числе борозды.'},
{q:'Как III желудочек сообщается с IV?',answers:['Через мозолистое тело','Через водопровод мозга','Через латеральную борозду','Через гипофиз'],correct:1,why:'Водопровод мозга проходит через средний мозг и связывает III и IV желудочки.'},
{q:'Что развивается из переднего первичного мозгового пузыря?',answers:['Только мозжечок','Большие полушария и промежуточный мозг','Мост и продолговатый мозг','Только средний мозг'],correct:1,why:'Prosencephalon разделяется на telencephalon (конечный) и diencephalon (промежуточный мозг).'}
];

const chip = (key,title,color,group='')=>`<button type="button" class="region-chip" data-select="${key}" data-group="${group}" aria-pressed="false"><span class="swatch" style="--swatch:${color}"></span>${title}</button>`;
const detail = `<div class="detail-card" aria-live="polite"><span class="detail-kicker">Нажмите на элемент</span><h3 class="detail-title">Выберите область</h3><p class="detail-body">Название, положение и строение выбранной части появятся здесь.</p></div>`;
function makeContent(s){
 const head=`<div class="copy"><div class="section-index"><span class="index-line"></span>${s.eyebrow}</div><h${s.type==='hero'?'1':'2'}>${s.title}</h${s.type==='hero'?'1':'2'}><p class="lead">${s.lead}</p>`;
 let left=head, visual='';
 switch(s.type){
 case 'hero': left+=`<span class="minitag">● УЧЕБНАЯ ПРЕЗЕНТАЦИЯ · 10 СЦЕН</span><div class="stat-pair"><div><strong>4 + 1</strong><small>доли, включая скрытый островок</small></div><div><strong>3</strong><small>части ствола мозга</small></div></div><p class="copy-footnote">${s.foot}</p>`;
 visual=`<div class="visual-space"><div class="orb orb--mint"></div><div class="orb orb--peach"></div>${lateralSVG('hero','overview')}<span class="scene-badge">ЛАТЕРАЛЬНАЯ ПРОЕКЦИЯ · СХЕМА</span></div>`;break;
 case 'overview':left+=`<div class="chip-grid chip-grid--three">${chip('cerebrum','Большой мозг','#c8bbf0')}${chip('cerebellum','Мозжечок','#70b2a5')}${chip('stem','Ствол','#4d8582')}</div>${detail}<p class="lesson-hint">Нажмите на область рисунка или подпись.</p>`;visual=`<div class="visual-space"><div class="orb orb--lilac"></div>${lateralSVG('overview','overview')}</div>`;break;
 case 'lobes':left+=`<div class="chip-grid">${chip('frontal','Лобная','#c8bbf0')}${chip('parietal','Теменная','#8ecac2')}${chip('temporal','Височная','#f0b795')}${chip('occipital','Затылочная','#89b1db')}${chip('insula','Островковая · скрыта','#d4a5cf')}</div>${detail}`;visual=`<div class="visual-space"><div class="orb orb--mint"></div>${lateralSVG('lobes')}<span class="scene-badge">← ПЕРЕД · ЗАД →</span></div>`;break;
 case 'cortex':left+=`<div class="pill-toggle" role="group" aria-label="Подсветка ткани"><button type="button" data-tissue="gray" aria-pressed="true">Серое</button><button type="button" data-tissue="white" aria-pressed="false">Белое</button></div><div class="detail-card" id="tissueDetail"><span class="detail-kicker">СЕРОЕ ВЕЩЕСТВО</span><h3 class="detail-title">Кора больших полушарий</h3><p class="detail-body">Наружный слой, богатый телами нейронов. Серое вещество также образует ядра в глубине мозга.</p></div><p class="lesson-hint">Сравните, где находятся два типа вещества.</p>`;visual=`<div class="visual-space"><div class="orb orb--mint"></div>${tissueSVG()}<span class="scene-badge">УСЛОВНЫЙ СРЕЗ · НЕ В МАСШТАБЕ</span></div>`;break;
 case 'deep':left+=`<div class="chip-grid">${chip('callosum','Мозолистое тело','#e9e2b5')}${chip('thalamus','Таламус','#9bc5b4')}${chip('hypothalamus','Гипоталамус','#eab58f')}${chip('pituitary','Гипофиз','#cf918e')}${chip('midbrain','Средний мозг','#81b3ac')}</div>${detail}`;visual=`<div class="visual-space"><div class="orb orb--lilac"></div>${sagittalSVG('deep','deep')}<span class="scene-badge">СРЕДИННЫЙ САГИТТАЛЬНЫЙ СРЕЗ · СХЕМА</span></div>`;break;
 case 'stem':left+=`<div class="chip-grid">${chip('midbrain','Средний мозг','#70ada8')}${chip('pons','Мост','#81bbb2')}${chip('medulla','Продолговатый мозг','#467f79')}${chip('cerebellum','Мозжечок','#f0c2ad')}</div>${detail}`;visual=`<div class="visual-space"><div class="orb orb--mint"></div>${sagittalSVG('stem','stem')}<span class="scene-badge">СРЕЗ ПО СРЕДИННОЙ ЛИНИИ</span></div>`;break;
 case 'meninges':left+=`<div class="chip-grid chip-grid--three">${chip('dura','Твёрдая','#cdbfdf')}${chip('arachnoid','Паутинная','#c6e3e5')}${chip('pia','Мягкая','#edb7a7')}</div>${detail}`;
 visual=`<div class="meninges-wrap"><div class="eyebrow" style="margin-bottom:16px">ПО НАПРАВЛЕНИЮ К ЦЕНТРУ ↓</div><div class="layers-art"><div class="layer-item" style="--layer:#e6ded4"><span>Черепная кость</span><span>защита</span></div><button class="layer-item" style="--layer:#d9cfec" data-layer="dura" type="button" aria-pressed="false"><span>Твёрдая оболочка</span><span>dura mater</span></button><button class="layer-item" style="--layer:#d2e8eb" data-layer="arachnoid" type="button" aria-pressed="false"><span>Паутинная оболочка</span><span>arachnoidea</span></button><div class="layer-item" style="--layer:#dcefed"><span>Подпаутинное пространство</span><span>ликвор</span></div><button class="layer-item" style="--layer:#f5d6ca" data-layer="pia" type="button" aria-pressed="false"><span>Мягкая оболочка</span><span>pia mater</span></button><div class="layer-item" style="--layer:#d2e8e0"><span>Кора головного мозга</span><span>нервная ткань</span></div></div><p class="copy-footnote" style="margin-bottom:0">Упрощённая послойная схема: расстояния между слоями условны.</p></div>`;break;
 case 'flow':left+=`<div class="detail-card" id="flowDetail"><span class="detail-kicker">ЭТАП 1 / 5</span><h3 class="detail-title">Боковые желудочки</h3><p class="detail-body">По одному в каждом полушарии. Здесь находятся сосудистые сплетения, вырабатывающие значительную часть ликвора.</p></div><div class="flow-controls"><button id="flowPrev" class="small-action" type="button">← Назад</button><button id="flowNext" class="small-action" type="button">Дальше →</button><button id="flowPlay" class="small-action" type="button" aria-pressed="false">▶ Автопоказ</button></div>`;
 visual=`<div class="interactive-panel" style="max-width:none"><div class="flow-steps" role="group" aria-label="Этапы движения ликвора"><button type="button" class="flow-step" data-step="0" aria-pressed="true"><span class="flow-number">01</span><span class="flow-icon">⌁</span><span>Боковые<br>желудочки</span></button><button type="button" class="flow-step" data-step="1" aria-pressed="false"><span class="flow-number">02</span><span class="flow-icon">◈</span><span>III<br>желудочек</span></button><button type="button" class="flow-step" data-step="2" aria-pressed="false"><span class="flow-number">03</span><span class="flow-icon">↓</span><span>Водопровод<br>мозга</span></button><button type="button" class="flow-step" data-step="3" aria-pressed="false"><span class="flow-number">04</span><span class="flow-icon">◇</span><span>IV<br>желудочек</span></button><button type="button" class="flow-step" data-step="4" aria-pressed="false"><span class="flow-number">05</span><span class="flow-icon">≈</span><span>Подпаутинное<br>пространство</span></button></div><div class="connector-line"></div><p class="bodytext" style="max-width:none;text-align:center">Производство и циркуляция спинномозговой жидкости</p><p class="copy-footnote" style="text-align:center">Межжелудочковые отверстия соединяют боковые и III желудочек, отверстия IV — с подпаутинным пространством.</p></div>`;break;
 case 'embryo':left+=`<div class="chip-grid chip-grid--three">${chip('forebrain','Передний','#c8bbf0')}${chip('midbrain','Средний','#b9dfcf')}${chip('hindbrain','Задний','#f5cead')}</div>${detail}`;visual=`<div class="compare-visual"><div style="width:100%">${embryoSVG()}</div></div>`;break;
 case 'quiz':left+=`<div class="stat-pair"><div><strong>07</strong><small>вопросов</small></div><div><strong>01</strong><small>вариант ответа</small></div></div><p class="copy-footnote">Ответы не отправляются в сеть — результат остаётся в этом браузере до перезагрузки.</p>`;visual=`<div class="quiz-box" id="quizBox" aria-live="polite"><span class="quiz-kicker">ВОПРОС 01 / 07</span><div class="quiz-question">Подготовка вопросов…</div></div>`;break;
 }
 return `<section class="scene scene--${s.type==='hero'?'hero':s.type==='quiz'?'quiz':(['flow','embryo'].includes(s.type)?'wide':'standard')}" id="${s.id}" data-type="${s.type}" data-title="${s.short}" aria-label="${s.short}" hidden>${left}</div><div class="scene-graphic">${visual}</div><span class="explore-divider">NEURO / ${s.eyebrow}</span></section>`;
}

const app=$('#app'), deck=$('#deck'), footer=$('#deckFooter');
deck.innerHTML=slides.map(makeContent).join('');
// На титульном экране рисунок является только иллюстрацией, а не неработающим контролом.
$$('#intro .lateral-svg [data-region]').forEach(el=>{el.removeAttribute('data-region');el.removeAttribute('role');el.removeAttribute('tabindex');el.removeAttribute('aria-label')});
$('#progressRail').innerHTML=slides.map((s,i)=>`<button class="progress-dot" type="button" data-jump="${i}" aria-label="${String(i+1).padStart(2,'0')}. ${s.short}" title="${s.short}"></button>`).join('');
const sceneEls=$$('.scene',deck);
const state={current:0,mode:'presentation',transitioning:false,quizIndex:0,quizScore:0,quizChosen:null,flowStep:0,flowTimer:null};
let lockTimeout=null, toastTimeout=null;

function notify(message){const t=$('#toast');t.textContent=message;t.hidden=false;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>{t.hidden=true;},3200)}
function updateChrome(){
 $('#slidePosition').textContent=`${String(state.current+1).padStart(2,'0')} / ${slides.length}`;
 $('#slideCaption').textContent=slides[state.current].short;
 $('#prevBtn').disabled=state.current===0;$('#nextBtn').disabled=state.current===slides.length-1;
 $$('.progress-dot').forEach((el,i)=>{if(i===state.current)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current')});
}
function stopFlow(){clearInterval(state.flowTimer);state.flowTimer=null; const b=$('#flowPlay');if(b){b.textContent='▶ Автопоказ';b.setAttribute('aria-pressed','false')}}
function navigate(target,init=false){
 if(state.mode!=='presentation'){const s=sceneEls[Math.max(0,Math.min(slides.length-1,target))];s.scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth',block:'start'});return;}
 target=Math.max(0,Math.min(slides.length-1,Number(target)));
 if(state.transitioning||(!init&&target===state.current))return;
 stopFlow();
 const previous=sceneEls[state.current],next=sceneEls[target];
 const swap=()=>{
  sceneEls.forEach((s,i)=>{s.hidden=i!==target;s.classList.remove('scene-leave','scene-enter')});
  state.current=target;next.hidden=false;updateChrome();
  if(state.mode==='presentation')window.scrollTo({top:0,behavior:'instant'});
  if(!reducedMotion.matches&&!init)next.classList.add('scene-enter');
  state.transitioning=false;clearTimeout(lockTimeout);
  const url=new URL(location.href);url.hash=slides[target].id;history.replaceState(null,'',url);
 };
 if(!init&&!reducedMotion.matches){state.transitioning=true;previous.classList.add('scene-leave');lockTimeout=setTimeout(swap,185)}else swap();
}
function switchMode(){
 stopFlow(); const next=state.mode==='presentation'?'explore':'presentation';state.mode=next;
 app.dataset.mode=next;$('#modeToggle').setAttribute('aria-pressed',String(next==='explore'));$('#modeToggle').setAttribute('aria-label',next==='explore'?'Режим презентации':'Режим изучения');
 $('#modeToggle').innerHTML=next==='explore'?'◩ <span>Показ</span>':'☰ <span>Изучение</span>';
 if(next==='explore'){
  sceneEls.forEach(s=>{s.hidden=false;s.classList.remove('scene-leave','scene-enter')});
  state.transitioning=false;clearTimeout(lockTimeout);
  requestAnimationFrame(()=>sceneEls[state.current].scrollIntoView({block:'start'}));
  notify('Режим изучения: все главы доступны прокруткой.');
 }else{
  const index=nearestScene();state.current=index;
  sceneEls.forEach((s,i)=>s.hidden=i!==state.current);updateChrome();window.scrollTo({top:0,behavior:'instant'});
  notify('Режим презентации: стрелки ← → переключают слайды.');
 }
}
function nearestScene(){let best=0,dist=Infinity;sceneEls.forEach((s,i)=>{const d=Math.abs(s.getBoundingClientRect().top);if(d<dist){dist=d;best=i}});return best}
function openDialog(type){const dlg=$('#infoDialog'),title=$('#dialogTitle'),content=$('#dialogContent');
 if(type==='notes'){
  const s=slides[state.mode==='explore'?nearestScene():state.current];title.textContent=`Заметки: ${s.short}`;
  content.innerHTML=`<span class="notes-tag">ВНИМАНИЕ: ЭТИ ЗАМЕТКИ ВИДНЫ НА ПРОЕКТОРЕ</span><p class="notes-text"></p><small>Совет: держите заметки на другом устройстве, если нужна приватность.</small>`;
  $('.notes-text',content).textContent=s.notes;
 }else{
  title.textContent='Научные источники';
  content.innerHTML=`<p>Факты и анатомические подписи сверены с университетскими и клиническими источниками. Иллюстрации специально нарисованы как <strong>схемы</strong> и не заменяют анатомический атлас.</p><ol class="sources-list">${sources.map(s=>`<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label}</a><br><small>${s.note}</small></li>`).join('')}</ol><p class="source-warning">Иллюстрации оригинальные, анатомически упрощённые, не в масштабе. Ссылки доступны на этой странице, но не встроены в повествовательные слайды.</p>`;
 }
 if(typeof dlg.showModal==='function')dlg.showModal();else{dlg.setAttribute('open','');notify('Диалог открыт. Чтобы закрыть, нажмите ×.')}
}
function closeDialog(){const d=$('#infoDialog');if(typeof d.close==='function')d.close();else d.removeAttribute('open')}

function showDetail(scene,type,key){const found=details[type]?.[key];if(!found)return;
 $$('.region-chip',scene).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.select===key)));
 $$('.lobe-region',scene).forEach(g=>{g.classList.toggle('active',g.dataset.region===key);g.classList.toggle('dimmed',key!=='insula'&&g.dataset.region!==key)});
 $$('.selectable-region,.cerebellum-group,.brainstem-group',scene).forEach(g=>{if(g.dataset.region)g.classList.toggle('active',g.dataset.region===key)});
 $$('.hot',scene).forEach(g=>g.classList.toggle('active',g.dataset.hot===key));
 $$('.embryo-svg [data-embryo]',scene).forEach(g=>{g.classList.toggle('active',g.dataset.embryo===key);g.classList.toggle('dimmed',g.dataset.embryo!==key)});
 $$('.layer-item[data-layer]',scene).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.layer===key)));
 const c=$('.detail-card',scene);if(c){$('.detail-kicker',c).textContent=found.tag;$('.detail-title',c).textContent=found.title;$('.detail-body',c).textContent=found.body}
 if(type==='lobes'&&key==='insula'){$$('.lobe-region',scene).forEach(g=>g.classList.remove('dimmed'));}
}
function initSelectors(){
 sceneEls.forEach(scene=>{
  const type=scene.dataset.type;
  $$('.region-chip',scene).forEach(b=>b.addEventListener('click',()=>showDetail(scene,type,b.dataset.select)));
  $$('.anatomy-svg [data-region]',scene).forEach(el=>{
   const fn=()=>{if(details[type]?.[el.dataset.region])showDetail(scene,type,el.dataset.region)};
   el.addEventListener('click',fn);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();fn()}});
  });
  $$('.anatomy-svg [data-hot]',scene).forEach(el=>{
   const fn=()=>showDetail(scene,type,el.dataset.hot);
   el.addEventListener('click',fn);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();fn()}});
  });
  $$('.layer-item[data-layer]',scene).forEach(b=>b.addEventListener('click',()=>showDetail(scene,'meninges',b.dataset.layer)));
 });
 showDetail($('#architecture'),'overview','cerebrum');showDetail($('#lobes'),'lobes','frontal');
 showDetail($('#deep'),'deep','callosum');showDetail($('#stem'),'stem','midbrain');
 showDetail($('#meninges'),'meninges','dura');showDetail($('#development'),'embryo','forebrain');
 $('#cortex').querySelectorAll('[data-tissue]').forEach(b=>b.addEventListener('click',()=>selectTissue(b.dataset.tissue)));
}
function selectTissue(kind){const scene=$('#cortex');$$('[data-tissue]',scene).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tissue===kind)));
 const c=$('#tissueDetail');if(kind==='gray'){$('.detail-kicker',c).textContent='СЕРОЕ ВЕЩЕСТВО';$('.detail-title',c).textContent='Кора больших полушарий';$('.detail-body',c).textContent='Наружный слой, богатый телами нейронов. Серое вещество также образует ядра в глубине мозга.'}
 else{$('.detail-kicker',c).textContent='БЕЛОЕ ВЕЩЕСТВО';$('.detail-title',c).textContent='Проводящие нервные волокна';$('.detail-body',c).textContent='Под корой располагаются пучки главным образом миелинизированных аксонов: ассоциативные, комиссуральные и проекционные пути.'}
 const svg=$('.tissue-svg',scene);svg.dataset.tissue=kind;}

const flowData=[
{title:'Боковые желудочки',tag:'ЭТАП 1 / 5',body:'По одному в каждом полушарии. Сосудистые сплетения желудочков вырабатывают значительную часть ликвора.'},
{title:'III желудочек',tag:'ЭТАП 2 / 5',body:'Узкая полость промежуточного мозга между таламусами. Сюда ликвор поступает из боковых желудочков через отверстия Монро.'},
{title:'Водопровод мозга',tag:'ЭТАП 3 / 5',body:'Тонкий канал среднего мозга (водопровод Сильвия), связывающий III и IV желудочки.'},
{title:'IV желудочек',tag:'ЭТАП 4 / 5',body:'Полость между мостом/продолговатым мозгом и мозжечком. Из неё ликвор выходит через срединное и латеральные отверстия.'},
{title:'Подпаутинное пространство',tag:'ЭТАП 5 / 5',body:'Ликвор омывает мозг и спинной мозг, циркулируя между паутинной и мягкой оболочками.'}
];
function updateFlow(index,manual=true){if(manual)stopFlow();state.flowStep=Math.max(0,Math.min(flowData.length-1,index));
 $$('.flow-step').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===state.flowStep)));
 const d=flowData[state.flowStep],c=$('#flowDetail');$('.detail-kicker',c).textContent=d.tag;$('.detail-title',c).textContent=d.title;$('.detail-body',c).textContent=d.body;
 $('#flowPrev').disabled=state.flowStep===0;$('#flowNext').disabled=state.flowStep===flowData.length-1;
}
function flowAutoplay(){if(state.flowTimer){stopFlow();return} if(reducedMotion.matches){notify('Автопоказ отключён при настройке «Уменьшение движения». Используйте кнопки.');return}
 if(state.flowStep>=4)updateFlow(0,false);
 $('#flowPlay').textContent='Ⅱ Пауза';$('#flowPlay').setAttribute('aria-pressed','true');
 state.flowTimer=setInterval(()=>{if(state.flowStep>=4){stopFlow();return}updateFlow(state.flowStep+1,false)},1700)
}
function initFlow(){ $$('.flow-step').forEach(el=>el.addEventListener('click',()=>updateFlow(Number(el.dataset.step))));$('#flowPrev').addEventListener('click',()=>updateFlow(state.flowStep-1));$('#flowNext').addEventListener('click',()=>updateFlow(state.flowStep+1));$('#flowPlay').addEventListener('click',flowAutoplay);updateFlow(0)}
function renderQuiz(){const box=$('#quizBox');
 if(state.quizIndex>=quiz.length){const ratio=Math.round(100*state.quizScore/quiz.length);box.innerHTML=`<div class="quiz-end"><span class="quiz-kicker">РЕЗУЛЬТАТ</span><div class="success-big">${state.quizScore} / ${quiz.length}</div><h3>${ratio===100?'Отличный результат':ratio>=70?'Хорошее понимание': 'Повторите схемы'}</h3><p>${ratio===100?'Вы верно распознали все структуры.':ratio>=70?'Большинство анатомических ориентиров уже знакомо.':'Вернитесь к схемам долей, ствола, оболочек и ликворной системы.'}</p><button type="button" class="small-action start-again" id="quizAgain">↻ Пройти ещё раз</button></div>`;$('#quizAgain').addEventListener('click',()=>{state.quizIndex=0;state.quizScore=0;state.quizChosen=null;renderQuiz()});return}
 const item=quiz[state.quizIndex],chosen=state.quizChosen;
 box.innerHTML=`<span class="quiz-kicker">ВОПРОС ${String(state.quizIndex+1).padStart(2,'0')} / ${String(quiz.length).padStart(2,'0')}</span><div class="quiz-question">${item.q}</div><div class="quiz-options">${item.answers.map((a,i)=>`<button type="button" class="quiz-option${chosen!==null?(i===item.correct?' correct':i===chosen?' wrong':''):''}" data-answer="${i}" ${chosen!==null?'disabled':''}>${a}</button>`).join('')}</div>${chosen===null?'':`<div class="quiz-explain" role="status"><strong>${chosen===item.correct?'Верно.':'Правильный ответ: '+item.answers[item.correct]+'.'}</strong> ${item.why}</div>`}<div class="quiz-controls"><span class="quiz-score">Верных ответов: ${state.quizScore}</span><button id="quizNext" class="small-action" type="button" ${chosen===null?'disabled':''}>${state.quizIndex===quiz.length-1?'Результат →':'Следующий →'}</button></div>`;
 $$('.quiz-option',box).forEach(b=>b.addEventListener('click',()=>{if(state.quizChosen!==null)return;const answer=Number(b.dataset.answer);state.quizChosen=answer;if(answer===item.correct)state.quizScore++;renderQuiz()}));
 $('#quizNext').addEventListener('click',()=>{if(state.quizChosen===null)return;state.quizIndex++;state.quizChosen=null;renderQuiz()})
}
function onKey(e){
 if(e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey||e.isComposing)return;
 const t=e.target;if(t&&(t.matches('input,textarea,select,[contenteditable="true"]')||t.closest('[contenteditable="true"]')))return;
 if($('#infoDialog').open){if(e.key==='Escape')closeDialog();return}
 // While user focuses an interactive region or button, do not intercept Space/arrow semantics.
 const withinControl=t?.closest('button,a,[role="button"],[role="slider"],input,select,textarea');
 if(e.key.toLowerCase()==='n'&&!withinControl){e.preventDefault();openDialog('notes');return}
 if(e.key.toLowerCase()==='f'&&!withinControl){e.preventDefault();toggleFull();return}
 if(state.mode!=='presentation'||withinControl)return;
 if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){e.preventDefault();navigate(state.current+1)}
 else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();navigate(state.current-1)}
 else if(e.key==='Home'){e.preventDefault();navigate(0)}
 else if(e.key==='End'){e.preventDefault();navigate(slides.length-1)}
}
async function toggleFull(){try{if(document.fullscreenElement){await document.exitFullscreen()}else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else notify('Полноэкранный режим недоступен в этом браузере.')}catch(_){notify('Браузер не разрешил полноэкранный режим. Показ продолжает работать.')}}
$('#prevBtn').addEventListener('click',()=>navigate(state.current-1));$('#nextBtn').addEventListener('click',()=>navigate(state.current+1));
$$('[data-jump]').forEach(b=>b.addEventListener('click',()=>navigate(Number(b.dataset.jump))));
$('#modeToggle').addEventListener('click',switchMode);$('#sourceButton').addEventListener('click',()=>openDialog('sources'));$('#notesButton').addEventListener('click',()=>openDialog('notes'));$('#fullButton').addEventListener('click',toggleFull);
$('#dialogClose').addEventListener('click',closeDialog);$('#infoDialog').addEventListener('click',e=>{if(e.target===$('#infoDialog'))closeDialog()});
$('#logoLink').addEventListener('click',e=>{e.preventDefault();navigate(0)});document.addEventListener('keydown',onKey);
initSelectors();initFlow();renderQuiz();
const initial=slides.findIndex(s=>location.hash==='#'+s.id);state.current=Math.max(0,initial);navigate(state.current,true);
window.addEventListener('pagehide',stopFlow);
})();
