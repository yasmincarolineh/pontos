// js/app.js - Main Application Entry Point
import { initIcons } from './utils/icons.js';
import { getCurrentCoordinates } from './utils/media.js';
import { clockIn, clockOut, getTimeEntries } from './services/ponto.js';

// Operations sample state
let currentOperations = [
  {
    id: 'op-001',
    title: 'Inspeção de Equipamento A',
    description: 'Verificação periódica dos compressores principais.',
    status: 'completed',
    created_at: new Date().toISOString()
  },
  {
    id: 'op-002',
    title: 'Manutenção Preventiva Bloco B',
    description: 'Troca de óleo e calibração de sensores.',
    status: 'in_progress',
    created_at: new Date().toISOString()
  },
  {
    id: 'op-003',
    title: 'Vistoria de Segurança',
    description: 'Auditoria de rotina nas saídas de emergência.',
    status: 'pending',
    created_at: new Date().toISOString()
  }
];

// Time Entries (Ponto) state
let timeEntriesState = [];
let activeEntryId = null;

document.addEventListener('DOMContentLoaded', async () => {
  initIcons();
  startDigitalClock();
  setupEventListeners();
  setupPontoEventListeners();
  renderOperationsTable(currentOperations);
  await loadTimeEntries();
});

// Digital Clock Timer
function startDigitalClock() {
  const clockEl = document.getElementById('current-clock-display');
  const dateEl = document.getElementById('current-date-display');

  function update() {
    const now = new Date();
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString('pt-BR');
    }
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }

  update();
  setInterval(update, 1000);
}

// Ponto Event Handlers & Logic
function setupPontoEventListeners() {
  const btnClockIn = document.getElementById('btn-clock-in');
  const btnClockOut = document.getElementById('btn-clock-out');

  if (btnClockIn) {
    btnClockIn.addEventListener('click', async () => {
      btnClockIn.disabled = true;
      const { data } = await clockIn('Operador Principal', 'Entrada de turno registrada via sistema');
      if (data && data.length > 0) {
        const created = data[0];
        activeEntryId = created.id;
        timeEntriesState.unshift(created);
        updateShiftStatus(true);
        renderPontoTable(timeEntriesState);
      }
      btnClockIn.disabled = false;
    });
  }

  if (btnClockOut) {
    btnClockOut.addEventListener('click', async () => {
      if (!activeEntryId) return;
      btnClockOut.disabled = true;
      const { data } = await clockOut(activeEntryId, 'Saída de turno registrada');

      const targetIndex = timeEntriesState.findIndex((e) => e.id === activeEntryId);
      if (targetIndex !== -1) {
        timeEntriesState[targetIndex].exit_time = new Date().toISOString();
        timeEntriesState[targetIndex].status = 'closed';
      }

      activeEntryId = null;
      updateShiftStatus(false);
      renderPontoTable(timeEntriesState);
    });
  }
}

async function loadTimeEntries() {
  const { data } = await getTimeEntries();
  if (data && data.length > 0) {
    timeEntriesState = data;
    const active = timeEntriesState.find((e) => e.status === 'open');
    if (active) {
      activeEntryId = active.id;
      updateShiftStatus(true);
    } else {
      updateShiftStatus(false);
    }
  } else {
    // Default initial mock time entry for demo
    const now = new Date();
    const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
    timeEntriesState = [
      {
        id: 'ponto-001',
        employee_name: 'Operador Principal',
        entry_time: fourHoursAgo.toISOString(),
        exit_time: now.toISOString(),
        status: 'closed',
        notes: 'Turno da manhã encerrado.'
      }
    ];
    updateShiftStatus(false);
  }

  renderPontoTable(timeEntriesState);
}

function updateShiftStatus(inShift) {
  const shiftText = document.getElementById('shift-status-text');
  const shiftIcon = document.getElementById('shift-status-icon');
  const btnClockIn = document.getElementById('btn-clock-in');
  const btnClockOut = document.getElementById('btn-clock-out');

  if (inShift) {
    if (shiftText) {
      shiftText.textContent = 'Em Turno';
      shiftText.className = 'text-lg font-bold text-emerald-600 mt-1';
    }
    if (shiftIcon) {
      shiftIcon.className = 'p-3 bg-emerald-50 text-emerald-600 rounded-lg';
    }
    if (btnClockIn) btnClockIn.disabled = true;
    if (btnClockOut) btnClockOut.disabled = false;
  } else {
    if (shiftText) {
      shiftText.textContent = 'Fora de Turno';
      shiftText.className = 'text-lg font-bold text-slate-600 mt-1';
    }
    if (shiftIcon) {
      shiftIcon.className = 'p-3 bg-slate-100 text-slate-500 rounded-lg';
    }
    if (btnClockIn) btnClockIn.disabled = false;
    if (btnClockOut) btnClockOut.disabled = true;
  }
}

