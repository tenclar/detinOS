import { useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Ticket, Users, Settings, LogOut, Menu, Bell, Search, Plus, PieChart, Book } from 'lucide-react';
import './Layout.css';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard Usuário' },
    { path: '/kb', icon: Book, label: 'Central de Ajuda' },
    { path: '/tickets', icon: Ticket, label: 'Meus Chamados' },
    { path: '/team', icon: Users, label: 'Fila do Técnico' },
    { path: '/manager', icon: PieChart, label: 'Visão Gerencial' },
    { path: '/settings', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">OC</div>
            {sidebarOpen && <span className="logo-text">Helpdesk</span>}
          </div>
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
                <Link to={item.path}>
                  <item.icon size={20} />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Sair do Sistema</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Buscar chamados, usuários ou artigos..." className="search-input" />
          </div>
          
          <div className="topbar-actions">
            <button className="btn-primary new-ticket-btn" onClick={() => navigate('/tickets/new')}>
              <Plus size={18} /> Novo Chamado
            </button>
            <button className="icon-btn notification-btn">
              <Bell size={20} />
              <span className="badge">3</span>
            </button>
            <div className="user-profile">
              <div className="avatar">JS</div>
              <div className="user-info">
                <span className="user-name">João Silva</span>
                <span className="user-role">Usuário Comum</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="page-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
