'use strict';

// Selection of the elements
// Header elements
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
// Add Transaction Elements
const form = document.getElementById('transactionForm');
// Display Transaction Elements
const list = document.getElementById('transactionList');
const status = document.getElementById('status');
// Transaction History Elements
let expenses = [];
let income = [];
let balance = 0;

// Currency Formatter
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  signDisplay: 'always',
});

// Functions

const addTransaction = e => {
  e.preventDefault();
};

const deleteTransaction = id => {};

const displayTransaction = transaction => {};

const updateBalance = () => {};
// Event listeners
form.addEventListener('submit', addTransaction);
