import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Paperclip, Send, Clock, User, CheckCircle2, 
  AlertTriangle, MoreVertical, Play, Pause, XCircle 
} from 'lucide-react';
import './TicketDetails.css';

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticketId = id || '2024-089'; // Mock ID
  
  const [newMessage, setNewMessage] = useState('');
  
  // Mock Data
  const ticketInfo = {
    id: ticketId,
    assunto: 'Sistema SEI fora do ar',
    solicitante: 'Maria Silva',
    setor: 'Gabinete / OCA',
    contato: '(68) 99999-0000',
    local: 'Bloco A, 1º Andar, Mesa 05',
    categoria: 'Sistemas Internos',
    prioridade: 'critica',
    status: 'em_andamento',
    abertura: '27/04/2026 10:15',
    slaResolucao: 'Vence em 45 minutos',
    atendente: 'Roberto TI'
  };

  const history = [
    {
      id: 1,
      type: 'system',
      message: 'Chamado criado e classificado com prioridade Crítica.',
      date: '27/04/2026 10:15'
    },
    {
      id: 2,
      type: 'user',
      author: 'Maria Silva',
      message: 'O sistema SEI parou de funcionar de repente. Ao tentar logar, recebo a mensagem "Erro 502 Bad Gateway". Precisamos de acesso urgente para despachar processos importantes que vencem hoje.',
      date: '27/04/2026 10:15',
      attachments: ['print_erro_sei.png']
    },
    {
      id: 3,
      type: 'system',
      message: 'Roberto TI assumiu o chamado.',
      date: '27/04/2026 10:20'
    },
    {
      id: 4,
      type: 'tech',
      author: 'Roberto TI',
      message: 'Bom dia Maria, estamos verificando o problema junto à equipe de infraestrutura. Parece ser uma instabilidade no servidor do SEI. Retornamos em breve.',
      date: '27/04/2026 10:25'
    }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    alert('Mensagem enviada com sucesso!');
    setNewMessage('');
  };

  const getPriorityClass = (priority) => {
    return `badge-priority priority-${priority}`;
  };

  const getStatusClass = (status) => {
    const map = {
      novo: 'status-new',
      em_andamento: 'status-progress',
      aguardando_usuario: 'status-waiting',
      concluido: 'status-done'
    };
    return `badge-status ${map[status] || 'status-waiting'}`;
  };

  return (
    <div className="page-content ticket-details-page">
      {/* Header */}
      <div className="ticket-header-area">
        <div className="ticket-header-main">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Voltar para fila
          </button>
          <div className="title-wrapper">
            <h1>#{ticketInfo.id} - {ticketInfo.assunto}</h1>
            <div className="ticket-badges">
              <span className={getPriorityClass(ticketInfo.prioridade)}>Prioridade Crítica</span>
              <span className={getStatusClass(ticketInfo.status)}>Em Andamento</span>
            </div>
          </div>
        </div>
        
        <div className="ticket-actions-top">
          <button className="btn-secondary"><Pause size={16} /> Pausar SLA</button>
          <button className="btn-secondary"><MoreVertical size={16} /> Transferir</button>
          <button className="btn-primary btn-success"><CheckCircle2 size={16} /> Resolver Chamado</button>
        </div>
      </div>

      <div className="ticket-layout">
        {/* Left Column - Chat & History */}
        <div className="ticket-main-col">
          <div className="card chat-container">
            <div className="chat-history">
              {history.map(item => {
                if (item.type === 'system') {
                  return (
                    <div key={item.id} className="chat-msg system-msg">
                      <span className="msg-text">{item.message}</span>
                      <span className="msg-time">{item.date}</span>
                    </div>
                  );
                }

                const isTech = item.type === 'tech';
                return (
                  <div key={item.id} className={`chat-msg ${isTech ? 'msg-right' : 'msg-left'}`}>
                    <div className="msg-avatar">
                      {isTech ? 'TI' : 'MS'}
                    </div>
                    <div className="msg-bubble-wrapper">
                      <div className="msg-header">
                        <span className="msg-author">{item.author} {isTech && <span className="tech-badge">Suporte</span>}</span>
                        <span className="msg-time">{item.date}</span>
                      </div>
                      <div className="msg-bubble">
                        <p>{item.message}</p>
                        {item.attachments && (
                          <div className="msg-attachments">
                            {item.attachments.map(att => (
                              <div key={att} className="attachment-item">
                                <Paperclip size={14} /> {att}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="chat-input-area">
              <form onSubmit={handleSendMessage}>
                <textarea 
                  placeholder="Digite sua mensagem ou atualização..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows="3"
                ></textarea>
                <div className="chat-controls">
                  <div className="chat-tools">
                    <button type="button" className="tool-btn" title="Anexar arquivo"><Paperclip size={18} /></button>
                    <div className="internal-note-toggle">
                      <input type="checkbox" id="internalNote" />
                      <label htmlFor="internalNote">Nota Interna (Invisível ao usuário)</label>
                    </div>
                  </div>
                  <button type="submit" className="btn-primary">
                    <Send size={16} /> Enviar Mensagem
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="ticket-sidebar-col">
          <div className="card details-card">
            <h3 className="card-title">Detalhes do Solicitante</h3>
            <div className="detail-list">
              <div className="detail-item">
                <span className="detail-label">Nome</span>
                <span className="detail-value">{ticketInfo.solicitante}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Setor / Órgão</span>
                <span className="detail-value">{ticketInfo.setor}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Contato</span>
                <span className="detail-value text-primary-link">{ticketInfo.contato}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Local</span>
                <span className="detail-value">{ticketInfo.local}</span>
              </div>
            </div>
          </div>

          <div className="card details-card">
            <h3 className="card-title">Informações do Chamado</h3>
            <div className="detail-list">
              <div className="detail-item">
                <span className="detail-label">Categoria</span>
                <span className="detail-value">{ticketInfo.categoria}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Data de Abertura</span>
                <span className="detail-value">{ticketInfo.abertura}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">SLA de Resolução</span>
                <div className="sla-warning-box">
                  <AlertTriangle size={16} /> {ticketInfo.slaResolucao}
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-label">Técnico Responsável</span>
                <div className="tech-assigned">
                  <div className="avatar-mini">RT</div>
                  <span>{ticketInfo.atendente}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
