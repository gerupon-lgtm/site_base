// © 2026 SIKUMI LAB — SITE BASE
export function newsList(news,esc,renderBadges) {
  return news.map(n=>`<article class="news-card ${n.featured?'featured':''}"><h3><button class="news-title" data-news="${esc(n.id)}" aria-expanded="false" aria-controls="news-detail"><span class="news-title-label"><span>${esc(n.name)}</span>${n.featured?'<span class="badge">ピックアップ</span>':''}${renderBadges(n)}</span><span class="news-open-icon" aria-hidden="true">＋</span></button></h3></article>`).join('')||'<p>現在掲載中のお知らせはありません。</p>';
}

export const newsDetailShell = '<section id="news-detail" class="news-detail" role="dialog" aria-labelledby="news-detail-title" hidden><div class="news-detail-top"><h2 id="news-detail-title"></h2><button type="button" class="news-detail-close" aria-label="お知らせの詳細を閉じる">閉じる</button></div><div class="news-detail-content"></div></section>';

let activeTrigger=null;
export function closeNewsDetail(restoreFocus=false) {
  document.querySelector('#news-detail')?.setAttribute('hidden','');
  activeTrigger?.setAttribute('aria-expanded','false');
  if(restoreFocus&&activeTrigger?.isConnected)activeTrigger.focus({preventScroll:true});
  activeTrigger=null;
}

export function bindNewsDetails(news,{esc,lines,imgSrc,badges,displayDate}) {
  const panel=document.querySelector('#news-detail');
  panel.querySelector('.news-detail-close').onclick=()=>closeNewsDetail(true);
  document.querySelectorAll('[data-news]').forEach(trigger=>trigger.onclick=()=>{
    if(activeTrigger===trigger){closeNewsDetail(true);return;}
    const article=news.find(n=>n.id===trigger.dataset.news);
    if(!article)return;
    closeNewsDetail();activeTrigger=trigger;
    panel.querySelector('h2').textContent=article.name;
    panel.querySelector('.news-detail-content').innerHTML=`<div class="news-detail-meta"><time>${displayDate(article.articleAt)}</time>${article.featured?'<span>ピックアップ</span>':''}${badges(article)}</div>${article.image?`<img src="${imgSrc(article.image)}" alt="${esc(article.name)}">`:""}<p class="pre">${lines(article.body)}</p>`;
    panel.hidden=false;trigger.setAttribute('aria-expanded','true');
    panel.querySelector('.news-detail-content').scrollTop=0;
    panel.querySelector('.news-detail-close').focus({preventScroll:true});
  });
}

document.addEventListener('pointerdown',event=>{
  if(activeTrigger&&!event.target.closest('#news-detail')&&!event.target.closest('[data-news]'))closeNewsDetail();
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&activeTrigger){event.preventDefault();closeNewsDetail(true);}
});
document.addEventListener('focusin',event=>{
  if(activeTrigger&&!event.target.closest('#news-detail')&&!event.target.closest('[data-news]'))closeNewsDetail();
});
