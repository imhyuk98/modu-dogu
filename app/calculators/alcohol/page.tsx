"use client";

import { useState } from "react";
import { calculateBAC, type AlcoholResult } from "@/lib/calculations";
import RelatedTools from "@/components/RelatedTools";

const DRINK_PRESETS = [
  { label: "소주 (1잔)", type: "soju", volume: 50, percent: 17 },
  { label: "맥주 (1잔 500ml)", type: "beer", volume: 500, percent: 5 },
  { label: "와인 (1잔 150ml)", type: "wine", volume: 150, percent: 13 },
  { label: "양주 (1잔 30ml)", type: "whiskey", volume: 30, percent: 40 },
  { label: "막걸리 (1사발 300ml)", type: "makgeolli", volume: 300, percent: 6 },
];

export default function AlcoholCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("");
  const [hours, setHours] = useState("");
  const [drinks, setDrinks] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AlcoholResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCalculate = () => {
    setError("");
    const w = parseFloat(weight);
    if (!weight || !w || w <= 0) {
      setError("체중을 입력해주세요.");
      return;
    }

    const drinkList = DRINK_PRESETS.filter((p) => (drinks[p.type] || 0) > 0).map((p) => ({
      type: p.type, volume: p.volume, percent: p.percent, count: drinks[p.type] || 0,
    }));
    if (drinkList.length === 0) {
      setError("음주량을 1잔 이상 입력해주세요.");
      return;
    }

    const h = parseFloat(hours);
    setResult(calculateBAC(gender, w, drinkList, h || 0));
  };

  const handleReset = () => {
    setGender("male");
    setWeight("");
    setHours("");
    setDrinks({});
    setResult(null);
    setError("");
    setCopied(false);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const updateDrink = (type: string, delta: number) => {
    setDrinks((prev) => ({ ...prev, [type]: Math.max(0, (prev[type] || 0) + delta) }));
  };

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">음주 측정기</h1>
      <p className="text-gray-500 mb-8">음주량과 시간을 입력하면 예상 혈중알코올농도를 계산합니다.</p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
            <div className="flex gap-3">
              {([["male", "남성"], ["female", "여성"]] as const).map(([v, l]) => (
                <button key={v} onClick={() => setGender(v)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${gender === v ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">체중</label>
            <div className="relative">
              <input type="number" value={weight} onChange={(e) => { setWeight(e.target.value); setError(""); }} placeholder="70"
                onKeyDown={(e) => { if (e.key === "Enter") handleCalculate(); }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">kg</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">음주량</label>
          <div className="space-y-2">
            {DRINK_PRESETS.map((p) => (
              <div key={p.type} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
                <span className="text-sm text-gray-700">{p.label}</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateDrink(p.type, -1)}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors">−</button>
                  <span className="w-6 text-center font-medium">{drinks[p.type] || 0}</span>
                  <button onClick={() => updateDrink(p.type, 1)}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">음주 후 경과 시간</label>
          <div className="relative">
            <input type="number" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">시간</span>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="flex gap-3">
          <button onClick={handleCalculate}
            className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            계산하기
          </button>
          <button onClick={handleReset}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            초기화
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className={`p-6 text-center ${result.canDrive ? "bg-green-600" : "bg-red-600"} text-white`}>
            <p className="text-sm opacity-80 mb-1">예상 혈중알코올농도</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-4xl font-bold">{result.bac.toFixed(3)}%</p>
              <button
                onClick={() => handleCopy(`혈중알코올농도: ${result.bac.toFixed(3)}% (${result.status})`)}
                className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                title="복사"
              >
                {copied ? "복사됨!" : "복사"}
              </button>
            </div>
            <p className="text-lg font-semibold mt-2">{result.status}</p>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">운전 가능 여부</span>
              <span className={`text-sm font-semibold ${result.canDrive ? "text-green-600" : "text-red-600"}`}>
                {result.canDrive ? "가능" : "불가"}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">완전 분해 예상 시간</span>
              <span className="text-sm font-medium text-gray-900">약 {result.soberHours}시간 후</span>
            </div>
          </div>
        </div>
      )}

      <section className="mt-12 prose prose-gray max-w-none">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">음주 운전 처벌 기준</h2>
            <p className="text-gray-600 leading-relaxed">
              2019년 6월 25일부터 시행된 <strong>윤창호법</strong>(도로교통법 개정)으로 음주운전 처벌 기준이 대폭 강화되었습니다. 기존 0.05%였던 면허정지 기준이 0.03%로 낮아졌습니다.
            </p>
            <ul className="text-gray-600 space-y-2 mt-3">
              <li><strong>혈중알코올농도 0.03% 이상 ~ 0.08% 미만:</strong> 1년 이하 징역 또는 500만원 이하 벌금, 면허정지 (100일)</li>
              <li><strong>혈중알코올농도 0.08% 이상 ~ 0.2% 미만:</strong> 1~2년 이하 징역 또는 500~1,000만원 이하 벌금, 면허취소</li>
              <li><strong>혈중알코올농도 0.2% 이상:</strong> 2~5년 이하 징역 또는 1,000~2,000만원 이하 벌금, 면허취소</li>
              <li><strong>음주운전 2회 이상 적발:</strong> 2~5년 이하 징역 또는 1,000~2,000만원 이하 벌금</li>
              <li><strong>음주 사고 사망:</strong> 무기 또는 3년 이상 징역 (위험운전치사)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3 text-sm">
              음주 측정 거부 시에도 1~5년 이하 징역 또는 500~2,000만원 이하 벌금이 부과됩니다. 절대로 음주 후에는 운전하지 마세요.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">혈중알코올농도(BAC)란?</h2>
            <p className="text-gray-600 leading-relaxed">
              혈중알코올농도(Blood Alcohol Concentration, BAC)는 혈액 100ml 중에 포함된 알코올의 양(g)을 백분율로 나타낸 수치입니다. BAC 0.03%는 혈액 100ml에 알코올 0.03g이 포함되어 있다는 뜻입니다.
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              본 계산기는 <strong>Widmark 공식</strong>을 사용합니다. 이 공식은 스웨덴의 법의학자 Erik Widmark가 개발한 것으로, 섭취한 알코올의 양, 체중, 성별에 따른 체내 수분 비율, 경과 시간을 고려하여 BAC를 추정합니다.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mt-3">
              <p className="text-sm text-gray-700 font-mono">
                BAC(%) = (섭취 알코올량(g) / (체중(kg) x 성별계수)) - (0.015 x 경과시간)
              </p>
              <p className="text-sm text-gray-500 mt-2">
                성별계수: 남성 0.68, 여성 0.55 (체내 수분 비율 차이)
              </p>
            </div>
            <p className="text-gray-600 leading-relaxed mt-3 text-sm">
              이 공식은 추정치이며, 실제 BAC는 개인의 체질, 유전적 요인, 식사 여부, 간 기능 상태 등에 따라 달라질 수 있습니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">알코올 분해에 영향을 주는 요인</h2>
            <ul className="text-gray-600 space-y-2">
              <li><strong>체중:</strong> 체중이 많을수록 체내 수분량이 많아 같은 양의 알코올을 섭취해도 BAC가 낮게 나타납니다.</li>
              <li><strong>성별:</strong> 일반적으로 여성은 남성보다 체내 수분 비율이 낮아 같은 양을 마셔도 BAC가 더 높게 올라갑니다.</li>
              <li><strong>식사 여부:</strong> 빈속에 마시면 알코올 흡수가 빨라 BAC가 급격히 상승합니다. 식사 후 음주하면 흡수 속도가 느려집니다.</li>
              <li><strong>간 기능:</strong> 알코올의 90% 이상은 간에서 분해됩니다. 간 기능이 저하된 경우 분해 속도가 느려집니다.</li>
              <li><strong>음주 속도:</strong> 짧은 시간에 많이 마시면 간의 분해 능력을 초과하여 BAC가 급격히 상승합니다.</li>
              <li><strong>유전적 요인:</strong> 알코올 분해 효소(ADH, ALDH)의 활성도는 개인마다 다릅니다. 동양인의 약 40%는 ALDH2 유전자 변이로 알코올 분해가 느립니다.</li>
              <li><strong>나이:</strong> 나이가 들수록 체내 수분량이 줄고 간의 대사 기능이 저하되어 같은 양을 마셔도 더 취하기 쉽습니다.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">숙취 해소 팁</h2>
            <ul className="text-gray-600 space-y-2">
              <li><strong>수분 섭취:</strong> 알코올은 이뇨 작용을 해 탈수를 유발합니다. 음주 중과 음주 후에 충분한 물을 마셔주세요.</li>
              <li><strong>해장국/꿀물:</strong> 콩나물국, 북어국 등 해장국은 아세트알데히드 분해를 돕는 아스파라긴산이 풍부합니다. 꿀물의 과당은 알코올 대사를 촉진합니다.</li>
              <li><strong>충분한 수면:</strong> 수면 중 간이 알코올을 분해합니다. 가능하면 충분히 쉬어주세요.</li>
              <li><strong>가벼운 식사:</strong> 빈속보다는 소화가 잘 되는 음식을 섭취하면 위장 부담을 줄일 수 있습니다.</li>
              <li><strong>숙취해소제:</strong> 음주 전후에 복용하면 도움이 될 수 있지만, 과학적으로 확실히 검증된 제품은 제한적입니다.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3 text-sm">
              가장 효과적인 숙취 예방법은 적당히 마시거나 마시지 않는 것입니다. 시간당 평균 0.015% 정도의 알코올이 분해되며, 이를 빠르게 하는 확실한 방법은 없습니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">자주 묻는 질문 (FAQ)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium text-gray-800">소주 1병을 마시면 몇 시간 후에 운전할 수 있나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  소주 1병(360ml, 약 7잔)을 마신 70kg 남성의 경우, 예상 BAC는 약 0.08~0.10%입니다. 시간당 약 0.015%씩 분해되므로 완전히 분해되기까지 약 6~7시간이 걸립니다. 다만 개인차가 크므로, 안전을 위해 최소 8시간 이상 기다리는 것을 권장합니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">대리운전 vs 택시, 어느 쪽이 비용이 적게 드나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  대리운전은 보통 기본 1~1.5만원에 거리별 추가 요금이 붙어 서울 시내 기준 1.5~3만원 정도입니다. 택시는 기본 4,800원에 거리/시간 요금이 추가됩니다. 10km 이내라면 택시가 저렴하고, 장거리라면 대리운전이 유리할 수 있습니다. 어느 쪽이든 음주운전 벌금(500만원~)이나 사고 비용에 비하면 훨씬 저렴합니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">맥주와 소주를 섞어 마시면 더 빨리 취하나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  과학적으로 섞어 마시는 것 자체가 BAC를 높이지는 않습니다. 다만 폭탄주 등으로 섞어 마시면 음주 속도가 빨라지고, 탄산(맥주)이 알코올 흡수를 촉진하여 실제로 더 빨리 취할 수 있습니다. 총 알코올 섭취량이 같다면 BAC도 비슷합니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">다음 날 아침에도 음주 단속에 걸릴 수 있나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  네, 가능합니다. 이른바 &quot;숙취 운전&quot;으로, 전날 과음 후 다음 날 아침에도 혈중알코올농도가 0.03%를 넘을 수 있습니다. 소주 2병 이상 마셨다면 다음 날 오전까지도 기준치를 초과할 수 있으므로, 충분한 시간이 지난 후 운전하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="alcohol" />
</div>
  );
}
