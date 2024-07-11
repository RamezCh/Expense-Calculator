'use strict';

// Selection of the elements
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const form = document.getElementById('transactionForm');
const nameInput = document.getElementById('name');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const list = document.getElementById('transaction-list');
const status = document.getElementById('status');

// Transaction History
let transactions = [];
let balance = 0;
let income = 0;
let expense = 0;

// Currency Formatter
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  signDisplay: 'never',
});

// Function to add a transaction
const addTransaction = e => {
  e.preventDefault();

  const transaction = createTransaction();
  if (!transaction) return; // Exit if transaction creation fails

  transactions.push(transaction);
  updateBalance();
  displayTransaction(transaction);
  form.reset();
};

// Function to create a transaction object
const createTransaction = () => {
  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const date = dateInput.value.trim();

  // Validate inputs
  if (!name || isNaN(amount) || !date) {
    alert('Please enter valid transaction details.');
    return null;
  }

  return {
    id: Date.now(),
    name,
    amount,
    date,
  };
};

// Function to delete a transaction by ID
const deleteTransaction = id => {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateBalance();
  updateTransactionList(); // Update the entire transaction list after deletion
};

// Function to update the transaction list display
const updateTransactionList = () => {
  // Clear existing list
  list.innerHTML = '';

  // Display each transaction
  transactions.forEach(transaction => {
    displayTransaction(transaction);
  });
};

// Function to display a transaction
const displayTransaction = transaction => {
  const sign = transaction.amount > 0 ? '+' : '-';
  const type = transaction.amount > 0 ? 'income' : 'expense';

  const transactionEl = document.createElement('li');
  transactionEl.classList.add(type);
  transactionEl.innerHTML = `
    <span>${transaction.name}</span>
    <span>${sign}${formatter.format(Math.abs(transaction.amount))}</span>
    <span>${transaction.date}</span>
    <button class="delete" data-id="${transaction.id}">X</button>
  `;

  // Attach delete event listener
  const deleteBtn = transactionEl.querySelector('.delete');
  deleteBtn.addEventListener('click', () => deleteTransaction(transaction.id));

  list.appendChild(transactionEl);
};

// Function to update balance, income, and expense displays
const updateBalance = () => {
  balance = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  income = transactions
    .filter(transaction => transaction.amount > 0)
    .reduce((acc, curr) => acc + curr.amount, 0);
  expense = transactions
    .filter(transaction => transaction.amount < 0)
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

  balanceEl.textContent = formatter.format(balance);
  incomeEl.textContent = formatter.format(income);
  expenseEl.textContent = formatter.format(expense);
};

// Event listener for form submission
form.addEventListener('submit', addTransaction);