function renderPontoTable(entries) {
  const tbody = document.getElementById('ponto-tbody');
  if (!tbody) return;

  if (!entries || entries.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-6 text-slate-500">
          Nenhum ponto registrado hoje.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = entries.map((entry) => {
    const entryDate = entry.entry_time ? new Date(entry.entry_time) : null;
    const exitDate = entry.exit_time ? new Date(entry.exit_time) : null;

    const entryStr = entryDate ? entryDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-';
    const exitStr = exitDate ? exitDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-';

    let durationStr = '-';
    if (entryDate && exitDate) {
      const diffMs = exitDate - entryDate;
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      durationStr = `${diffHrs}h ${diffMins}m`;
    } else if (entryDate && entry.status === 'open') {
      durationStr = 'Em andamento';
    }

    const badgeClass = entry.status === 'open' ? 'badge-in_progress' : 'badge-completed';
    const badgeLabel = entry.status === 'open' ? 'Em Turno' : 'Finalizado';

    return `
      <tr class="hover:bg-slate-50 border-b border-slate-200 transition">
        <td class="font-medium text-slate-900 px-4 py-3">${escapeHtml(entry.employee_name)}</td>
        <td class="text-slate-700 font-mono text-sm px-4 py-3">${entryStr}</td>
        <td class="text-slate-700 font-mono text-sm px-4 py-3">${exitStr}</td>
        <td class="px-4 py-3">
          <span class="badge ${badgeClass}">${badgeLabel}</span>
        </td>
        <td class="text-slate-600 text-sm px-4 py-3">${durationStr}</td>
      </tr>
    `;
  }).join('');

  initIcons();
}

// Operations Logic
function setupEventListeners() {
  const btnNewOp = document.getElementById('btn-new-operation');
  const btnGeoLocation = document.getElementById('btn-get-location');
  const modalOverlay = document.getElementById('modal-new-op');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const formNewOp = document.getElementById('form-new-op');

  if (btnNewOp && modalOverlay) {
    btnNewOp.addEventListener('click', () => {
      modalOverlay.classList.remove('hidden');
    });
  }

  if (btnCloseModal && modalOverlay) {
    btnCloseModal.addEventListener('click', () => {
      modalOverlay.classList.add('hidden');
    });
  }

  if (btnGeoLocation) {
    btnGeoLocation.addEventListener('click', async () => {
      const geoInput = document.getElementById('op-location');
      try {
        btnGeoLocation.disabled = true;
        btnGeoLocation.textContent = 'Obtendo...';
        const coords = await getCurrentCoordinates();
        if (geoInput) {
          geoInput.value = `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
        }
      } catch (err) {
        alert('Não foi possível obter a localização: ' + err.message);
      } finally {
        btnGeoLocation.disabled = false;
        btnGeoLocation.innerHTML = `<i data-lucide="map-pin" class="w-4 h-4 inline mr-1"></i> Obter Localização`;
        initIcons();
      }
    });
  }

  if (formNewOp) {
    formNewOp.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('op-title')?.value;
      const description = document.getElementById('op-description')?.value;
      const status = document.getElementById('op-status')?.value;

      if (!title) return;

      const newOp = {
        id: `op-${Date.now()}`,
        title,
        description,
        status: status || 'pending',
        created_at: new Date().toISOString()
      };

      currentOperations.unshift(newOp);
      renderOperationsTable(currentOperations);

      formNewOp.reset();
      if (modalOverlay) modalOverlay.classList.add('hidden');
    });
  }
}

function renderOperationsTable(operations) {
  const tableBody = document.getElementById('operations-tbody');
  if (!tableBody) return;

  if (operations.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center py-6 text-slate-500">
          Nenhuma operação registrada.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = operations.map((op) => {
    let statusClass = 'badge-pending';
    let statusLabel = 'Pendente';

    if (op.status === 'completed') {
      statusClass = 'badge-completed';
      statusLabel = 'Concluído';
    } else if (op.status === 'in_progress') {
      statusClass = 'badge-in_progress';
      statusLabel = 'Em Andamento';
    }

    return `
      <tr class="hover:bg-slate-50 border-b border-slate-200 transition">
        <td class="font-medium text-slate-900 px-4 py-3">${escapeHtml(op.title)}</td>
        <td class="text-slate-600 px-4 py-3">${escapeHtml(op.description || '-')}</td>
        <td class="px-4 py-3">
          <span class="badge ${statusClass}">
            ${statusLabel}
          </span>
        </td>
        <td class="text-slate-500 text-sm px-4 py-3">
          ${new Date(op.created_at).toLocaleDateString('pt-BR')}
        </td>
      </tr>
    `;
  }).join('');

  initIcons();
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m];
  });
}
