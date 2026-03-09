const sampleTasks = [
  {
    id: 1,
    title: "Study for Javascript Test",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam lobortis diam eget velit lacinia fermentum. Morbi laoreet neque dolor, sit amet vulputate massa tempor nec. Suspendisse fringilla cursus elementum. Nulla in diam a sapien laoreet rhoncus. Quisque ultrices viverra neque ut fermentum. Phasellus scelerisque nisl et est luctus imperdiet. Morbi.",
    priority: "Extreme",
    date: "01/16/2026",
    completed: false,
  },
  {
      id: 2,
      title: "Project 1 Completion",
      description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vulputate libero ipsum, a egestas turpis commodo ut. Nullam id porttitor eros, ac bibendum massa. Nam at arcu pulvinar, vehicula arcu nec, sodales quam. Pellentesque eget varius eros. Integer dapibus arcu non elit accumsan sagittis eu vel eros. Maecenas eleifend hendrerit.",
      priority: "Moderate",
      date: "12/31/2025",
      completed: false,
  },
];

let tasks = [...sampleTasks];
let editingTaskId = null;

const taskModal = document.getElementById("taskModal");
const modalTitle = document.getElementById("modalTitle");
const taskTitleInput = document.getElementById("taskTitle");
const taskDateInput = document.getElementById("taskDate");
const taskDescriptionInput = document.getElementById("taskDescription");
const saveTaskBtn = document.getElementById("saveTaskBtn");
const tasksWrapper = document.querySelector(".tasks-wrapper");
const tasksDetailsPanel = document.querySelector(".task-details");
const addTaskBtn = document.getElementById("addTaskBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");

document.addEventListener("DOMContentLoaded", function () {
  //Set current date in header
  updateCurrentDate();

  //Render initial tasks
  renderTasks();

  //Select first task by default
  if (tasks.length > 0) {
    selectTask(tasks[0].id);
  } else {
    showEmptyState();
  }

  //Event Listeners
  addTaskBtn.addEventListener("click", openAddTaskModal);
  closeModalBtn.addEventListener("click", closeModal);
  saveTaskBtn.addEventListener("click", saveTask);
  searchInput.addEventListener("input", searchTasks);
  searchButton.addEventListener("click", searchTasks);

  //Close modal when clicking outside it
  window.addEventListener("click", function (event) {
    if (event.target === taskModal) {
      closeModal();
    }
  });
});

//Render tasks in Task List
function renderTasks() {
  tasksWrapper.innerHTML = "";

  if (tasks.length === 0) {
    showEmptyState();
    return;
  }

  tasks.forEach((task) => {
    const taskCard = createTaskCard(task);
    tasksWrapper.appendChild(taskCard);
  });
}

//Create a task card element
function createTaskCard(task) {
  const taskCard = document.createElement("div");
  taskCard.className = "task-card";
  taskCard.dataset.id = task.id;

  //Create task card content
  taskCard.innerHTML = `
    <div class = "task-status">
        <div class = "status-circle ${task.completed ? "completed" : ""}">
            <i class = "fa-solid fa-check"></i>
        </div>
        <div class = "task-title">${task.title}</div>
    </div>
    <div class = "task-description">${truncateText(task.description, 100)}</div>
    <div class = "task-info">
        <span class = "priority-info">Priority: <span class = "${task.priority.toLowerCase()}">${task.priority}</span></span>
        <span class = "date-info">Created on: ${task.date}</span>
    </div>
    `;

  //Add click event to select task
  taskCard.addEventListener("click", () => selectTask(task.id));

  //Add click event to toggle completion status
  const statusCircle = taskCard.querySelector(".status-circle");
  statusCircle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleTaskCompletion(task.id);
  });

  return taskCard;
}

//Select a task and show its details
function selectTask(taskId) {
  //Deselect all tasks
  document.querySelectorAll(".task-card").forEach((card) => {
    card.classList.remove("selected");
  });

  //Select clicked task
  const taskCard = document.querySelector(`.task-card[data-id="${taskId}"]`);
  if (taskCard) {
    taskCard.classList.add("selected");
  }

  //Find the task data
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  //Update the details panel
  tasksDetailsPanel.innerHTML = `
    <div class="task-detail-header">
        <h2>${task.title}</h2>
        <div class="detail-meta">
            <div class="detail-meta-item">
                <span class="meta-label">Priority:</span>
                <span class="${task.priority.toLowerCase()}">${task.priority}</span>
            </div>
            <div class="detail-meta-item">
                <span class="meta-label">Created on:</span>
                <span>${task.date}</span>
            </div>
        </div>

        <div class="detail-description">
            <p>${task.description}</p>
        </div>
        
        <div class="action-buttons">
            <button class="action-btn btn-secondary" id="editCurrentTaskBtn">
                <i class="fa-regular fa-pen-to-square"></i>
            </button>
            <button class="action-btn btn-primary" id="deleteCurrentTaskBtn">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>
    </div>
    `;

  //Add event listeners to action buttons
  document
    .getElementById("editCurrentTaskBtn")
    .addEventListener("click", () => openEditTaskModal(taskId));
  document
    .getElementById("deleteCurrentTaskBtn")
    .addEventListener("click", () => deleteTask(taskId));
}

