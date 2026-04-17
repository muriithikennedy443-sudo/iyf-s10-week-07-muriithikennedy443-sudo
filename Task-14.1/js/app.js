// APP.JS - Entry point & event listeners

// Handlers that connect UI to state
function handleAdd() {
  const input = document.getElementById("todoInput");
  const text = input.value.trim();
  if (!text) return;
  addTodo(text);
  input.value = "";
  render();
}

function handleToggle(id) {
  toggleTodo(id);
  render();
}

function handleDelete(id) {
  deleteTodo(id);
  render();
}

function handleClearCompleted() {
  clearCompleted();
  render();
}

function handleFilterChange(filter) {
  setFilter(filter);
  render();
}

// Debounced input search (using utils.js debounce)
const debouncedAdd = debounce(handleAdd, 300);

// Event listeners
document.getElementById("addBtn").addEventListener("click", handleAdd);

document.getElementById("todoInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") handleAdd();
});

document.getElementById("clearBtn").addEventListener("click", handleClearCompleted);

document.querySelectorAll(".filters button").forEach(btn => {
  btn.addEventListener("click", () => handleFilterChange(btn.dataset.filter));
});

// Initialize app
render();