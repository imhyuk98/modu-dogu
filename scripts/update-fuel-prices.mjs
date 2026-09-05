import { mkdir, writeFile } from "node:fs/promises";

const apiKey = process.env.OPINET_API_KEY?.trim();
if (!apiKey) throw new Error("OPINET_API_KEY is required; stale data was left unchanged.");

const areas = {
  "01": "서울", "02": "경기", "03": "강원", "04": "충북", "05": "충남", "06": "전북",
  "20": "전남·광주", "08": "경북", "09": "경남", "10": "부산", "11": "제주", "14": "대구",
  "15": "인천", "17": "대전", "18": "울산", "19": "세종",
};

async function fetchOpinet(path, params = {}) {
  const url = new URL(`https://www.opinet.co.kr/api/${path}`);
  url.search = new URLSearchParams({ code: apiKey, out: "json", ...params }).toString();
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`Opinet request failed with HTTP ${response.status}.`);
  const data = await response.json();
  const rows = data?.RESULT?.OIL;
  if (!Array.isArray(rows) || rows.length === 0) {
    const context = Object.entries(params).map(([key, value]) => `${key}=${value}`).join(", ");
    throw new Error(`Opinet returned no rows for ${path}${context ? ` (${context})` : ""}.`);
  }
  return rows;
}

function katecToWgs84(x, y) {
  const earthRadius = 6_377_397.155;
  const falseEasting = 400_000;
  const falseNorthing = 600_000;
  const longitudeOrigin = 128;
  const latitudeOrigin = 38;
  const scale = 0.9999;
  const latitudeRadians = latitudeOrigin * Math.PI / 180 + (y - falseNorthing) / (earthRadius * scale);
  const longitudeRadians = longitudeOrigin * Math.PI / 180 + (x - falseEasting) / (earthRadius * scale * Math.cos(latitudeRadians));
  return { lat: Number((latitudeRadians * 180 / Math.PI).toFixed(4)), lng: Number((longitudeRadians * 180 / Math.PI).toFixed(4)) };
}

function validatedText(value, field, maxLength, { allowEmpty = false } = {}) {
  const text = String(value ?? "").normalize("NFC").trim().replace(/\s+/g, " ");
  if ((!allowEmpty && !text) || text.length > maxLength || /[\u0000-\u001f\u007f]/.test(text)) {
    throw new Error(`Opinet returned an invalid ${field}; stale data was left unchanged.`);
  }
  return text;
}

const dateParts = Object.fromEntries(new Intl.DateTimeFormat("en", {
  timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
}).formatToParts(new Date()).map(({ type, value }) => [type, value]));
const updatedAt = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
const areaCodeRows = await fetchOpinet("areaCode.do");
const currentAreaCodes = new Set(areaCodeRows.map((row) => String(row.AREA_CD ?? "")));
const missingAreaCodes = Object.keys(areas).filter((code) => !currentAreaCodes.has(code));
if (missingAreaCodes.length > 0) {
  throw new Error(`Opinet area codes changed (${missingAreaCodes.join(", ")} missing); stale data was left unchanged.`);
}

const averageRows = await fetchOpinet("avgAllPrice.do");
const prices = { updatedAt, gasoline: null, diesel: null, lpg: null };

for (const row of averageRows) {
  const numericPrice = Number(row.PRICE);
  const numericDiff = Number(row.DIFF);
  if (!Number.isFinite(numericPrice) || numericPrice <= 0 || !Number.isFinite(numericDiff)) continue;
  const entry = { price: Math.round(numericPrice), diff: Number(numericDiff.toFixed(1)) };
  if (row.PRODCD === "B027") {
    prices.gasoline = entry;
    const value = String(row.TRADE_DT ?? "");
    if (/^\d{8}$/.test(value)) prices.tradeDate = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6)}`;
  } else if (row.PRODCD === "D047") prices.diesel = entry;
  else if (row.PRODCD === "K015") prices.lpg = entry;
}

if (!prices.gasoline || !prices.diesel || !prices.lpg || !prices.tradeDate) {
  throw new Error("Opinet returned incomplete national average prices; stale data was left unchanged.");
}

const regionalData = {};
for (const [code, area] of Object.entries(areas)) {
  const rows = await fetchOpinet("lowTop10.do", { prodcd: "B027", area: code });
  const stations = rows.map((row) => {
    const x = Number(row.GIS_X_COOR);
    const y = Number(row.GIS_Y_COOR);
    const price = Number(row.PRICE);
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(price) || price <= 0 || !row.UNI_ID || !row.OS_NM) {
      throw new Error(`Opinet returned an invalid station row for area ${code}; stale data was left unchanged.`);
    }
    const coordinates = katecToWgs84(x, y);
    if (coordinates.lat < 30 || coordinates.lat > 40 || coordinates.lng < 120 || coordinates.lng > 135) {
      throw new Error(`Opinet returned invalid station coordinates for area ${code}; stale data was left unchanged.`);
    }
    return {
      id: validatedText(row.UNI_ID, "station id", 40),
      name: validatedText(row.OS_NM, "station name", 100),
      brand: validatedText(row.POLL_DIV_CD ?? "ETC", "station brand", 12),
      price: Math.round(price),
      addr: validatedText(row.NEW_ADR || row.VAN_ADR || "", "station address", 200, { allowEmpty: true }),
      ...coordinates,
    };
  });
  regionalData[code] = {
    updatedAt,
    area,
    stations,
  };
  console.log(`Fetched ${area}: ${stations.length} stations.`);
  await new Promise((resolve) => setTimeout(resolve, 300));
}

await mkdir("public/fuel-stations", { recursive: true });
await Promise.all([
  writeFile("public/fuel-prices.json", `${JSON.stringify(prices, null, 2)}\n`, "utf8"),
  ...Object.entries(regionalData).map(([code, value]) => writeFile(`public/fuel-stations/${code}.json`, `${JSON.stringify(value, null, 2)}\n`, "utf8")),
]);
console.log(`Updated national averages and ${Object.keys(regionalData).length} regional fuel files on ${updatedAt}.`);
