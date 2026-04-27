# 라운드업 상담부스 신청 시스템 — 셋업 & 배포 가이드

## 📁 파일 구조

```
roundup-booth/
├── index.html       ← 신청 메인 페이지
├── admin.html       ← 관리자 페이지 (신청자 목록 + CSV 다운로드)
├── init-slots.js    ← Firebase 슬롯 초기화 스크립트 (1회 실행)
├── firestore.rules  ← Firestore 보안 규칙
└── README.md        ← 이 파일
```

---

## STEP 1. Firebase 프로젝트 생성

1. https://console.firebase.google.com 접속
2. **새 프로젝트 만들기** 클릭
3. 프로젝트 이름 입력 (예: `roundup-booth-2026`)
4. Google Analytics는 선택사항 (OFF 해도 됨)

---

## STEP 2. Firestore 데이터베이스 활성화

1. Firebase Console → 왼쪽 메뉴 **Firestore Database**
2. **데이터베이스 만들기** 클릭
3. 모드 선택: **테스트 모드** (일단 테스트용, 나중에 규칙 교체)
4. 위치: `asia-northeast3 (서울)` 선택 → **완료**

---

## STEP 3. 웹앱 등록 & config 값 복사

1. Firebase Console → ⚙️ 프로젝트 설정 → **앱 추가** → 웹(`</>`) 선택
2. 앱 닉네임 입력 후 **앱 등록**
3. 아래 형태의 config 값이 나옴:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "roundup-booth-2026.firebaseapp.com",
  projectId: "roundup-booth-2026",
  storageBucket: "roundup-booth-2026.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123...:web:abc..."
};
```

4. **index.html**과 **admin.html** 상단의 `firebaseConfig` 부분에 붙여넣기

---

## STEP 4. 슬롯 초기 데이터 생성 (1회만 실행)

```bash
# 1. Node.js 설치되어 있어야 함 (https://nodejs.org)
cd roundup-booth

# 2. firebase-admin 설치
npm install firebase-admin

# 3. Firebase Console → 프로젝트 설정 → 서비스 계정
#    → "새 비공개 키 생성" 클릭 → 다운로드된 JSON 파일을
#    roundup-booth/ 폴더에 serviceAccountKey.json 으로 저장

# 4. 스크립트 실행
node init-slots.js
# ✅ 36개 슬롯 초기화 완료! 출력되면 성공
```

> ⚠️ serviceAccountKey.json 은 절대 GitHub에 올리지 마세요!
> .gitignore에 반드시 추가하세요.

---

## STEP 5. Firestore 보안 규칙 적용

1. Firebase Console → Firestore → **규칙** 탭
2. `firestore.rules` 파일 내용을 붙여넣기
3. **게시** 클릭

---

## STEP 6. GitHub Pages 배포

```bash
# 1. GitHub에서 새 레포지토리 생성 (예: roundup-booth)
# 2. 로컬에서 초기화 및 push

git init
echo "serviceAccountKey.json" >> .gitignore
echo "node_modules/" >> .gitignore
git add index.html admin.html
git commit -m "init: 라운드업 상담부스 신청 페이지"
git branch -M main
git remote add origin https://github.com/YOUR_ID/roundup-booth.git
git push -u origin main

# 3. GitHub → 레포지토리 → Settings → Pages
#    Source: Deploy from a branch → Branch: main / (root) → Save

# 4. 잠시 후 아래 URL로 접속 가능
#    https://YOUR_ID.github.io/roundup-booth/
```

---

## 관리자 페이지 사용법

- `https://YOUR_ID.github.io/roundup-booth/admin.html` 접속
- 비밀번호: `roundup2026` (admin.html 상단 `ADMIN_PW` 변수에서 변경 가능)
- **새로고침**: 최신 신청 데이터 불러오기
- **CSV 다운로드**: 엑셀에서 열 수 있는 신청자 명단 다운로드
- 필터: 데스크별 / 시간별 / 정규·예비 구분 가능

---

## 커스텀 설정 (index.html 상단)

```javascript
// 데스크 이름 변경
const DESK_NAMES = [
  "취업상담", "진로탐색", "대학원",
  "해외취업", "창업멘토", "인턴십"
];

// 인원 수 변경
const MAX_REGULAR = 3;   // 정규 정원
const MAX_WAITLIST = 3;  // 예비 정원
const MAX_PER_PERSON = 2; // 1인 최대 선택 수
```

---

## 자주 묻는 문제

| 문제 | 해결 |
|------|------|
| 슬롯이 로딩 안 됨 | firebaseConfig 값 재확인, Firestore 활성화 여부 확인 |
| 신청 버튼 눌러도 반응 없음 | 브라우저 콘솔(F12) 오류 메시지 확인 |
| 동시 신청 시 인원 초과 | runTransaction으로 처리되어 초과 불가 (정상) |
| CSV 한글 깨짐 | 엑셀에서 열 때 UTF-8 BOM 인코딩으로 열기 |
| 관리자 비밀번호 변경 | admin.html 상단 `ADMIN_PW` 변수 수정 |

---

## 운영 당일 체크리스트

- [ ] Firebase Firestore 데이터 확인 (슬롯 36개 존재)
- [ ] 신청 페이지 URL 참가자에게 공유
- [ ] 관리자 페이지 접속 테스트
- [ ] 행사 종료 후 CSV 다운로드 백업
- [ ] Firebase → Firestore → 데이터 삭제 (개인정보 보호)
