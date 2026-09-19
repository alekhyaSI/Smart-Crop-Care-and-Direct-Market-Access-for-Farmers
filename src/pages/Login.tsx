import { useState } from 'react';
import { Input, Btn } from '../components/shared';
import { User, DEMO_USERS, DEMO_PASSWORDS } from '../data';

interface Props {
  onLogin: (user: User) => void;
  onRegister: () => void;
}

export default function Login({ onLogin, onRegister }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const user = DEMO_USERS.find(u => u.username === username.trim());
    if (!user || DEMO_PASSWORDS[username.trim()] !== password) {
      setError('Invalid username or password. Try the demo accounts below.');
      return;
    }
    onLogin(user);
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl border border-[#D4E6C3] p-8 max-w-sm w-full shadow-sm">
        <div className="text-center mb-6">
          <span className="text-4xl">🌱</span>
          <h1 className="font-display text-2xl text-[#1A2E1A] mt-2">Welcome Back</h1>
          <p className="text-[#7A8C7A] text-sm mt-1">Login to your KisanSetu account</p>
        </div>

        {/* Demo accounts */}
        <div className="bg-[#D8F3DC] rounded-xl p-3 mb-5 text-sm text-[#2D6A4F] flex flex-col gap-2">
          <p className="font-600">Demo Accounts:</p>
          <div className="flex gap-3">
            <button
              onClick={() => { setUsername('farmer'); setPassword('farmer123'); }}
              className="flex-1 bg-white rounded-lg py-1.5 text-center text-xs font-600 border border-[#74C69D] hover:bg-[#D8F3DC] cursor-pointer"
            >
              🌾 Farmer
            </button>
            <button
              onClick={() => { setUsername('buyer'); setPassword('buyer123'); }}
              className="flex-1 bg-white rounded-lg py-1.5 text-center text-xs font-600 border border-[#74C69D] hover:bg-[#D8F3DC] cursor-pointer"
            >
              🛒 Buyer
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input label="Username / Email" value={username} onChange={setUsername} placeholder="farmer or buyer" required />
          <Input label="Password" value={password} onChange={setPassword} type="password" placeholder="Your password" required />

          {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <Btn type="submit" className="w-full justify-center mt-2">Login</Btn>
        </form>

        <p className="text-center text-sm text-[#7A8C7A] mt-5">
          Don't have an account?{' '}
          <button onClick={onRegister} className="text-[#2D6A4F] font-600 hover:underline cursor-pointer">Register</button>
        </p>
      </div>
    </div>
  );
}
