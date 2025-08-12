# Firebase Troubleshooting Guide
# دليل استكشاف أخطاء Firebase

## English / الإنجليزية

### Quick Fix Steps / خطوات الإصلاح السريع

1. **Update Firestore Security Rules** / تحديث قواعد أمان Firestore
2. **Create Collections** / إنشاء المجموعات
3. **Add Authentication User** / إضافة مستخدم للمصادقة
4. **Test with Firebase Test Page** / اختبار باستخدام صفحة اختبار Firebase

### Step-by-Step Solution / الحل خطوة بخطوة

#### Step 1: Update Security Rules / الخطوة 1: تحديث قواعد الأمان

Go to Firebase Console → Firestore Database → Rules and replace with:

اذهب إلى وحدة تحكم Firebase → قاعدة بيانات Firestore → Rules واستبدل بـ:

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

#### Step 2: Create Collections / الخطوة 2: إنشاء المجموعات

1. Go to Firebase Console → Firestore Database → Data
2. Click "Start collection" for each:
   - `articles`
   - `categories`
   - `users`
   - `media`
   - `analytics`
   - `settings`

#### Step 3: Add Authentication User / الخطوة 3: إضافة مستخدم للمصادقة

1. Go to Firebase Console → Authentication → Users
2. Click "Add user"
3. Enter email: `admin@alphaknow.com`
4. Enter password: `admin123456`
5. Click "Add user"

#### Step 4: Test Setup / الخطوة 4: اختبار الإعداد

1. Open `firebase-test.html` in your browser
2. Click "Test Configuration"
3. Click "Test Firestore"
4. Click "Initialize Database"
5. Check results

### Common Error Messages / رسائل الخطأ الشائعة

#### "Missing or insufficient permissions" / "أذونات مفقودة أو غير كافية"

**Cause:** Firestore security rules are too restrictive
**Solution:** Update security rules (Step 1 above)

**السبب:** قواعد أمان Firestore مقيدة جداً
**الحل:** تحديث قواعد الأمان (الخطوة 1 أعلاه)

#### "Collection not found" / "المجموعة غير موجودة"

**Cause:** Collections haven't been created yet
**Solution:** Create collections (Step 2 above)

**السبب:** المجموعات لم يتم إنشاؤها بعد
**الحل:** إنشاء المجموعات (الخطوة 2 أعلاه)

#### "Authentication failed" / "فشل المصادقة"

**Cause:** No users in Firebase Authentication
**Solution:** Add authentication user (Step 3 above)

**السبب:** لا يوجد مستخدمين في مصادقة Firebase
**الحل:** إضافة مستخدم للمصادقة (الخطوة 3 أعلاه)

#### "Firebase not initialized" / "Firebase لم يتم تهيئته"

**Cause:** Firebase SDK not loaded or configuration error
**Solution:** Check internet connection and Firebase configuration

**السبب:** Firebase SDK لم يتم تحميله أو خطأ في التكوين
**الحل:** فحص الاتصال بالإنترنت وتكوين Firebase

### Testing Checklist / قائمة فحص الاختبار

- [ ] Firebase SDK loads without errors
- [ ] Security rules allow read/write operations
- [ ] Collections exist in Firestore
- [ ] Authentication user exists
- [ ] Admin panel can load articles
- [ ] Articles can be created/edited
- [ ] Categories can be managed

### Advanced Troubleshooting / استكشاف الأخطاء المتقدم

#### Check Browser Console / فحص وحدة تحكم المتصفح

1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for Firebase-related errors
4. Check network tab for failed requests

#### Verify Firebase Configuration / التحقق من تكوين Firebase

1. Check `js/firebase-config.js`
2. Verify project ID matches Firebase Console
3. Ensure API key is correct
4. Check if Firebase services are enabled

#### Test Network Connectivity / اختبار الاتصال بالشبكة

1. Check if you can access Firebase Console
2. Verify no firewall blocking Firebase
3. Test with different network if possible

## Arabic / العربية

### خطوات الإصلاح السريع

