import React from 'react';
import { Calendar, Pill, FileText, Activity, AlertCircle, Plus, Bell, Crown, TrendingUp, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface DashboardProps {
  onOpenProfile: () => void;
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
              className="p-1 rounded-full" 
              onClick={onOpenProfile}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-blue-600 text-white text-sm">
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