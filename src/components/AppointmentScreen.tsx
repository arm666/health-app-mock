import React, { useState } from 'react';
import { Calendar, Plus, Clock, MapPin, Phone, ChevronRight, Filter, Edit, Trash2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  address?: string;
  phone?: string;
  type: string;
  notes?: string;
  completed?: boolean;
  summary?: string;
}

export default function AppointmentScreen() {
  const [appointments, setAppointments] = useState<{upcoming: Appointment[], past: Appointment[]}>({
    upcoming: [
      {
        id: 1,
        doctor: 'Dr. Sarah Wilson',
        specialty: 'Cardiology',
        date: '2025-08-27',
        time: '10:30 AM',
        duration: '45 min',
        location: 'City Medical Center',
        address: '123 Health St, Medical District',
        phone: '(555) 123-4567',
        type: 'Follow-up',
        notes: 'Bring previous ECG reports'
      },
      {
        id: 2,
        doctor: 'Dr. Michael Chen',
        specialty: 'General Practice',
        date: '2025-08-29',
        time: '2:00 PM',
        duration: '30 min',
        location: 'Community Health Clinic',
        address: '456 Wellness Ave, Downtown',
        phone: '(555) 987-6543',
        type: 'Annual Checkup',
        notes: 'Fasting required - last meal before 10 PM'
      }
    ],
    past: [
      {
        id: 3,
        doctor: 'Dr. Emily Rodriguez',
        specialty: 'Dermatology',
        date: '2025-08-20',
        time: '11:15 AM',
        duration: '30 min',
        location: 'Skin Health Center',
        type: 'Consultation',
        completed: true,
        summary: 'Routine skin check - all clear. Next appointment in 6 months.'
      },
      {
        id: 4,
        doctor: 'Dr. James Parker',
        specialty: 'Orthopedics',
        date: '2025-08-15',
        time: '3:30 PM',
        duration: '45 min',
        location: 'Sports Medicine Clinic',
        type: 'Follow-up',
        completed: true,
        summary: 'Knee rehabilitation progressing well. Continue physical therapy.'
      }
    ]
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState<Partial<Appointment>>({});

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: Appointment = {
      id: Date.now(),
      ...formData as Appointment
    };
    
    setAppointments(prev => ({
      ...prev,
      upcoming: [...prev.upcoming, newAppointment]
    }));
    
    setIsAddDialogOpen(false);
    setFormData({});
  };

  const handleEditAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    setAppointments(prev => ({
      upcoming: prev.upcoming.map(apt => 
        apt.id === selectedAppointment.id ? { ...apt, ...formData } : apt
      ),
      past: prev.past.map(apt => 
        apt.id === selectedAppointment.id ? { ...apt, ...formData } : apt
      )
    }));
    
    setIsEditDialogOpen(false);
    setSelectedAppointment(null);
    setFormData({});
  };

  const handleDeleteAppointment = () => {
    if (!selectedAppointment) return;

    setAppointments(prev => ({
      upcoming: prev.upcoming.filter(apt => apt.id !== selectedAppointment.id),
      past: prev.past.filter(apt => apt.id !== selectedAppointment.id)
    }));
    
    setIsDeleteDialogOpen(false);
    setSelectedAppointment(null);
  };

  const openEditDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setFormData(appointment);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteDialogOpen(true);
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'Follow-up': return 'bg-blue-100 text-blue-800';
      case 'Annual Checkup': return 'bg-green-100 text-green-800';
      case 'Consultation': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const AppointmentForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void, isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="doctor">Doctor Name</Label>
          <Input
            id="doctor"
            value={formData.doctor || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, doctor: e.target.value }))}
            placeholder="Dr. John Smith"
            required
          />
        </div>
        <div>
          <Label htmlFor="specialty">Specialty</Label>
          <Select value={formData.specialty || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, specialty: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General Practice">General Practice</SelectItem>
              <SelectItem value="Cardiology">Cardiology</SelectItem>
              <SelectItem value="Dermatology">Dermatology</SelectItem>
              <SelectItem value="Orthopedics">Orthopedics</SelectItem>
              <SelectItem value="Neurology">Neurology</SelectItem>
              <SelectItem value="Pediatrics">Pediatrics</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={formData.time?.replace(' AM', '').replace(' PM', '') || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Select value={formData.duration || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15 min">15 minutes</SelectItem>
              <SelectItem value="30 min">30 minutes</SelectItem>
              <SelectItem value="45 min">45 minutes</SelectItem>
              <SelectItem value="60 min">1 hour</SelectItem>
              <SelectItem value="90 min">1.5 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Consultation">Consultation</SelectItem>
              <SelectItem value="Follow-up">Follow-up</SelectItem>
              <SelectItem value="Annual Checkup">Annual Checkup</SelectItem>
              <SelectItem value="Urgent Care">Urgent Care</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          placeholder="Hospital/Clinic Name"
          required
        />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          placeholder="Full address"
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="(555) 123-4567"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Special instructions or reminders"
          rows={3}
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          {isEdit ? 'Update Appointment' : 'Book Appointment'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            setFormData({});
          }}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );

  const AppointmentCard = ({ appointment, showActions = true }: { appointment: Appointment, showActions?: boolean }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base text-gray-900">{appointment.doctor}</h3>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(appointment.type)}>
                  {appointment.type}
                </Badge>
                {showActions && (
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditDialog(appointment);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteDialog(appointment);
                      }}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600">{appointment.specialty}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(appointment.date)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{appointment.time} ({appointment.duration})</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{appointment.location}</span>
          </div>
        </div>

        {appointment.notes && (
          <div className="mt-3 p-2 bg-yellow-50 border-l-2 border-yellow-400">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> {appointment.notes}
            </p>
          </div>
        )}

        {appointment.summary && (
          <div className="mt-3 p-3 bg-green-50 border-l-2 border-green-400">
            <p className="text-xs text-green-800">
              <strong>Summary:</strong> {appointment.summary}
            </p>
          </div>
        )}

        {!showActions && appointment.phone && (
          <div className="flex space-x-2 mt-4">
            <Button variant="outline" size="sm" className="flex-1">
              <Phone className="w-4 h-4 mr-1" />
              Call
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <MapPin className="w-4 h-4 mr-1" />
              Directions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-xl text-gray-900">Appointments</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Filter size={20} />
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus size={16} className="mr-1" />
                  Book
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Book New Appointment</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to schedule a new appointment with your healthcare provider.
                  </DialogDescription>
                </DialogHeader>
                <AppointmentForm onSubmit={handleAddAppointment} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {appointments.upcoming.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 text-center">No upcoming appointments</p>
                  <Button 
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    Book Your First Appointment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              appointments.upcoming.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {appointments.past.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} showActions={false} />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>
              Update the appointment details below.
            </DialogDescription>
          </DialogHeader>
          <AppointmentForm onSubmit={handleEditAppointment} isEdit />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this appointment with {selectedAppointment?.doctor}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAppointment} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}