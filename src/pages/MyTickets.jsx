import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Eye } from 'lucide-react';
import './MyTickets.css';

const MOCK_MY_TICKETS = [
  { id: '2024-001', assunto: 'Problema de acesso ao sistema RH', categoria: 'Acesso', status: 'novo', prioridade: 'alta', atualizacao: 'Hoje, 10:30' },
  { id: '2024-002', assunto: 'Impressora sem toner na contabilidade', categoria: 'Impressora', status: 'em_andamento', prioridade: 'media', atualizacao: 'Ontem, 15:45' },
  { id: '2024-003', assunto: 'Solicitação de novo monitor', categoria: 'Equipamento', status: 'aguardando_usuario', prioridade: 'baixa', atualizacao: '10/05/2024' },
  { id: '2023-954', assunto: 'Instalação do pacote Office', categoria: 'Sistemas', status: 'concluido', prioridade: 'media', atualizacao: '15/12/2023' },
];

export default function MyTickets() {
  const navigate = useNavigate();
  const [tickets] = useState(MOCK_MY_TICKETS);

  const getStatusBadge = (status) => {
    const map = {
      novo: { label: 'Aberto', class: 'status-new' },
      em_andamento: { label: 'Em Andamento', class: 'status-progress' },
      aguardando_usuario: { label: 'Aguardando', class: 'status-waiting' },
      concluido: { label: 'Concluído', class: 'status-done' }
    };
    return <span className={`badge-pill ${map[status].class}`}>{map[status].label}</span>;
  };

  return (
    <div className="page-content my-tickets-page">
      <div className="page-header my-tickets-header">
        <div>
          <h1>Meus Chamados</h1>
          <p>Histórico completo de todas as suas solicitações de suporte.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/tickets/new')}>
          <Plus size={18} /> Novo Chamado
        </button>
      </div>

      <div className="card">
        <div className="queue-toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Buscar por protocolo ou assunto..." />
          </div>
          
          <div className="filter-group">
            <div className="filter-select-wrapper">
              <Filter size={16} className="filter-icon" />
              <select className="filter-select">
                <option value="todos">Todos os Status</option>
                <option value="abertos">Apenas Abertos</option>
                <option value="concluidos">Concluídos</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Protocolo</th>
                <th>Assunto</th>
                <th>Categoria</th>
                <th>Status</th>
                <th>Última Atualização</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td className="fw-600">#{ticket.id}</td>
                  <td><span className="ticket-subject" title={ticket.assunto}>{ticket.assunto}</span></td>
                  <td><span className="text-muted">{ticket.categoria}</span></td>
                  <td>{getStatusBadge(ticket.status)}</td>
                  <td><span className="text-muted">{ticket.atualizacao}</span></td>
                  <td>
                    <button 
                      className="btn-action-secondary" 
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                    >
                      <Eye size={16} style={{marginRight: '4px'}}/> Acompanhar
                    </button>
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
