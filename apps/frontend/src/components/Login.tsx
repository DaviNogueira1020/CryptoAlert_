import { useState } from 'react';
import { LogIn, UserPlus, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { ParticleBackground } from './ParticleBackground';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: (accessToken: string, userName: string, email?: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validações básicas
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }

      if (password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }

      if (isSignup && !name) {
        throw new Error('Nome é obrigatório para cadastro');
      }

      // Simular autenticação com localStorage
      // Em um projeto real, isso seria enviado para seu backend
      const token = btoa(`${email}:${password}:${Date.now()}`);
      const displayName = isSignup ? name : email.split('@')[0];

      // Armazenar dados no localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userName', displayName);
      localStorage.setItem('userEmail', email);

      if (isSignup) {
        toast.success(`Conta criada com sucesso!`);
      } else {
        toast.success(`Bem-vindo de volta, ${displayName}!`);
      }

      onLogin(token, displayName, email);
    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : 'Erro ao autenticar';
      console.error('Authentication error:', err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoToken = btoa('demo@cryptoalert.com:demo123:' + Date.now());
    localStorage.setItem('authToken', demoToken);
    localStorage.setItem('userName', 'Demo User');
    localStorage.setItem('userEmail', 'demo@cryptoalert.com');
    onLogin(demoToken, 'Demo User', 'demo@cryptoalert.com');
    toast.success('Logado como Demo User!');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      <ParticleBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full relative z-10"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <TrendingUp className="w-12 h-12 text-[#00B8D4]" />
            <h1 className="text-white text-4xl font-bold">CryptoAlert</h1>
          </motion.div>
          <p className="text-gray-400">
            Monitore criptomoedas, crie alertas e fique por dentro das notícias
          </p>
        </motion.div>

        <motion.div
          className="bg-[#0A0E27] rounded-xl p-8 shadow-2xl border-2 border-[#00B8D4]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex gap-2 mb-6">
            <motion.button
              onClick={() => setIsSignup(false)}
              className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                !isSignup
                  ? 'bg-[#5B52FF] text-white shadow-lg shadow-[#5B52FF]/50'
                  : 'bg-transparent text-gray-400 hover:bg-gray-800/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Login
            </motion.button>
            <motion.button
              onClick={() => setIsSignup(true)}
              className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                isSignup
                  ? 'bg-[#5B52FF] text-white shadow-lg shadow-[#5B52FF]/50'
                  : 'bg-transparent text-gray-400 hover:bg-gray-800/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Cadastrar
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-white mb-2">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 bg-[#1a1f35] text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none transition-colors"
                  disabled={loading}
                />
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-white mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 bg-[#1a1f35] text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none transition-colors"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 bg-[#1a1f35] text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none transition-colors"
                disabled={loading}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-red-500/10 border border-red-500 text-red-400 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#5B52FF] to-[#7C3AED] text-white font-bold py-3 rounded-lg hover:from-[#4F46E5] hover:to-[#6D28D9] transition-all disabled:opacity-50 shadow-lg shadow-[#5B52FF]/40"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Carregando...' : isSignup ? 'Criar Conta' : 'Entrar'}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#00B8D4]/20">
            <motion.button
              onClick={handleDemoLogin}
              className="w-full text-center text-sm text-[#00B8D4] hover:text-[#00D9FF] transition-colors py-2"
              whileHover={{ scale: 1.02 }}
            >
              Testar com conta demo
            </motion.button>
          </div>
        </motion.div>

        <p className="text-center text-gray-500 text-sm mt-6">
          © 2024 CryptoAlert. Todos os direitos reservados.
        </p>
      </motion.div>
    </div>
  );
}
