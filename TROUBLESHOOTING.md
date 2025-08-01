# دليل استكشاف الأخطاء وإصلاحها - Firebase

## المشاكل الشائعة وحلولها

### 1. مشكلة "حدث خطأ" عند تسجيل الدخول

#### الأسباب المحتملة:
- **Firebase غير محمل بشكل صحيح**
- **إعدادات Firebase خاطئة**
- **قواعد الأمان في Firestore**
- **المستخدم غير موجود في Firebase**

#### الحلول:

##### أ. فحص إعدادات Firebase
1. تأكد من أن ملف `js/firebase-config.js` يحتوي على الإعدادات الصحيحة
2. تأكد من أن `projectId` و `authDomain` صحيحان
3. تأكد من أن `apiKey` صحيح

##### ب. فحص قواعد الأمان في Firestore
1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. اختر مشروعك
3. اذهب إلى Firestore Database
4. اذهب إلى Rules
5. تأكد من أن القواعد تسمح بالقراءة والكتابة:

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

##### ج. إنشاء مستخدم في Firebase
1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. اختر مشروعك
3. اذهب إلى Authentication
4. اذهب إلى Users
5. اضغط على "Add User"
6. أدخل البريد الإلكتروني وكلمة المرور
7. اضغط "Add"

### 2. مشكلة "Firebase غير محمل"

#### الحلول:
1. تأكد من اتصال الإنترنت
2. تأكد من أن جميع ملفات Firebase SDK محملة
3. تحقق من وحدة تحكم المتصفح (F12) للأخطاء

### 3. مشكلة "خطأ في الاتصال"

#### الحلول:
1. تأكد من أن مشروع Firebase مفعل
2. تأكد من أن Authentication مفعل في Firebase Console
3. تأكد من أن Firestore مفعل
4. تحقق من قواعد الأمان

## خطوات التشخيص

### 1. استخدام صفحة التشخيص
1. اذهب إلى `admin/debug.html`
2. اتبع التعليمات في الصفحة
3. سجل النتائج

### 2. فحص وحدة تحكم المتصفح
1. اضغط F12 لفتح أدوات المطور
2. اذهب إلى تبويب Console
3. حاول تسجيل الدخول
4. ابحث عن رسائل الخطأ

### 3. فحص إعدادات Firebase
```javascript
// في وحدة تحكم المتصفح، اكتب:
console.log(window.FIREBASE);
console.log(firebase);
```

## رسائل الخطأ الشائعة

| رسالة الخطأ | المعنى | الحل |
|-------------|--------|------|
| `auth/user-not-found` | المستخدم غير موجود | أنشئ المستخدم في Firebase Console |
| `auth/wrong-password` | كلمة المرور خاطئة | تحقق من كلمة المرور |
| `auth/invalid-email` | البريد الإلكتروني غير صحيح | تحقق من صحة البريد الإلكتروني |
| `auth/network-request-failed` | خطأ في الاتصال | تحقق من اتصال الإنترنت |
| `auth/too-many-requests` | تجاوز عدد المحاولات | انتظر قليلاً ثم حاول مرة أخرى |

## نصائح إضافية

### 1. تأكد من تفعيل الخدمات
- Authentication (Email/Password)
- Firestore Database
- Storage (إذا كنت تستخدم رفع الملفات)

### 2. فحص قواعد الأمان
```javascript
// قواعد أمان بسيطة للتطوير
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // للتطوير فقط!
    }
  }
}
```

### 3. اختبار الاتصال
```javascript
// في وحدة تحكم المتصفح
firebase.auth().signInWithEmailAndPassword('test@example.com', 'password')
  .then((userCredential) => {
    console.log('نجح تسجيل الدخول:', userCredential.user);
  })
  .catch((error) => {
    console.error('فشل تسجيل الدخول:', error);
  });
```

## الحصول على المساعدة

إذا استمرت المشكلة:
1. استخدم صفحة التشخيص `admin/debug.html`
2. سجل رسائل الخطأ من وحدة تحكم المتصفح
3. تأكد من اتباع جميع الخطوات أعلاه
4. تحقق من إعدادات Firebase Console 