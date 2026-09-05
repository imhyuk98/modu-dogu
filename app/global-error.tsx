"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ko">
      <body>
        <main style={{ margin: "0 auto", maxWidth: 640, padding: "80px 20px", textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
          <h1>페이지를 표시하지 못했습니다</h1>
          <p>잠시 후 다시 시도해 주세요. 입력하던 내용은 서버로 전송되지 않았습니다.</p>
          <button type="button" onClick={reset} style={{ minHeight: 44, marginTop: 20, border: 0, borderRadius: 12, padding: "0 20px", background: "#a93d28", color: "white", fontWeight: 700 }}>다시 시도</button>
        </main>
      </body>
    </html>
  );
}
