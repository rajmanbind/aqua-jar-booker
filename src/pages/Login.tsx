
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PageTransition from '@/components/PageTransition';
import NavBar from '@/components/NavBar';
import Logo from '@/components/Logo';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Invalid email or password');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo logins for each role
  const demoLogins = [
    { role: 'Customer', email: 'john@example.com', password: 'password' },
    { role: 'Distributor', email: 'sarah@example.com', password: 'password' },
    { role: 'Worker', email: 'mike@example.com', password: 'password' }
  ];

  const handleDemoLogin = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('Demo login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Demo login failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-20 w-72 h-72 bg-aqua-100/40 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-aqua-200/30 rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-md w-full space-y-8 relative z-10">
            <div className="text-center">
              <Logo className="mx-auto mb-6" />
              <h2 className="text-3xl font-bold">Welcome back</h2>
              <p className="mt-2 text-gray-600">Sign in to your account</p>
            </div>
            
            <div className="glass-card rounded-xl p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-aqua-500 focus:border-aqua-500"
                    placeholder="you@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-aqua-500 focus:border-aqua-500"
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-aqua-600 focus:ring-aqua-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <a href="#" className="font-medium text-aqua-600 hover:text-aqua-500">
                      Forgot your password?
                    </a>
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="water-btn w-full flex justify-center"
                  >
                    <span className="relative flex items-center">
                      {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      Sign in
                    </span>
                  </button>
                </div>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or try a demo account</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 gap-3">
                  {demoLogins.map((demo) => (
                    <button
                      key={demo.role}
                      type="button"
                      onClick={() => handleDemoLogin(demo.email, demo.password)}
                      disabled={isLoading}
                      className="btn-glass py-2 px-4 rounded-md text-sm font-medium"
                    >
                      Login as {demo.role}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <p className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-aqua-600 hover:text-aqua-500">
                Register now
              </Link>
            </p>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Login;
