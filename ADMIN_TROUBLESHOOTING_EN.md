# Admin Panel Troubleshooting Guide

## Problem
"Login works but there's no article addition in the admin panel"

## Quick Solutions

### 1. Check Admin Panel Status
1. Go to `admin/debug-admin.html`
2. Check admin panel status
3. Check stored data

### 2. Test Article Addition
1. In debug page `admin/debug-admin.html`
2. Click "Test Add Article"
3. Use the test form to add an article

### 3. Check Browser Console
1. Press **F12** to open developer tools
2. Go to **Console** tab
3. Look for error messages

## Possible Causes and Solutions

### 1. JavaScript Loading Issue
**Symptoms:**
- Add article buttons don't appear
- Modal windows don't open

**Solution:**
1. Check JavaScript file loading
2. Ensure no errors in Console
3. Clear browser cache

### 2. Firebase Issue
**Symptoms:**
- Articles not saving
- Firebase error messages

**Solution:**
1. Check Firebase settings
2. Verify Firestore security rules
3. Use local data as fallback

### 3. Local Data Issue
**Symptoms:**
- Existing articles don't appear
- New articles not saving

**Solution:**
1. Clear LocalStorage and reload
2. Check stored data integrity
3. Use default data

## Diagnostic Steps

### 1. Check Admin Panel Status
```javascript
// In browser console
console.log(window.adminPanel); // Should print AdminPanel object
console.log(window.adminPanel.articles); // Should print articles array
```

### 2. Check Stored Data
```javascript
// In browser console
console.log(localStorage.getItem('alphaknow_articles')); // Should print JSON
console.log(localStorage.getItem('alphaknow_categories')); // Should print JSON
```

### 3. Test Manual Article Addition
```javascript
// In browser console
const testArticle = {
  id: Date.now(),
  title: 'Test Article',
  excerpt: 'Article summary',
  content: '<p>Article content</p>',
  category: 'entrepreneurship',
  status: 'published',
  author: 'AlphaKnow Team',
  date: new Date().toISOString().split('T')[0],
  views: 0
};

let articles = JSON.parse(localStorage.getItem('alphaknow_articles') || '[]');
articles.unshift(testArticle);
localStorage.setItem('alphaknow_articles', JSON.stringify(articles));
```

## Quick Fixes

### 1. Reload Admin Panel
1. Clear cache
2. Reload page
3. Check Console for errors

### 2. Reset Data
```javascript
// In browser console
localStorage.removeItem('alphaknow_articles');
localStorage.removeItem('alphaknow_categories');
location.reload();
```

### 3. Use Default Data
If articles don't appear, default data will be loaded automatically.

## Additional Tips

### 1. Ensure All Files Load
- `admin/js/admin.js`
- `js/firebase-config.js`
- `js/firebase-service.js`

### 2. Check Firebase Settings
- Ensure Firestore is enabled
- Check security rules
- Verify configuration data

### 3. Use Debug Pages
- `admin/debug-admin.html` to check status
- `admin/debug.html` to check Firebase

## If Problem Persists

1. **Use Debug Page**: `admin/debug-admin.html`
2. **Check Console**: Look for error messages
3. **Test Article Addition**: Use test form
4. **Contact Support**: Attach Console screenshot 