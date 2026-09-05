import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center">
      <p className="text-sm font-black tracking-[0.14em] text-[#a93d28]">404</p>
      <h1 className="mt-3 text-3xl font-black text-gray-950">페이지를 찾을 수 없습니다</h1>
      <p className="mt-4 leading-7 text-gray-600">주소가 바뀌었거나 삭제된 페이지입니다. 홈 검색에서 필요한 도구를 찾아보세요.</p>
      <Link href="/" className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-[#a93d28] px-5 font-bold text-white">도구 홈으로</Link>
    </main>
  );
}
