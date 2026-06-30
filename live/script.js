const CSV_URL = "https://docs.google.com/spreadsheets/d/1-DBOLfqd041JAgXdosuHBzpqYWVJ6KoMD5znqK1WtcE/gviz/tq?tqx=out:csv&sheet=DATA";

function parseCSV(text) {
  return text.trim().split("\n").map(row =>
    row.split(",").map(cell => cell.replace(/^"|"$/g, ""))
  );
}

function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  document.getElementById("clock").textContent = `${hh}:${mm}`;
  document.getElementById("updated").textContent = `更新 ${hh}:${mm}:${ss}`;
}

async function loadData() {
  try {
    const res = await fetch(CSV_URL + "&t=" + Date.now());
    const text = await res.text();
    const rows = parseCSV(text);

    const header = rows[0];
    const dataRows = rows.slice(1);

    const statusIndex = header.indexOf("Status");
    const liveRow = dataRows.find(row => row[statusIndex] === "LIVE") || dataRows[0];

    const get = (name) => {
      const index = header.indexOf(name);
      return liveRow[index] || "";
    };

    document.getElementById("race").textContent = get("Race");
    document.getElementById("time").textContent = "発走 " + get("Time");
    document.getElementById("safe").textContent = get("SAFE");
    document.getElementById("longshot").textContent = get("LONGSHOT");
    document.getElementById("jiyo").textContent = get("JIYO");

    updateClock();
  } catch (e) {
    document.getElementById("race").textContent = "読み込みエラー";
  }
}

loadData();
updateClock();

setInterval(loadData, 10000);
setInterval(updateClock, 1000);
