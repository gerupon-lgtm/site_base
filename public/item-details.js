// © 2026 SIKUMI LAB — SITE BASE
export function itemCards(items,{esc,imgSrc,badges}) {
  return items.map(item=>`<article class="item-card${item.image?' has-photo':''}" data-item-card="${esc(item.id)}">${item.image?`<div class="image-box"><img src="${imgSrc(item.image)}" alt="${esc(item.name)}" loading="lazy"></div>`:''}<div class="item-copy"><h3>${esc(item.name)}</h3><div class="item-badges">${badges(item)}</div><div class="item-bottom">${item.price?`<p class="price">${esc(item.price)}</p>`:''}<button type="button" class="item-open" data-item="${esc(item.id)}" aria-label="${esc(item.name)}の詳細を見る" aria-haspopup="dialog" aria-controls="item-detail" aria-expanded="false">詳細を見る <span aria-hidden="true">›</span></button></div></div></article>`).join('')||'<p>現在掲載中の案内はありません。</p>';
}

export const itemDetailShell='<dialog id="item-detail" class="item-detail" aria-labelledby="item-detail-title"><div class="item-detail-top"><h2 id="item-detail-title"></h2><button type="button" class="item-detail-close" aria-label="商品の詳細を閉じる">閉じる</button></div><div class="item-detail-content"></div></dialog>';

let activePanel=null,activeTrigger=null,previousOverflow=null;
export function closeItemDetail(restoreFocus=false) {
  const panel=activePanel,trigger=activeTrigger;
  activePanel=null;activeTrigger=null;
  if(panel?.open)panel.close();
  trigger?.setAttribute('aria-expanded','false');
  if(previousOverflow!==null){document.body.style.overflow=previousOverflow;previousOverflow=null;}
  if(restoreFocus&&trigger?.isConnected)trigger.focus({preventScroll:true});
}

export function bindItemDetails(items,{esc,lines,imgSrc,badges,onOpen}) {
  const panel=document.querySelector('#item-detail');
  panel.querySelector('.item-detail-close').onclick=()=>closeItemDetail(true);
  panel.addEventListener('cancel',event=>{event.preventDefault();closeItemDetail(true);});
  panel.addEventListener('close',()=>{if(activePanel===panel)closeItemDetail(true);});
  panel.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;
    const controls=[...panel.querySelectorAll('button,a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el=>!el.disabled&&el.getClientRects().length);
    const first=controls[0],last=controls.at(-1);
    if(!first)return;
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  panel.addEventListener('click',event=>{
    if(event.target!==panel)return;
    const r=panel.getBoundingClientRect();
    if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeItemDetail(true);
  });
  document.querySelectorAll('[data-item]').forEach(trigger=>trigger.onclick=()=>{
    const item=items.find(item=>item.id===trigger.dataset.item);
    if(!item)return;
    closeItemDetail();onOpen?.();activePanel=panel;activeTrigger=trigger;
    panel.querySelector('#item-detail-title').textContent=item.name;
    panel.querySelector('.item-detail-content').innerHTML=`${item.image?`<img class="item-detail-photo" src="${imgSrc(item.image)}" alt="${esc(item.name)}">`:''}<div class="item-detail-badges">${badges(item)}</div>${item.body?`<p class="pre item-detail-description">${lines(item.body)}</p>`:''}${item.price?`<p class="price">${esc(item.price)}</p>`:''}`;
    panel.querySelector('.item-detail-content').scrollTop=0;
    previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
    trigger.setAttribute('aria-expanded','true');panel.showModal();
    panel.querySelector('.item-detail-close').focus({preventScroll:true});
  });
}
