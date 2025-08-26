import React, { useState } from 'react';
import { Pill, Plus, Clock, Calendar, AlertCircle, Check, MoreVertical, Bell, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate: string;
  remaining: number;
  total: number;
  reminders: boolean;
  color: string;
  taken: Record<string, boolean>;
  instructions?: string;
  prescribedBy?: string;
  condition?: string;
}

export default function MedicationScreen() {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 1,
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      times: ['8:00 AM', '8:00 PM'],
      startDate: '2025-07-01',
      endDate: '2026-07-01',
      remaining: 45,
      total: 60,
      reminders: true,
      color: 'bg-blue-500',
      taken: { '8:00 AM': true, '8:00 PM': false },
      prescribedBy: 'Dr. Michael Chen',
      condition: 'Type 2 Diabetes',
      instructions: 'Take with food to reduce stomach upset'
    },
    {
      id: 2,
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      times: ['12:00 PM'],
      startDate: '2025-06-15',
      endDate: '2026-06-15',
      remaining: 28,
      total: 30,
      reminders: true,
      color: 'bg-green-500',
      taken: { '12:00 PM': false },
      prescribedBy: 'Dr. Sarah Wilson',
      condition: 'High Blood Pressure',
      instructions: 'Take at the same time each day'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [formData, setFormData] = useState<Partial<Medication>>({});

  const todaySchedule = medications.flatMap(med => 
    med.times.map(time => ({
      medication: med.name,
      time,
      taken: med.taken[time] || false,
      color: med.color,
      id: med.id
    }))
  ).sort((a, b) => {
    const timeA = new Date(`2000-01-01 ${a.time}`).getTime();
    const timeB = new Date(`2000-01-01 ${b.time}`).getTime();
    return timeA - timeB;
  });

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-pink-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newMedication: Medication = {
      id: Date.now(),
      ...formData as Medication,
      color: randomColor,
      taken: {},
      remaining: formData.total || 0
    };
    
    setMedications(prev => [...prev, newMedication]);
    setIsAddDialogOpen(false);
    setFormData({});
  };

  const handleEditMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedication) return;

    setMedications(prev => prev.map(med => 
      med.id === selectedMedication.id ? { ...med, ...formData } : med
    ));
    
    setIsEditDialogOpen(false);
    setSelectedMedication(null);
    setFormData({});
  };

  const handleDeleteMedication = () => {
    if (!selectedMedication) return;

    setMedications(prev => prev.filter(med => med.id !== selectedMedication.id));
    setIsDeleteDialogOpen(false);
    setSelectedMedication(null);
  };

  const openEditDialog = (medication: Medication) => {
    setSelectedMedication(medication);
    setFormData(medication);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsDeleteDialogOpen(true);
  };

  const toggleReminder = (id: number) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, reminders: !med.reminders } : med
    ));
  };

  const markAsTaken = (medicationName: string, time: string) => {
    setMedications(prev => prev.map(med => {
      if (med.name === medicationName) {
        return {
          ...med,
          taken: { ...med.taken, [time]: true },
          remaining: med.remaining > 0 ? med.remaining - 1 : 0
        };
      }
      return med;
    }));
  };

  const getAdherencePercentage = (med: Medication) => {
    return Math.round(((med.total - med.remaining) / med.total) * 100);
  };

  const getRefillStatus = (remaining: number, total: number) => {
    const percentage = (remaining / total) * 100;
    if (percentage <= 20) return { status: 'Critical', color: 'text-red-600' };
    if (percentage <= 50) return { status: 'Low', color: 'text-yellow-600' };
    return { status: 'Good', color: 'text-green-600' };
  };

  const MedicationForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void, isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Medication Name</Label>
        <Input
          id="name"
          value={formData.name || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Metformin"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="dosage">Dosage</Label>
          <Input
            id="dosage"
            value={formData.dosage || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
            placeholder="e.g., 500mg"
            required
          />
        </div>
        <div>
          <Label htmlFor="frequency">Frequency</Label>
          <Select value={formData.frequency || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Once daily">Once daily</SelectItem>
              <SelectItem value="Twice daily">Twice daily</SelectItem>
              <SelectItem value="Three times daily">Three times daily</SelectItem>
              <SelectItem value="Four times daily">Four times daily</SelectItem>
              <SelectItem value="As needed">As needed</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="times">Times (comma separated)</Label>
        <Input
          id="times"
          value={Array.isArray(formData.times) ? formData.times.join(', ') : ''}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            times: e.target.value.split(',').map(time => time.trim()).filter(time => time)
          }))}
          placeholder="e.g., 8:00 AM, 8:00 PM"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="total">Total Pills</Label>
          <Input
            id="total"
            type="number"
            value={formData.total || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, total: parseInt(e.target.value) || 0 }))}
            placeholder="e.g., 30"
            required
          />
        </div>
        <div>
          <Label htmlFor="remaining">Pills Remaining</Label>
          <Input
            id="remaining"
            type="number"
            value={formData.remaining || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, remaining: parseInt(e.target.value) || 0 }))}
            placeholder="e.g., 25"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="prescribedBy">Prescribed By</Label>
        <Input
          id="prescribedBy"
          value={formData.prescribedBy || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, prescribedBy: e.target.value }))}
          placeholder="e.g., Dr. John Smith"
        />
      </div>

      <div>
        <Label htmlFor="condition">Condition</Label>
        <Input
          id="condition"
          value={formData.condition || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
          placeholder="e.g., High Blood Pressure"
        />
      </div>

      <div>
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          id="instructions"
          value={formData.instructions || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
          placeholder="Special instructions for taking this medication"
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="reminders"
          checked={formData.reminders || false}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, reminders: checked }))}
        />
        <Label htmlFor="reminders">Enable reminders</Label>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          {isEdit ? 'Update Medication' : 'Add Medication'}
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

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-xl text-gray-900">Medications</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus size={16} className="mr-1" />
                Add Med
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Medication</DialogTitle>
                <DialogDescription>
                  Add a new medication to your tracking list with dosage and reminder settings.
                </DialogDescription>
              </DialogHeader>
              <MedicationForm onSubmit={handleAddMedication} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="all">All Meds</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            {/* Today's Overview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaySchedule.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <div>
                          <p className="text-sm text-gray-900">{item.medication}</p>
                          <p className="text-xs text-gray-600">{item.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.taken ? (
                          <Badge className="bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            Taken
                          </Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => markAsTaken(item.medication, item.time)}
                          >
                            Mark Taken
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-800">Today's Progress</span>
                    <span className="text-sm text-blue-800">
                      {todaySchedule.filter(item => item.taken).length}/{todaySchedule.length} taken
                    </span>
                  </div>
                  <Progress 
                    value={(todaySchedule.filter(item => item.taken).length / todaySchedule.length) * 100} 
                    className="h-2 mt-2" 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Reminders */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-purple-600" />
                  Next Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaySchedule.filter(item => !item.taken).slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-900">{item.medication}</p>
                        <p className="text-xs text-gray-600">Due at {item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {medications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Pill className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 text-center">No medications added</p>
                  <Button 
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    Add Your First Medication
                  </Button>
                </CardContent>
              </Card>
            ) : (
              medications.map((medication) => {
                const refillStatus = getRefillStatus(medication.remaining, medication.total);
                return (
                  <Card key={medication.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${medication.color}`}></div>
                          <div>
                            <h3 className="text-base text-gray-900">{medication.name}</h3>
                            <p className="text-sm text-gray-600">{medication.dosage} • {medication.frequency}</p>
                            {medication.condition && (
                              <p className="text-xs text-gray-500">For {medication.condition}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(medication)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(medication)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Reminders</span>
                          <Switch 
                            checked={medication.reminders}
                            onCheckedChange={() => toggleReminder(medication.id)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Pills remaining</span>
                          <span className={`text-sm ${refillStatus.color}`}>
                            {medication.remaining} ({refillStatus.status})
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Adherence</span>
                            <span className="text-gray-900">{getAdherencePercentage(medication)}%</span>
                          </div>
                          <Progress value={getAdherencePercentage(medication)} className="h-2" />
                        </div>

                        {medication.instructions && (
                          <div className="p-2 bg-blue-50 border-l-2 border-blue-400">
                            <p className="text-xs text-blue-800">
                              <strong>Instructions:</strong> {medication.instructions}
                            </p>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Edit Schedule
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Refill Request
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="tracking" className="space-y-4">
            {/* Adherence Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Adherence Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl text-green-600 mb-2">87%</div>
                    <p className="text-sm text-gray-600">Overall Adherence Rate</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-xl text-blue-600">156</p>
                      <p className="text-xs text-gray-600">Doses taken this month</p>
                    </div>
                    <div>
                      <p className="text-xl text-red-600">24</p>
                      <p className="text-xs text-gray-600">Missed doses</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Individual Medication Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Individual Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {medications.map((med) => (
                  <div key={med.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${med.color}`}></div>
                      <div>
                        <p className="text-sm text-gray-900">{med.name}</p>
                        <p className="text-xs text-gray-600">{getAdherencePercentage(med)}% adherence</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Refill Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                  Refill Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {medications.filter(med => (med.remaining / med.total) <= 0.5).map((med) => (
                    <div key={med.id} className="flex items-center justify-between p-3 bg-orange-50 border-l-2 border-orange-400 rounded">
                      <div>
                        <p className="text-sm text-orange-800">{med.name}</p>
                        <p className="text-xs text-orange-600">{med.remaining} pills remaining</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-orange-300">
                        Request Refill
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Medication</DialogTitle>
            <DialogDescription>
              Update the medication details, dosage, and reminder settings.
            </DialogDescription>
          </DialogHeader>
          <MedicationForm onSubmit={handleEditMedication} isEdit />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medication</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedMedication?.name}? This will remove all tracking data and reminders for this medication.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMedication} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}