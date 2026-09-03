// js/app.js - Main Application Entry Point
import { initIcons } from './utils/icons.js';
import { getCurrentCoordinates } from './utils/media.js';
import { fetchTableData, insertRecord } from './services/api.js';

// Sample state
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

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  setupEventListeners();
  renderOperationsTable(currentOperations);
});

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
