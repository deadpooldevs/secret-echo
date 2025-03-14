
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
import { ArrowLeft, ArrowRight, MessageSquare } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
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

const Login = () => {
  const [step, setStep] = useState<'welcome' | 'register'>('welcome');
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });
  
  const handleStartMessaging = () => {
    setStep('register');
  };
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, you would validate the username against your database
    // and then create a new user or log in an existing one
    toast.success(`Welcome to Echo, ${values.username}!`);
    
    // Store the username in localStorage for now
    localStorage.setItem('username', values.username);
    
    // Navigate to the home page
    navigate("/");
  };
  
  const generateRandomUsername = () => {
    const adjectives = ['Swift', 'Silent', 'Clever', 'Brave', 'Wise', 'Calm', 'Noble', 'Fierce', 'Gentle', 'Bold'];
    const nouns = ['Wolf', 'Eagle', 'Tiger', 'Falcon', 'Phoenix', 'Dragon', 'Lion', 'Raven', 'Fox', 'Hawk'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    
    form.setValue('username', `${randomAdjective}${randomNoun}${randomNumber}`);
  };
  
  return (
    <PageTransition className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-background/90 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-background p-6 shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          
          <h1 className="text-2xl font-bold">Echo</h1>
          <p className="mt-2 text-muted-foreground">Anonymous messaging made simple</p>
        </div>
        
        {step === 'welcome' ? (
          <div className="space-y-6 py-4">
            <div className="space-y-2 rounded-lg border bg-card p-4">
              <h3 className="font-medium">Anonymous Messaging</h3>
              <p className="text-sm text-muted-foreground">
                Create a username and start chatting without sharing personal information.
              </p>
            </div>
            
            <div className="space-y-2 rounded-lg border bg-card p-4">
              <h3 className="font-medium">Message Storage Options</h3>
              <p className="text-sm text-muted-foreground">
                Choose between stored or disappearing messages for each chat.
              </p>
            </div>
            
            <div className="space-y-2 rounded-lg border bg-card p-4">
              <h3 className="font-medium">Media Sharing</h3>
              <p className="text-sm text-muted-foreground">
                Share images, videos, and files securely with other users.
              </p>
            </div>
            
            <Button 
              onClick={handleStartMessaging} 
              className="w-full"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <button 
              onClick={() => setStep('welcome')} 
              className="flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </button>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Choose a Username</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Username" {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generateRandomUsername}
                          title="Generate random username"
                          className="shrink-0"
                        >
                          Random
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2 rounded-lg border bg-card p-4">
                  <h3 className="font-medium">Privacy First</h3>
                  <p className="text-sm text-muted-foreground">
                    Your messages are encrypted and your identity is protected. Echo is designed with your privacy in mind.
                  </p>
                </div>
                
                <Button type="submit" className="w-full">
                  Start Messaging
                </Button>
              </form>
            </Form>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Login;
