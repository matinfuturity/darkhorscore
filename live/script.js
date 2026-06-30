// DARKHORSCORE LIVE v6
// Google Apps Script の WebアプリURLを入れる。空ならデモ表示。
const SHEET_API_URL = "";
const REFRESH_MS = 15000;

const demoData = {
  date: "6月22日(日)",
  venue: "中京",
  race: "11R",
  raceName: "プロキオンS",
  postTime: "15:35",
  closeTime: "15:28",
  status: "LIVE",
  safeNo: "5",
  safeHorse: "サンライズジパング",
  longNo: "11",
  longHorse: "サヴァ",
  jiyoNo: "8",
  jiyoHorse: "ハギノアレグリアス",
  memo: "内枠有利の傾向。⑤は安定感抜群。⑪は展開ハマれば一発。"
};

const $ = (id) => document.getElementById(id);
const setText = (id, value) => { if ($(id)) $(id).textContent = value || "-"; };

function normalize(raw){
  const d = Array.isArray(raw) ? raw[0] : raw;
  return {
    date: d["日付"] ?? d.date ?? demoData.date,
    venue: d["競馬場"] ?? d.venue ?? demoData.venue,
    race: d["レース"] ?? d.race ?? demoData.race,
    raceName: d["レース名"] ?? d.raceName ?? demoData.raceName,
    postTime: d["発走"] ?? d.postTime ?? demoData.postTime,
    closeTime: d["締切"] ?? d.closeTime ?? demoData.closeTime,
    status: d.status ?? d["状態"] ?? "LIVE",
    safeNo: d.safeNo ?? d["SAFE"] ?? d["SAFE馬番"] ?? demoData.safeNo,
    safeHorse: d.safeHorse ?? d["SAFE馬名"] ?? d["馬名_SAFE"] ?? d["馬名"] ?? demoData.safeHorse,
    longNo: d.longNo ?? d["LONGSHOT"] ?? d["LONGSHOT馬番"] ?? demoData.longNo,
    longHorse: d.longHorse ?? d["LONGSHOT馬名"] ?? d["馬名_LONGSHOT"] ?? demoData.longHorse,
    jiyoNo: d.jiyoNo ?? d["ジヨ"] ?? d["ジヨ馬番"] ?? demoData.jiyoNo,
    jiyoHorse: d.jiyoHorse ?? d["ジヨ馬名"] ?? d["馬名_ジヨ"] ?? demoData.jiyoHorse,
    memo: d["メモ"] ?? d.memo ?? demoData.memo
  };
}

function render(data){
  setText("date", data.date);
  setText("venueRace", `${data.venue} ${data.race}`);
  setText("raceName", data.raceName);
  setText("postTime", data.postTime);
  setText("closeTime", data.closeTime);
  setText("statusPill", data.status || "LIVE");
  setText("safeNo", stripNo(data.safeNo));
  setText("safeHorse", data.safeHorse);
  setText("longNo", stripNo(data.longNo));
  setText("longHorse", data.longHorse);
  setText("jiyoNo", stripNo(data.jiyoNo));
  setText("jiyoHorse", data.jiyoHorse);
  setText("memo", data.memo);
  const now = new Date();
  setText("updated", `UPDATED ${now.toLocaleTimeString("ja-JP",{hour12:false})}`);
  document.getElementById("stage").classList.remove("flash");
  requestAnimationFrame(()=>document.getElementById("stage").classList.add("flash"));
}

function stripNo(value){
  return String(value || "").replace(/[◎○▲△☆★注\s]/g, "").replace(/[①]/g,"1").replace(/[②]/g,"2").replace(/[③]/g,"3").replace(/[④]/g,"4").replace(/[⑤]/g,"5").replace(/[⑥]/g,"6").replace(/[⑦]/g,"7").replace(/[⑧]/g,"8").replace(/[⑨]/g,"9").replace(/[⑩]/g,"10").replace(/[⑪]/g,"11").replace(/[⑫]/g,"12").replace(/[⑬]/g,"13").replace(/[⑭]/g,"14").replace(/[⑮]/g,"15").replace(/[⑯]/g,"16").replace(/[⑰]/g,"17").replace(/[⑱]/g,"18");
}

async function load(){
  if(!SHEET_API_URL){ render(demoData); return; }
  try{
    const res = await fetch(`${SHEET_API_URL}${SHEET_API_URL.includes('?') ? '&' : '?'}t=${Date.now()}`, {cache:"no-store"});
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    render(normalize(json));
  }catch(e){
    console.warn("Sheet fetch failed", e);
    render(demoData);
  }
}

load();
setInterval(load, REFRESH_MS);
