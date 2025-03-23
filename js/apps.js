// Константы
const STORAGE_PREFIX = 'Cos';
const DEFAULT_APPS = [
    { id: 1, name: 'Главная', icon: 'fas fa-home', url: 'Glawnaja.html' },
    { id: 2, name: 'Меню', icon: 'fas fa-th-large', url: 'index.html' },
    { id: 3, name: 'Настройки', icon: 'fas fa-cog', url: 'settings.html' },
    { id: 4, name: 'Приложение 1', icon: 'fas fa-apple-alt', url: 'app1.html' },
    { id: 5, name: 'Приложение 2', icon: 'fas fa-bell', url: 'app2.html' },
    { id: 6, name: 'Приложение 3', icon: 'fas fa-calendar', url: 'app3.html' },
    { id: 7, name: 'Приложение 4', icon: 'fas fa-camera', url: 'app4.html' },
    { id: 8, name: 'Приложение 5', icon: 'fas fa-chart-bar', url: 'app5.html' },
    { id: 9, name: 'Приложение 6', icon: 'fas fa-clock', url: 'app6.html' },
    { id: 10, name: 'Приложение 7', icon: 'fas fa-comment', url: 'app7.html' },
    { id: 11, name: 'Приложение 8', icon: 'fas fa-envelope', url: 'app8.html' },
    { id: 12, name: 'Приложение 9', icon: 'fas fa-file', url: 'app9.html' },
    { id: 13, name: 'Приложение 10', icon: 'fas fa-folder', url: 'app10.html' },
    { id: 14, name: 'Приложение 11', icon: 'fas fa-gamepad', url: 'app11.html' },
    { id: 15, name: 'Приложение 12', icon: 'fas fa-heart', url: 'app12.html' },
    { id: 16, name: 'Приложение 13', icon: 'fas fa-image', url: 'app13.html' },
    { id: 17, name: 'Приложение 14', icon: 'fas fa-key', url: 'app14.html' },
    { id: 18, name: 'Приложение 15', icon: 'fas fa-link', url: 'app15.html' },
    { id: 19, name: 'Приложение 16', icon: 'fas fa-map', url: 'app16.html' },
    { id: 20, name: 'Приложение 17', icon: 'fas fa-music', url: 'app17.html' }
];

// Состояние приложения
let state = {
    apps: [],
    hiddenApps: [],
    isEditMode: false,
    currentPage: window.location.pathname.split('/').pop() || 'index.html'
};

// Утилиты для работы с localStorage
const storage = {
    get: (key) => {
        const value = localStorage.getItem(STORAGE_PREFIX + key);
        return value ? JSON.parse(value) : null;
    },
    set: (key, value) => {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    },
    remove: (key) => {
        localStorage.removeItem(STORAGE_PREFIX + key);
    }
};

// Инициализация приложения
function initApp() {
    // Загрузка данных из localStorage
    state.apps = storage.get('apps') || DEFAULT_APPS;
    state.hiddenApps = storage.get('hiddenApps') || [];
    
    // Инициализация UI
    updateUI();
    setupEventListeners();
}

// Обновление UI
function updateUI() {
    const appsGrid = document.querySelector('.apps-grid');
    if (!appsGrid) return;

    // Очистка сетки
    appsGrid.innerHTML = '';

    // Фильтрация приложений в зависимости от страницы
    const visibleApps = state.currentPage === 'settings.html' 
        ? state.hiddenApps 
        : state.apps.filter(app => !state.hiddenApps.some(hidden => hidden.id === app.id));

    // Отрисовка приложений
    visibleApps.forEach(app => {
        const appElement = createAppElement(app);
        appsGrid.appendChild(appElement);
    });

    // Обновление состояния кнопки редактирования
    const editButton = document.querySelector('.edit-button');
    if (editButton) {
        editButton.classList.toggle('active', state.isEditMode);
    }
}

// Создание элемента приложения
function createAppElement(app) {
    const appElement = document.createElement('a');
    appElement.href = app.url;
    appElement.className = 'app-item';
    appElement.innerHTML = `
        <div class="app-icon">
            <i class="${app.icon}"></i>
        </div>
        <div class="app-name">${app.name}</div>
        <button class="delete-button" data-id="${app.id}">
            <i class="fas fa-times"></i>
        </button>
        <button class="edit-button" data-id="${app.id}">
            <i class="fas fa-pencil-alt"></i>
        </button>
    `;

    // Обработчики событий для кнопок
    const deleteButton = appElement.querySelector('.delete-button');
    const editButton = appElement.querySelector('.edit-button');

    deleteButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteApp(app.id);
    });

    editButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showEditModal(app);
    });

    return appElement;
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Переключение режима редактирования
    const editButton = document.querySelector('.edit-button');
    if (editButton) {
        editButton.addEventListener('click', toggleEditMode);
    }

    // Обработка добавления нового приложения
    const addButton = document.querySelector('.add-button');
    if (addButton) {
        addButton.addEventListener('click', showAddModal);
    }

    // Обработка модальных окон
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => closeModal(modal));
        }
    });
}

// Управление приложениями
function addApp(app) {
    const newApp = {
        ...app,
        id: Date.now()
    };
    state.apps.push(newApp);
    storage.set('apps', state.apps);
    updateUI();
}

function deleteApp(id) {
    if (state.currentPage === 'settings.html') {
        // Удаление из скрытых приложений
        state.hiddenApps = state.hiddenApps.filter(app => app.id !== id);
        storage.set('hiddenApps', state.hiddenApps);
    } else {
        // Перемещение в скрытые приложения
        const app = state.apps.find(app => app.id === id);
        if (app) {
            state.hiddenApps.push(app);
            storage.set('hiddenApps', state.hiddenApps);
        }
    }
    updateUI();
}

function updateApp(id, updates) {
    const appIndex = state.apps.findIndex(app => app.id === id);
    if (appIndex !== -1) {
        state.apps[appIndex] = { ...state.apps[appIndex], ...updates };
        storage.set('apps', state.apps);
        updateUI();
    }
}

// Управление режимом редактирования
function toggleEditMode() {
    state.isEditMode = !state.isEditMode;
    document.body.classList.toggle('edit-mode', state.isEditMode);
    updateUI();
}

// Управление модальными окнами
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modal) {
    modal.classList.remove('active');
}

function showEditModal(app) {
    const modal = document.getElementById('editModal');
    if (!modal) return;

    const form = modal.querySelector('form');
    form.querySelector('[name="name"]').value = app.name;
    form.querySelector('[name="icon"]').value = app.icon;
    form.querySelector('[name="url"]').value = app.url;

    form.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        updateApp(app.id, {
            name: formData.get('name'),
            icon: formData.get('icon'),
            url: formData.get('url')
        });
        closeModal(modal);
    };

    showModal('editModal');
}

function showAddModal() {
    const modal = document.getElementById('addModal');
    if (!modal) return;

    const form = modal.querySelector('form');
    form.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        addApp({
            name: formData.get('name'),
            icon: formData.get('icon'),
            url: formData.get('url')
        });
        closeModal(modal);
    };

    showModal('addModal');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initApp); 