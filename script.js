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
const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');
const editForm = document.getElementById('editForm');

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
  transactions.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort transactions by date
  updateBalance();
  updateTransactionList();
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
    <button class="edit" data-id="${transaction.id}">Edit</button>
    <button class="delete" data-id="${transaction.id}">Delete</button>
  `;

  // Attach delete event listener
  const deleteBtn = transactionEl.querySelector('.delete');
  deleteBtn.addEventListener('click', () => deleteTransaction(transaction.id));

  // Attach edit event listener
  const editBtn = transactionEl.querySelector('.edit');
  editBtn.addEventListener('click', () => editTransaction(transaction.id));

  list.appendChild(transactionEl);
};

// Function to edit a transaction
const editTransaction = id => {
  const transaction = transactions.find(transaction => transaction.id === id);

  // Populate edit form with transaction details
  document.getElementById('editName').value = transaction.name;
  document.getElementById('editAmount').value = Math.abs(transaction.amount);
  document.getElementById('editDate').value = transaction.date;

  // Show overlay and popup
  overlay.style.display = 'block';
  popup.style.display = 'block';

  // Handle form submission
  editForm.onsubmit = e => {
    e.preventDefault();

    // Update transaction details
    transaction.name = document.getElementById('editName').value;
    transaction.amount = parseFloat(
      document.getElementById('editAmount').value
    );
    transaction.date = document.getElementById('editDate').value;

    // Close popup
    overlay.style.display = 'none';
    popup.style.display = 'none';

    // Sort transactions by date after editing
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Update UI
    updateTransactionList();
    updateBalance();
  };

  // Close popup when close button is clicked
  document.getElementById('closePopup').onclick = () => {
    overlay.style.display = 'none';
    popup.style.display = 'none';
  };
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
