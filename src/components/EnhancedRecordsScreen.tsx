import React, { useState } from 'react';
import { FileText, Image, Download, Share, Search, Filter, Plus, Eye, Edit, Trash2, Heart, Calendar, Activity, Users, Stethoscope, ArrowLeft, RefreshCw, Clock, MapPin, QrCode, Share2, Link, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Separator } from './ui/separator';
import SharingSystem from './SharingSystem';

interface OngoingTreatment {
  id: number;
  name: string;
  type: 'Dialysis' | 'Chemotherapy' | 'Physical Therapy' | 'Radiation' | 'Infusion' | 'Surgery' | 'Other';
  frequency: string;
  duration: string;
  startDate: string;
  nextScheduled?: string;
  endDate?: string;
  provider: string;
  facility: string;
  notes: string;
  status: 'Active' | 'Scheduled' | 'Completed' | 'Paused' | 'Cancelled';
  totalSessions?: number;
  completedSessions?: number;
  lastCompleted?: string;
  sideEffects?: string[];
  instructions: string;
}

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
  ongoingTreatments: OngoingTreatment[];
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
  diseaseId?: number;
}

export default function EnhancedRecordsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'main' | 'disease-detail' | 'sharing' | 'category-view' | 'record-detail'>('main');
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [sharingData, setSharingData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('diseases');
  
  // Treatment management state
  const [editingTreatment, setEditingTreatment] = useState<OngoingTreatment | null>(null);
  const [isAddingTreatment, setIsAddingTreatment] = useState(false);
  const [treatmentFormData, setTreatmentFormData] = useState<Partial<OngoingTreatment>>({
    name: '',
    type: 'Other',
    frequency: '',
    duration: '',
    startDate: '',
    provider: '',
    facility: '',
    notes: '',
    status: 'Active',
    instructions: ''
  });
  const [treatmentToDelete, setTreatmentToDelete] = useState<OngoingTreatment | null>(null);
  
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
      ongoingTreatments: [
        {
          id: 2,
          name: 'Diabetes Management Program',
          type: 'Other',
          frequency: 'Monthly',
          duration: '1 hour per session',
          startDate: '2024-01-15',
          nextScheduled: '2025-09-15',
          provider: 'Dr. Michael Chen',
          facility: 'Community Health Clinic',
          notes: 'Comprehensive diabetes education and monitoring program.',
          status: 'Active',
          totalSessions: 12,
          completedSessions: 8,
          lastCompleted: '2025-08-15',
          sideEffects: [],
          instructions: 'Bring glucose log and food diary. Attend monthly group sessions.'
        }
      ],
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
      name: 'Chronic Kidney Disease',
      diagnosisDate: '2024-01-20',
      doctor: 'Dr. Sarah Wilson',
      facility: 'City Medical Center',
      status: 'Active',
      severity: 'Severe',
      previousMedications: [],
      currentMedications: ['Lisinopril 10mg', 'Furosemide 40mg'],
      ongoingTreatments: [
        {
          id: 1,
          name: 'Hemodialysis',
          type: 'Dialysis',
          frequency: '3 times per week',
          duration: '4 hours per session',
          startDate: '2024-03-01',
          nextScheduled: '2025-08-29',
          provider: 'Dr. Jennifer Martinez',
          facility: 'City Dialysis Center',
          notes: 'Patient tolerates treatment well. Monitor fluid intake.',
          status: 'Active',
          totalSessions: 156,
          completedSessions: 145,
          lastCompleted: '2025-08-26',
          sideEffects: ['Fatigue after sessions', 'Occasional muscle cramps'],
          instructions: 'Arrive 15 minutes early. Bring water bottle. Avoid high-potassium foods 24 hours before.'
        }
      ],
      surgeryHistory: [],
      familyHistory: [
        { relation: 'Mother', condition: 'Hypertension', ageOfOnset: '48' }
      ],
      symptoms: ['Swelling in legs', 'Shortness of breath', 'Fatigue'],
      notes: 'Stage 4 CKD requiring dialysis. Preparing for kidney transplant evaluation.',
      lastUpdated: '2025-08-26'
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
      },
      {
        id: 3,
        title: 'Kidney Function Panel',
        date: '2025-08-26',
        doctor: 'Dr. Sarah Wilson',
        facility: 'City Medical Center',
        type: 'Lab Test',
        status: 'Attention Required',
        fileType: 'PDF',
        size: '198 KB',
        category: 'lab-results',
        results: 'Creatinine: 4.2 mg/dL, BUN: 65 mg/dL, GFR: 18 mL/min/1.73m². Continue dialysis as scheduled.',
        diseaseId: 2
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
      },
      {
        id: 5,
        title: 'Kidney Ultrasound',
        date: '2025-08-10',
        doctor: 'Dr. Sarah Wilson',
        facility: 'City Medical Center',
        type: 'Ultrasound',
        status: 'Attention Required',
        fileType: 'DICOM',
        size: '3.4 MB',
        category: 'imaging',
        results: 'Both kidneys show signs of chronic disease. Size reduction noted.',
        diseaseId: 2
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
        title: 'Furosemide 40mg',
        date: '2025-08-18',
        doctor: 'Dr. Sarah Wilson',
        facility: 'City Medical Center',
        type: 'Prescription',
        status: 'Active',
        fileType: 'PDF',
        size: '85 KB',
        category: 'prescriptions',
        notes: 'Take once daily in the morning. Monitor fluid balance.',
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

  // Treatment management functions
  const handleAddTreatment = () => {
    if (!selectedDisease) return;
    
    const newTreatment: OngoingTreatment = {
      id: Date.now(),
      name: treatmentFormData.name || '',
      type: treatmentFormData.type || 'Other',
      frequency: treatmentFormData.frequency || '',
      duration: treatmentFormData.duration || '',
      startDate: treatmentFormData.startDate || '',
      provider: treatmentFormData.provider || '',
      facility: treatmentFormData.facility || '',
      notes: treatmentFormData.notes || '',
      status: treatmentFormData.status || 'Active',
      instructions: treatmentFormData.instructions || '',
      totalSessions: treatmentFormData.totalSessions,
      completedSessions: treatmentFormData.completedSessions || 0,
      nextScheduled: treatmentFormData.nextScheduled,
      endDate: treatmentFormData.endDate,
      lastCompleted: treatmentFormData.lastCompleted,
      sideEffects: []
    };

    const updatedDiseases = diseases.map(disease => {
      if (disease.id === selectedDisease.id) {
        return {
          ...disease,
          ongoingTreatments: [...disease.ongoingTreatments, newTreatment],
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return disease;
    });

    setDiseases(updatedDiseases);
    setSelectedDisease({
      ...selectedDisease,
      ongoingTreatments: [...selectedDisease.ongoingTreatments, newTreatment],
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    
    setIsAddingTreatment(false);
    setTreatmentFormData({
      name: '',
      type: 'Other',
      frequency: '',
      duration: '',
      startDate: '',
      provider: '',
      facility: '',
      notes: '',
      status: 'Active',
      instructions: ''
    });
  };

  const handleUpdateTreatment = () => {
    if (!selectedDisease || !editingTreatment) return;

    const updatedTreatment = {
      ...editingTreatment,
      ...treatmentFormData
    };

    const updatedDiseases = diseases.map(disease => {
      if (disease.id === selectedDisease.id) {
        return {
          ...disease,
          ongoingTreatments: disease.ongoingTreatments.map(treatment =>
            treatment.id === editingTreatment.id ? updatedTreatment : treatment
          ),
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return disease;
    });

    setDiseases(updatedDiseases);
    setSelectedDisease({
      ...selectedDisease,
      ongoingTreatments: selectedDisease.ongoingTreatments.map(treatment =>
        treatment.id === editingTreatment.id ? updatedTreatment : treatment
      ),
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    
    setEditingTreatment(null);
    setTreatmentFormData({
      name: '',
      type: 'Other',
      frequency: '',
      duration: '',
      startDate: '',
      provider: '',
      facility: '',
      notes: '',
      status: 'Active',
      instructions: ''
    });
  };

  const handleDeleteTreatment = (treatment: OngoingTreatment) => {
    if (!selectedDisease) return;

    const updatedDiseases = diseases.map(disease => {
      if (disease.id === selectedDisease.id) {
        return {
          ...disease,
          ongoingTreatments: disease.ongoingTreatments.filter(t => t.id !== treatment.id),
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return disease;
    });

    setDiseases(updatedDiseases);
    setSelectedDisease({
      ...selectedDisease,
      ongoingTreatments: selectedDisease.ongoingTreatments.filter(t => t.id !== treatment.id),
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    
    setTreatmentToDelete(null);
  };

  const startEditTreatment = (treatment: OngoingTreatment) => {
    setEditingTreatment(treatment);
    setTreatmentFormData({
      name: treatment.name,
      type: treatment.type,
      frequency: treatment.frequency,
      duration: treatment.duration,
      startDate: treatment.startDate,
      provider: treatment.provider,
      facility: treatment.facility,
      notes: treatment.notes,
      status: treatment.status,
      instructions: treatment.instructions,
      totalSessions: treatment.totalSessions,
      completedSessions: treatment.completedSessions,
      nextScheduled: treatment.nextScheduled,
      endDate: treatment.endDate,
      lastCompleted: treatment.lastCompleted
    });
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

  const getAllRecords = () => {
    return Object.values(records).flat();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'bg-green-100 text-green-800';
      case 'Attention Required':
      case 'Monitoring Required': return 'bg-red-100 text-red-800';
      case 'Review Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Active':
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Completed':
      case 'Resolved': return 'bg-gray-100 text-gray-800';
      case 'Chronic': return 'bg-purple-100 text-purple-800';
      case 'Paused': return 'bg-orange-100 text-orange-800';
      case 'Cancelled': return 'bg-red-200 text-red-900';
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

  const viewDiseaseDetail = (disease: Disease) => {
    setSelectedDisease(disease);
    setCurrentView('disease-detail');
  };

  const handleShare = (type: 'profile' | 'disease' | 'record', data?: any) => {
    setSharingData({ type, data });
    setCurrentView('sharing');
  };

  const viewCategoryRecords = (category: string) => {
    setSelectedCategory(category);
    setCurrentView('category-view');
  };

  const viewRecordDetail = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setCurrentView('record-detail');
  };

  const goBackToMain = () => {
    setSelectedCategory(null);
    setSelectedRecord(null);
    setSelectedDisease(null);
    setCurrentView('main');
  };

  const getCategoryDisplayName = (category: string) => {
    return category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderMainView = () => (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b flex-shrink-0">
        <h1 className="text-xl text-gray-900">Medical Records</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search records, diseases, medications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11"
              />
            </div>
            <Button variant="outline" size="sm" className="h-11 px-3">
              <Filter className="w-4 h-4" />
            </Button>
            <Button size="sm" className="h-11 px-3 bg-blue-600 hover:bg-blue-700" onClick={() => handleShare('profile')}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="diseases">Diseases ({diseases.length})</TabsTrigger>
              <TabsTrigger value="records">All Records ({getAllRecords().length})</TabsTrigger>
              <TabsTrigger value="by-category">By Category</TabsTrigger>
            </TabsList>

            <TabsContent value="diseases" className="mt-4">
              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
                {diseases.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Stethoscope className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">No diseases tracked</p>
                    <p className="text-sm">Add a disease to start managing your health records</p>
                  </div>
                ) : (
                  diseases.map((disease) => {
                    const relatedRecords = getRelatedRecords(disease.id);
                    const totalRelatedRecords = Object.values(relatedRecords).flat().length;
                    
                    return (
                      <Card key={disease.id} className="cursor-pointer hover:shadow-md transition-all duration-200">
                        <CardContent className="p-4" onClick={() => viewDiseaseDetail(disease)}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <Stethoscope className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                <h3 className="font-medium text-gray-900 truncate">{disease.name}</h3>
                              </div>
                              <p className="text-sm text-gray-600 truncate">{disease.doctor} • {disease.facility}</p>
                              <p className="text-xs text-gray-500">Diagnosed: {formatDate(disease.diagnosisDate)}</p>
                            </div>
                            <div className="flex flex-col items-end space-y-2 ml-3 flex-shrink-0">
                              <div className="flex space-x-2">
                                <Badge className={getStatusColor(disease.status)}>
                                  {disease.status}
                                </Badge>
                                <Badge className={getSeverityColor(disease.severity)}>
                                  {disease.severity}
                                </Badge>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShare('disease', disease);
                                }}
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Disease Stats */}
                          <div className="grid grid-cols-4 gap-4 mb-4">
                            <div className="text-center">
                              <p className="text-lg font-semibold text-blue-600">{totalRelatedRecords}</p>
                              <p className="text-xs text-gray-600">Records</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-semibold text-green-600">{disease.currentMedications.length}</p>
                              <p className="text-xs text-gray-600">Medications</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-semibold text-purple-600">{disease.ongoingTreatments.length}</p>
                              <p className="text-xs text-gray-600">Treatments</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-semibold text-orange-600">{disease.symptoms.length}</p>
                              <p className="text-xs text-gray-600">Symptoms</p>
                            </div>
                          </div>

                          {/* Link Indicator */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t">
                            <div className="flex items-center space-x-2">
                              <Link className="w-4 h-4 text-blue-600" />
                              <span className="text-sm text-blue-600 truncate">View linked records & treatments</span>
                            </div>
                            <div className="text-xs text-gray-500 flex-shrink-0">
                              Updated: {formatDate(disease.lastUpdated)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>

            <TabsContent value="records" className="mt-4">
              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
                {getAllRecords().map((record) => {
                  const linkedDisease = record.diseaseId ? diseases.find(d => d.id === record.diseaseId) : null;
                  
                  return (
                    <Card key={record.id} className="hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1 min-w-0">
                            {getFileIcon(record.fileType)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-medium text-gray-900 truncate">{record.title}</h3>
                                {linkedDisease && (
                                  <Badge variant="outline" className="text-xs">
                                    {linkedDisease.name}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 truncate">{record.doctor} • {record.facility}</p>
                              <p className="text-xs text-gray-500 mb-2">
                                {formatDate(record.date)} • {record.type} • {record.size}
                              </p>
                              {record.results && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-500 mb-1">Results</p>
                                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded break-words">
                                    {record.results}
                                  </p>
                                </div>
                              )}
                              {record.notes && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-500 mb-1">Notes</p>
                                  <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded break-words">
                                    {record.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2 ml-3 flex-shrink-0">
                            <Badge className={getStatusColor(record.status)}>
                              {record.status}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleShare('record', record)}
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="by-category" className="mt-4">
              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
                {Object.entries(records).map(([category, categoryRecords]) => (
                  <Card key={category}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg capitalize flex items-center justify-between">
                        <span>{getCategoryDisplayName(category)} ({categoryRecords.length})</span>
                        <div className="flex items-center space-x-2">
                          {categoryRecords.length > 0 && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => viewCategoryRecords(category)}
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              View More
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {categoryRecords.length === 0 ? (
                          <div className="text-center py-6 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No {category.replace('-', ' ')} records</p>
                            <p className="text-sm">Add a record to get started</p>
                          </div>
                        ) : (
                          categoryRecords.slice(0, 3).map((record) => {
                            const linkedDisease = record.diseaseId ? diseases.find(d => d.id === record.diseaseId) : null;
                            
                            return (
                              <div 
                                key={record.id} 
                                className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => viewRecordDetail(record)}
                              >
                                <div className="flex items-start space-x-3 flex-1 min-w-0">
                                  {getFileIcon(record.fileType)}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <p className="font-medium text-gray-900 truncate">{record.title}</p>
                                      {linkedDisease && (
                                        <Badge variant="outline" className="text-xs">
                                          <Link className="w-3 h-3 mr-1" />
                                          {linkedDisease.name}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">{formatDate(record.date)} • {record.doctor}</p>
                                    <p className="text-xs text-gray-500">{record.facility} • {record.size}</p>
                                    {record.results && (
                                      <div className="mt-2">
                                        <p className="text-xs text-gray-500 mb-1">Results</p>
                                        <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded break-words line-clamp-2">
                                          {record.results}
                                        </p>
                                      </div>
                                    )}
                                    {record.notes && (
                                      <div className="mt-2">
                                        <p className="text-xs text-gray-500 mb-1">Notes</p>
                                        <p className="text-xs text-gray-600 bg-blue-50 p-2 rounded break-words line-clamp-2">
                                          {record.notes}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end space-y-2 ml-3 flex-shrink-0">
                                  <Badge className={getStatusColor(record.status)}>
                                    {record.status}
                                  </Badge>
                                  <div className="flex items-center space-x-1">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        viewRecordDetail(record);
                                      }}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleShare('record', record);
                                      }}
                                    >
                                      <Share2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                        {categoryRecords.length > 3 && (
                          <div className="text-center pt-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => viewCategoryRecords(category)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              View all {categoryRecords.length} {category.replace('-', ' ')} records
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );

  const renderDiseaseDetail = () => {
    if (!selectedDisease) return null;
    
    const relatedRecords = getRelatedRecords(selectedDisease.id);
    
    return (
      <div className="h-full bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b flex-shrink-0">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={goBackToMain}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{selectedDisease.name}</h2>
              <p className="text-sm text-gray-600">{selectedDisease.doctor} • {selectedDisease.facility}</p>
            </div>
            <Button size="sm" onClick={() => handleShare('disease', selectedDisease)}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Disease Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Disease Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className={getStatusColor(selectedDisease.status)}>
                      {selectedDisease.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Severity</p>
                    <Badge className={getSeverityColor(selectedDisease.severity)}>
                      {selectedDisease.severity}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Diagnosis Date</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedDisease.diagnosisDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedDisease.lastUpdated)}</p>
                  </div>
                </div>

                {selectedDisease.symptoms.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Current Symptoms</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDisease.symptoms.map((symptom, index) => (
                        <Badge key={index} variant="outline">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDisease.notes && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Notes</p>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded break-words">{selectedDisease.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ongoing Treatments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-purple-600" />
                    Ongoing Treatments ({selectedDisease.ongoingTreatments.length})
                  </CardTitle>
                  <Button 
                    size="sm" 
                    onClick={() => setIsAddingTreatment(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Treatment
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {selectedDisease.ongoingTreatments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No ongoing treatments</p>
                    <p className="text-sm">Add a treatment to start tracking</p>
                  </div>
                ) : (
                  selectedDisease.ongoingTreatments.map((treatment) => (
                    <div key={treatment.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-gray-900 truncate">{treatment.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {treatment.type}
                            </Badge>
                            <Badge className={getStatusColor(treatment.status)}>
                              {treatment.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1 break-words">
                            {treatment.provider} • {treatment.facility}
                          </p>
                          <p className="text-sm text-gray-600 break-words">
                            {treatment.frequency} • {treatment.duration}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditTreatment(treatment)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Treatment</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{treatment.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteTreatment(treatment)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      {/* Treatment Progress */}
                      {treatment.totalSessions && (
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Progress</span>
                            <span className="text-sm text-gray-900">
                              {treatment.completedSessions || 0} / {treatment.totalSessions} sessions
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ 
                                width: `${((treatment.completedSessions || 0) / treatment.totalSessions) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Treatment Details */}
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Started</p>
                          <p className="text-sm text-gray-900">{formatDate(treatment.startDate)}</p>
                        </div>
                        {treatment.nextScheduled && (
                          <div>
                            <p className="text-xs text-gray-500">Next Session</p>
                            <p className="text-sm text-gray-900">{formatDate(treatment.nextScheduled)}</p>
                          </div>
                        )}
                      </div>

                      {/* Instructions */}
                      {treatment.instructions && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Instructions</p>
                          <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded break-words">{treatment.instructions}</p>
                        </div>
                      )}

                      {/* Notes */}
                      {treatment.notes && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Notes</p>
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded break-words">{treatment.notes}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Related Records */}
            <Card>
              <CardHeader>
                <CardTitle>Related Medical Records</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="lab-results">Labs</TabsTrigger>
                    <TabsTrigger value="imaging">Imaging</TabsTrigger>
                    <TabsTrigger value="prescriptions">Meds</TabsTrigger>
                    <TabsTrigger value="vaccinations">Vaccines</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-3 max-h-80 overflow-y-auto mt-4">
                    {Object.values(relatedRecords).flat().map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          {getFileIcon(record.fileType)}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 truncate">{record.title}</p>
                            <p className="text-sm text-gray-600 truncate">{formatDate(record.date)} • {record.type}</p>
                            {record.results && (
                              <p className="text-xs text-gray-600 mt-1 truncate">{record.results}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  {Object.entries(relatedRecords).map(([category, categoryRecords]) => (
                    <TabsContent key={category} value={category} className="space-y-3 max-h-80 overflow-y-auto mt-4">
                      {categoryRecords.map((record) => (
                        <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            {getFileIcon(record.fileType)}
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900 truncate">{record.title}</p>
                              <p className="text-sm text-gray-600 truncate">{formatDate(record.date)} • {record.type}</p>
                              {record.results && (
                                <p className="text-xs text-gray-600 mt-1 break-words">{record.results}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <Badge className={getStatusColor(record.status)}>
                              {record.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add/Edit Treatment Dialog */}
        <Dialog open={isAddingTreatment || editingTreatment !== null} onOpenChange={(open) => {
          if (!open) {
            setIsAddingTreatment(false);
            setEditingTreatment(null);
            setTreatmentFormData({
              name: '',
              type: 'Other',
              frequency: '',
              duration: '',
              startDate: '',
              provider: '',
              facility: '',
              notes: '',
              status: 'Active',
              instructions: ''
            });
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTreatment ? 'Edit Treatment' : 'Add New Treatment'}
              </DialogTitle>
              <DialogDescription>
                {editingTreatment 
                  ? 'Update the treatment details below.' 
                  : 'Add a new ongoing treatment for this condition.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Treatment Name *</Label>
                  <Input
                    id="name"
                    value={treatmentFormData.name || ''}
                    onChange={(e) => setTreatmentFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Hemodialysis"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select 
                    value={treatmentFormData.type} 
                    onValueChange={(value) => setTreatmentFormData(prev => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dialysis">Dialysis</SelectItem>
                      <SelectItem value="Chemotherapy">Chemotherapy</SelectItem>
                      <SelectItem value="Physical Therapy">Physical Therapy</SelectItem>
                      <SelectItem value="Radiation">Radiation</SelectItem>
                      <SelectItem value="Infusion">Infusion</SelectItem>
                      <SelectItem value="Surgery">Surgery</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="frequency">Frequency *</Label>
                  <Input
                    id="frequency"
                    value={treatmentFormData.frequency || ''}
                    onChange={(e) => setTreatmentFormData(prev => ({ ...prev, frequency: e.target.value }))}
                    placeholder="e.g., 3 times per week"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    value={treatmentFormData.duration || ''}
                    onChange={(e) => setTreatmentFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 4 hours per session"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provider">Provider *</Label>
                  <Input
                    id="provider"
                    value={treatmentFormData.provider || ''}
                    onChange={(e) => setTreatmentFormData(prev => ({ ...prev, provider: e.target.value }))}
                    placeholder="e.g., Dr. Jennifer Martinez"
                  />
                </div>
                <div>
                  <Label htmlFor="facility">Facility *</Label>
                  <Input
                    id="facility"
                    value={treatmentFormData.facility || ''}
                    onChange={(e) => setTreatmentFormData(prev => ({ ...prev, facility: e.target.value }))}
                    placeholder="e.g., City Dialysis Center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={treatmentFormData.startDate || ''}
                    onChange={(e) => setTreatmentFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="nextScheduled">Next Scheduled</Label>
                  <Input
                    id="nextScheduled"
                    type="date"
                    value={treatmentFormData.nextScheduled || ''}
                    onChange={(e) => setTreatmentFormData(prev => ({ ...prev, nextScheduled: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={treatmentFormData.status} 
                    onValueChange={(value) => setTreatmentFormData(prev => ({ ...prev, status: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Paused">Paused</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalSessions">Total Sessions</Label>
                  <Input
                    id="totalSessions"
                    type="number"
                    value={treatmentFormData.totalSessions || ''}
                    onChange={(e) => setTreatmentFormData(prev => ({ ...prev, totalSessions: parseInt(e.target.value) || undefined }))}
                    placeholder="e.g., 20"
                  />
                </div>
                <div>
                  <Label htmlFor="completedSessions">Completed Sessions</Label>
                  <Input
                    id="completedSessions"
                    type="number"
                    value={treatmentFormData.completedSessions || ''}
                    onChange={(e) => setTreatmentFormData(prev => ({ ...prev, completedSessions: parseInt(e.target.value) || 0 }))}
                    placeholder="e.g., 5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={treatmentFormData.instructions || ''}
                  onChange={(e) => setTreatmentFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  placeholder="Special instructions for this treatment..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={treatmentFormData.notes || ''}
                  onChange={(e) => setTreatmentFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about this treatment..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddingTreatment(false);
                  setEditingTreatment(null);
                  setTreatmentFormData({
                    name: '',
                    type: 'Other',
                    frequency: '',
                    duration: '',
                    startDate: '',
                    provider: '',
                    facility: '',
                    notes: '',
                    status: 'Active',
                    instructions: ''
                  });
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={editingTreatment ? handleUpdateTreatment : handleAddTreatment}
                disabled={!treatmentFormData.name || !treatmentFormData.frequency || !treatmentFormData.duration || !treatmentFormData.startDate || !treatmentFormData.provider || !treatmentFormData.facility}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Save className="w-4 h-4 mr-1" />
                {editingTreatment ? 'Update Treatment' : 'Add Treatment'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  const renderCategoryView = () => {
    if (!selectedCategory) return null;
    
    const categoryRecords = records[selectedCategory] || [];
    
    return (
      <div className="h-full bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b flex-shrink-0">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={goBackToMain}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{getCategoryDisplayName(selectedCategory)}</h2>
              <p className="text-sm text-gray-600">{categoryRecords.length} records</p>
            </div>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {categoryRecords.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">No {selectedCategory.replace('-', ' ')} records</p>
                <p className="text-sm">Add a record to get started</p>
              </div>
            ) : (
              categoryRecords.map((record) => {
                const linkedDisease = record.diseaseId ? diseases.find(d => d.id === record.diseaseId) : null;
                
                return (
                  <Card 
                    key={record.id} 
                    className="hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => viewRecordDetail(record)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          {getFileIcon(record.fileType)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-gray-900 truncate">{record.title}</h3>
                              {linkedDisease && (
                                <Badge variant="outline" className="text-xs">
                                  <Link className="w-3 h-3 mr-1" />
                                  {linkedDisease.name}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{record.doctor} • {record.facility}</p>
                            <p className="text-xs text-gray-500 mb-2">
                              {formatDate(record.date)} • {record.type} • {record.size}
                            </p>
                            {record.results && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">Results</p>
                                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded break-words">
                                  {record.results}
                                </p>
                              </div>
                            )}
                            {record.notes && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">Notes</p>
                                <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded break-words">
                                  {record.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2 ml-3 flex-shrink-0">
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                viewRecordDetail(record);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare('record', record);
                              }}
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderRecordDetail = () => {
    if (!selectedRecord) return null;
    
    const linkedDisease = selectedRecord.diseaseId ? diseases.find(d => d.id === selectedRecord.diseaseId) : null;
    
    return (
      <div className="h-full bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b flex-shrink-0">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => {
              if (selectedCategory) {
                setCurrentView('category-view');
              } else {
                setCurrentView('main');
              }
            }}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{selectedRecord.title}</h2>
              <p className="text-sm text-gray-600">{selectedRecord.doctor} • {selectedRecord.facility}</p>
            </div>
            <Button 
              size="sm" 
              onClick={() => handleShare('record', selectedRecord)}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Record Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {getFileIcon(selectedRecord.fileType)}
                  <span className="ml-2">Record Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className={getStatusColor(selectedRecord.status)}>
                      {selectedRecord.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="text-sm text-gray-900">{selectedRecord.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedRecord.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">File Size</p>
                    <p className="text-sm text-gray-900">{selectedRecord.size}</p>
                  </div>
                </div>

                {linkedDisease && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Linked Condition</p>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => viewDiseaseDetail(linkedDisease)}
                    >
                      <Link className="w-3 h-3 mr-1" />
                      {linkedDisease.name}
                    </Badge>
                  </div>
                )}

                {selectedRecord.results && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Results</p>
                    <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded break-words">
                      {selectedRecord.results}
                    </div>
                  </div>
                )}

                {selectedRecord.notes && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Notes</p>
                    <div className="text-sm text-gray-900 bg-blue-50 p-3 rounded break-words">
                      {selectedRecord.notes}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center"
                    onClick={() => handleShare('record', selectedRecord)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  if (currentView === 'sharing') {
    return <SharingSystem onBack={() => {
      if (selectedRecord) {
        setCurrentView('record-detail');
      } else if (selectedDisease) {
        setCurrentView('disease-detail');
      } else {
        setCurrentView('main');
      }
    }} />;
  }

  if (currentView === 'record-detail') {
    return renderRecordDetail();
  }

  if (currentView === 'category-view') {
    return renderCategoryView();
  }

  if (currentView === 'disease-detail') {
    return renderDiseaseDetail();
  }

  return renderMainView();
}