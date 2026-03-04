"use client";

import { useState } from "react";
import QRCode from "qrcode";
import RelatedTools from "@/components/RelatedTools";

type InputTab = "text" | "wifi" | "email";
type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export default function QrCodeGenerator() {
  const [activeTab, setActiveTab] = useState<InputTab>("text");
  const [textInput, setTextInput] = useState("");
  const [size, setSize] = useState(300);
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>("M");
  const [qrUrl, setQrUrl] = useState("");
  const [error, setError] = useState("");

  // Wi-Fi fields
  const [ssid, setSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [encryption, setEncryption] = useState("WPA");

  // Email fields
  const [emailAddress, setEmailAddress] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const getQrContent = (): string => {
    switch (activeTab) {
      case "wifi":
        if (!ssid) return "";
        return `WIFI:T:${encryption};S:${ssid};P:${wifiPassword};;`;
      case "email":
        if (!emailAddress) return "";
        const params = [];
        if (emailSubject) params.push(`subject=${encodeURIComponent(emailSubject)}`);
        if (emailBody) params.push(`body=${encodeURIComponent(emailBody)}`);
        return `mailto:${emailAddress}${params.length ? "?" + params.join("&") : ""}`;
      default:
        return textInput;
    }
  };

  const handleGenerate = () => {
    setError("");
    const content = getQrContent();
    if (!content) {
      setError("내용을 입력해주세요.");
      return;
    }
    QRCode.toDataURL(content, {
      width: size,
      errorCorrectionLevel: errorLevel,
      margin: 2,
    })
      .then((url) => setQrUrl(url))
      .catch(() => setError("QR 코드 생성에 실패했습니다."));
  };

  const handleDownload = () => {
    if (!qrUrl) return;
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = qrUrl;
    link.click();
  };

  const tabs: { key: InputTab; label: string }[] = [
    { key: "text", label: "텍스트/URL" },
    { key: "wifi", label: "Wi-Fi" },
    { key: "email", label: "이메일" },
  ];

  const sizes = [
    { label: "소 (200px)", value: 200 },
    { label: "중 (300px)", value: 300 },
    { label: "대 (400px)", value: 400 },
  ];

  const errorLevels: { label: string; value: ErrorCorrectionLevel }[] = [
    { label: "L (7%)", value: "L" },
    { label: "M (15%)", value: "M" },
    { label: "Q (25%)", value: "Q" },
    { label: "H (30%)", value: "H" },
  ];

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        QR 코드 생성기
      </h1>
      <p className="text-gray-500 mb-8">
        텍스트, URL, Wi-Fi, 이메일 등을 QR 코드로 변환하여 다운로드할 수 있습니다.
      </p>

      {/* 입력 영역 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        {/* 탭 */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setQrUrl("");
                setError("");
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 텍스트/URL 입력 */}
        {activeTab === "text" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              텍스트 또는 URL
            </label>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="예: https://example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Wi-Fi 입력 */}
        {activeTab === "wifi" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                네트워크 이름 (SSID)
              </label>
              <input
                type="text"
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                placeholder="Wi-Fi 이름"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                type="text"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder="Wi-Fi 비밀번호"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                암호화 방식
              </label>
              <div className="flex gap-3">
                {["WPA", "WEP", "nopass"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setEncryption(type)}
                    className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                      encryption === type
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 text-gray-600 hover:border-blue-300"
                    }`}
                  >
                    {type === "nopass" ? "없음" : type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 이메일 입력 */}
        {activeTab === "email" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일 주소
              </label>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="이메일 제목 (선택)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                본문
              </label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="이메일 내용 (선택)"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        )}

        {/* 옵션 */}
        <div className="flex flex-wrap gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              크기
            </label>
            <div className="flex gap-2">
              {sizes.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSize(s.value)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    size === s.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              오류 정정 레벨
            </label>
            <div className="flex gap-2">
              {errorLevels.map((lvl) => (
                <button
                  key={lvl.value}
                  onClick={() => setErrorLevel(lvl.value)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    errorLevel === lvl.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 생성 버튼 */}
        <div className="mt-6">
          <button
            onClick={handleGenerate}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            생성하기
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-500">{error}</p>
        )}
      </div>

      {/* 결과 영역 */}
      {qrUrl && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col items-center">
            <img
              src={qrUrl}
              alt="생성된 QR 코드"
              width={size}
              height={size}
              className="mb-4"
            />
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              다운로드
            </button>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">QR 코드란?</h2>
          <p className="text-gray-600 leading-relaxed">
            QR 코드(Quick Response Code)는 1994년 일본 덴소웨이브에서 개발한 2차원 바코드입니다.
            기존 1차원 바코드가 최대 20자리 정도의 정보만 저장할 수 있는 반면, QR 코드는
            최대 7,089자의 숫자 또는 4,296자의 영문/숫자를 저장할 수 있습니다.
            스마트폰 카메라로 간편하게 스캔할 수 있어 URL, 연락처, Wi-Fi 정보 등
            다양한 데이터를 빠르게 전달하는 수단으로 널리 활용되고 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">QR 코드 활용 사례</h2>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">분야</th>
                  <th className="text-left py-2 px-3 border border-gray-200">활용 사례</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">마케팅</td>
                  <td className="py-2 px-3 border border-gray-200">전단지, 포스터, 명함에 웹사이트 QR 코드를 삽입하여 오프라인에서 온라인으로 유도</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">결제</td>
                  <td className="py-2 px-3 border border-gray-200">카카오페이, 네이버페이 등 모바일 간편결제에서 QR 코드 스캔으로 결제</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">명함</td>
                  <td className="py-2 px-3 border border-gray-200">vCard 형식의 QR 코드로 연락처 정보를 스마트폰에 바로 저장</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">Wi-Fi 공유</td>
                  <td className="py-2 px-3 border border-gray-200">카페, 사무실 등에서 Wi-Fi 정보를 QR 코드로 제공하여 간편 접속</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">출입 관리</td>
                  <td className="py-2 px-3 border border-gray-200">행사장, 건물 출입 시 QR 코드 기반 전자 출입증으로 신원 확인</td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">QR 코드 오류 정정 레벨</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            QR 코드는 일부가 손상되거나 가려져도 데이터를 복원할 수 있는 오류 정정 기능을 제공합니다.
            오류 정정 레벨이 높을수록 더 많은 손상을 복구할 수 있지만, QR 코드의 크기가 커집니다.
          </p>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">레벨</th>
                  <th className="text-left py-2 px-3 border border-gray-200">복원 가능 비율</th>
                  <th className="text-left py-2 px-3 border border-gray-200">추천 용도</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">L (Low)</td>
                  <td className="py-2 px-3 border border-gray-200">약 7%</td>
                  <td className="py-2 px-3 border border-gray-200">깨끗한 환경에서 사용, 데이터 용량이 클 때</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">M (Medium)</td>
                  <td className="py-2 px-3 border border-gray-200">약 15%</td>
                  <td className="py-2 px-3 border border-gray-200">일반적인 용도 (기본값)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">Q (Quartile)</td>
                  <td className="py-2 px-3 border border-gray-200">약 25%</td>
                  <td className="py-2 px-3 border border-gray-200">인쇄물, 스티커 등 손상 가능성이 있을 때</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">H (High)</td>
                  <td className="py-2 px-3 border border-gray-200">약 30%</td>
                  <td className="py-2 px-3 border border-gray-200">로고 삽입, 야외 사용 등 높은 내구성 필요 시</td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">QR 코드에 어떤 내용을 넣을 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                일반 텍스트, 웹사이트 URL, Wi-Fi 접속 정보, 이메일 주소, 전화번호, SMS 등
                다양한 형태의 데이터를 QR 코드에 담을 수 있습니다. 단, 데이터 양이 많을수록
                QR 코드가 복잡해져 스캔이 어려울 수 있으므로 간결한 내용을 권장합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">생성한 QR 코드는 무료로 사용할 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 이 사이트에서 생성한 QR 코드는 상업적 용도를 포함하여 무료로 사용할 수 있습니다.
                별도의 로그인이나 결제 없이 무제한으로 QR 코드를 생성하고 다운로드할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">QR 코드의 크기는 어느 정도가 적당한가요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                인쇄 시 최소 2cm x 2cm 이상을 권장합니다. 스캔 거리가 멀어질수록 QR 코드 크기도
                커야 합니다. 일반적으로 스캔 거리의 1/10 정도가 적당한 QR 코드 크기입니다.
                예를 들어 30cm 거리에서 스캔한다면 3cm 이상으로 인쇄하는 것이 좋습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">QR 코드가 스캔되지 않는 이유는?</h3>
              <p className="text-gray-600 text-sm mt-1">
                QR 코드가 너무 작거나, 인쇄 품질이 낮거나, 배경과 QR 코드의 대비가 부족할 때
                스캔이 실패할 수 있습니다. 또한 데이터 양이 너무 많으면 QR 코드가 밀도 높아져
                스캔이 어렵습니다. 오류 정정 레벨을 높이거나 크기를 키워보세요.
              </p>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="qr-code" />
</div>
  );
}