1. **تحديث قواعد أمان Firestore**
2. **إنشاء المجموعات**
3. **إضافة مستخدم للمصادقة**
4. **الاختبار باستخدام صفحة اختبار Firebase**

### الحل خطوة بخطوة

#### الخطوة 1: تحديث قواعد الأمان

اذهب إلى وحدة تحكم Firebase → قاعدة بيانات Firestore → Rules واستبدل بالقواعد المذكورة أعلاه.

#### الخطوة 2: إنشاء المجموعات

1. اذهب إلى وحدة تحكم Firebase → قاعدة بيانات Firestore → Data
2. انقر على "Start collection" لكل مجموعة:
   - `articles`
   - `categories`
   - `users`
   - `media`
   - `analytics`
   - `settings`

#### الخطوة 3: إضافة مستخدم للمصادقة

1. اذهب إلى وحدة تحكم Firebase → Authentication → Users
2. انقر على "Add user"
3. أدخل البريد الإلكتروني: `admin@alphaknow.com`
4. أدخل كلمة المرور: `admin123456`
5. انقر على "Add user"

#### الخطوة 4: اختبار الإعداد

1. افتح `firebase-test.html` في المتصفح
2. انقر على "Test Configuration"
3. انقر على "Test Firestore"
4. انقر على "Initialize Database"
5. تحقق من النتائج

### رسائل الخطأ الشائعة

#### "أذونات مفقودة أو غير كافية"

**السبب:** قواعد أمان Firestore مقيدة جداً
**الحل:** تحديث قواعد الأمان (الخطوة 1 أعلاه)

#### "المجموعة غير موجودة"

**السبب:** المجموعات لم يتم إنشاؤها بعد
**الحل:** إنشاء المجموعات (الخطوة 2 أعلاه)

#### "فشل المصادقة"

**السبب:** لا يوجد مستخدمين في مصادقة Firebase
**الحل:** إضافة مستخدم للمصادقة (الخطوة 3 أعلاه)

#### "Firebase لم يتم تهيئته"

**السبب:** Firebase SDK لم يتم تحميله أو خطأ في التكوين
**الحل:** فحص الاتصال بالإنترنت وتكوين Firebase

### قائمة فحص الاختبار

- [ ] Firebase SDK يتم تحميله بدون أخطاء
- [ ] قواعد الأمان تسمح بعمليات القراءة/الكتابة
- [ ] المجموعات موجودة في Firestore
- [ ] مستخدم المصادقة موجود
- [ ] لوحة الإدارة يمكنها تحميل المقالات
- [ ] المقالات يمكن إنشاؤها/تعديلها
- [ ] الفئات يمكن إدارتها

### استكشاف الأخطاء المتقدم

#### فحص وحدة تحكم المتصفح

1. افتح أدوات المطور (F12)
2. اذهب إلى علامة التبويب Console
3. ابحث عن أخطاء Firebase
4. تحقق من علامة التبويب Network للطلبات الفاشلة

#### التحقق من تكوين Firebase

1. تحقق من `js/firebase-config.js`
2. تأكد من تطابق معرف المشروع مع وحدة تحكم Firebase
3. تأكد من صحة مفتاح API
4. تحقق من تفعيل خدمات Firebase

#### اختبار الاتصال بالشبكة

1. تحقق من إمكانية الوصول إلى وحدة تحكم Firebase
2. تأكد من عدم وجود جدار حماية يمنع Firebase
3. اختبر مع شبكة مختلفة إذا أمكن

## Support / الدعم

If you're still experiencing issues after following these steps, please:

إذا كنت لا تزال تواجه مشاكل بعد اتباع هذه الخطوات، يرجى:

1. Check the browser console for specific error messages
2. Use the Firebase test page to identify the exact issue
3. Verify your Firebase project settings
4. Ensure all Firebase services are enabled

1. فحص وحدة تحكم المتصفح لرسائل الخطأ المحددة
2. استخدام صفحة اختبار Firebase لتحديد المشكلة بدقة
3. التحقق من إعدادات مشروع Firebase
4. التأكد من تفعيل جميع خدمات Firebase
