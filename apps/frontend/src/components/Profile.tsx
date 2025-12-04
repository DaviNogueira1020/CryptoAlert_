import { useState } from 'react';
import { User, Mail, Bell, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ProfileProps {
  userName: string;
  userEmail: string;
}

export function Profile({ userName, userEmail }: ProfileProps) {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSaveSettings = () => {
    localStorage.setItem('settings', JSON.stringify({
      notifications,
      emailNotifications,
    }));
    toast.success('Configurações salvas com sucesso!');
  };

  const userAlerts = localStorage.getItem('cryptoAlerts') 
    ? JSON.parse(localStorage.getItem('cryptoAlerts') || '[]').length 
    : 0;

  return (
    <div className="min-h-screen bg-black py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-white text-4xl font-bold flex items-center gap-3 mb-2">
            <User className="w-8 h-8 text-[#00B8D4]" />
            Meu Perfil
          </h1>
          <p className="text-gray-400">Gerencie suas informações e preferências</p>
        </motion.div>

        {/* Informações do Usuário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0A0E27] rounded-lg p-8 border-2 border-[#00B8D4]/30 mb-8"
        >
          <h2 className="text-white text-2xl font-bold mb-6">Informações Pessoais</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-sm uppercase mb-2">Nome</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1f35] rounded-lg border border-[#00B8D4]/30">
                <User className="w-5 h-5 text-[#00B8D4]" />
                <span className="text-white font-bold">{userName}</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm uppercase mb-2">Email</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1f35] rounded-lg border border-[#00B8D4]/30">
                <Mail className="w-5 h-5 text-[#00B8D4]" />
                <span className="text-white font-bold">{userEmail}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-[#0A0E27] rounded-lg p-6 border-2 border-[#00B8D4]/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm uppercase">Alertas Criados</p>
                <p className="text-white text-3xl font-bold">{userAlerts}</p>
              </div>
              <Bell className="w-10 h-10 text-[#00B8D4]/50" />
            </div>
          </div>

          <div className="bg-[#0A0E27] rounded-lg p-6 border-2 border-[#00B8D4]/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm uppercase">Alertas Ativos</p>
                <p className="text-white text-3xl font-bold">
                  {localStorage.getItem('cryptoAlerts') 
                    ? JSON.parse(localStorage.getItem('cryptoAlerts') || '[]').filter((a: { active?: boolean }) => a.active).length
                    : 0}
                </p>
              </div>
              <Shield className="w-10 h-10 text-green-400/50" />
            </div>
          </div>

          <div className="bg-[#0A0E27] rounded-lg p-6 border-2 border-[#00B8D4]/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm uppercase">Membro desde</p>
                <p className="text-white text-xl font-bold">
                  {new Date().toLocaleDateString('pt-BR', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <User className="w-10 h-10 text-[#00B8D4]/50" />
            </div>
          </div>
        </motion.div>

        {/* Configurações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 20 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0A0E27] rounded-lg p-8 border-2 border-[#00B8D4]/30"
        >
          <h2 className="text-white text-2xl font-bold mb-6">Configurações</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#1a1f35] rounded-lg">
              <div>
                <p className="text-white font-bold">Notificações no Aplicativo</p>
                <p className="text-gray-400 text-sm">Receba notificações sobre seus alertas</p>
              </div>
              <motion.button
                onClick={() => setNotifications(!notifications)}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  notifications
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {notifications ? 'Ativo' : 'Inativo'}
              </motion.button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1a1f35] rounded-lg">
              <div>
                <p className="text-white font-bold">Notificações por Email</p>
                <p className="text-gray-400 text-sm">Receba emails quando seus alertas forem acionados</p>
              </div>
              <motion.button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  emailNotifications
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {emailNotifications ? 'Ativo' : 'Inativo'}
              </motion.button>
            </div>
          </div>

          <motion.button
            onClick={handleSaveSettings}
            className="w-full mt-8 bg-gradient-to-r from-[#5B52FF] to-[#7C3AED] text-white font-bold py-3 rounded-lg hover:from-[#4F46E5] hover:to-[#6D28D9] transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Salvar Configurações
          </motion.button>
        </motion.div>

        {/* Ajuda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-[#0A0E27] rounded-lg p-8 border-2 border-[#00B8D4]/30 text-center"
        >
          <p className="text-gray-400 mb-4">
            Precisa de ajuda? Consulte nossa documentação ou entre em contato com nosso suporte.
          </p>
          <div className="flex gap-4 justify-center">
            <motion.button
              className="px-6 py-2 border-2 border-[#00B8D4] text-[#00B8D4] rounded-lg hover:bg-[#00B8D4]/10 transition-all"
              whileHover={{ scale: 1.05 }}
            >
              Documentação
            </motion.button>
            <motion.button
              className="px-6 py-2 border-2 border-[#00B8D4] text-[#00B8D4] rounded-lg hover:bg-[#00B8D4]/10 transition-all"
              whileHover={{ scale: 1.05 }}
            >
              Suporte
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
