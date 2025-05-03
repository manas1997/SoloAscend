import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user, updateUserProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [username, setUsername] = useState(user?.username || "");
  const [quoteFrequency, setQuoteFrequency] = useState("daily");
  const [voiceVolume, setVoiceVolume] = useState(80);
  const [preferredFocusHours, setPreferredFocusHours] = useState("9-17");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update username
      const { error: profileError } = await supabase
        .from('users')
        .update({ username })
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      // Update user settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          quote_frequency: quoteFrequency,
          voice_volume: voiceVolume,
          preferred_focus_hours: preferredFocusHours,
          theme,
        });
      
      if (settingsError) throw settingsError;
      
      // Update local user context
      updateUserProfile({
        ...user,
        username,
      });
      
      toast({
        title: "Settings updated",
        description: "Your profile settings have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to update settings",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/auth";
    } catch (error) {
      toast({
        title: "Error signing out",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Load user settings from database
  useState(() => {
    const loadSettings = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
            console.error('Error loading settings:', error);
          }
          return;
        }
        
        if (data) {
          setQuoteFrequency(data.quote_frequency || "daily");
          setVoiceVolume(data.voice_volume || 80);
          setPreferredFocusHours(data.preferred_focus_hours || "9-17");
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  });
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-foreground sm:text-3xl sm:truncate font-poppins">
            Settings
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Customize your SoloAscend experience
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Manage your account information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Enter your username" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={user?.email || ""} 
                disabled 
                placeholder="Your email address" 
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed directly. Contact support for assistance.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hunter-level">Hunter Level</Label>
              <div id="hunter-level" className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center glow-effect mr-4 text-lg font-bold">
                  7
                </div>
                <div>
                  <p className="font-medium">Level 7 Hunter</p>
                  <p className="text-sm text-muted-foreground">Complete more missions to level up</p>
                </div>
              </div>
            </div>
            
            <Button onClick={handleUpdateProfile} className="w-full glow-effect" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  <span className="ml-2">Updating...</span>
                </div>
              ) : (
                'Save Profile'
              )}
            </Button>
          </CardContent>
        </Card>
        
        {/* Application Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
            <CardDescription>
              Configure your app experience and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose between dark and light mode
                  </p>
                </div>
                <ThemeToggle />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="quote-frequency">Quote Frequency</Label>
                <Select value={quoteFrequency} onValueChange={setQuoteFrequency}>
                  <SelectTrigger id="quote-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="voice-volume">Voice Volume</Label>
                <div className="pt-2">
                  <Slider
                    id="voice-volume"
                    value={[voiceVolume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(values) => setVoiceVolume(values[0])}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0%</span>
                  <span>{voiceVolume}%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="focus-hours">Preferred Focus Hours</Label>
                <Input 
                  id="focus-hours" 
                  value={preferredFocusHours} 
                  onChange={(e) => setPreferredFocusHours(e.target.value)} 
                  placeholder="e.g. 9-17" 
                />
                <p className="text-xs text-muted-foreground">
                  Format: start-end in 24-hour format (e.g. 9-17 for 9 AM to 5 PM)
                </p>
              </div>
            </div>
            
            <Button onClick={handleUpdateProfile} className="w-full glow-effect" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  <span className="ml-2">Updating...</span>
                </div>
              ) : (
                'Save Settings'
              )}
            </Button>
          </CardContent>
        </Card>
        
        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
            <CardDescription>
              Manage your data and privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data Backup</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically backup your progress and settings
                  </p>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Usage Analytics</p>
                  <p className="text-sm text-muted-foreground">
                    Help improve SoloAscend by sharing anonymous usage data
                  </p>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
              </div>
              
              <Separator />
              
              <div>
                <p className="font-medium">Download Your Data</p>
                <p className="text-sm text-muted-foreground mb-2">
                  Download all your data as a JSON file
                </p>
                <Button variant="outline" size="sm">
                  Export Data
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <p className="font-medium text-destructive">Danger Zone</p>
                <p className="text-sm text-muted-foreground mb-2">
                  Permanently delete your account and all associated data
                </p>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>
              Manage your account security and session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground mb-2">
                  Update your password to keep your account secure
                </p>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <p className="font-medium">Active Sessions</p>
                <p className="text-sm text-muted-foreground mb-2">
                  You are currently logged in on this device
                </p>
                <Button variant="outline" size="sm">
                  Manage Sessions
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <p className="font-medium">Sign Out</p>
                <p className="text-sm text-muted-foreground mb-2">
                  Log out from your current session
                </p>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
