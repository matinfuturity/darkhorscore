const SHEET_API_URL = ""; // ここにGoogle Apps ScriptのWebアプリURLを入れる
const REFRESH_MS = 10000;

const demoData = {
  date: "6月30日(月)", place: "名古屋", race: "1R", raceName: "テストレース",
  startTime: "15:30", closeTime: "15:28",
  safe: "5", safeHorse: "サンライズジパング",
  longshot: "11", longshotHorse: "サヴァ",
  jiyo: "2", jiyoHorse: "メイショウテンスイ",
  memo: "良馬場想定。先行力と内枠を重視。締切直前の馬体重・オッズ変動に注意。"
};

const $ = (id) => document.getElementById(id);

function pickValue(row, keys, fallback = "") {
  for (const key of keys) {
    if (row && row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== "") return row[key];
  }
  return fallback;
}

function normalize(raw) {
  const row = Array.isArray(raw) ? raw[0] : raw;
  return {
    date: pickValue(row, ["日付", "date"], demoData.date),
    place: pickValue(row, ["競馬場", "place"], demoData.place),
    race: pickValue(row, ["レース", "race"], demoData.race),
    raceName: pickValue(row, ["レース名", "raceName", "name"], demoData.raceName),
    startTime: pickValue(row, ["発走", "startTime", "start"], demoData.startTime),
    closeTime: pickValue(row, ["締切", "closeTime", "close"], demoData.closeTime),
    safe: pickValue(row, ["SAFE", "safe"], demoData.safe),
    safeHorse: pickValue(row, ["SAFE馬名", "safeHorse", "馬名SAFE", "馬名"], demoData.safeHorse),
    longshot: pickValue(row, ["LONGSHOT", "longshot"], demoData.longshot),
    longshotHorse: pickValue(row, ["LONGSHOT馬名", "longshotHorse", "馬名LONGSHOT"], demoData.longshotHorse),
    jiyo: pickValue(row, ["ジヨ", "jiyo"], demoData.jiyo),
    jiyoHorse: pickValue(row, ["ジヨ馬名", "jiyoHorse", "馬名ジヨ"], demoData.jiyoHorse),
    memo: pickValue(row, ["メモ", "memo"], demoData.memo)
  };
}

function setText(id, value) { $(id).textContent = value || "-"; }

function updateView(data) {
  const board = document.querySelector(".board");
  board.classList.remove("fade");
  void board.offsetWidth;
  board.classList.add("fade");

  setText("date", data.date);
  setText("place", data.place);
  setText("race", data.race);
  setText("raceName", data.raceName);
  setText("startTime", data.startTime);
  setText("closeTime", data.closeTime);
  setText("safeNumber", `◎${data.safe}`);
  setText("safeHorse", data.safeHorse);
  setText("longNumber", `◎${data.longshot}`);
  setText("longHorse", data.longshotHorse);
  setText("jiyoNumber", `◎${data.jiyo}`);
  setText("jiyoHorse", data.jiyoHorse);
  setText("memo", data.memo);

  const now = new Date();
  setText("updatedAt", `更新 ${now.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}`);
}

async function loadData() {
  if (!SHEET_API_URL) {
    updateView(demoData);
    return;
  }
  try {
    const res = await fetch(`${SHEET_API_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    updateView(normalize(json));
  } catch (error) {
    console.warn("Sheet fetch failed:", error);
    updateView(demoData);
  }
}

loadData();
setInterval(loadData, REFRESH_MS);
