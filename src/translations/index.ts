
import { Language } from '@/types/language';

// Dictionary for translations
export const translations: Record<Language, Record<string, string>> = {
  en: {
    // General
    'app.title': 'Automation Platform',
    'app.settings': 'Settings',
    'app.save': 'Save Settings',
    'app.saved': 'Settings saved',
    
    // Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.workflows': 'Workflows',
    'sidebar.canvas': 'Canvas',
    'sidebar.settings': 'Settings',
    'sidebar.servers': 'Servers',
    'sidebar.botLaunch': 'Bot Launch',
    'sidebar.aiAgents': 'AI Agents',
    'sidebar.tables': 'Tables',
    'sidebar.profile': 'Profile',
    'sidebar.files': 'Files',
    'sidebar.signOut': 'Sign Out',
    
    // Settings page
    'settings.title': 'Settings',
    'settings.general': 'General',
    'settings.browser': 'Browser',
    'settings.messengers': 'Messengers',
    'settings.other': 'Other',
    'settings.language': 'Interface Language',
    'settings.theme': 'Theme',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.theme.system': 'System',
    'settings.accentColor': 'Accent Color',
    
    // Browser settings
    'settings.browser.port': 'LinkeSphere Port',
    'settings.browser.debugPorts': 'Chrome Debug Ports',
    
    // Messengers settings
    'settings.messengers.telegramToken': 'Telegram Bot Token',
    'settings.messengers.slackToken': 'Slack API Token',
    
    // Other settings
    'settings.other.captchaToken': 'Captcha Token',
    
    // Tables
    'tables.newTable': 'New Table',
    'tables.addTable': 'Add Table',
    'tables.searchPlaceholder': 'Search tables by name, columns, or dates...',
    
    // Tasks
    'tasks.filterByStatus': 'Filter by Status',
    'tasks.allStatuses': 'All Statuses',
    'tasks.status.pending': 'Pending',
    'tasks.status.inProcess': 'In Process',
    'tasks.status.done': 'Completed',
    'tasks.status.error': 'Error',
    
    // Flow
    'flow.searchNodes': 'Search nodes...',
    
    // Servers
    'servers.selectServers': 'Select Servers',
    
    // Workflow
    'workflow.save': 'Save Workflow',
    'workflow.edit': 'Edit Workflow',
    'workflow.update': 'Update',
    'workflow.form.name': 'Name',
    'workflow.form.namePlaceholder': 'Enter workflow name',
    'workflow.form.description': 'Description',
    'workflow.form.descriptionPlaceholder': 'Enter workflow description',
    'workflow.form.category': 'Category',
    'workflow.form.selectCategory': 'Select category',
    'workflow.form.tags': 'Tags',
    'workflow.form.tagsPlaceholder': 'Type and press Enter to add tags',
    
    // Workflow Execution
    'workflow.execution.title': 'Workflow Execution',
    'workflow.execution.started': '=== Workflow Execution Started ===',
    'workflow.execution.server': 'Server',
    'workflow.execution.browser': 'Browser',
    'workflow.execution.session': 'Session',
    'workflow.execution.debugPort': 'Debug Port',
    'workflow.execution.port': 'Port',
    'workflow.execution.notSelected': 'Not selected',
    'workflow.execution.initializing': '=== Initializing... ===',
    
    // Workflow Status
    'workflow.status.preparing': 'Preparing',
    'workflow.status.running': 'Running',
    'workflow.status.completed': 'Completed',
    'workflow.status.error': 'Error',
    
    // Favorites
    'favorites.title': 'Favorites',
    'workflow.plural': 'Workflows',
    'workflow.create': 'Create New',
    'workflow.noFavorites': 'You have no favorite workflows yet',
    'workflow.goToList': 'Go to Workflows',
    'agents.plural': 'Agents',
    'agents.create': 'Create Agent',
    'agents.noAgents': 'No agents found',
    'agents.noFavorites': 'You have no favorite agents yet',
    'agents.goToList': 'Go to Agents',
    'agents.searchPlaceholder': 'Search agents by name, status, or dates...',
  },
  ru: {
    // General
    'app.title': 'Платформа Автоматизации',
    'app.settings': 'Настройки',
    'app.save': 'Сохранить настройки',
    'app.saved': 'Настройки сохранены',
    
    // Sidebar
    'sidebar.dashboard': 'Панель управления',
    'sidebar.workflows': 'Рабочие процессы',
    'sidebar.canvas': 'Холст',
    'sidebar.settings': 'Настройки',
    'sidebar.servers': 'Серверы',
    'sidebar.botLaunch': 'Запуск ботов',
    'sidebar.aiAgents': 'ИИ Агенты',
    'sidebar.tables': 'Таблицы',
    'sidebar.profile': 'Профиль',
    'sidebar.files': 'Файлы',
    'sidebar.signOut': 'Выйти',
    
    // Settings page
    'settings.title': 'Настройки',
    'settings.general': 'Общие',
    'settings.browser': 'Браузер',
    'settings.messengers': 'Мессенджеры',
    'settings.other': 'Другое',
    'settings.language': 'Язык интерфейса',
    'settings.theme': 'Тема',
    'settings.theme.light': 'Светлая',
    'settings.theme.dark': 'Темная',
    'settings.theme.system': 'Системная',
    'settings.accentColor': 'Цвет акцента',
    
    // Browser settings
    'settings.browser.port': 'Порт LinkeSphere',
    'settings.browser.debugPorts': 'Порты отладки Chrome',
    
    // Messengers settings
    'settings.messengers.telegramToken': 'Токен Telegram бота',
    'settings.messengers.slackToken': 'Токен Slack API',
    
    // Other settings
    'settings.other.captchaToken': 'Токен Captcha',
    
    // Tables
    'tables.newTable': 'Новая Таблица',
    'tables.addTable': 'Добавить Таблицу',
    'tables.searchPlaceholder': 'Поиск таблиц по имени, столбцам или датам...',
    
    // Tasks
    'tasks.filterByStatus': 'Фильтр по статусу',
    'tasks.allStatuses': 'Все статусы',
    'tasks.status.pending': 'Ожидает',
    'tasks.status.inProcess': 'В процессе',
    'tasks.status.done': 'Выполнено',
    'tasks.status.error': 'Ошибка',
    
    // Flow
    'flow.searchNodes': 'Поиск узлов...',
    
    // Servers
    'servers.selectServers': 'Выбрать серверы',
    
    // Workflow
    'workflow.save': 'Сохранить рабочий процесс',
    'workflow.edit': 'Редактировать рабочий процесс',
    'workflow.update': 'Обновить',
    'workflow.form.name': 'Название',
    'workflow.form.namePlaceholder': 'Введите название рабочего процесса',
    'workflow.form.description': 'Описание',
    'workflow.form.descriptionPlaceholder': 'Введите описание рабочего процесса',
    'workflow.form.category': 'Категория',
    'workflow.form.selectCategory': 'Выберите категорию',
    'workflow.form.tags': 'Теги',
    'workflow.form.tagsPlaceholder': 'Введите текст и нажмите Enter для добавления тегов',
    
    // Workflow Execution
    'workflow.execution.title': 'Выполнение рабочего процесса',
    'workflow.execution.started': '=== Выполнение рабочего процесса начато ===',
    'workflow.execution.server': 'Сервер',
    'workflow.execution.browser': 'Браузер',
    'workflow.execution.session': 'Сессия',
    'workflow.execution.debugPort': 'Порт отладки',
    'workflow.execution.port': 'Порт',
    'workflow.execution.notSelected': 'Не выбрано',
    'workflow.execution.initializing': '=== Инициализация... ===',
    
    // Workflow Status
    'workflow.status.preparing': 'Подготовка',
    'workflow.status.running': 'Выполнение',
    'workflow.status.completed': 'Завершено',
    'workflow.status.error': 'Ошибка',
    
    // Favorites
    'favorites.title': 'Избранное',
    'workflow.plural': 'Воркфлоу',
    'workflow.create': 'Создать новый',
    'workflow.noFavorites': 'У вас пока нет избранных воркфлоу',
    'workflow.goToList': 'Перейти к списку воркфлоу',
    'agents.plural': 'Агенты',
    'agents.create': 'Создать агент',
    'agents.noAgents': 'Агенты не найдены',
    'agents.noFavorites': 'У вас пока нет избранных агентов',
    'agents.goToList': 'Перейти к агентам',
    'agents.searchPlaceholder': 'Поиск агентов по имени, статусу или датам...',
  }
};
