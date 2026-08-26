import { useState } from 'react';
import {
  Users, Building2, Landmark, Tag, Shield, Plus,
  Search, Edit2, Trash2, BookOpen, Lock
} from 'lucide-react';
import './Settings.css';

const TABS = [
  { id: 'categorias', label: 'Categorias & SLA', icon: Tag },
  { id: 'usuarios', label: 'Usuários do Sistema', icon: Users },
  { id: 'setores', label: 'Setores Internos', icon: Building2 },
  { id: 'orgaos', label: 'Órgãos Parceiros', icon: Landmark },
  { id: 'base', label: 'Base de Conhecimento', icon: BookOpen },
  { id: 'permissoes', label: 'Nível de Acesso', icon: Shield },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('categorias');

  const renderContent = () => {
    switch (activeTab) {
      case 'categorias': return <CategoriasPanel />;
      case 'usuarios': return <UsuariosPanel />;
      case 'setores': return <SetoresPanel />;
      case 'orgaos': return <OrgaosPanel />;
      case 'base': return <BaseConhecimentoPanel />;
      case 'permissoes': return <PermissoesPanel />;
      default: return null;
    }
  };

  return (
    <div className="page-content settings-page">
      <div className="page-header">
        <h1>Configurações e Cadastros Base</h1>
        <p>Administração geral do sistema, usuários e tabelas de domínio.</p>
      </div>

      <div className="settings-layout">
        <div className="settings-sidebar card">
          <nav className="settings-nav">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="settings-content card">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

/* --- PAINÉIS DE CRUD --- */

function CategoriasPanel() {
  const data = [
    { id: 1, nome: 'Internet / Rede', responsavel: 'Infraestrutura', slaRep: 15, slaRes: 120, status: 'Ativo' },
    { id: 2, nome: 'Computador / Equipamento', responsavel: 'Suporte N1', slaRep: 30, slaRes: 240, status: 'Ativo' },
    { id: 3, nome: 'Sistemas Internos', responsavel: 'Desenvolvimento', slaRep: 60, slaRes: 480, status: 'Ativo' },
  ];

  return (
    <div className="crud-panel">
      <div className="crud-header">
        <div>
          <h2>Categorias de Problemas</h2>
          <p className="text-muted text-sm">Gerencie as categorias e regras de SLA.</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Nova Categoria</button>
      </div>
      <div className="crud-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Buscar categoria..." />
        </div>
      </div>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome da Categoria</th>
              <th>Equipe</th>
              <th>SLA 1ª Resp.</th>
              <th>SLA Resol.</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td className="fw-500">{item.nome}</td>
                <td>{item.responsavel}</td>
                <td>{item.slaRep} min</td>
                <td>{item.slaRes} min</td>
                <td><StatusBadge status={item.status} /></td>
                <td><CrudActions /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsuariosPanel() {
  const data = [
    { id: 1, nome: 'João Silva', login: 'joao.silva', setor: 'RH', perfil: 'Usuário', status: 'Ativo' },
    { id: 2, nome: 'Roberto TI', login: 'roberto.ti', setor: 'Tecnologia', perfil: 'Técnico', status: 'Ativo' },
    { id: 3, nome: 'Ana Souza', login: 'ana.souza', setor: 'Gabinete', perfil: 'Coordenador', status: 'Inativo' },
  ];

  return (
    <div className="crud-panel">
      <div className="crud-header">
        <div>
          <h2>Usuários do Sistema</h2>
          <p className="text-muted text-sm">Controle de acessos, credenciais e lotação.</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Novo Usuário</button>
      </div>
      <div className="crud-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Buscar por nome, login ou setor..." />
        </div>
      </div>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome Completo</th>
              <th>Login</th>
              <th>Setor / Órgão</th>
              <th>Perfil de Acesso</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td className="fw-500">{item.nome}</td>
                <td>{item.login}</td>
                <td>{item.setor}</td>
                <td><span className="badge-pill priority-medium">{item.perfil}</span></td>
                <td><StatusBadge status={item.status} /></td>
                <td><CrudActions showLock /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SetoresPanel() {
  const data = [
    { id: 1, nome: 'Recursos Humanos', sigla: 'RH', chefia: 'Marta Dias', ramal: '2001', status: 'Ativo' },
    { id: 2, nome: 'Atendimento ao Público', sigla: 'ATEND', chefia: 'Carlos Silva', ramal: '2005', status: 'Ativo' },
    { id: 3, nome: 'Tecnologia da Informação', sigla: 'DTI', chefia: 'Ricardo Santos', ramal: '2099', status: 'Ativo' },
  ];

  return (
    <div className="crud-panel">
      <div className="crud-header">
        <div>
          <h2>Setores Internos</h2>
          <p className="text-muted text-sm">Departamentos pertencentes à estrutura da OCA.</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Novo Setor</button>
      </div>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome do Setor</th>
              <th>Sigla</th>
              <th>Chefia/Responsável</th>
              <th>Ramal</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td className="fw-500">{item.nome}</td>
                <td>{item.sigla}</td>
                <td>{item.chefia}</td>
                <td>{item.ramal}</td>
                <td><StatusBadge status={item.status} /></td>
                <td><CrudActions /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrgaosPanel() {
  const data = [
    { id: 1, nome: 'Departamento Estadual de Trânsito', sigla: 'Detran', tipo: 'Estadual', contato: '(68) 3211-1234', status: 'Ativo' },
    { id: 2, nome: 'Secretaria da Fazenda', sigla: 'Sefaz', tipo: 'Estadual', contato: '(68) 3211-9999', status: 'Ativo' },
  ];

  return (
    <div className="crud-panel">
      <div className="crud-header">
        <div>
          <h2>Órgãos Parceiros</h2>
          <p className="text-muted text-sm">Instituições que atuam em conjunto ou possuem guichês na OCA.</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Novo Órgão</button>
      </div>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome do Órgão</th>
              <th>Sigla</th>
              <th>Esfera / Tipo</th>
              <th>Contato Central</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td className="fw-500">{item.nome}</td>
                <td>{item.sigla}</td>
                <td>{item.tipo}</td>
                <td>{item.contato}</td>
                <td><StatusBadge status={item.status} /></td>
                <td><CrudActions /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BaseConhecimentoPanel() {
  const data = [
    { id: 1, titulo: 'Como redefinir a senha do Windows', categoria: 'Acesso', acessos: 154, publico: 'Geral', status: 'Publicado' },
    { id: 2, titulo: 'Instalação da Impressora Padrão', categoria: 'Equipamento', acessos: 89, publico: 'Técnicos', status: 'Rascunho' },
  ];

  return (
    <div className="crud-panel">
      <div className="crud-header">
        <div>
          <h2>Base de Conhecimento (Artigos)</h2>
          <p className="text-muted text-sm">Manuais e resoluções para self-service de usuários e consulta de técnicos.</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Novo Artigo</button>
      </div>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Título do Artigo</th>
              <th>Categoria</th>
              <th>Público Alvo</th>
              <th>Acessos</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td className="fw-500">{item.titulo}</td>
                <td>{item.categoria}</td>
                <td>{item.publico}</td>
                <td>{item.acessos}</td>
                <td><StatusBadge status={item.status} /></td>
                <td><CrudActions /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PermissoesPanel() {
  const data = [
    { id: 1, nome: 'Administrador', desc: 'Acesso total a configurações, CRUDs e relatórios.', users: 3 },
    { id: 2, nome: 'Coordenador', desc: 'Acesso a relatórios, fila geral e dashboard.', users: 5 },
    { id: 3, nome: 'Técnico', desc: 'Acesso à fila de atendimento e chamados atribuídos.', users: 12 },
    { id: 4, nome: 'Usuário', desc: 'Acesso apenas à abertura e acompanhamento dos próprios chamados.', users: 245 },
  ];

  return (
    <div className="crud-panel">
      <div className="crud-header">
        <div>
          <h2>Níveis de Acesso (Perfis)</h2>
          <p className="text-muted text-sm">Visualização dos perfis de sistema. (Edição restrita a desenvolvedores)</p>
        </div>
      </div>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Perfil</th>
              <th>Descrição das Permissões</th>
              <th>Usuários Ativos</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td className="fw-500">{item.nome}</td>
                <td><span className="text-muted">{item.desc}</span></td>
                <td>{item.users}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* --- UTILS COMPONENTES --- */

function StatusBadge({ status }) {
  const isAtivo = status === 'Ativo' || status === 'Publicado';
  return (
    <span className={`badge-pill ${isAtivo ? 'status-done' : 'status-waiting'}`}>
      {status}
    </span>
  );
}

function CrudActions({ showLock }) {
  return (
    <div className="action-cell">
      {showLock && <button className="btn-icon-only text-warning" title="Resetar Senha"><Lock size={16} /></button>}
      <button className="btn-icon-only" title="Editar"><Edit2 size={16} /></button>
      <button className="btn-icon-only text-critical" title="Excluir"><Trash2 size={16} /></button>
    </div>
  );
}
