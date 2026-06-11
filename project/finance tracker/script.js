let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

function updateUI(){

let income = 0;
let expense = 0;

transactions.forEach(t => {

if(t.type === "income"){
income += t.amount;
}else{
expense += t.amount;
}

});

let balance = income - expense;

document.getElementById("income").textContent =
"Rp " + income.toLocaleString();

document.getElementById("expense").textContent =
"Rp " + expense.toLocaleString();

document.getElementById("balance").textContent =
"Rp " + balance.toLocaleString();

const list = document.getElementById("list");

list.innerHTML = "";

transactions.forEach((t,index)=>{

let li = document.createElement("li");

li.innerHTML = `
<div>
    <strong>${t.desc}</strong><br>
    <small>${t.date}</small>
</div>

<div>
    Rp ${t.amount.toLocaleString()}
    <button onclick="deleteTransaction(${index})">
        ❌
    </button>
</div>
`;

list.appendChild(li);

});

localStorage.setItem(
"transactions",
JSON.stringify(transactions)
);

updateChart(income,expense);

}

function addTransaction(){

const desc =
document.getElementById("desc").value;

const amount =
parseInt(document.getElementById("amount").value);

const type =
document.getElementById("type").value;

if(!desc || !amount){
alert("Lengkapi data");
return;
}

transactions.push({
    desc,
    amount,
    type,
    date: new Date().toLocaleDateString("id-ID")
});

updateUI();
showToast("✅ Transaksi berhasil ditambahkan");

}

function deleteTransaction(index){

    if(confirm("Yakin ingin menghapus transaksi ini?")){

        transactions.splice(index,1);

        updateUI();

        showToast("🗑️ Transaksi dihapus");

    }

}

let chart;

function updateChart(income,expense){

const ctx =
document.getElementById("financeChart");

if(chart){
chart.destroy();
}

chart = new Chart(ctx,{
type:"doughnut",

data:{
labels:["Pemasukan","Pengeluaran"],

datasets:[{
data:[income,expense]
}]
}
});

}

updateUI();
let percent = 0;

if(income > 0){
    percent = (expense / income) * 100;
}

document.getElementById("progressBar").style.width =
Math.min(percent,100) + "%";

function showToast(message){

    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.style.opacity = "1";

    setTimeout(()=>{
        toast.style.opacity = "0";
    },2000);

}
function updateGreeting(){

    const hour = new Date().getHours();

    let greeting;

    if(hour < 12){
        greeting = "☀️ Selamat Pagi";
    }else if(hour < 18){
        greeting = "🌤️ Selamat Siang";
    }else{
        greeting = "🌙 Selamat Malam";
    }

    document.getElementById("greeting").textContent =
    greeting + ", Dzaki";

}

updateGreeting();
function resetData(){

    if(confirm("Hapus semua data?")){

        transactions = [];

        updateUI();

        showToast("🧹 Semua data berhasil dihapus");

    }

}