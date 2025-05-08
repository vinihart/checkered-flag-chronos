
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Car } from "@/types/racing";
import { MOCK_CARS } from "@/types/racing";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Tag, Car as CarIcon, Gamepad, Users, Lock } from "lucide-react";
import { Link } from "react-router-dom";

// Define the form schema with zod
const formSchema = z.object({
  pilot: z.string().min(3, { message: "Pilot name must be at least 3 characters" }),
  pilotTag: z.string().optional(),
  mainCar: z.string().min(1, { message: "Please select a car" }),
  platform: z.enum(["PC", "Xbox", "PlayStation"], { 
    message: "Please select a gaming platform" 
  }),
  team: z.string().optional(),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationFormValues = z.infer<typeof formSchema>;

const Registration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [hasExistingAccount, setHasExistingAccount] = useState(false);
  
  // Check if user is already registered
  useEffect(() => {
    const registration = localStorage.getItem("pilotRegistration");
    if (registration) {
      setHasExistingAccount(true);
    }
  }, []);
  
  // Set up form with default values
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pilot: "",
      pilotTag: "",
      mainCar: "",
      platform: "PC",
      team: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  const onSubmit = (data: RegistrationFormValues) => {
    // Remove confirmPassword before storing
    const { confirmPassword, ...registrationData } = data;
    
    // Store data in localStorage
    localStorage.setItem("pilotRegistration", JSON.stringify(registrationData));
    localStorage.setItem("isLoggedIn", "true");
    
    // Show success toast
    toast({
      title: "Registration Successful!",
      description: "Welcome to Ranking ACC Brasil!",
    });
    
    // Navigate to the leaderboard page
    setTimeout(() => {
      navigate("/leaderboard");
    }, 1500);
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
              PILOT REGISTRATION
            </h2>
          </div>
          
          {hasExistingAccount ? (
            <div className="p-6 space-y-6 text-center">
              <p className="text-white">You already have a registration. Would you like to:</p>
              <div className="space-y-4">
                <Button 
                  className="w-full bg-racing-red hover:bg-red-700 text-white font-formula"
                  onClick={() => navigate("/login")}
                >
                  LOGIN WITH EXISTING ACCOUNT
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-racing-grey text-white hover:bg-racing-grey hover:text-white font-formula"
                  onClick={() => {
                    localStorage.removeItem("pilotRegistration");
                    localStorage.removeItem("isLoggedIn");
                    setHasExistingAccount(false);
                  }}
                >
                  CREATE NEW ACCOUNT
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
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
                  name="pilotTag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white flex items-center gap-2">
                        <Tag size={16} className="text-racing-red" />
                        Pilot Tag (optional)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your tag" 
                          className="bg-racing-black text-white border-racing-grey" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-racing-grey">
                        Your racing identifier or nickname
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mainCar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white flex items-center gap-2">
                        <CarIcon size={16} className="text-racing-red" />
                        Main Car
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-racing-black text-white border-racing-grey">
                            <SelectValue placeholder="Select your main car" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-racing-black border-racing-grey text-white">
                          {MOCK_CARS.map((car) => (
                            <SelectItem key={car.id} value={car.id}>
                              {car.make} {car.model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-white flex items-center gap-2">
                        <Gamepad size={16} className="text-racing-red" />
                        Gaming Platform
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="PC" id="platform-pc" className="text-racing-red" />
                            </FormControl>
                            <FormLabel className="text-white font-normal" htmlFor="platform-pc">
                              PC
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="Xbox" id="platform-xbox" className="text-racing-red" />
                            </FormControl>
                            <FormLabel className="text-white font-normal" htmlFor="platform-xbox">
                              Xbox
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="PlayStation" id="platform-ps" className="text-racing-red" />
                            </FormControl>
                            <FormLabel className="text-white font-normal" htmlFor="platform-ps">
                              PlayStation
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="team"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white flex items-center gap-2">
                        <Users size={16} className="text-racing-red" />
                        Team (optional)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your team name" 
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
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white flex items-center gap-2">
                        <Lock size={16} className="text-racing-red" />
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="Confirm your password" 
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
                  REGISTER & CONTINUE
                </Button>
                
                <div className="text-center">
                  <Link to="/login" className="text-racing-silver hover:text-white text-sm">
                    Already have an account? Login here
                  </Link>
                </div>
              </form>
            </Form>
          )}
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

export default Registration;
