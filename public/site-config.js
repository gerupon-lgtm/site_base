// © 2026 SIKUMI LAB — SITE BASE
// Initial site customization: register every editable page image here and
// render it with pageImage(id) at its intended position in app.js.
// Keep IDs stable when labels or layouts change to preserve uploaded photos.
export const BADGE_OPTIONS = [
  {id:'recommended',label:'おすすめ'},
  {id:'limited-time',label:'期間限定'},
  {id:'campaign',label:'キャンペーン'},
  {id:'limited-quantity',label:'数量限定'},
  {id:'sold-out',label:'売り切れ'},
  {id:'closed',label:'受付停止'},
  {id:'ended',label:'終了'},
];
export const CUSTOM_BADGE_LIMIT = 6;
export const PAGE_IMAGE_SLOTS = [
  {id:'hero',label:'トップ画像',defaultSrc:'./assets/atelier.svg',defaultAlt:'お店・教室・サービスの紹介画像'},
  {id:'access',label:'ご案内の画像',defaultSrc:'./assets/atelier.svg',defaultAlt:'お店・教室・サービスの場所のご案内'},
];
