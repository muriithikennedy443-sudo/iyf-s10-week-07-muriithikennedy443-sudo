// STATE.JS - Centralized state management

const state = {
  todos: load("todos", []),
  filter: load("filter", "all")
};

function addTodo(text) {
  const newTodo = {
    id: generateId(),
    text: text,
    completed: false,
    createdAt: new Date().toISOString()
  };
  state.todos.push(newTodo);
  save("todos", state.todos);
}

function toggleTodo(id) {
  const todo = state.todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    save("todos", state.todos);
  }
}

function deleteTodo(id) {
  state.todos = state.todos.filter(t => t.id !== id);
  save("todos", state.todos);
}

function clearCompleted() {
  state.todos = state.todos.filter(t => !t.completed);
  save("todos", state.todos);
}

function setFilter(filter) {
  state.filter = filter;
  save("filter", filter);
}

function getFilteredTodos() {
  if (state.filter === "active") return state.todos.filter(t => !t.completed);
  if (state.filter === "completed") return state.todos.filter(t => t.completed);
  return state.todos;
}