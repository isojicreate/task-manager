(() => {
  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const priorityInput = document.getElementById("priorityInput");
  const dueDateInput = document.getElementById("dueDateInput");
  const taskSubmitButton = document.getElementById("taskSubmitButton");
  const taskList = document.getElementById("taskList");
  const taskCount = document.getElementById("taskCount");
  const taskSort = document.getElementById("taskSort");
  const errorMessage = document.getElementById("errorMessage");
  const emptyMessage = document.getElementById("emptyMessage");

  let tasks = loadTasks();
  let editingTaskId = null;
  let sortMethod = taskSort.value;

  const createTask = (text, priority, dueDate) => {
    return {
      id: Date.now(),
      text,
      completed: false,
      priority,
      dueDate
    };
  };

  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const sortTasks = (taskA, taskB) => {
    if (sortMethod === "priority") {
      return taskB.priority - taskA.priority;
    }

    const today = getToday();
    const getDueDateGroup = (task) => {
      if (!task.dueDate) {
        return 2;
      }

      return task.dueDate < today ? 0 : 1;
    };
    const groupDifference = getDueDateGroup(taskA) - getDueDateGroup(taskB);

    if (groupDifference !== 0) {
      return groupDifference;
    }

    if (!taskA.dueDate || !taskB.dueDate) {
      return 0;
    }

    return taskA.dueDate.localeCompare(taskB.dueDate);
  };

  const renderTasks = () => {
    taskList.innerHTML = "";
    const completedTaskCount = tasks.filter((task) => task.completed).length;
    taskCount.textContent = `全${tasks.length}件 / 完了${completedTaskCount}件 / 未完了${tasks.length - completedTaskCount}件`;

    if (tasks.length === 0) {
      emptyMessage.classList.remove("is-hidden");
      return;
    }

    emptyMessage.classList.add("is-hidden");

    [...tasks].sort(sortTasks).forEach((task) => {
      const taskItem = document.createElement("li");
      taskItem.className = "task-item";

      if (task.completed) {
        taskItem.classList.add("is-completed");
      }

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;

      checkbox.addEventListener("change", () => {
        toggleTaskCompleted(task.id);
      });

      const taskText = document.createElement("span");
      taskText.className = "task-text";
      taskText.textContent = task.text;

      const taskPriority = document.createElement("span");
      taskPriority.className = "task-priority";
      taskPriority.textContent = "★".repeat(task.priority) + "☆".repeat(5 - task.priority);

      const taskDueDate = document.createElement("span");
      taskDueDate.className = "task-due-date";
      taskDueDate.textContent = task.dueDate || "期限なし";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "edit-button";
      editButton.textContent = "編集";

      editButton.addEventListener("click", () => {
        startEditingTask(task);
      });

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete-button";
      deleteButton.textContent = "削除";

      deleteButton.addEventListener("click", () => {
        deleteTask(task.id);
      });

      taskItem.appendChild(checkbox);
      taskItem.appendChild(taskText);
      taskItem.appendChild(taskDueDate);
      taskItem.appendChild(taskPriority);
      taskItem.appendChild(editButton);
      taskItem.appendChild(deleteButton);

      taskList.appendChild(taskItem);
    });
  };

  const addTask = (text, priority, dueDate) => {
    const newTask = createTask(text, priority, dueDate);

    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();
  };

  const updateTask = (taskId, text, priority, dueDate) => {
    tasks = tasks.map((task) => {
      if (task.id !== taskId) {
        return task;
      }

      return {
        ...task,
        text,
        priority,
        dueDate
      };
    });

    saveTasks(tasks);
    renderTasks();
  };

  const resetTaskForm = () => {
    editingTaskId = null;
    taskInput.value = "";
    priorityInput.value = "3";
    dueDateInput.value = "";
    taskSubmitButton.textContent = "追加";
  };

  const startEditingTask = (task) => {
    editingTaskId = task.id;
    taskInput.value = task.text;
    priorityInput.value = task.priority;
    dueDateInput.value = task.dueDate;
    taskSubmitButton.textContent = "更新";
    taskInput.focus();
  };

  const toggleTaskCompleted = (taskId) => {
    tasks = tasks.map((task) => {
      if (task.id !== taskId) {
        return task;
      }

      return {
        ...task,
        completed: !task.completed
      };
    });

    saveTasks(tasks);
    renderTasks();
  };

  const deleteTask = (taskId) => {
    tasks = tasks.filter((task) => task.id !== taskId);

    saveTasks(tasks);
    renderTasks();

    if (editingTaskId === taskId) {
      resetTaskForm();
    }
  };

  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
      errorMessage.textContent = "タスクを入力してください。";
      return;
    }

    errorMessage.textContent = "";
    if (editingTaskId === null) {
      addTask(taskText, Number(priorityInput.value), dueDateInput.value);
    } else {
      updateTask(editingTaskId, taskText, Number(priorityInput.value), dueDateInput.value);
    }
    resetTaskForm();
    taskInput.focus();
  });

  taskSort.addEventListener("change", () => {
    sortMethod = taskSort.value;
    renderTasks();
  });

  renderTasks();
})();
