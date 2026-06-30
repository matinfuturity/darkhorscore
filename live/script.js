const SHEET_API_URL = ""; // Google Apps ScriptのWebアプリURLをここに入れる
const REFRESH_MS = 15000;
const demoData = {
  date:"6月30日(月)", course:"名古屋", race:"1R", raceName:"テストレース", start:"15:30", close:"15:28", status:"受付中",
  safeNo:"◎5", safeHorse:"サンライズジパング", safeMemo:"堅実候補",
  longNo:"◎11", longHorse:"サヴァ", longMemo:"穴候補",
  jiyoNo:"◎2", jiyoHorse:"テストホース", jiyoMemo:"ジヨ本命",
  memo:"良馬場想定。先行有利。内枠の立ち回りに注意。"
};
const $ = id => document.getElementById(id);
function fitStage(){
  const stage = $("stage");
  const scale = Math.min(window.innerWidth/1920, window.innerHeight/1080);
  stage.style.transform = `scale(${scale})`;
  stage.style.marginLeft = `${(window.innerWidth-1920*scale)/2}px`;
  stage.style.marginTop = `${(window.innerHeight-1080*scale)/2}px`;
}
function normalize(raw){
  if(Array.isArray(raw)) raw = raw[0] || {};
  return {
    date: raw.date || raw.日付 || demoData.date,
    course: raw.course || raw.競馬場 || demoData.course,
    race: raw.race || raw.レース || demoData.race,
    raceName: raw.raceName || raw.レース名 || demoData.raceName,
    start: raw.start || raw.発走 || demoData.start,
    close: raw.close || raw.締切 || demoData.close,
    status: raw.status || raw.状態 || demoData.status,
    safeNo: raw.safeNo || raw.SAFE番号 || raw.safe || raw.SAFE || demoData.safeNo,
    safeHorse: raw.safeHorse || raw.SAFE馬名 || raw.safeHorseName || raw.馬名SAFE || demoData.safeHorse,
    safeMemo: raw.safeMemo || raw.SAFEメモ || "",
    longNo: raw.longNo || raw.LONGSHOT番号 || raw.longshot || raw.LONGSHOT || demoData.longNo,
    longHorse: raw.longHorse || raw.LONGSHOT馬名 || raw.longHorseName || raw.馬名LONGSHOT || demoData.longHorse,
    longMemo: raw.longMemo || raw.LONGSHOTメモ || "",
    jiyoNo: raw.jiyoNo || raw.ジヨ番号 || raw.jiyo || raw.ジヨ || demoData.jiyoNo,
    jiyoHorse: raw.jiyoHorse || raw.ジヨ馬名 || raw.馬名ジヨ || demoData.jiyoHorse,
    jiyoMemo: raw.jiyoMemo || raw.ジヨメモ || "",
    memo: raw.memo || raw.メモ || demoData.memo
  };
}
function render(data){
  const d = normalize(data);
  $("date").textContent=d.date; $("course").textContent=d.course; $("raceNo").textContent=d.race; $("raceName").textContent=d.raceName;
  $("startTime").textContent=d.start; $("closeTime").textContent=d.close; $("statusText").textContent=d.status;
  $("safeNo").textContent=d.safeNo; $("safeHorse").textContent=d.safeHorse; $("safeMemo").textContent=d.safeMemo;
  $("longNo").textContent=d.longNo; $("longHorse").textContent=d.longHorse; $("longMemo").textContent=d.longMemo;
  $("jiyoNo").textContent=d.jiyoNo; $("jiyoHorse").textContent=d.jiyoHorse; $("jiyoMemo").textContent=d.jiyoMemo;
  $("memo").textContent=d.memo; $("updatedAt").textContent=new Date().toLocaleTimeString("ja-JP");
  const board=$("board"); board.classList.remove("fade"); void board.offsetWidth; board.classList.add("fade");
}
async function load(){
  if(!SHEET_API_URL){ render(demoData); return; }
  try{ const res=await fetch(`${SHEET_API_URL}?t=${Date.now()}`,{cache:"no-store"}); render(await res.json()); }
  catch(e){ console.error(e); render(demoData); }
}
window.addEventListener("resize", fitStage);
fitStage(); load(); setInterval(load, REFRESH_MS);
