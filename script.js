/* ==========================================
   Expense Tracker Pro v2.0
   Part 1A - Variables + Local Storage
========================================== */

// ===== Form =====
const transactionForm = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");

// ===== Summary =====
const totalBalance = document.getElementById("totalBalance");
const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const totalSavings = document.getElementById("totalSavings");

// ===== Inputs =====
const title = document.getElementById("title");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const category = document.getElementById("category");
const date = document.getElementById("date");

// ===== Search & Filter =====
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");
const filterCategory = document.getElementById("filterCategory");

// ===== Budget =====
const budgetInput = document.getElementById("budgetInput");
const saveBudget = document.getElementById("saveBudget");
const budgetStatus = document.getElementById("budgetStatus");

// ===== Theme =====
const themeToggle = document.getElementById("themeToggle");

// ===== Data =====
let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

let monthlyBudget =
    Number(localStorage.getItem("monthlyBudget")) || 0;

// ===== Save =====
function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    localStorage.setItem(
        "monthlyBudget",
        monthlyBudget
    );

}

// ===== Money Format =====
function formatMoney(value) {

    return "₹" + Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2
    });

}

// ===== App Init =====
function init() {

    saveData();

}

init();
/* ==========================================
   Part 1B
   Add Transaction
========================================== */

transactionForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const transactionTitle = title.value.trim();
    const transactionAmount = Number(amount.value);

    if (
        transactionTitle === "" ||
        transactionAmount <= 0 ||
        date.value === ""
    ) {
        alert("Please fill all fields correctly.");
        return;
    }

    const newTransaction = {
        id: Date.now(),
        title: transactionTitle,
        amount: transactionAmount,
        type: type.value,
        category: category.value,
        date: date.value
    };

    transactions.push(newTransaction);

    saveData();

    if (typeof renderTransactions === "function") {
        renderTransactions();
    }

    transactionForm.reset();

    type.value = "expense";
    category.value = "Other";
});
/* ==========================================
   Part 2
   Render Transactions + Update Summary
========================================== */

function updateSummary() {

    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }

    });

    const balance = income - expense;
    const savings = balance;

    totalIncome.textContent = formatMoney(income);
    totalExpense.textContent = formatMoney(expense);
    totalBalance.textContent = formatMoney(balance);
    totalSavings.textContent = formatMoney(savings);

}

function renderTransactions() {

    transactionList.innerHTML = "";

    if (transactions.length === 0) {

        transactionList.innerHTML = `
            <div class="empty">
                No Transactions Yet
            </div>
        `;

        updateSummary();
        return;
    }

    transactions
        .slice()
        .reverse()
        .forEach(transaction => {

            const div = document.createElement("div");

            div.className = `transaction-item ${transaction.type}`;

            div.innerHTML = `
                <div class="transaction-left">

                    <h3>${transaction.title}</h3>

                    <small>
                        ${transaction.category} • ${transaction.date}
                    </small>

                </div>

                <div class="transaction-right">

                    <strong>
                        ${transaction.type === "income" ? "+" : "-"}
                        ${formatMoney(transaction.amount)}
                    </strong>

                    <div class="action-buttons">

                        <button
                            class="edit-btn"
                            onclick="editTransaction(${transaction.id})">
                            ✏️
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteTransaction(${transaction.id})">
                            🗑️
                        </button>

                    </div>

                </div>
            `;

            transactionList.appendChild(div);

        });

    updateSummary();

}

// App start hone par purana data dikhaye
renderTransactions();
/* ==========================================
   Part 3
   Search + Filter + Dark Mode
========================================== */

// ===== Search & Filter =====

function filterTransactions() {

    const search = searchInput.value.trim().toLowerCase();
    const selectedType = filterType.value;
    const selectedCategory = filterCategory.value;

    transactionList.innerHTML = "";

    const filtered = transactions.filter(transaction => {

        const matchSearch =
            transaction.title.toLowerCase().includes(search);

        const matchType =
            selectedType === "all" ||
            transaction.type === selectedType;

        const matchCategory =
            selectedCategory === "all" ||
            transaction.category === selectedCategory;

        return matchSearch && matchType && matchCategory;

    });

    if (filtered.length === 0) {

        transactionList.innerHTML = `
            <div class="empty">
                No Transactions Found
            </div>
        `;

        return;
    }

    filtered
        .slice()
        .reverse()
        .forEach(transaction => {

            const div = document.createElement("div");

            div.className = `transaction-item ${transaction.type}`;

            div.innerHTML = `
                <div class="transaction-left">

                    <h3>${transaction.title}</h3>

                    <small>
                        ${transaction.category} • ${transaction.date}
                    </small>

                </div>

                <div class="transaction-right">

                    <strong>
                        ${transaction.type === "income" ? "+" : "-"}
                        ${formatMoney(transaction.amount)}
                    </strong>

                    <div class="action-buttons">

                        <button
                            class="edit-btn"
                            onclick="editTransaction(${transaction.id})">
                            ✏️
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteTransaction(${transaction.id})">
                            🗑️
                        </button>

                    </div>

                </div>
            `;

            transactionList.appendChild(div);

        });

}

