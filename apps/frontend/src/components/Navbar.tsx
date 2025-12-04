import { Home, Bell, TrendingUp, Newspaper, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userName?: string;
}

export function Navbar({ currentPage, onNavigate, onLogout, userName }: NavbarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'alerts', label: 'Alertas', icon: Bell },
    { id: 'news', label: 'Notícias', icon: Newspaper },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="bg-[#0A0E27] border-b-2 border-[#00B8D4]/30 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <TrendingUp className="w-8 h-8 text-[#00B8D4]" />
              <span className="text-white font-bold text-xl">CryptoAlert</span>
            </motion.div>
            <div className="ml-10 flex items-baseline gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
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
          <div className="flex items-center gap-4">
            {userName && (
              <motion.span
                className="text-white hidden md:inline"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Olá, {userName}
              </motion.span>
            )}
            <motion.button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-red-500/20 border border-red-500/30 hover:border-red-500 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
}
