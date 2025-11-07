// Функция для получения случайных изображений из папки
function getRandomImages(count) {
    const images = [];
    // Генерируем случайные пути к изображениям из вашей папки
    for (let i = 0; i < count; i++) {
        // Случайный номер от 1 до 12 (по количеству ваших изображений)
        const randomNum = Math.floor(Math.random() * 12) + 1;
        images.push(`images/random-works/${randomNum}.jpg`);
    }
    return images;
}

// Функция для перемешивания массива
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Функция для создания галереи
function createGallery() {
    const topTrack = document.getElementById('top-track');
    const bottomTrack = document.getElementById('bottom-track');
    
    // Получаем случайные изображения (12 для каждого ряда)
    const topImages = getRandomImages(12);
    const bottomImages = getRandomImages(12);
    
    // Перемешиваем массивы изображений
    const shuffledTopImages = shuffleArray([...topImages]);
    const shuffledBottomImages = shuffleArray([...bottomImages]);
    
    // Создаем элементы для верхнего ряда
    shuffledTopImages.forEach(url => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `<img src="${url}" alt="Работа мастера" onerror="this.src='https://images.unsplash.com/photo-1594736797933-d0ea3ff8db41?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'">`;
        topTrack.appendChild(galleryItem);
    });
    
    // Создаем элементы для нижнего ряда
    shuffledBottomImages.forEach(url => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `<img src="${url}" alt="Работа мастера" onerror="this.src='https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=715&q=80'">`;
        bottomTrack.appendChild(galleryItem);
    });
    
    // Дублируем элементы для бесконечной анимации
    topTrack.innerHTML += topTrack.innerHTML;
    bottomTrack.innerHTML += bottomTrack.innerHTML;
}

// Инициализация галереи при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    createGallery();
    
    // Мобильное меню
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Закрытие меню при клике на ссылку
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Анимация при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдаем за карточками
    document.querySelectorAll('.master-card, .workshop-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Кнопка "Наверх"
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});