//Update current date in header
function updateCurrentDate() {
  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = days[now.getDay()];

  //Format date as MM/DD/YYYY
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const formattedDate = `${month}/${day}/${year}`;

  document.getElementById("currentDay").textContent = dayName;
  document.getElementById("currentDate").textContent = formattedDate;
}

//Truncate text with ellipsis
function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

//Show empty state when no tasks present
function showEmptyState() {
  tasksWrapper.innerHTML = `
    <div class="empty-state">
      <p>No tasks to show. Please add a task.</p>
    </div>
    `;

  //Clear the details panel
  tasksDetailsPanel.innerHTML = "";
}

//Toggle task completion status
function toggleTaskCompletion(taskId) {
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;

    //Update the UI
    const statusCircle = document.querySelector(
      `.task-card[data-id="${taskId}"] .status-circle`,
    );
    const statusTitle = document.querySelector(
      `.task-card[data-id="${taskId}"] .task-title`,
    );
    if (statusCircle) {
      statusCircle.classList.toggle("completed");
    }

    if (tasks[taskIndex].completed) {
      statusTitle.classList.add ("completed");
    }
    else {
      statusTitle.classList.remove ("completed");
    }

    //Re-select the task to update details view
    selectTask(taskId);
  }
}

function openAddTaskModal() {
  editingTaskId = null;
  modalTitle.textContent = "Add New Task";
  taskTitleInput.value = "";
  taskDescriptionInput.value = "";

  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  taskDateInput.value = `${month}/${day}/${year}`;

  document.querySelectorAll('input[name="priority"]').forEach((radio) => {
    radio.checked = radio.value === "low";
  });

  taskModal.style.display = "flex";
}

function openEditTaskModal(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  editingTaskId = taskId;
  modalTitle.textContent = "Edit Task";
  taskTitleInput.value = task.title;
  taskDateInput.value = task.date;
  taskDescriptionInput.value = task.description;

  document.querySelectorAll('input[name="priority"]').forEach((radio) => {
    radio.checked = radio.value.toLowerCase() === task.priority.toLowerCase();
  });

  taskModal.style.display = "flex";
}

function closeModal() {
  taskModal.style.display = "none";
}

function saveTask() {
  if (!taskTitleInput.value.trim()) {
    alert("Please enter a task title");
    return;
  }

  let selectedPriority = "Low";
  document.querySelectorAll('input[name="priority"]').forEach((radio) => {
    if (radio.checked) {
      selectedPriority =
        radio.value.charAt(0).toUpperCase() + radio.value.slice(1);
    }
  });

  if (editingTaskId === null) {
    const newTask = {
      id: Date.now(),
      title: taskTitleInput.value.trim(),
      description: taskDescriptionInput.value.trim(),
      priority: selectedPriority,
      date: taskDateInput.value,
      completed: false,
    };

    tasks.unshift(newTask);

    renderTasks();
    selectTask(newTask.id);
  } 
  else {
    const taskIndex = tasks.findIndex((t) => t.id === editingTaskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].title = taskTitleInput.value.trim();
      tasks[taskIndex].description = taskDescriptionInput.value.trim();
      tasks[taskIndex].priority = selectedPriority;
      tasks[taskIndex].date = taskDateInput.value.trim();

      renderTasks();
      selectTask(editingTaskId);
    }
  }
  closeModal();
}

function deleteTask(taskId) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return;

  tasks.splice(taskIndex, 1);

  renderTasks();

  if (tasks.length > 0) {
    selectTask(tasks[0].id);
  } else {
    showEmptyState();
  }
}

function searchTasks() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  if (searchTerm === "") {
    renderTasks();
    if (tasks.length > 0) {
      selectTask(tasks[0].id);
    }
    return;
  }

  const filteredTasks = tasks.filter((task) => 
    task.title.toLowerCase().includes(searchTerm));

  if (filteredTasks.length === 0) {
    tasksWrapper.innerHTML = `
      <div class = "empty-state">
        <p>No tasks match your search. Try a different query.</p>
      </div>
    `;
    tasksDetailsPanel.innerHTML = "";
  }
  else {
    tasksWrapper.innerHTML = "";

    filteredTasks.forEach((task) => {
      const taskCard = createTaskCard(task);
      tasksWrapper.appendChild(taskCard);
    });

    selectTask(filteredTasks[0].id);
  }
}
