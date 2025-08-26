import React, { useState } from 'react';
import { FileText, Image, Download, Share, Search, Filter, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

interface MedicalRecord {
  id: number;
  title: string;
  date: string;
  doctor: string;
  facility: string;
  type: string;
  status: string;
  fileType: string;
  size: string;
  category: 'lab-results' | 'imaging' | 'prescriptions' | 'vaccinations';
  notes?: string;
  results?: string;
}

export default function RecordsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<Record<string, MedicalRecord[]>>({
    'lab-results': [
      {
        id: 1,
        title: 'Complete Blood Count (CBC)',
        date: '2025-08-22',
        doctor: 'Dr. Sarah Wilson',
        facility: 'City Medical Center',
        type: 'Lab Test',
        status: 'Normal',
        fileType: 'PDF',
        size: '245 KB',
        category: 'lab-results',
        results: 'All values within normal range. White blood cell count: 7,200/μL, Red blood cell count: 4.5 million/μL'
      },
      {
        id: 2,
        title: 'Lipid Panel',
        date: '2025-08-15',
        doctor: 'Dr. Michael Chen',
        facility: 'Community Health Clinic',
        type: 'Lab Test',
        status: 'Attention Required',
        fileType: 'PDF',
        size: '189 KB',
        category: 'lab-results',
        results: 'Total cholesterol: 240 mg/dL (High). Recommend dietary changes and follow-up in 3 months.'
      }
    ],
    'imaging': [
      {
        id: 4,
        title: 'Chest X-Ray',
        date: '2025-08-18',
        doctor: 'Dr. Emily Rodriguez',
        facility: 'Radiology Center',
        type: 'X-Ray',
        status: 'Normal',
        fileType: 'DICOM',
        size: '2.1 MB',
        category: 'imaging',
        results: 'Clear lung fields. No signs of infection or abnormalities.'
      }
    ],
    'prescriptions': [
      {
        id: 6,
        title: 'Metformin 500mg',
        date: '2025-08-20',
        doctor: 'Dr. Michael Chen',
        facility: 'Community Health Clinic',
        type: 'Prescription',
        status: 'Active',
        fileType: 'PDF',
        size: '98 KB',
        category: 'prescriptions',
        notes: 'Take twice daily with meals. Monitor blood sugar levels.'
      }
    ],
    'vaccinations': [
      {
        id: 8,
        title: 'COVID-19 Vaccine (Booster)',
        date: '2025-07-15',
        doctor: 'Dr. Lisa Wang',
        facility: 'Vaccination Center',
        type: 'Vaccination',
        status: 'Completed',
        fileType: 'PDF',
        size: '234 KB',
        category: 'vaccinations',
        notes: 'Next booster recommended in 6 months.'
      }
    ]
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [formData, setFormData] = useState<Partial<MedicalRecord>>({});
  const [activeTab, setActiveTab] = useState('lab-results');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) return;

    const newRecord: MedicalRecord = {
      id: Date.now(),
      ...formData as MedicalRecord,
      size: selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB` : '0 KB',
      fileType: selectedFile ? selectedFile.type.includes('image') ? 'Image' : 'PDF' : 'PDF'
    };
    
    setRecords(prev => ({
      ...prev,
      [formData.category!]: [...prev[formData.category!], newRecord]
    }));
    
    setIsAddDialogOpen(false);
    setFormData({});
    setSelectedFile(null);
  };

  const handleEditRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    setRecords(prev => ({
      ...prev,
      [selectedRecord.category]: prev[selectedRecord.category].map(record => 
        record.id === selectedRecord.id ? { ...record, ...formData } : record
      )
    }));
    
    setIsEditDialogOpen(false);
    setSelectedRecord(null);
    setFormData({});
  };

  const handleDeleteRecord = () => {
    if (!selectedRecord) return;

    setRecords(prev => ({
      ...prev,
      [selectedRecord.category]: prev[selectedRecord.category].filter(record => record.id !== selectedRecord.id)
    }));
    
    setIsDeleteDialogOpen(false);
    setSelectedRecord(null);
  };

  const openViewDialog = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsViewDialogOpen(true);
  };

  const openEditDialog = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setFormData(record);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsDeleteDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'bg-green-100 text-green-800';
      case 'Attention Required': return 'bg-red-100 text-red-800';
      case 'Review Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Active': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'DICOM':
      case 'Image':
        return <Image className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const RecordForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void, isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., Blood Test Results"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select 
            value={formData.category || ''} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as MedicalRecord['category'] }))}
            disabled={isEdit}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lab-results">Lab Results</SelectItem>
              <SelectItem value="imaging">Imaging</SelectItem>
              <SelectItem value="prescriptions">Prescriptions</SelectItem>
              <SelectItem value="vaccinations">Vaccinations</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Input
            id="type"
            value={formData.type || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            placeholder="e.g., Lab Test"
            required
          />
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
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Normal">Normal</SelectItem>
              <SelectItem value="Attention Required">Attention Required</SelectItem>
              <SelectItem value="Review Scheduled">Review Scheduled</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="doctor">Doctor</Label>
        <Input
          id="doctor"
          value={formData.doctor || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, doctor: e.target.value }))}
          placeholder="Dr. John Smith"
          required
        />
      </div>

      <div>
        <Label htmlFor="facility">Facility</Label>
        <Input
          id="facility"
          value={formData.facility || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, facility: e.target.value }))}
          placeholder="Hospital/Clinic Name"
          required
        />
      </div>

      {!isEdit && (
        <div>
          <Label htmlFor="file">Upload File</Label>
          <Input
            id="file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.dicom"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      )}

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes or observations"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="results">Results/Details</Label>
        <Textarea
          id="results"
          value={formData.results || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, results: e.target.value }))}
          placeholder="Test results or prescription details"
          rows={3}
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          {isEdit ? 'Update Record' : 'Add Record'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            setFormData({});
            setSelectedFile(null);
          }}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );

  const RecordCard = ({ record }: { record: MedicalRecord }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getFileIcon(record.fileType)}
              <h3 className="text-sm text-gray-900">{record.title}</h3>
            </div>
            <p className="text-xs text-gray-600">{record.doctor}</p>
            <p className="text-xs text-gray-500">{record.facility}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(record.status)}>
              {record.status}
            </Badge>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  openViewDialog(record);
                }}
                className="h-8 w-8 p-0"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditDialog(record);
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
                  openDeleteDialog(record);
                }}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{formatDate(record.date)}</span>
          <span>{record.size}</span>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => openViewDialog(record)}>
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-3 h-3" />
          </Button>
          <Button variant="outline" size="sm">
            <Share className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const filteredRecords = Object.keys(records).reduce((acc, category) => {
    acc[category] = records[category].filter(record =>
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return acc;
  }, {} as Record<string, MedicalRecord[]>);

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl text-gray-900">Medical Records</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus size={16} className="mr-1" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Record</DialogTitle>
                <DialogDescription>
                  Upload and organize your medical records in the appropriate category.
                </DialogDescription>
              </DialogHeader>
              <RecordForm onSubmit={handleAddRecord} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
            <Filter size={16} />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="lab-results" className="text-xs">Lab Results</TabsTrigger>
            <TabsTrigger value="imaging" className="text-xs">Imaging</TabsTrigger>
            <TabsTrigger value="prescriptions" className="text-xs">Prescriptions</TabsTrigger>
            <TabsTrigger value="vaccinations" className="text-xs">Vaccines</TabsTrigger>
          </TabsList>

          {Object.entries(filteredRecords).map(([category, categoryRecords]) => (
            <TabsContent key={category} value={category} className="space-y-3">
              {categoryRecords.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 text-center">No records found</p>
                    <Button 
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setFormData({ category: category as MedicalRecord['category'] });
                        setIsAddDialogOpen(true);
                      }}
                    >
                      Add First Record
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                categoryRecords.map((record) => (
                  <RecordCard key={record.id} record={record} />
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Summary Stats */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Storage Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl text-blue-600">
                  {Object.values(records).reduce((total, categoryRecords) => total + categoryRecords.length, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Records</p>
              </div>
              <div>
                <p className="text-2xl text-green-600">18.9 MB</p>
                <p className="text-sm text-gray-600">Storage Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Record Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRecord?.title}</DialogTitle>
            <DialogDescription>
              View detailed information about this medical record.
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="text-gray-900">{formatDate(selectedRecord.date)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <Badge className={getStatusColor(selectedRecord.status)}>
                    {selectedRecord.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-600">Doctor</p>
                  <p className="text-gray-900">{selectedRecord.doctor}</p>
                </div>
                <div>
                  <p className="text-gray-600">Facility</p>
                  <p className="text-gray-900">{selectedRecord.facility}</p>
                </div>
              </div>
              
              {selectedRecord.results && (
                <div>
                  <p className="text-gray-600 text-sm mb-2">Results</p>
                  <p className="text-gray-900 text-sm bg-gray-50 p-3 rounded">{selectedRecord.results}</p>
                </div>
              )}
              
              {selectedRecord.notes && (
                <div>
                  <p className="text-gray-600 text-sm mb-2">Notes</p>
                  <p className="text-gray-900 text-sm bg-gray-50 p-3 rounded">{selectedRecord.notes}</p>
                </div>
              )}

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Record</DialogTitle>
            <DialogDescription>
              Update the details of this medical record.
            </DialogDescription>
          </DialogHeader>
          <RecordForm onSubmit={handleEditRecord} isEdit />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedRecord?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRecord} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}