// © 2026 SIKUMI LAB — SITE BASE
export const VERSION = '20261004-21';
import {PAGE_IMAGE_SLOTS,BADGE_OPTIONS,CUSTOM_BADGE_LIMIT} from './site-config.js?v=20261004-21';
export const PROFILES = { shop: '小さなお店', school: '教室', service: 'サービス業' };
export const STORAGE_KEY = 'site-base-display-sample-v1';
const day = 86400000;
export const clone = value => structuredClone(value);
const badgeSegments=new Intl.Segmenter('ja',{granularity:'grapheme'});
export const badgeLength = text => [...badgeSegments.segment(String(text??''))].length;
export function badgeIds(item={}) {
  const selected=Array.isArray(item.badges)?item.badges:item.kind==='キャンペーン'?['campaign']:[];
  return BADGE_OPTIONS.filter(option=>selected.includes(option.id)).map(option=>option.id);
}
export function customBadgeText(text) {
  const value=String(text??'').trim().normalize('NFC');
  if(badgeLength(value)>CUSTOM_BADGE_LIMIT)throw new Error(`自由入力バッジは全角${CUSTOM_BADGE_LIMIT}文字までにしてください。`);
  if(/[\p{Cc}\p{Cf}]/u.test(value.replaceAll('\u200d','')))throw new Error('自由入力バッジは改行せず入力してください。');
  return value;
}
export function badgeLabels(item={}) {
  const labels=BADGE_OPTIONS.filter(option=>badgeIds(item).includes(option.id)).map(option=>option.label);
  if(item.customBadgeEnabled){try{const text=customBadgeText(item.customBadge);if(text)labels.push(text);}catch{}}
  return labels;
}
function normalizeBadges(item) {
  let customBadge='';try{customBadge=customBadgeText(item.customBadge);}catch{}
  return {...item,badges:badgeIds(item),customBadge,customBadgeEnabled:Boolean(item.customBadgeEnabled&&customBadge)};
}
export function pagePhotos(saved={},legacyHero){
  return Object.fromEntries(PAGE_IMAGE_SLOTS.map(slot=>[slot.id,{
    src:typeof saved?.[slot.id]?.src==='string'?saved[slot.id].src:(slot.id==='hero'&&legacyHero)||slot.defaultSrc,
    alt:typeof saved?.[slot.id]?.alt==='string'?saved[slot.id].alt:slot.defaultAlt,
  }]));
}
export function dateInput(time) { const d=new Date(Number(time)); return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16); }
export function displayDate(time, withTime=false) { return new Intl.DateTimeFormat('ja-JP',{timeZone:'Asia/Tokyo',year:'numeric',month:'long',day:'numeric',...(withTime?{hour:'2-digit',minute:'2-digit'}:{})}).format(new Date(Number(time))); }
export function stateOf(item, time) {
  if (item.hidden) return '非表示';
  if (!item.published) return '下書き';
  if (item.startAt && time < item.startAt) return '公開待ち';
  if (item.endAt && time >= item.endAt) return '終了';
  return '公開中';
}
export function hasNew(item, time, days) {
  return item.newEnabled && stateOf(item,time)==='公開中' && (item.newMode==='manual' || (item.newStartedAt && time>=item.newStartedAt && time < item.newStartedAt+days*day));
}
export function publishedNews(content,time) {
  return content.news.filter(n=>stateOf(n,time)==='公開中').sort((a,b)=>Number(b.featured)-Number(a.featured)||b.articleAt-a.articleAt).slice(0,10);
}
export function seed(profile='shop', now=Date.now()) {
  const themes = {
    shop: {name:'器と暮らし こもれび',kind:'小さなお店の見本',intro:'日々の暮らしに、\nひとつの好きなもの。',description:'毎日使うものだから、手に馴染むものを。\n器と暮らしの小さな道具を、ゆっくり選べるお店です。',itemsLabel:'器と道具',category:'暮らしの道具',hours:'火〜日 11:00〜18:00',closed:'月曜日',names:['朝のマグカップ','小さな取り皿','季節の花器'],prices:['2,800円','1,600円','3,200円'],notes:['手に馴染む、やわらかな丸み。','お菓子にも、副菜にも。','一輪を飾る時間を、暮らしに。']},
    school: {name:'暮らしのアトリエ こもれび',kind:'教室の見本',intro:'つくる時間を、\n暮らしの楽しみに。',description:'初めてでも、久しぶりでも。\n自分の手でつくる楽しさを、少人数の教室で。',itemsLabel:'レッスン',category:'教室のご案内',hours:'火〜土 10:00〜17:00',closed:'日曜日・月曜日',names:['はじめての器づくり','季節の花あしらい','暮らしの道具をつくる'],prices:['4,500円 / 回','3,500円 / 回','5,000円 / 回'],notes:['道具はすべて教室で用意します。','季節の素材に触れる、ゆったりした時間。','自分だけの道具を、じっくりと。']},
    service: {name:'暮らしの相談室 こもれび',kind:'サービス業の見本',intro:'暮らしを整える、\n小さなきっかけ。',description:'片づけや模様替え、毎日の使い心地。\n一人ひとりの暮らしに合わせて、一緒に考えます。',itemsLabel:'サービス',category:'ご相談のご案内',hours:'平日 10:00〜18:00',closed:'土曜日・日曜日',names:['はじめての暮らし相談','お部屋の見直し','継続サポート'],prices:['3,000円 / 60分','12,000円から','料金はご相談ください'],notes:['今のお困りごとをお聞きします。','使いやすさを一緒に見直します。','ご都合に合わせて、無理のないペースで。']}
  };
  const t=themes[profile];
  const common={published:true,hidden:false,startAt:now-day,endAt:null,firstPublishedAt:now-day,newStartedAt:now-day,newMode:'auto',newEnabled:true,updatedAt:now-day,badges:[],customBadge:'',customBadgeEnabled:false};
  return { profile,photos:pagePhotos(),sampleNewsRevision:2,days:14,lastUpdated:now-day,shop:{...t,address:'三重県（住所はサンプルです）',hero:'./assets/atelier.svg'},items:t.names.map((name,i)=>({...common,id:`item-${i}`,name,price:t.prices[i],body:t.notes[i],image:`./assets/${i===1?'bowl':i===2?'vase':'cup'}.svg`,newEnabled:i!==2,newMode:i===1?'manual':'auto',badges:i===0?['recommended']:i===1?['limited-quantity']:[]})),news:[{...common,id:'news-0',name:'秋の暮らしを楽しむ、小さなご案内',body:'季節を楽しむひとときをご用意しました。\n詳しい内容は、お気軽にお問い合わせください。',kind:'お知らせ',articleAt:now-day,image:'./assets/atelier.svg',featured:true,price:''},{...common,id:'news-2',name:'今月の営業・受付時間について',body:'今月も通常の営業時間・受付時間でお待ちしています。\n臨時のお休みや時間の変更がある場合は、このお知らせでご案内します。',kind:'お知らせ',articleAt:now-2*day,image:'./assets/cup.svg',featured:false,price:''},{...common,id:'news-3',name:'季節のおすすめを追加しました',body:'暮らしを楽しむ、季節のおすすめを追加しました。\n掲載内容の一覧でご覧いただけます。気になるものがあれば、お気軽にお問い合わせください。',kind:'お知らせ',articleAt:now-3*day,image:'./assets/vase.svg',featured:false,price:''},{...common,id:'news-1',name:'来週から始まる期間限定のご案内',body:'公開予約の見本です。設定画面で表示確認時刻を進めると、ご案内が表示されます。',kind:'キャンペーン',badges:['limited-time','campaign'],articleAt:now+7*day,startAt:now+7*day,endAt:now+14*day,firstPublishedAt:now+7*day,newStartedAt:now+7*day,image:'./assets/vase.svg',featured:false,price:''}],inquiries:[{id:'inquiry-0',name:'デモのお問い合わせ',email:'sample@example.com',body:'掲載されている内容について、詳しく知りたいです。（架空の相談です）',receivedAt:now-day,status:'未対応',memo:'',notification:'メール通知の表示見本'}]};
}
export function readAll() {
  try { const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'); return v&&typeof v==='object'&&!Array.isArray(v)?v:{}; } catch { return {}; }
}
export function read(profile) {
  const v=readAll()[profile];
  if(!v||!Array.isArray(v.items)||!Array.isArray(v.news)||!Array.isArray(v.inquiries)||!v.shop)return seed(profile);
  const next=clone(v);
  if(v.sampleNewsRevision!==2){
    for(const article of seed(profile).news.filter(n=>['news-2','news-3'].includes(n.id))){
      if(next.news.length<20&&!next.news.some(n=>n.id===article.id))next.news.push(article);
    }
    next.sampleNewsRevision=2;
  }
  next.photos=pagePhotos(next.photos,next.shop.hero);
  next.items=next.items.map(normalizeBadges);
  next.news=next.news.map(normalizeBadges);
  return next;
}
export function save(content) { const all=readAll();all[content.profile]=content;localStorage.setItem(STORAGE_KEY,JSON.stringify(all)); }
export function preparePublication(before,draft,reapply,now) {
  const next=clone(draft);
  if (!next.startAt) next.startAt=now;
  if (next.endAt && next.endAt<=next.startAt) throw new Error('終了日時は公開日時より後にしてください。');
  next.published=true;
  if (!before?.firstPublishedAt) { next.firstPublishedAt=next.startAt; next.newStartedAt=next.startAt; }
  else {next.firstPublishedAt=before.firstPublishedAt;next.newStartedAt=reapply?Math.max(now,next.startAt):before.newStartedAt;}
  next.updatedAt=now; return next;
}

// Editing work is stored separately and is never read by the public renderer.
export const WORK_KEY='site-base-display-work-v1';
export const publicPart=c=>({shop:c.shop,photos:c.photos,items:c.items,news:c.news,days:c.days});
export const workChanged=(base,draft)=>JSON.stringify(publicPart(base))!==JSON.stringify(publicPart(draft));
export function readWork(profile){
  try{const work=JSON.parse(localStorage.getItem(WORK_KEY)||'{}')[profile];return work?.base?.profile===profile&&work?.draft?.profile===profile&&Array.isArray(work.base.items)&&Array.isArray(work.draft.items)&&Array.isArray(work.draft.news)&&work.draft.photos&&work.draft.shop?clone(work):null;}catch{return null;}
}
export function saveWork(profile,work){
  let all;try{all=JSON.parse(localStorage.getItem(WORK_KEY)||'{}');}catch{all={};}
  if(!all||typeof all!=='object'||Array.isArray(all))all={};
  if(work)all[profile]=work;else delete all[profile];
  if(Object.keys(all).length)localStorage.setItem(WORK_KEY,JSON.stringify(all));else localStorage.removeItem(WORK_KEY);
}
export function prepareWork(base,draft,current,time){
  if(workChanged(base,current))throw new Error('別の画面で公開内容が更新されています。作業内容は残しています。更新内容を確認してから編集をやり直してください。');
  const next={...clone(current),...clone(publicPart(draft))};
  for(const key of ['items','news'])next[key]=next[key].map(item=>{
    const before=base[key].find(i=>i.id===item.id);
    if(before&&JSON.stringify(before)===JSON.stringify(item))return clone(before);
    const final=item.published?preparePublication(before,item,!!item.reapplyNew&&item.newEnabled,time):{...clone(item),updatedAt:time};
    if(final.endAt&&final.endAt<=(final.startAt||time))throw new Error(`${item.name}：終了日時は公開日時より後にしてください。`);
    delete final.reapplyNew;return final;
  });
  next.lastUpdated=time;return next;
}
