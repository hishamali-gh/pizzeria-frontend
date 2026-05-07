import { useState } from 'react';

import API from '../../apiConfig';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [step, setStep] = useState('login');

  const [mfaCode, setMfaCode] = useState('');

  const [error, setError] = useState('');


  const handleLogin = async (e) => {
    e.preventDefault();

    setError('');

    try {
      let res;

      if (step === 'login') {
        res = await API.post('auth/login/', { email, password });
      }

      else {
        res = await API.post('auth/mfa/verify-login/', { email, code: mfaCode });
      }

      if (res.status === 202) {
        setStep('mfa');

        return
      }

      else if (res.status === 200) {
        const { message, data, tokens } = res.data;

        localStorage.setItem('access', tokens.access);
        localStorage.setItem('refresh', tokens.refresh);

        localStorage.setItem('user_info', JSON.stringify(data));

        window.location.href = '/dashboard';
      }
    }

    catch (err) {
      const msg = err.response?.data?.error || 'Invalid credentials';

      setError(msg);
    };
  };


  return (
    <main className="min-h-screen bg-white flex">
      <section className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white relative">
        <div className="max-w-md w-full">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tighter text-zinc-900 dm-sans-regular uppercase">
              {step === 'login' ? "Welcome Back" : "Security Check"}
            </h2>
            <p className="text-zinc-500 text-sm dm-sans-regular mt-2">
              {step === 'login'
                ? "Enter your credentials to access your franchise telemetry."
                : "High-privilege role detected. Please enter your 6-digit MFA code."}
            </p>
          </div>

          {/* 1. Added the handleLogin submission handler */}
          <form onSubmit={handleLogin} className="space-y-5">

            {step === 'login' ? (
              /* --- GATE 1: PASSWORD UI --- */
              <>
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    placeholder="admin@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-sm dm-sans-regular"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5 ml-1">
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      Password
                    </label>
                    <a href="#" className="text-[10px] font-bold text-orange-600 uppercase tracking-widest hover:underline">
                      Forgot?
                    </a>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-zinc-200 rounded-2xl focus:outline-none focus:border-orange-600 transition-all text-sm dm-sans-regular"
                    required
                  />
                </div>
              </>
            ) : (
              /* --- GATE 2: MFA UI --- */
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 ml-1 text-center">
                  MFA Authentication Code
                </label>
                <input
                  type="text"
                  value={mfaCode}
                  placeholder="000 000"
                  maxLength="6"
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-full px-5 py-6 bg-zinc-50 border border-orange-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-3xl text-center font-mono tracking-[0.5em] dm-sans-regular"
                  autoFocus
                  required
                />
              </div>
            )}

            {/* 2. Security Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-[10px] uppercase font-bold tracking-widest p-3 rounded-xl text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-5 bg-zinc-900 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 dm-sans-regular uppercase text-xs tracking-[0.2em] mt-4"
            >
              {step === 'login' ? "Authorize Login" : "Verify & Enter Vault"}
            </button>

            <p className="text-center text-[10px] text-zinc-400 dm-sans-regular uppercase tracking-widest mt-8">
              New to the system? <a href="/register" className="text-orange-600 font-black hover:underline">Register Franchise</a>
            </p>
          </form>
        </div>
      </section>

      <section className="hidden lg:flex flex-1 relative overflow-hidden bg-zinc-900">
        <img
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop"
          alt="Command Center"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </section>
    </main>
  );
}
