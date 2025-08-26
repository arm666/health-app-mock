import React, { useState } from 'react';
import { User, Settings, Shield, Bell, Download, Share, LogOut, ChevronRight, Edit, Phone, Mail, MapPin, Calendar, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';

interface ProfileScreenProps {
  onLogout: () => void;
  onEditProfile: () => void;
  onSettings: () => void;
  onSubscription: () => void;
}

export default function ProfileScreen({ onLogout, onEditProfile, onSettings, onSubscription }: ProfileScreenProps) {
  const [notifications, setNotifications] = useState({
    medications: true,
    appointments: true,
    results: true,
    health: false
  });

  const userInfo = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: 'March 15, 1985',
    address: '123 Health Street, Medical District, CA 90210',
    emergencyContact: 'John Johnson - (555) 987-6543',
    insuranceProvider: 'Blue Cross Blue Shield',
    policyNumber: 'BC123456789',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Shellfish']
  };

  const healthSummary = {
    totalRecords: 24,
    lastCheckup: 'August 15, 2025',
    activeMedications: 3,
    upcomingAppointments: 2
  };

  const settingsItems = [
    {
      title: 'Personal Information',
      description: 'Update your profile and emergency contacts',
      icon: User,
      action: onEditProfile
    },
    {
      title: 'Subscription & Billing',
      description: 'Manage your plan and billing information',
      icon: Crown,
      action: onSubscription,
      highlight: true
    },
    {
      title: 'App Settings',
      description: 'Privacy, notifications, and preferences',
      icon: Settings,
      action: onSettings
    },
    {
      title: 'Export Health Data',
      description: 'Download your complete health records',
      icon: Download,
      action: () => console.log('Export data')
    },
    {
      title: 'Share with Doctor',
      description: 'Generate QR code for easy data sharing',
      icon: Share,
      action: () => console.log('Share data')
    }
  ];

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b">
        <h1 className="text-xl text-gray-900">Profile</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* User Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-blue-600 text-white text-lg">
                  {userInfo.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl text-gray-900">{userInfo.name}</h2>
                <p className="text-sm text-gray-600">{userInfo.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary">Patient ID: P123456</Badge>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onEditProfile}>
                <Edit className="w-4 h-4" />
              </Button>
            </div>

            {/* Basic Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-900">{userInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-900">Born {userInfo.dateOfBirth}</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <span className="text-sm text-gray-900">{userInfo.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Health Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl text-blue-600">{healthSummary.totalRecords}</p>
                <p className="text-xs text-gray-600">Total Records</p>
              </div>
              <div className="text-center">
                <p className="text-2xl text-green-600">{healthSummary.activeMedications}</p>
                <p className="text-xs text-gray-600">Active Medications</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Last Checkup</span>
                <span className="text-gray-900">{healthSummary.lastCheckup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Blood Type</span>
                <span className="text-gray-900">{userInfo.bloodType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Known Allergies</span>
                <span className="text-gray-900">{userInfo.allergies.join(', ')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Emergency Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Emergency Contact</p>
              <p className="text-sm text-gray-900">{userInfo.emergencyContact}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Insurance Provider</p>
              <p className="text-sm text-gray-900">{userInfo.insuranceProvider}</p>
              <p className="text-xs text-gray-600">Policy: {userInfo.policyNumber}</p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900">Medication Reminders</p>
                <p className="text-xs text-gray-600">Daily medication alerts</p>
              </div>
              <Switch 
                checked={notifications.medications}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, medications: checked})
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900">Appointment Reminders</p>
                <p className="text-xs text-gray-600">Upcoming appointment alerts</p>
              </div>
              <Switch 
                checked={notifications.appointments}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, appointments: checked})
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900">Test Results</p>
                <p className="text-xs text-gray-600">New lab results notifications</p>
              </div>
              <Switch 
                checked={notifications.results}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, results: checked})
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900">Health Tips</p>
                <p className="text-xs text-gray-600">Weekly health insights</p>
              </div>
              <Switch 
                checked={notifications.health}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, health: checked})
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Settings Menu */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {settingsItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index}>
                  <button 
                    onClick={item.action}
                    className={`w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors ${
                      item.highlight ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${item.highlight ? 'text-blue-600' : 'text-gray-500'}`} />
                      <div className="text-left">
                        <p className={`text-sm ${item.highlight ? 'text-blue-900' : 'text-gray-900'}`}>{item.title}</p>
                        <p className={`text-xs ${item.highlight ? 'text-blue-700' : 'text-gray-600'}`}>{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.highlight && (
                        <Badge className="bg-blue-600 text-white text-xs">Free</Badge>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* App Information */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">HealthRecord App v2.1.0</p>
              <p className="text-xs text-gray-500">© 2025 HealthTech Solutions</p>
              <div className="flex justify-center space-x-4 text-xs text-blue-600">
                <button>Privacy Policy</button>
                <button>Terms of Service</button>
                <button>Support</button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button 
          variant="outline" 
          className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>

        <div className="pb-4"></div>
      </div>
    </div>
  );
}