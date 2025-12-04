import { Home, Bell, Newspaper, TrendingUp, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { PriceTicker } from './PriceTicker';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'alerts', label: 'Alerts', icon: Bell, path: '/alerts' },
    { id: 'news', label: 'News', icon: Newspaper, path: '/news' },
    { id: 'profile', label: 'Profile', icon: User, path: '/settings' },
  ];

  const currentPage = navItems.find(item => item.path === location.pathname)?.id || 'dashboard';

  return (
    <nav className="fixed top-0 left-0 w-full z-[50] bg-[#0a2463] border-b-4 border-[#1e3a8a] shadow-2xl">
      <PriceTicker />
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 md:h-24 py-2">
            <div className="flex items-center">
              <motion.div
                className="flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => navigate('/dashboard')}
              >
                <TrendingUp className="w-8 h-8 text-[#00B8D4]" />
                <span className="text-white font-bold text-xl">CryptoAlert</span>
              </motion.div>
              <div className="ml-4 sm:ml-10 flex items-baseline gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => navigate(item.path)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all relative ${
                        currentPage === item.id
                          ? 'bg-[#5B52FF] text-white shadow-lg shadow-[#5B52FF]/50'
                          : 'text-gray-300 hover:bg-[#0A0E27]/80 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                      {currentPage === item.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-[#5B52FF] rounded-lg -z-10"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              {userName && (
                <motion.span
                  className="text-white hidden md:inline"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  Hello, {userName}
                </motion.span>
              )}
              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-red-500/20 border border-red-500/30 hover:border-red-500 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
