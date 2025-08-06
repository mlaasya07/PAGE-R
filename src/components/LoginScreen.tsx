import React, { useState } from 'react';
import { Stethoscope, Lock } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (code: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication delay
    setTimeout(() => {
      if (code === '508011') {
        onLogin(code);
      } else {
        setError('Invalid access code. Please try again.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Stethoscope className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="mt-6 text-4xl font-bold text-white">R-PAGER</h2>
          <p className="mt-2 text-lg text-blue-100">Clinical Companion</p>
          <p className="mt-4 text-sm text-blue-200">
            "Built for med school. But built more for the human who's getting through it."
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="access-code" className="block text-sm font-medium text-blue-100 mb-2">
              Access Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-blue-400" />
              </div>
              <input
                id="access-code"
                name="access-code"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-12 py-3 bg-white/10 border border-blue-300 placeholder-blue-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg tracking-widest"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-300 text-sm text-center bg-red-900/30 rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-blue-900 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Authenticating...' : 'Access R-PAGER'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-xs text-blue-300">
            Private access for Dr. Raghav Kiran only
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;