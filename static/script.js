const API = "/api/tasks";

const conditionForm = document.getElementById("condition-form");
const conditionInput = document.getElementById("condition");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const deleteForm = document.getElementById("delete-form");
const indexInput = document.getElementById("index-input");
const message = document.getElementById("message");
const tasksSection = document.getElementById("tasks-section");
const list = document.getElementById("task-list");
const empty = document.getElementById("empty");

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function hideSteps() {
  taskForm.classList.add("hidden");
  deleteForm.classList.add("hidden");
  tasksSection.classList.add("hidden");
}

function renderTasks(tasks) {
  list.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    const idx = document.createElement("span");
    idx.className = "index";
    idx.textContent = index + ".";
    li.append(idx, document.createTextNode(task)); // safe from HTML injection
    list.appendChild(li);
  });
  empty.style.display = tasks.length ? "none" : "block";
  tasksSection.classList.remove("hidden");
}

async function request(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Something went wrong");
  return data;
}

// Step 1: the "condition number", same as the console menu
conditionForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const condition = parseInt(conditionInput.value, 10);
  hideSteps();
  showMessage("");

  if (condition === 1) {
    taskForm.classList.remove("hidden");
    taskInput.focus();
  } else if (condition === 2) {
    try {
      const data = await request(API);
      renderTasks(data.tasks);
    } catch (err) {
      showMessage(err.message, true);
    }
  } else if (condition === 3) {
    deleteForm.classList.remove("hidden");
    indexInput.focus();
  } else if (condition === 4) {
    showMessage("task completed");
    conditionInput.disabled = true;
    conditionForm.querySelector("button").disabled = true;
  } else {
    showMessage("Please enter a number from 1 to 4", true);
  }
  conditionInput.value = "";
});

// Condition 1: add task
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  try {
    await request(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: text }),
    });
    showMessage("task added");
    taskInput.value = "";
    taskForm.classList.add("hidden");
    conditionInput.focus();
  } catch (err) {
    showMessage(err.message, true);
  }
});

// Condition 3: delete task by index
deleteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const index = parseInt(indexInput.value, 10);
  if (Number.isNaN(index)) return;
  try {
    const data = await request(`${API}/${index}`, { method: "DELETE" });
    showMessage(data.message);
    indexInput.value = "";
    deleteForm.classList.add("hidden");
    conditionInput.focus();
  } catch (err) {
    showMessage(err.message, true);
  }
});
