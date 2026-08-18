import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Monitor } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-branding">
          <Monitor size={48} className="branding-icon" />
          <h1>OCA Helpdesk</h1>
          <p>Sistema Central de Suporte e Atendimento de TI</p>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-card glass-panel">
          <h2>Bem-vindo de volta</h2>
          <p className="login-subtitle">Acesse com suas credenciais institucionais</p>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Usuário ou E-mail</label>
              <div className="input-with-icon">
                <User className="input-icon" size={20} />
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Ex: joao.silva"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Senha</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={20} />
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Lembrar-me
              </label>
              <a href="#" className="forgot-password">Esqueceu a senha?</a>
            </div>
            
            <button type="submit" className="btn-primary login-btn" disabled={loading}>
              {loading ? 'Autenticando...' : 'Entrar no Sistema'}
            </button>
          </form>
          
          <div className="login-footer">
            <p>Precisa de ajuda para acessar? <a href="#">Consulte o guia</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
