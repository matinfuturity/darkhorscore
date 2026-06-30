const SHEET_API_URL = ""; // Google Apps Script のWebアプリURLを入れる
const REFRESH_MS = 8000;
const demo = {
  date:"6月30日(月)", course:"名古屋", race:"1R", raceName:"テストレース",
  startTime:"15:30", closeTime:"15:28", status:"受付中",
  safe:"5", safeHorse:"サンライズジパング",
  longshot:"11", longHorse:"サヴァ",
  jiyo:"2", jiyoHorse:"テストホース",
  memo:"良馬場想定。先行有利。内枠注意。"
};
const $ = id => document.getElementById(id);
function normalize(raw){
  const d = Array.isArray(raw) ? raw[0] : (raw?.data || raw || {});
  return {
    date: d.date || d["日付"] || demo.date,
    course: d.course || d["競馬場"] || demo.course,
    race: d.race || d["レース"] || demo.race,
    raceName: d.raceName || d["レース名"] || demo.raceName,
    startTime: d.startTime || d["発走"] || demo.startTime,
    closeTime: d.closeTime || d["締切"] || demo.closeTime,
    status: d.status || d["状態"] || demo.status,
    safe: d.safe || d["SAFE"] || demo.safe,
    safeHorse: d.safeHorse || d["SAFE馬名"] || d["馬名_SAFE"] || d["馬名"] || demo.safeHorse,
    longshot: d.longshot || d["LONGSHOT"] || demo.longshot,
    longHorse: d.longHorse || d["LONGSHOT馬名"] || d["馬名_LONGSHOT"] || demo.longHorse,
    jiyo: d.jiyo || d["ジヨ"] || demo.jiyo,
    jiyoHorse: d.jiyoHorse || d["ジヨ馬名"] || d["馬名_ジヨ"] || demo.jiyoHorse,
    memo: d.memo || d["メモ"] || demo.memo
  };
}
function setText(id,val){ const el=$(id); if(el) el.textContent = val ?? ""; }
function render(data){
  setText("date",data.date); setText("course",data.course); setText("race",data.race); setText("raceName",data.raceName);
  setText("startTime",data.startTime); setText("closeTime",data.closeTime);
  setText("safeNo","◎"+data.safe); setText("safeHorse",data.safeHorse);
  setText("longNo","◎"+data.longshot); setText("longHorse",data.longHorse);
  setText("jiyoNo","◎"+data.jiyo); setText("jiyoHorse",data.jiyoHorse);
  setText("memo",data.memo);
  const s=$("status"); s.textContent=data.status || calcStatus(data.closeTime); s.classList.toggle("closed", s.textContent.includes("締切") || s.textContent.includes("終了"));
  s.classList.toggle("open", !s.classList.contains("closed"));
  setText("updated","UPDATED "+new Date().toLocaleTimeString("ja-JP",{hour12:false}));
  $("board").classList.remove("flash"); void $("board").offsetWidth; $("board").classList.add("flash");
  updateCountdown(data.closeTime);
}
function calcStatus(closeTime){
  const mins = minutesUntil(closeTime);
  return mins !== null && mins < 0 ? "締切" : "受付中";
}
function minutesUntil(t){
  if(!t || !/^\d{1,2}:\d{2}$/.test(t)) return null;
  const [h,m]=t.split(":").map(Number); const now=new Date(); const target=new Date();
  target.setHours(h,m,0,0); return Math.floor((target-now)/60000);
}
function updateCountdown(closeTime){
  const el=$("countdown");
  if(!/^\d{1,2}:\d{2}$/.test(closeTime||"")){ el.textContent="締切まで --:--"; return; }
  const [h,m]=closeTime.split(":").map(Number); const now=new Date(); const target=new Date(); target.setHours(h,m,0,0);
  let diff=Math.floor((target-now)/1000);
  if(diff<=0){ el.textContent="締切済み"; $("status").textContent="締切"; $("status").classList.add("closed"); return; }
  const mm=String(Math.floor(diff/60)).padStart(2,"0"); const ss=String(diff%60).padStart(2,"0");
  el.textContent=`締切まで ${mm}:${ss}`;
}
async function load(){
  if(!SHEET_API_URL){ render(demo); return; }
  try{ const res=await fetch(SHEET_API_URL+"?t="+Date.now(),{cache:"no-store"}); render(normalize(await res.json())); }
  catch(e){ console.warn(e); render(demo); }
}
load(); setInterval(load, REFRESH_MS); setInterval(()=>updateCountdown($("closeTime").textContent),1000);
