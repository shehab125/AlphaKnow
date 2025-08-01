# دليل استكشاف الأخطاء - لوحة التحكم

## المشكلة
"اشتغل بس مفيش اضافه مقال في لوحه التحكم"

## الحلول السريعة

### 1. فحص حالة لوحة التحكم
1. اذهب إلى `admin/debug-admin.html`
2. تحقق من حالة لوحة التحكم
3. تحقق من البيانات المحفوظة

### 2. اختبار إضافة مقال
1. في صفحة التشخيص `admin/debug-admin.html`
2. اضغط على "اختبار إضافة مقال"
3. استخدم النموذج التجريبي لإضافة مقال

### 3. فحص وحدة تحكم المتصفح
1. اضغط **F12** لفتح أدوات المطور
2. اذهب إلى تبويب **Console**
3. ابحث عن رسائل الخطأ

## الأسباب المحتملة والحلول

### 1. مشكلة في تحميل JavaScript
**الأعراض:**
- لا تظهر أزرار إضافة المقال
- لا تفتح النوافذ المنبثقة

**الحل:**
1. تحقق من تحميل ملفات JavaScript
2. تأكد من عدم وجود أخطاء في Console
3. امسح ذاكرة التخزين المؤقت للمتصفح

### 2. مشكلة في Firebase
**الأعراض:**
- لا يتم حفظ المقالات
- رسائل خطأ في Firebase

**الحل:**
1. تحقق من إعدادات Firebase
2. تأكد من قواعد الأمان في Firestore
3. استخدم البيانات المحلية كاحتياطي

### 3. مشكلة في البيانات المحلية
**الأعراض:**
- لا تظهر المقالات الموجودة
- لا يتم حفظ المقالات الجديدة

**الحل:**
1. امسح LocalStorage وإعادة التحميل
2. تحقق من صحة البيانات المحفوظة
3. استخدم البيانات الافتراضية

## خطوات التشخيص

### 1. فحص حالة لوحة التحكم
```javascript
// في وحدة تحكم المتصفح
console.log(window.adminPanel); // يجب أن يطبع كائن AdminPanel
console.log(window.adminPanel.articles); // يجب أن يطبع مصفوفة المقالات
```

### 2. فحص البيانات المحفوظة
```javascript
// في وحدة تحكم المتصفح
console.log(localStorage.getItem('alphaknow_articles')); // يجب أن يطبع JSON
console.log(localStorage.getItem('alphaknow_categories')); // يجب أن يطبع JSON
```

### 3. اختبار إضافة مقال يدوياً
```javascript
// في وحدة تحكم المتصفح
const testArticle = {
  id: Date.now(),
  title: 'مقال تجريبي',
  excerpt: 'ملخص المقال',
  content: '<p>محتوى المقال</p>',
  category: 'entrepreneurship',
  status: 'published',
  author: 'فريق AlphaKnow',
  date: new Date().toISOString().split('T')[0],
  views: 0
};

let articles = JSON.parse(localStorage.getItem('alphaknow_articles') || '[]');
articles.unshift(testArticle);
localStorage.setItem('alphaknow_articles', JSON.stringify(articles));
```

## إصلاحات سريعة

### 1. إعادة تحميل لوحة التحكم
1. امسح ذاكرة التخزين المؤقت
2. أعد تحميل الصفحة
3. تحقق من Console للأخطاء

### 2. إعادة تهيئة البيانات
```javascript
// في وحدة تحكم المتصفح
localStorage.removeItem('alphaknow_articles');
localStorage.removeItem('alphaknow_categories');
location.reload();
```

### 3. استخدام البيانات الافتراضية
إذا لم تظهر المقالات، سيتم تحميل البيانات الافتراضية تلقائياً.

## نصائح إضافية

### 1. تأكد من تحميل جميع الملفات
- `admin/js/admin.js`
- `js/firebase-config.js`
- `js/firebase-service.js`

### 2. تحقق من إعدادات Firebase
- تأكد من تفعيل Firestore
- تحقق من قواعد الأمان
- تأكد من صحة بيانات التكوين

### 3. استخدم صفحة التشخيص
- `admin/debug-admin.html` لفحص الحالة
- `admin/debug.html` لفحص Firebase

## إذا استمرت المشكلة

1. **استخدم صفحة التشخيص**: `admin/debug-admin.html`
2. **تحقق من Console**: ابحث عن رسائل الخطأ
3. **اختبر إضافة مقال**: استخدم النموذج التجريبي
4. **تواصل مع الدعم**: ارفق لقطة شاشة من Console 