// ===== Events =====

if (searchInput) {
    searchInput.addEventListener("input", filterTransactions);
}

if (filterType) {
    filterType.addEventListener("change", filterTransactions);
}

if (filterCategory) {
    filterCategory.addEventListener("change", filterTransactions);
}

// ===== Dark Mode =====

if (themeToggle) {

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        localStorage.setItem(
            "theme",
            document.body.classList.contains("dark-mode")
                ? "dark"
                : "light"
        );

    });

}
/* ==========================================
   Part 4
   Monthly Budget + Charts
========================================== */

// ===== Charts =====

let incomeExpenseChart = null;

// ===== Budget =====

if (budgetStatus) {
    budgetStatus.textContent =
        "Budget : " + formatMoney(monthlyBudget);
}

if (saveBudget) {

    saveBudget.addEventListener("click", () => {

        monthlyBudget = Number(budgetInput.value) || 0;

        saveData();

        budgetStatus.textContent =
            "Budget : " + formatMoney(monthlyBudget);

        alert("Monthly Budget Saved Successfully ✅");

    });

}

// ===== Chart =====

function loadCharts() {

    const chartCanvas =
        document.getElementById("incomeExpenseChart");

    if (!chartCanvas || typeof Chart === "undefined") {
        return;
    }

    const income = transactions
        .filter(t => t.type === "income")
        .reduce((total, t) => total + t.amount, 0);

    const expense = transactions
        .filter(t => t.type === "expense")
        .reduce((total, t) => total + t.amount, 0);

    if (incomeExpenseChart) {
        incomeExpenseChart.destroy();
    }

    incomeExpenseChart = new Chart(chartCanvas, {

        type: "doughnut",

        data: {

            labels: [
                "Income",
                "Expense"
            ],

            datasets: [{
                data: [
                    income,
                    expense
                ],
                backgroundColor: [
                    "#4CAF50",
                    "#F44336"
                ],
                borderWidth: 2
            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    position: "bottom"
                }

            }

        }

    });

}

// Chart ko app start par load karo
loadCharts();
/* ==========================================
   Part 5
   Edit + Delete Transaction
========================================== */

// ===== Delete Transaction =====

function deleteTransaction(id) {

    const confirmDelete = confirm(
        "Delete this transaction?"
    );

    if (!confirmDelete) return;

    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    saveData();
    renderTransactions();
    loadCharts();

}

// ===== Edit Transaction =====

function editTransaction(id) {

    const transaction = transactions.find(
        transaction => transaction.id === id
    );

    if (!transaction) return;

    title.value = transaction.title;
    amount.value = transaction.amount;
    type.value = transaction.type;
    category.value = transaction.category;
    date.value = transaction.date;

    // Old transaction remove
    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    saveData();
    renderTransactions();
    loadCharts();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

// ===== Refresh UI =====

function refreshApp() {

    updateSummary();
    renderTransactions();
    loadCharts();

}

// ===== App Start =====

refreshApp();

console.log("Expense Tracker Pro v2.0 Loaded Successfully ✅");
/* ==========================================
   Part 6
   Final Improvements + Bug Fixes
========================================== */

// ===== Reset Filters =====

function resetFilters() {

    if (searchInput) searchInput.value = "";
    if (filterType) filterType.value = "all";
    if (filterCategory) filterCategory.value = "all";

    renderTransactions();

}

// ===== Clear All Transactions =====

function clearAllTransactions() {

    if (transactions.length === 0) {
        alert("No transactions available.");
        return;
    }

    if (!confirm("Delete all transactions?")) {
        return;
    }

    transactions = [];

    saveData();
    refreshApp();

}

// ===== Budget Warning =====

function checkBudget() {

    if (monthlyBudget <= 0) return;

    const expense = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    if (expense > monthlyBudget) {

        alert("⚠️ Monthly Budget Exceeded!");

    }

}

// ===== Improved Refresh =====

function refreshApp() {

    updateSummary();
    renderTransactions();

    if (typeof loadCharts === "function") {
        loadCharts();
    }

    checkBudget();

}

// ===== Initial Load =====

refreshApp();

console.log("Expense Tracker Pro v2.0 Ready 🚀");