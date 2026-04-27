// Firebase 슬롯 초기 데이터 세팅 스크립트
// Node.js에서 한 번만 실행하면 됩니다.
//
// 실행 방법:
//   npm install firebase-admin
//   node init-slots.js

const admin = require('firebase-admin');

// ★ Firebase Admin SDK 서비스 계정 키 파일 경로 입력
// Firebase Console → 프로젝트 설정 → 서비스 계정 → 새 비공개 키 생성
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initSlots() {
  const batch = db.batch();

  for (let d = 1; d <= 6; d++) {
    for (let t = 1; t <= 6; t++) {
      const id = `desk${d}_time${t}`;
      const ref = db.collection('slots').doc(id);
      batch.set(ref, {
        deskIndex: d - 1,
        timeIndex: t - 1,
        registrations: [],
        waitlist: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true }); // merge: true → 이미 있으면 덮어쓰지 않음
    }
  }

  await batch.commit();
  console.log('✅ 36개 슬롯 초기화 완료!');
  process.exit(0);
}

initSlots().catch(console.error);
