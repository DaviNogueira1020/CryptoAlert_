import { useState } from 'react';

export default function Settings() {
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);

  function save() {
    localStorage.setItem('settings', JSON.stringify({ theme, notifications }));
    alert('Settings saved');
  }

  return (
    <div className="w-full min-h-screen bg-black p-6 text-white">
      <div className="w-full max-w-2xl mx-auto bg-[#0A0E27] p-4 sm:p-6 rounded mt-10">
        <h2 className="text-2xl font-bold mb-6">Configurações</h2>
        <div className="mb-3">
          <label className="block mb-1">Tema</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className="bg-black px-3 py-2 rounded">
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
            Receive notifications
          </label>
        </div>
        <div>
          <button onClick={save} className="px-4 py-2 bg-[#5B52FF] rounded w-full sm:w-auto">Save</button>
        </div>
      </div>
    </div>
  );
}
