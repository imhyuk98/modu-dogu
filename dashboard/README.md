# 모두의도구 운영 대시보드

디자인은 홈페이지 작업 기록의 21st.dev 참고 흐름을 이어 [Dashboard 구성](https://21st.dev/community/components/s/dashboard)과 [대시보드 설계 가이드](https://21st.dev/blog/react-dashboard-components)의 사이드바·지표·차트·표 구성을 참고했습니다. 홈페이지의 종이색 바탕과 주홍색 강조를 적용한 독립 구현이며 외부 유료 컴포넌트 코드를 복사하지 않았습니다.

Google 미연결 시 전체 디자인을 확인할 수 있는 **예시 데이터**가 표시됩니다. 실제 방문 통계가 아니며 상단에 구분 표시가 유지됩니다. ‘빈 상태 보기’로 데이터 없는 상태를, ‘데이터 연결’로 설정 절차를 확인할 수 있습니다. 실제 GA4가 연결되면 예시 모드는 숨겨집니다. 예시 데이터의 날짜는 2026-09-07 기준으로 고정되어 있습니다.

공개 홈페이지와 독립적으로 실행하는 Cloudflare Worker입니다. GA4 사용자·세션·페이지뷰·참여율·일별 추이·인기 페이지·채널·이벤트와 Search Console 상위 검색어를 조회합니다. 최근 30분 활성 사용자는 동시 접속자 수가 아닙니다. 데이터 미연결과 실제 0을 구분하고, Google 비밀키는 서버에서만 사용합니다.

## 로컬 실행

로그인 설정 없이 화면을 확인하려면 `node dashboard/dev.mjs --preview --port 8788`을 실행하고 http://127.0.0.1:8788 에 접속합니다. 미리보기는 실제 데이터 조회를 하지 않습니다. 다른 서버가 포트를 사용 중이면 `--port`로 빈 포트를 지정할 수 있습니다.

1. `.dev.vars.example`을 `.dev.vars`로 복사하고 관리자 계정과 24자 이상의 무작위 비밀번호를 지정하세요. 예시 비밀번호를 운영에서 사용하지 마세요. 관리자 이름과 비밀번호는 영문·숫자·기호로 지정하세요.
2. 저장소 루트에서 `node dashboard/dev.mjs` 실행 후 http://127.0.0.1:8787 을 엽니다.
3. 브라우저 인증창에 지정한 관리자 계정을 입력합니다. Google 설정 전에는 연결 대기 화면을 표시합니다.

## 실제 데이터 연결

로컬에서는 JSON 내용을 복사하는 대신 `.dev.vars`에 `GOOGLE_SERVICE_ACCOUNT_FILE='C:/Users/imhyuk/Downloads/실제파일명.json'`을 지정할 수 있습니다. 파일은 저장소 밖에 보관합니다. 이 방식은 인증 모드에서만 읽으며 `--preview`는 키 파일을 읽거나 실제 통계를 호출하지 않습니다.

1. Google Cloud 프로젝트에서 Google Analytics Data API와 Google Search Console API를 활성화합니다.
2. 서비스 계정을 생성합니다. GA4 관리 → 속성 액세스 관리에서 서비스 계정 이메일을 Viewer로 추가합니다. Search Console에도 해당 이메일에 성과 보고서를 읽을 권한을 부여합니다.
3. GA4 숫자 속성 ID를 `GA4_PROPERTY_ID`에 지정합니다. `G-...` 측정 ID와 다릅니다.
4. 서비스 계정 JSON 키의 전체 내용을 `GOOGLE_SERVICE_ACCOUNT_JSON`에 넣습니다. 로컬 `.dev.vars`에서는 JSON을 한 줄의 작은따옴표 문자열로 지정합니다. 키 파일은 이 저장소에 저장하거나 커밋하지 마세요.
5. `GSC_SITE_URL`은 Search Console에 등록한 정확한 속성 주소여야 합니다. 기본값은 `https://modu-dogu.pages.dev/`입니다.

## 운영 배포

Cloudflare에 로그인한 환경에서 별도 Worker로 배포합니다. 홈페이지 Pages 빌드와 연동되지 않습니다.

```sh
npx wrangler@4 login
npx wrangler@4 deploy --config dashboard/wrangler.jsonc
npx wrangler@4 secret put ADMIN_USER --config dashboard/wrangler.jsonc
npx wrangler@4 secret put ADMIN_PASSWORD --config dashboard/wrangler.jsonc
npx wrangler@4 secret put GA4_PROPERTY_ID --config dashboard/wrangler.jsonc
npx wrangler@4 secret put GOOGLE_SERVICE_ACCOUNT_JSON --config dashboard/wrangler.jsonc
```

각 secret 명령의 입력 프롬프트에 값을 넣습니다. 인증 설정 전에는 모든 요청을 거부합니다. 모든 정적 파일과 API에 인증이 적용됩니다(`run_worker_first: true`). 운영에서는 HTTPS 주소만 사용하세요. Cloudflare Access를 추가하면 이메일 허용 목록으로 한 번 더 제한할 수 있습니다. 현재 기본 인증은 HTTP Basic이며 브라우저가 인증 정보를 유지합니다. 공유 기기에서는 비공개 창을 사용하고 사용 후 닫으세요. Basic 인증은 브라우저별 로그아웃 동작이 달라 별도 로그아웃 버튼을 제공하지 않습니다.

## 확인

‘SNS 공유와 친구 참여’에는 SNS별 공유 요청, 인스타그램 안내·링크 복사, 초대 열기·답변 완료·결과 재열기·재방문이 표시됩니다. 포털·첫 방문 페이지 필터가 함께 적용됩니다. 요청은 전송 성공이 아니며, 사용자 수는 행 간 중복될 수 있습니다. 이벤트 비율은 순차 퍼널이 아닙니다. 새 SNS별 이벤트는 2026-09-08 배포 이후 기록부터 조회됩니다. GA4 맞춤 측정기준 등록 없이 이벤트 이름으로 구분합니다. 실제 GA4 연결 검사는 `node dashboard/check-social-connection.mjs`로 실행하며 키 값은 출력하지 않습니다.

‘유입 페이지와 도구 사용’은 `sessionSource`·`sessionMedium`·`landingPage`를 기준으로 첫 방문을 표시하고, 이벤트 보고서에는 실제 이벤트의 `pagePath`도 별도로 표시합니다. 포털 필터와 첫 방문 페이지 필터를 함께 적용합니다. 이벤트 건수/사용자 수는 순차 퍼널이나 완료율이 아니며, 추적이 없는 도구의 미사용을 의미하지 않습니다. 각 분석 보고서는 상위 10,000행 제한과 부분 실패를 표시합니다. 최근 기간에는 오늘이 포함되어 당일 집계가 미완성일 수 있습니다.

포털별 유입은 GA4 `sessionSource`와 `sessionMedium`을 별도 조회해 네이버·구글·다음·빙 등으로 묶습니다. 원본 출처 / 매체 분석에서 포털 필터와 출처별 사용자·세션·페이지뷰를 확인할 수 있습니다. 사용자 수는 출처 간 중복될 수 있으므로 포털 합계로 더하지 않습니다. 비중은 조회된 출처별 세션 합계 기준이며 전체 요약과 차이가 있을 수 있습니다. 상위 10,000행 제한에 도달하면 안내합니다. 자연 검색은 GA4 매체 `organic`만 집계하며, `m.search.naver.com / referral`처럼 검색 도메인이 추천으로 기록된 경우 원본 분류를 유지합니다. 포털 보고서 조회가 실패해도 나머지 GA4 통계는 유지됩니다.

```sh
node --test dashboard/worker.test.mjs
```

연결 후 GA4 실시간 보고서와 대시보드의 최근 30분 수치를 비교합니다. 7일·28일 조회, 쿠키 동의 후 방문, 비인증 API 401을 확인하세요. Google 권한이 없는 환경에서는 실제 데이터 통합 검증을 완료할 수 없습니다.

GA4 날짜는 속성 시간대, Search Console 날짜는 미국 태평양 시간대입니다. 페이지·채널·이벤트는 상위 50개, 검색어는 상위 20개입니다. GA4 처리 지연·임계값과 검색어 누락에 따라 전체 합계와 행의 합계가 다를 수 있습니다. 시작·완료 이벤트는 현재 구현된 일부 도구에서만 제공됩니다. Google 읽기 API를 화면 조회 시 호출하며 5분마다 자동 갱신합니다. 계정 연결 후 API 할당량을 확인하세요.

공식 문서: [GA4 Data API](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart), [Search Console API](https://developers.google.com/webmaster-tools/v1/searchanalytics/query), [Worker static assets](https://developers.cloudflare.com/workers/static-assets/binding/).
