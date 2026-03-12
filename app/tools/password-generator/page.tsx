"use client";

import { useState, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

// ── Character sets ───────────────────────────────────────────────────────────
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

// ── Password strength ────────────────────────────────────────────────────────
interface StrengthResult {
  label: string;
  color: string;
  bgColor: string;
  percent: number;
}

function getPasswordStrength(password: string): StrengthResult {
  if (!password) return { label: "", color: "text-gray-400", bgColor: "bg-gray-200", percent: 0 };

  let score = 0;
  const len = password.length;

  // Length scoring
  if (len >= 8) score += 1;
  if (len >= 12) score += 1;
  if (len >= 16) score += 1;
  if (len >= 24) score += 1;

  // Character variety
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  // Uniqueness
  const unique = new Set(password).size;
  if (unique >= len * 0.6) score += 1;
  if (unique >= len * 0.8) score += 1;

  if (score <= 2) return { label: "매우 약함", color: "text-red-600", bgColor: "bg-red-500", percent: 20 };
  if (score <= 4) return { label: "약함", color: "text-orange-500", bgColor: "bg-orange-500", percent: 40 };
  if (score <= 6) return { label: "보통", color: "text-yellow-500", bgColor: "bg-yellow-500", percent: 60 };
  if (score <= 8) return { label: "강함", color: "text-green-500", bgColor: "bg-green-500", percent: 80 };
  return { label: "매우 강함", color: "text-emerald-600", bgColor: "bg-emerald-500", percent: 100 };
}

// ── Component ────────────────────────────────────────────────────────────────
export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generatePassword = useCallback(() => {
    let charset = "";
    if (useUppercase) charset += UPPERCASE;
    if (useLowercase) charset += LOWERCASE;
    if (useNumbers) charset += NUMBERS;
    if (useSymbols) charset += SYMBOLS;

    if (!charset) {
      alert("최소 한 가지 문자 유형을 선택하세요.");
      return null;
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    let pw = "";
    for (let i = 0; i < length; i++) {
      pw += charset[array[i] % charset.length];
    }

    // Ensure at least one character from each selected set
    const required: string[] = [];
    if (useUppercase) required.push(UPPERCASE);
    if (useLowercase) required.push(LOWERCASE);
    if (useNumbers) required.push(NUMBERS);
    if (useSymbols) required.push(SYMBOLS);

    const chars = pw.split("");
    const posArray = new Uint32Array(required.length);
    crypto.getRandomValues(posArray);

    for (let i = 0; i < required.length; i++) {
      const set = required[i];
      if (!chars.some((c) => set.includes(c))) {
        const randomArr = new Uint32Array(2);
        crypto.getRandomValues(randomArr);
        const pos = randomArr[0] % length;
        chars[pos] = set[randomArr[1] % set.length];
      }
    }

    return chars.join("");
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols]);

  const handleGenerate = () => {
    const newPasswords: string[] = [];
    for (let i = 0; i < 5; i++) {
      const pw = generatePassword();
      if (pw) newPasswords.push(pw);
    }
    if (newPasswords.length > 0) {
      setPasswords(newPasswords);
      setHistory((prev) => [...newPasswords, ...prev].slice(0, 10));
      setCopiedIndex(null);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const strength = passwords.length > 0 ? getPasswordStrength(passwords[0]) : null;

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        {"\uD83D\uDD10"} 비밀번호 생성기
      </h1>
      <p className="text-gray-500 mb-6">
        강력한 랜덤 비밀번호를 무료로 생성하세요. 원하는 옵션을 설정하고 안전한 비밀번호를 만들어 보세요.
      </p>

      {/* Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 mb-6">
        {/* Length slider */}
        <div className="mb-6">
          <label className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">비밀번호 길이</span>
            <span className="text-lg font-bold text-blue-600">{length}</span>
          </label>
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>8</span>
            <span>64</span>
          </div>
        </div>

        {/* Toggle options */}
        <div className="grid grid-cols-2 gap-3">
          <ToggleOption label="대문자 (A-Z)" checked={useUppercase} onChange={setUseUppercase} />
          <ToggleOption label="소문자 (a-z)" checked={useLowercase} onChange={setUseLowercase} />
          <ToggleOption label="숫자 (0-9)" checked={useNumbers} onChange={setUseNumbers} />
          <ToggleOption label="특수문자 (!@#$...)" checked={useSymbols} onChange={setUseSymbols} />
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors text-base"
        >
          비밀번호 생성 (5개)
        </button>
      </div>

      {/* Generated passwords */}
      {passwords.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">생성된 비밀번호</h2>

          {/* Strength indicator for first password */}
          {strength && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-gray-500">비밀번호 강도</span>
                <span className={`text-sm font-semibold ${strength.color}`}>{strength.label}</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${strength.bgColor}`}
                  style={{ width: `${strength.percent}%` }}
                />
              </div>
            </div>
          )}

          {/* Password list */}
          <div className="space-y-2">
            {passwords.map((pw, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5 group"
              >
                <code className="flex-1 text-sm sm:text-base font-mono text-gray-800 break-all select-all leading-relaxed">
                  {pw}
                </code>
                <button
                  onClick={() => copyToClipboard(pw, i)}
                  className={`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    copiedIndex === i
                      ? "bg-green-100 text-green-700"
                      : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {copiedIndex === i ? "복사됨!" : "복사"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">최근 생성 기록</h2>
            <span className="text-xs text-gray-400">최대 10개 (세션 내 유지)</span>
          </div>
          <div className="space-y-1.5">
            {history.map((pw, i) => (
              <div
                key={`h-${i}`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="shrink-0 text-xs text-gray-400 w-5 text-right">{i + 1}</span>
                <code className="flex-1 text-xs sm:text-sm font-mono text-gray-600 break-all select-all">
                  {pw}
                </code>
                <button
                  onClick={() => copyToClipboard(pw, 100 + i)}
                  className={`shrink-0 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    copiedIndex === 100 + i
                      ? "bg-green-100 text-green-700"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {copiedIndex === 100 + i ? "복사됨!" : "복사"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            비밀번호 생성기란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            비밀번호 생성기는 예측이 불가능한 랜덤 비밀번호를 자동으로 만들어주는
            도구입니다. 사람이 직접 만든 비밀번호는 패턴이 존재하기 쉬워 해킹에
            취약하지만, 랜덤 생성기를 사용하면 대문자, 소문자, 숫자, 특수문자를
            조합하여 훨씬 안전한 비밀번호를 생성할 수 있습니다. 이 도구는 브라우저의
            암호학적으로 안전한 난수 생성기(crypto.getRandomValues)를 사용하여
            비밀번호를 생성하며, 서버로 전송되지 않으므로 완전히 안전합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            안전한 비밀번호 만들기 팁
          </h2>
          <ul className="text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
            <li>
              <strong>최소 12자 이상:</strong> 비밀번호가 길수록 무차별 대입 공격에
              강합니다. 16자 이상을 권장합니다.
            </li>
            <li>
              <strong>다양한 문자 조합:</strong> 대문자, 소문자, 숫자, 특수문자를
              모두 포함하면 비밀번호 강도가 크게 높아집니다.
            </li>
            <li>
              <strong>사이트마다 다른 비밀번호:</strong> 하나의 비밀번호를 여러
              사이트에서 사용하면 한 곳이 유출될 때 모든 계정이 위험해집니다.
            </li>
            <li>
              <strong>개인정보 사용 금지:</strong> 생일, 전화번호, 이름 등
              추측하기 쉬운 정보는 비밀번호에 포함하지 마세요.
            </li>
            <li>
              <strong>비밀번호 관리자 활용:</strong> 복잡한 비밀번호를 기억하기
              어렵다면 1Password, Bitwarden 같은 비밀번호 관리자를 사용하세요.
            </li>
            <li>
              <strong>정기적인 변경:</strong> 중요한 계정의 비밀번호는 3~6개월마다
              변경하는 것이 좋습니다.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">
                생성된 비밀번호가 서버로 전송되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                아니요. 모든 비밀번호는 브라우저에서 직접 생성되며, 서버로 전송되거나
                저장되지 않습니다. 페이지를 닫으면 생성 기록도 모두 사라집니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                비밀번호 길이는 얼마가 적당한가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                일반적인 웹사이트에서는 12~16자를 권장합니다. 금융이나 중요한
                서비스의 경우 20자 이상을 사용하면 더욱 안전합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                특수문자를 꼭 포함해야 하나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                특수문자를 포함하면 비밀번호의 경우의 수가 크게 늘어나 보안이
                강화됩니다. 다만, 일부 사이트에서는 특정 특수문자를 허용하지 않을 수
                있으므로 해당 사이트의 규칙을 확인하세요.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                같은 비밀번호가 생성될 수 있나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                이론적으로 가능하지만, 16자리 비밀번호(대소문자+숫자+특수문자)의 경우
                약 95^16 (약 4.4 x 10^31)가지의 조합이 존재하므로 동일한 비밀번호가
                생성될 확률은 사실상 0에 가깝습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="password-generator" />
    </div>
  );
}

// ── Toggle component ─────────────────────────────────────────────────────────
function ToggleOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none bg-gray-50 rounded-lg px-4 py-3 hover:bg-gray-100 transition-colors">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors" />
        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5" />
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}
