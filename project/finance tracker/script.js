let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

let chart;

// ======================
// UPDATE UI
// ======================

function updateUI() {

  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    if (t.type === "income") {
      income += t.amount;
    } else {
      expense += t.amount;
    }
  });

  const balance = income - expense;

  document.getElementById("income").textContent =
    "Rp " + income.toLocaleString("id-ID");

  document.getElementById("expense").textContent =
    "Rp " + expense.toLocaleString("id-ID");

  document.getElementById("balance").textContent =
    "Rp " + balance.toLocaleString("id-ID");

  renderTable();

  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );

  updateChart(income, expense);

  // FITUR BARU
  updateMonthlyChart();
  updateInsight();
  updateGoal();
  updateProgress(income, expense);

}

// ======================
// TAMBAH TRANSAKSI
// ======================

function addTransaction() {

  const desc =
    document.getElementById("desc").value.trim();

    const category =
    document.getElementById("category").value;

  const amount =
    parseInt(document.getElementById("amount").value);

  const type =
    document.getElementById("type").value;

  if (!desc || !amount || amount <= 0) {
    showToast("⚠ Lengkapi data dengan benar");
    return;
  }

  transactions.unshift({
    desc,
    amount,
    type,
    category,
    date: new Date().toLocaleDateString("id-ID")
});

  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";

  updateUI();

  showToast("✅ Transaksi berhasil ditambahkan");
}

// ======================
// TABEL
// ======================

