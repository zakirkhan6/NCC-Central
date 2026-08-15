import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button } from '../components/common/Button';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    regNo: '',
    phone: '',
    rank: 'Cadet',
    company: 'ALPHA COY',
    platoon: 'Platoon 1',
    bloodGroup: 'O+'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(formData);
      showToast('Cadet Registration successful!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#172033] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#12355B]/20 focus:border-[#12355B]";

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-lg shadow-black/5">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#12355B] flex items-center justify-center font-black text-white text-lg mx-auto shadow-md mb-3">
            NCC
          </div>
          <h2 className="text-2xl font-black text-[#172033]">Cadet Self-Registration</h2>
          <p className="text-xs text-[#94A3B8] mt-1">1 MAH BATTALION NCC Unit System</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#172033] mb-1">Full Name *</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
              placeholder="e.g. Sayyed Mohammad Hanzala" className={inputClass} required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">Email Address *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="cadet@domain.com" className={inputClass} required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">Password *</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange}
              placeholder="••••••••" className={inputClass} required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">NCC Regimental No (Reg No) *</label>
            <input type="text" name="regNo" value={formData.regNo} onChange={handleChange}
              placeholder="e.g. MH23SDA56785" className={`${inputClass} uppercase`} required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">Phone Number</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange}
              placeholder="+91 99305 25095" className={inputClass} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">Company</label>
            <select name="company" value={formData.company} onChange={handleChange} className={inputClass}>
              <option value="ALPHA COY">ALPHA COY</option>
              <option value="BRAVO COY">BRAVO COY</option>
              <option value="CHARLIE COY">CHARLIE COY</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">Blood Group</label>
            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={inputClass}>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
            </select>
          </div>

          <div className="md:col-span-2 mt-4">
            <Button type="submit" isLoading={isLoading} className="w-full py-3">
              Submit Cadet Enrollment & Create Account
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-[#64748B]">
          Already registered?{' '}
          <Link to="/login" className="text-[#12355B] font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
