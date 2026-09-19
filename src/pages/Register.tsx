import { useState } from 'react';
import { Input, Select, Btn } from '../components/shared';
import { User, Role, Language, LANGUAGES } from '../data';

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
  const [language, setLanguage] = useState<Language>('English');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirm) {
      setError('Please fill all required fields.');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    const strongPassword =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password);

    if (!strongPassword) {
      setError(
        'Password must be at least 8 characters and include uppercase, lowercase, number and special character.'
      );
      return;
    }

    try {
      setLoading(true);

      const backendRole =
        role === 'farmer'
          ? 'FARMER'
          : role === 'buyer'
          ? 'BUYER'
          : 'STORAGE_OWNER';

      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          role: backendRole,
          preferredLanguage: language,
        }),
      });

      if (response.status === 409) {
        setError(await response.text());
        return;
      }

      if (response.status === 400) {
        setError(await response.text());
        return;
      }

      if (!response.ok) {
        setError('Registration failed. Please try again.');
        return;
      }

      const data = await response.json();

      const normalizedRole =
        data.role === 'STORAGE_OWNER'
          ? 'storage_owner'
          : data.role.toLowerCase();

      const user: User = {
        username: data.username,
        email: data.email,
        role: normalizedRole as Role,
        name: data.name || data.username,
        phone: data.phone || '',
        location: data.location || '',
        preferredLanguage:
          data.preferredLanguage === 'Telugu'
            ? 'Telugu'
            : data.preferredLanguage === 'Hindi'
            ? 'Hindi'
            : 'English',
        businessName: data.businessName || '',
        buyerType: data.buyerType || '',
        cropsGrown: data.cropsGrown || '',
      };

      localStorage.setItem('kisansetu_user', JSON.stringify(user));
      localStorage.setItem(
        'kisansetu_language',
        user.preferredLanguage
      );

      setDone(true);
      onSuccess(user);
    } catch {
      setError(
        'Unable to connect to the server. Make sure the Spring Boot backend is running.'
      );
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-[#D4E6C3] p-8 max-w-sm w-full text-center shadow-sm">
          <div className="text-5xl mb-4">✅</div>

          <h2 className="font-display text-2xl text-[#1A2E1A] mb-2">
            Registration Successful!
          </h2>

          <p className="text-[#7A8C7A] text-sm mb-6">
            Your account has been created successfully.
          </p>

          <Btn
            onClick={onLogin}
            className="w-full justify-center"
          >
            Go to Login
          </Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl border border-[#D4E6C3] p-8 max-w-md w-full shadow-sm">
        <div className="text-center mb-6">
          <span className="text-4xl">🌱</span>

          <h1 className="font-display text-2xl text-[#1A2E1A] mt-2">
            Create Account
          </h1>

          <p className="text-[#7A8C7A] text-sm mt-1">
            Join KisanSetu today
          </p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input
            label="Username"
            value={username}
            onChange={setUsername}
            placeholder="Choose a username"
            required
          />

          <Input
            label="Email"
            value={email}
            onChange={setEmail}
            type="email"
            placeholder="your@email.com"
            required
          />

          <Input
            label="Password"
            value={password}
            onChange={setPassword}
            type="password"
            placeholder="Min. 8 characters"
            required
          />

          <p className="text-xs text-[#7A8C7A] -mt-2">
            Use at least 8 characters with uppercase, lowercase, number and
            special character.
          </p>

          <Input
            label="Confirm Password"
            value={confirm}
            onChange={setConfirm}
            type="password"
            placeholder="Repeat password"
            required
          />

          <Select
            label="Role"
            value={
              role === 'farmer'
                ? 'Farmer'
                : role === 'buyer'
                ? 'Buyer'
                : 'Storage Owner'
            }
            onChange={(value) => {
              if (value === 'Buyer') {
                setRole('buyer');
              } else if (value === 'Storage Owner') {
                setRole('storage_owner');
              } else {
                setRole('farmer');
              }
            }}
            options={['Farmer', 'Buyer', 'Storage Owner']}
            required
          />

          <Select
            label="Preferred Language"
            value={language}
            onChange={(value) => setLanguage(value as Language)}
            options={LANGUAGES}
            required
          />

          <div className="rounded-xl bg-[#F5FAF1] border border-[#DCEBD2] px-4 py-3">
            <p className="text-xs text-[#547054]">
              Your selected language will be used throughout the KisanSetu
              website after login.
            </p>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <Btn
            type="submit"
            className="w-full justify-center mt-2"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </Btn>
        </form>

        <p className="text-center text-sm text-[#7A8C7A] mt-5">
          Already have an account?{' '}
          <button
            onClick={onLogin}
            className="text-[#2D6A4F] font-600 hover:underline cursor-pointer"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}