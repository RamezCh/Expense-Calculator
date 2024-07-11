'use strict';

// Selection of the elements
// Header elements
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');

// Add Transaction Elements
const form = document.getElementById('transactionForm');
const nameInput = document.getElementById('name');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');

// Display Transaction Elements
const list = document.getElementById('transactionList');
const status = document.getElementById('status');

// Transaction History Elements
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

// Functions

const addTransaction = e => {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    name: nameInput.value,
    amount: parseFloat(amountInput.value),
    date: dateInput.value,
  };

  transactions.push(transaction);

  if (transaction.amount > 0) {
    income += transaction.amount;
  } else {
    expense += Math.abs(transaction.amount);
  }

  balance += transaction.amount;

  updateBalance();
  displayTransaction(transaction);
  form.reset();
};

const deleteTransaction = id => {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateBalance();
  displayTransaction();
};

const displayTransaction = transaction => {
  const sign = transaction.amount > 0 ? '+' : '-';
  const type = transaction.amount > 0 ? 'income' : 'expense';

  const transactionEl = document.createElement('li');
  transactionEl.classList.add(type);
  transactionEl.innerHTML = `
    <span>${transaction.name}</span>
    <span>${sign}${formatter.format(Math.abs(transaction.amount))}</span>
    <span>${transaction.date}</span>
    <button class="delete" onclick="deleteTransaction(${
      transaction.id
    })">X</button>
  `;

  list.appendChild(transactionEl);
};

const updateBalance = () => {
  balanceEl.textContent = formatter.format(balance);
  incomeEl.textContent = formatter.format(income);
  expenseEl.textContent = formatter.format(expense);
};
// Event listeners
form.addEventListener('submit', addTransaction);
