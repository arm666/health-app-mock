import React, { useState } from 'react';
import { ArrowLeft, Camera, Save, User, Phone, Mail, MapPin, Calendar, Heart, Shield, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';

interface ProfileEditScreenProps {
  onBack: () => void;
}

export default function ProfileEditScreen({ onBack }: ProfileEditScreenProps) {
  const [formData, setFormData] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-03-15',
    gender: 'female',
    address: '123 Health Street',
    city: 'Medical District',
    state: 'CA',
    zipCode: '90210',
    emergencyContactName: 'John Johnson',
    emergencyContactPhone: '(555) 987-6543',
    emergencyContactRelation: 'spouse',
    insuranceProvider: 'Blue Cross Blue Shield',
    policyNumber: 'BC123456789',
    groupNumber: 'GRP987654',
    bloodType: 'O+',
    allergies: 'Penicillin, Shellfish',
    medicalConditions: 'Type 2 Diabetes, Hypertension',
    currentMedications: 'Metformin 500mg, Lisinopril 10mg',
    primaryPhysician: 'Dr. Michael Chen',
    physicianPhone: '(555) 234-5678'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Profile updated successfully!');
      onBack();
    }, 1000);
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];
  const relationOptions = [
    { value: 'spouse', label: 'Spouse/Partner' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'friend', label: 'Friend' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl text-gray-900">Edit Profile</h1>
          <div className="flex-1"></div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Photo */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-blue-600 text-white text-xl">
                    {formData.firstName[0]}{formData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <h3 className="text-lg text-gray-900">Profile Photo</h3>
                <p className="text-sm text-gray-600">Upload a clear photo of yourself</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Change Photo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="San Francisco"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="CA"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                placeholder="90210"
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="emergencyContactName">Contact Name</Label>
              <Input
                id="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="emergencyContactPhone">Phone Number</Label>
                <Input
                  id="emergencyContactPhone"
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactRelation">Relationship</Label>
                <Select 
                  value={formData.emergencyContactRelation} 
                  onValueChange={(value) => handleInputChange('emergencyContactRelation', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-600" />
              Insurance Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="insuranceProvider">Insurance Provider</Label>
              <Input
                id="insuranceProvider"
                value={formData.insuranceProvider}
                onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                placeholder="Blue Cross Blue Shield"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Input
                  id="policyNumber"
                  value={formData.policyNumber}
                  onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                  placeholder="BC123456789"
                />
              </div>
              <div>
                <Label htmlFor="groupNumber">Group Number</Label>
                <Input
                  id="groupNumber"
                  value={formData.groupNumber}
                  onChange={(e) => handleInputChange('groupNumber', e.target.value)}
                  placeholder="GRP987654"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-600" />
              Medical Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bloodType">Blood Type</Label>
              <Select value={formData.bloodType} onValueChange={(value) => handleInputChange('bloodType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="allergies">Known Allergies</Label>
              <Textarea
                id="allergies"
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                placeholder="List any known allergies (e.g., Penicillin, Shellfish)"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="medicalConditions">Medical Conditions</Label>
              <Textarea
                id="medicalConditions"
                value={formData.medicalConditions}
                onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                placeholder="List any chronic conditions or diagnoses"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="currentMedications">Current Medications</Label>
              <Textarea
                id="currentMedications"
                value={formData.currentMedications}
                onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                placeholder="List current medications and dosages"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Primary Care Provider */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-600" />
              Primary Care Provider
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="primaryPhysician">Physician Name</Label>
              <Input
                id="primaryPhysician"
                value={formData.primaryPhysician}
                onChange={(e) => handleInputChange('primaryPhysician', e.target.value)}
                placeholder="Dr. John Smith"
              />
            </div>

            <div>
              <Label htmlFor="physicianPhone">Physician Phone</Label>
              <Input
                id="physicianPhone"
                type="tel"
                value={formData.physicianPhone}
                onChange={(e) => handleInputChange('physicianPhone', e.target.value)}
                placeholder="(555) 234-5678"
              />
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="text-sm text-orange-800 mb-1">Important Notice</h4>
                <p className="text-xs text-orange-700">
                  Ensure all information is accurate and up-to-date. This information may be used in medical emergencies.
                  Changes to insurance information should be verified with your provider.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="pb-4"></div>
      </div>
    </div>
  );
}