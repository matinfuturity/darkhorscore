const CSV_URL = "https://docs.google.com/spreadsheets/d/1-DBOLfqd041JAgXdosuHBzpqYWVJ6KoMD5znqK1WtcE/gviz/tq?tqx=out:csv&sheet=DATA";

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && quote && next === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      quote = !quote;
    } else if (char === "," && !quote) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quote) {
      if (cell || row.length) {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      }
    } else {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

async function loadData() {
  try {
    const res = await fetch(CSV_URL + "&t=" + Date.now());
    const text = await res.text();
    const rows = parseCSV(text);

    const header = rows[0].map(h => h.trim());
    const dataRows = rows.slice(1);

    const statusIndex = header.indexOf("Status");
    const liveRow = dataRows.find(row => (row[statusIndex] || "").trim() === "LIVE") || dataRows[0];

    const get = (name) => {
      const index = header.indexOf(name);
      return index >= 0 ? (liveRow[index] || "") : "";
    };

    document.getElementById("date").textContent = get("Date");
    document.getElementById("race").textContent = get("Race");
    document.getElementById("raceName").textContent = get("RaceName");
    document.getElementById("start").textContent = get("Start");
    document.getElementById("close").textContent = get("Close");
    document.getElementById("safe").textContent = get("SAFE");
    document.getElementById("safeName").textContent = get("SAFE_NAME");
    document.getElementById("longshot").textContent = get("LONGSHOT");
    document.getElementById("longName").textContent = get("LONG_NAME");
    document.getElementById("jiyo").textContent = get("JIYO");
    document.getElementById("jiyoName").textContent = get("JIYO_NAME");
    document.getElementById("memo").textContent = get("MEMO");
  } catch (e) {
    document.getElementById("race").textContent = "読み込みエラー";
  }
}

loadData();
setInterval(loadData, 10000);
