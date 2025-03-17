
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type LoginFormProps = {
  isSignUp: boolean;
  setIsSignUp: (isSignUp: boolean) => void;
}

export const LoginForm = ({ isSignUp, setIsSignUp }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        if (username) {
          const { data: existingUsers, error: queryError } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username);
          
          if (queryError) throw queryError;
          if (existingUsers && existingUsers.length > 0) {
            toast.error('Username is already taken');
            setLoading(false);
            return;
          }
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split('@')[0]
            }
          }
        });
        
        if (error) throw error;
        localStorage.setItem('username', username || email.split('@')[0]);
        toast.success('Account created successfully! Please check your email to confirm your account.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', data.user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        
        localStorage.setItem('username', profileData?.username || email.split('@')[0]);
        toast.success('Logged in successfully');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <GoogleLoginButton loading={loading} />
        
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              OR CONTINUE WITH
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div className="space-y-2">
            <Input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
            />
          </div>
        )}
        
        <div className="space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="email" 
              placeholder="Email" 
              className="pl-10" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="password" 
              placeholder="Password" 
              className="pl-10" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {isSignUp ? 'Create Account' : 'Sign In'}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        {isSignUp ? (
          <p>
            Already have an account?{' '}
            <button 
              type="button" 
              className="font-medium text-primary hover:underline" 
              onClick={() => setIsSignUp(false)}
            >
              Sign in
            </button>
          </p>
        ) : (
          <p>
            Don't have an account?{' '}
            <button 
              type="button" 
              className="font-medium text-primary hover:underline" 
              onClick={() => setIsSignUp(true)}
            >
              Create one
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

import { GoogleLoginButton } from './GoogleLoginButton';
