import { useState } from 'react';
import { LogIn, UserPlus, TrendingUp } from 'lucide-react';
import { createClient } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { motion } from 'motion/react';
import { ParticleBackground } from './ParticleBackground';

interface LoginProps {
  onLogin: (accessToken: string, userName: string) => void;
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
      if (isSignup) {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-e49cbdd6/signup`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({ email, password, name }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao criar conta');
        }

        const supabase = createClient();
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (signInData.session?.access_token) {
          onLogin(signInData.session.access_token, name);
        }
      } else {
        const supabase = createClient();
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (data.session?.access_token) {
          const userName = data.user?.user_metadata?.name || email.split('@')[0];
          onLogin(data.session.access_token, userName);
        }
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-white text-4xl">CryptoAlert</h1>
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
                <label className="block text-white mb-2">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-black text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none transition-colors"
                  required={isSignup}
                  placeholder="Seu nome"
                />
              </motion.div>
            )}

            <div>
              <label className="block text-white mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none transition-colors"
                required
                placeholder="Exemple@gmail.com"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none transition-colors"
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5B52FF] text-white py-3 rounded-lg hover:bg-[#4F46E5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5B52FF]/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Processando...' : isSignup ? 'Criar Conta' : 'Entrar'}
            </motion.button>
          </form>
        </motion.div>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Dados de cotação fornecidos por CoinGecko
        </p>
      </motion.div>
    </div>
  );
}


faça o login nesse estio mas que seja compativel com o projeto