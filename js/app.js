/**
 * TaskMaster Pro - Main Application Logic
 * Modern, responsive, local-first Todo & Kanban management system.
 */

// ==========================================================================
// Initial Sample Data (Pre-populated for instant delight)
// ==========================================================================
const DEFAULT_TASKS = [
  {
    id: 'task-1',
    title: 'Design TaskMaster Pro Dark Theme UI 🎨',
    description: 'Create harmonious slate/indigo color tokens and glassmorphism styling.',
    priority: 'urgent',
    category: 'Work',
    dueDate: new Date(Date.now()).toISOString().split('T')[0],
    completed: true,
    status: 'done',
    createdAt: Date.now() - 86400000 * 2,
    order: 0,
    subtasks: [
      { id: 'sub-1', text: 'Define HSL color variables', completed: true },
      { id: 'sub-2', text: 'Build ambient glow animations', completed: true },
      { id: 'sub-3', text: 'Polish responsive layout', completed: true }
    ]
  },
  {
    id: 'task-2',
    title: 'Review Quarterly Product Roadmap 🚀',
    description: 'Align with engineering and marketing teams on key feature milestones.',
    priority: 'high',
    category: 'Work',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    completed: false,
    status: 'inprogress',
    createdAt: Date.now() - 86400000,
    order: 1,
    subtasks: [
      { id: 'sub-4', text: 'Collect user survey feedback', completed: true },
      { id: 'sub-5', text: 'Draft sprint OKRs', completed: false }
    ]
  },
  {
    id: 'task-3',
    title: 'Morning 5km Run & Core Workout 🏃‍♂️',
    description: 'Track cadence and heart rate using fitness tracker.',
    priority: 'medium',
    category: 'Fitness',
    dueDate: new Date(Date.now()).toISOString().split('T')[0],
    completed: false,
    status: 'todo',
    createdAt: Date.now() - 3600000 * 5,
    order: 2,
    subtasks: [
      { id: 'sub-6', text: 'Warmup stretches (10 mins)', completed: false },
      { id: 'sub-7', text: 'Run 5km route', completed: false }
    ]
  },
  {
    id: 'task-4',
    title: 'Read 2 chapters of "Atomic Habits" 📖',
    description: 'Take notes on habit stacking and environmental cues.',
    priority: 'low',
    category: 'Study',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    completed: false,
    status: 'todo',
    createdAt: Date.now() - 3600000 * 12,
    order: 3,
    subtasks: []
  },
  {
    id: 'task-5',
    title: 'Grocery Restock: Fresh berries, Greek yogurt, Almond milk 🥑',
    description: 'Visit local farmers market around 5 PM.',
    priority: 'medium',
    category: 'Personal',
    dueDate: new Date(Date.now()).toISOString().split('T')[0],
    completed: false,
    status: 'todo',
    createdAt: Date.now() - 3600000 * 2,
    order: 4,
    subtasks: []
  }
];

const DEFAULT_CATEGORIES = [
  { name: 'General', color: '#6366f1', emoji: '🏷️' },
  { name: 'Work', color: '#06b6d4', emoji: '💼' },
  { name: 'Personal', color: '#a855f7', emoji: '🏡' },
  { name: 'Study', color: '#f59e0b', emoji: '📚' },
  { name: 'Fitness', color: '#10b981', emoji: '💪' }
];

// ==========================================================================
// Application State & Audio Synthesizer
// ==========================================================================
class SoundSynth {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
    osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1046.50, now + 0.1); // C6

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.1);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  playAlarm() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [0, 0.2, 0.4].forEach((offset) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now + offset);
      gain.gain.setValueAtTime(0.1, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.15);
    });
  }
}

class AppState {
  constructor() {
    this.tasks = this.load('tasks', DEFAULT_TASKS);
    this.categories = this.load('categories', DEFAULT_CATEGORIES);
    this.activeFilter = 'all';
    this.activeCategory = null;
    this.currentView = this.load('view', 'list');
    this.sortOption = this.load('sort', 'order');
    this.searchQuery = '';
    this.theme = this.load('theme', 'dark');
    this.soundEnabled = this.load('sound', true);
    this.streak = this.load('streak', 3);
  }

  load(key, fallback) {
    try {
      const item = localStorage.getItem(`taskmaster_${key}`);
      return item !== null ? JSON.parse(item) : fallback;
    } catch (e) {
      console.warn(`Could not load ${key} from storage:`, e);
      return fallback;
    }
  }

  save(key, val) {
    try {
      localStorage.setItem(`taskmaster_${key}`, JSON.stringify(val));
    } catch (e) {
      console.warn(`Could not save ${key} to storage:`, e);
    }
  }

  saveTasks() {
    this.save('tasks', this.tasks);
  }

  saveCategories() {
    this.save('categories', this.categories);
  }
}

// ==========================================================================
// Main Application Controller
// ==========================================================================
class TaskMasterApp {
  constructor() {
    this.state = new AppState();
    this.synth = new SoundSynth();
    this.synth.enabled = this.state.soundEnabled;

    // Temporary editing subtasks in modal
    this.tempModalSubtasks = [];

    // Pomodoro Timer State
    this.pomoDuration = 25 * 60;
    this.pomoRemaining = this.pomoDuration;
    this.pomoRunning = false;
    this.pomoInterval = null;

    this.initDOM();
    this.bindEvents();
    this.applyTheme(this.state.theme);
    this.renderCategories();
    this.render();
    this.updateCurrentDateDisplay();
  }

