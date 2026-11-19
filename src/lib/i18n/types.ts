export type SupportedLanguage = "en" | "fa";
export type TextDirection = "ltr" | "rtl";

export interface LanguageOption {
  code: SupportedLanguage;
  dir: TextDirection;
  label: string;
}

export interface Dictionary {
  about: {
    checkForUpdates: string;
    checking: string;
    description: string;
    githubRepo: string;
    githubRepoDesc: string;
    platform: string;
    platformAndroid: string;
    platformWeb: string;
    title: string;
    upToDate: string;
    updateAvailable: string;
    version: string;
  };
  bottomNav: {
    calendar: string;
    projects: string;
    settings: string;
    tasks: string;
  };
  common: {
    back: string;
    cancel: string;
    close: string;
    confirm: string;
    delete: string;
    edit: string;
    loading: string;
    ok: string;
    retry: string;
    save: string;
  };
  datePicker: {
    clear: string;
    customDate: string;
    nextWeek: string;
    noDate: string;
    quickDates: string;
    selectDueDate: string;
    title: string;
    today: string;
    tomorrow: string;
  };
  emptyStates: {
    calendarDesc: string;
    calendarTitle: string;
    projectsDesc: string;
    projectsTitle: string;
  };
  header: {
    subtitle: string;
    title: string;
    toggleTheme: string;
  };
  settings: {
    appearance: {
      description: string;
      directionNote: string;
      language: string;
      theme: string;
      themeDark: string;
      themeLight: string;
      themeSystem: string;
      title: string;
    };
    back: string;
    data: {
      description: string;
      exportBackup: string;
      exportBackupDesc: string;
      exportSuccess: string;
      importBackup: string;
      importBackupDesc: string;
      importError: string;
      importSuccess: string;
      resetConfirmButton: string;
      resetConfirmDesc: string;
      resetConfirmTitle: string;
      resetData: string;
      resetDataDesc: string;
      resetSuccess: string;
      statsActive: string;
      statsCompleted: string;
      statsTotal: string;
      storageNotice: string;
      title: string;
    };
    subtitle: string;
    title: string;
  };
  tasks: {
    active: string;
    activeCount: string;
    addNewTask: string;
    addTask: string;
    all: string;
    completed: string;
    deleteConfirm: string;
    deleteTask: string;
    dueDate: string;
    editTask: string;
    editTaskTitle: string;
    emptyActiveDesc: string;
    emptyActiveTitle: string;
    emptyAllDesc: string;
    emptyAllTitle: string;
    emptyCompletedDesc: string;
    emptyCompletedTitle: string;
    markActive: string;
    markCompleted: string;
    newTask: string;
    overdue: string;
    placeholder: string;
    placeholderEdit: string;
    priorityHigh: string;
    priorityLabel: string;
    priorityLow: string;
    priorityMed: string;
    saveTask: string;
    title: string;
    today: string;
    tomorrow: string;
    yesterday: string;
  };
  update: {
    currentVersion: string;
    dialogTitle: string;
    downloadButton: string;
    laterButton: string;
    latestBadge: string;
    message: string;
  };
}
