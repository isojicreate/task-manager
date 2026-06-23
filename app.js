(() => {
  const DEFAULT_PRIORITY = 3;
  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const priorityInput = document.getElementById("priorityInput");
  const dueDateInput = document.getElementById("dueDateInput");
  const dueDateField = dueDateInput.parentElement;
  const taskSubmitButton = document.getElementById("taskSubmitButton");
  const taskCancelButton = document.getElementById("taskCancelButton");
  const taskList = document.getElementById("taskList");
  const taskCount = document.getElementById("taskCount");
  const taskSort = document.getElementById("taskSort");
  const errorMessage = document.getElementById("errorMessage");
  const emptyMessage = document.getElementById("emptyMessage");

  let tasks = loadTasks();
  let editingTaskId = null;
  let sortMethod = taskSort.value;

  const createTask = (text, priority, dueDate) => ({
    id: Date.now(),
    text,
    completed: false,
    priority,
    dueDate
  });

  const getTaskFormValues = () => ({
    text: taskInput.value.trim(),
    priority: Number(priorityInput.value),
    dueDate: dueDateInput.value
  });

  const updateDueDatePlaceholder = () => {
    dueDateField.classList.toggle("has-value", dueDateInput.value !== "");
  };

  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getDueDateGroup = (task, today) => {
    if (!task.dueDate) {
      return 2;
    }

    return task.dueDate < today ? 0 : 1;
  };

  const sortByDueDate = (taskA, taskB, today) => {
    const groupDifference = getDueDateGroup(taskA, today) - getDueDateGroup(taskB, today);

    if (groupDifference !== 0) {
      return groupDifference;
    }

    if (!taskA.dueDate || !taskB.dueDate) {
      return 0;
    }

    return taskA.dueDate.localeCompare(taskB.dueDate);
  };

  const getSortedTasks = () => {
    if (sortMethod === "priority") {
      return [...tasks].sort((taskA, taskB) => taskB.priority - taskA.priority);
    }

    const today = getToday();
    return [...tasks].sort((taskA, taskB) => sortByDueDate(taskA, taskB, today));
  };

  const saveAndRender = () => {
    saveTasks(tasks);
    renderTasks();
  };

  const renderTaskCount = () => {
    const completedTaskCount = tasks.filter((task) => task.completed).length;
    taskCount.textContent = `全${tasks.length}件 / 完了${completedTaskCount}件 / 未完了${tasks.length - completedTaskCount}件`;
  };

  const createTaskElement = (task) => {
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";

    if (task.completed) {
      taskItem.classList.add("is-completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTaskCompleted(task.id));

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    const taskDueDate = document.createElement("span");
    taskDueDate.className = "task-due-date";
    taskDueDate.textContent = task.dueDate || "期限なし";

    const taskPriority = document.createElement("span");
    taskPriority.className = "task-priority";
    taskPriority.textContent = "★".repeat(task.priority) + "☆".repeat(5 - task.priority);

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-button";
    editButton.textContent = "編集";
    editButton.addEventListener("click", () => startEditingTask(task));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "削除";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    taskItem.append(checkbox, taskText, taskDueDate, taskPriority, editButton, deleteButton);

    return taskItem;
  };

  const renderTasks = () => {
    taskList.innerHTML = "";
    renderTaskCount();

    if (tasks.length === 0) {
      emptyMessage.classList.remove("is-hidden");
      return;
    }

    emptyMessage.classList.add("is-hidden");
    getSortedTasks().forEach((task) => taskList.appendChild(createTaskElement(task)));
  };

  const addTask = (text, priority, dueDate) => {
    tasks.push(createTask(text, priority, dueDate));
    saveAndRender();
  };

  const updateTask = (taskId, text, priority, dueDate) => {
    tasks = tasks.map((task) => task.id === taskId
      ? { ...task, text, priority, dueDate }
      : task
    );
    saveAndRender();
  };

  const resetTaskForm = () => {
    editingTaskId = null;
    taskInput.value = "";
    priorityInput.value = String(DEFAULT_PRIORITY);
    dueDateInput.value = "";
    updateDueDatePlaceholder();
    taskSubmitButton.textContent = "追加";
    taskCancelButton.hidden = true;
  };

  const startEditingTask = (task) => {
    editingTaskId = task.id;
    taskInput.value = task.text;
    priorityInput.value = task.priority;
    dueDateInput.value = task.dueDate;
    updateDueDatePlaceholder();
    taskSubmitButton.textContent = "更新";
    taskCancelButton.hidden = false;
    taskInput.focus();
  };

  const toggleTaskCompleted = (taskId) => {
    tasks = tasks.map((task) => task.id === taskId
      ? { ...task, completed: !task.completed }
      : task
    );
    saveAndRender();
  };

  const deleteTask = (taskId) => {
    tasks = tasks.filter((task) => task.id !== taskId);
    saveAndRender();

    if (editingTaskId === taskId) {
      resetTaskForm();
    }
  };

  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const { text, priority, dueDate } = getTaskFormValues();

    if (text === "") {
      errorMessage.textContent = "タスクを入力してください。";
      return;
    }

    errorMessage.textContent = "";
    if (editingTaskId === null) {
      addTask(text, priority, dueDate);
    } else {
      updateTask(editingTaskId, text, priority, dueDate);
    }
    resetTaskForm();
    taskInput.focus();
  });

  taskSort.addEventListener("change", () => {
    sortMethod = taskSort.value;
    renderTasks();
  });

  dueDateInput.addEventListener("input", updateDueDatePlaceholder);

  taskCancelButton.addEventListener("click", () => {
    resetTaskForm();
    errorMessage.textContent = "";
    taskInput.focus();
  });

  updateDueDatePlaceholder();
  renderTasks();
})();
