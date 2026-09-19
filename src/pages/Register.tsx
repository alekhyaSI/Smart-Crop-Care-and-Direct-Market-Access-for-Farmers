import { useState } from 'react';
import { Input, Select, Btn } from '../components/shared';
import { User, Role } from '../data';

interface Props {
  onSuccess: (user: User) => void;
  onLogin: () => void;
}

export default function Register({ onSuccess, onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState<Role>('farmer');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!username || !email || !password) { setError('Please fill all required fields.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setDone(true);
  }

  if (done) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-[#D4E6C3] p-8 max-w-sm w-full text-center shadow-sm">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="font-display text-2xl text-[#1A2E1A] mb-2">Registration Successful!</h2>
          <p className="text-[#7A8C7A] text-sm mb-6">Registration successful. You can now login.</p>
          <Btn onClick={onLogin} className="w-full justify-center">Go to Login</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl border border-[#D4E6C3] p-8 max-w-md w-full shadow-sm">
        <div className="text-center mb-6">
          <span className="text-4xl">🌱</span>
          <h1 className="font-display text-2xl text-[#1A2E1A] mt-2">Create Account</h1>
          <p className="text-[#7A8C7A] text-sm mt-1">Join KisanSetu today</p>
        </div>

        {/* Demo hint */}
        <div className="bg-[#D8F3DC] rounded-xl p-3 mb-5 text-sm text-[#2D6A4F]">
          <strong>Demo accounts:</strong> Use username <code>farmer</code> / <code>farmer123</code> or <code>buyer</code> / <code>buyer123</code> to login directly.
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input label="Username" value={username} onChange={setUsername} placeholder="Choose a username" required />
          <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="your@email.com" required />
          <Input label="Password" value={password} onChange={setPassword} type="password" placeholder="Min. 6 characters" required />
          <Input label="Confirm Password" value={confirm} onChange={setConfirm} type="password" placeholder="Repeat password" required />
          <Select label="Role" value={role} onChange={v => setRole(v as Role)} options={['Farmer', 'Buyer']} required />

          {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <Btn type="submit" className="w-full justify-center mt-2">Register</Btn>
        </form>

        <p className="text-center text-sm text-[#7A8C7A] mt-5">
          Already have an account?{' '}
          <button onClick={onLogin} className="text-[#2D6A4F] font-600 hover:underline cursor-pointer">Login</button>
        </p>
      </div>
    </div>
  );
}