  initDOM() {
    // Elements Cache
    this.sidebar = document.getElementById('sidebar');
    this.sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
    this.pageTitle = document.getElementById('pageTitle');
    this.currentDateStr = document.getElementById('currentDateStr');

    // Stats
    this.completedCount = document.getElementById('completedCount');
    this.totalCount = document.getElementById('totalCount');
    this.progressPercent = document.getElementById('progressPercent');
    this.progressRingBar = document.getElementById('progressRingBar');
    this.streakCount = document.getElementById('streakCount');

    // Nav counters
    this.countAll = document.getElementById('count-all');
    this.countToday = document.getElementById('count-today');
    this.countUpcoming = document.getElementById('count-upcoming');
    this.countImportant = document.getElementById('count-important');
    this.countCompleted = document.getElementById('count-completed');
    this.categoryNavList = document.getElementById('categoryNavList');

    // Quick Add
    this.quickAddForm = document.getElementById('quickAddForm');
    this.quickAddTitle = document.getElementById('quickAddTitle');
    this.quickAddPriority = document.getElementById('quickAddPriority');
    this.quickAddCategory = document.getElementById('quickAddCategory');
    this.quickAddDueDate = document.getElementById('quickAddDueDate');

    // Controls & Search
    this.searchInput = document.getElementById('searchInput');
    this.searchClearBtn = document.getElementById('searchClearBtn');
    this.filterPills = document.getElementById('filterPills');
    this.sortSelect = document.getElementById('sortSelect');
    this.clearCompletedBtn = document.getElementById('clearCompletedBtn');

    // View panes
    this.viewListBtn = document.getElementById('viewListBtn');
    this.viewKanbanBtn = document.getElementById('viewKanbanBtn');
    this.listViewPane = document.getElementById('listViewPane');
    this.kanbanViewPane = document.getElementById('kanbanViewPane');

    // Task Lists
    this.activeTaskList = document.getElementById('activeTaskList');
    this.completedTaskList = document.getElementById('completedTaskList');
    this.activeGroupCount = document.getElementById('activeGroupCount');
    this.completedGroupCount = document.getElementById('completedGroupCount');
    this.completedGroupToggle = document.getElementById('completedGroupToggle');
    this.completedTasksGroup = document.getElementById('completedTasksGroup');
    this.emptyState = document.getElementById('emptyState');

    // Kanban
    this.kanbanTodoList = document.getElementById('kanbanTodoList');
    this.kanbanInProgressList = document.getElementById('kanbanInProgressList');
    this.kanbanDoneList = document.getElementById('kanbanDoneList');
    this.kanbanTodoCount = document.getElementById('kanbanTodoCount');
    this.kanbanInProgressCount = document.getElementById('kanbanInProgressCount');
    this.kanbanDoneCount = document.getElementById('kanbanDoneCount');

    // Modal - Task
    this.taskModalOverlay = document.getElementById('taskModalOverlay');
    this.taskModalHeading = document.getElementById('taskModalHeading');
    this.taskForm = document.getElementById('taskForm');
    this.taskFormId = document.getElementById('taskFormId');
    this.taskFormTitle = document.getElementById('taskFormTitle');
    this.taskFormDesc = document.getElementById('taskFormDesc');
    this.taskFormPriority = document.getElementById('taskFormPriority');
    this.taskFormCategory = document.getElementById('taskFormCategory');
    this.taskFormDueDate = document.getElementById('taskFormDueDate');
    this.modalSubtasksList = document.getElementById('modalSubtasksList');
    this.subtasksCompletedCount = document.getElementById('subtasksCompletedCount');
    this.newSubtaskInput = document.getElementById('newSubtaskInput');
    this.addSubtaskBtn = document.getElementById('addSubtaskBtn');
    this.deleteTaskModalBtn = document.getElementById('deleteTaskModalBtn');
    this.openNewTaskModalBtn = document.getElementById('openNewTaskModalBtn');
    this.closeTaskModalBtn = document.getElementById('closeTaskModalBtn');
    this.cancelTaskModalBtn = document.getElementById('cancelTaskModalBtn');
    this.emptyAddBtn = document.getElementById('emptyAddBtn');

    // Modal - Shortcuts
    this.shortcutsBtn = document.getElementById('shortcutsBtn');
    this.shortcutsModalOverlay = document.getElementById('shortcutsModalOverlay');
    this.closeShortcutsModalBtn = document.getElementById('closeShortcutsModalBtn');

    // Modal - Export
    this.exportBtn = document.getElementById('exportBtn');
    this.exportModalOverlay = document.getElementById('exportModalOverlay');
    this.closeExportModalBtn = document.getElementById('closeExportModalBtn');
    this.exportJsonBtn = document.getElementById('exportJsonBtn');
    this.importJsonInput = document.getElementById('importJsonInput');
    this.exportMdBtn = document.getElementById('exportMdBtn');
    this.resetDemoBtn = document.getElementById('resetDemoBtn');

    // Preferences & Pomo
    this.themeToggleBtn = document.getElementById('themeToggleBtn');
    this.themeLabel = document.getElementById('themeLabel');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.soundIcon = document.getElementById('soundIcon');
    this.pomoTimerDisplay = document.getElementById('pomoTimerDisplay');
    this.pomoToggleBtn = document.getElementById('pomoToggleBtn');
    this.pomoResetBtn = document.getElementById('pomoResetBtn');

    // Set Default Due Date in quick add to Today
    this.quickAddDueDate.value = new Date().toISOString().split('T')[0];
    this.sortSelect.value = this.state.sortOption;
  }

