// Учебная 2D-схема из предыдущей версии — только fallback при отсутствии WebGL.
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

