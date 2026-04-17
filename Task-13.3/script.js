// EXERCISE: Understanding the Difference

// sessionStorage - cleared when browser/tab closes
sessionStorage.setItem("tempData", "This disappears when tab closes");

// localStorage - persists until explicitly cleared
localStorage.setItem("permanentData", "This stays until cleared");

// BUILD: Form that auto-saves to sessionStorage

const form = document.getElementById("contactForm");
const inputs = form.querySelectorAll("input, textarea");
const saveStatus = document.getElementById("saveStatus");
const storageDisplay = document.getElementById("storageDisplay");

// Load saved value on page load + save on every input
inputs.forEach(input => {
  // Restore saved value
  const saved = sessionStorage.getItem(`form_${input.name}`);
  if (saved) {
    input.value = saved;
  }

  // Save on every keystroke
  input.addEventListener("input", () => {
    sessionStorage.setItem(`form_${input.name}`, input.value);
    saveStatus.textContent = "✅ Progress saved automatically!";
    updateDisplay();
  });
});

// Update the storage display panel
function updateDisplay() {
  const data = {};
  inputs.forEach(input => {
    const val = sessionStorage.getItem(`form_${input.name}`);
    if (val) data[input.name] = val;
  });

  if (Object.keys(data).length === 0) {
    storageDisplay.textContent = "Nothing saved yet.";
  } else {
    storageDisplay.textContent = JSON.stringify(data, null, 2);
  }
}

// Clear on successful submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Check all fields are filled
  let allFilled = true;
  inputs.forEach(input => {
    if (!input.value.trim()) allFilled = false;
  });

  if (!allFilled) {
    saveStatus.textContent = "❌ Please fill in all fields.";
    saveStatus.style.color = "#e74c3c";
    return;
  }

  // Clear sessionStorage after submit
  inputs.forEach(input => {
    sessionStorage.removeItem(`form_${input.name}`);
  });

  saveStatus.textContent = "🎉 Form submitted! Storage cleared.";
  saveStatus.style.color = "#00d4aa";
  form.reset();
  updateDisplay();
});

// Clear button
function clearForm() {
  inputs.forEach(input => {
    sessionStorage.removeItem(`form_${input.name}`);
    input.value = "";
  });
  saveStatus.textContent = "🗑 Form cleared.";
  updateDisplay();
}

// Show storage on load
updateDisplay();