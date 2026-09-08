# 소스 보관과 자동 배포

홈페이지: https://modu-dogu.pages.dev

저장소: https://github.com/imhyuk98/modu-dogu

## 배포 기준

- 변경은 작업 브랜치 → Pull Request → `verify` 검사 통과 → `master` 병합 순서로 반영합니다. 보호 규칙을 우회하지 않습니다.
- Cloudflare Pages 프로젝트 `modu-dogu`는 GitHub의 `master`를 운영 브랜치로 사용합니다. 빌드 명령은 `npm run build`, 출력 폴더는 `out`입니다. `npx next build`만 실행하면 prebuild/postbuild 검사를 건너뛰므로 사용하지 않습니다.
- 의존성은 `package-lock.json`과 `npm ci`로 복원합니다. 개발/CI는 Node.js 24를 사용합니다.
- 빌드 결과물 `out`, `.next`, 자동 생성 `public/sw.js`는 커밋하지 않습니다. 소스로 다시 생성합니다.

## 카카오 공유 키

Cloudflare 대시보드 → Workers & Pages → `modu-dogu` → Settings → Variables and Secrets에서 **Production**에 `NEXT_PUBLIC_KAKAO_JS_KEY`를 설정합니다. 카카오 JavaScript 키만 사용하고 Admin/REST API 키나 Google 서비스 계정 키를 넣지 않습니다.

`master`의 Cloudflare 빌드는 키가 없거나 형식이 잘못되거나 CI용 0 키이면 실패합니다. 형식 검사만으로 카카오 앱 권한까지 확인할 수는 없습니다. 키를 바꾸면 재빌드가 필요합니다. `NEXT_PUBLIC_` 키는 브라우저 번들에 포함되는 공개 앱 식별자이며, 저장소에 값을 기록하지 않는 것과 브라우저에서 비밀로 유지하는 것은 다릅니다.

카카오 개발자 콘솔에는 운영 주소 `https://modu-dogu.pages.dev`를 JavaScript SDK 도메인과 제품 링크 웹 도메인에 모두 등록해야 합니다. Preview는 별도 설정이며 운영 도메인 등록만으로 임의의 미리보기 주소가 허용되지는 않습니다.

## 다른 PC에서 복원

1. 저장소를 clone하고 `npm ci`를 실행합니다.
2. `.env.local.example`을 `.env.local`로 복사하고 필요한 공개 앱 설정을 입력합니다. 실제 설정 파일은 커밋하지 않습니다.
3. `npm run lint`, `npm run typecheck`, `npm run qa:friend-games`, `npm run qa:social-sharing`, `node --test scripts/validate-build-env.test.mjs dashboard/worker.test.mjs`를 실행합니다.
4. `npm run build`와 `npm run qa:static`으로 정적 결과물을 확인합니다.
5. `npm run dev`로 화면을 확인합니다. 전체 브라우저 검사 실행 방법과 Chrome 준비 과정은 `.github/workflows/quality.yml`에 있습니다. CI에서는 실제 전송이 아닌 모의 SDK를 사용합니다.

키 없는 개발/미리보기 빌드는 허용하지만 카카오 전용 버튼은 숨겨집니다. 로컬에서 운영 키 검사까지 강제하려면 셸 환경에 `REQUIRE_KAKAO_SHARE=true`와 `NEXT_PUBLIC_KAKAO_JS_KEY`를 지정합니다. prebuild 검사는 Next.js의 `.env.local` 로딩보다 먼저 실행됩니다.

## 병합 후 확인

1. Cloudflare의 **Git 연동 production 배포**가 병합 커밋 SHA로 성공했는지 확인합니다. 직접 업로드의 성공만으로 자동 빌드 재현을 확인했다고 보지 않습니다.
2. `npm run qa:production`으로 기본 경로를 확인합니다.
3. `node scripts/social-production-smoke.mjs`로 친구 콘텐츠 5종, 공유 이미지, CSP, 실제 키의 번들 반영을 확인합니다. 키는 환경 변수 또는 `.env.local`에서 읽고 출력하지 않습니다. 다른 배포는 `PRODUCTION_BASE_URL`로 지정할 수 있습니다.
4. 실제 휴대폰의 카카오/X/LINE 전송·취소, 받은 링크 열기, 인스타그램 이미지 저장은 자동 검사와 별도로 확인합니다.

대시보드는 `dashboard/README.md`의 별도 Worker 실행/배포 절차를 따릅니다. 홈페이지 배포로 함께 공개되지 않습니다. 관리자 비밀번호, `.dev.vars`, Google 서비스 계정 JSON, 개인 대화 캡처, 원본 분석 자료는 공개 저장소에 올리지 않습니다.

참고: [Cloudflare 빌드 설정과 기본 환경 변수](https://developers.cloudflare.com/pages/configuration/build-configuration/), [Git 통합](https://developers.cloudflare.com/pages/get-started/git-integration/), [Next.js 환경 변수](https://nextjs.org/docs/app/guides/environment-variables).
