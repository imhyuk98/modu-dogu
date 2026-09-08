# 친구 질문 결과함

새 우정고사·친구 케미·친구 설명서·칭찬 카드의 답변을 서버에 모읍니다. 생일 달 카드와 기존 텔레파시 기능은 대상이 아닙니다. 예전 fragment/answers 초대와 공유 결과는 계속 열리지만 기존 답변을 자동 수집하거나 소급 이관하지 않습니다.

## 이용 흐름

1. 생성자가 닉네임·선택 입력 및 서버 저장 동의 → 초대 생성.
2. 친구에게는 `/tools/{mode}#box={id}` 참여 링크만 전달.
3. 친구가 닉네임·답변·서버 저장 동의 → API가 저장을 확인한 뒤 결과 표시.
4. 생성자는 `/tools/friend-inbox`의 내 목록 또는 별도 비공개 주소로 친구별 점수·문항별 답변 확인.
5. 결과함이 열린 동안 30초마다 갱신. 별도 SNS 푸시·이메일 알림은 없음.

## 권한과 데이터

- 로그인 없는 capability 방식입니다. 256비트 난수 열람 키는 생성자의 localStorage/비공개 주소 fragment에만 보관하고 API에는 Authorization 헤더로 전달합니다. 서버에는 SHA-256 해시만 저장합니다. 참여 ID는 그 해시의 128비트 접두사입니다. 참여 ID만으로 열람 키를 재발급하거나 전체 결과를 읽을 수 없습니다.
- 비공개 주소 소지자는 결과함을 조회·삭제할 수 있으므로 '생성자 신원 인증'과는 다릅니다. 브라우저 데이터와 주소를 모두 잃으면 사용자용 복구가 없습니다. 저장소가 막힌 브라우저는 주소를 직접 보관하도록 경고합니다.
- 생성 요청은 열람 키로, 답변 요청은 무작위 제출 ID로 멱등 처리합니다. 네트워크 오류 후 동일 요청 재시도는 중복 저장되지 않습니다. 다른 요청으로 다시 참여하는 동일인을 식별·차단하지는 않습니다. 닉네임은 본인 인증 정보가 아닙니다.
- 제출 전 공개 API는 생성자 닉네임·종류·만료 정보만 반환합니다. 정답과 다른 친구의 답변, 열람 키는 반환하지 않습니다. 점수의 기준 답변은 서버 자료를 사용합니다.
- 결과함당 100개 응답, 생성 30일 후 접근 종료, 매시 17분 UTC 정리 작업으로 만료 데이터 삭제. 외래 키 CASCADE로 자식 답변도 삭제합니다. 정리 작업이 실패하면 접근은 계속 차단되며 운영자가 cron을 복구해야 합니다.
- 생성자는 전체 결과함을 삭제할 수 있습니다. 공유 결과 URL 자체의 사본은 회수할 수 없습니다. Cloudflare Time Travel 백업 이력은 요금제별 7~30일 더 남을 수 있습니다.
- 닉네임·선택·생성/제출/만료 시각만 기능 데이터로 저장합니다. IP는 앱 DB에 저장하지 않고 일 단위 해시를 임시 요청 제한에 사용합니다. 전용 페이지는 분석 이벤트·분석 스크립트·광고 스크립트·주소 공유 플로팅 버튼을 제외합니다.
- Cloudflare 요청 제한은 같은 IP의 사용자에게 함께 적용될 수 있고 엄격한 전 세계 과금 한도는 아닙니다. 활성/정리 대기 결과함은 전체 10,000개로 제한합니다. 인증/CORS/본문 4KB 제한/서버 입력 검증/no-store 응답을 적용합니다. 리소스 한도 초과·서버 장애는 성공으로 표시하지 않습니다.
- v1 문항/선택지 순서는 보관 중인 답변의 의미를 결정합니다. 기존 문항 의미를 바꿀 때는 API·링크의 버전 분리 또는 저장된 질문 스냅샷을 먼저 설계해야 합니다.

## 배포

프런트엔드는 기존 Pages Git 자동 배포, API는 별도 Worker입니다. 기존 홈페이지의 정적 export는 유지합니다.

- Worker: `https://modu-friend-inbox.huni1260.workers.dev`
- D1: `modu-friend-inbox` (APAC, 실제 ID는 wrangler.jsonc에 있음; 비밀키가 아님)
- 운영 CORS 허용 주소: `https://modu-dogu.pages.dev`만. 미리보기/로컬을 운영 DB에 연결하기 위해 허용 범위를 임의로 넓히지 않습니다.

```sh
node --test inbox/worker.test.mjs
npx wrangler@4.129.1 d1 migrations apply modu-friend-inbox --remote --config inbox/wrangler.jsonc
npx wrangler@4.129.1 deploy --config inbox/wrangler.jsonc
node inbox/production-smoke.mjs
```

`production-smoke`는 운영에 자체 검증용 질문과 답변을 만들고 finally에서 해당 질문만 삭제합니다. 실제 이용자 데이터를 읽거나 삭제하지 않습니다. 마이그레이션을 되돌리거나 D1을 재생성하는 명령은 일상 배포에 사용하지 않습니다.

Cloudflare Pages Production 변수 `NEXT_PUBLIC_FRIEND_INBOX_API`를 위 Worker URL로 설정한 뒤 프런트엔드를 병합·배포합니다. 운영 빌드는 이 설정이 없거나 로컬 API를 가리키면 실패합니다. 기존 `NEXT_PUBLIC_KAKAO_JS_KEY`도 계속 필요합니다. API 코드 변경은 Pages 빌드만으로 배포되지 않으므로 위 Worker 배포와 API 호환성 확인을 반드시 먼저 수행합니다. Workers의 cron도 wrangler.jsonc가 기준입니다.

## 로컬/CI 검사

`npm run dev:inbox`는 실제 서버 코드를 메모리 SQLite 어댑터로 실행합니다(127.0.0.1:8790). 운영 DB를 읽지 않으며 종료하면 검증 데이터는 사라집니다. 개발 서버를 실행하는 셸에 `NEXT_PUBLIC_FRIEND_INBOX_API=http://127.0.0.1:8790`를 지정하고 `npm run dev`를 실행하세요.

`npm run qa:inbox:browser`는 Chrome 디버깅 포트 9224가 필요합니다. 서로 다른 브라우저 컨텍스트에서 생성·친구 제출·재시도·전체 결과·무권한 접근·참여 링크만 SNS 공유·삭제·저장소 차단·모바일·명암 대비를 확인합니다. 운영 검증은 `SOCIAL_QA_BASE_URL`을 홈페이지로, `INBOX_QA_API`를 운영 Worker로 명시합니다. 개인 주소/토큰을 로그나 공개 테스트 산출물에 남기지 않습니다.

참고: [D1](https://developers.cloudflare.com/d1/get-started/), [요청 제한](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/), [예약 정리](https://developers.cloudflare.com/workers/configuration/cron-triggers/), [백업](https://developers.cloudflare.com/d1/reference/time-travel/).
