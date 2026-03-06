"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ── Types ── */
interface Station {
  id: string;
  name: string;
  brand: string;
  price: number;
  addr: string;
  lat: number;
  lng: number;
}

interface FuelData {
  updatedAt: string;
  area: string;
  stations: Station[];
}

/* ── Area codes & centers ── */
const AREAS: { code: string; name: string; lat: number; lng: number }[] = [
  { code: "01", name: "서울", lat: 37.5665, lng: 126.978 },
  { code: "02", name: "경기", lat: 37.4138, lng: 127.5183 },
  { code: "03", name: "강원", lat: 37.8228, lng: 128.1555 },
  { code: "04", name: "충북", lat: 36.6357, lng: 127.4912 },
  { code: "05", name: "충남", lat: 36.5184, lng: 126.8 },
  { code: "06", name: "전북", lat: 35.8203, lng: 127.1088 },
  { code: "07", name: "전남", lat: 34.8161, lng: 126.4629 },
  { code: "08", name: "경북", lat: 36.4919, lng: 128.8889 },
  { code: "09", name: "경남", lat: 35.4606, lng: 128.2132 },
  { code: "10", name: "부산", lat: 35.1796, lng: 129.0756 },
  { code: "11", name: "제주", lat: 33.4996, lng: 126.5312 },
  { code: "14", name: "대구", lat: 35.8714, lng: 128.6014 },
  { code: "15", name: "인천", lat: 37.4563, lng: 126.7052 },
  { code: "16", name: "광주", lat: 35.1595, lng: 126.8526 },
  { code: "17", name: "대전", lat: 36.3504, lng: 127.3845 },
  { code: "18", name: "울산", lat: 35.5384, lng: 129.3114 },
  { code: "19", name: "세종", lat: 36.48, lng: 127.2561 },
];

/* ── Brand config ── */
const BRAND_CONFIG: Record<string, { label: string; color: string; markerColor: string }> = {
  SKE: { label: "SK에너지", color: "#ef4444", markerColor: "#ef4444" },
  GSC: { label: "GS칼텍스", color: "#3b82f6", markerColor: "#3b82f6" },
  HDO: { label: "현대오일뱅크", color: "#f97316", markerColor: "#f97316" },
  SOL: { label: "S-Oil", color: "#eab308", markerColor: "#eab308" },
  RTX: { label: "자영알뜰", color: "#22c55e", markerColor: "#22c55e" },
  NHO: { label: "농협", color: "#16a34a", markerColor: "#16a34a" },
  ETC: { label: "기타", color: "#6b7280", markerColor: "#6b7280" },
};

function getBrandInfo(brand: string) {
  return BRAND_CONFIG[brand] || BRAND_CONFIG.ETC;
}

/* ── Price formatting ── */
function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}

