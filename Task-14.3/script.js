// EXERCISE 1: CONSOLE METHODS

const users = [
  { id: 1, name: "Kennedy", age: 20, role: "Developer" },
  { id: 2, name: "John", age: 25, role: "Designer" },
  { id: 3, name: "Alice", age: 17, role: "Intern" }
];

function runConsoleDemos() {
  // Basic logging
  console.log("Basic message");
  console.log("Logging an object:", { name: "Kennedy", age: 20 });

  // Styled logging
  console.log(
    "%cImportant!",
    "color: red; font-size: 16px; font-weight: bold;"
  );

  // Warnings and errors
  console.warn("This might be a problem");
  console.error("This is definitely wrong");

  // Tables for arrays/objects
  console.table(users);

  // Grouping
  console.group("User Processing");
  console.log("Step 1: Load users");
  console.log("Step 2: Validate users");
  console.log("Step 3: Save users");
  console.groupEnd();

  // Timing
  console.time("processingTime");
  let sum = 0;
  for (let i = 0; i < 1000000; i++) sum += i;
  console.timeEnd("processingTime");

  // Conditional logging
  const x = -5;
  console.assert(x > 0, "x should be positive but got:", x);

  // Stack trace
  console.trace("How did we get here?");

  // Show result message
  const result = document.getElementById("consoleResult");
  result.style.display = "block";
}

// EXERCISE 2: BREAKPOINTS DEMO

function processUserData(user) {
  // SET A BREAKPOINT ON THE LINE BELOW in DevTools
  const isAdult = user.age >= 18;
  const greeting = `Hello ${user.name}!`;
  const status = isAdult ? "Adult user" : "Minor user";
  return { greeting, status, isAdult };
}

function runBreakpointDemo() {
  // Add a breakpoint inside processUserData in DevTools Sources panel
  debugger; // This will pause execution in DevTools

  const results = users.map(user => processUserData(user));

  const resultEl = document.getElementById("breakpointResult");
  resultEl.textContent =
    `✅ Processed ${results.length} users. ` +
    `Check DevTools Sources panel — add a breakpoint to see ` +
    `variables at each step!`;
  resultEl.className = "result success";

  console.group("Breakpoint Demo Results");
  results.forEach(r => console.log(r));
  console.groupEnd();
}

// EXERCISE 3: DEBUG THIS CODE

const order = [
  { name: "Book",     price: 15, quantity: 2 },
  { name: "Pen",      price: 3,  quantity: 5 },
  { name: "Notebook", price: 8,  quantity: 3 }
];

// BUGGY version - has 3 bugs
function calculateOrderTotal_BUGGY(items) {
  let total = 0;

  // BUG 1: i <= items.length causes undefined on last iteration
  for (let i = 0; i <= items.length; i++) {
    const item = items[i];
    // BUG 2: typo — item.quanity instead of item.quantity
    total += item.price * item.quanity;
  }

  // BUG 3: > 100 misses exact value of 100, should be >= 100
  if (total > 100) {
    total = total * 0.9;
  }

  return total;
}

// FIXED version - all 3 bugs corrected
function calculateOrderTotal_FIXED(items) {
  let total = 0;

  // FIX 1: i < items.length (strict less than)
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    // FIX 2: correct spelling — item.quantity
    total += item.price * item.quantity;
  }

  // FIX 3: >= 100 includes exact value
  if (total >= 100) {
    total = total * 0.9;
  }

  return total;
}

function renderOrderTable() {
  const container = document.getElementById("orderItems");
  container.innerHTML = `
    <table class="order-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${order.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td>${item.quantity}</td>
            <td>$${item.price * item.quantity}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function runBuggyCode() {
  const container = document.getElementById("orderResult");
  try {
    const total = calculateOrderTotal_BUGGY(order);
    container.innerHTML = `
      <div class="order-result-box buggy">
        ❌ Buggy Result: $${total}<br>
        Expected: $69.00 (before discount) or $62.10 (with discount)<br>
        <small>Bug 1: Loop goes out of bounds (i <= length)<br>
        Bug 2: Typo "quanity" instead of "quantity"<br>
        Bug 3: Uses > instead of >= for discount threshold</small>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="order-result-box buggy">
        ❌ Error caught: ${error.message}<br>
        <small>This is Bug 1 — accessing items[items.length] returns undefined!</small>
      </div>
    `;
  }
}

function runFixedCode() {
  const total = calculateOrderTotal_FIXED(order);
  const subtotal = order.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const hasDiscount = subtotal >= 100;

  document.getElementById("orderResult").innerHTML = `
    <div class="order-result-box fixed">
      ✅ Fixed Result: $${total.toFixed(2)}<br>
      Subtotal: $${subtotal.toFixed(2)}<br>
      ${hasDiscount
        ? `Discount applied (10%): -$${(subtotal - total).toFixed(2)}`
        : "No discount (order under $100)"}
    </div>
  `;
}

// INITIALIZE

renderOrderTable();