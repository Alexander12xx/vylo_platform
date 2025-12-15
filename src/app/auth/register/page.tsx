'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Mail, Lock, User, Eye, EyeOff, 
  Check, AlertCircle, Loader, Crown, Gift
} from 'lucide-react';
import { useAuth } from '@/components/layout/AuthProvider';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'fan' as 'creator' | 'fan',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.name, formData.role);
      setSuccess('Account created successfully! Redirecting...');
      
      setTimeout(() => {
        router.push(formData.role === 'creator' ? '/creator' : '/fan');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl mr-3"></div>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Vylo
            </span>
          </Link>
          <h1 className="text-2xl font-bold mt-4">Join Vylo Platform</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create your account and start your journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Role Selection */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 h-full">
              <h3 className="font-semibold mb-4">Choose Your Path</h3>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'fan' })}
                  className={`w-full p-4 border rounded-xl text-left transition-all ${
                    formData.role === 'fan'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <Gift className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-medium">Fan</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Support creators, watch streams, and engage with the community
                  </p>
                  {formData.role === 'fan' && (
                    <div className="mt-3 text-sm text-purple-600 dark:text-purple-400">
                      ✓ Selected
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'creator' })}
                  className={`w-full p-4 border rounded-xl text-left transition-all ${
                    formData.role === 'creator'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <Crown className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="font-medium">Creator</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Stream content, build your audience, and earn ALT coins
                  </p>
                  {formData.role === 'creator' && (
                    <div className="mt-3 text-sm text-purple-600 dark:text-purple-400">
                      ✓ Selected
                    </div>
                  )}
                </button>
              </div>

              {/* Benefits */}
              <div className="mt-8 pt-6 border-t dark:border-gray-700">
                <h4 className="font-medium mb-3">Benefits</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Free to join</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>No hidden fees</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Instant setup</span>
                  </li>
                  {formData.role === 'creator' && (
                    <>
                      <li className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        <span>85% revenue share</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        <span>Advanced analytics</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              {/* Error/Success Messages */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                    <p className="text-red-700 dark:text-red-400">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <p className="text-green-700 dark:text-green-400">{success}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-12 pr-12 py-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Minimum 8 characters with letters and numbers
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-12 pr-12 py-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1"
                    required
                  />
                  <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{' '}
                    <a href="/terms" className="text-purple-600 dark:text-purple-400 hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    `Join as ${formData.role === 'creator' ? 'Creator' : 'Fan'}`
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Need help?{' '}
            <a href="/help" className="text-purple-600 dark:text-purple-400 hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
