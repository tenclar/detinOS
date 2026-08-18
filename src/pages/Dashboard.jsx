import { LayoutDashboard, Ticket, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  
  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Visão Geral</h1>
        <p>Acompanhe o status dos seus chamados e fila de atendimento.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-primary">
            <Ticket size={24} color="var(--primary-600)" />
          </div>
          <div className="stat-info">
            <h3>Total Abertos</h3>
            <span className="stat-value">4</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-medium">
            <LayoutDashboard size={24} color="var(--medium-text)" />
          </div>
          <div className="stat-info">
            <h3>Em Andamento</h3>
            <span className="stat-value">2</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-low">
            <Users size={24} color="var(--low-text)" />
          </div>
          <div className="stat-info">
            <h3>Concluídos (Mês)</h3>
            <span className="stat-value">12</span>
          </div>
        </div>
      </div>

      <div className="recent-tickets card">
        <div className="card-header">
          <h2>Chamados Recentes</h2>
          <button className="btn-text" onClick={() => navigate('/tickets')}>Ver todos</button>
        </div>
        <div className="table-responsive">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>Protocolo</th>
                <th>Assunto</th>
                <th>Status</th>
                <th>Prioridade</th>
                <th>Atualização</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#2024-001</td>
                <td>Problema de acesso ao sistema RH</td>
                <td><span className="badge-status status-open">Aberto</span></td>
                <td><span className="badge-priority priority-high">Alta</span></td>
                <td>Hoje, 10:30</td>
              </tr>
              <tr>
                <td>#2024-002</td>
                <td>Impressora sem toner na contabilidade</td>
                <td><span className="badge-status status-progress">Em Andamento</span></td>
                <td><span className="badge-priority priority-medium">Média</span></td>
                <td>Ontem, 15:45</td>
              </tr>
              <tr>
                <td>#2024-003</td>
                <td>Solicitação de novo monitor</td>
                <td><span className="badge-status status-waiting">Aguardando</span></td>
                <td><span className="badge-priority priority-low">Baixa</span></td>
                <td>10/05/2024</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
