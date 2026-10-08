// © 2026 SIKUMI LAB — Shared storage adapter; no credentials in the browser.
import {CONNECTED, API_ROOT} from './runtime.js?v=20261009-2';
export {CONNECTED};
let cache;
const copy=value=>structuredClone(value);
export async function request(path,method='GET',body){
 const response=await fetch(API_ROOT+path,{method,redirect:'error',credentials:'same-origin',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});
 let data;try{data=await response.json();}catch{throw new Error('認証が切れた可能性があります。作業は残っています。再ログインしてお試しください。');}
 if(!response.ok)throw new Error(data.error||'保存できませんでした。作業を残して再度お試しください。');
 return data;
}
export async function loadShared(profile,admin){
 const data=await request(`${admin?'/admin':''}/content?profile=${encodeURIComponent(profile)}`);
 cache={...data.content,inquiries:data.inquiries||[],serverRevision:data.revision};return copy(cache);
}
export const readShared=()=>copy(cache);
async function uploadPhoto(profile,src){
 if(!src?.startsWith('data:'))return src;
 return (await request(`/admin/media?profile=${encodeURIComponent(profile)}`,'POST',{src})).src;
}
export async function publishShared(profile,draft,revision){
 const content=copy(draft);delete content.inquiries;delete content.serverRevision;
 // Only final confirmation starts uploads. Unpublished uploads stay private.
 for(const photo of Object.values(content.photos))photo.src=await uploadPhoto(profile,photo.src);
 for(const list of [content.items,content.news])for(const item of list)item.image=await uploadPhoto(profile,item.image);
 const result=await request(`/admin/content?profile=${encodeURIComponent(profile)}`,'PUT',{revision,content});
 cache={...result.content,inquiries:cache?.inquiries||[],serverRevision:result.revision,publishNotification:result.notification};return copy(cache);
}
export async function submitSharedInquiry(profile,data){return request(`/inquiries?profile=${encodeURIComponent(profile)}`,'POST',data);}
export async function updateSharedInquiry(profile,id,data){
 await request(`/admin/inquiries/${encodeURIComponent(id)}?profile=${encodeURIComponent(profile)}`,'PATCH',data);
 return loadShared(profile,true);
}
export async function retrySharedInquiry(profile,id){return request(`/admin/inquiries/${encodeURIComponent(id)}/retry?profile=${encodeURIComponent(profile)}`,'POST',{});}
export async function sharedHistory(profile){return request(`/admin/history?profile=${encodeURIComponent(profile)}`);}
export async function retrySharedPublication(profile,id){return request(`/admin/history/${encodeURIComponent(id)}/retry?profile=${encodeURIComponent(profile)}`,'POST',{});}