/* ── Kakao map marker SVG as data URI ── */
function createMarkerImage(color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
    <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z" fill="${color}" stroke="#fff" stroke-width="1.5"/>
    <circle cx="14" cy="14" r="6" fill="#fff"/>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default function FuelMapPage() {
  const [selectedArea, setSelectedArea] = useState(AREAS[0]);
  const [data, setData] = useState<FuelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [showList, setShowList] = useState(true);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);

  /* ── Load Kakao Maps SDK ── */
  useEffect(() => {
    const w = window as any;
    if (w.kakao && w.kakao.maps) {
      if (w.kakao.maps.Map) {
        setMapReady(true);
      } else {
        w.kakao.maps.load(() => setMapReady(true));
      }
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://dapi.kakao.com/v2/maps/sdk.js?appkey=119e121dca3dca3aa9c4985cd6d8be52&autoload=false";
    script.async = true;
    script.onload = () => {
      const k = (window as any).kakao;
      if (k && k.maps) {
        k.maps.load(() => setMapReady(true));
      } else {
        setError("카카오맵 SDK 로드에 실패했습니다.");
      }
    };
    script.onerror = () => {
      setError("카카오맵 SDK를 불러올 수 없습니다. 도메인 등록을 확인해주세요.");
    };
    document.head.appendChild(script);
  }, []);

  /* ── Initialize map ── */
  useEffect(() => {
    if (!mapReady || !mapContainerRef.current) return;
    const kakao = (window as any).kakao;

    const options = {
      center: new kakao.maps.LatLng(selectedArea.lat, selectedArea.lng),
      level: 8,
    };
    const map = new kakao.maps.Map(mapContainerRef.current, options);
    mapRef.current = map;

    // Add zoom controls
    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    return () => {
      markersRef.current = [];
      infoWindowRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady]);

  /* ── Fetch data when area changes ── */
  useEffect(() => {
    setLoading(true);
    setError(null);
    setData(null);
    setSelectedStation(null);

    fetch(`/fuel-stations/${selectedArea.code}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("not_found");
        return res.json();
      })
      .then((json: FuelData) => {
        // Sort by price ascending
        json.stations.sort((a, b) => a.price - b.price);
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setError("데이터 준비 중입니다. 잠시 후 다시 시도해주세요.");
        setLoading(false);
      });
  }, [selectedArea]);

  /* ── Update markers when data changes ── */
  useEffect(() => {
    if (!mapReady || !mapRef.current || !data) return;
    const kakao = (window as any).kakao;
    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
    }

    // Move map center
    const center = new kakao.maps.LatLng(selectedArea.lat, selectedArea.lng);
    map.setCenter(center);
    map.setLevel(8);

    // Cheapest price for ranking
    const cheapestPrice = data.stations.length > 0 ? data.stations[0].price : 0;

    // Create markers
    data.stations.forEach((station, idx) => {
      const brandInfo = getBrandInfo(station.brand);
      const position = new kakao.maps.LatLng(station.lat, station.lng);

      const imageSize = new kakao.maps.Size(28, 40);
      const imageOption = { offset: new kakao.maps.Point(14, 40) };
      const markerImageSrc = createMarkerImage(brandInfo.markerColor);
      const markerImage = new kakao.maps.MarkerImage(
        markerImageSrc,
        imageSize,
        imageOption
      );

      const marker = new kakao.maps.Marker({
        map,
        position,
        image: markerImage,
        title: station.name,
      });

      const priceClass =
        station.price === cheapestPrice
          ? "background:#22c55e;color:#fff;"
          : idx < 3
            ? "background:#fef9c3;color:#854d0e;"
            : "background:#f3f4f6;color:#374151;";

      const infoContent = `
        <div style="padding:12px 14px;min-width:220px;font-family:Pretendard Variable,sans-serif;line-height:1.5;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
            <span style="width:10px;height:10px;border-radius:50%;background:${brandInfo.markerColor};flex-shrink:0;"></span>
            <span style="font-size:13px;font-weight:700;color:#111827;">${station.name}</span>
          </div>
          <div style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:14px;font-weight:700;${priceClass}margin-bottom:4px;">
            ${formatPrice(station.price)}원/L
          </div>
          <div style="font-size:11px;color:#6b7280;margin-top:4px;">${station.addr}</div>
        </div>
      `;

      kakao.maps.event.addListener(marker, "click", () => {
        if (infoWindowRef.current) infoWindowRef.current.close();
        const infoWindow = new kakao.maps.InfoWindow({
          content: infoContent,
          removable: true,
        });
        infoWindow.open(map, marker);
        infoWindowRef.current = infoWindow;
        setSelectedStation(station);
      });

      markersRef.current.push(marker);
    });
  }, [data, mapReady, selectedArea]);

  /* ── Center map on station ── */
  const focusStation = useCallback(
    (station: Station) => {
      if (!mapReady || !mapRef.current) return;
      const kakao = (window as any).kakao;
      const map = mapRef.current;

      const position = new kakao.maps.LatLng(station.lat, station.lng);
      map.setCenter(position);
      map.setLevel(3);

      // Find the marker and trigger click
      const idx = data?.stations.findIndex((s) => s.id === station.id) ?? -1;
      if (idx >= 0 && markersRef.current[idx]) {
        if (infoWindowRef.current) infoWindowRef.current.close();

        const brandInfo = getBrandInfo(station.brand);
        const cheapestPrice =
          data && data.stations.length > 0 ? data.stations[0].price : 0;
        const priceClass =
          station.price === cheapestPrice
            ? "background:#22c55e;color:#fff;"
            : idx < 3
              ? "background:#fef9c3;color:#854d0e;"
              : "background:#f3f4f6;color:#374151;";

        const infoContent = `
          <div style="padding:12px 14px;min-width:220px;font-family:Pretendard Variable,sans-serif;line-height:1.5;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
              <span style="width:10px;height:10px;border-radius:50%;background:${brandInfo.markerColor};flex-shrink:0;"></span>
              <span style="font-size:13px;font-weight:700;color:#111827;">${station.name}</span>
            </div>
            <div style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:14px;font-weight:700;${priceClass}margin-bottom:4px;">
              ${formatPrice(station.price)}원/L
            </div>
            <div style="font-size:11px;color:#6b7280;margin-top:4px;">${station.addr}</div>
          </div>
        `;

        const infoWindow = new kakao.maps.InfoWindow({
          content: infoContent,
          removable: true,
        });
        infoWindow.open(map, markersRef.current[idx]);
        infoWindowRef.current = infoWindow;
      }

      setSelectedStation(station);
    },
    [mapReady, data]
  );

  const cheapestPrice =
    data && data.stations.length > 0 ? data.stations[0].price : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Title */}
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
          전국 주유소 최저가 지도
        </h1>
        <p className="text-sm text-gray-500">
          시도별 최저가 주유소를 지도에서 확인하세요
        </p>
      </div>

      {/* Area Selector */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1.5">
          {AREAS.map((area) => (
            <button
              key={area.code}
              onClick={() => setSelectedArea(area)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                selectedArea.code === area.code
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {area.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map + List Layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Map */}
        <div className="lg:w-[70%] w-full">
          <div className="calc-card overflow-hidden">
            {/* Map header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">🗺️</span>
                <span className="text-sm font-bold text-gray-900">
                  {selectedArea.name} 주유소 지도
                </span>
                {data && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {data.stations.length}개
                  </span>
                )}
              </div>
              {data?.updatedAt && (
                <span className="text-xs text-gray-400">
                  {data.updatedAt} 기준
                </span>
              )}
            </div>

            {/* Brand legend */}
            <div className="flex flex-wrap gap-2 px-4 py-2 border-b border-gray-50 bg-gray-50/50">
              {Object.entries(BRAND_CONFIG)
                .filter(([key]) => key !== "ETC")
                .map(([key, info]) => (
                  <div key={key} className="flex items-center gap-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: info.color }}
                    />
                    <span className="text-[11px] text-gray-500">{info.label}</span>
                  </div>
                ))}
            </div>

            {/* Map container */}
            <div className="relative w-full" style={{ height: "clamp(350px, 55vh, 600px)" }}>
              <div
                ref={mapContainerRef}
                className="w-full h-full"
              />
              {!mapReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
                    <p className="text-sm text-gray-500">지도를 불러오는 중...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Station list */}
        <div className="lg:w-[30%] w-full">
          <div className="calc-card overflow-hidden">
            {/* List header */}
            <button
              onClick={() => setShowList(!showList)}
              className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-100 lg:cursor-default"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">⛽</span>
                <span className="text-sm font-bold text-gray-900">
                  최저가 순위
                </span>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform lg:hidden ${
                  showList ? "" : "-rotate-90"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* List content */}
            <div
              className={`overflow-y-auto transition-all duration-300 ${
                showList ? "max-h-[50vh] lg:max-h-[calc(55vh+52px)]" : "max-h-0"
              }`}
            >
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2" />
                    <p className="text-xs text-gray-500">
                      데이터를 불러오는 중...
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center px-4">
                    <div className="text-3xl mb-3">📭</div>
                    <p className="text-sm text-gray-500">{error}</p>
                  </div>
                </div>
              )}

              {data && data.stations.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="text-3xl mb-3">🔍</div>
                    <p className="text-sm text-gray-500">
                      주유소 데이터가 없습니다.
                    </p>
                  </div>
                </div>
              )}

              {data &&
                data.stations.map((station, idx) => {
                  const brandInfo = getBrandInfo(station.brand);
                  const isSelected = selectedStation?.id === station.id;
                  const isCheapest = station.price === cheapestPrice;

                  return (
                    <button
                      key={station.id}
                      onClick={() => focusStation(station)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors hover:bg-blue-50/50 ${
                        isSelected ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Rank */}
                        <div
                          className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            idx === 0
                              ? "bg-yellow-400 text-white"
                              : idx === 1
                                ? "bg-gray-300 text-white"
                                : idx === 2
                                  ? "bg-amber-600 text-white"
                                  : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {idx + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Name + brand */}
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ background: brandInfo.color }}
                            />
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {station.name}
                            </p>
                          </div>

                          {/* Address */}
                          <p className="text-[11px] text-gray-400 truncate mb-1">
                            {station.addr}
                          </p>
                        </div>

                        {/* Price */}
                        <div
                          className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-sm font-bold ${
                            isCheapest
                              ? "bg-green-500 text-white"
                              : idx < 3
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {formatPrice(station.price)}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* SEO section */}
      <div className="mt-8 space-y-6">
        <div className="calc-seo-card">
          <h2 className="calc-seo-title">전국 주유소 최저가 지도란?</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            전국 17개 시도의 주유소 가격을 한눈에 비교할 수 있는 서비스입니다.
            한국석유공사 오피넷(OPINET) 데이터를 기반으로 매일 업데이트되며,
            지도에서 최저가 주유소의 위치를 확인하고 가격을 비교할 수 있습니다.
            SK에너지, GS칼텍스, 현대오일뱅크, S-Oil 등 주요 브랜드별로
            색상이 구분되어 있어 한눈에 파악이 가능합니다.
          </p>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">주유소 가격 절약 팁</h2>
          <ul className="text-sm text-gray-600 leading-relaxed space-y-2">
            <li>
              <strong>알뜰 주유소 활용:</strong> 자영 알뜰 주유소(RTX)는
              유통 마진이 낮아 대형 브랜드 대비 리터당 50~100원 저렴한 경우가
              많습니다.
            </li>
            <li>
              <strong>셀프 주유:</strong> 셀프 주유소를 이용하면 리터당
              30~80원을 절약할 수 있습니다.
            </li>
            <li>
              <strong>주유 카드 혜택:</strong> 주유 전용 신용카드나 멤버십
              할인을 활용하면 추가로 리터당 50~100원을 아낄 수 있습니다.
            </li>
            <li>
              <strong>주간 가격 변동:</strong> 일반적으로 주 초(월~화)에
              유가가 낮고, 주말에 높아지는 경향이 있습니다.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
