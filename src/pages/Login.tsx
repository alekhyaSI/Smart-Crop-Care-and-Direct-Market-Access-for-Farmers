import { useState } from 'react';
import { Input, Btn } from '../components/shared';
import { User, Role } from '../data';

interface Props {
  onLogin: (user: User) => void;
  onRegister: () => void;
}

export default function Login({ onLogin, onRegister }: Props) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setError('');

    if (!usernameOrEmail.trim()) {
      setError('Please enter your username or email.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        'http://localhost:8080/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            usernameOrEmail: usernameOrEmail.trim(),
            password,
          }),
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        setError(
          responseText ||
            'Invalid username/email or password.'
        );
        return;
      }

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        setError(
          'Invalid response received from the server.'
        );
        return;
      }

      let normalizedRole: Role = 'farmer';

      if (
        data.role === 'BUYER' ||
        data.role === 'buyer'
      ) {
        normalizedRole = 'buyer';
      } else if (
        data.role === 'STORAGE_OWNER' ||
        data.role === 'storage_owner'
      ) {
        normalizedRole = 'storage_owner';
      } else {
        normalizedRole = 'farmer';
      }

      let preferredLanguage:
        | 'English'
        | 'Telugu'
        | 'Hindi' = 'English';

      if (data.preferredLanguage === 'Telugu') {
        preferredLanguage = 'Telugu';
      } else if (
        data.preferredLanguage === 'Hindi'
      ) {
        preferredLanguage = 'Hindi';
      }

      const user: User = {
        username: data.username,
        email: data.email,
        role: normalizedRole,
        name: data.name || data.username,
        phone: data.phone || '',
        location: data.location || '',
        preferredLanguage,
        cropsGrown: data.cropsGrown || '',
        businessName: data.businessName || '',
        buyerType: data.buyerType || '',
      };

      localStorage.setItem(
        'kisansetu_user',
        JSON.stringify(user)
      );

      localStorage.setItem(
        'kisansetu_language',
        preferredLanguage
      );

      onLogin(user);
    } catch {
      setError(
        'Unable to connect to the server. Make sure the Spring Boot backend is running on port 8080.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">

      <div className="bg-white rounded-2xl border border-[#D4E6C3] p-8 max-w-md w-full shadow-sm">

        <div className="text-center mb-7">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EAF5E4] flex items-center justify-center text-4xl">
            🌱
          </div>

          <h1 className="font-display text-2xl text-[#1A2E1A] mt-4">
            Welcome Back
          </h1>

          <p className="text-[#7A8C7A] text-sm mt-1">
            Login to your KisanSetu account
          </p>

        </div>

        <form
          onSubmit={submit}
          className="flex flex-col gap-4"
        >

          <Input
            label="Username or Email"
            value={usernameOrEmail}
            onChange={setUsernameOrEmail}
            placeholder="Enter username or email"
            required
          />

          <Input
            label="Password"
            value={password}
            onChange={setPassword}
            type="password"
            placeholder="Enter your password"
            required
          />

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          )}

          <Btn
            type="submit"
            className="w-full justify-center mt-2"
            disabled={loading}
          >
            {loading
              ? 'Logging in...'
              : 'Login'}
          </Btn>

        </form>

        <div className="mt-6 pt-5 border-t border-[#E7EEE2]">

          <p className="text-center text-sm text-[#7A8C7A]">

            Don't have an account?{' '}

            <button
              type="button"
              onClick={onRegister}
              className="text-[#2D6A4F] font-semibold hover:underline cursor-pointer"
            >
              Create Account
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}