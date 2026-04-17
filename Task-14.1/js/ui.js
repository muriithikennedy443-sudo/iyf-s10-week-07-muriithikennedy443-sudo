// UI.JS - All DOM rendering functions

function renderTodos() {
  const list = document.getElementById("todoList");
  const filtered = getFilteredTodos();

  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty-state">No tasks here!</div>';
    return;
  }

  list.innerHTML = filtered.map(todo => `
    <li class="${todo.completed ? "completed" : ""}">
      <input
        type="checkbox"
        ${todo.completed ? "checked" : ""}
        onchange="handleToggle('${todo.id}')"
      />
      <span class="text">
        ${todo.text}
        <span class="date">📅 ${formatDate(todo.createdAt)}</span>
      </span>
      <button class="delete-btn" onclick="handleDelete('${todo.id}')">🗑</button>
    </li>
  `).join("");
}

function renderStats() {
  const remaining = state.todos.filter(t => !t.completed).length;
  document.getElementById("stats").textContent =
    `${remaining} task${remaining !== 1 ? "s" : ""} remaining · ${state.todos.length} total`;
}

function renderFilters() {
  document.querySelectorAll(".filters button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === state.filter);
  });
}

function render() {
  renderTodos();
  renderStats();
  renderFilters();
}