import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Navbar } from './components/Navbar';
import { PriceTicker } from './components/PriceTicker';
import { Dashboard } from './components/Dashboard';
import { CryptoDetail } from './components/CryptoDetail';
import { Alerts } from './components/Alerts';
import { News } from './components/News';
import { Profile } from './components/Profile';
import { ParticleBackground } from './components/ParticleBackground';
import { Toaster, toast } from 'sonner';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [alertCount] = useState(0);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = () => {
    try {
      const token = localStorage.getItem('authToken');
      const name = localStorage.getItem('userName');
      const email = localStorage.getItem('userEmail');

      if (token && name) {
        setUserName(name);
        setUserEmail(email || '');
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogin = (token: string, name: string, email?: string) => {
    setUserName(name);
    setUserEmail(email || '');
    setIsAuthenticated(true);
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('userName', name);
    if (email) localStorage.setItem('userEmail', email);

    toast.success(`Bem-vindo, ${name}!`);
  };

  const handleLogout = () => {
    try {
      setIsAuthenticated(false);
      setUserName('');
      setUserEmail('');
      setCurrentPage('dashboard');
      setSelectedCoinId(null);
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      
      toast.success('Logout realizado com sucesso');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedCoinId(null);
  };

  const handleViewDetails = (coinId: string) => {
    setSelectedCoinId(coinId);
    setCurrentPage('detail');
  };

  const handleCreateAlertFromDetail = () => {
    setCurrentPage('alerts');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <ParticleBackground />
        <div className="text-white text-xl z-10">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster position="top-right" theme="dark" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      <ParticleBackground />
      
      <div className="relative z-10">
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          userName={userName}
        />
        
        <PriceTicker />

        {currentPage === 'dashboard' && <Dashboard onViewDetails={handleViewDetails} />}

        {currentPage === 'detail' && selectedCoinId && (
          <CryptoDetail
            coinId={selectedCoinId}
            onBack={() => setCurrentPage('dashboard')}
            onCreateAlert={handleCreateAlertFromDetail}
          />
        )}

        {currentPage === 'alerts' && (
          <Alerts />
        )}

        {currentPage === 'news' && <News />}

        {currentPage === 'profile' && (
          <Profile 
            userName={userName} 
            userEmail={userEmail}
            alertCount={alertCount}
          />
        )}
      </div>

      <Toaster position="top-right" theme="dark" />
    </div>
  );
}
