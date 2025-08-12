// Add Article Page JavaScript
class AddArticleManager {
    constructor() {
        this.editor = null;
        this.tagify = null;
        this.autoSaveInterval = null;
        this.currentArticleId = null;
        this.isDraft = false;
        this.isAutoSaveEnabled = true;
        
        this.init();
    }

    init() {
        this.initializeEditor();
        this.initializeTagify();
        this.initializeImageUpload();
        this.initializeEventListeners();
        this.initializeAutoSave();
        this.loadRecentArticles();
        this.hideLoadingScreen();
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 300);
            }
        }, 1000);
    }

    initializeEditor() {
        const toolbarOptions = [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'image', 'video', 'blockquote', 'code-block'],
            ['clean']
        ];

        this.editor = new Quill('#article-content', {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions
            },
            placeholder: 'ابدأ بكتابة محتوى المقال هنا...',
            formats: [
                'header', 'bold', 'italic', 'underline', 'strike',
                'color', 'background', 'font', 'size', 'list', 'bullet',
                'indent', 'align', 'link', 'image', 'video', 'blockquote', 'code-block'
            ]
        });

        // Update stats on content change
        this.editor.on('text-change', () => {
            this.updateStats();
            this.updateSEOScore();
        });
    }

    initializeTagify() {
        const tagsInput = document.getElementById('article-tags');
        this.tagify = new Tagify(tagsInput, {
            placeholder: 'أضف الكلمات المفتاحية...',
            delimiters: ',| ',
            maxTags: 10,
            dropdown: {
                enabled: 0,
                maxItems: 5
            }
        });
    }

    initializeImageUpload() {
        const uploadArea = document.getElementById('image-upload-area');
        const imageInput = document.getElementById('article-image');
        const imagePreview = document.getElementById('image-preview');
        const removeBtn = document.getElementById('remove-image-btn');

        // Click to upload
        uploadArea.addEventListener('click', () => {
            imageInput.click();
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary-color)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'var(--border-color)';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--border-color)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleImageUpload(files[0]);
            }
        });

        // File input change
        imageInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleImageUpload(e.target.files[0]);
            }
        });

        // Remove image
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeImage();
        });
    }

    handleImageUpload(file) {
        // Validate file
        if (!file.type.startsWith('image/')) {
            this.showToast('يرجى اختيار ملف صورة صحيح', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            this.showToast('حجم الصورة يجب أن يكون أقل من 5 ميجابايت', 'error');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewImg = document.querySelector('.preview-img');
            const uploadPlaceholder = document.querySelector('.image-upload-placeholder');
            const imagePreview = document.getElementById('image-preview');

            previewImg.src = e.target.result;
            uploadPlaceholder.style.display = 'none';
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    removeImage() {
        const imageInput = document.getElementById('article-image');
        const uploadPlaceholder = document.querySelector('.image-upload-placeholder');
        const imagePreview = document.getElementById('image-preview');

        imageInput.value = '';
        uploadPlaceholder.style.display = 'block';
        imagePreview.style.display = 'none';
    }

    initializeEventListeners() {
        // Title to slug conversion
        const titleInput = document.getElementById('article-title');
        const slugInput = document.getElementById('article-slug');

        titleInput.addEventListener('input', () => {
            if (!slugInput.value || slugInput.dataset.autoGenerated === 'true') {
                slugInput.value = this.generateSlug(titleInput.value);
                slugInput.dataset.autoGenerated = 'true';
            }
            this.updateSEOScore();
        });

        slugInput.addEventListener('input', () => {
            slugInput.dataset.autoGenerated = 'false';
        });

        // Section toggles
        document.querySelectorAll('.section-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const target = toggle.dataset.target;
                const content = document.getElementById(target);
                const icon = toggle.querySelector('i');

                content.classList.toggle('collapsed');
                icon.style.transform = content.classList.contains('collapsed') 
                    ? 'rotate(180deg)' : 'rotate(0deg)';
            });
        });

        // Form submission
        document.getElementById('save-draft-btn').addEventListener('click', () => {
            this.saveArticle(true);
        });

        document.getElementById('publish-btn').addEventListener('click', () => {
            this.saveArticle(false);
        });

        // Preview
        document.getElementById('preview-btn').addEventListener('click', () => {
            this.showPreview();
        });

        document.getElementById('close-preview').addEventListener('click', () => {
            this.hidePreview();
        });

        // Auto-save toggle
        document.getElementById('auto-save-toggle').addEventListener('click', () => {
            this.toggleAutoSave();
        });

        // Import content
        document.getElementById('import-content').addEventListener('click', () => {
            this.showImportDialog();
        });

        // User menu
        document.getElementById('admin-user-btn').addEventListener('click', () => {
            const dropdown = document.getElementById('admin-user-dropdown');
            dropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const userBtn = document.getElementById('admin-user-btn');
            const dropdown = document.getElementById('admin-user-dropdown');
            
            if (!userBtn.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Update stats on form changes
        document.getElementById('article-excerpt').addEventListener('input', () => {
            this.updateSEOScore();
        });

        document.getElementById('article-category').addEventListener('change', () => {
            this.updateSEOScore();
        });
    }

    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[أإآ]/g, 'ا')
            .replace(/[ة]/g, 'ه')
            .replace(/[ى]/g, 'ي')
            .replace(/[ء]/g, '')
            .replace(/[^\u0600-\u06FF\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }

    updateStats() {
        const content = this.editor.getText();
        const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
        const charCount = content.length;
        const readTime = Math.ceil(wordCount / 200); // 200 words per minute

        // Update main stats
        document.getElementById('word-count').textContent = wordCount;
        document.getElementById('read-time').textContent = `${readTime} دقيقة`;

        // Update sidebar stats
        document.getElementById('sidebar-word-count').textContent = wordCount;
        document.getElementById('char-count').textContent = charCount;
        document.getElementById('sidebar-read-time').textContent = `${readTime} دقيقة`;
    }

    updateSEOScore() {
        let score = 0;
        const maxScore = 100;

        // Title length (20 points)
        const title = document.getElementById('article-title').value;
        if (title.length >= 30 && title.length <= 60) {
            score += 20;
        } else if (title.length > 0) {
            score += 10;
        }

        // Excerpt length (15 points)
        const excerpt = document.getElementById('article-excerpt').value;
        if (excerpt.length >= 120 && excerpt.length <= 160) {
            score += 15;
        } else if (excerpt.length > 0) {
            score += 8;
        }

        // Content length (25 points)
        const content = this.editor.getText();
        const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
        if (wordCount >= 300) {
            score += 25;
        } else if (wordCount >= 150) {
            score += 15;
        } else if (wordCount > 0) {
            score += 5;
        }

        // Category selected (10 points)
        const category = document.getElementById('article-category').value;
        if (category) {
            score += 10;
        }

        // Image uploaded (10 points)
        const imageInput = document.getElementById('article-image');
        if (imageInput.files.length > 0) {
            score += 10;
        }

        // Tags added (10 points)
        const tags = this.tagify.value;
        if (tags.length >= 3) {
            score += 10;
        } else if (tags.length > 0) {
            score += 5;
        }

        // Slug generated (10 points)
        const slug = document.getElementById('article-slug').value;
        if (slug) {
            score += 10;
        }

        // Update score display
        const scoreElement = document.getElementById('seo-score');
        scoreElement.textContent = `${score}%`;
        
        // Update score color
        if (score >= 80) {
            scoreElement.style.background = 'var(--success-color)';
        } else if (score >= 60) {
            scoreElement.style.background = 'var(--warning-color)';
        } else {
            scoreElement.style.background = 'var(--danger-color)';
        }
    }

    initializeAutoSave() {
        if (this.isAutoSaveEnabled) {
            this.autoSaveInterval = setInterval(() => {
                this.autoSave();
            }, 30000); // Auto-save every 30 seconds
        }
    }

    toggleAutoSave() {
        this.isAutoSaveEnabled = !this.isAutoSaveEnabled;
        const statusElement = document.getElementById('auto-save-status');
        
        if (this.isAutoSaveEnabled) {
            statusElement.textContent = 'مفعل';
            this.initializeAutoSave();
            this.showToast('تم تفعيل الحفظ التلقائي', 'success');
        } else {
            statusElement.textContent = 'معطل';
            if (this.autoSaveInterval) {
                clearInterval(this.autoSaveInterval);
                this.autoSaveInterval = null;
            }
            this.showToast('تم إلغاء الحفظ التلقائي', 'info');
        }
    }

    autoSave() {
        const title = document.getElementById('article-title').value;
        if (title.trim()) {
            this.saveArticle(true, true); // Save as draft, silent mode
        }
    }

    async saveArticle(isDraft = false, silent = false) {
        try {
            const formData = this.collectFormData();
            formData.status = isDraft ? 'draft' : 'published';
            formData.isDraft = isDraft;

            if (!this.validateForm(formData, isDraft)) {
                return;
            }

            if (!silent) {
                this.showToast('جاري الحفظ...', 'info');
            }

            // Simulate API call (replace with actual Firebase save)
            await this.simulateSave(formData);

            if (!silent) {
                const message = isDraft ? 'تم حفظ المسودة بنجاح' : 'تم نشر المقال بنجاح';
                this.showToast(message, 'success');
            }

            if (!isDraft) {
                // Redirect to articles list after successful publish
                setTimeout(() => {
                    window.location.href = 'index.html#articles';
                }, 2000);
            }

        } catch (error) {
            console.error('Error saving article:', error);
            if (!silent) {
                this.showToast('حدث خطأ أثناء الحفظ', 'error');
            }
        }
    }

    collectFormData() {
        return {
            title: document.getElementById('article-title').value,
            slug: document.getElementById('article-slug').value,
            excerpt: document.getElementById('article-excerpt').value,
            content: this.editor.getContents(),
            contentText: this.editor.getText(),
            category: document.getElementById('article-category').value,
            status: document.getElementById('article-status').value,
            featured: document.getElementById('article-featured').checked,
            tags: this.tagify.value.map(tag => tag.value),
            image: document.getElementById('article-image').files[0],
            seoTitle: document.getElementById('seo-title').value,
            seoDescription: document.getElementById('seo-description').value,
            seoKeywords: document.getElementById('seo-keywords').value,
            publishDate: document.getElementById('publish-date').value,
            author: document.getElementById('article-author').value,
            visibility: document.getElementById('article-visibility').value,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    validateForm(formData, isDraft) {
        const errors = [];

        if (!formData.title.trim()) {
            errors.push('عنوان المقال مطلوب');
        }

        if (!formData.excerpt.trim()) {
            errors.push('ملخص المقال مطلوب');
        }

        if (!formData.category) {
            errors.push('فئة المقال مطلوبة');
        }

        if (!isDraft && formData.contentText.trim().length < 100) {
            errors.push('محتوى المقال قصير جداً (الحد الأدنى 100 حرف)');
        }

        if (errors.length > 0) {
            errors.forEach(error => {
                this.showToast(error, 'error');
            });
            return false;
        }

        return true;
    }

    async simulateSave(formData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Here you would implement actual Firebase save logic
        console.log('Saving article:', formData);
        
        // Store in localStorage for demo purposes
        const articles = JSON.parse(localStorage.getItem('articles') || '[]');
        const articleId = this.currentArticleId || Date.now().toString();
        
        const article = {
            id: articleId,
            ...formData,
            views: 0,
            likes: 0,
            shares: 0
        };

        const existingIndex = articles.findIndex(a => a.id === articleId);
        if (existingIndex >= 0) {
            articles[existingIndex] = article;
        } else {
            articles.push(article);
        }

        localStorage.setItem('articles', JSON.stringify(articles));
        this.currentArticleId = articleId;
    }

    showPreview() {
        const formData = this.collectFormData();
        const modal = document.getElementById('preview-modal');
        const previewContent = document.getElementById('article-preview-content');

        // Generate preview HTML
        const previewHTML = `
            <div class="article-preview-header">
                <h1>${formData.title}</h1>
                <div class="article-meta">
                    <span class="category">${this.getCategoryName(formData.category)}</span>
                    <span class="date">${new Date().toLocaleDateString('ar-SA')}</span>
                    <span class="read-time">${Math.ceil(formData.contentText.split(' ').length / 200)} دقيقة قراءة</span>
                </div>
                ${formData.image ? `<img src="${URL.createObjectURL(formData.image)}" alt="${formData.title}" style="width: 100%; border-radius: 8px; margin: 1rem 0;">` : ''}
                <p class="excerpt">${formData.excerpt}</p>
            </div>
            <div class="article-content">
                ${this.editor.root.innerHTML}
            </div>
        `;

        previewContent.innerHTML = previewHTML;
        modal.classList.add('active');
    }

    hidePreview() {
        const modal = document.getElementById('preview-modal');
        modal.classList.remove('active');
    }

    getCategoryName(categoryValue) {
        const categories = {
            'entrepreneurship': 'ريادة الأعمال',
            'ecommerce': 'التجارة الإلكترونية',
            'marketing': 'التسويق الرقمي',
            'freelancing': 'العمل الحر',
            'investment': 'الاستثمار الرقمي',
            'technology': 'التكنولوجيا',
            'business': 'الأعمال'
        };
        return categories[categoryValue] || categoryValue;
    }

    showImportDialog() {
        // Create import dialog
        const dialog = document.createElement('div');
        dialog.className = 'modal active';
        dialog.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">استيراد محتوى</h3>
                    <button type="button" class="modal-close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">اختر طريقة الاستيراد:</label>
                        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                            <button type="button" class="admin-btn admin-btn-outline" onclick="document.getElementById('import-file').click()">
                                <i class="fas fa-file-upload"></i>
                                استيراد من ملف
                            </button>
                            <button type="button" class="admin-btn admin-btn-outline" onclick="this.closest('.modal').remove(); addArticleManager.showUrlImportDialog()">
                                <i class="fas fa-link"></i>
                                استيراد من رابط
                            </button>
                        </div>
                        <input type="file" id="import-file" accept=".txt,.md,.html" style="display: none;" onchange="addArticleManager.handleFileImport(this)">
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
    }

    handleFileImport(input) {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            this.editor.setText(content);
            this.updateStats();
            this.showToast('تم استيراد المحتوى بنجاح', 'success');
            input.closest('.modal').remove();
        };
        reader.readAsText(file);
    }

    async loadRecentArticles() {
        try {
            // Load from localStorage for demo
            const articles = JSON.parse(localStorage.getItem('articles') || '[]');
            const recentArticles = articles
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 5);

            const container = document.getElementById('recent-articles-sidebar');
            
            if (recentArticles.length === 0) {
                container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">لا توجد مقالات حديثة</p>';
                return;
            }

            container.innerHTML = recentArticles.map(article => `
                <div class="recent-article-item" onclick="window.open('index.html#articles', '_blank')">
                    <div class="recent-article-title">${article.title}</div>
                    <div class="recent-article-meta">
                        ${this.getCategoryName(article.category)} • ${new Date(article.updatedAt).toLocaleDateString('ar-SA')}
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Error loading recent articles:', error);
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    logout() {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            // Clear any saved data
            localStorage.removeItem('adminToken');
            // Redirect to login
            window.location.href = 'login.html';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.addArticleManager = new AddArticleManager();
});

// Handle page unload
window.addEventListener('beforeunload', (e) => {
    const title = document.getElementById('article-title').value;
    const content = window.addArticleManager?.editor?.getText() || '';
    
    if ((title.trim() || content.trim()) && !window.addArticleManager?.isDraft) {
        e.preventDefault();
        e.returnValue = 'لديك تغييرات غير محفوظة. هل أنت متأكد من المغادرة؟';
    }
});

