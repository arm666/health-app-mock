import React, { useState } from 'react';
import { QrCode, Share, UserPlus, Clock, Shield, Eye, Trash2, Copy, CheckCircle, X, ArrowLeft, Plus, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ShareAccess {
  id: string;
  recipientName: string;
  recipientEmail: string;
  recipientType: 'doctor' | 'nurse' | 'hospital' | 'family' | 'emergency';
  shareType: 'emergency' | 'temporary' | 'permanent';
  dataShared: string[];
  expirationDate?: string;
  createdAt: string;
  lastAccessed?: string;
  accessCount: number;
  isActive: boolean;
  permissions: {
    viewProfile: boolean;
    viewMedications: boolean;
    viewAppointments: boolean;
    viewRecords: boolean;
    viewTreatments: boolean;
    viewEmergency: boolean;
  };
  emergencyAccess?: {
    contactNumber: string;
    relationship: string;
    priority: number;
  };
  temporaryAccess?: {
    duration: number; // in hours
    maxAccess: number;
  };
  qrCode: string;
  accessCode: string;
}

interface SharingSystemProps {
  onBack: () => void;
  shareType?: 'profile' | 'disease' | 'record';
  shareData?: any;
}

export default function SharingSystem({ onBack, shareType = 'profile', shareData }: SharingSystemProps) {
  const [currentView, setCurrentView] = useState<'main' | 'create' | 'manage' | 'qr'>('main');
  const [selectedShare, setSelectedShare] = useState<ShareAccess | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const [shareAccesses, setShareAccesses] = useState<ShareAccess[]>([
    {
      id: '1',
      recipientName: 'Dr. Sarah Wilson',
      recipientEmail: 'dr.wilson@citymedical.com',
      recipientType: 'doctor',
      shareType: 'permanent',
      dataShared: ['Profile', 'Medical Records', 'Treatments', 'Medications'],
      createdAt: '2025-08-20',
      lastAccessed: '2025-08-26',
      accessCount: 12,
      isActive: true,
      permissions: {
        viewProfile: true,
        viewMedications: true,
        viewAppointments: true,
        viewRecords: true,
        viewTreatments: true,
        viewEmergency: true
      },
      qrCode: 'QR_CODE_DATA_1',
      accessCode: 'MED-7823'
    },
    {
      id: '2',
      recipientName: 'Emergency Contact - John Doe',
      recipientEmail: 'john.doe@email.com',
      recipientType: 'emergency',
      shareType: 'emergency',
      dataShared: ['Emergency Profile', 'Current Medications', 'Allergies', 'Emergency Contacts'],
      createdAt: '2025-08-15',
      lastAccessed: null,
      accessCount: 0,
      isActive: true,
      permissions: {
        viewProfile: true,
        viewMedications: true,
        viewAppointments: false,
        viewRecords: false,
        viewTreatments: false,
        viewEmergency: true
      },
      emergencyAccess: {
        contactNumber: '+1-555-0123',
        relationship: 'Spouse',
        priority: 1
      },
      qrCode: 'QR_CODE_DATA_2',
      accessCode: 'EMG-4567'
    },
    {
      id: '3',
      recipientName: 'Nurse Jane Smith',
      recipientEmail: 'j.smith@citydialysis.com',
      recipientType: 'nurse',
      shareType: 'temporary',
      dataShared: ['Treatment Schedule', 'Current Medications', 'Recent Lab Results'],
      expirationDate: '2025-09-05',
      createdAt: '2025-08-25',
      lastAccessed: '2025-08-26',
      accessCount: 3,
      isActive: true,
      permissions: {
        viewProfile: false,
        viewMedications: true,
        viewAppointments: true,
        viewRecords: true,
        viewTreatments: true,
        viewEmergency: false
      },
      temporaryAccess: {
        duration: 240, // 10 days in hours
        maxAccess: 10
      },
      qrCode: 'QR_CODE_DATA_3',
      accessCode: 'TMP-8901'
    }
  ]);

  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    recipientType: 'doctor' as ShareAccess['recipientType'],
    shareType: 'temporary' as ShareAccess['shareType'],
    duration: 24,
    maxAccess: 5,
    emergencyContact: '',
    relationship: '',
    priority: 1,
    permissions: {
      viewProfile: true,
      viewMedications: true,
      viewAppointments: false,
      viewRecords: false,
      viewTreatments: false,
      viewEmergency: false
    },
    notes: ''
  });

  const generateQRCode = (accessCode: string) => {
    // In a real implementation, this would generate an actual QR code
    // For now, we'll create a simple visual representation
    return `https://health-records.app/share/${accessCode}`;
  };

  const generateAccessCode = () => {
    const prefix = formData.shareType === 'emergency' ? 'EMG' : formData.shareType === 'temporary' ? 'TMP' : 'PER';
    const code = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${code}`;
  };

  const handleCreateShare = (e: React.FormEvent) => {
    e.preventDefault();
    
    const accessCode = generateAccessCode();
    const newShare: ShareAccess = {
      id: Date.now().toString(),
      recipientName: formData.recipientName,
      recipientEmail: formData.recipientEmail,
      recipientType: formData.recipientType,
      shareType: formData.shareType,
      dataShared: getSharedData(),
      expirationDate: formData.shareType === 'temporary' ? 
        new Date(Date.now() + formData.duration * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      createdAt: new Date().toISOString().split('T')[0],
      accessCount: 0,
      isActive: true,
      permissions: formData.permissions,
      emergencyAccess: formData.shareType === 'emergency' ? {
        contactNumber: formData.emergencyContact,
        relationship: formData.relationship,
        priority: formData.priority
      } : undefined,
      temporaryAccess: formData.shareType === 'temporary' ? {
        duration: formData.duration,
        maxAccess: formData.maxAccess
      } : undefined,
      qrCode: generateQRCode(accessCode),
      accessCode
    };

    setShareAccesses(prev => [...prev, newShare]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const getSharedData = () => {
    const data = [];
    if (formData.permissions.viewProfile) data.push('Profile');
    if (formData.permissions.viewMedications) data.push('Medications');
    if (formData.permissions.viewAppointments) data.push('Appointments');
    if (formData.permissions.viewRecords) data.push('Medical Records');
    if (formData.permissions.viewTreatments) data.push('Treatments');
    if (formData.permissions.viewEmergency) data.push('Emergency Info');
    return data;
  };

  const resetForm = () => {
    setFormData({
      recipientName: '',
      recipientEmail: '',
      recipientType: 'doctor',
      shareType: 'temporary',
      duration: 24,
      maxAccess: 5,
      emergencyContact: '',
      relationship: '',
      priority: 1,
      permissions: {
        viewProfile: true,
        viewMedications: true,
        viewAppointments: false,
        viewRecords: false,
        viewTreatments: false,
        viewEmergency: false
      },
      notes: ''
    });
  };

  const handleRevokeAccess = () => {
    if (!selectedShare) return;
    
    setShareAccesses(prev => prev.map(share => 
      share.id === selectedShare.id 
        ? { ...share, isActive: false }
        : share
    ));
    
    setIsRevokeDialogOpen(false);
    setSelectedShare(null);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getTypeIcon = (type: ShareAccess['recipientType']) => {
    switch (type) {
      case 'doctor': return '👨‍⚕️';
      case 'nurse': return '👩‍⚕️';
      case 'hospital': return '🏥';
      case 'family': return '👨‍👩‍👧‍👦';
      case 'emergency': return '🚨';
      default: return '👤';
    }
  };

  const getShareTypeColor = (type: ShareAccess['shareType']) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'temporary': return 'bg-yellow-100 text-yellow-800';
      case 'permanent': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpired = (share: ShareAccess) => {
    if (!share.expirationDate) return false;
    return new Date(share.expirationDate) < new Date();
  };

  const renderMainView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Share Medical Records</h2>
          <p className="text-sm text-gray-600 mt-1">Securely share your medical information</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Share
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => {
          setFormData(prev => ({ ...prev, shareType: 'emergency' }));
          setIsCreateDialogOpen(true);
        }}>
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Emergency Share</p>
            <p className="text-xs text-gray-500 mt-1">Unlimited access</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => {
          setFormData(prev => ({ ...prev, shareType: 'temporary' }));
          setIsCreateDialogOpen(true);
        }}>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Temporary Share</p>
            <p className="text-xs text-gray-500 mt-1">Time-limited access</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => setCurrentView('manage')}>
          <CardContent className="p-4 text-center">
            <Settings className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Manage Shares</p>
            <p className="text-xs text-gray-500 mt-1">View & revoke access</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Shares Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Shares</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {shareAccesses.filter(share => share.isActive).map((share) => (
            <div key={share.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getTypeIcon(share.recipientType)}</span>
                <div>
                  <p className="font-medium text-gray-900">{share.recipientName}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getShareTypeColor(share.shareType)}>
                      {share.shareType}
                    </Badge>
                    {isExpired(share) && (
                      <Badge className="bg-red-100 text-red-800">Expired</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedShare(share);
                    setIsQRDialogOpen(true);
                  }}
                >
                  <QrCode className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedShare(share);
                    setIsRevokeDialogOpen(true);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {shareAccesses.filter(share => share.isActive).length === 0 && (
            <div className="text-center py-8">
              <Share className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No active shares yet</p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Create Your First Share
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderManageView = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView('main')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-semibold text-gray-900">Manage Shares</h2>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
          <TabsTrigger value="revoked">Revoked</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {shareAccesses.filter(share => share.isActive && !isExpired(share)).map((share) => (
            <Card key={share.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{getTypeIcon(share.recipientType)}</span>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium text-gray-900">{share.recipientName}</p>
                        <p className="text-sm text-gray-600">{share.recipientEmail}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getShareTypeColor(share.shareType)}>
                          {share.shareType}
                        </Badge>
                        <Badge variant="outline">
                          Access: {share.accessCount}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p>Created: {new Date(share.createdAt).toLocaleDateString()}</p>
                        {share.lastAccessed && (
                          <p>Last accessed: {new Date(share.lastAccessed).toLocaleDateString()}</p>
                        )}
                        {share.expirationDate && (
                          <p>Expires: {new Date(share.expirationDate).toLocaleDateString()}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-700">Shared Data:</p>
                        <div className="flex flex-wrap gap-1">
                          {share.dataShared.map((data, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {data}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedShare(share);
                        setIsQRDialogOpen(true);
                      }}
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedShare(share);
                        setIsRevokeDialogOpen(true);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="expired" className="space-y-4">
          {shareAccesses.filter(share => share.isActive && isExpired(share)).map((share) => (
            <Card key={share.id} className="opacity-75">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl grayscale">{getTypeIcon(share.recipientType)}</span>
                    <div>
                      <p className="font-medium text-gray-900">{share.recipientName}</p>
                      <Badge className="bg-red-100 text-red-800 mt-1">Expired</Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedShare(share);
                      setIsRevokeDialogOpen(true);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="revoked" className="space-y-4">
          {shareAccesses.filter(share => !share.isActive).map((share) => (
            <Card key={share.id} className="opacity-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl grayscale">{getTypeIcon(share.recipientType)}</span>
                  <div>
                    <p className="font-medium text-gray-900">{share.recipientName}</p>
                    <Badge className="bg-gray-100 text-gray-800 mt-1">Revoked</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Medical Sharing</h1>
            <p className="text-sm text-gray-600">Secure medical record sharing</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentView === 'main' && renderMainView()}
        {currentView === 'manage' && renderManageView()}
      </div>

      {/* Create Share Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Share</DialogTitle>
            <DialogDescription>
              Share your medical records securely with healthcare providers or emergency contacts.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateShare} className="space-y-4">
            <div>
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                placeholder="Dr. John Smith"
                required
              />
            </div>

            <div>
              <Label htmlFor="recipientEmail">Email</Label>
              <Input
                id="recipientEmail"
                type="email"
                value={formData.recipientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, recipientEmail: e.target.value }))}
                placeholder="doctor@hospital.com"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="recipientType">Recipient Type</Label>
                <Select 
                  value={formData.recipientType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, recipientType: value as ShareAccess['recipientType'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="emergency">Emergency Contact</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="shareType">Share Type</Label>
                <Select 
                  value={formData.shareType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, shareType: value as ShareAccess['shareType'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="permanent">Permanent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.shareType === 'temporary' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    min="1"
                    max="8760"
                  />
                </div>
                <div>
                  <Label htmlFor="maxAccess">Max Access Count</Label>
                  <Input
                    id="maxAccess"
                    type="number"
                    value={formData.maxAccess}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxAccess: parseInt(e.target.value) }))}
                    min="1"
                    max="100"
                  />
                </div>
              </div>
            )}

            {formData.shareType === 'emergency' && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="emergencyContact">Contact Number</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    placeholder="+1-555-0123"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input
                      id="relationship"
                      value={formData.relationship}
                      onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                      placeholder="Spouse, Parent, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority (1-5)</Label>
                    <Input
                      id="priority"
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                      min="1"
                      max="5"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="space-y-2">
                {Object.entries(formData.permissions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{key.replace('view', '').replace(/([A-Z])/g, ' $1').trim()}</span>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          permissions: { ...prev.permissions, [key]: checked }
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Create Share
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Share QR Code</DialogTitle>
            <DialogDescription>
              Share this QR code or access code with {selectedShare?.recipientName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedShare && (
            <div className="space-y-4">
              {/* QR Code Placeholder */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center">
                <QrCode className="w-32 h-32 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-500">QR Code</p>
                <p className="text-xs text-gray-400 mt-2">Scan to access medical records</p>
              </div>

              {/* Access Code */}
              <div className="space-y-2">
                <Label>Access Code</Label>
                <div className="flex items-center space-x-2">
                  <Input value={selectedShare.accessCode} readOnly className="text-center font-mono" />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(selectedShare.accessCode, 'code')}
                  >
                    {copySuccess === 'code' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Share Link */}
              <div className="space-y-2">
                <Label>Share Link</Label>
                <div className="flex items-center space-x-2">
                  <Input value={selectedShare.qrCode} readOnly className="text-xs" />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(selectedShare.qrCode, 'link')}
                  >
                    {copySuccess === 'link' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Share Details */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <Badge className={getShareTypeColor(selectedShare.shareType)}>
                    {selectedShare.shareType}
                  </Badge>
                </div>
                {selectedShare.expirationDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Expires:</span>
                    <span>{new Date(selectedShare.expirationDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Access Count:</span>
                  <span>{selectedShare.accessCount}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Revoke Access Dialog */}
      <AlertDialog open={isRevokeDialogOpen} onOpenChange={setIsRevokeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Access</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke access for {selectedShare?.recipientName}? 
              They will no longer be able to view your medical records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevokeAccess} className="bg-red-600 hover:bg-red-700">
              Revoke Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}