# إعداد Firebase للموقع

## الخطوات المطلوبة لإعداد Firebase

### 1. إنشاء مشروع Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. انقر على "إنشاء مشروع" أو "Add project"
3. أدخل اسم المشروع (مثال: `alphaknow-blog`)
4. اختر ما إذا كنت تريد تفعيل Google Analytics (اختياري)
5. انقر على "إنشاء المشروع"

### 2. إعداد Authentication

1. في لوحة التحكم، اذهب إلى "Authentication" من القائمة الجانبية
2. انقر على "Get started"
3. في تبويب "Sign-in method"، فعّل "Email/Password"
4. انقر على "Save"

### 3. إنشاء قاعدة البيانات Firestore

1. اذهب إلى "Firestore Database" من القائمة الجانبية
2. انقر على "Create database"
3. اختر "Start in test mode" (يمكنك تغيير القواعد لاحقاً)
4. اختر موقع قاعدة البيانات (يفضل اختيار أقرب موقع للمستخدمين)

### 4. إعداد Storage

1. اذهب إلى "Storage" من القائمة الجانبية
2. انقر على "Get started"
3. اختر "Start in test mode"
4. اختر موقع Storage (يفضل نفس موقع قاعدة البيانات)

### 5. الحصول على بيانات التكوين

1. اذهب إلى "Project settings" (أيقونة الترس)
2. في تبويب "General"، ابحث عن "Your apps"
3. انقر على أيقونة الويب `</>`
4. أدخل اسم التطبيق (مثال: `alphaknow-web`)
5. انقر على "Register app"
6. انسخ بيانات التكوين التي ستظهر لك

### 6. تحديث ملف التكوين

1. افتح ملف `js/firebase-config.js`
2. استبدل بيانات التكوين الافتراضية بالبيانات الحقيقية:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

### 7. إعداد قواعد الأمان (اختياري)

#### قواعد Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // المقالات - يمكن للجميع قراءتها، المدير فقط يكتبها
    match /articles/{articleId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // الفئات - يمكن للجميع قراءتها، المدير فقط يكتبها
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // المستخدمين - المدير فقط يقرأ ويكتب
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // الوسائط - المدير فقط يقرأ ويكتب
    match /media/{mediaId} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // الإحصائيات - المدير فقط يقرأ ويكتب
    match /analytics/{analyticsId} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

#### قواعد Storage
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // الصور - المدير فقط يرفعها
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // المستندات - المدير فقط يرفعها
    match /documents/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### 8. إنشاء حساب المدير

1. اذهب إلى "Authentication" > "Users"
2. انقر على "Add user"
3. أدخل البريد الإلكتروني وكلمة المرور
4. انقر على "Add user"

### 9. اختبار النظام

1. افتح `admin/login.html` في المتصفح
2. سجل الدخول باستخدام بيانات المدير التي أنشأتها
3. تأكد من أن لوحة التحكم تعمل بشكل صحيح

## ملاحظات مهمة

### الأمان
- تأكد من تحديث قواعد الأمان قبل نشر الموقع للإنتاج
- استخدم متغيرات البيئة لتخزين بيانات التكوين الحساسة
- فعّل HTTPS في الإنتاج

### الأداء
- استخدم الفهرسة المناسبة في Firestore
- فعّل التخزين المؤقت للملفات
- استخدم ضغط الصور قبل رفعها

### التكلفة
- Firebase يوفر خطة مجانية سخية
- راقب الاستخدام في لوحة التحكم
- فعّل التنبيهات عند تجاوز الحدود

## استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ في الاتصال**
   - تأكد من صحة بيانات التكوين
   - تحقق من إعدادات الشبكة
   - تأكد من تفعيل الخدمات المطلوبة

2. **خطأ في الصلاحيات**
   - تحقق من قواعد الأمان
   - تأكد من تسجيل الدخول
   - تحقق من دور المستخدم

3. **خطأ في رفع الملفات**
   - تحقق من حجم الملف
   - تأكد من نوع الملف المسموح
   - تحقق من قواعد Storage

### للحصول على المساعدة
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase) 