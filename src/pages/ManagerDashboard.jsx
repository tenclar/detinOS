import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { TrendingUp, Clock, CheckCircle, AlertTriangle, Users, Star } from 'lucide-react';
import './ManagerDashboard.css';

// Mock Data
const chamadosPorSetor = [
  { name: 'RH', chamados: 45 },
  { name: 'Atendimento', chamados: 120 },
  { name: 'Gabinete', chamados: 15 },
  { name: 'Sefaz', chamados: 80 },
  { name: 'Detran', chamados: 65 },
  { name: 'Saúde', chamados: 95 },
];

const statusData = [
  { name: 'Em Andamento', value: 35, color: '#eab308' },
  { name: 'Novos', value: 15, color: '#3b82f6' },
  { name: 'Atrasados', value: 8, color: '#ef4444' },
  { name: 'Concluídos', value: 142, color: '#22c55e' },
];

const chamadosMensais = [
  { name: 'Jan', resolvidos: 120, abertos: 130 },
  { name: 'Fev', resolvidos: 140, abertos: 135 },
  { name: 'Mar', resolvidos: 180, abertos: 160 },
  { name: 'Abr', resolvidos: 150, abertos: 165 },
  { name: 'Mai', resolvidos: 190, abertos: 180 },
  { name: 'Jun', resolvidos: 175, abertos: 190 },
];

const chamadosPorCategoria = [
  { name: 'Hardware', value: 85, color: '#6366f1' },
  { name: 'Software', value: 110, color: '#8b5cf6' },
  { name: 'Rede', value: 45, color: '#14b8a6' },
  { name: 'Acessos', value: 60, color: '#f97316' },
  { name: 'Dúvidas', value: 25, color: '#ec4899' },
];

const desempenhoTecnicos = [
  { name: 'João Silva', resolvidos: 45, satisfacao: 4.9 },
  { name: 'Maria Souza', resolvidos: 52, satisfacao: 4.8 },
  { name: 'Carlos Santos', resolvidos: 38, satisfacao: 4.6 },
  { name: 'Ana Costa', resolvidos: 41, satisfacao: 4.9 },
  { name: 'Pedro Alves', resolvidos: 35, satisfacao: 4.5 },
];

export default function ManagerDashboard() {
  const [periodo, setPeriodo] = useState('mes');

  return (
    <div className="page-content manager-dashboard">
      <div className="page-header flex-header">
        <div>
          <h1>Dashboard Gerencial</h1>
          <p>Visão estratégica e indicadores de desempenho da equipe de TI.</p>
        </div>
        <div className="period-selector">
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="input-field">
            <option value="hoje">Hoje</option>
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mês</option>
            <option value="ano">Este Ano</option>
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon bg-primary-light text-primary">
            <TrendingUp size={24} />
          </div>
          <div className="kpi-details">
            <h3>Total de Chamados</h3>
            <div className="kpi-value">
              <span>200</span>
              <span className="kpi-trend positive">+12%</span>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon bg-warning-light text-warning">
            <Clock size={24} />
          </div>
          <div className="kpi-details">
            <h3>Tempo Médio de Resposta</h3>
            <div className="kpi-value">
              <span>18m</span>
              <span className="kpi-trend positive">-2m</span>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon bg-success-light text-success">
            <CheckCircle size={24} />
          </div>
          <div className="kpi-details">
            <h3>Tempo de Resolução</h3>
            <div className="kpi-value">
              <span>2h 45m</span>
              <span className="kpi-trend negative">+15m</span>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon bg-critical-light text-critical">
            <Star size={24} />
          </div>
          <div className="kpi-details">
            <h3>Índice de Satisfação</h3>
            <div className="kpi-value">
              <span>4.8 / 5</span>
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        {/* Gráfico de Barras - Setores */}
        <div className="chart-card col-span-2">
          <div className="chart-header">
            <h3>Volume por Setor/Órgão</h3>
            <button className="btn-icon-only"><AlertTriangle size={16} /></button>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chamadosPorSetor} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="chamados" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pizza - Status */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Distribuição por Status</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Linha - Evolução */}
        <div className="chart-card col-span-3">
          <div className="chart-header">
            <h3>Evolução Mensal (Abertos vs Resolvidos)</h3>
          </div>
          <div className="chart-body" style={{height: '300px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chamadosMensais} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}} />
                <Line type="monotone" dataKey="abertos" name="Abertos" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="resolvidos" name="Resolvidos" stroke="#22c55e" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Barras - Desempenho Técnicos */}
        <div className="chart-card col-span-2">
          <div className="chart-header">
            <h3>Desempenho por Técnico</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={desempenhoTecnicos} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} width={80} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="resolvidos" name="Chamados Resolvidos" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pizza - Categorias */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Chamados por Categoria</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chamadosPorCategoria}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {chamadosPorCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
