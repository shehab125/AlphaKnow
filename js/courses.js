// Courses Page JavaScript
class CoursesManager {
  constructor() {
    this.currentCategory = 'all';
    this.courses = [];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadCourses();
    this.setupFilters();
  }

  setupEventListeners() {
    // Category filters
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const category = card.dataset.category;
        this.filterCourses(category);
        this.updateActiveCategory(card);
      });
    });

    // Course enrollment buttons
    const enrollButtons = document.querySelectorAll('.course-enroll');
    enrollButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleEnrollment(button);
      });
    });

    // Load more button
    const loadMoreBtn = document.querySelector('.load-more');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        this.loadMoreCourses();
      });
    }

    // Learning path buttons
    const pathButtons = document.querySelectorAll('.path-card .btn-primary');
    pathButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handlePathEnrollment(button);
      });
    });

    // CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-actions .btn');
    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        if (button.textContent.includes('تصفح')) {
          this.scrollToCoursesSection();
        } else {
          this.openConsultationModal();
        }
      });
    });
  }

  loadCourses() {
    // Simulate loading courses data
    this.courses = [
      {
        id: 1,
        title: 'دورة ريادة الأعمال الشاملة',
        category: 'entrepreneurship',
        level: 'متوسط',
        rating: 4.9,
        students: 2500,
        price: 199,
        originalPrice: 299,
        instructor: 'أحمد محمد',
        featured: true
      },
      {
        id: 2,
        title: 'إنشاء متجر إلكتروني احترافي',
        category: 'ecommerce',
        level: 'مبتدئ',
        rating: 4.8,
        students: 1800,
        price: 149,
        originalPrice: 199,
        instructor: 'فاطمة أحمد',
        featured: true
      },
      {
        id: 3,
        title: 'إتقان التسويق الرقمي',
        category: 'marketing',
        level: 'متقدم',
        rating: 4.9,
        students: 3200,
        price: 249,
        originalPrice: 349,
        instructor: 'محمد علي',
        featured: true
      },
      {
        id: 4,
        title: 'بناء مهنة ناجحة في العمل الحر',
        category: 'freelancing',
        level: 'مبتدئ',
        rating: 4.7,
        students: 1200,
        price: 99,
        originalPrice: 149,
        instructor: 'سارة محمود',
        featured: true
      }
    ];

    this.updateCourseStats();
  }

  updateCourseStats() {
    // Update category counts
    const categoryCounts = {
      all: this.courses.length,
      entrepreneurship: this.courses.filter(c => c.category === 'entrepreneurship').length * 2,
      ecommerce: this.courses.filter(c => c.category === 'ecommerce').length * 1.5,
      marketing: this.courses.filter(c => c.category === 'marketing').length * 1.8,
      freelancing: this.courses.filter(c => c.category === 'freelancing').length * 1.2
    };

    Object.keys(categoryCounts).forEach(category => {
      const categoryCard = document.querySelector(`[data-category="${category}"]`);
      if (categoryCard) {
        const countElement = categoryCard.querySelector('.category-count');
        if (countElement) {
          const count = Math.ceil(categoryCounts[category]);
          countElement.textContent = category === 'all' ? `${count * 5} دورة` : `${count} دورات`;
        }
      }
    });
  }

  filterCourses(category) {
    this.currentCategory = category;
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
      const courseCategory = card.dataset.category;
      if (category === 'all' || courseCategory === category) {
        card.style.display = 'block';
        card.classList.add('fade-in');
      } else {
        card.style.display = 'none';
        card.classList.remove('fade-in');
      }
    });

    // Update visible courses count
    this.updateVisibleCoursesCount();
  }

  updateActiveCategory(activeCard) {
    // Remove active class from all category cards
    document.querySelectorAll('.category-card').forEach(card => {
      card.classList.remove('active');
    });
    
    // Add active class to clicked card
    activeCard.classList.add('active');
  }

  updateVisibleCoursesCount() {
    const visibleCourses = document.querySelectorAll('.course-card[style*="block"], .course-card:not([style*="none"])');
    const countText = visibleCourses.length === 1 ? 'دورة واحدة' : `${visibleCourses.length} دورات`;
    
    // Update section description if needed
    const sectionDesc = document.querySelector('.featured-courses .section-description');
    if (sectionDesc && this.currentCategory !== 'all') {
      sectionDesc.textContent = `عرض ${countText} في هذا التخصص`;
    }
  }

  handleEnrollment(button) {
    const courseCard = button.closest('.course-card');
    const courseTitle = courseCard.querySelector('.course-title').textContent;
    
    // Add loading state
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التسجيل...';
    button.disabled = true;
    
    // Simulate enrollment process
    setTimeout(() => {
      this.showEnrollmentSuccess(courseTitle);
      button.innerHTML = 'تم التسجيل ✓';
      button.classList.add('enrolled');
      
      // Track enrollment
      this.trackEnrollment(courseCard);
    }, 2000);
  }

  handlePathEnrollment(button) {
    const pathCard = button.closest('.path-card');
    const pathTitle = pathCard.querySelector('.path-title').textContent;
    
    // Add loading state
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التسجيل...';
    button.disabled = true;
    
    // Simulate enrollment process
    setTimeout(() => {
      this.showPathEnrollmentSuccess(pathTitle);
      button.innerHTML = 'تم التسجيل في المسار ✓';
      button.classList.add('enrolled');
    }, 2000);
  }

  showEnrollmentSuccess(courseTitle) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'enrollment-notification success';
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-check-circle"></i>
        <div class="notification-text">
          <h4>تم التسجيل بنجاح!</h4>
          <p>تم تسجيلك في دورة: ${courseTitle}</p>
          <small>ستصلك رسالة تأكيد على بريدك الإلكتروني</small>
        </div>
        <button class="notification-close">&times;</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.remove();
    });
  }

  showPathEnrollmentSuccess(pathTitle) {
    // Create success notification for learning path
    const notification = document.createElement('div');
    notification.className = 'enrollment-notification success';
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-graduation-cap"></i>
        <div class="notification-text">
          <h4>تم التسجيل في المسار بنجاح!</h4>
          <p>تم تسجيلك في: ${pathTitle}</p>
          <small>يمكنك الآن الوصول لجميع دورات المسار</small>
        </div>
        <button class="notification-close">&times;</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.remove();
    });
  }

  trackEnrollment(courseCard) {
    // Update student count
    const studentsElement = courseCard.querySelector('.feature-item:last-child span');
    if (studentsElement) {
      const currentText = studentsElement.textContent;
      const currentCount = parseInt(currentText.replace(/[^\d]/g, ''));
      const newCount = currentCount + 1;
      studentsElement.textContent = `${newCount.toLocaleString()}+ طالب`;
    }
  }

  loadMoreCourses() {
    const loadMoreBtn = document.querySelector('.load-more');
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
    
    // Simulate loading more courses
    setTimeout(() => {
      this.addMoreCourses();
      loadMoreBtn.innerHTML = 'عرض المزيد من الدورات';
    }, 1500);
  }

  addMoreCourses() {
    // This would typically load more courses from an API
    // For now, we'll just show a message
    const coursesGrid = document.querySelector('.courses-grid');
    const message = document.createElement('div');
    message.className = 'load-more-message';
    message.innerHTML = `
      <div class="message-content">
        <i class="fas fa-info-circle"></i>
        <p>المزيد من الدورات قادمة قريباً!</p>
        <small>اشترك في النشرة الإخبارية لتكون أول من يعلم</small>
      </div>
    `;
    
    coursesGrid.appendChild(message);
    
    // Hide load more button
    document.querySelector('.load-more').style.display = 'none';
  }

  setupFilters() {
    // Add search functionality if search input exists
    const searchInput = document.querySelector('.course-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchCourses(e.target.value);
      });
    }
  }

  searchCourses(query) {
    const courseCards = document.querySelectorAll('.course-card');
    const searchTerm = query.toLowerCase().trim();
    
    courseCards.forEach(card => {
      const title = card.querySelector('.course-title').textContent.toLowerCase();
      const description = card.querySelector('.course-description').textContent.toLowerCase();
      const instructor = card.querySelector('.instructor-name').textContent.toLowerCase();
      
      const matches = title.includes(searchTerm) || 
                     description.includes(searchTerm) || 
                     instructor.includes(searchTerm);
      
      if (matches || searchTerm === '') {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  scrollToCoursesSection() {
    const coursesSection = document.querySelector('.featured-courses');
    if (coursesSection) {
      coursesSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  openConsultationModal() {
    // Create consultation modal
    const modal = document.createElement('div');
    modal.className = 'consultation-modal';
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>احجز استشارة مجانية</h3>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <p>تحدث مع أحد مستشارينا التعليميين لاختيار المسار المناسب لك</p>
            <form class="consultation-form">
              <div class="form-group">
                <label>الاسم الكامل</label>
                <input type="text" required>
              </div>
              <div class="form-group">
                <label>البريد الإلكتروني</label>
                <input type="email" required>
              </div>
              <div class="form-group">
                <label>رقم الهاتف</label>
                <input type="tel" required>
              </div>
              <div class="form-group">
                <label>المجال المهتم به</label>
                <select required>
                  <option value="">اختر المجال</option>
                  <option value="entrepreneurship">ريادة الأعمال</option>
                  <option value="ecommerce">التجارة الإلكترونية</option>
                  <option value="marketing">التسويق الرقمي</option>
                  <option value="freelancing">العمل الحر</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">احجز الاستشارة</button>
            </form>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Modal event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
      if (e.target === modal.querySelector('.modal-overlay')) {
        modal.remove();
      }
    });
    
    modal.querySelector('.consultation-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleConsultationSubmission(modal);
    });
  }

  handleConsultationSubmission(modal) {
    const submitBtn = modal.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
      modal.innerHTML = `
        <div class="modal-overlay">
          <div class="modal-content success">
            <div class="modal-header">
              <h3>تم الحجز بنجاح!</h3>
              <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
              <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <h4>شكراً لك!</h4>
                <p>تم حجز استشارتك بنجاح. سيتواصل معك أحد مستشارينا خلال 24 ساعة</p>
                <button class="btn btn-primary" onclick="this.closest('.consultation-modal').remove()">حسناً</button>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Re-add close functionality
      modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
      });
    }, 2000);
  }
}

// Initialize courses manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CoursesManager();
});

// Add CSS for notifications and modals
const style = document.createElement('style');
style.textContent = `
  .enrollment-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    z-index: 10000;
    max-width: 400px;
    animation: slideInRight 0.3s ease;
  }
  
  .enrollment-notification.success {
    border-left: 4px solid #10b981;
  }
  
  .notification-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
  }
  
  .notification-content i {
    color: #10b981;
    font-size: 24px;
    margin-top: 4px;
  }
  
  .notification-text h4 {
    margin: 0 0 4px 0;
    color: #1f2937;
    font-size: 16px;
  }
  
  .notification-text p {
    margin: 0 0 4px 0;
    color: #6b7280;
    font-size: 14px;
  }
  
  .notification-text small {
    color: #9ca3af;
    font-size: 12px;
  }
  
  .notification-close {
    background: none;
    border: none;
    font-size: 20px;
    color: #9ca3af;
    cursor: pointer;
    margin-right: auto;
  }
  
  .consultation-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
  }
  
  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  
  .modal-content {
    background: white;
    border-radius: 12px;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .modal-header h3 {
    margin: 0;
    color: #1f2937;
  }
  
  .modal-close {
    background: none;
    border: none;
    font-size: 24px;
    color: #9ca3af;
    cursor: pointer;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .consultation-form .form-group {
    margin-bottom: 16px;
  }
  
  .consultation-form label {
    display: block;
    margin-bottom: 4px;
    color: #374151;
    font-weight: 500;
  }
  
  .consultation-form input,
  .consultation-form select {
    width: 100%;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
  }
  
  .consultation-form input:focus,
  .consultation-form select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .success-message {
    text-align: center;
    padding: 20px;
  }
  
  .success-message i {
    font-size: 48px;
    color: #10b981;
    margin-bottom: 16px;
  }
  
  .success-message h4 {
    margin: 0 0 8px 0;
    color: #1f2937;
  }
  
  .success-message p {
    margin: 0 0 20px 0;
    color: #6b7280;
  }
  
  .load-more-message {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px 20px;
    background: #f9fafb;
    border-radius: 12px;
    margin-top: 20px;
  }
  
  .message-content i {
    font-size: 32px;
    color: #6b7280;
    margin-bottom: 12px;
  }
  
  .message-content p {
    margin: 0 0 4px 0;
    color: #374151;
    font-size: 16px;
    font-weight: 500;
  }
  
  .message-content small {
    color: #6b7280;
    font-size: 14px;
  }
  
  .course-card.fade-in {
    animation: fadeIn 0.3s ease;
  }
  
  .btn.enrolled {
    background-color: #10b981 !important;
    border-color: #10b981 !important;
    pointer-events: none;
  }
  
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

document.head.appendChild(style);

