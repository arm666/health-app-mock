import React from 'react';
import { Calendar, Pill, FileText, Activity, AlertCircle, Plus, Bell, Crown, TrendingUp, User, Heart, Thermometer, Zap, Users, Target, Shield, BookOpen, Cloud, Phone, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface DashboardProps {
  onOpenProfile?: () => void;
}

export default function Dashboard({ onOpenProfile }: DashboardProps) {
  const todaysMedications = [
    { name: 'Metformin', time: '8:00 AM', taken: true },
    { name: 'Lisinopril', time: '12:00 PM', taken: false },
    { name: 'Vitamin D', time: '6:00 PM', taken: false },
  ];

  const upcomingAppointments = [
    { doctor: 'Dr. Sarah Wilson', specialty: 'Cardiology', date: 'Tomorrow', time: '10:30 AM' },
    { doctor: 'Dr. Michael Chen', specialty: 'General Practice', date: 'Friday', time: '2:00 PM' },
  ];

  const healthMetrics = [
    { label: 'Medication Adherence', value: 87, color: 'text-green-600' },
    { label: 'Health Score', value: 92, color: 'text-blue-600' },
  ];

  const vitals = [
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'normal', icon: Heart },
    { label: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal', icon: Activity },
    { label: 'Temperature', value: '98.6', unit: '°F', status: 'normal', icon: Thermometer },
    { label: 'Weight', value: '165', unit: 'lbs', status: 'stable', icon: TrendingUp },
  ];

  const careTeam = [
    { name: 'Dr. Sarah Wilson', specialty: 'Cardiologist', lastVisit: '2 weeks ago', avatar: 'SW' },
    { name: 'Dr. Michael Chen', specialty: 'Primary Care', lastVisit: '1 month ago', avatar: 'MC' },
    { name: 'Dr. Lisa Rodriguez', specialty: 'Endocrinologist', lastVisit: '6 weeks ago', avatar: 'LR' },
  ];

  const wellnessGoals = [
    { title: 'Daily Steps', current: 8420, target: 10000, unit: 'steps', progress: 84 },
    { title: 'Water Intake', current: 6, target: 8, unit: 'glasses', progress: 75 },
    { title: 'Medication Adherence', current: 87, target: 95, unit: '%', progress: 92 },
  ];

  const healthInsights = [
    {
      title: 'Great Medication Progress!',
      description: 'You\'ve taken 87% of medications on time this week',
      type: 'success',
      icon: Pill
    },
    {
      title: 'Schedule Annual Checkup',
      description: 'It\'s been 11 months since your last physical exam',
      type: 'reminder',
      icon: Calendar
    },
    {
      title: 'Lab Results Available',
      description: 'Your recent blood work results are ready for review',
      type: 'info',
      icon: FileText
    }
  ];

  const emergencyInfo = {
    emergencyContact: 'John Johnson',
    emergencyPhone: '+1 (555) 987-6543',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Shellfish']
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl text-gray-900">Good morning, Sarah</h1>
            <p className="text-sm text-gray-600">Tuesday, August 26, 2025</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell size={20} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 hover:bg-gray-100"
              onClick={onOpenProfile}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="Sarah Johnson" />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                  SJ
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Subscription Status */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-900 font-medium">Free Plan</p>
                  <p className="text-xs text-blue-700">24/50 records used • 18.9/100 MB storage</p>
                </div>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <TrendingUp className="w-4 h-4 mr-1" />
                Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Health Alert */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-orange-800">
                  You have 2 missed medications today. Tap to view details.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="h-20 bg-blue-600 hover:bg-blue-700 flex-col space-y-1">
            <Calendar size={24} />
            <span className="text-sm">Book Appointment</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-1">
            <Plus size={24} />
            <span className="text-sm">Add Record</span>
          </Button>
        </div>

        {/* Health Metrics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Health Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {healthMetrics.map((metric, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">{metric.label}</span>
                  <span className={`text-sm ${metric.color}`}>{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Today's Medications */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Pill className="w-5 h-5 mr-2 text-green-600" />
                Today's Medications
              </CardTitle>
              <Badge variant="secondary">{todaysMedications.filter(m => !m.taken).length} pending</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaysMedications.map((med, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${med.taken ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <p className="text-sm text-gray-900">{med.name}</p>
                    <p className="text-xs text-gray-600">{med.time}</p>
                  </div>
                </div>
                {!med.taken && (
                  <Button size="sm" variant="outline">
                    Mark Taken
                  </Button>
                )}
              </div>
            ))}
            <Button variant="ghost" className="w-full text-blue-600">
              View All Medications
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAppointments.map((appointment, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-900">{appointment.doctor}</p>
                    <p className="text-xs text-gray-600">{appointment.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{appointment.date}</p>
                    <p className="text-xs text-gray-600">{appointment.time}</p>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-blue-600">
              View All Appointments
            </Button>
          </CardContent>
        </Card>

        {/* Health Insights */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-600" />
              Health Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {healthInsights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={index} className={`p-3 rounded-lg border ${
                  insight.type === 'success' ? 'bg-green-50 border-green-200' :
                  insight.type === 'reminder' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <Icon className={`w-5 h-5 mt-0.5 ${
                      insight.type === 'success' ? 'text-green-600' :
                      insight.type === 'reminder' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        insight.type === 'success' ? 'text-green-900' :
                        insight.type === 'reminder' ? 'text-yellow-900' :
                        'text-blue-900'
                      }`}>{insight.title}</p>
                      <p className={`text-xs ${
                        insight.type === 'success' ? 'text-green-700' :
                        insight.type === 'reminder' ? 'text-yellow-700' :
                        'text-blue-700'
                      }`}>{insight.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Latest Vitals */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Latest Vitals
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-blue-600">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {vitals.map((vital, index) => {
                const Icon = vital.icon;
                return (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon className="w-4 h-4 text-gray-500" />
                      <p className="text-xs text-gray-600">{vital.label}</p>
                    </div>
                    <p className="text-lg text-gray-900">{vital.value}</p>
                    <p className="text-xs text-gray-500">{vital.unit}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Care Team */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Stethoscope className="w-5 h-5 mr-2 text-purple-600" />
              Your Care Team
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {careTeam.map((doctor, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{doctor.avatar}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{doctor.name}</p>
                  <p className="text-xs text-gray-600">{doctor.specialty}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Last visit</p>
                  <p className="text-xs text-gray-900">{doctor.lastVisit}</p>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-blue-600">
              Manage Care Team
            </Button>
          </CardContent>
        </Card>

        {/* Wellness Goals */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Today's Wellness Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {wellnessGoals.map((goal, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">{goal.title}</span>
                  <span className="text-sm text-gray-900">{goal.current}/{goal.target} {goal.unit}</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}
            <Button variant="ghost" className="w-full text-green-600">
              View All Goals
            </Button>
          </CardContent>
        </Card>

        {/* Emergency Information */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center text-red-800">
              <Shield className="w-5 h-5 mr-2" />
              Emergency Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-red-600" />
                <div>
                  <p className="text-sm text-gray-900">{emergencyInfo.emergencyContact}</p>
                  <p className="text-xs text-gray-600">Emergency Contact</p>
                </div>
              </div>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                Call
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-white rounded-lg text-center">
                <p className="text-lg text-red-600">{emergencyInfo.bloodType}</p>
                <p className="text-xs text-gray-600">Blood Type</p>
              </div>
              <div className="p-2 bg-white rounded-lg text-center">
                <p className="text-sm text-red-600">{emergencyInfo.allergies.length}</p>
                <p className="text-xs text-gray-600">Allergies</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Tips */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
              Today's Health Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h4 className="text-sm text-indigo-900 mb-2">Stay Hydrated</h4>
              <p className="text-xs text-indigo-700">
                Drinking adequate water helps maintain blood pressure, supports kidney function, and aids medication absorption. 
                Aim for 8 glasses throughout the day.
              </p>
              <Button variant="ghost" size="sm" className="text-indigo-600 mt-2 p-0 h-auto">
                Read More Health Tips
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <FileText className="w-5 h-5 mr-2 text-gray-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Blood test results uploaded</p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Appointment with Dr. Wilson confirmed</p>
                  <p className="text-xs text-gray-600">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Prescription refill requested</p>
                  <p className="text-xs text-gray-600">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}