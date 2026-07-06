// ===========================
// STATE
// ===========================
let transactions = JSON.parse(localStorage.getItem('ft_transactions')) || [];
let savingGoal   = parseInt(localStorage.getItem('ft_goal')) || 0;
let charts       = {};

// ===========================
// INIT
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  // Theme
  const saved = localStorage.getItem('ft_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('themeBtn').textContent = saved === 'dark' ? '🌙' : '☀️';
  document.getElementById('themeBtn').addEventListener('click', toggleTheme);

  // Type selector
  document.querySelectorAll('.type-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.type-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('type').value = btn.dataset.val;
    });
  });

  // Chart tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.chart-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('pane-' + btn.dataset.tab).classList.add('active');
    });
  });

  // Search & filter
  document.getElementById('search').addEventListener('input', renderTable);
  document.getElementById('filter').addEventListener('change', renderTable);
  document.getElementById('filterCategory').addEventListener('change', renderTable);

  // Goal input if saved
  if (savingGoal > 0) document.getElementById('savingGoal').value = savingGoal;

  startClock();
  updateGreeting();
  updateUI();
  initParticles();
});

// ===========================
// CLOCK + GREETING
// ===========================
function startClock() {
  function tick() {
    const now = new Date();
    document.getElementById('clock-time').textContent = now.toLocaleTimeString('id-ID');
    document.getElementById('clock-date').textContent = now.toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }
  tick();
  setInterval(tick, 1000);
}

function updateGreeting() {
  const h = new Date().getHours();
  let msg = h < 12 ? '☀️ Selamat Pagi!' : h < 18 ? '🌤️ Selamat Siang!' : '🌙 Selamat Malam!';
  document.getElementById('greeting').textContent = msg;
}

// ===========================
// ADD TRANSACTION
// ===========================
function addTransaction() {
  const desc   = document.getElementById('desc').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const type   = document.getElementById('type').value;
  const cat    = document.getElementById('category').value;

  if (!desc || !amount || amount <= 0) {
    showToast('⚠️ Lengkapi nama dan nominal transaksi!', 'warning');
    return;
  }

  transactions.unshift({
    id:     Date.now(),
    desc,
    amount,
    type,
    category: cat,
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  });

  document.getElementById('desc').value   = '';
  document.getElementById('amount').value = '';

  saveData();
  updateUI();

  const label = type === 'income' ? 'Pemasukan' : 'Pengeluaran';
  showToast(`✅ ${label} ditambahkan: Rp ${amount.toLocaleString('id-ID')}`, 'success');
}

// ===========================
// DELETE
// ===========================
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveData();
  updateUI();
  showToast('🗑️ Transaksi dihapus', 'info');
}

// ===========================
// UPDATE UI (master)
// ===========================
function updateUI() {
  const income  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  const saving  = balance > 0 ? balance : 0;

  // Animate numbers
  animateValue('income',  income);
  animateValue('expense', expense);
  animateValue('balance', balance);
  animateValue('saving',  saving);

  // Balance trend badge
  const trend = document.getElementById('balanceTrend');
  if (balance > 0) {
    trend.textContent = '▲ Surplus';
    trend.style.cssText = 'background:rgba(52,211,153,0.15);color:#34d399;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;margin-left:auto;';
  } else if (balance < 0) {
    trend.textContent = '▼ Defisit';
    trend.style.cssText = 'background:rgba(248,113,113,0.15);color:#f87171;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;margin-left:auto;';
  } else {
    trend.textContent = '';
  }

  renderTable();
  updateCharts(income, expense);
  updateProgress(income, expense);
  updateGoalDisplay(saving);
  updateInsight(income, expense, balance);
  updateCategoryFilter();
}

// ===========================
// ANIMATE NUMBER
// ===========================
function animateValue(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const prefix = id === 'balance' && target < 0 ? '-Rp ' : 'Rp ';
  const absTarget = Math.abs(target);
  const duration = 700;
  const start = performance.now();
  const from = 0;
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = Math.round(from + (absTarget - from) * ease);
    el.textContent = prefix + val.toLocaleString('id-ID');
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = prefix + absTarget.toLocaleString('id-ID');
  }
  requestAnimationFrame(step);
}

