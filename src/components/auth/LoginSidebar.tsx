
import { Check, ShieldCheck, Zap } from 'lucide-react';

export const LoginSidebar = () => {
  return (
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
  );
};
