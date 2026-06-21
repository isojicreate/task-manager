(() => {
  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const taskList = document.getElementById("taskList");
  const errorMessage = document.getElementById("errorMessage");
  const emptyMessage = document.getElementById("emptyMessage");

  let tasks = loadTasks();
  console.log(tasks);

  const createTask = (text) => {
    return {
      id: Date.now(),
      text,
      completed: false
    };
  };

  const renderTasks = () => {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
      emptyMessage.classList.remove("is-hidden");
      return;
    }

    emptyMessage.classList.add("is-hidden");

    tasks.forEach((task) => {
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

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete-button";
      deleteButton.textContent = "削除";

      deleteButton.addEventListener("click", () => {
        deleteTask(task.id);
      });

      taskItem.appendChild(checkbox);
      taskItem.appendChild(taskText);
      taskItem.appendChild(deleteButton);

      taskList.appendChild(taskItem);
    });
  };

  const addTask = (text) => {
    const newTask = createTask(text);

    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();
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
  };

  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
      errorMessage.textContent = "タスクを入力してください。";
      return;
    }

    errorMessage.textContent = "";
    addTask(taskText);
    taskInput.value = "";
    taskInput.focus();
  });

  renderTasks();
})();