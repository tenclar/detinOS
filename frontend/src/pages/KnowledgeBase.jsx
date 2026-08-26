import { useState } from 'react';
import { Search, Book, FileText, ChevronRight, ThumbsUp, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './KnowledgeBase.css';

const MOCK_CATEGORIES = [
  { id: 'acesso', name: 'Acesso e Senhas', icon: '🔑', count: 12 },
  { id: 'equipamentos', name: 'Equipamentos e Hardware', icon: '💻', count: 8 },
  { id: 'sistemas', name: 'Sistemas Internos (SEI, RH)', icon: '⚙️', count: 24 },
  { id: 'rede', name: 'Internet e Rede', icon: '🌐', count: 5 },
];

const MOCK_ARTICLES = [
  { 
    id: 1, 
    title: 'Como redefinir sua senha da rede', 
    category: 'acesso',
    views: 1245,
    excerpt: 'Passo a passo rápido para resetar a senha do Windows sem precisar abrir chamado. Acesse o portal de autoatendimento...',
    useful: 98
  },
  { 
    id: 2, 
    title: 'Solução para o Erro 502 no Sistema SEI', 
    category: 'sistemas',
    views: 890,
    excerpt: 'Se você encontrar o Erro 502 Bad Gateway ao acessar o SEI, limpe o cache do seu navegador pressionando CTRL + F5. Caso persista...',
    useful: 85
  },
  { 
    id: 3, 
    title: 'Como adicionar a Impressora Padrão no seu setor', 
    category: 'equipamentos',
    views: 532,
    excerpt: 'Aprenda a mapear as impressoras de rede da OCA através do menu Dispositivos e Impressoras do painel de controle...',
    useful: 92
  },
  { 
    id: 4, 
    title: 'Instalação do Certificado Digital (Token)', 
    category: 'sistemas',
    views: 410,
    excerpt: 'Guia para instalação dos drivers do token criptográfico e configuração do assinador livre para processos digitais...',
    useful: 76
  }
];

export default function KnowledgeBase() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = MOCK_ARTICLES.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-content kb-page">
      {/* Header / Hero Search */}
      <div className="kb-hero">
        <HelpCircle size={48} className="kb-hero-icon" />
        <h1>Como podemos ajudar?</h1>
        <p>Busque por guias, manuais e resoluções rápidas antes de abrir um chamado.</p>
        
        <div className="kb-search-container">
          <Search className="kb-search-icon" size={24} />
          <input 
            type="text" 
            className="kb-search-input" 
            placeholder="Ex: Como resetar a senha do SEI..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="kb-content">
        {/* Categories Sidebar */}
        <div className="kb-categories">
          <h3>Categorias</h3>
          <ul className="category-list">
            <li className="category-item active">
              <span className="cat-name">Todas as Categorias</span>
              <span className="cat-count">49</span>
            </li>
            {MOCK_CATEGORIES.map(cat => (
              <li key={cat.id} className="category-item">
                <span className="cat-name">{cat.icon} {cat.name}</span>
                <span className="cat-count">{cat.count}</span>
              </li>
            ))}
          </ul>

          <div className="cant-find-card card">
            <h3>Não encontrou o que precisava?</h3>
            <p>Nossa equipe de TI está pronta para te ajudar com o seu problema.</p>
            <button className="btn-primary full-width mt-1" onClick={() => navigate('/tickets/new')}>
              Abrir um Chamado
            </button>
          </div>
        </div>

        {/* Articles List */}
        <div className="kb-articles">
          <div className="articles-header">
            <h2>Artigos Mais Acessados</h2>
            <span className="text-muted">{filteredArticles.length} resultados</span>
          </div>

          <div className="articles-grid">
            {filteredArticles.map(article => (
              <div key={article.id} className="article-card card hover-scale">
                <div className="article-icon">
                  <FileText size={24} className="text-primary" />
                </div>
                <div className="article-content">
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div className="article-meta">
                    <span className="meta-badge">{MOCK_CATEGORIES.find(c => c.id === article.category)?.name}</span>
                    <span className="meta-info"><Book size={14} /> {article.views} leituras</span>
                    <span className="meta-info text-success"><ThumbsUp size={14} /> {article.useful}% útil</span>
                  </div>
                </div>
                <div className="article-action">
                  <ChevronRight size={20} className="text-muted" />
                </div>
              </div>
            ))}
            
            {filteredArticles.length === 0 && (
              <div className="empty-state">
                <p>Nenhum artigo encontrado para "{searchTerm}".</p>
                <button className="btn-secondary mt-1" onClick={() => setSearchTerm('')}>Limpar busca</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