// ===========================
// RENDER TABLE
// ===========================
function renderTable() {
  const q       = document.getElementById('search').value.toLowerCase();
  const filter  = document.getElementById('filter').value;
  const catFil  = document.getElementById('filterCategory').value;
  const tbody   = document.getElementById('tableBody');
  const empty   = document.getElementById('emptyState');

  let data = transactions.filter(t => {
    const matchQ   = t.desc.toLowerCase().includes(q) || (t.category || '').toLowerCase().includes(q);
    const matchT   = filter === 'all' || t.type === filter;
    const matchCat = catFil === 'all' || t.category === catFil;
    return matchQ && matchT && matchCat;
  });

  if (data.length === 0) {
    tbody.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  tbody.innerHTML = data.map((t, i) => {
    const badgeClass = t.type === 'income' ? 'badge-income' : 'badge-expense';
    const label      = t.type === 'income' ? '📈 Masuk' : '📉 Keluar';
    const amtColor   = t.type === 'income' ? '#34d399' : '#f87171';
    const sign       = t.type === 'income' ? '+' : '-';
    return `
      <tr class="row-in" style="animation-delay:${i * 35}ms">
        <td style="color:var(--muted);font-size:12px;">${i + 1}</td>
        <td><strong>${escHtml(t.desc)}</strong></td>
        <td><span class="cat-badge">${escHtml(t.category || 'Lainnya')}</span></td>
        <td style="color:var(--muted);font-size:13px;">${t.date}</td>
        <td><span class="${badgeClass}">${label}</span></td>
        <td style="font-weight:700;color:${amtColor};">${sign}Rp ${t.amount.toLocaleString('id-ID')}</td>
        <td><button class="btn-del" onclick="deleteTransaction(${t.id})" title="Hapus">🗑</button></td>
      </tr>`;
  }).join('');
}

// ===========================
// CATEGORY FILTER UPDATE
// ===========================
function updateCategoryFilter() {
  const sel = document.getElementById('filterCategory');
  const current = sel.value;
  const cats = [...new Set(transactions.map(t => t.category).filter(Boolean))].sort();
  sel.innerHTML = '<option value="all">Semua Kategori</option>' +
    cats.map(c => `<option value="${escHtml(c)}" ${current === c ? 'selected' : ''}>${escHtml(c)}</option>`).join('');
}

// ===========================
// CHARTS
// ===========================
function updateCharts(income, expense) {
  updateDonutChart(income, expense);
  updateBarChart(income, expense);
  updateCategoryChart();
}

function chartColors() {
  return {
    primary: '#38bdf8',
    accent:  '#818cf8',
    green:   '#34d399',
    red:     '#f87171',
    yellow:  '#fbbf24',
    textColor: document.documentElement.getAttribute('data-theme') === 'light' ? '#0f172a' : '#e2e8f0',
    gridColor: document.documentElement.getAttribute('data-theme') === 'light' ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.06)'
  };
}

function updateDonutChart(income, expense) {
  const ctx = document.getElementById('donutChart');
  if (charts.donut) charts.donut.destroy();
  const c = chartColors();
  charts.donut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Pemasukan', 'Pengeluaran'],
      datasets: [{ data: [income, expense], backgroundColor: [c.green, c.red], borderWidth: 0, hoverOffset: 8 }]
    },
    options: {
      responsive: true,
      cutout: '68%',
      plugins: {
        legend: { labels: { color: c.textColor, font: { family: 'Poppins', size: 12 }, padding: 16 } },
        tooltip: {
          callbacks: {
            label: ctx => ` Rp ${ctx.raw.toLocaleString('id-ID')}`
          }
        }
      }
    }
  });
}

function updateBarChart(income, expense) {
  const ctx = document.getElementById('barChart');
  if (charts.bar) charts.bar.destroy();
  const c = chartColors();
  charts.bar = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Pemasukan', 'Pengeluaran'],
      datasets: [{
        data: [income, expense],
        backgroundColor: [
          'rgba(52,211,153,0.7)',
          'rgba(248,113,113,0.7)'
        ],
        borderRadius: 10,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` Rp ${ctx.raw.toLocaleString('id-ID')}` } }
      },
      scales: {
        x: { ticks: { color: c.textColor, font: { family: 'Poppins' } }, grid: { display: false } },
        y: { ticks: { color: c.textColor, font: { family: 'Poppins', size: 11 }, callback: v => 'Rp ' + (v/1000).toFixed(0) + 'rb' }, grid: { color: c.gridColor } }
      }
    }
  });
}

function updateCategoryChart() {
  const ctx = document.getElementById('categoryChart');
  if (charts.category) charts.category.destroy();
  const c = chartColors();

  const expenseOnly = transactions.filter(t => t.type === 'expense');
  const catMap = {};
  expenseOnly.forEach(t => {
    catMap[t.category || 'Lainnya'] = (catMap[t.category || 'Lainnya'] || 0) + t.amount;
  });

  const labels = Object.keys(catMap);
  const data   = Object.values(catMap);
  const colors = ['#38bdf8','#818cf8','#34d399','#fbbf24','#f87171','#f472b6','#a78bfa'];

  charts.category = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: colors.slice(0, labels.length), borderWidth: 0, hoverOffset: 6 }]
    },
    options: {
      responsive: true,
      cutout: '60%',
      plugins: {
        legend: { labels: { color: c.textColor, font: { family: 'Poppins', size: 11 }, padding: 12 } },
        tooltip: { callbacks: { label: ctx => ` Rp ${ctx.raw.toLocaleString('id-ID')}` } }
      }
    }
  });
}

// ===========================
// PROGRESS BAR
// ===========================
function updateProgress(income, expense) {
  const pct = income > 0 ? Math.min((expense / income) * 100, 100) : 0;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressPct').textContent = Math.round(pct) + '%';
}

