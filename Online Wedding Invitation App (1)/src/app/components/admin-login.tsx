import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Lock, Heart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLoginProps {
  onLogin: () => void;
}

// Use environment variable for passcode
const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || '';

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [passcode, setPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (passcode === ADMIN_PASSCODE) {
        localStorage.setItem('admin_authenticated', 'true');
        toast.success('Welcome back!');
        onLogin();
      } else {
        toast.error('Invalid passcode');
        setPasscode('');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-['Montserrat']">
      <div className="w-full max-w-md">
        {/* Decorative elements */}
        <div className="relative mb-12">
          <div className="absolute -top-4 -left-4 opacity-20">
            <Sparkles className="h-8 w-8 text-purple-500" />
          </div>
          <div className="absolute -top-2 -right-2 opacity-20">
            <Sparkles className="h-6 w-6 text-pink-500" />
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full mb-6 shadow-lg">
              <Lock className="h-10 w-10 text-purple-600" />
            </div>
            <h1 className="text-3xl mb-2 font-['Playfair_Display'] font-bold text-slate-800">
              Admin Access
            </h1>
            <p className="text-slate-600">
              Enter your passcode to continue
            </p>
          </div>
        </div>

        <Card className="border-none shadow-xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="passcode" className="text-base mb-3 block">Passcode</Label>
                <Input
                  id="passcode"
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••"
                  autoFocus
                  required
                  className="rounded-xl py-6 text-center text-2xl tracking-widest"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full py-6 text-lg rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" 
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Access Dashboard'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-slate-500">
          <Heart className="h-4 w-4 inline-block mr-1" />
          Silver Anniversary Celebration
        </div>
      </div>
    </div>
  );
}