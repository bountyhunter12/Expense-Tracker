const form = document.querySelector(".add");
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

let transactions =
  localStorage.getItem("transactions") !== null
    ? JSON.parse(localStorage.getItem("transactions"))
    : [];

function updateStatistics() {
  const updatedIncome = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => (total += transaction.amount), 0);

  const updatedExpense = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => (total += Math.abs(transaction.amount)), 0);

  const updatedBalance = updatedIncome - updatedExpense;
  balance.textContent = updatedBalance;
  income.textContent = updatedIncome;
  expense.textContent = updatedExpense;
}

function generateTemplate(id, source, amount, time) {
    return `<li data-id="${id}">
                  <p>
                      <span>${source}</span>
                      <span id="time">${time}</span>
                  </p>
                  $<span">${Math.abs(amount)}</span>
                  <i class="bi bi-trash delete"></i>
                  <i class="bi bi-pencil-square edit"></i>
              </li>`;
  }
  
function addTransactionDOM(id, source, amount, time) {
  if (amount > 0) {
    incomeList.innerHTML += generateTemplate(id, source, amount, time);
  } else {
    expenseList.innerHTML += generateTemplate(id, source, amount, time);
  }
}

function addTransaction(source, amount) {
  const time = new Date();
  const transaction = {
    id: Math.floor(Math.random() * 100000),
    source: source,
    amount: amount,
    time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`,
  };
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  addTransactionDOM(transaction.id, source, amount, transaction.time);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (form.source.value.trim() === "" || form.amount.value === "") {
    return alert("Please add proper values!");
  }
  addTransaction(form.source.value.trim(), Number(form.amount.value));
  updateStatistics();
  form.reset();
});

function getTransaction() {
  transactions.forEach((transaction) => {
    if (transaction.amount > 0) {
      incomeList.innerHTML += generateTemplate(
        transaction.id,
        transaction.source,
        transaction.amount,
        transaction.time
      );
    } else {
      expenseList.innerHTML += generateTemplate(
        transaction.id,
        transaction.source,
        transaction.amount,
        transaction.time
      );
    }
  });
}

function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => {
    return transaction.id !== id;
  });
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function editTransaction(id) {
  const transaction = transactions.find(transaction => transaction.id === id);
  if (transaction) {
    form.source.value = transaction.source;
    form.amount.value = transaction.amount;
    deleteTransaction(id);
    document.querySelector(`[data-id="${id}"]`).remove();
    updateStatistics();
  }
}

incomeList.addEventListener("click", (event) => {
  const id = Number(event.target.parentElement.dataset.id);
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    deleteTransaction(id);
    updateStatistics();
  } else if (event.target.classList.contains("edit")) {
    editTransaction(id);
  }
});

expenseList.addEventListener("click", (event) => {
  const id = Number(event.target.parentElement.dataset.id);
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    deleteTransaction(id);
    updateStatistics();
  } else if (event.target.classList.contains("edit")) {
    editTransaction(id);
  }
});

function init() {
  updateStatistics();
  getTransaction();
}

init();
