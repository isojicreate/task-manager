const STORAGE_KEY = "task-manager-tasks";

const loadTasks = () => {
  const savedTasks = localStorage.getItem(STORAGE_KEY);

  if (!savedTasks) {
    return [];
  }

  try {
    const tasks = JSON.parse(savedTasks);

    return tasks.map((task) => {
      return {
        id: task.id,
        text: task.text
      };
    });
  } catch (error) {
    console.error("タスクの読み込みに失敗しました。", error);
    return [];
  }
};

const saveTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};