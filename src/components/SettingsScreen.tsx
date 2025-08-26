import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  Shield, 
  Moon, 
  Globe, 
  Download, 
  Upload, 
  Trash2, 
  Lock, 
  Fingerprint, 
  Share, 
  HelpCircle, 
  Mail, 
  MessageSquare,
  Smartphone,
  Volume2,
  Eye,
  Database,
  CheckCircle,
  Crown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

interface SettingsScreenProps {
  onBack: () => void;
  onSubscription: () => void;
}

export default function SettingsScreen({ onBack, onSubscription }: SettingsScreenProps) {
  const [settings, setSettings] = useState({
    // Notifications
    medicationReminders: true,
    appointmentReminders: true,
    testResults: true,
    healthTips: false,
    emergencyAlerts: true,
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: true,
    reminderSound: 'default',
    reminderVibration: true,

    // Privacy & Security
    biometricAuth: true,
    autoLock: '5',
    dataSharing: false,
    analyticsSharing: false,
    crashReporting: true,
    
    // Appearance
    darkMode: false,
    language: 'en',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12',
    
    // Data & Storage
    autoBackup: true,
    backupFrequency: 'daily',
    dataSaver: false,
    
    // Accessibility
    fontSize: 'medium',
    highContrast: false,
    screenReader: false
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Setting updated');
  };

  const handleExportData = () => {
    toast.success('Preparing health data export...');
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion initiated. Please check your email for confirmation.');
  };

  const NotificationSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="w-5 h-5 mr-2 text-blue-600" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Medication Reminders</Label>
            <p className="text-sm text-muted-foreground">Daily medication alerts</p>
          </div>
          <Switch 
            checked={settings.medicationReminders}
            onCheckedChange={(checked) => updateSetting('medicationReminders', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Appointment Reminders</Label>
            <p className="text-sm text-muted-foreground">Upcoming appointment alerts</p>
          </div>
          <Switch 
            checked={settings.appointmentReminders}
            onCheckedChange={(checked) => updateSetting('appointmentReminders', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Test Results</Label>
            <p className="text-sm text-muted-foreground">New lab results notifications</p>
          </div>
          <Switch 
            checked={settings.testResults}
            onCheckedChange={(checked) => updateSetting('testResults', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Health Tips</Label>
            <p className="text-sm text-muted-foreground">Weekly health insights</p>
          </div>
          <Switch 
            checked={settings.healthTips}
            onCheckedChange={(checked) => updateSetting('healthTips', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Emergency Alerts</Label>
            <p className="text-sm text-muted-foreground">Critical health alerts</p>
          </div>
          <Switch 
            checked={settings.emergencyAlerts}
            onCheckedChange={(checked) => updateSetting('emergencyAlerts', checked)}
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Notification Methods</h4>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-gray-500" />
              <Label className="text-sm">Push Notifications</Label>
            </div>
            <Switch 
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <Label className="text-sm">Email Notifications</Label>
            </div>
            <Switch 
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <Label className="text-sm">SMS Notifications</Label>
            </div>
            <Switch 
              checked={settings.smsNotifications}
              onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div>
            <Label className="text-sm">Reminder Sound</Label>
            <Select value={settings.reminderSound} onValueChange={(value) => updateSetting('reminderSound', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="gentle">Gentle</SelectItem>
                <SelectItem value="chime">Chime</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-gray-500" />
              <Label className="text-sm">Vibration</Label>
            </div>
            <Switch 
              checked={settings.reminderVibration}
              onCheckedChange={(checked) => updateSetting('reminderVibration', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SecuritySection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="w-5 h-5 mr-2 text-green-600" />
          Privacy & Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Fingerprint className="w-4 h-4 text-gray-500" />
            <div>
              <Label className="text-base">Biometric Authentication</Label>
              <p className="text-sm text-muted-foreground">Use fingerprint or face ID</p>
            </div>
          </div>
          <Switch 
            checked={settings.biometricAuth}
            onCheckedChange={(checked) => updateSetting('biometricAuth', checked)}
          />
        </div>

        <div>
          <Label className="text-sm">Auto-Lock Timeout</Label>
          <Select value={settings.autoLock} onValueChange={(value) => updateSetting('autoLock', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 minute</SelectItem>
              <SelectItem value="5">5 minutes</SelectItem>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Data Sharing with Providers</Label>
            <p className="text-sm text-muted-foreground">Allow healthcare providers to access data</p>
          </div>
          <Switch 
            checked={settings.dataSharing}
            onCheckedChange={(checked) => updateSetting('dataSharing', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Anonymous Analytics</Label>
            <p className="text-sm text-muted-foreground">Help improve the app with usage data</p>
          </div>
          <Switch 
            checked={settings.analyticsSharing}
            onCheckedChange={(checked) => updateSetting('analyticsSharing', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Crash Reporting</Label>
            <p className="text-sm text-muted-foreground">Send crash reports to help fix issues</p>
          </div>
          <Switch 
            checked={settings.crashReporting}
            onCheckedChange={(checked) => updateSetting('crashReporting', checked)}
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Account Security</h4>
          
          <Button variant="outline" className="w-full justify-start">
            <Lock className="w-4 h-4 mr-2" />
            Change Password
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <Shield className="w-4 h-4 mr-2" />
            Two-Factor Authentication
          </Button>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Subscription</h4>
          
          <Button 
            variant="outline" 
            className="w-full justify-start border-blue-200 bg-blue-50 hover:bg-blue-100"
            onClick={onSubscription}
          >
            <Crown className="w-4 h-4 mr-2 text-blue-600" />
            <div className="text-left flex-1">
              <div className="text-blue-900">Manage Subscription</div>
              <div className="text-xs text-blue-700">Current: Free Plan</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const AppearanceSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="w-5 h-5 mr-2 text-purple-600" />
          Appearance & Display
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Moon className="w-4 h-4 text-gray-500" />
            <div>
              <Label className="text-base">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Use dark theme</p>
            </div>
          </div>
          <Switch 
            checked={settings.darkMode}
            onCheckedChange={(checked) => updateSetting('darkMode', checked)}
          />
        </div>

        <div>
          <Label className="text-sm">Language</Label>
          <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm">Date Format</Label>
            <Select value={settings.dateFormat} onValueChange={(value) => updateSetting('dateFormat', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Time Format</Label>
            <Select value={settings.timeFormat} onValueChange={(value) => updateSetting('timeFormat', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12 Hour</SelectItem>
                <SelectItem value="24">24 Hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-sm">Font Size</Label>
          <Select value={settings.fontSize} onValueChange={(value) => updateSetting('fontSize', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="extra-large">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">High Contrast</Label>
            <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
          </div>
          <Switch 
            checked={settings.highContrast}
            onCheckedChange={(checked) => updateSetting('highContrast', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );

  const DataSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="w-5 h-5 mr-2 text-orange-600" />
          Data & Storage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Automatic Backup</Label>
            <p className="text-sm text-muted-foreground">Backup data to secure cloud storage</p>
          </div>
          <Switch 
            checked={settings.autoBackup}
            onCheckedChange={(checked) => updateSetting('autoBackup', checked)}
          />
        </div>

        <div>
          <Label className="text-sm">Backup Frequency</Label>
          <Select value={settings.backupFrequency} onValueChange={(value) => updateSetting('backupFrequency', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="manual">Manual Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Data Saver Mode</Label>
            <p className="text-sm text-muted-foreground">Reduce data usage and sync</p>
          </div>
          <Switch 
            checked={settings.dataSaver}
            onCheckedChange={(checked) => updateSetting('dataSaver', checked)}
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Data Management</h4>
          
          <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export Health Data
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <Upload className="w-4 h-4 mr-2" />
            Import Health Data
          </Button>

          <Button variant="outline" className="w-full justify-start">
            <Share className="w-4 h-4 mr-2" />
            Share with Doctor
          </Button>
        </div>

        <Separator />

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Storage Used</span>
            <span className="text-sm text-gray-900">18.9 MB / 100 MB</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '18.9%' }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SupportSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
          Help & Support
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" className="w-full justify-start">
          <HelpCircle className="w-4 h-4 mr-2" />
          Help Center
        </Button>
        
        <Button variant="outline" className="w-full justify-start">
          <MessageSquare className="w-4 h-4 mr-2" />
          Contact Support
        </Button>
        
        <Button variant="outline" className="w-full justify-start">
          <CheckCircle className="w-4 h-4 mr-2" />
          Send Feedback
        </Button>

        <Separator />

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">HealthRecord App v2.1.0</p>
          <p className="text-xs text-gray-500">© 2025 HealthTech Solutions</p>
          <div className="flex justify-center space-x-4 text-xs text-blue-600">
            <button>Privacy Policy</button>
            <button>Terms of Service</button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DangerZone = () => (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center text-red-600">
          <Trash2 className="w-5 h-5 mr-2" />
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800 mb-3">
            Deleting your account will permanently remove all your health data. This action cannot be undone.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete your account and all associated health data. 
                  This cannot be undone. Type "DELETE" to confirm.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl text-gray-900">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <NotificationSection />
        <SecuritySection />
        <AppearanceSection />
        <DataSection />
        <SupportSection />
        <DangerZone />
        
        <div className="pb-4"></div>
      </div>
    </div>
  );
}