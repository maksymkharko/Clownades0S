// Импорт утилит для работы с localStorage
const { storage } = window.apps;

// Функции для работы с настройками
const settings = {
    // Экспорт данных
    exportData: () => {
        const data = {
            apps: storage.get('apps'),
            hiddenApps: storage.get('hiddenApps'),
            settings: storage.get('settings')
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'clownades0s-backup.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Импорт данных
    importData: (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.apps) storage.set('apps', data.apps);
                if (data.hiddenApps) storage.set('hiddenApps', data.hiddenApps);
                if (data.settings) storage.set('settings', data.settings);
                
                // Перезагрузка страницы для применения изменений
                window.location.reload();
            } catch (error) {
                console.error('Error importing data:', error);
                alert('Ошибка при импорте данных. Проверьте формат файла.');
            }
        };
        reader.readAsText(file);
    },

    // Сброс всех данных
    resetAllData: () => {
        if (confirm('Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.')) {
            localStorage.clear();
            window.location.reload();
        }
    },

    // Сброс домашнего экрана
    resetHomeScreen: () => {
        if (confirm('Вы уверены, что хотите вернуть домашний экран к заводским настройкам?')) {
            storage.remove('apps');
            storage.remove('hiddenApps');
            window.location.reload();
        }
    }
};

// Инициализация страницы настроек
function initSettings() {
    // Настройка обработчиков событий
    const exportButton = document.querySelector('[onclick="exportData()"]');
    const importButton = document.querySelector('[onclick="document.getElementById(\'importFile\').click()"]');
    const importFile = document.getElementById('importFile');
    const resetButton = document.querySelector('[onclick="resetAllData()"]');
    const resetHomeButton = document.querySelector('[onclick="resetHomeScreen()"]');

    if (exportButton) {
        exportButton.onclick = settings.exportData;
    }

    if (importButton && importFile) {
        importFile.onchange = (e) => {
            if (e.target.files.length > 0) {
                settings.importData(e.target.files[0]);
            }
        };
    }

    if (resetButton) {
        resetButton.onclick = settings.resetAllData;
    }

    if (resetHomeButton) {
        resetHomeButton.onclick = settings.resetHomeScreen;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initSettings); 