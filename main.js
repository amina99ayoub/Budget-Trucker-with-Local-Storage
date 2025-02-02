// Select UI elements
const form = document.getElementById("form");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");
const errorMsg = document.getElementById("error_msg");
const list = document.getElementById("list");
const incomeDisplay = document.getElementById("income");
const expenseDisplay = document.getElementById("expense");
const balanceDisplay = document.getElementById("balance");

// Transactions array
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Initialize the app
function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Add transaction
function addTransaction(e) {
  e.preventDefault();
  const text = textInput.value.trim();
  const amount = amountInput.value.trim();

  if (text === "" || amount === "") {
    errorMsg.textContent = "Please provide both description and amount!";
    setTimeout(() => (errorMsg.textContent = ""), 3000);
    return;
  }

  const transaction = {
    id: generateID(),
    text,
    amount: +amount,
  };

  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  textInput.value = "";
  amountInput.value = "";
}

// Generate a unique ID
function generateID() {
  return Math.floor(Math.random() * 1000000);
}

// Add transaction to the DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.innerHTML = `
    ${transaction.text} <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

// Update balance, income, and expense
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);

  const income = amounts
    .filter((value) => value > 0)
    .reduce((acc, value) => acc + value, 0)
    .toFixed(2);

  const expense = (
    amounts.filter((value) => value < 0).reduce((acc, value) => acc + value, 0) *
    -1
  ).toFixed(2);

  const balance = amounts.reduce((acc, value) => acc + value, 0).toFixed(2);

  incomeDisplay.textContent = `$${income}`;
  expenseDisplay.textContent = `$${expense}`;
  balanceDisplay.textContent = `$${balance}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Update local storage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Event listener
form.addEventListener("submit", addTransaction);

// Initialize the app
init();
