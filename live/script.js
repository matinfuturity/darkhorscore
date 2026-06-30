const CSV_URL = "https://docs.google.com/spreadsheets/d/1-DBOLfqd041JAgXdosuHBzpqYWVJ6KoMD5znqK1WtcE/gviz/tq?tqx=out:csv&sheet=DATA";

function parseCSV(text) {
  return text.trim().split("\n").map(row =>
    row.split(",").map(cell => cell.replace(/^"|"$/g, ""))
  );
}

async function loadData() {
  try {
    const res = await fetch(CSV_URL + "&t=" + Date.now());
    const text = await res.text();
    const rows = parseCSV(text);

    const header = rows[0];
    const dataRows = rows.slice(1);

    const liveRow = dataRows.find(row => {
      const statusIndex = header.indexOf("Status");
      return row[statusIndex] === "LIVE";
    }) || dataRows[0];

    const get = (name) => {
      const index = header.indexOf(name);
      return liveRow[index] || "";
    };

    document.getElementById("race").textContent = get("Race");
    document.getElementById("time").textContent = "発走 " + get("Time");
    document.getElementById("safe").textContent = get("SAFE");
    document.getElementById("longshot").textContent = get("LONGSHOT");
    document.getElementById("jiyo").textContent = get("JIYO");

  } catch (e) {
    document.getElementById("race").textContent = "読み込みエラー";
  }
}

loadData();
setInterval(loadData, 10000);
