# 계산기나라 - 바이브 수익 사이트

## 프로젝트 개요
Google AdSense 수익화를 목표로 한 한국어 생활 계산기 모음 사이트.
한국어 계산기로 시작 → 온라인 도구 모음으로 확장하는 하이브리드 전략.

## 기술 스택
- **프레임워크**: Next.js 16 (App Router, 정적 export)
- **스타일링**: Tailwind CSS
- **언어**: TypeScript
- **패키지 매니저**: npm
- **배포**: Cloudflare Pages (트래픽 무제한 무료)

## 핵심 설정
- `next.config.ts`에 `output: "export"` → 정적 HTML 생성 (Cloudflare Pages용)
- `images.unoptimized: true` → 정적 export에서 이미지 최적화 비활성화
- sitemap은 `public/sitemap.xml`에 수동 관리 (정적 export에서 `app/sitemap.ts` 미지원)

## 프로젝트 구조
```
app/
├── layout.tsx              # 루트 레이아웃 (Header, Footer 포함)
├── page.tsx                # 홈 - 계산기 목록 카드
├── calculators/
│   └── salary/
│       ├── layout.tsx      # SEO 메타데이터
│       └── page.tsx        # 연봉 실수령액 계산기 (use client)
├── about/page.tsx          # 사이트 소개 (AdSense 필수)
└── privacy/page.tsx        # 개인정보처리방침 (AdSense 필수)
components/
├── Header.tsx
└── Footer.tsx
lib/
└── calculations.ts         # 계산 로직 모음
public/
├── sitemap.xml
└── robots.txt
```

## 계산기 추가 패턴
1. `app/calculators/{name}/page.tsx` 생성 ("use client")
2. `app/calculators/{name}/layout.tsx` 생성 (SEO 메타데이터)
3. 계산 로직은 `lib/calculations.ts`에 추가
4. `app/page.tsx`의 calculators 배열에 항목 추가 + comingSoon 제거
5. `public/sitemap.xml`에 URL 추가

## 개발 명령어
```bash
npm run dev    # 개발 서버 (http://localhost:3000)
npm run build  # 정적 빌드 (out/ 디렉토리에 생성)
```

## 배포 (Cloudflare Pages)
1. GitHub 저장소에 push
2. Cloudflare Pages에서 저장소 연결
3. 빌드 설정: `npm run build` / 출력 디렉토리: `out`
4. 커스텀 도메인 연결
5. `public/sitemap.xml`과 `public/robots.txt`의 example.com을 실제 도메인으로 변경

## 배포 후 할 것
- [ ] Google Search Console에 사이트맵 제출
- [ ] Google AdSense 신청 (최소 15~20개 페이지 필요)
- [ ] Google Analytics 연동

## 로드맵
### 1단계: 한국어 생활 계산기 (현재)
- [x] 연봉 실수령액 계산기
- [ ] 대출이자 계산기 (원리금균등/원금균등)
- [ ] BMI 계산기
- [ ] 퇴직금 계산기
- [ ] 연차 계산기

### 2단계: 추가 계산기
- [ ] 적금 이자 계산기
- [ ] 전월세 전환 계산기
- [ ] 음주 측정기 (혈중 알코올 농도)
- [ ] 날짜 계산기 (D-day)

### 3단계: 온라인 도구 확장
- [ ] JSON 포매터
- [ ] Base64 인코더/디코더
- [ ] QR 코드 생성기
- [ ] 색상 변환기 (HEX ↔ RGB)

## 작업 스타일
- 코드 수정, 파일 생성, 빌드, 커밋, 푸시 등 모든 작업은 동의를 묻지 않고 바로 진행한다
- 계획(plan) 수립 후에도 승인 없이 바로 구현에 들어간다

## 주의사항
- 정적 export 모드이므로 SSR, API Routes, 미들웨어 사용 불가
- 모든 계산은 클라이언트(브라우저)에서 처리
- 계산기 페이지는 반드시 "use client" 선언
- SEO 메타데이터는 layout.tsx에서 설정 (서버 컴포넌트)
