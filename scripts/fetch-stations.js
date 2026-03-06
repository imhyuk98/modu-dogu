const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'F260306305';
const AREAS = {
  '01': '서울', '02': '경기', '03': '강원', '04': '충북', '05': '충남',
  '06': '전북', '07': '전남', '08': '경북', '09': '경남', '10': '부산',
  '11': '제주', '14': '대구', '15': '인천', '16': '광주', '17': '대전',
  '18': '울산', '19': '세종'
};

function katecToWgs84(x, y) {
  // KATEC coordinate system (Bessel ellipsoid, origin 128°E, 38°N)
  const a = 6377397.155;
  const fe = 400000;
  const fn = 600000;
  const lon0 = 128.0;
  const lat0 = 38.0;
  const k0 = 0.9999;

  const dx = x - fe;
  const dy = y - fn;

  const latRad = lat0 * Math.PI / 180 + dy / (a * k0);
  const lonRad = lon0 * Math.PI / 180 + dx / (a * k0 * Math.cos(latRad));

  return {
    lat: +(latRad * 180 / Math.PI).toFixed(4),
    lng: +(lonRad * 180 / Math.PI).toFixed(4)
  };
}

function fetchArea(code, name) {
  return new Promise((resolve) => {
    const url = `https://www.opinet.co.kr/api/lowTop10.do?code=${API_KEY}&prodcd=B027&area=${code}&out=json`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const stations = (json.RESULT?.OIL || []).map(s => {
            const { lat, lng } = katecToWgs84(parseFloat(s.GIS_X_COOR || 0), parseFloat(s.GIS_Y_COOR || 0));
            return {
              id: s.UNI_ID,
              name: s.OS_NM,
              brand: s.POLL_DIV_CD,
              price: parseInt(s.PRICE),
              addr: s.NEW_ADR || s.VAN_ADR,
              lat,
              lng
            };
          });
          const result = {
            updatedAt: new Date().toISOString().slice(0, 10),
            area: name,
            stations
          };
          const outDir = path.join(__dirname, '..', 'public', 'fuel-stations');
          if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
          fs.writeFileSync(path.join(outDir, code + '.json'), JSON.stringify(result, null, 2));
          console.log(`${name}: ${stations.length} stations`);
        } catch (e) {
          console.log(`${name}: ERROR ${e.message}`);
        }
        resolve();
      });
    }).on('error', e => {
      console.log(`${name}: ERROR ${e.message}`);
      resolve();
    });
  });
}

(async () => {
  for (const [code, name] of Object.entries(AREAS)) {
    await fetchArea(code, name);
    await new Promise(r => setTimeout(r, 500));
  }
  console.log('Done!');
})();
