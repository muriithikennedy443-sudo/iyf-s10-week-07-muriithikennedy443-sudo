// EXERCISE 1: MEANINGFUL NAMES

const currentDate = new Date();

function getAdultUsers(users) {
  return users.filter(user => user.age > 18);
}

function calculateDiscount(price, quantity, discountRate) {
  return price * quantity * discountRate;
}

function handleCalculateDiscount() {
  const price = parseFloat(document.getElementById("price").value);
  const quantity = parseFloat(document.getElementById("quantity").value);
  const discountPercent = parseFloat(document.getElementById("discountPercent").value);
  const resultEl = document.getElementById("discountResult");

  if (isNaN(price) || isNaN(quantity) || isNaN(discountPercent)) {
    resultEl.textContent = "❌ Please fill in all fields.";
    resultEl.className = "result error";
    return;
  }

  const discountRate = discountPercent / 100;
  const discountAmount = calculateDiscount(price, quantity, discountRate);
  const totalPrice = price * quantity;
  const finalPrice = totalPrice - discountAmount;

  resultEl.textContent =
    `Original: $${totalPrice.toFixed(2)} | ` +
    `Discount: $${discountAmount.toFixed(2)} | ` +
    `Final: $${finalPrice.toFixed(2)}`;
  resultEl.className = "result success";
}

// EXERCISE 2: SINGLE RESPONSIBILITY

const MIN_AGE = 18;

function validateUser(userData) {
  if (!userData.name || userData.name.trim() === "") {
    throw new Error("Name is required.");
  }
  if (!userData.email.includes("@")) {
    throw new Error("Invalid email address.");
  }
  if (userData.age < MIN_AGE) {
    throw new Error(`User must be at least ${MIN_AGE} years old.`);
  }
  return true;
}

function normalizeUser(userData) {
  return {
    ...userData,
    name: userData.name.trim(),
    email: userData.email.toLowerCase().trim(),
    age: Number(userData.age)
  };
}

function saveUserToStorage(userData) {
  const users = getUsersFromStorage();
  const newUser = {
    ...userData,
    id: Date.now(),
    registeredAt: new Date().toLocaleString()
  };
  users.push(newUser);
  localStorage.setItem("cleancode_users", JSON.stringify(users));
  return newUser;
}

function getUsersFromStorage() {
  const data = localStorage.getItem("cleancode_users");
  return data ? JSON.parse(data) : [];
}

function notifyUser(userData) {
  console.log(`✅ Welcome email sent to ${userData.email}`);
}

function showUserStatus(message, type) {
  const el = document.getElementById("userResult");
  el.textContent = message;
  el.className = "result " + type;
}

function renderUsersList() {
  const users = getUsersFromStorage();
  const container = document.getElementById("usersList");
  if (users.length === 0) {
    container.innerHTML = "";
    return;
  }
  container.innerHTML = users.map(user => `
    <div class="user-card">
      <span>${user.name}</span> · ${user.email} · Age: ${user.age}
    </div>
  `).join("");
}

function getFormData() {
  return {
    name: document.getElementById("userName").value,
    email: document.getElementById("userEmail").value,
    age: document.getElementById("userAge").value
  };
}

async function createUser(userData) {
  validateUser(userData);
  const normalizedUser = normalizeUser(userData);
  saveUserToStorage(normalizedUser);
  notifyUser(normalizedUser);
  return normalizedUser;
}

async function handleCreateUser() {
  try {
    const userData = getFormData();
    await createUser(userData);
    showUserStatus("✅ User registered successfully!", "success");
    renderUsersList();
    document.getElementById("userName").value = "";
    document.getElementById("userEmail").value = "";
    document.getElementById("userAge").value = "";
  } catch (error) {
    showUserStatus("❌ " + error.message, "error");
  }
}

// EXERCISE 3: AVOID MAGIC NUMBERS

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const HTTP_NOT_FOUND = 404;
const HTTP_OK = 200;
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /[0-9]/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*]/;

function checkPasswordLength(password) {
  return password.length >= MIN_PASSWORD_LENGTH;
}

function checkPasswordHasUppercase(password) {
  return UPPERCASE_REGEX.test(password);
}

function checkPasswordHasLowercase(password) {
  return LOWERCASE_REGEX.test(password);
}

function checkPasswordHasNumber(password) {
  return NUMBER_REGEX.test(password);
}

function checkPasswordHasSpecialChar(password) {
  return SPECIAL_CHAR_REGEX.test(password);
}

function handleValidatePassword() {
  const password = document.getElementById("passwordInput").value;
  const container = document.getElementById("passwordResult");

  const checks = [
    {
      label: `Minimum ${MIN_PASSWORD_LENGTH} characters`,
      pass: checkPasswordLength(password)
    },
    {
      label: "Contains uppercase letter (A-Z)",
      pass: checkPasswordHasUppercase(password)
    },
    {
      label: "Contains lowercase letter (a-z)",
      pass: checkPasswordHasLowercase(password)
    },
    {
      label: "Contains a number (0-9)",
      pass: checkPasswordHasNumber(password)
    },
    {
      label: "Contains special character (!@#$%^&*)",
      pass: checkPasswordHasSpecialChar(password)
    }
  ];

  container.innerHTML = `
    <div class="password-checks">
      ${checks.map(check => `
        <div class="check-item ${check.pass ? "pass" : "fail"}">
          ${check.pass ? "✅" : "❌"} ${check.label}
        </div>
      `).join("")}
    </div>
  `;
}

// INITIALIZE

renderUsersList();