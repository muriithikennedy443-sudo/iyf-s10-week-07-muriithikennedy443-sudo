// HELPER FUNCTIONS 

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getFromStorage(key, defaultValue = null) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

function removeFromStorage(key) {
  localStorage.removeItem(key);
}

// TASK 13.2: PERSISTENT TO-DO LIST

const STORAGE_KEY = "todos";
const FILTER_KEY = "filter";

// Load todos from storage on startup
function loadTodos() {
  return getFromStorage(STORAGE_KEY, []);
}

// Save todos whenever they change
function saveTodos(todos) {
  saveToStorage(STORAGE_KEY, todos);
}

// Add a new todo
function addTodo() {
  const input = document.getElementById("todoInput");
  const text = input.value.trim();

  if (!text) {
    alert("Please enter a task!");
    return;
  }

  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false,
    createdAt: new Date().toISOString()
  };

  const todos = loadTodos();
  todos.push(newTodo);
  saveTodos(todos);

  input.value = "";
  renderTodos();
}

// Toggle completed state
function toggleTodo(id) {
  const todos = loadTodos();
  const todo = todos.find(t => t.id === id);

  if (todo) {
    todo.completed = !todo.completed;
    saveTodos(todos);
    renderTodos();
  }
}

// Delete a todo
function deleteTodo(id) {
  let todos = loadTodos();
  todos = todos.filter(t => t.id !== id);
  saveTodos(todos);
  renderTodos();
}

// Clear all completed todos
function clearCompleted() {
  let todos = loadTodos();
  todos = todos.filter(t => !t.completed);
  saveTodos(todos);
  renderTodos();
}

// Set and save filter preference
function setFilter(filter) {
  saveToStorage(FILTER_KEY, filter);

  // Update active button
  document.querySelectorAll(".filters button").forEach(btn => {
    btn.classList.remove("active");
  });
  document.getElementById(`filter-${filter}`).classList.add("active");

  renderTodos();
}

// Render todos based on current filter
function renderTodos() {
  const todos = loadTodos();
  const filter = getFromStorage(FILTER_KEY, "all");
  const list = document.getElementById("todoList");
  const stats = document.getElementById("stats");

  // Apply filter
  let filtered;
  if (filter === "active") {
    filtered = todos.filter(t => !t.completed);
  } else if (filter === "completed") {
    filtered = todos.filter(t => t.completed);
  } else {
    filtered = todos;
  }

  // Update stats
  const remaining = todos.filter(t => !t.completed).length;
  stats.textContent = `${remaining} task${remaining !== 1 ? "s" : ""} remaining · ${todos.length} total`;

  // Update filter buttons
  document.querySelectorAll(".filters button").forEach(btn => {
    btn.classList.remove("active");
  });
  const activeFilter = document.getElementById(`filter-${filter}`);
  if (activeFilter) activeFilter.classList.add("active");

  // Empty state
  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty-state">No tasks here!</div>';
    return;
  }

  // Render list
  list.innerHTML = filtered.map(todo => `
    <li class="${todo.completed ? "completed" : ""}">
      <input 
        type="checkbox" 
        ${todo.completed ? "checked" : ""} 
        onchange="toggleTodo(${todo.id})"
      />
      <span>
        ${todo.text}
        <span class="date">📅 ${new Date(todo.createdAt).toLocaleString()}</span>
      </span>
      <button class="delete-btn" onclick="deleteTodo(${todo.id})">🗑</button>
    </li>
  `).join("");
}

// Allow pressing Enter to add todo
document.getElementById("todoInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") addTodo();
});

// Initialize
document.addEventListener("DOMContentLoaded", function() {
  renderTodos();
});