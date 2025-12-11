// Функция для получения случайных изображений из папки images/random-works
function getRandomImages(count) {
    const images = [];
    for (let i = 0; i < count; i++) {
        const randomNum = Math.floor(Math.random() * 75) + 1;
        images.push(`images/${randomNum}.jpg`);
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

// Функция обработки ошибок загрузки изображений
function handleImageError(imgElement, imageNumber) {
    console.warn(`Image ${imageNumber}.jpg failed to load, using fallback`);
    
    const fallbackImages = [
        'https://images.unsplash.com/photo-1594736797933-d0ea3ff8db41?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=715&q=80'
    ];
    
    const randomFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    imgElement.src = randomFallback;
    imgElement.alt = "Изображение работы (запасной вариант)";
}

// Функция для создания галереи
function createGallery() {
    const topTrack = document.getElementById('top-track');
    const bottomTrack = document.getElementById('bottom-track');
    
    if (!topTrack || !bottomTrack) {
        console.error('Gallery tracks not found!');
        return;
    }
    
    topTrack.innerHTML = '';
    bottomTrack.innerHTML = '';
    
    const topImages = getRandomImages(15);
    const bottomImages = getRandomImages(15);
    
    const shuffledTopImages = shuffleArray([...topImages]);
    const shuffledBottomImages = shuffleArray([...bottomImages]);
    
    shuffledTopImages.forEach((url, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `<img src="${url}" alt="Работа мастера ${index + 1}" loading="lazy" onerror="handleImageError(this, ${index + 1})">`;
        topTrack.appendChild(galleryItem);
    });
    
    shuffledBottomImages.forEach((url, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `<img src="${url}" alt="Работа мастера ${index + 16}" loading="lazy" onerror="handleImageError(this, ${index + 16})">`;
        bottomTrack.appendChild(galleryItem);
    });
    
    const topContent = topTrack.innerHTML;
    const bottomContent = bottomTrack.innerHTML;
    topTrack.innerHTML = topContent + topContent;
    bottomTrack.innerHTML = bottomContent + bottomContent;
    
    console.log('Gallery created with local images');
}

// ИСПРАВЛЕННЫЙ ПОИСК - ТОЛЬКО ПО ИМЕНИ/ФИО МАСТЕРОВ (не мастер-классы)
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const clearSearchButton = document.getElementById('clearSearch');
    const searchResultsInfo = document.getElementById('searchResultsInfo');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!searchInput || !searchButton) {
        console.error('Search elements not found!');
        return;
    }
    
    // Функция для нормализации текста
    function normalizeText(text) {
        return text.toLowerCase().trim().replace(/\s+/g, ' ');
    }
    
    // Функция для поиска по первым буквам слов в имени
    function searchByName(searchTerm, masterName) {
        const normalizedSearch = normalizeText(searchTerm);
        const normalizedName = normalizeText(masterName);
        
        // Если поиск пустой - показываем все
        if (!normalizedSearch) return true;
        
        // Разбиваем имя на слова
        const nameWords = normalizedName.split(' ');
        
        // Проверяем каждое слово - начинается ли с поискового запроса
        for (let word of nameWords) {
            if (word.startsWith(normalizedSearch)) {
                return true;
            }
        }
        
        // Также проверяем, начинается ли полное имя с поискового запроса
        if (normalizedName.startsWith(normalizedSearch)) {
            return true;
        }
        
        // Проверяем совпадение любого слова целиком (для коротких имен)
        if (nameWords.some(word => word === normalizedSearch)) {
            return true;
        }
        
        return false;
    }
    
    // Функция для поиска ТОЛЬКО среди мастеров
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        
        if (!searchTerm) {
            resetSearch();
            return;
        }
        
        // Получаем ТОЛЬКО карточки мастеров (не мастер-классы)
        const masterCards = document.querySelectorAll('#mastersGrid .master-card');
        
        let foundCount = 0;
        
        // Ищем только в мастерах
        masterCards.forEach(card => {
            const nameElement = card.querySelector('.master-name');
            if (!nameElement) {
                card.style.display = 'none';
                return;
            }
            
            const masterName = nameElement.textContent;
            const isMatch = searchByName(searchTerm, masterName);
            
            if (isMatch) {
                card.style.display = 'block';
                foundCount++;
                
                // Подсветка только в имени
                highlightNameOnly(nameElement, searchTerm);
            } else {
                card.style.display = 'none';
                // Сбрасываем подсветку если не подходит
                removeHighlight(nameElement);
            }
        });
        
        // Мастер-классы всегда показываем (не участвуют в поиске)
        const workshopCards = document.querySelectorAll('#workshopsGrid .workshop-card');
        workshopCards.forEach(card => {
            card.style.display = 'block';
            // Сбрасываем подсветку в мастер-классах на всякий случай
            const nameElement = card.querySelector('.master-name');
            if (nameElement) removeHighlight(nameElement);
        });
        
        // Показываем результаты
        if (searchTerm) {
            if (searchResultsInfo) {
                searchResultsInfo.style.display = 'block';
                resultsCount.textContent = foundCount;
            }
            if (clearSearchButton) clearSearchButton.style.display = 'inline-block';
            
            // Если ничего не найдено среди мастеров
            if (foundCount === 0) {
                showNoResultsMessage(searchTerm);
            } else {
                removeNoResultsMessage();
            }
        } else {
            resetSearch();
        }
    }
    
    // Функция подсветки ТОЛЬКО имени
    function highlightNameOnly(nameElement, searchTerm) {
        if (!nameElement || !searchTerm) return;
        
        const originalText = nameElement.textContent;
        const normalizedSearch = normalizeText(searchTerm);
        const normalizedName = normalizeText(originalText);
        
        // Разбиваем имя на слова
        const nameWords = originalText.split(' ');
        
        // Создаем новый HTML с подсветкой
        let highlightedHTML = '';
        
        for (let i = 0; i < nameWords.length; i++) {
            const word = nameWords[i];
            const normalizedWord = normalizeText(word);
            
            // Проверяем, начинается ли слово с поискового запроса
            if (normalizedWord.startsWith(normalizedSearch)) {
                // Находим начало совпадения в оригинальном слове (с учетом регистра)
                const matchLength = Math.min(searchTerm.length, word.length);
                highlightedHTML += `<span class="highlight">${word.substring(0, matchLength)}</span>${word.substring(matchLength)}`;
            } else {
                highlightedHTML += word;
            }
            
            // Добавляем пробел между словами (кроме последнего)
            if (i < nameWords.length - 1) {
                highlightedHTML += ' ';
            }
        }
        
        nameElement.innerHTML = highlightedHTML;
    }
    
    // Функция сброса подсветки
    function removeHighlight(nameElement) {
        if (nameElement) {
            nameElement.innerHTML = nameElement.textContent;
        }
    }
    
    // Функция показа сообщения "не найдено"
    function showNoResultsMessage(searchTerm) {
        // Удаляем старое сообщение
        removeNoResultsMessage();
        
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <p><i class="fas fa-search" style="margin-right: 10px; color: #ff6b6b;"></i> 
            По запросу "<strong>${searchTerm}</strong>" мастеров не найдено.</p>
            <p style="font-size: 0.9em; color: #777;">Попробуйте ввести первые буквы имени или фамилии.</p>
            <p style="font-size: 0.9em; color: #777;">Например: "Ан" для Анастасии, "Нат" для Натальи, "Авс" для Авсиевич</p>
        `;
        
        const mastersGrid = document.getElementById('mastersGrid');
        if (mastersGrid) {
            mastersGrid.parentNode.insertBefore(noResults, mastersGrid.nextSibling);
        }
    }
    
    // Функция удаления сообщения "не найдено"
    function removeNoResultsMessage() {
        const oldMessage = document.querySelector('.no-results');
        if (oldMessage) oldMessage.remove();
    }
    
    // Функция сброса поиска
    function resetSearch() {
        // Получаем карточки мастеров
        const masterCards = document.querySelectorAll('#mastersGrid .master-card');
        const workshopCards = document.querySelectorAll('#workshopsGrid .workshop-card');
        
        // Показываем все карточки мастеров и сбрасываем подсветку
        masterCards.forEach(card => {
            card.style.display = 'block';
            const nameElement = card.querySelector('.master-name');
            if (nameElement) removeHighlight(nameElement);
        });
        
        // Показываем все мастер-классы
        workshopCards.forEach(card => {
            card.style.display = 'block';
            const nameElement = card.querySelector('.master-name');
            if (nameElement) removeHighlight(nameElement);
        });
        
        searchInput.value = '';
        
        if (searchResultsInfo) searchResultsInfo.style.display = 'none';
        if (clearSearchButton) clearSearchButton.style.display = 'none';
        
        removeNoResultsMessage();
    }
    
    // Обработчики событий
    searchButton.addEventListener('click', performSearch);
    
    // Поиск при нажатии Enter
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
    
    // Автопоиск при вводе (по желанию, можно включить)
    searchInput.addEventListener('input', function() {
        performSearch();
    });
    
    if (clearSearchButton) {
        clearSearchButton.addEventListener('click', resetSearch);
    }
    
    console.log('Search system initialized (masters only, name-only search)');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing...');
    
    // Создаем галерею
    createGallery();
    
    // Инициализируем поиск
    initializeSearch();
    
    // Мобильное меню
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuBtn && navMenu) {
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
    }

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
    
    if (backToTopBtn) {
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
    }
    
    console.log('All systems initialized successfully');
});

