
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User, Lock } from "lucide-react";
import { Link } from "react-router-dom";

// Define login form schema with zod
const loginSchema = z.object({
  pilot: z.string().min(3, { message: "Pilot name is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  
  // Set up form with default values
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      pilot: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = (data: LoginFormValues) => {
    // For now, simple login using localStorage
    const storedRegistration = localStorage.getItem("pilotRegistration");
    
    if (storedRegistration) {
      const registration = JSON.parse(storedRegistration);
      
      if (registration.pilot === data.pilot && registration.password === data.password) {
        // Successful login
        localStorage.setItem("isLoggedIn", "true");
        
        // Show success toast
        toast({
          title: "Login Successful!",
          description: `Welcome back, ${registration.pilot}!`,
        });
        
        // Navigate to the leaderboard page
        setTimeout(() => {
          navigate("/leaderboard");
        }, 1500);
      } else {
        // Failed login
        setLoginError("Invalid pilot name or password");
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid pilot name or password",
        });
      }
    } else {
      setLoginError("No registered pilot found. Please register first.");
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "No registered pilot found. Please register first.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-racing-black flex flex-col">
      {/* Header */}
      <div className="bg-racing-red p-3 w-full">
        <h1 className="text-white font-formula font-bold text-xl md:text-2xl tracking-wider text-center">
          RANKING ACC BRASIL
        </h1>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-racing-darkgrey rounded-md shadow-lg overflow-hidden">
          <div className="p-3 bg-racing-red">
            <h2 className="text-white font-formula text-lg tracking-wider">
              PILOT LOGIN
            </h2>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
              {loginError && (
                <div className="bg-red-500/20 border border-red-500 p-3 rounded text-white text-sm">
                  {loginError}
                </div>
              )}
              
              <FormField
                control={form.control}
                name="pilot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center gap-2">
                      <User size={16} className="text-racing-red" />
                      Pilot Name
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your name" 
                        className="bg-racing-black text-white border-racing-grey" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center gap-2">
                      <Lock size={16} className="text-racing-red" />
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter your password" 
                        className="bg-racing-black text-white border-racing-grey" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-racing-red hover:bg-red-700 text-white font-formula"
              >
                LOGIN
              </Button>
              
              <div className="text-center">
                <Link to="/" className="text-racing-silver hover:text-white text-sm">
                  Don't have an account? Register here
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-3 bg-racing-darkgrey">
        <p className="text-racing-grey text-center text-sm">
          © {new Date().getFullYear()} Ranking ACC Brasil - Assetto Corsa Competizione
        </p>
      </div>
    </div>
  );
};

export default Login;
