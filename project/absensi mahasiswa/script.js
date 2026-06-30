// ===========================
// STATE
// ===========================
let absensiData = JSON.parse(localStorage.getItem('absensi_v2')) || [];
let editIndex = -1;
let sortCol = 'tanggal';
let sortAsc = false;
let pendingAction = null;

// ===========================
// INIT
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('tanggal').value = today;

  // Status selector
  document.querySelectorAll('.status-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.status-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('status').value = btn.dataset.val;
    });
  });

  // Sortable headers
  document.querySelectorAll('.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      if (sortCol === col) {
        sortAsc = !sortAsc;
      } else {
        sortCol = col;
        sortAsc = true;
      }
      document.querySelectorAll('.sort-icon').forEach(s => s.textContent = '↕');
      th.querySelector('.sort-icon').textContent = sortAsc ? '↑' : '↓';
      renderTable();
    });
  });

  // Theme
  const savedTheme = localStorage.getItem('absensi_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.getElementById('themeBtn').textContent = savedTheme === 'dark' ? '🌙' : '☀️';
  document.getElementById('themeBtn').addEventListener('click', toggleTheme);

  startClock();
  renderAll();
  initParticles();
});

// ===========================
// CLOCK
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

// ===========================
// SAVE / EDIT
// ===========================
function simpanAbsensi() {
  const nama   = document.getElementById('nama').value.trim();
  const nim    = document.getElementById('nim').value.trim();
  const matkul = document.getElementById('matkul').value.trim();
  const tanggal= document.getElementById('tanggal').value;
  const status = document.getElementById('status').value;

  // Validate
  let valid = true;
  if (!nama) {
    document.getElementById('namaError').textContent = 'Nama tidak boleh kosong';
    document.getElementById('nama').classList.add('error');
    valid = false;
  } else {
    document.getElementById('namaError').textContent = '';
    document.getElementById('nama').classList.remove('error');
  }
  if (!nim) {
    document.getElementById('nimError').textContent = 'NIM tidak boleh kosong';
    document.getElementById('nim').classList.add('error');
    valid = false;
  } else {
    document.getElementById('nimError').textContent = '';
    document.getElementById('nim').classList.remove('error');
  }
  if (!valid) return;

  const entry = { nama, nim, matkul: matkul || '-', tanggal, status, id: Date.now() };

  if (editIndex >= 0) {
    entry.id = absensiData[editIndex].id;
    absensiData[editIndex] = entry;
    showToast('✏️ Absensi berhasil diperbarui!', 'success');
    batalEdit();
  } else {
    absensiData.push(entry);
    showToast('✅ Absensi berhasil disimpan!', 'success');
  }

  saveData();
  resetForm();
  renderAll();
}

function mulaiEdit(index) {
  const item = absensiData[index];
  editIndex = index;

  document.getElementById('nama').value    = item.nama;
  document.getElementById('nim').value     = item.nim;
  document.getElementById('matkul').value  = item.matkul !== '-' ? item.matkul : '';
  document.getElementById('tanggal').value = item.tanggal;
  document.getElementById('status').value  = item.status;

  document.querySelectorAll('.status-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.val === item.status);
  });

  document.getElementById('formTitle').textContent = '✏️ Edit Absensi';
  document.getElementById('saveBtn').querySelector('span').textContent = '💾 Perbarui Absensi';
  document.getElementById('cancelBtn').classList.remove('hidden');

  document.getElementById('nama').focus();
  document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function batalEdit() {
  editIndex = -1;
  resetForm();
  document.getElementById('formTitle').textContent = '➕ Input Absensi';
  document.getElementById('saveBtn').querySelector('span').textContent = '💾 Simpan Absensi';
  document.getElementById('cancelBtn').classList.add('hidden');
}

function resetForm() {
  document.getElementById('nama').value   = '';
  document.getElementById('nim').value    = '';
  document.getElementById('matkul').value = '';
  document.getElementById('tanggal').value = new Date().toISOString().split('T')[0];
  document.getElementById('status').value = 'Hadir';
  document.querySelectorAll('.status-opt').forEach(b => b.classList.remove('active'));
  document.querySelector('.status-opt[data-val="Hadir"]').classList.add('active');
  document.getElementById('namaError').textContent = '';
  document.getElementById('nimError').textContent  = '';
  document.getElementById('nama').classList.remove('error');
  document.getElementById('nim').classList.remove('error');
}

// ===========================
// DELETE
// ===========================
function hapusData(index) {
  pendingAction = () => {
    absensiData.splice(index, 1);
    saveData();
    renderAll();
    showToast('🗑️ Data berhasil dihapus', 'info');
    tutupModal();
  };
  bukaModal('Hapus Absensi', 'Yakin ingin menghapus data absensi ini?');
}

