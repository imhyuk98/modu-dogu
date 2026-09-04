import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "사이트 소개",
  description: "무료 계산기, 테스트, 게임, 이미지와 온라인 도구를 제공하는 모두의도구의 운영 목적과 원칙을 소개합니다.",
  alternates: { canonical: "/about", languages: { ko: "/about", en: "/en/about", "x-default": "/about" } },
};

export default function AboutPage() {
  return <main className="mx-auto max-w-3xl px-4 py-12 text-gray-700">
    <p className="text-xs font-black tracking-[0.14em] text-[#a93d28]">ABOUT MODU TOOLS</p>
    <h1 className="mt-2 text-3xl font-black text-gray-950">필요한 계산도, 같이 놀 게임도 한곳에서</h1>
    <p className="mt-4 text-lg leading-8">모두의도구는 생활 계산기, 성향 테스트, 친구와 하는 게임, 이미지·텍스트 도구를 회원가입 없이 바로 쓸 수 있게 모은 독립 무료 도구 플랫폼입니다.</p>
    <div className="mt-8 grid gap-5 sm:grid-cols-2">
      <section className="calc-card p-6"><h2 className="text-xl font-bold text-gray-950">왜 만드나요?</h2><p className="mt-3 leading-7">검색 결과를 여러 번 오가거나 앱을 설치하지 않아도, 필요한 작업을 한 화면에서 끝내고 결과의 계산 기준까지 확인할 수 있게 만들고 있습니다.</p></section>
      <section className="calc-card p-6"><h2 className="text-xl font-bold text-gray-950">어떻게 만드나요?</h2><p className="mt-3 leading-7">운영자 <a href="https://github.com/imhyuk98" target="_blank" rel="noreferrer" className="font-bold underline">imhyuk98</a>가 공개 저장소에서 개발합니다. 규칙 기반 도구는 작동 방식을 설명하고, 제도형 계산기는 담당 기관 원문과 경계값 테스트로 검수합니다.</p></section>
    </div>
    <section className="mt-6 rounded-2xl border border-[#d8d1c5] bg-[#f4f0e8] p-6"><h2 className="text-xl font-bold text-gray-950">운영 원칙</h2><ul className="mt-3 list-disc space-y-2 pl-5 leading-7"><li>가능한 도구는 브라우저 안에서 처리하고 서버 저장 여부를 화면에 밝힙니다.</li><li>계산 결과는 참고용 한계와 제외 조건을 함께 보여 줍니다.</li><li>고정 규칙이나 무작위 결과를 인공지능으로 과장하지 않습니다.</li><li>트래픽보다 실제 사용 흐름과 재현 가능한 품질 검증을 우선합니다.</li></ul></section>
    <nav className="mt-8 grid gap-3 sm:grid-cols-2" aria-label="운영 정보"><Link href="/editorial-policy" className="calc-card p-4 font-bold text-[#8f2f20]">제작·검수 정책 →</Link><Link href="/calculation-policy" className="calc-card p-4 font-bold text-[#8f2f20]">계산 기준 →</Link><Link href="/changelog" className="calc-card p-4 font-bold text-[#8f2f20]">변경 이력 →</Link><Link href="/feedback" className="calc-card p-4 font-bold text-[#8f2f20]">오류 제보 →</Link></nav>
    <section className="mt-8 border-t border-gray-200 pt-6"><h2 className="text-lg font-bold text-gray-950">문의</h2><p className="mt-2 leading-7">별도 이메일 채널은 준비 중입니다. 그동안 문의와 오류 제보는 <a href="https://github.com/imhyuk98/modu-dogu/issues/new" target="_blank" rel="noreferrer" className="font-bold underline">GitHub 이슈</a>를 이용해 주세요. 공개 게시물에 개인정보를 남기지 마세요.</p></section>
  </main>;
}