function renderTable() {

  const tbody =
    document.getElementById("tableBody");

  const search =
    document.getElementById("search").value.toLowerCase();

  const filter =
    document.getElementById("filter").value;

  let data = transactions.filter(t => {

    const matchSearch =
      t.desc.toLowerCase().includes(search);

    const matchFilter =
      filter === "all" ||
      t.type === filter;

    return matchSearch && matchFilter;
  });

  tbody.innerHTML = "";

  data.forEach((t, index) => {

    tbody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${t.desc}</td>
        <td>${t.date}</td>
        <td>
          ${t.type === "income"
            ? "📈 Pemasukan"
            : "📉 Pengeluaran"}
        </td>
        <td>
          Rp ${t.amount.toLocaleString("id-ID")}
        </td>
        <td>
          <button onclick="deleteTransaction(${transactions.indexOf(t)})">
            ❌
          </button>
        </td>
      </tr>
    `;
  });
}

// ======================
// HAPUS
// ======================

function deleteTransaction(index) {

  if (confirm("Hapus transaksi ini?")) {

    transactions.splice(index, 1);

    updateUI();

    showToast("🗑 Data dihapus");
  }
}

// ======================
// CHART
// ======================

function updateChart(income, expense) {

  const ctx =
    document.getElementById("financeChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {

    type: "doughnut",

    data: {

      labels: [
        "Pemasukan",
        "Pengeluaran"
      ],

      datasets: [{
        data: [income, expense],
        borderWidth: 0
      }]
    },

    options: {

      responsive: true,

      plugins: {
        legend: {
          labels: {
            color: "#fff"
          }
        }
      }
    }
  });
}

// ======================
// PROGRESS BAR
// ======================

function updateProgress(income, expense) {

  let percent = 0;

  if (income > 0) {
    percent = (expense / income) * 100;
  }

  document.getElementById("progressBar")
    .style.width =
    Math.min(percent, 100) + "%";
}

// ======================
// TOAST
// ======================

function showToast(message) {

  const toast =
    document.getElementById("toast");

  toast.textContent = message;

  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
  }, 2500);
}

// ======================
// RESET
// ======================

function resetData() {

  if (confirm("Hapus semua data?")) {

    transactions = [];

    updateUI();

    showToast("🧹 Semua data dihapus");
  }
}

// ======================
// EXPORT CSV
// ======================

function exportCSV() {

  let csv =
    "Transaksi,Tanggal,Jenis,Nominal\n";

  transactions.forEach(t => {

    csv +=
      `${t.desc},${t.date},${t.type},${t.amount}\n`;
  });

  const blob =
    new Blob([csv], {
      type: "text/csv"
    });

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;
  a.download = "finance-tracker.csv";

  a.click();

  showToast("📥 CSV berhasil diexport");
}

// ======================
// GREETING
// ======================

function updateGreeting() {

  const hour =
    new Date().getHours();

  let text = "";

  if (hour < 12) {
    text = "☀ Selamat Pagi, Bro";
  }
  else if (hour < 18) {
    text = "🌤 Selamat Siang, Bro";
  }
  else {
    text = "🌙 Selamat Malam, Bro";
  }

  document.getElementById("greeting")
    .textContent = text;
}

// ======================
// CLOCK
// ======================

function updateClock() {

  const now = new Date();

  document.getElementById("clock-time")
    .textContent =
    now.toLocaleTimeString("id-ID");

  document.getElementById("clock-date")
    .textContent =
    now.toLocaleDateString("id-ID");
}

setInterval(updateClock, 1000);

// ======================
// SEARCH & FILTER
// ======================

document
  .getElementById("search")
  .addEventListener("input", renderTable);

document
  .getElementById("filter")
  .addEventListener("change", renderTable);

// ======================
// INIT
// ======================

updateGreeting();
updateClock();
updateUI();

document.addEventListener("DOMContentLoaded", () => {

  const themeBtn =
  document.getElementById("themeBtn");

  if(!themeBtn) return;

  themeBtn.onclick = () => {

    document.body.classList.toggle("light-mode");

    localStorage.setItem(
      "theme",
      document.body.classList.contains("light-mode")
    );
  };

  if(localStorage.getItem("theme") === "true"){
    document.body.classList.add("light-mode");
  }

});

let monthlyChart;

function updateMonthlyChart(){

 const income =
 transactions
 .filter(x=>x.type==="income")
 .reduce((a,b)=>a+b.amount,0);

 const expense =
 transactions
 .filter(x=>x.type==="expense")
 .reduce((a,b)=>a+b.amount,0);

 const ctx =
 document.getElementById("monthlyChart");

 if(monthlyChart)
 monthlyChart.destroy();

 monthlyChart =
 new Chart(ctx,{

   type:"bar",

   data:{
     labels:["Pemasukan","Pengeluaran"],

     datasets:[{
       data:[income,expense]
     }]
   }
 });
}

// target bulanan //
let savingGoal =
localStorage.getItem("savingGoal") || 0;

function saveGoal(){

 savingGoal =
 parseInt(
 document.getElementById("savingGoal").value
 );

 localStorage.setItem(
 "savingGoal",
 savingGoal
 );

 updateGoal();
}

function updateGoal(){

 const balance =
 parseCurrency(
 document.getElementById("balance")
 .textContent
 );

 const percent =
 savingGoal > 0
 ? Math.round((balance/savingGoal)*100)
 : 0;

 document.getElementById("goalText")
 .textContent =
 `Target Rp ${savingGoal.toLocaleString()}
 (${percent}%)`;
}

function updateInsight(){

 let income = 0;
 let expense = 0;

 transactions.forEach(t=>{

   if(t.type==="income")
      income += t.amount;
   else
      expense += t.amount;
 });

 let msg = "";

 if(expense > income){

   msg =
   "⚠ Pengeluaran melebihi pemasukan.";

 }
 else if(expense > income*0.8){

   msg =
   "📉 Pengeluaran sudah mencapai 80% pemasukan.";

 }
 else{

   msg =
   "✅ Kondisi keuangan cukup sehat.";
 }

 document.getElementById(
 "insightText"
 ).textContent = msg;
}
document.getElementById("backBtn").addEventListener("click", function(e){

  e.preventDefault();

  document.body.style.opacity = "0";

  setTimeout(() => {
    window.location.href = this.href;
  }, 300);

});