function konfirmasiReset() {
  if (absensiData.length === 0) {
    showToast('⚠️ Tidak ada data untuk dihapus', 'warning');
    return;
  }
  pendingAction = () => {
    absensiData = [];
    saveData();
    renderAll();
    showToast('🗑️ Semua data berhasil dihapus', 'info');
    tutupModal();
  };
  bukaModal('Reset Semua Data', `Yakin ingin menghapus ${absensiData.length} data absensi? Tindakan ini tidak dapat dibatalkan.`);
}

// ===========================
// MODAL
// ===========================
function bukaModal(title, msg) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalMsg').textContent   = msg;
  document.getElementById('modalConfirmBtn').onclick = () => pendingAction && pendingAction();
  document.getElementById('modalOverlay').classList.remove('hidden');
}

function tutupModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
  pendingAction = null;
}

document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modalOverlay')) tutupModal();
});

// ===========================
// RENDER
// ===========================
function renderAll() {
  renderStats();
  renderTable();
  renderChart();
  updateMatkulFilter();
}

function renderStats() {
  const total  = absensiData.length;
  const hadir  = absensiData.filter(d => d.status === 'Hadir').length;
  const izin   = absensiData.filter(d => d.status === 'Izin').length;
  const alpha  = absensiData.filter(d => d.status === 'Alpha').length;

  animateNum('totalData', parseInt(document.getElementById('totalData').textContent) || 0, total);
  animateNum('hadirCount', parseInt(document.getElementById('hadirCount').textContent) || 0, hadir);
  animateNum('izinCount',  parseInt(document.getElementById('izinCount').textContent)  || 0, izin);
  animateNum('alphaCount', parseInt(document.getElementById('alphaCount').textContent) || 0, alpha);
}

function animateNum(id, from, to) {
  const el = document.getElementById(id);
  if (!el) return;
  const duration = 600;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(from + (to - from) * ease);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = to;
  }
  requestAnimationFrame(step);
}

function updateMatkulFilter() {

  const select =
  document.getElementById('filterMatkul');

  const matkulList =
  [...new Set(
    absensiData.map(x => x.matkul)
  )];

  select.innerHTML =
  '<option value="all">Semua Matkul</option>';

  matkulList.forEach(m => {

    if(!m || m === '-') return;

    select.innerHTML += `
      <option value="${m}">
        ${m}
      </option>
    `;
  });
}

function getFilteredSorted() {

  const q = document.getElementById('search').value.toLowerCase();
  const status = document.getElementById('filterStatus').value;
  const matkul = document.getElementById('filterMatkul').value;

  let result = absensiData.filter(d => {

    const matchQ =
      d.nama.toLowerCase().includes(q) ||
      d.nim.toLowerCase().includes(q) ||
      (d.matkul || '').toLowerCase().includes(q);

    const matchS =
      status === 'all' ||
      d.status === status;

    const matchMatkul =
      matkul === 'all' ||
      d.matkul === matkul;

    return matchQ && matchS && matchMatkul;
  });

  result.sort((a, b) => {
    let va = (a[sortCol] || '').toString().toLowerCase();
    let vb = (b[sortCol] || '').toString().toLowerCase();

    if (va < vb) return sortAsc ? -1 : 1;
    if (va > vb) return sortAsc ? 1 : -1;

    return 0;
  });

  return result;
}

function filterData() {
  renderTable();
}

function getStudentStats(nim) {
  const records = absensiData.filter(x => x.nim === nim);

  const hadir = records.filter(x => x.status === "Hadir").length;
  const alpha = records.filter(x => x.status === "Alpha").length;

  const persen =
    records.length > 0
      ? Math.round((hadir / records.length) * 100)
      : 0;

  return {
    total: records.length,
    hadir,
    alpha,
    persen,
    warning: alpha >= 3
  };
}