// ===========================
// GOAL
// ===========================
function saveGoal() {
  const val = parseInt(document.getElementById('savingGoal').value);
  if (!val || val <= 0) { showToast('⚠️ Masukkan target yang valid!', 'warning'); return; }
  savingGoal = val;
  localStorage.setItem('ft_goal', savingGoal);
  const income  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  updateGoalDisplay(Math.max(income - expense, 0));
  showToast(`🎯 Target tabungan disimpan: Rp ${savingGoal.toLocaleString('id-ID')}`, 'success');
}

function updateGoalDisplay(saving) {
  if (savingGoal <= 0) return;
  const pct  = Math.min(Math.round((saving / savingGoal) * 100), 100);
  document.getElementById('goalBarFill').style.width = pct + '%';
  const emoji = pct >= 100 ? '🎉' : pct >= 75 ? '💪' : pct >= 50 ? '📈' : '📊';
  document.getElementById('goalText').textContent =
    `${emoji} Rp ${saving.toLocaleString('id-ID')} / Rp ${savingGoal.toLocaleString('id-ID')} (${pct}%)`;
}

// ===========================
// INSIGHT
// ===========================
function updateInsight(income, expense, balance) {
  let msg = '';
  if (transactions.length === 0) {
    msg = '📋 Belum ada transaksi. Mulai catat keuanganmu!';
  } else if (expense > income) {
    msg = '⚠️ Pengeluaran melebihi pemasukan! Coba kurangi pengeluaran yang tidak perlu.';
  } else if (expense > income * 0.8) {
    msg = '📉 Pengeluaran sudah 80%+ dari pemasukan. Hati-hati!';
  } else if (balance > 0) {
    msg = '✅ Keuangan sehat! Saldo positif dan pengeluaran terkontrol.';
  }
  document.getElementById('insightText').textContent = msg;

  // Category breakdown
  const extra = document.getElementById('insightExtra');
  const expenseOnly = transactions.filter(t => t.type === 'expense');
  const total = expenseOnly.reduce((s, t) => s + t.amount, 0);
  const catMap = {};
  expenseOnly.forEach(t => { catMap[t.category || 'Lainnya'] = (catMap[t.category || 'Lainnya'] || 0) + t.amount; });
  const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const barColors = ['#f87171', '#fbbf24', '#38bdf8', '#818cf8'];
  extra.innerHTML = sorted.map(([cat, amt], i) => {
    const pct = total > 0 ? Math.round((amt / total) * 100) : 0;
    return `<div class="insight-row">
      <span style="min-width:80px;">${cat}</span>
      <div class="insight-bar-track">
        <div class="insight-bar-fill" style="width:${pct}%;background:${barColors[i] || '#94a3b8'};"></div>
      </div>
      <span style="min-width:36px;text-align:right;">${pct}%</span>
    </div>`;
  }).join('');
}

// ===========================
// EXPORT CSV
// ===========================
function exportCSV() {
  if (transactions.length === 0) { showToast('⚠️ Tidak ada data untuk diekspor', 'warning'); return; }
  const header = 'No,Transaksi,Kategori,Tanggal,Jenis,Nominal\n';
  const rows = transactions.map((t, i) =>
    `${i+1},"${t.desc}","${t.category || '-'}","${t.date}","${t.type}",${t.amount}`
  ).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `finance-tracker_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 Data diekspor ke CSV!', 'success');
}

// ===========================
// RESET
// ===========================
function resetData() {
  if (transactions.length === 0) { showToast('⚠️ Tidak ada data', 'warning'); return; }
  if (!confirm(`Hapus ${transactions.length} transaksi? Tindakan ini tidak bisa dibatalkan.`)) return;
  transactions = [];
  saveData();
  updateUI();
  showToast('🧹 Semua data dihapus', 'info');
}

// ===========================
// THEME
// ===========================
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next   = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  document.getElementById('themeBtn').textContent = next === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('ft_theme', next);
  // Rebuild charts with new colors
  const income  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  updateCharts(income, expense);
}

// ===========================
// TOAST
// ===========================
function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 3200);
}

// ===========================
// HELPERS
// ===========================
function saveData() {
  localStorage.setItem('ft_transactions', JSON.stringify(transactions));
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ===========================
// PARTICLES
// ===========================
function initParticles() {
  if (typeof particlesJS === 'undefined') return;
  particlesJS('particles-js', {
    particles: {
      number: { value: 45, density: { enable: true, value_area: 900 } },
      color: { value: ['#38bdf8', '#818cf8', '#34d399'] },
      shape: { type: 'circle' },
      opacity: { value: 0.35, random: true },
      size: { value: 3, random: true },
      line_linked: { enable: true, distance: 140, color: '#38bdf8', opacity: 0.2, width: 1 },
      move: { enable: true, speed: 1.4, random: true, out_mode: 'out' }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
      modes: { grab: { distance: 160, line_linked: { opacity: 0.5 } }, push: { particles_nb: 3 } }
    },
    retina_detect: true
  });
}
