
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageTransition } from '@/components/Transitions';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff, MessageSquare, Shield, Mail } from 'lucide-react';

// Form validation schemas
const usernameSchema = z.object({
  username: z.string()
    .min(3, {
      message: "Username must be at least 3 characters long",
    })
    .max(20, {
      message: "Username cannot be longer than 20 characters",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Login = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'anonymous'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  
  // Anonymous username form
  const anonymousForm = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: "",
    },
  });
  
  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const handleAnonymousLogin = (values: z.infer<typeof usernameSchema>) => {
    toast.success(`Welcome to Hush, ${values.username}!`);
    localStorage.setItem('username', values.username);
    navigate("/");
  };
  
  const handleLogin = (values: z.infer<typeof loginSchema>) => {
    toast.success("Login successful!");
    localStorage.setItem('username', values.email.split('@')[0]);
    navigate("/");
  };
  
  const handleRegister = (values: z.infer<typeof registerSchema>) => {
    toast.success("Registration successful! Welcome to Hush.");
    localStorage.setItem('username', values.email.split('@')[0]);
    navigate("/");
  };
  
  const generateRandomUsername = () => {
    const adjectives = ['Swift', 'Silent', 'Clever', 'Brave', 'Wise', 'Calm', 'Noble', 'Fierce', 'Gentle', 'Bold'];
    const nouns = ['Wolf', 'Eagle', 'Tiger', 'Falcon', 'Phoenix', 'Dragon', 'Lion', 'Raven', 'Fox', 'Hawk'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    
    anonymousForm.setValue('username', `${randomAdjective}${randomNoun}${randomNumber}`);
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  return (
    <PageTransition className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0a1a40] to-[#15285f] p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-blue-800/30 bg-[#1b2e69]/90 p-6 shadow-lg backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Welcome to Hush</h1>
          <p className="mt-2 text-slate-300">The anonymous messaging platform where privacy comes first</p>
        </div>
        
        {activeTab === 'anonymous' ? (
          <div className="space-y-6">
            <h2 className="text-center text-xl font-medium text-white">Choose your anonymous username</h2>
            
            <Form {...anonymousForm}>
              <form onSubmit={anonymousForm.handleSubmit(handleAnonymousLogin)} className="space-y-6">
                <FormField
                  control={anonymousForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Enter username" 
                          className="h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
                          {...field} 
                        />
                      </FormControl>
                      <p className="text-sm text-slate-400">
                        Choose a unique username that will identify you in chats. Minimum 3 characters.
                      </p>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="h-12 w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Start Messaging
                </Button>
              </form>
            </Form>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-700"></div>
              <span className="mx-4 flex-shrink text-sm text-slate-500">OR</span>
              <div className="flex-grow border-t border-slate-700"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('login')}
                className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700"
              >
                Login
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('register')}
                className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700"
              >
                Register
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex rounded-md overflow-hidden">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3 text-center font-medium transition-colors ${
                  activeTab === 'login' 
                    ? 'bg-white text-[#1b2e69]' 
                    : 'bg-slate-700/40 text-white hover:bg-slate-700/60'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-3 text-center font-medium transition-colors ${
                  activeTab === 'register' 
                    ? 'bg-white text-[#1b2e69]' 
                    : 'bg-slate-700/40 text-white hover:bg-slate-700/60'
                }`}
              >
                Register
              </button>
            </div>
            
            {activeTab === 'login' ? (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-white">Password</FormLabel>
                        <a href="#" className="text-sm text-blue-400 hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showPassword ? "text" : "password"} 
                                  placeholder="Enter your password" 
                                  className="h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 pr-10"
                                  {...field} 
                                />
                                <button 
                                  type="button"
                                  onClick={togglePasswordVisibility}
                                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400"
                                >
                                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="h-12 w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Sign In
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter your email" 
                              className="h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Create a password" 
                                className="h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 pr-10"
                                {...field} 
                              />
                              <button 
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400"
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="Confirm your password" 
                                className="h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 pr-10"
                                {...field} 
                              />
                              <button 
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400"
                              >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="h-12 w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Create Account
                  </Button>
                </form>
              </Form>
            )}
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-700"></div>
              <span className="mx-4 flex-shrink text-sm text-slate-500">OR CONTINUE WITH</span>
              <div className="flex-grow border-t border-slate-700"></div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full h-12 border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              Google
            </Button>
            
            <div className="mt-6 text-center text-sm text-slate-400">
              <Button 
                variant="link" 
                onClick={() => setActiveTab('anonymous')}
                className="text-blue-400 p-0 h-auto"
              >
                Continue anonymously
              </Button>
            </div>
            
            <div className="text-center text-xs text-slate-500">
              By continuing, you agree to our 
              <a href="#" className="text-blue-400 hover:underline mx-1">Terms of Service</a>
              and
              <a href="#" className="text-blue-400 hover:underline mx-1">Privacy Policy</a>
            </div>
          </div>
        )}
        
        {activeTab === 'anonymous' && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/30 border border-blue-900/30 rounded-lg p-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-900/20 text-blue-400">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-medium text-white">Anonymous Messaging</h3>
              <p className="mt-2 text-sm text-slate-400">Send messages without revealing your identity</p>
            </div>
            
            <div className="bg-slate-800/30 border border-blue-900/30 rounded-lg p-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-900/20 text-blue-400">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-medium text-white">End-to-End Encryption</h3>
              <p className="mt-2 text-sm text-slate-400">Your messages stay private and secure</p>
            </div>
            
            <div className="bg-slate-800/30 border border-blue-900/30 rounded-lg p-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-900/20 text-blue-400">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-medium text-white">Privacy Controls</h3>
              <p className="mt-2 text-sm text-slate-400">You control who can contact you</p>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Login;
