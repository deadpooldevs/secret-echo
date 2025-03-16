
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageTransition } from '@/components/Transitions';
import { Check, ShieldCheck, Zap, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/');
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleAnonymousLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) throw error;
      
      // Generate a random username for anonymous users
      const anonymousUsername = `anonymous_${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem('username', anonymousUsername);
      
      toast.success('Logged in anonymously');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login anonymously');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to login with Google');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        // Check if username is already taken
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
        
        // Sign up with email
        const { data, error } = await supabase.auth.signUp({
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
        // Sign in with email
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        // Get user's profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', data.user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 is the error code for "no rows returned"
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
    <PageTransition className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="w-full md:w-1/2 px-6 py-12 lg:px-8 xl:px-12 flex flex-col justify-center">
          <div className="mx-auto w-full max-w-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold">Echo</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Connect and chat with friends easily
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleAnonymousLogin}
                  disabled={loading}
                >
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  Continue Anonymously
                </Button>
                
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
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
                      onChange={(e) => setUsername(e.target.value)}
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
                      onChange={(e) => setEmail(e.target.value)}
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
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
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
          </div>
        </div>
        
        <div className="hidden md:block md:w-1/2 bg-primary/5">
          <div className="flex flex-col items-center justify-center h-full p-12">
            <div className="space-y-6 max-w-md">
              <h2 className="text-3xl font-bold text-center">
                Welcome to Echo
              </h2>
              <p className="text-muted-foreground text-center">
                Securely connect with friends and share messages in real-time
              </p>
              
              <div className="space-y-4 mt-8">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-1.5 rounded-full text-primary">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">End-to-end encryption</h3>
                    <p className="text-sm text-muted-foreground">
                      Your messages are secured and private
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-1.5 rounded-full text-primary">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Lightning fast messaging</h3>
                    <p className="text-sm text-muted-foreground">
                      Send and receive messages instantly
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-1.5 rounded-full text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Enhanced privacy</h3>
                    <p className="text-sm text-muted-foreground">
                      Control who can see when you're online
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="text-center py-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Echo. All rights reserved.
      </footer>
    </PageTransition>
  );
};

export default Login;
