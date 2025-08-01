# دليل حل مشكلة تسجيل الدخول - Firebase

## المشكلة
"ربطه بالفايربيز و ضفت اكونت فيه بس بحاول اسجل في لوحه التحكم بيقولي حدث خطأ"

## الحلول السريعة

### 1. فحص إعدادات Firebase
تأكد من أن ملف `js/firebase-config.js` يحتوي على الإعدادات الصحيحة:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBw7CDkjn-3S2-anCdA2DW9foy5HftaS24",
    authDomain: "alphaknow-2f0d3.firebaseapp.com",
    projectId: "alphaknow-2f0d3",
    storageBucket: "alphaknow-2f0d3.firebasestorage.app",
    messagingSenderId: "924596688523",
    appId: "1:924596688523:web:f0a72b5eafe39f857da68e",
    measurementId: "G-GK8NJRRM1T"
};
```

### 2. إنشاء مستخدم في Firebase
1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. اختر مشروعك `alphaknow-2f0d3`
3. اذهب إلى **Authentication** → **Users**
4. اضغط على **Add User**
5. أدخل البريد الإلكتروني وكلمة المرور
6. اضغط **Add**

### 3. تفعيل Authentication
1. في Firebase Console
2. اذهب إلى **Authentication** → **Sign-in method**
3. تأكد من تفعيل **Email/Password**

### 4. فحص قواعد Firestore
1. في Firebase Console
2. اذهب إلى **Firestore Database** → **Rules**
3. تأكد من أن القواعد تسمح بالقراءة والكتابة:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. استخدام صفحة التشخيص
1. اذهب إلى `admin/debug.html`
2. اتبع التعليمات في الصفحة
3. سجل النتائج

### 6. فحص وحدة تحكم المتصفح
1. اضغط **F12** لفتح أدوات المطور
2. اذهب إلى تبويب **Console**
3. حاول تسجيل الدخول
4. ابحث عن رسائل الخطأ

## الأخطاء الشائعة وحلولها

| الخطأ | الحل |
|-------|------|
| `auth/user-not-found` | أنشئ المستخدم في Firebase Console |
| `auth/wrong-password` | تحقق من كلمة المرور |
| `auth/invalid-email` | تحقق من صحة البريد الإلكتروني |
| `auth/network-request-failed` | تحقق من اتصال الإنترنت |
| `Firebase غير محمل` | تحقق من تحميل ملفات Firebase SDK |

## خطوات التشخيص

### 1. فحص Firebase SDK
```javascript
// في وحدة تحكم المتصفح
console.log(typeof firebase); // يجب أن يطبع "object"
console.log(window.FIREBASE); // يجب أن يطبع إعدادات Firebase
```

### 2. اختبار تسجيل الدخول
```javascript
// في وحدة تحكم المتصفح
firebase.auth().signInWithEmailAndPassword('your-email@example.com', 'your-password')
  .then((userCredential) => {
    console.log('نجح تسجيل الدخول:', userCredential.user);
  })
  .catch((error) => {
    console.error('فشل تسجيل الدخول:', error);
  });
```

## إذا استمرت المشكلة

1. **تحقق من إعدادات Firebase Console**
   - تأكد من تفعيل Authentication
   - تأكد من تفعيل Firestore Database
   - تأكد من صحة قواعد الأمان

2. **تحقق من ملفات المشروع**
   - تأكد من وجود `js/firebase-config.js`
   - تأكد من وجود `js/firebase-service.js`
   - تأكد من تحميل ملفات Firebase SDK

3. **تحقق من المتصفح**
   - جرب متصفح آخر
   - امسح ذاكرة التخزين المؤقت
   - تحقق من إعدادات الأمان

4. **تواصل مع الدعم**
   - استخدم صفحة التشخيص `admin/debug.html`
   - سجل رسائل الخطأ
   - ارفق لقطة شاشة من وحدة تحكم المتصفح 