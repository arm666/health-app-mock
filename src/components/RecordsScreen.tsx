import React, { useState } from 'react';
import { FileText, Image, Download, Share, Search, Filter, Plus, Eye, Edit, Trash2, Heart, Calendar, Activity, Users, Stethoscope, ArrowLeft } from 'lucide-react';
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
import { Separator } from './ui/separator';

interface Disease {
  id: number;
  name: string;
  diagnosisDate: string;
  doctor: string;
  facility: string;
  status: 'Active' | 'Monitoring' | 'Resolved' | 'Chronic';
  severity: 'Mild' | 'Moderate' | 'Severe';
  previousMedications: string[];
  currentMedications: string[];
  surgeryHistory: Array<{
    procedure: string;
    date: string;
    surgeon: string;
    outcome: string;
  }>;
  familyHistory: Array<{
    relation: string;
    condition: string;
    ageOfOnset?: string;
  }>;
  symptoms: string[];
  notes: string;
  lastUpdated: string;
}

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
  diseaseId?: number; // Link records to diseases
}

export default function RecordsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'main' | 'disease-detail'>('main');
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  
  const [diseases, setDiseases] = useState<Disease[]>([
    {
      id: 1,
      name: 'Type 2 Diabetes',
      diagnosisDate: '2023-03-15',
      doctor: 'Dr. Michael Chen',
      facility: 'Community Health Clinic',
      status: 'Active',
      severity: 'Moderate',
      previousMedications: ['Glipizide 5mg'],
      currentMedications: ['Metformin 500mg', 'Linagliptin 5mg'],
      surgeryHistory: [],
      familyHistory: [
        { relation: 'Father', condition: 'Type 2 Diabetes', ageOfOnset: '55' },
        { relation: 'Grandmother (maternal)', condition: 'Type 2 Diabetes', ageOfOnset: '62' }
      ],
      symptoms: ['Increased thirst', 'Frequent urination', 'Fatigue'],
      notes: 'Well-controlled with medication and diet. Regular monitoring required.',
      lastUpdated: '2025-08-22'
    },
    {
      id: 2,
      name: 'Hypertension',
      diagnosisDate: '2024-01-20',
      doctor: 'Dr. Sarah Wilson',
      facility: 'City Medical Center',
      status: 'Active',
      severity: 'Mild',
      previousMedications: [],
      currentMedications: ['Lisinopril 10mg'],
      surgeryHistory: [],
      familyHistory: [
        { relation: 'Mother', condition: 'Hypertension', ageOfOnset: '48' }
      ],
      symptoms: ['Occasional headaches', 'Dizziness'],
      notes: 'Blood pressure well-controlled with medication. Lifestyle modifications recommended.',
      lastUpdated: '2025-08-20'
    }
  ]);

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
        title: 'HbA1c Test',
        date: '2025-08-15',
        doctor: 'Dr. Michael Chen',
        facility: 'Community Health Clinic',
        type: 'Lab Test',
        status: 'Monitoring Required',
        fileType: 'PDF',
        size: '189 KB',
        category: 'lab-results',
        results: 'HbA1c: 7.2% (Target: <7%). Continue current medication regimen.',
        diseaseId: 1
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
        notes: 'Take twice daily with meals. Monitor blood sugar levels.',
        diseaseId: 1
      },
      {
        id: 7,
        title: 'Lisinopril 10mg',
        date: '2025-08-18',
        doctor: 'Dr. Sarah Wilson',
        facility: 'City Medical Center',
        type: 'Prescription',
        status: 'Active',
        fileType: 'PDF',
        size: '85 KB',
        category: 'prescriptions',
        notes: 'Take once daily in the morning. Monitor blood pressure.',
        diseaseId: 2
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
  const [isDiseaseDialogOpen, setIsDiseaseDialogOpen] = useState(false);
  const [isEditDiseaseDialogOpen, setIsEditDiseaseDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [formData, setFormData] = useState<Partial<MedicalRecord>>({});
  const [diseaseFormData, setDiseaseFormData] = useState<Partial<Disease>>({});
  const [activeTab, setActiveTab] = useState('diseases');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Disease management functions
  const handleAddDisease = (e: React.FormEvent) => {
    e.preventDefault();
    const newDisease: Disease = {
      id: Date.now(),
      ...diseaseFormData as Disease,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setDiseases(prev => [...prev, newDisease]);
    setIsDiseaseDialogOpen(false);
    setDiseaseFormData({});
  };

  const handleEditDisease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDisease) return;

    setDiseases(prev => prev.map(disease => 
      disease.id === selectedDisease.id 
        ? { ...disease, ...diseaseFormData, lastUpdated: new Date().toISOString().split('T')[0] } 
        : disease
    ));
    
    setIsEditDiseaseDialogOpen(false);
    setSelectedDisease(null);
    setDiseaseFormData({});
  };

  const viewDiseaseDetail = (disease: Disease) => {
    setSelectedDisease(disease);
    setCurrentView('disease-detail');
  };

  const openEditDiseaseDialog = (disease: Disease) => {
    setSelectedDisease(disease);
    setDiseaseFormData(disease);
    setIsEditDiseaseDialogOpen(true);
  };

  const getRelatedRecords = (diseaseId: number) => {
    const related: Record<string, MedicalRecord[]> = {
      'lab-results': [],
      'imaging': [],
      'prescriptions': [],
      'vaccinations': []
    };

    Object.entries(records).forEach(([category, categoryRecords]) => {
      related[category] = categoryRecords.filter(record => record.diseaseId === diseaseId);
    });

    return related;
  };

  // Existing record management functions remain the same
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
      case 'Attention Required':
      case 'Monitoring Required': return 'bg-red-100 text-red-800';
      case 'Review Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Active': return 'bg-blue-100 text-blue-800';
      case 'Completed':
      case 'Resolved': return 'bg-gray-100 text-gray-800';
      case 'Chronic': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Mild': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Severe': return 'bg-red-100 text-red-800';
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

  const DiseaseForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void, isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Disease/Condition Name</Label>
        <Input
          id="name"
          value={diseaseFormData.name || ''}
          onChange={(e) => setDiseaseFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Type 2 Diabetes"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="diagnosisDate">Diagnosis Date</Label>
          <Input
            id="diagnosisDate"
            type="date"
            value={diseaseFormData.diagnosisDate || ''}
            onChange={(e) => setDiseaseFormData(prev => ({ ...prev, diagnosisDate: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select 
            value={diseaseFormData.status || ''} 
            onValueChange={(value) => setDiseaseFormData(prev => ({ ...prev, status: value as Disease['status'] }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Monitoring">Monitoring</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Chronic">Chronic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="severity">Severity</Label>
          <Select 
            value={diseaseFormData.severity || ''} 
            onValueChange={(value) => setDiseaseFormData(prev => ({ ...prev, severity: value as Disease['severity'] }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mild">Mild</SelectItem>
              <SelectItem value="Moderate">Moderate</SelectItem>
              <SelectItem value="Severe">Severe</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="doctor">Primary Doctor</Label>
          <Input
            id="doctor"
            value={diseaseFormData.doctor || ''}
            onChange={(e) => setDiseaseFormData(prev => ({ ...prev, doctor: e.target.value }))}
            placeholder="Dr. John Smith"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="facility">Facility/Hospital</Label>
        <Input
          id="facility"
          value={diseaseFormData.facility || ''}
          onChange={(e) => setDiseaseFormData(prev => ({ ...prev, facility: e.target.value }))}
          placeholder="Hospital/Clinic Name"
          required
        />
      </div>

      <div>
        <Label htmlFor="symptoms">Current Symptoms</Label>
        <Textarea
          id="symptoms"
          value={diseaseFormData.symptoms?.join(', ') || ''}
          onChange={(e) => setDiseaseFormData(prev => ({ ...prev, symptoms: e.target.value.split(', ').filter(s => s.trim()) }))}
          placeholder="List symptoms separated by commas"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="currentMedications">Current Medications</Label>
        <Textarea
          id="currentMedications"
          value={diseaseFormData.currentMedications?.join(', ') || ''}
          onChange={(e) => setDiseaseFormData(prev => ({ ...prev, currentMedications: e.target.value.split(', ').filter(m => m.trim()) }))}
          placeholder="List current medications separated by commas"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="previousMedications">Previous Medications</Label>
        <Textarea
          id="previousMedications"
          value={diseaseFormData.previousMedications?.join(', ') || ''}
          onChange={(e) => setDiseaseFormData(prev => ({ ...prev, previousMedications: e.target.value.split(', ').filter(m => m.trim()) }))}
          placeholder="List previous medications separated by commas"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={diseaseFormData.notes || ''}
          onChange={(e) => setDiseaseFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes about the condition"
          rows={3}
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          {isEdit ? 'Update Disease' : 'Add Disease'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            setIsDiseaseDialogOpen(false);
            setIsEditDiseaseDialogOpen(false);
            setDiseaseFormData({});
          }}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );

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

      <div>
        <Label htmlFor="diseaseLink">Link to Disease (Optional)</Label>
        <Select 
          value={formData.diseaseId?.toString() || ''} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, diseaseId: value ? parseInt(value) : undefined }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select disease" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No disease linkage</SelectItem>
            {diseases.map(disease => (
              <SelectItem key={disease.id} value={disease.id.toString()}>
                {disease.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

  const DiseaseCard = ({ disease }: { disease: Disease }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => viewDiseaseDetail(disease)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-4 h-4 text-red-500" />
              <h3 className="text-sm text-gray-900">{disease.name}</h3>
            </div>
            <p className="text-xs text-gray-600">{disease.doctor}</p>
            <p className="text-xs text-gray-500">{disease.facility}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(disease.status)}>
              {disease.status}
            </Badge>
            <Badge className={getSeverityColor(disease.severity)}>
              {disease.severity}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Diagnosed</span>
            <span className="text-gray-700">{formatDate(disease.diagnosisDate)}</span>
          </div>
          
          {disease.currentMedications.length > 0 && (
            <div className="flex items-start justify-between text-xs">
              <span className="text-gray-500">Current Meds</span>
              <span className="text-gray-700 text-right flex-1 ml-2">
                {disease.currentMedications.slice(0, 2).join(', ')}
                {disease.currentMedications.length > 2 && ` (+${disease.currentMedications.length - 2} more)`}
              </span>
            </div>
          )}

          {disease.familyHistory.length > 0 && (
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600">Family history present</span>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="w-3 h-3 mr-1" />
            View Details
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              openEditDiseaseDialog(disease);
            }}
          >
            <Edit className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const RecordCard = ({ record }: { record: MedicalRecord }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getFileIcon(record.fileType)}
              <h3 className="text-sm text-gray-900">{record.title}</h3>
              {record.diseaseId && (
                <Badge variant="outline" className="text-xs">
                  {diseases.find(d => d.id === record.diseaseId)?.name}
                </Badge>
              )}
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

  const filteredDiseases = diseases.filter(disease =>
    disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    disease.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (currentView === 'disease-detail' && selectedDisease) {
    const relatedRecords = getRelatedRecords(selectedDisease.id);
    
    return (
      <div className="h-full bg-gray-50 overflow-y-auto">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('main')} className="p-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl text-gray-900">{selectedDisease.name}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getStatusColor(selectedDisease.status)}>
                  {selectedDisease.status}
                </Badge>
                <Badge className={getSeverityColor(selectedDisease.severity)}>
                  {selectedDisease.severity}
                </Badge>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => openEditDiseaseDialog(selectedDisease)}
            >
              <Edit size={16} className="mr-1" />
              Edit
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Disease Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Stethoscope className="w-5 h-5 mr-2 text-blue-600" />
                Disease Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Diagnosis Date</p>
                  <p className="text-gray-900">{formatDate(selectedDisease.diagnosisDate)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Updated</p>
                  <p className="text-gray-900">{formatDate(selectedDisease.lastUpdated)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Primary Doctor</p>
                  <p className="text-gray-900">{selectedDisease.doctor}</p>
                </div>
                <div>
                  <p className="text-gray-600">Facility</p>
                  <p className="text-gray-900">{selectedDisease.facility}</p>
                </div>
              </div>

              {selectedDisease.symptoms.length > 0 && (
                <div>
                  <p className="text-gray-600 text-sm mb-2">Current Symptoms</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedDisease.symptoms.map((symptom, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedDisease.notes && (
                <div>
                  <p className="text-gray-600 text-sm mb-2">Notes</p>
                  <p className="text-gray-900 text-sm bg-gray-50 p-3 rounded">{selectedDisease.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Medications */}
          {selectedDisease.currentMedications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-600" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedDisease.currentMedications.map((medication, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">{medication}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Previous Medications */}
          {selectedDisease.previousMedications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-gray-600" />
                  Previous Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedDisease.previousMedications.map((medication, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm text-gray-900">{medication}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Family History */}
          {selectedDisease.familyHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-600" />
                  Family History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedDisease.familyHistory.map((history, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-900">{history.relation}</p>
                          <p className="text-sm text-gray-600">{history.condition}</p>
                        </div>
                        {history.ageOfOnset && (
                          <Badge variant="outline" className="text-xs">
                            Age {history.ageOfOnset}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Surgery History */}
          {selectedDisease.surgeryHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                  Surgery History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedDisease.surgeryHistory.map((surgery, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm text-gray-900">{surgery.procedure}</h4>
                        <span className="text-xs text-gray-500">{formatDate(surgery.date)}</span>
                      </div>
                      <p className="text-xs text-gray-600">Surgeon: {surgery.surgeon}</p>
                      <p className="text-xs text-gray-600 mt-1">{surgery.outcome}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related Records */}
          <div className="space-y-4">
            <h2 className="text-lg text-gray-900">Related Medical Records</h2>
            
            <Tabs defaultValue="lab-results" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="lab-results" className="text-xs">
                  Lab Results
                  {relatedRecords['lab-results'].length > 0 && (
                    <Badge className="ml-1 text-xs">{relatedRecords['lab-results'].length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="imaging" className="text-xs">
                  Imaging
                  {relatedRecords['imaging'].length > 0 && (
                    <Badge className="ml-1 text-xs">{relatedRecords['imaging'].length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="prescriptions" className="text-xs">
                  Prescriptions
                  {relatedRecords['prescriptions'].length > 0 && (
                    <Badge className="ml-1 text-xs">{relatedRecords['prescriptions'].length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="vaccinations" className="text-xs">
                  Vaccines
                  {relatedRecords['vaccinations'].length > 0 && (
                    <Badge className="ml-1 text-xs">{relatedRecords['vaccinations'].length}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {Object.entries(relatedRecords).map(([category, categoryRecords]) => (
                <TabsContent key={category} value={category} className="space-y-3">
                  {categoryRecords.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-8">
                        <FileText className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 text-center">No related {category.replace('-', ' ')} found</p>
                        <Button 
                          className="mt-4 bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            setFormData({ category: category as MedicalRecord['category'], diseaseId: selectedDisease.id });
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl text-gray-900">Medical Records</h1>
          <div className="flex space-x-2">
            {activeTab === 'diseases' ? (
              <Dialog open={isDiseaseDialogOpen} onOpenChange={setIsDiseaseDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <Plus size={16} className="mr-1" />
                    Add Disease
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Disease</DialogTitle>
                    <DialogDescription>
                      Add a new medical condition or disease to track.
                    </DialogDescription>
                  </DialogHeader>
                  <DiseaseForm onSubmit={handleAddDisease} />
                </DialogContent>
              </Dialog>
            ) : (
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
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={activeTab === 'diseases' ? "Search diseases..." : "Search records..."}
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
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="diseases" className="text-xs">Diseases</TabsTrigger>
            <TabsTrigger value="lab-results" className="text-xs">Labs</TabsTrigger>
            <TabsTrigger value="imaging" className="text-xs">Imaging</TabsTrigger>
            <TabsTrigger value="prescriptions" className="text-xs">Meds</TabsTrigger>
            <TabsTrigger value="vaccinations" className="text-xs">Vaccines</TabsTrigger>
          </TabsList>

          <TabsContent value="diseases" className="space-y-3">
            {filteredDiseases.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Heart className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 text-center">No diseases/conditions found</p>
                  <Button 
                    className="mt-4 bg-red-600 hover:bg-red-700"
                    onClick={() => setIsDiseaseDialogOpen(true)}
                  >
                    Add First Disease
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredDiseases.map((disease) => (
                <DiseaseCard key={disease.id} disease={disease} />
              ))
            )}
          </TabsContent>

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
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl text-red-600">{diseases.length}</p>
                <p className="text-sm text-gray-600">Diseases</p>
              </div>
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

      {/* All existing dialogs remain the same */}
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
              
              {selectedRecord.diseaseId && (
                <div>
                  <p className="text-gray-600 text-sm mb-2">Related Disease</p>
                  <Badge className="bg-red-100 text-red-800">
                    {diseases.find(d => d.id === selectedRecord.diseaseId)?.name}
                  </Badge>
                </div>
              )}
              
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

      {/* Edit Record Dialog */}
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

      {/* Edit Disease Dialog */}
      <Dialog open={isEditDiseaseDialogOpen} onOpenChange={setIsEditDiseaseDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Disease</DialogTitle>
            <DialogDescription>
              Update the details of this medical condition.
            </DialogDescription>
          </DialogHeader>
          <DiseaseForm onSubmit={handleEditDisease} isEdit />
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