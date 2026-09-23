import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const MOCK_USERS = {
  'admin': {
    name: 'Administrador do Sistema',
    username: 'admin',
    email: 'admin@detinos.local',
    role: 'ADMIN',
    roleLabel: 'Administrador',
    department: 'Tecnologia da Informação'
  },
  'admin@detinos.local': {
    name: 'Administrador do Sistema',
    username: 'admin',
    email: 'admin@detinos.local',
    role: 'ADMIN',
    roleLabel: 'Administrador',
    department: 'Tecnologia da Informação'
  },
  'coordenador': {
    name: 'Ricardo Santos',
    username: 'coordenador',
    email: 'coordenador@detinos.local',
    role: 'GESTOR',
    roleLabel: 'Coordenador DTI',
    department: 'Tecnologia da Informação'
  },
  'coordenador@detinos.local': {
    name: 'Ricardo Santos',
    username: 'coordenador',
    email: 'coordenador@detinos.local',
    role: 'GESTOR',
    roleLabel: 'Coordenador DTI',
    department: 'Tecnologia da Informação'
  },
  'roberto.ti': {
    name: 'Roberto TI',
    username: 'roberto.ti',
    email: 'roberto.ti@detinos.local',
    role: 'TECNICO',
    roleLabel: 'Técnico TI',
    department: 'Tecnologia da Informação'
  },
  'roberto.ti@detinos.local': {
    name: 'Roberto TI',
    username: 'roberto.ti',
    email: 'roberto.ti@detinos.local',
    role: 'TECNICO',
    roleLabel: 'Técnico TI',
    department: 'Tecnologia da Informação'
  },
  'joao.silva': {
    name: 'João Silva',
    username: 'joao.silva',
    email: 'joao.silva@detinos.local',
    role: 'USUARIO_COMUM',
    roleLabel: 'Usuário Comum',
    department: 'Recursos Humanos'
  },
  'joao.silva@detinos.local': {
    name: 'João Silva',
    username: 'joao.silva',
    email: 'joao.silva@detinos.local',
    role: 'USUARIO_COMUM',
    roleLabel: 'Usuário Comum',
    department: 'Recursos Humanos'
  },
  'maria.silva': {
    name: 'Maria Silva',
    username: 'maria.silva',
    email: 'maria.silva@detran.local',
    role: 'USUARIO_COMUM',
    roleLabel: 'Usuário Comum (Detran)',
    partnerAgency: 'Detran'
  },
  'maria.silva@detran.local': {
    name: 'Maria Silva',
    username: 'maria.silva',
    email: 'maria.silva@detran.local',
    role: 'USUARIO_COMUM',
    roleLabel: 'Usuário Comum (Detran)',
    partnerAgency: 'Detran'
  }
};

export const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('detinos_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao ler usuário salvo no localStorage', e);
      }
    }
    return {
      name: 'João Silva',
      username: 'joao.silva',
      email: 'joao.silva@detinos.local',
      role: 'USUARIO_COMUM',
      roleLabel: 'Usuário Comum',
      initials: 'JS'
    };
  });

  const formatRoleLabel = (role) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'GESTOR': return 'Coordenador DTI';
      case 'TECNICO': return 'Técnico TI';
      case 'USUARIO_COMUM': return 'Usuário Comum';
      default: return role || 'Usuário Comum';
    }
  };

  const login = async (loginInput, passwordInput) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: loginInput, password: passwordInput })
      });
      if (response.ok) {
        const data = await response.json();
        const userData = {
          ...data,
          roleLabel: formatRoleLabel(data.role),
          initials: getInitials(data.name)
        };
        setUser(userData);
        localStorage.setItem('detinos_user', JSON.stringify(userData));
        return userData;
      }
    } catch (err) {
      // Backend request failed or unreachable, fall through to mock login
    }

    const key = loginInput.trim().toLowerCase();
    let userData;

    if (MOCK_USERS[key]) {
      const found = MOCK_USERS[key];
      userData = {
        ...found,
        initials: getInitials(found.name)
      };
    } else {
      const rawName = key.includes('@') ? key.split('@')[0] : key;
      const formattedName = rawName
        .split(/[._-]/)
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      userData = {
        name: formattedName || 'Usuário Autenticado',
        username: key,
        email: key.includes('@') ? key : `${key}@detinos.local`,
        role: 'USUARIO_COMUM',
        roleLabel: 'Usuário Comum',
        initials: getInitials(formattedName || 'UA')
      };
    }

    setUser(userData);
    localStorage.setItem('detinos_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('detinos_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
