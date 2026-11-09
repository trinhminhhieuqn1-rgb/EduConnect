export interface FirebaseGuideContent {
  overview: string;
  envTemplate: string;
  rules: string;
  initCode: string;
  steps: { step: string; title: string; detail: string }[];
}

export const FIREBASE_DEPLOYMENT_GUIDE: FirebaseGuideContent = {
  overview:
    'EduConnect được thiết kế với kiến trúc Data Access Object (DAO) linh hoạt. Dưới đây là bộ cấu hình chuẩn, bộ quy tắc bảo mật Firestore Rules và các bước kết nối Firebase Production hoàn chỉnh.',
  envTemplate: `# Cấu hình Firebase Web SDK (.env hoặc Secrets)
VITE_FIREBASE_API_KEY="AIzaSyYourApiKeyHere12345"
VITE_FIREBASE_AUTH_DOMAIN="educonnect-prod.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="educonnect-prod"
VITE_FIREBASE_STORAGE_BUCKET="educonnect-prod.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="591007382542"
VITE_FIREBASE_APP_ID="1:591007382542:web:a1b2c3d4e5f6g7"`,
  rules: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function kiểm tra đăng nhập
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function lấy role người dùng
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }

    // 1. Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && (request.auth.uid == userId || getUserRole() == 'admin');
    }

    // 2. Classrooms collection
    match /classrooms/{classId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && (getUserRole() == 'teacher' || getUserRole() == 'admin');
      allow update, delete: if isAuthenticated() && (resource.data.teacherId == request.auth.uid || getUserRole() == 'admin');
    }

    // 3. Lessons collection
    match /lessons/{lessonId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && (getUserRole() == 'teacher' || getUserRole() == 'admin');
    }

    // 4. Assignments & Quizzes
    match /assignments/{assignmentId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && (getUserRole() == 'teacher' || getUserRole() == 'admin');
    }

    // 5. Submissions (Học sinh nộp bài, Giáo viên chấm)
    match /submissions/{submissionId} {
      allow read: if isAuthenticated() && (
        resource.data.studentId == request.auth.uid || 
        getUserRole() == 'teacher' || 
        getUserRole() == 'admin'
      );
      allow create: if isAuthenticated() && request.resource.data.studentId == request.auth.uid;
      allow update: if isAuthenticated() && (
        getUserRole() == 'teacher' || 
        getUserRole() == 'admin'
      );
    }

    // 6. Notifications
    match /notifications/{notifId} {
      allow read, update: if isAuthenticated() && (
        resource.data.userId == request.auth.uid || 
        resource.data.userId == 'all'
      );
      allow create: if isAuthenticated();
    }
  }
}`,
  initCode: `import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);`,
  steps: [
    {
      step: 'Bước 1',
      title: 'Tạo dự án trên Firebase Console',
      detail:
        'Truy cập https://console.firebase.google.com, nhấn "Add Project", đặt tên "educonnect-prod", chọn kích hoạt Google Analytics hoặc bỏ qua.',
    },
    {
      step: 'Bước 2',
      title: 'Kích hoạt Firebase Authentication & Cloud Firestore',
      detail:
        'Vào mục Authentication > Sign-in method, bật "Email/Password". Tiếp theo vào Cloud Firestore > Create database > chọn vị trí (ví dụ asia-southeast1 / Singapore).',
    },
    {
      step: 'Bước 3',
      title: 'Thiết lập Firestore Security Rules',
      detail:
        'Sao chép bộ quy tắc bảo mật ở tab "Firestore Rules" dán vào Firebase Console > Firestore Database > Rules rồi nhấn "Publish".',
    },
    {
      step: 'Bước 4',
      title: 'Lấy khóa cấu hình Web App',
      detail:
        'Tại Project Settings > General > Your apps, nhấn biểu tượng Web (</>), sao chép các khóa cấu hình vào biến môi trường (.env).',
    },
    {
      step: 'Bước 5',
      title: 'Triển khai (Deployment)',
      detail:
        'Chạy lệnh `npm run build` để đóng gói Vite, sau đó deploy lên Firebase Hosting bằng lệnh `firebase deploy --only hosting` hoặc triển khai trên Vercel / Cloud Run.',
    },
  ],
};
