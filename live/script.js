// DARKHORSCORE LIVE v8
// Google Apps ScriptのURLをここに入れる。空ならデモ表示。
const SHEET_API_URL = "";
const REFRESH_MS = 5000;

const demo = {
  date:"6月30日(月)", course:"名古屋", race:"11R", raceName:"テストレース",
  postTime:"15:30", closeTime:"15:28",
  safe:"5", safeHorse:"サンライズジパング", safeMemo:"[ 牡4 ]",
  longshot:"11", longHorse:"サヴァ", longMemo:"[ 牡6 ]",
  jiyo:"2", jiyoHorse:"テストホース", jiyoMemo:"[ 牡5 ]",
  memo:"・良馬場想定\n・⑤は安定感抜群\n・先行有利の展開\n・⑪は展開ハマれば一発\n・内枠有利の傾向\n・②は距離延長がポイント"
};

const $ = (id)=>document.getElementById(id);
function first(obj, keys, fallback=""){
  for(const k of keys){ if(obj && obj[k] !== undefined && obj[k] !== null && String(obj[k]).trim() !== "") return obj[k]; }
  return fallback;
}
function normalize(raw){
  const r = Array.isArray(raw) ? raw[0] : (raw.data || raw.row || raw.current || raw);
  return {
    date:first(r,["date","日付"],demo.date),
    course:first(r,["course","競馬場"],demo.course),
    race:first(r,["race","レース","R"],demo.race),
    raceName:first(r,["raceName","レース名"],demo.raceName),
    postTime:first(r,["postTime","発走"],demo.postTime),
    closeTime:first(r,["closeTime","締切"],demo.closeTime),
    safe:first(r,["safe","SAFE"],demo.safe),
    safeHorse:first(r,["safeHorse","SAFE馬名","馬名SAFE","safe_name"],demo.safeHorse),
    safeMemo:first(r,["safeMemo","SAFEメモ"],demo.safeMemo),
    longshot:first(r,["longshot","LONGSHOT"],demo.longshot),
    longHorse:first(r,["longHorse","LONGSHOT馬名","馬名LONGSHOT","longshot_name"],demo.longHorse),
    longMemo:first(r,["longMemo","LONGSHOTメモ"],demo.longMemo),
    jiyo:first(r,["jiyo","ジヨ"],demo.jiyo),
    jiyoHorse:first(r,["jiyoHorse","ジヨ馬名","馬名ジヨ","jiyo_name"],demo.jiyoHorse),
    jiyoMemo:first(r,["jiyoMemo","ジヨメモ"],demo.jiyoMemo),
    memo:first(r,["memo","メモ"],demo.memo)
  };
}
function render(data){
  $("date").textContent=data.date; $("course").textContent=data.course; $("raceNo").textContent=data.race; $("raceName").textContent=data.raceName;
  $("postTime").textContent=data.postTime; $("closeTime").textContent=data.closeTime;
  $("safeNo").textContent=data.safe; $("safeHorse").textContent=data.safeHorse; $("safeMemo").textContent=data.safeMemo;
  $("longNo").textContent=data.longshot; $("longHorse").textContent=data.longHorse; $("longMemo").textContent=data.longMemo;
  $("jiyoNo").textContent=data.jiyo; $("jiyoHorse").textContent=data.jiyoHorse; $("jiyoMemo").textContent=data.jiyoMemo;
  $("memo").innerHTML = String(data.memo || "").split(/\n|、|,/).filter(Boolean).slice(0,6).map(x=>`<p>${x.trim().startsWith("・")?x.trim():"・"+x.trim()}</p>`).join("");
  $("board").classList.remove("updated"); void $("board").offsetWidth; $("board").classList.add("updated");
}
async function load(){
  if(!SHEET_API_URL){ render(demo); return; }
  try{ const res = await fetch(SHEET_API_URL + (SHEET_API_URL.includes('?')?'&':'?') + 't=' + Date.now(), {cache:'no-store'}); render(normalize(await res.json())); }
  catch(e){ console.warn(e); render(demo); }
}
load(); setInterval(load, REFRESH_MS);
