import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const questions = [
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika x + y = 10 dan xy = 21, berapakah nilai dari x^2 + y^2?',
    options: ['48', '58', '68', '78', '88'],
    correctAnswer: 1,
    explanation: 'x^2 + y^2 = (x + y)^2 - 2xy = 10^2 - 2(21) = 100 - 42 = 58.',
    difficulty: 'medium',
    topic: 'Aljabar',
    subtopic: 'Persamaan Kuadrat'
  },
  {
    type: 'SAINTEK',
    section: 'Biologi',
    content: 'Organel sel yang berperan dalam proses respirasi seluler untuk menghasilkan ATP adalah...',
    options: ['Ribosom', 'Lisosom', 'Mitokondria', 'Badan Golgi', 'Retikulum Endoplasma'],
    correctAnswer: 2,
    explanation: 'Mitokondria adalah "powerhouse of the cell" yang menghasilkan ATP melalui respirasi seluler.',
    difficulty: 'easy',
    topic: 'Sel',
    subtopic: 'Organel Sel'
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Semua dokter adalah orang pintar. Sebagian orang pintar adalah pemain catur. Kesimpulan yang tepat adalah...',
    options: [
      'Semua dokter adalah pemain catur',
      'Sebagian dokter adalah pemain catur',
      'Semua pemain catur adalah dokter',
      'Tidak ada dokter yang pemain catur',
      'Tidak dapat disimpulkan'
    ],
    correctAnswer: 4,
    explanation: 'Tidak ada hubungan langsung antara dokter dan pemain catur dalam premis tersebut.',
    difficulty: 'hard',
    topic: 'Logika',
    subtopic: 'Silogisme'
  }
];

const materials = [
  {
    title: 'Sistem Pencernaan Manusia',
    section: 'SAINTEK',
    topic: 'Biologi',
    content: `
# Sistem Pencernaan Manusia
Sistem pencernaan terdiri dari organ-organ yang bekerja sama untuk memecah makanan menjadi nutrisi.

## Organ Utama:
1. **Mulut**: Pencernaan mekanik (gigi) dan kimiawi (ptialin).
2. **Lambung**: Asam lambung (HCl) dan enzim pepsin.
3. **Usus Halus**: Penyerapan sari makanan.

## Tips UTBK:
Fokus pada enzim-enzim pencernaan dan fungsinya!
    `,
    videoUrl: 'https://www.youtube.com/watch?v=VwrsL-lCZYo'
  },
  {
    title: 'Persamaan Kuadrat Cepat',
    section: 'TPS',
    topic: 'Pengetahuan Kuantitatif',
    content: `
# Persamaan Kuadrat
Bentuk umum: ax^2 + bx + c = 0

## Rumus Cepat:
- x1 + x2 = -b/a
- x1 * x2 = c/a

## Shortcut:
Jika a+b+c = 0, maka akar-akarnya adalah 1 dan c/a.
    `,
    videoUrl: 'https://www.youtube.com/watch?v=Z7mP8M-V2-k'
  }
];

async function seed() {
  console.log('Seeding questions...');
  const qIds = [];
  for (const q of questions) {
    const docRef = await addDoc(collection(db, 'questions'), q);
    qIds.push(docRef.id);
  }

  console.log('Seeding tryouts...');
  await addDoc(collection(db, 'tryouts'), {
    title: 'Simulasi UTBK Mandiri #1',
    duration: 60,
    questionIds: qIds,
    createdAt: new Date().toISOString()
  });

  console.log('Seeding materials...');
  for (const m of materials) {
    await addDoc(collection(db, 'materials'), m);
  }

  console.log('Seed completed!');
}

seed().catch(console.error);
