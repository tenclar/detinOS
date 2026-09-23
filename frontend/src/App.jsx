import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewTicket from './pages/NewTicket';
import TechQueue from './pages/TechQueue';
import TicketDetails from './pages/TicketDetails';
import MyTickets from './pages/MyTickets';
import ManagerDashboard from './pages/ManagerDashboard';
import KnowledgeBase from './pages/KnowledgeBase';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tickets/new" element={<NewTicket />} />
            <Route path="/tickets/:id" element={<TicketDetails />} />
            <Route path="/tickets" element={<MyTickets />} />
            <Route path="/team" element={<TechQueue />} />
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/kb" element={<KnowledgeBase />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