function renderTable() {
  const rows  = getFilteredSorted();
  const tbody = document.getElementById('tableBody');
  const empty = document.getElementById('emptyState');

  if (rows.length === 0) {
    tbody.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  tbody.innerHTML = rows.map((d, i) => {
    const origIndex = absensiData.indexOf(d);
    const statusClass = d.status.toLowerCase();
    const tgl = d.tanggal ? new Date(d.tanggal).
    toLocaleDateString('id-ID', { day:'numeric',    
    month:'short', year:'numeric' }) : '-';
    const stat = getStudentStats(d.nim);

const streak =
  stat.persen >= 80
    ? `<span class="streak-badge">🔥</span>`
    : '';
    
    return `
      <tr class="row-in ${stat.warning ? 'warning-row' : ''}"
    style="animation-delay:${i * 40}ms">

        <td class="td-num">${i + 1}</td>
        <td class="td-nama">
        <strong>${escHtml(d.nama)}</strong>
        ${streak}
        ${stat.warning ? '<span class="warning-badge">⚠ Alpha 3x+</span>' : ''}
        </td>
        <td class="td-nim"><code>${escHtml(d.nim)}</code></td>
        <td>${escHtml(d.matkul || '-')}</td>
        <td>${tgl}</td>
        <td>
  <span class="badge badge-${statusClass}">
    ${d.status}
  </span>
</td>

<td>
  <div class="attendance-wrap">
    <div class="attendance-bar">
      <div
        class="attendance-fill"
        style="width:${stat.persen}%">
      </div>
    </div>
    <span>${stat.persen}%</span>
  </div>
</td>

<td class="td-action">
          <button class="btn-edit"  onclick="mulaiEdit(${origIndex})" title="Edit">✏️</button>
          <button class="btn-hapus" onclick="hapusData(${origIndex})" title="Hapus">🗑</button>
        </td>
      </tr>`;
  }).join('');
}

// ===========================
// DONUT CHART
// ===========================
function renderChart() {
  const total = absensiData.length;
  const hadir = absensiData.filter(d => d.status === 'Hadir').length;
  const izin  = absensiData.filter(d => d.status === 'Izin').length;
  const alpha = absensiData.filter(d => d.status === 'Alpha').length;

  const R = 50;
  const C = 2 * Math.PI * R; // ~314.16

  let offset = C * 0.25; // start from top

  function setArc(id, count) {
    const el  = document.getElementById(id);
    const len = total > 0 ? (count / total) * C : 0;
    el.setAttribute('stroke-dasharray', `${len} ${C - len}`);
    el.setAttribute('stroke-dashoffset', offset);
    offset -= len;
    if (offset < 0) offset += C;
  }

  setArc('donutHadir', hadir);
  setArc('donutIzin',  izin);
  setArc('donutAlpha', alpha);

  const pct = total > 0 ? Math.round((hadir / total) * 100) : 0;
  document.getElementById('donutPct').textContent = pct + '%';
  document.getElementById('legHadir').textContent = hadir;
  document.getElementById('legIzin').textContent  = izin;
  document.getElementById('legAlpha').textContent = alpha;
}

// ===========================
// EXPORT CSV
// ===========================
function exportCSV() {
  if (absensiData.length === 0) {
    showToast('⚠️ Tidak ada data untuk diekspor', 'warning');
    return;
  }
  const header = 'No,Nama,NIM,Mata Kuliah,Tanggal,Status\n';
  const rows = absensiData.map((d, i) =>
    `${i+1},"${d.nama}","${d.nim}","${d.matkul || '-'}","${d.tanggal}","${d.status}"`
  ).join('\n');

  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `absensi_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 Data berhasil diekspor ke CSV!', 'success');
}

function importCSV(event) {

  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {

    const text = e.target.result;

    const rows = text.split('\n');

    // hapus header
    rows.shift();

    let imported = 0;

    rows.forEach(row => {

      if (!row.trim()) return;

      const cols = row.split(',');

      if (cols.length < 6) return;

      absensiData.push({
        nama: cols[1].replace(/"/g, '').trim(),
        nim: cols[2].replace(/"/g, '').trim(),
        matkul: cols[3].replace(/"/g, '').trim(),
        tanggal: cols[4].replace(/"/g, '').trim(),
        status: cols[5].replace(/"/g, '').trim(),
        id: Date.now() + Math.random()
      });

      imported++;
    });

    saveData();
    renderAll();

    showToast(
      `📤 ${imported} data berhasil diimport`,
      'success'
    );
  };

  reader.readAsText(file);
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
  }, 3000);
}

// ===========================
// THEME
// ===========================
function toggleTheme() {
  const html  = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next   = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  document.getElementById('themeBtn').textContent = next === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('absensi_theme', next);
}

// ===========================
// HELPERS
// ===========================
function saveData() {
  localStorage.setItem('absensi_v2', JSON.stringify(absensiData));
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
      number: { value: 50, density: { enable: true, value_area: 900 } },
      color: { value: ['#38bdf8', '#818cf8', '#34d399'] },
      shape: { type: 'circle' },
      opacity: { value: 0.4, random: true },
      size: { value: 3, random: true },
      line_linked: { enable: true, distance: 140, color: '#38bdf8', opacity: 0.25, width: 1 },
      move: { enable: true, speed: 1.5, random: true, out_mode: 'out' }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
      modes: { grab: { distance: 160, line_linked: { opacity: 0.6 } }, push: { particles_nb: 3 } }
    },
    retina_detect: true
  });
}
// print pdf ======
function cetakData() {
  window.print();
}