  bindEvents() {
    // Mobile sidebar
    this.mobileMenuBtn.addEventListener('click', () => this.sidebar.classList.add('mobile-open'));
    this.sidebarCloseBtn.addEventListener('click', () => this.sidebar.classList.remove('mobile-open'));

    // Theme Toggle
    this.themeToggleBtn.addEventListener('click', () => {
      const nextTheme = this.state.theme === 'dark' ? 'light' : 'dark';
      this.applyTheme(nextTheme);
      this.synth.playClick();
    });

    // Sound Toggle
    this.soundToggleBtn.addEventListener('click', () => {
      this.state.soundEnabled = !this.state.soundEnabled;
      this.synth.enabled = this.state.soundEnabled;
      this.state.save('sound', this.state.soundEnabled);
      this.updateSoundIcon();
      this.showToast(this.state.soundEnabled ? 'Sound effects enabled 🔔' : 'Sound muted 🔕');
    });
    this.updateSoundIcon();

    // Navigation Filters
    document.querySelectorAll('.sidebar-nav .nav-link').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const filter = e.currentTarget.dataset.filter;
        this.setNavFilter(filter);
        if (window.innerWidth <= 860) this.sidebar.classList.remove('mobile-open');
      });
    });

    // Filter Pills
    this.filterPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (pill) {
        document.querySelectorAll('.filter-pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        this.state.activeFilter = pill.dataset.filter;
        this.render();
      }
    });

    // Sort Change
    this.sortSelect.addEventListener('change', (e) => {
      this.state.sortOption = e.target.value;
      this.state.save('sort', this.state.sortOption);
      this.render();
    });

    // Clear Completed
    this.clearCompletedBtn.addEventListener('click', () => this.clearCompletedTasks());

    // Search Input
    this.searchInput.addEventListener('input', (e) => {
      this.state.searchQuery = e.target.value.trim().toLowerCase();
      this.searchClearBtn.style.display = this.state.searchQuery ? 'block' : 'none';
      this.render();
    });

    this.searchClearBtn.addEventListener('click', () => {
      this.searchInput.value = '';
      this.state.searchQuery = '';
      this.searchClearBtn.style.display = 'none';
      this.render();
    });

    // View Switchers
    this.viewListBtn.addEventListener('click', () => this.setView('list'));
    this.viewKanbanBtn.addEventListener('click', () => this.setView('kanban'));

    // Quick Add Form
    this.quickAddForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = this.quickAddTitle.value.trim();
      if (!title) return;

      this.createTask({
        title,
        priority: this.quickAddPriority.value,
        category: this.quickAddCategory.value,
        dueDate: this.quickAddDueDate.value || null
      });

      this.quickAddTitle.value = '';
      this.quickAddTitle.focus();
      this.synth.playClick();
      this.showToast('Task added successfully! ✨', 'success');
    });

    // Completed Group Collapsible
    this.completedGroupToggle.addEventListener('click', () => {
      this.completedTasksGroup.classList.toggle('collapsed');
    });

    // Modal Events
    this.openNewTaskModalBtn.addEventListener('click', () => this.openTaskModal());
    this.emptyAddBtn.addEventListener('click', () => this.openTaskModal());
    this.closeTaskModalBtn.addEventListener('click', () => this.closeTaskModal());
    this.cancelTaskModalBtn.addEventListener('click', () => this.closeTaskModal());

    this.taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleTaskFormSubmit();
    });

    this.deleteTaskModalBtn.addEventListener('click', () => {
      const id = this.taskFormId.value;
      if (id && confirm('Are you sure you want to delete this task?')) {
        this.deleteTask(id);
        this.closeTaskModal();
      }
    });

    // Subtask adder in modal
    this.addSubtaskBtn.addEventListener('click', () => this.addModalSubtask());
    this.newSubtaskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.addModalSubtask();
      }
    });

    // Shortcuts Modal
    this.shortcutsBtn.addEventListener('click', () => this.shortcutsModalOverlay.classList.add('active'));
    this.closeShortcutsModalBtn.addEventListener('click', () => this.shortcutsModalOverlay.classList.remove('active'));

    // Export Modal
    this.exportBtn.addEventListener('click', () => this.exportModalOverlay.classList.add('active'));
    this.closeExportModalBtn.addEventListener('click', () => this.exportModalOverlay.classList.remove('active'));
    this.exportJsonBtn.addEventListener('click', () => this.exportJSON());
    this.importJsonInput.addEventListener('change', (e) => this.importJSON(e));
    this.exportMdBtn.addEventListener('click', () => this.exportMarkdown());
    this.resetDemoBtn.addEventListener('click', () => {
      if (confirm('Reset all tasks to sample demonstration data?')) {
        this.state.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
        this.state.saveTasks();
        this.render();
        this.exportModalOverlay.classList.remove('active');
        this.showToast('Sample data restored! 🚀', 'success');
      }
    });

    // Close Modals on Overlay Click
    [this.taskModalOverlay, this.shortcutsModalOverlay, this.exportModalOverlay].forEach((overlay) => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
      });
    });

    // Pomodoro Timer
    this.pomoToggleBtn.addEventListener('click', () => this.togglePomodoro());
    this.pomoResetBtn.addEventListener('click', () => this.resetPomodoro());

    // Kanban + Add Button delegation
    document.querySelectorAll('.kanban-add-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const targetStatus = e.currentTarget.dataset.addStatus;
        this.openTaskModal(null, targetStatus);
      });
    });

    // Custom Category Adder
    document.getElementById('addCategoryBtn').addEventListener('click', () => {
      const name = prompt('Enter new category name:');
      if (name && name.trim()) {
        const cleanName = name.trim();
        if (!this.state.categories.some((c) => c.name.toLowerCase() === cleanName.toLowerCase())) {
          this.state.categories.push({
            name: cleanName,
            color: '#a855f7',
            emoji: '🏷️'
          });
          this.state.saveCategories();
          this.renderCategories();
          this.showToast(`Category "${cleanName}" added! 🏷️`, 'success');
        }
      }
    });

    // Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        if (e.key === 'Escape') {
          document.activeElement.blur();
          this.closeAllModals();
        }
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        if (e.shiftKey) {
          e.preventDefault();
          this.openTaskModal();
        } else {
          e.preventDefault();
          this.quickAddTitle.focus();
        }
      } else if (e.key === '/') {
        e.preventDefault();
        this.searchInput.focus();
      } else if (e.key === 'Escape') {
        this.closeAllModals();
      } else if (e.key === '1') {
        this.setView('list');
      } else if (e.key === '2') {
        this.setView('kanban');
      } else if (e.key === '?') {
        this.shortcutsModalOverlay.classList.add('active');
      }
    });

    // Drag & Drop Setup
    this.initDragAndDrop();
  }

  // ==========================================================================
  // Render Engine & Filtering
  // ==========================================================================
  render() {
    this.updateStats();
    this.updateNavCounters();

    const filtered = this.getFilteredTasks();

    if (this.state.currentView === 'list') {
      this.renderListView(filtered);
    } else {
      this.renderKanbanView(filtered);
    }
  }

  getFilteredTasks() {
    let result = [...this.state.tasks];
    const todayStr = new Date().toISOString().split('T')[0];

    // Filter by Nav / Category
    if (this.state.activeCategory) {
      result = result.filter((t) => t.category === this.state.activeCategory);
    } else {
      switch (this.state.activeFilter) {
        case 'today':
          result = result.filter((t) => t.dueDate === todayStr);
          break;
        case 'upcoming':
          result = result.filter((t) => t.dueDate && t.dueDate > todayStr && !t.completed);
          break;
        case 'important':
          result = result.filter((t) => ['high', 'urgent'].includes(t.priority));
          break;
        case 'completed':
          result = result.filter((t) => t.completed);
          break;
        case 'active':
          result = result.filter((t) => !t.completed);
          break;
        case 'urgent':
          result = result.filter((t) => t.priority === 'urgent');
          break;
        case 'high':
          result = result.filter((t) => t.priority === 'high');
          break;
        case 'overdue':
          result = result.filter((t) => t.dueDate && t.dueDate < todayStr && !t.completed);
          break;
        default:
          // 'all'
          break;
      }
    }

    // Search Query
    if (this.state.searchQuery) {
      const q = this.state.searchQuery;
      result = result.filter((t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.subtasks && t.subtasks.some((s) => s.text.toLowerCase().includes(q)))
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (this.state.sortOption) {
        case 'dueDateAsc':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        case 'priorityDesc': {
          const pOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
        }
        case 'createdDesc':
          return (b.createdAt || 0) - (a.createdAt || 0);
        case 'titleAsc':
          return a.title.localeCompare(b.title);
        case 'order':
        default:
          return (a.order ?? 0) - (b.order ?? 0);
      }
    });

    return result;
  }

  renderListView(filteredTasks) {
    this.activeTaskList.innerHTML = '';
    this.completedTaskList.innerHTML = '';

    const activeTasks = filteredTasks.filter((t) => !t.completed);
    const completedTasks = filteredTasks.filter((t) => t.completed);

    this.activeGroupCount.textContent = activeTasks.length;
    this.completedGroupCount.textContent = completedTasks.length;

    if (filteredTasks.length === 0) {
      this.emptyState.style.display = 'flex';
      this.activeTaskList.closest('.task-group').style.display = 'none';
      this.completedTasksGroup.style.display = 'none';
      return;
    }

    this.emptyState.style.display = 'none';
    this.activeTaskList.closest('.task-group').style.display = activeTasks.length > 0 ? 'flex' : 'none';
    this.completedTasksGroup.style.display = completedTasks.length > 0 ? 'flex' : 'none';

    activeTasks.forEach((task) => {
      this.activeTaskList.appendChild(this.createTaskElement(task));
    });

    completedTasks.forEach((task) => {
      this.completedTaskList.appendChild(this.createTaskElement(task));
    });
  }

  createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;
    li.draggable = true;

    // Subtask count
    const subtaskTotal = task.subtasks ? task.subtasks.length : 0;
    const subtaskCompleted = task.subtasks ? task.subtasks.filter((s) => s.completed).length : 0;

    // Due date label
    let dueTagHtml = '';
    if (task.dueDate) {
      const todayStr = new Date().toISOString().split('T')[0];
      let dueClass = '';
      let dueLabel = task.dueDate;
      if (task.dueDate === todayStr) {
        dueClass = 'today';
        dueLabel = 'Today';
      } else if (task.dueDate < todayStr && !task.completed) {
        dueClass = 'overdue';
        dueLabel = `Overdue (${task.dueDate})`;
      }
      dueTagHtml = `
        <span class="due-tag ${dueClass}">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          ${dueLabel}
        </span>
      `;
    }

    // Subtasks pill
    let subtasksHtml = '';
    if (subtaskTotal > 0) {
      subtasksHtml = `
        <span class="subtasks-badge" title="${subtaskCompleted} of ${subtaskTotal} subtasks completed">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          ${subtaskCompleted}/${subtaskTotal}
        </span>
      `;
    }

    li.innerHTML = `
      <span class="drag-handle" title="Drag to reorder">⋮⋮</span>
      <label class="custom-checkbox-wrapper" onclick="event.stopPropagation()">
        <input type="checkbox" class="task-checkbox-input" ${task.completed ? 'checked' : ''}>
        <div class="custom-checkbox">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </label>
      <div class="task-content">
        <div class="task-main-row">
          <span class="task-title">${this.escapeHtml(task.title)}</span>
        </div>
        <div class="task-meta-row">
          <span class="badge badge-${task.priority}">
            ${this.getPriorityEmoji(task.priority)} ${task.priority.toUpperCase()}
          </span>
          <span class="category-tag">${this.escapeHtml(task.category || 'General')}</span>
          ${dueTagHtml}
          ${subtasksHtml}
        </div>
      </div>
      <div class="task-actions" onclick="event.stopPropagation()">
        <button class="task-action-btn edit-btn" title="Edit Task" aria-label="Edit Task">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        </button>
        <button class="task-action-btn delete-btn" title="Delete Task" aria-label="Delete Task">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    `;

    // Bind events on task
    const checkbox = li.querySelector('.task-checkbox-input');
    checkbox.addEventListener('change', () => this.toggleTaskCompletion(task.id));

    li.querySelector('.edit-btn').addEventListener('click', () => this.openTaskModal(task.id));
    li.querySelector('.delete-btn').addEventListener('click', () => this.deleteTask(task.id));
    li.addEventListener('click', () => this.openTaskModal(task.id));

    return li;
  }

  renderKanbanView(filteredTasks) {
    this.kanbanTodoList.innerHTML = '';
    this.kanbanInProgressList.innerHTML = '';
    this.kanbanDoneList.innerHTML = '';

    const todoTasks = filteredTasks.filter((t) => t.status === 'todo' || (!t.status && !t.completed));
    const inProgressTasks = filteredTasks.filter((t) => t.status === 'inprogress');
    const doneTasks = filteredTasks.filter((t) => t.status === 'done' || t.completed);

    this.kanbanTodoCount.textContent = todoTasks.length;
    this.kanbanInProgressCount.textContent = inProgressTasks.length;
    this.kanbanDoneCount.textContent = doneTasks.length;

    todoTasks.forEach((t) => this.kanbanTodoList.appendChild(this.createKanbanCard(t)));
    inProgressTasks.forEach((t) => this.kanbanInProgressList.appendChild(this.createKanbanCard(t)));
    doneTasks.forEach((t) => this.kanbanDoneList.appendChild(this.createKanbanCard(t)));
  }

  createKanbanCard(task) {
    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.dataset.id = task.id;
    card.draggable = true;

    const subtaskTotal = task.subtasks ? task.subtasks.length : 0;
    const subtaskCompleted = task.subtasks ? task.subtasks.filter((s) => s.completed).length : 0;

    card.innerHTML = `
      <div class="kanban-card-title">${this.escapeHtml(task.title)}</div>
      ${task.description ? `<div class="kanban-card-desc">${this.escapeHtml(task.description)}</div>` : ''}
      <div class="kanban-card-footer">
        <span class="badge badge-${task.priority}">${this.getPriorityEmoji(task.priority)} ${task.priority}</span>
        <span class="category-tag">${this.escapeHtml(task.category || 'General')}</span>
        ${subtaskTotal > 0 ? `<span class="subtasks-badge">✓ ${subtaskCompleted}/${subtaskTotal}</span>` : ''}
      </div>
    `;

    card.addEventListener('click', () => this.openTaskModal(task.id));
    return card;
  }

  renderCategories() {
    this.categoryNavList.innerHTML = '';
    const selectOptions = this.state.categories
      .map((c) => `<option value="${c.name}">${c.emoji || '🏷️'} ${c.name}</option>`)
      .join('');

    this.quickAddCategory.innerHTML = selectOptions;
    this.taskFormCategory.innerHTML = selectOptions;

    this.state.categories.forEach((cat) => {
      const count = this.state.tasks.filter((t) => t.category === cat.name).length;
      const li = document.createElement('li');
      li.className = 'nav-item';
      li.innerHTML = `
        <button class="nav-link ${this.state.activeCategory === cat.name ? 'active' : ''}" data-category="${cat.name}">
          <span class="category-dot" style="background: ${cat.color}"></span>
          <span>${cat.name}</span>
          <span class="nav-counter">${count}</span>
        </button>
      `;
      li.querySelector('button').addEventListener('click', () => {
        this.setCategoryFilter(cat.name);
        if (window.innerWidth <= 860) this.sidebar.classList.remove('mobile-open');
      });
      this.categoryNavList.appendChild(li);
    });
  }

  updateStats() {
    const total = this.state.tasks.length;
    const completed = this.state.tasks.filter((t) => t.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    this.completedCount.textContent = completed;
    this.totalCount.textContent = total;
    this.progressPercent.textContent = `${percent}%`;

    // SVG Progress ring dashoffset calculation (Circumference = 2 * PI * 32 = 201.06)
    const circumference = 201.06;
    const offset = circumference - (percent / 100) * circumference;
    this.progressRingBar.style.strokeDashoffset = offset;

    // Color gradient indication
    if (percent === 100 && total > 0) {
      this.progressRingBar.style.stroke = 'var(--accent-emerald)';
    } else if (percent > 50) {
      this.progressRingBar.style.stroke = 'var(--primary)';
    } else {
      this.progressRingBar.style.stroke = 'var(--accent-cyan)';
    }

    this.streakCount.textContent = this.state.streak;
  }

  updateNavCounters() {
    const todayStr = new Date().toISOString().split('T')[0];
    const total = this.state.tasks.length;
    const todayCount = this.state.tasks.filter((t) => t.dueDate === todayStr).length;
    const upcomingCount = this.state.tasks.filter((t) => t.dueDate && t.dueDate > todayStr && !t.completed).length;
    const importantCount = this.state.tasks.filter((t) => ['high', 'urgent'].includes(t.priority)).length;
    const completedCount = this.state.tasks.filter((t) => t.completed).length;

    this.countAll.textContent = total;
    this.countToday.textContent = todayCount;
    this.countUpcoming.textContent = upcomingCount;
    this.countImportant.textContent = importantCount;
    this.countCompleted.textContent = completedCount;
  }

  // ==========================================================================
  // CRUD Operations
  // ==========================================================================
  createTask({ title, description = '', priority = 'medium', category = 'General', dueDate = null, subtasks = [], status = 'todo' }) {
    const newTask = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate,
      completed: status === 'done',
      status: status || 'todo',
      createdAt: Date.now(),
      order: this.state.tasks.length,
      subtasks
    };

    this.state.tasks.unshift(newTask);
    this.state.saveTasks();
    this.render();
  }

  updateTask(id, updates) {
    const idx = this.state.tasks.findIndex((t) => t.id === id);
    if (idx !== -1) {
      this.state.tasks[idx] = { ...this.state.tasks[idx], ...updates };
      this.state.saveTasks();
      this.render();
    }
  }

  deleteTask(id) {
    this.state.tasks = this.state.tasks.filter((t) => t.id !== id);
    this.state.saveTasks();
    this.synth.playClick();
    this.showToast('Task removed 🗑️', 'danger');
    this.render();
  }

  toggleTaskCompletion(id) {
    const task = this.state.tasks.find((t) => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    task.status = task.completed ? 'done' : 'todo';

    if (task.completed) {
      this.synth.playSuccess();
      this.triggerConfetti();
      this.showToast('Task completed! Great job! 🎉', 'success');

      // Check if all tasks are completed
      const allDone = this.state.tasks.length > 0 && this.state.tasks.every((t) => t.completed);
      if (allDone) {
        setTimeout(() => this.triggerGrandCelebration(), 400);
      }
    } else {
      this.synth.playClick();
    }

    this.state.saveTasks();
    this.render();
  }

  clearCompletedTasks() {
    const count = this.state.tasks.filter((t) => t.completed).length;
    if (count === 0) {
      this.showToast('No completed tasks to clear.');
      return;
    }

    if (confirm(`Remove ${count} completed task(s)?`)) {
      this.state.tasks = this.state.tasks.filter((t) => !t.completed);
      this.state.saveTasks();
      this.synth.playClick();
      this.showToast(`Cleared ${count} completed tasks! 🧹`, 'info');
      this.render();
    }
  }

  // ==========================================================================
  // Modal Task Manager & Subtasks
  // ==========================================================================
  openTaskModal(taskId = null, defaultStatus = 'todo') {
    this.taskForm.reset();
    this.modalSubtasksList.innerHTML = '';
    this.tempModalSubtasks = [];

    if (taskId) {
      const task = this.state.tasks.find((t) => t.id === taskId);
      if (!task) return;

      this.taskModalHeading.textContent = 'Edit Task';
      this.taskFormId.value = task.id;
      this.taskFormTitle.value = task.title;
      this.taskFormDesc.value = task.description || '';
      this.taskFormPriority.value = task.priority;
      this.taskFormCategory.value = task.category;
      this.taskFormDueDate.value = task.dueDate || '';
      this.deleteTaskModalBtn.style.display = 'inline-flex';

      this.tempModalSubtasks = task.subtasks ? JSON.parse(JSON.stringify(task.subtasks)) : [];
    } else {
      this.taskModalHeading.textContent = 'Create New Task';
      this.taskFormId.value = '';
      this.taskFormPriority.value = 'medium';
      this.taskFormCategory.value = this.state.activeCategory || 'General';
      this.taskFormDueDate.value = new Date().toISOString().split('T')[0];
      this.deleteTaskModalBtn.style.display = 'none';
      this.taskForm.dataset.defaultStatus = defaultStatus;
    }

    this.renderModalSubtasks();
    this.taskModalOverlay.classList.add('active');
    setTimeout(() => this.taskFormTitle.focus(), 50);
  }

  closeTaskModal() {
    this.taskModalOverlay.classList.remove('active');
  }

  addModalSubtask() {
    const text = this.newSubtaskInput.value.trim();
    if (!text) return;

    this.tempModalSubtasks.push({
      id: 'sub-' + Date.now(),
      text,
      completed: false
    });

    this.newSubtaskInput.value = '';
    this.renderModalSubtasks();
    this.newSubtaskInput.focus();
  }

  renderModalSubtasks() {
    this.modalSubtasksList.innerHTML = '';
    const completedCount = this.tempModalSubtasks.filter((s) => s.completed).length;
    this.subtasksCompletedCount.textContent = `${completedCount}/${this.tempModalSubtasks.length}`;

    this.tempModalSubtasks.forEach((sub, idx) => {
      const row = document.createElement('div');
      row.className = `subtask-row ${sub.completed ? 'completed' : ''}`;
      row.innerHTML = `
        <input type="checkbox" ${sub.completed ? 'checked' : ''}>
        <span>${this.escapeHtml(sub.text)}</span>
        <button type="button" class="subtask-remove-btn" title="Remove">&times;</button>
      `;

      row.querySelector('input').addEventListener('change', (e) => {
        this.tempModalSubtasks[idx].completed = e.target.checked;
        this.renderModalSubtasks();
      });

      row.querySelector('.subtask-remove-btn').addEventListener('click', () => {
        this.tempModalSubtasks.splice(idx, 1);
        this.renderModalSubtasks();
      });

      this.modalSubtasksList.appendChild(row);
    });
  }

  handleTaskFormSubmit() {
    const id = this.taskFormId.value;
    const title = this.taskFormTitle.value.trim();
    if (!title) return;

    const payload = {
      title,
      description: this.taskFormDesc.value.trim(),
      priority: this.taskFormPriority.value,
      category: this.taskFormCategory.value,
      dueDate: this.taskFormDueDate.value || null,
      subtasks: this.tempModalSubtasks
    };

    if (id) {
      this.updateTask(id, payload);
      this.showToast('Task updated! 📝', 'info');
    } else {
      payload.status = this.taskForm.dataset.defaultStatus || 'todo';
      this.createTask(payload);
      this.showToast('New task added! 🚀', 'success');
    }

    this.synth.playClick();
    this.closeTaskModal();
  }

  // ==========================================================================
  // Drag and Drop (List & Kanban)
  // ==========================================================================
  initDragAndDrop() {
    let draggedId = null;

    // Event delegation on container
    document.addEventListener('dragstart', (e) => {
      const taskEl = e.target.closest('.task-item, .kanban-card');
      if (taskEl) {
        draggedId = taskEl.dataset.id;
        taskEl.classList.add('dragging');
        e.dataTransfer.setData('text/plain', draggedId);
        e.dataTransfer.effectAllowed = 'move';
      }
    });

    document.addEventListener('dragend', (e) => {
      const taskEl = e.target.closest('.task-item, .kanban-card');
      if (taskEl) {
        taskEl.classList.remove('dragging');
      }
      document.querySelectorAll('.kanban-dropzone').forEach((d) => d.classList.remove('drag-over'));
    });

    // Kanban dropzones
    document.querySelectorAll('.kanban-dropzone').forEach((dropzone) => {
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-over');
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('drag-over');
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
        const taskId = e.dataTransfer.getData('text/plain');
        const targetStatus = dropzone.dataset.status;

        if (taskId && targetStatus) {
          const task = this.state.tasks.find((t) => t.id === taskId);
          if (task && task.status !== targetStatus) {
            task.status = targetStatus;
            task.completed = targetStatus === 'done';
            if (task.completed) {
              this.synth.playSuccess();
              this.triggerConfetti();
            } else {
              this.synth.playClick();
            }
            this.state.saveTasks();
            this.render();
          }
        }
      });
    });

    // List view reordering
    this.activeTaskList.addEventListener('dragover', (e) => {
      e.preventDefault();
      const afterElement = this.getDragAfterElement(this.activeTaskList, e.clientY);
      const draggable = document.querySelector('.task-item.dragging');
      if (draggable) {
        if (afterElement == null) {
          this.activeTaskList.appendChild(draggable);
        } else {
          this.activeTaskList.insertBefore(draggable, afterElement);
        }
      }
    });

    this.activeTaskList.addEventListener('drop', () => {
      const itemEls = Array.from(this.activeTaskList.querySelectorAll('.task-item'));
      itemEls.forEach((el, index) => {
        const id = el.dataset.id;
        const task = this.state.tasks.find((t) => t.id === id);
        if (task) task.order = index;
      });
      this.state.sortOption = 'order';
      this.sortSelect.value = 'order';
      this.state.save('sort', 'order');
      this.state.saveTasks();
    });
  }

  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  // ==========================================================================
  // Pomodoro Timer Logic
  // ==========================================================================
  togglePomodoro() {
    if (this.pomoRunning) {
      clearInterval(this.pomoInterval);
      this.pomoRunning = false;
      this.pomoToggleBtn.textContent = 'Resume';
      this.pomoToggleBtn.className = 'btn btn-sm btn-primary';
    } else {
      this.synth.init();
      this.pomoRunning = true;
      this.pomoToggleBtn.textContent = 'Pause';
      this.pomoToggleBtn.className = 'btn btn-sm btn-secondary';

      this.pomoInterval = setInterval(() => {
        if (this.pomoRemaining > 0) {
          this.pomoRemaining--;
          this.updatePomodoroDisplay();
        } else {
          clearInterval(this.pomoInterval);
          this.pomoRunning = false;
          this.synth.playAlarm();
          this.showToast('⚡ Focus Session Finished! Time for a break.', 'success');
          this.triggerConfetti();
          this.resetPomodoro();
        }
      }, 1000);
    }
  }

  resetPomodoro() {
    clearInterval(this.pomoInterval);
    this.pomoRunning = false;
    this.pomoRemaining = this.pomoDuration;
    this.pomoToggleBtn.textContent = 'Start';
    this.pomoToggleBtn.className = 'btn btn-sm btn-primary';
    this.updatePomodoroDisplay();
  }

  updatePomodoroDisplay() {
    const mins = Math.floor(this.pomoRemaining / 60);
    const secs = this.pomoRemaining % 60;
    const str = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    this.pomoTimerDisplay.textContent = str;
  }

  // ==========================================================================
  // Export & Import
  // ==========================================================================
  exportJSON() {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tasks: this.state.tasks,
      categories: this.state.categories
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskmaster-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Backup JSON downloaded! 💾', 'success');
  }

  importJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (Array.isArray(data.tasks)) {
          this.state.tasks = data.tasks;
          if (Array.isArray(data.categories)) {
            this.state.categories = data.categories;
            this.state.saveCategories();
            this.renderCategories();
          }
          this.state.saveTasks();
          this.render();
          this.exportModalOverlay.classList.remove('active');
          this.showToast('Tasks imported successfully! 🎉', 'success');
        } else {
          throw new Error('Invalid schema format');
        }
      } catch (err) {
        alert('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  }

  exportMarkdown() {
    let md = `# TaskMaster Pro Export - ${new Date().toLocaleDateString()}\n\n`;
    md += `## Pending Tasks\n`;
    this.state.tasks
      .filter((t) => !t.completed)
      .forEach((t) => {
        md += `- [ ] **${t.title}** (${t.priority.toUpperCase()}) [${t.category}] ${t.dueDate ? `Due: ${t.dueDate}` : ''}\n`;
        if (t.description) md += `  > ${t.description}\n`;
        if (t.subtasks && t.subtasks.length > 0) {
          t.subtasks.forEach((s) => {
            md += `  - [${s.completed ? 'x' : ' '}] ${s.text}\n`;
          });
        }
      });

    md += `\n## Completed Tasks\n`;
    this.state.tasks
      .filter((t) => t.completed)
      .forEach((t) => {
        md += `- [x] ~~${t.title}~~\n`;
      });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskmaster-summary-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Markdown summary exported! 📑', 'success');
  }

  // ==========================================================================
  // Themes & UI Helpers
  // ==========================================================================
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.state.theme = theme;
    this.state.save('theme', theme);
    this.themeLabel.textContent = theme === 'dark' ? 'Dark Theme' : 'Light Theme';
  }

  updateSoundIcon() {
    this.soundIcon.textContent = this.state.soundEnabled ? '🔔' : '🔕';
  }

  setNavFilter(filter) {
    this.state.activeFilter = filter;
    this.state.activeCategory = null;

    document.querySelectorAll('.sidebar-nav .nav-link').forEach((link) => {
      link.classList.toggle('active', link.dataset.filter === filter);
    });

    const titles = {
      all: 'All Tasks',
      today: 'My Day',
      upcoming: 'Upcoming Tasks',
      important: 'High Priority',
      completed: 'Completed Tasks'
    };
    this.pageTitle.textContent = titles[filter] || 'Tasks';
    this.render();
  }

  setCategoryFilter(categoryName) {
    this.state.activeCategory = categoryName;
    this.state.activeFilter = null;

    document.querySelectorAll('.sidebar-nav .nav-link').forEach((link) => {
      link.classList.toggle('active', link.dataset.category === categoryName);
    });

    this.pageTitle.textContent = `${categoryName} Tasks`;
    this.render();
  }

  setView(view) {
    this.state.currentView = view;
    this.state.save('view', view);

    this.viewListBtn.classList.toggle('active', view === 'list');
    this.viewKanbanBtn.classList.toggle('active', view === 'kanban');
    this.listViewPane.classList.toggle('active', view === 'list');
    this.kanbanViewPane.classList.toggle('active', view === 'kanban');

    this.render();
  }

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach((m) => m.classList.remove('active'));
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  triggerConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#06b6d4']
      });
    }
  }

  triggerGrandCelebration() {
    if (typeof confetti === 'function') {
      const count = 200;
      const defaults = { origin: { y: 0.7 } };
      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }

  updateCurrentDateDisplay() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    this.currentDateStr.textContent = new Date().toLocaleDateString(undefined, options);
  }

  getPriorityEmoji(priority) {
    switch (priority) {
      case 'urgent': return '⚡';
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TaskMasterApp();
});
