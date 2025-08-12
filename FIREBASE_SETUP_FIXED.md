# Firebase Setup Guide - Fixed Version
# دليل إعداد Firebase - النسخة المصححة

## English Instructions / التعليمات باللغة الإنجليزية

### 1. Update Firestore Security Rules / تحديث قواعد أمان Firestore

Go to your Firebase Console → Firestore Database → Rules tab and replace the current rules with:

اذهب إلى وحدة تحكم Firebase → قاعدة بيانات Firestore → علامة التبويب Rules واستبدل القواعد الحالية بـ:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to published articles
    match /articles/{articleId} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write categories
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read/write media
    match /media/{mediaId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write analytics
    match /analytics/{analyticsId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write settings
    match /settings/{settingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 2. Create Initial Collections / إنشاء المجموعات الأولية

After updating the rules, you need to create the initial collections. You can do this by:

بعد تحديث القواعد، تحتاج إلى إنشاء المجموعات الأولية. يمكنك القيام بذلك عن طريق:

1. Go to Firestore Database → Data tab
2. Click "Start collection" 
3. Create these collections:
   - `articles`
   - `categories` 
   - `users`
   - `media`
   - `analytics`
   - `settings`

### 3. Add Sample Data / إضافة بيانات تجريبية

You can add sample data through the Firebase Console or let the application create it automatically when you first use the admin panel.

يمكنك إضافة بيانات تجريبية من خلال وحدة تحكم Firebase أو السماح للتطبيق بإنشائها تلقائياً عند أول استخدام للوحة الإدارة.

### 4. Test Authentication / اختبار المصادقة

Make sure you have at least one admin user created in Firebase Authentication:

تأكد من وجود مستخدم مدير واحد على الأقل في مصادقة Firebase:

1. Go to Authentication → Users
2. Add a new user with email and password
3. Use these credentials to log into the admin panel

## Arabic Instructions / التعليمات باللغة العربية

### 1. تحديث قواعد أمان Firestore

اذهب إلى وحدة تحكم Firebase → قاعدة بيانات Firestore → علامة التبويب Rules واستبدل القواعد الحالية بالقواعد المذكورة أعلاه.

### 2. إنشاء المجموعات الأولية

بعد تحديث القواعد، تحتاج إلى إنشاء المجموعات الأولية من خلال:
1. الذهاب إلى قاعدة بيانات Firestore → علامة التبويب Data
2. النقر على "Start collection"
3. إنشاء المجموعات المذكورة أعلاه

### 3. إضافة بيانات تجريبية

يمكنك إضافة بيانات تجريبية من خلال وحدة تحكم Firebase أو السماح للتطبيق بإنشائها تلقائياً.

### 4. اختبار المصادقة

تأكد من وجود مستخدم مدير واحد على الأقل في مصادقة Firebase للدخول إلى لوحة الإدارة.

## Troubleshooting / استكشاف الأخطاء

### Common Issues / المشاكل الشائعة:

1. **"Missing or insufficient permissions"** - Update the security rules above
2. **"Collection not found"** - Create the collections manually in Firebase Console
3. **"Authentication failed"** - Create a user in Firebase Authentication

### حل المشاكل الشائعة:

1. **"أذونات مفقودة أو غير كافية"** - حدث قواعد الأمان أعلاه
2. **"المجموعة غير موجودة"** - أنشئ المجموعات يدوياً في وحدة تحكم Firebase
3. **"فشل المصادقة"** - أنشئ مستخدم في مصادقة Firebase
