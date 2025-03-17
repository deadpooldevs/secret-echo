
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '@/components/Transitions';
import { supabase } from '@/integrations/supabase/client';
import { LoginForm } from '@/components/auth/LoginForm';
import { LoginSidebar } from '@/components/auth/LoginSidebar';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/');
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

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
            
            <LoginForm isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
          </div>
        </div>
        
        <LoginSidebar />
      </div>
      
      <footer className="text-center py-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Echo. All rights reserved.
      </footer>
    </PageTransition>
  );
};

export default Login;
