
import React from "react";
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
import { User, Tag, Car as CarIcon, Gamepad, Users } from "lucide-react";

// Define the form schema with zod
const formSchema = z.object({
  pilot: z.string().min(3, { message: "Pilot name must be at least 3 characters" }),
  pilotTag: z.string().optional(),
  mainCar: z.string().min(1, { message: "Please select a car" }),
  platform: z.enum(["PC", "Xbox", "PlayStation"], { 
    message: "Please select a gaming platform" 
  }),
  team: z.string().optional(),
});

type RegistrationFormValues = z.infer<typeof formSchema>;

const Registration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Set up form with default values
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pilot: "",
      pilotTag: "",
      mainCar: "",
      platform: "PC",
      team: "",
    },
  });

  // Handle form submission
  const onSubmit = (data: RegistrationFormValues) => {
    // In a real app, we would save this to a database
    // For now, we'll store it in localStorage
    localStorage.setItem("pilotRegistration", JSON.stringify(data));
    
    // Show success toast
    toast({
      title: "Registration Successful!",
      description: "Welcome to Ranking ACC Brasil!",
    });
    
    // Navigate to the main page
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
                            {car.brand} {car.model}
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
              
              <Button 
                type="submit" 
                className="w-full bg-racing-red hover:bg-red-700 text-white font-formula"
              >
                REGISTER & CONTINUE
              </Button>
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

export default Registration;
