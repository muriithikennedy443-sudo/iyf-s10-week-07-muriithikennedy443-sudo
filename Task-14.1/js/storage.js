// STORAGE.JS - localStorage helpers

const STORAGE_PREFIX = "todoapp_";

function save(key, data) {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
}

function load(key, defaultValue = null) {
  const data = localStorage.getItem(STORAGE_PREFIX + key);
  return data ? JSON.parse(data) : defaultValue;
}

function remove(key) {
  localStorage.removeItem(STORAGE_PREFIX + key);
}