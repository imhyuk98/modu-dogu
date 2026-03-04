"use client";

import { useState } from "react";
import { calculateAge, type AgeResult } from "@/lib/calculations";
import RelatedTools from "@/components/RelatedTools";

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<AgeResult | null>(null);

  const handleCalculate = () => {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const today = new Date();
    if (birth > today) return;
    setResult(calculateAge(birth, today));
  };

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">나이 계산기</h1>
      <p className="text-gray-500 mb-8">생년월일을 입력하면 만 나이와 한국 나이를 계산합니다.</p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button onClick={handleCalculate}
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
          계산하기
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-sm text-gray-500 mb-1">만 나이</p>
              <p className="text-4xl font-bold text-blue-600">{result.internationalAge}세</p>
              <p className="text-xs text-gray-400 mt-1">국제 표준 / 법적 나이</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-sm text-gray-500 mb-1">한국 나이</p>
              <p className="text-4xl font-bold text-gray-900">{result.koreanAge}세</p>
              <p className="text-xs text-gray-400 mt-1">세는 나이</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-sm text-gray-500 mb-1">다음 생일까지</p>
            <p className="text-2xl font-bold text-gray-900">{result.daysUntilBirthday}일 남음</p>
            <p className="text-sm text-gray-400 mt-1">
              {result.nextBirthday.getFullYear()}년 {result.nextBirthday.getMonth() + 1}월 {result.nextBirthday.getDate()}일
            </p>
          </div>
        </div>
      )}

      <section className="mt-12 prose prose-gray max-w-none">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">만 나이 vs 한국 나이</h2>
            <p className="text-gray-600 leading-relaxed">
              2023년 6월 28일부터 대한민국은 법적, 행정적으로 <strong>만 나이</strong>를 통일 사용합니다. 이 법 개정의 배경은 기존에 만 나이, 세는 나이(한국 나이), 연 나이 등 3가지 나이 계산법이 혼용되어 행정 혼란과 분쟁이 발생했기 때문입니다.
            </p>
            <ul className="text-gray-600 space-y-2 mt-3">
              <li><strong>만 나이:</strong> 태어난 날을 0세로 시작하여 생일이 지날 때마다 1세씩 증가합니다. 국제 표준 방식이며, 현재 대한민국의 법적 기준입니다.</li>
              <li><strong>한국 나이 (세는 나이):</strong> 태어나면서 1세, 매년 1월 1일에 모든 국민이 동시에 1세씩 추가됩니다. 12월 31일에 태어나면 다음 날 바로 2세가 됩니다.</li>
              <li><strong>연 나이:</strong> 현재 연도 - 출생 연도로 계산합니다. 생일과 관계없이 같은 해에 태어난 사람은 같은 나이입니다. 병역법 등 일부 법률에서 사용되었습니다.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              법 개정 이후에도 일상 대화에서는 한국 나이가 여전히 사용되는 경우가 많지만, 계약서, 의료 기록, 행정 문서 등 공식 문서에서는 반드시 만 나이가 적용됩니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">만 나이가 중요한 경우</h2>
            <p className="text-gray-600 leading-relaxed">
              다음은 법적으로 만 나이가 기준이 되는 주요 사례입니다.
            </p>
            <ul className="text-gray-600 space-y-2 mt-3">
              <li><strong>음주/흡연:</strong> 만 19세 이상부터 합법적으로 주류 구매 및 흡연이 가능합니다.</li>
              <li><strong>선거권 (투표):</strong> 만 18세 이상이면 대통령 선거, 국회의원 선거 등에 투표할 수 있습니다.</li>
              <li><strong>운전면허:</strong> 만 18세 이상부터 1종/2종 보통 운전면허 취득이 가능합니다. 원동기장치자전거는 만 16세부터 가능합니다.</li>
              <li><strong>군 입대:</strong> 대한민국 남성은 만 18세에 징병검사 대상이 되며, 만 28세까지 입영해야 합니다.</li>
              <li><strong>청소년 보호:</strong> 만 19세 미만은 청소년보호법의 보호를 받으며, 유해업소 출입이 제한됩니다.</li>
              <li><strong>형사 책임:</strong> 만 14세 미만은 형사미성년자로 형사처벌 대상이 아닙니다.</li>
              <li><strong>국민연금:</strong> 만 60세부터 노령연금 수급이 가능합니다 (출생연도에 따라 단계적으로 65세까지 상향).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">띠와 나이</h2>
            <p className="text-gray-600 leading-relaxed">
              한국에서는 태어난 해의 12간지(십이지)에 따라 &quot;띠&quot;가 정해집니다. 12간지는 12년을 주기로 순환하며, 각 동물의 특성이 그 해에 태어난 사람의 성격과 관련이 있다고 전통적으로 여겨져 왔습니다.
            </p>
            <ul className="text-gray-600 space-y-1 mt-3">
              <li><strong>자(子) - 쥐띠:</strong> 1996, 2008, 2020년생</li>
              <li><strong>축(丑) - 소띠:</strong> 1997, 2009, 2021년생</li>
              <li><strong>인(寅) - 호랑이띠:</strong> 1998, 2010, 2022년생</li>
              <li><strong>묘(卯) - 토끼띠:</strong> 1999, 2011, 2023년생</li>
              <li><strong>진(辰) - 용띠:</strong> 2000, 2012, 2024년생</li>
              <li><strong>사(巳) - 뱀띠:</strong> 2001, 2013, 2025년생</li>
              <li><strong>오(午) - 말띠:</strong> 1990, 2002, 2014년생</li>
              <li><strong>미(未) - 양띠:</strong> 1991, 2003, 2015년생</li>
              <li><strong>신(申) - 원숭이띠:</strong> 1992, 2004, 2016년생</li>
              <li><strong>유(酉) - 닭띠:</strong> 1993, 2005, 2017년생</li>
              <li><strong>술(戌) - 개띠:</strong> 1994, 2006, 2018년생</li>
              <li><strong>해(亥) - 돼지띠:</strong> 1995, 2007, 2019년생</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">자주 묻는 질문 (FAQ)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium text-gray-800">초등학교 입학 나이 기준은 어떻게 되나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  초등학교는 입학하는 해의 1월 1일 기준 만 6세인 아이가 입학합니다. 즉, 3월 입학 시점이 아닌 해당 연도 1월 1일 기준입니다. 예를 들어 2020년 3월~2021년 2월에 태어난 아이는 2027년 3월에 초등학교에 입학합니다. 조기 입학(1년 앞당김)이나 취학 유예(1년 늦춤)도 가능합니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">보험이나 연금에서 나이 기준은 어떻게 적용되나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  보험에서는 &quot;보험 나이&quot;를 사용하는 경우가 있습니다. 보험 나이는 생일 기준 전후 6개월을 반올림하여 계산합니다. 예를 들어 만 29세 7개월이면 보험 나이는 30세입니다. 국민연금은 만 나이를 기준으로 수급 연령을 산정하며, 출생연도에 따라 수급 개시 나이가 60~65세로 다릅니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">생일이 2월 29일(윤년)이면 나이 계산은 어떻게 하나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  법적으로 2월 29일생은 평년(윤년이 아닌 해)에는 3월 1일에 나이가 한 살 추가됩니다. 민법 제161조에 따라 기간 만료일이 존재하지 않으면 그 달의 마지막 날에 만료되는 것으로 봅니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="age" />
</div>
  );
}
