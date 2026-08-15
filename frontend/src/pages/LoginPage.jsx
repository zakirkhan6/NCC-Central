import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button } from '../components/common/Button';
import { ShieldCheck, Lock, Mail } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in both Email and Password.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.fullName}!`, 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-lg shadow-black/5">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#12355B] flex items-center justify-center font-black text-white text-lg mx-auto shadow-md mb-3">
            NCC
          </div>
          <h2 className="text-2xl font-black text-[#172033]">Sign In to NCC Central</h2>
          <p className="text-xs text-[#94A3B8] mt-1">Authorized Cadet, ANO & Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@ncccentral.org"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#172033] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#12355B]/20 focus:border-[#12355B]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#172033] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#12355B]/20 focus:border-[#12355B]"
                required
              />
            </div>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full py-3">
            Authenticate & Sign In
          </Button>
        </form>

        {/* Development Demo Quick Credentials */}
        <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
          <p className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider text-center mb-3">
            Demo Credentials (Click to Auto-fill)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickFill('admin@ncccentral.org', 'password123')}
              className="px-2 py-1.5 rounded-lg bg-[#FDF6E3] hover:bg-[#F5E6B8] text-[11px] font-bold text-[#9A7B1A] border border-[#E8D48A] transition-colors"
            >
              ADMIN
            </button>
            <button
              onClick={() => handleQuickFill('ano.roshan@ncccentral.org', 'password123')}
              className="px-2 py-1.5 rounded-lg bg-[#E8F5EE] hover:bg-[#CBE8D6] text-[11px] font-bold text-[#1F6B45] border border-[#B8DFC8] transition-colors"
            >
              ANO
            </button>
            <button
              onClick={() => handleQuickFill('hamza@cadet.ncccentral.org', 'password123')}
              className="px-2 py-1.5 rounded-lg bg-[#EAF1F8] hover:bg-[#D0E0F0] text-[11px] font-bold text-[#12355B] border border-[#C7D9ED] transition-colors"
            >
              CADET
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-[#64748B]">
          New Cadet?{' '}
          <Link to="/register" className="text-[#12355B] font-semibold hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
};
