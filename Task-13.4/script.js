// EXERCISE 1: CENTRALIZED STATE

const state = {
  todos: [],
  filter: "all",
  theme: "dark"
};

// State update function - single source of truth
function setState(updates) {
  Object.assign(state, updates);
  saveState();   // persist to localStorage
  render();      // re-render UI
  notifyListeners(); // Exercise 2: Observer Pattern
}

function setFilter(filter) {
  setState({ filter });
}

function addTodo() {
  const input = document.getElementById("todoInput");
  const text = input.value.trim();
  if (!text) { alert("Please enter a task!"); return; }

  setState({
    todos: [...state.todos, {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    }]
  });

  input.value = "";
}

function toggleTodo(id) {
  setState({    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  });
}

function deleteTodo(id) {
  setState({
    todos: state.todos.filter(todo => todo.id !== id)
  });
}

function clearCompleted() {
  setState({
    todos: state.todos.filter(todo => !todo.completed)
  });
}

function toggleTheme() {
  setState({ theme: state.theme === "dark" ? "light" : "dark" });
}

// Persist state to localStorage
function saveState() {
  localStorage.setItem("appState", JSON.stringify(state));
}

// Load state from localStorage
function loadState() {
  const saved = localStorage.getItem("appState");
  if (saved) {
    Object.assign(state, JSON.parse(saved));
  }
}
 
// EXERCISE 2: OBSERVER PATTERN

const createStore = (initialState) => {
  let storeState = initialState;
  const listeners = [];

  return {
    getState: () => storeState,

    setState: (updates) => {
      storeState = { ...storeState, ...updates };
      // Notify all listeners
      listeners.forEach(listener => listener(storeState));
    },

    subscribe: (listener) => {
      listeners.push(listener);
      // Return unsubscribe function
      return () => {
        const index = listeners.indexOf(listener);
        listeners.splice(index, 1);
      };
    }
  };
};

// Create a store for the state display panel
const store = createStore({ count: 0, lastAction: "none" });

// Listeners array for main state
const mainListeners = [];

function notifyListeners() {
  mainListeners.forEach(listener => listener(state));
}

function subscribeToState(listener) {
  mainListeners.push(listener);
  return () => {
    const index = mainListeners.indexOf(listener);
    mainListeners.splice(index, 1);
  };
}

// Subscribe: update state display panel on every change
const unsubscribe = subscribeToState((currentState) => {
  const display = {
    todos: currentState.todos.length + " todos",
    filter: currentState.filter,
    theme: currentState.theme,
    completed: currentState.todos.filter(t => t.completed).length
  };
  document.getElementById("stateDisplay").textContent =
    JSON.stringify(display, null, 2);
});

// RENDER

function render() {
  renderTheme();
  renderFilters();
  renderTodos();
  renderStats();
}

function renderTheme() {
  document.body.className = state.theme;
}

function renderFilters() {
  document.querySelectorAll(".filters button").forEach(btn => {
    btn.classList.remove("active");
  });
  const activeBtn = document.getElementById(`filter-${state.filter}`);
  if (activeBtn) activeBtn.classList.add("active");
}

function renderStats() {
  const remaining = state.todos.filter(t => !t.completed).length;
  document.getElementById("stats").textContent =
    `${remaining} task${remaining !== 1 ? "s" : ""} remaining · ${state.todos.length} total`;
}

function renderTodos() {
  const list = document.getElementById("todoList");

  let filtered;
  if (state.filter === "active") {
    filtered = state.todos.filter(t => !t.completed);
  } else if (state.filter === "completed") {
    filtered = state.todos.filter(t => t.completed);
  } else {
    filtered = state.todos;
  }

  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty-state">No tasks here!</div>';
    return;
  }

  list.innerHTML = filtered.map(todo => `
    <li class="${todo.completed ? "completed" : ""}">
      <input
        type="checkbox"
        ${todo.completed ? "checked" : ""}
        onchange="toggleTodo(${todo.id})"
      />
      <span class="text">
        ${todo.text}
        <span class="date">📅 ${new Date(todo.createdAt).toLocaleString()}</span>
      </span>
      <button class="delete-btn" onclick="deleteTodo(${todo.id})">🗑</button>
    </li>
  `).join("");
}

// Allow Enter key to add todo
document.getElementById("todoInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") addTodo();
});

// INITIALIZE

document.addEventListener("DOMContentLoaded", () => {
  loadState();  // restore from localStorage
  render();     // paint the UI
  notifyListeners(); // update observer panel
});