
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Smartphone,
  LogOut,
  Save
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const SettingsPanel = () => {
  const { logout, user } = useAuth();
  const [notifications, setNotifications] = useState({
    portfolio: true,
    trading: true,
    security: true,
    marketing: false
  });

  const [preferences, setPreferences] = useState({
    darkMode: true,
    autoRefresh: true,
    currency: 'USD',
    language: 'English'
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
        <p className="text-purple-300">Manage your account and application preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            Profile Settings
          </CardTitle>
          <CardDescription className="text-purple-300">
            Update your account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input
                id="name"
                defaultValue={user?.user_metadata?.name || user?.user_metadata?.full_name || ''}
                className="bg-slate-800/50 border-purple-800/30 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email || ''}
                className="bg-slate-800/50 border-purple-800/30 text-white"
              />
            </div>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-400" />
            Notification Preferences
          </CardTitle>
          <CardDescription className="text-purple-300">
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Portfolio Updates</p>
                <p className="text-sm text-purple-300">Get notified about significant portfolio changes</p>
              </div>
              <Switch
                checked={notifications.portfolio}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, portfolio: checked})
                }
              />
            </div>
            <Separator className="bg-purple-800/30" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Trading Alerts</p>
                <p className="text-sm text-purple-300">Receive alerts for trading opportunities</p>
              </div>
              <Switch
                checked={notifications.trading}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, trading: checked})
                }
              />
            </div>
            <Separator className="bg-purple-800/30" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Security Alerts</p>
                <p className="text-sm text-purple-300">Important security notifications</p>
              </div>
              <Switch
                checked={notifications.security}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, security: checked})
                }
              />
            </div>
            <Separator className="bg-purple-800/30" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Marketing Updates</p>
                <p className="text-sm text-purple-300">News and feature announcements</p>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, marketing: checked})
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Preferences */}
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-400" />
            App Preferences
          </CardTitle>
          <CardDescription className="text-purple-300">
            Customize your app experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Currency</Label>
              <select 
                className="w-full p-2 bg-slate-800/50 border border-purple-800/30 rounded-md text-white"
                value={preferences.currency}
                onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="ETH">ETH (Ξ)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Language</Label>
              <select 
                className="w-full p-2 bg-slate-800/50 border border-purple-800/30 rounded-md text-white"
                value={preferences.language}
                onChange={(e) => setPreferences({...preferences, language: e.target.value})}
              >
                <option value="English">English</option>
                <option value="Spanish">Español</option>
                <option value="French">Français</option>
                <option value="German">Deutsch</option>
              </select>
            </div>
          </div>
          
          <Separator className="bg-purple-800/30" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto-refresh Portfolio</p>
                <p className="text-sm text-purple-300">Automatically update portfolio data</p>
              </div>
              <Switch
                checked={preferences.autoRefresh}
                onCheckedChange={(checked) => 
                  setPreferences({...preferences, autoRefresh: checked})
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Security Settings
          </CardTitle>
          <CardDescription className="text-purple-300">
            Manage your account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600/10">
              Change Password
            </Button>
            <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600/10">
              <Smartphone className="w-4 h-4 mr-2" />
              Enable 2FA
            </Button>
          </div>
          
          <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 font-medium">Account Security Score</p>
                <p className="text-sm text-green-300">Your account security is strong</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400">
                85/100
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="bg-black/40 border-red-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <LogOut className="w-5 h-5 text-red-400" />
            Account Actions
          </CardTitle>
          <CardDescription className="text-purple-300">
            Manage your account access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="border-red-600 text-red-400 hover:bg-red-600/10"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
