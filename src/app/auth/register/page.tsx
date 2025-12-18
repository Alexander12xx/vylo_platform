'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CheckCircle, AlertCircle, User, Mail, Lock, Camera, Shield } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    role: 'fan' as 'fan' | 'creator',
    profileImage: null as File | null,
    whatsapp: '',
    verificationImage: null as File | null
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImage' | 'verificationImage') => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [field]: e.target.files![0] }))
    }
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate first step
      if (!formData.email || !formData.password || !formData.username) {
        setError('Please fill in all required fields')
        return
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
      setCurrentStep(2)
      setError(null)
    } else if (currentStep === 2) {
      // For creator accounts, require additional info
      if (formData.role === 'creator' && !formData.whatsapp) {
        setError('WhatsApp number is required for creators')
        return
      }
      setCurrentStep(3)
      setError(null)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            role: formData.role
          }
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('No user returned')

      // 2. Create user record in users table
      const { error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: formData.email,
            username: formData.username,
            role: formData.role,
            status: 'active',
            verification_status: formData.role === 'creator' ? 'pending' : 'verified',
            strikes: 0,
            alt_balance: 0,
            total_earned: 0,
            total_spent: 0,
            whatsapp: formData.role === 'creator' ? formData.whatsapp : null,
            profile_image: formData.profileImage ? formData.profileImage.name : null
          }
        ])

      if (userError) {
        console.error('User creation error:', userError);
        // If user creation fails, delete the auth user
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw userError
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)

    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Registration Successful!
            </h2>
            <p className="mt-2 text-gray-600">
              Please check your email to verify your account. You will be redirected to login in a few seconds.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
              <User className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-gray-600">
              Join our community today
            </p>
          </div>

          {/* Progress indicator */}
          <div className="mt-8">
            <div className="flex justify-between mb-4">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>1</div>
                <span>Account</span>
              </div>
              <div className={`flex items-center ${currentStep >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>2</div>
                <span>Details</span>
              </div>
              <div className={`flex items-center ${currentStep >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${currentStep >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>3</div>
                <span>Review</span>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="your_username"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Create a strong password"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${formData.role === 'fan' ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                      <input
                        type="radio"
                        name="role"
                        value="fan"
                        checked={formData.role === 'fan'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${formData.role === 'fan' ? 'border-purple-500' : 'border-gray-300'}`}>
                          {formData.role === 'fan' && <div className="w-2 h-2 rounded-full bg-purple-500"></div>}
                        </div>
                        <span>Fan</span>
                      </div>
                    </label>
                    <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${formData.role === 'creator' ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                      <input
                        type="radio"
                        name="role"
                        value="creator"
                        checked={formData.role === 'creator'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${formData.role === 'creator' ? 'border-purple-500' : 'border-gray-300'}`}>
                          {formData.role === 'creator' && <div className="w-2 h-2 rounded-full bg-purple-500"></div>}
                        </div>
                        <span>Creator</span>
                      </div>
                    </label>
                  </div>
                </div>

                {formData.role === 'creator' && (
                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp Number (for verification)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        required={formData.role === 'creator'}
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Your WhatsApp number"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image (Optional)
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 border-2 border-dashed">
                      <Camera className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <label className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                        <span className="text-sm font-medium text-gray-700">Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'profileImage')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Account Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Email:</span> {formData.email}</p>
                    <p><span className="font-medium">Username:</span> {formData.username}</p>
                    <p><span className="font-medium">Account Type:</span> {formData.role === 'creator' ? 'Creator' : 'Fan'}</p>
                    {formData.role === 'creator' && <p><span className="font-medium">WhatsApp:</span> {formData.whatsapp}</p>}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  Back
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={loading}
                  className="ml-auto px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/auth/login" className="font-medium text-purple-600 hover:text-purple-500">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
