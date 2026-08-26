import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paperclip, Send, ArrowLeft, AlertCircle } from 'lucide-react';
import './NewTicket.css';

export default function NewTicket() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: 'João Silva',
    setor: '',
    orgao: '',
    contato: '',
    categoria: '',
    urgencia: 'media',
    local: '',
    descricao: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulando o envio
    alert('Chamado aberto com sucesso! Protocolo: #' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 1000));
    navigate('/dashboard');
  };

  return (
    <div className="page-content new-ticket-page">
      <div className="page-header flex-header">
        <div>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Voltar
          </button>
          <h1>Abertura de Chamado</h1>
          <p>Preencha os detalhes abaixo para solicitar suporte da equipe de TI.</p>
        </div>
      </div>

      <div className="form-container card">
        <form onSubmit={handleSubmit} className="ticket-form">
          
          <div className="form-section">
            <h3 className="section-title">Dados do Solicitante</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Nome Completo</label>
                <input type="text" name="nome" className="input-field" value={formData.nome} readOnly />
                <span className="field-hint">Preenchido automaticamente</span>
              </div>
              
              <div className="form-group">
                <label>Contato (Telefone/WhatsApp) *</label>
                <input type="text" name="contato" className="input-field" placeholder="(00) 00000-0000" required onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Setor *</label>
                <select name="setor" className="input-field" required onChange={handleChange}>
                  <option value="">Selecione seu setor...</option>
                  <option value="RH">Recursos Humanos</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Atendimento">Atendimento ao Público</option>
                  <option value="Administrativo">Administrativo</option>
                </select>
              </div>

              <div className="form-group">
                <label>Órgão Vinculado (se parceiro)</label>
                <select name="orgao" className="input-field" onChange={handleChange}>
                  <option value="">Apenas para parceiros externos...</option>
                  <option value="Detran">Detran</option>
                  <option value="Sefaz">Sefaz</option>
                  <option value="Saude">Secretaria de Saúde</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="form-section">
            <h3 className="section-title">Detalhes do Incidente/Solicitação</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Categoria do Problema *</label>
                <select name="categoria" className="input-field" required onChange={handleChange}>
                  <option value="">Selecione a categoria...</option>
                  <option value="internet">Internet / Rede</option>
                  <option value="computador">Computador / Equipamento</option>
                  <option value="impressora">Impressora</option>
                  <option value="sistemas">Sistemas Internos</option>
                  <option value="acesso">Solicitação de Acesso / Senha</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div className="form-group">
                <label>Nível de Urgência Percebido *</label>
                <select name="urgencia" className="input-field" required onChange={handleChange} value={formData.urgencia}>
                  <option value="baixa">Baixa (Não impede o trabalho)</option>
                  <option value="media">Média (Atrapalha, mas há alternativa)</option>
                  <option value="alta">Alta (Trabalho totalmente parado)</option>
                  <option value="critica">Crítica (Afeta todo o setor/órgão)</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width" style={{marginTop: '1rem'}}>
              <label>Local do Atendimento (Mesa, Sala, Andar) *</label>
              <input type="text" name="local" className="input-field" placeholder="Ex: Bloco B, 2º Andar, Mesa 15" required onChange={handleChange} />
            </div>

            <div className="form-group full-width" style={{marginTop: '1rem'}}>
              <label>Descrição Detalhada *</label>
              <textarea 
                name="descricao" 
                className="input-field textarea-field" 
                rows="5" 
                placeholder="Descreva com o máximo de detalhes o que está acontecendo, mensagens de erro, desde quando, etc."
                required
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="form-group full-width" style={{marginTop: '1rem'}}>
              <label>Anexos (Imagens, Prints, Documentos)</label>
              <div className="upload-area">
                <Paperclip size={24} className="upload-icon" />
                <p>Arraste e solte arquivos aqui ou <strong>clique para procurar</strong></p>
                <span className="upload-hint">Formatos suportados: JPG, PNG, PDF (Max: 5MB)</span>
                <input type="file" className="file-input-hidden" multiple />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <div className="info-box">
              <AlertCircle size={20} className="info-icon" />
              <span>A prioridade final será classificada automaticamente pelo sistema com base no impacto e urgência.</span>
            </div>
            <div className="action-buttons">
              <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancelar</button>
              <button type="submit" className="btn-primary">
                <Send size={18} /> Abrir Chamado
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
