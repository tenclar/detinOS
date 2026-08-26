import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, AlertTriangle, Clock, CheckCircle2, MoreVertical, Play } from 'lucide-react';
import './TechQueue.css';

// Dados simulados para a fila
const MOCK_TICKETS = [
  {
    id: '2024-089',
    solicitante: 'Maria Silva',
    setor: 'Gabinete / OCA',
    categoria: 'Sistemas Internos',
    assunto: 'Sistema SEI fora do ar',
    prioridade: 'critica',
    status: 'novo',
    sla: 15, // minutos restantes para primeira resposta
    tempoEspera: '10 min',
    atendente: null
  },
  {
    id: '2024-088',
    solicitante: 'Carlos Mendes',
    setor: 'Atendimento',
    categoria: 'Internet',
    assunto: 'Rede caindo constantemente nos guichês',
    prioridade: 'alta',
    status: 'novo',
    sla: 45,
    tempoEspera: '25 min',
    atendente: null
  },
  {
    id: '2024-085',
    solicitante: 'Ana Souza',
    setor: 'Sefaz (Parceiro)',
    categoria: 'Impressora',
    assunto: 'Impressora atolando papel',
    prioridade: 'media',
    status: 'em_andamento',
    sla: 120, // minutos restantes para resolução
    tempoEspera: '2 horas',
    atendente: 'Roberto TI'
  },
  {
    id: '2024-080',
    solicitante: 'João Pedro',
    setor: 'RH',
    categoria: 'Acesso',
    assunto: 'Reset de senha de rede',
    prioridade: 'baixa',
    status: 'aguardando_usuario',
    sla: -15, // atrasado
    tempoEspera: '1 dia',
    atendente: 'Roberto TI'
  }
];

export default function TechQueue() {
  const navigate = useNavigate();
  const [tickets] = useState(MOCK_TICKETS);
  const [filter, setFilter] = useState('todos');

  const getPriorityBadge = (priority) => {
    const map = {
      critica: { label: 'Crítica', class: 'priority-critical' },
      alta: { label: 'Alta', class: 'priority-high' },
      media: { label: 'Média', class: 'priority-medium' },
      baixa: { label: 'Baixa', class: 'priority-low' }
    };
    return <span className={`badge-pill ${map[priority].class}`}>{map[priority].label}</span>;
  };

  const getStatusBadge = (status) => {
    const map = {
      novo: { label: 'Novo', class: 'status-new' },
      em_andamento: { label: 'Em Andamento', class: 'status-progress' },
      aguardando_usuario: { label: 'Aguardando', class: 'status-waiting' },
      concluido: { label: 'Concluído', class: 'status-done' }
    };
    return <span className={`badge-pill ${map[status].class}`}>{map[status].label}</span>;
  };

  const getSlaIndicator = (sla) => {
    if (sla < 0) {
      return (
        <div className="sla-indicator sla-overdue">
          <AlertTriangle size={14} /> <span>Atrasado ({Math.abs(sla)}m)</span>
        </div>
      );
    } else if (sla < 30) {
      return (
        <div className="sla-indicator sla-warning">
          <Clock size={14} /> <span>Vence em {sla}m</span>
        </div>
      );
    } else {
      return (
        <div className="sla-indicator sla-ok">
          <CheckCircle2 size={14} /> <span>No prazo ({sla}m)</span>
        </div>
      );
    }
  };

  return (
    <div className="page-content tech-queue-page">
      <div className="page-header queue-header">
        <div>
          <h1>Fila de Atendimento (Técnicos)</h1>
          <p>Gestão em tempo real dos chamados abertos e controle de SLA.</p>
        </div>
        
        <div className="queue-stats-mini">
          <div className="mini-stat">
            <span className="mini-stat-value text-critical">1</span>
            <span className="mini-stat-label">Críticos</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-value text-warning">2</span>
            <span className="mini-stat-label">Próximos do SLA</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-value">4</span>
            <span className="mini-stat-label">Total Fila</span>
          </div>
        </div>
      </div>

      <div className="card queue-container">
        {/* Toolbar */}
        <div className="queue-toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Buscar por protocolo, usuário ou assunto..." />
          </div>
          
          <div className="filter-group">
            <div className="filter-select-wrapper">
              <Filter size={16} className="filter-icon" />
              <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="todos">Todos os Status</option>
                <option value="novo">Apenas Novos</option>
                <option value="meus">Meus Atendimentos</option>
                <option value="atrasados">SLA Atrasado</option>
              </select>
            </div>
            <button className="btn-secondary btn-icon"><Filter size={18} /> Filtros Avançados</button>
          </div>
        </div>

        {/* Data Table */}
        <div className="table-responsive">
          <table className="data-table queue-table">
            <thead>
              <tr>
                <th>Protocolo</th>
                <th>Solicitante / Setor</th>
                <th>Assunto / Categoria</th>
                <th>Prioridade</th>
                <th>Status</th>
                <th>SLA / Espera</th>
                <th>Atendente</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id} className={ticket.prioridade === 'critica' && ticket.status === 'novo' ? 'row-highlight-critical' : ''}>
                  <td className="fw-600">#{ticket.id}</td>
                  <td>
                    <div className="cell-stacked">
                      <span className="text-main">{ticket.solicitante}</span>
                      <span className="text-muted text-sm">{ticket.setor}</span>
                    </div>
                  </td>
                  <td>
                    <div className="cell-stacked">
                      <span className="text-main ticket-subject" title={ticket.assunto}>{ticket.assunto}</span>
                      <span className="text-muted text-sm">{ticket.categoria}</span>
                    </div>
                  </td>
                  <td>{getPriorityBadge(ticket.prioridade)}</td>
                  <td>{getStatusBadge(ticket.status)}</td>
                  <td>
                    <div className="cell-stacked">
                      {getSlaIndicator(ticket.sla)}
                      <span className="text-muted text-xs mt-1">Espera: {ticket.tempoEspera}</span>
                    </div>
                  </td>
                  <td>
                    {ticket.atendente ? (
                      <div className="avatar-small tooltip" data-tip={ticket.atendente}>
                        {ticket.atendente.split(' ')[0][0]}{ticket.atendente.split(' ')[1]?.[0] || ''}
                      </div>
                    ) : (
                      <span className="text-muted text-sm">Não atribuído</span>
                    )}
                  </td>
                  <td>
                    <div className="action-cell">
                      {ticket.status === 'novo' ? (
                        <button className="btn-action-primary" title="Assumir Chamado">
                          <Play size={16} /> Assumir
                        </button>
                      ) : (
                        <button className="btn-action-secondary" onClick={() => navigate(`/tickets/${ticket.id}`)}>Ver</button>
                      )}
                      <button className="btn-icon-only"><MoreVertical size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
