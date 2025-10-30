import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Textarea
} from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import { PatientAutocomplete } from './ui/patient-autocomplete';
import {
  Smile,
  Save,
  RotateCcw,
  User,
  Calendar,
  FileText,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useOdontograms } from '@/hooks/use-odontograms';
import { usePatients } from '@/hooks/use-patients';
import { toast } from 'sonner';

// Mock patient data - COMENTADO APÓS INTEGRAÇÃO COM API
// const mockPatients = [
//   { id: '1', name: 'Maria Silva', email: 'maria.silva@email.com', phone: '(11) 99999-1111' },
//   { id: '2', name: 'João Santos', email: 'joao.santos@email.com', phone: '(11) 99999-2222' },
//   { id: '3', name: 'Ana Costa', email: 'ana.costa@email.com', phone: '(11) 99999-3333' },
//   { id: '4', name: 'Pedro Lima', email: 'pedro.lima@email.com', phone: '(11) 99999-4444' },
//   { id: '5', name: 'Carla Oliveira', email: 'carla.oliveira@email.com', phone: '(11) 99999-5555' },
//   { id: '6', name: 'Roberto Ferreira', email: 'roberto.ferreira@email.com', phone: '(11) 99999-6666' },
// ];

// Tooth conditions
const toothConditions = [
  { value: 'healthy', label: 'Saudável', color: 'bg-green-200' },
  { value: 'cavity', label: 'Cárie', color: 'bg-red-200' },
  { value: 'filling', label: 'Obturação', color: 'bg-blue-200' },
  { value: 'crown', label: 'Coroa', color: 'bg-yellow-200' },
  { value: 'missing', label: 'Ausente', color: 'bg-gray-400' },
  { value: 'implant', label: 'Implante', color: 'bg-purple-200' },
  { value: 'root_canal', label: 'Canal', color: 'bg-orange-200' },
  { value: 'extraction', label: 'Extração', color: 'bg-red-400' },
];

// Tooth numbering (adult dentition)
const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

interface ToothData {
  number: number;
  condition: string;
  notes: string;
}

export function Odontogram() {
  // Integração com API
  const { patients, loading: patientsLoading } = usePatients({ limit: 100 });
  const [selectedPatient, setSelectedPatient] = useState<string>('');

  const {
    odontograms,
    loading: odontogramsLoading,
    error: odontogramsError,
    createOdontogram,
    updateOdontogram
  } = useOdontograms({ patientId: selectedPatient || undefined });

  const [selectedCondition, setSelectedCondition] = useState<string>('healthy');
  const [teethData, setTeethData] = useState<{ [key: number]: ToothData }>({});
  const [generalNotes, setGeneralNotes] = useState('');
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [currentOdontogramId, setCurrentOdontogramId] = useState<string | null>(null);

  // Adaptar patients da API
  const mockPatients = patients.map(p => ({
    id: p.id,
    name: p.name,
    email: p.email,
    phone: p.phone
  }));

  // Carregar odontograma do paciente selecionado
  useEffect(() => {
    if (odontograms.length > 0 && selectedPatient) {
      const latestOdontogram = odontograms[0]; // Pegar o mais recente
      setCurrentOdontogramId(latestOdontogram.id);
      setGeneralNotes(latestOdontogram.notes || '');

      // Converter dados da API para o formato do componente
      const convertedTeethData: { [key: number]: ToothData } = {};
      Object.entries(latestOdontogram.data.teeth).forEach(([toothNum, toothInfo]) => {
        const num = parseInt(toothNum);
        if (toothInfo.conditions.length > 0 || toothInfo.treatments.length > 0) {
          convertedTeethData[num] = {
            number: num,
            condition: toothInfo.conditions[0] || 'healthy',
            notes: toothInfo.notes || ''
          };
        }
      });
      setTeethData(convertedTeethData);
    }
  }, [odontograms, selectedPatient]);

  const handleToothClick = (toothNumber: number) => {
    setSelectedTooth(toothNumber);
    
    // Apply selected condition to tooth
    setTeethData(prev => ({
      ...prev,
      [toothNumber]: {
        number: toothNumber,
        condition: selectedCondition,
        notes: prev[toothNumber]?.notes || ''
      }
    }));
  };

  const getToothColor = (toothNumber: number) => {
    const toothData = teethData[toothNumber];
    if (!toothData) return 'bg-white border-gray-300';
    
    const condition = toothConditions.find(c => c.value === toothData.condition);
    return condition ? condition.color : 'bg-white';
  };

  const resetOdontogram = () => {
    setTeethData({});
    setGeneralNotes('');
    setSelectedTooth(null);
  };

  const saveOdontogram = async () => {
    if (!selectedPatient) {
      toast.error('Selecione um paciente primeiro');
      return;
    }

    try {
      // Converter teethData para o formato da API
      const teethForApi: any = {};

      // Inicializar todos os dentes
      [...upperTeeth, ...lowerTeeth].forEach(toothNum => {
        teethForApi[toothNum.toString()] = {
          notes: teethData[toothNum]?.notes || '',
          conditions: teethData[toothNum]?.condition ? [teethData[toothNum].condition] : [],
          treatments: []
        };
      });

      const odontogramData = {
        patientId: selectedPatient,
        data: {
          teeth: teethForApi,
          version: '1.0',
          lastUpdated: new Date().toISOString()
        },
        notes: generalNotes
      };

      if (currentOdontogramId) {
        // Atualizar odontograma existente
        await updateOdontogram(currentOdontogramId, odontogramData);
        toast.success('Odontograma atualizado com sucesso!');
      } else {
        // Criar novo odontograma
        const created = await createOdontogram(odontogramData);
        setCurrentOdontogramId(created.id);
        toast.success('Odontograma salvo com sucesso!');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar odontograma');
      console.error('Error saving odontogram:', error);
    }
  };

  const ToothComponent = ({ number, isUpper }: { number: number; isUpper: boolean }) => {
    const isSelected = selectedTooth === number;
    const colorClass = getToothColor(number);
    
    return (
      <div className="flex flex-col items-center">
        <span className="text-xs font-medium mb-1 min-w-0">{number}</span>
        <div
          className={`
            w-6 h-8 md:w-8 md:h-10 border-2 cursor-pointer transition-all duration-200 rounded-sm
            ${colorClass}
            ${isSelected ? 'border-primary border-4 scale-110' : 'border-gray-300'}
            hover:scale-105 hover:border-primary
          `}
          onClick={() => handleToothClick(number)}
          title={`Dente ${number} - ${teethData[number]?.condition || 'saudável'}`}
        >
          <div className={`w-full h-full rounded-sm ${isUpper ? 'rounded-t-full' : 'rounded-b-full'}`} />
        </div>
      </div>
    );
  };

  // Loading state
  if (patientsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error state
  if (odontogramsError) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-sm text-destructive">
            Erro ao carregar odontogramas: {odontogramsError.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1>Odontograma Digital</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetOdontogram}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpar
          </Button>
          <Button onClick={saveOdontogram}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Patient Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Selecionar Paciente</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PatientAutocomplete
              patients={mockPatients}
              selectedPatientId={selectedPatient}
              onPatientSelect={(patientId) => setSelectedPatient(patientId || '')}
              placeholder="Pesquisar e selecionar paciente..."
            />
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Última consulta: 15/01/2024</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Odontogramas salvos: 3</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Tools Panel */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Ferramentas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Condição do Dente</label>
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {toothConditions.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded ${condition.color}`} />
                        <span>{condition.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Legend */}
            <div>
              <label className="text-sm font-medium mb-2 block">Legenda</label>
              <div className="space-y-2">
                {toothConditions.map((condition) => (
                  <div key={condition.value} className="flex items-center space-x-2 text-sm">
                    <div className={`w-3 h-3 rounded ${condition.color}`} />
                    <span>{condition.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Tooth Info */}
            {selectedTooth && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Dente {selectedTooth}</h4>
                <div className="space-y-2">
                  <Badge variant="outline">
                    {toothConditions.find(c => c.value === teethData[selectedTooth]?.condition)?.label || 'Saudável'}
                  </Badge>
                  <Textarea
                    placeholder="Observações sobre este dente..."
                    value={teethData[selectedTooth]?.notes || ''}
                    onChange={(e) => setTeethData(prev => ({
                      ...prev,
                      [selectedTooth]: {
                        ...prev[selectedTooth],
                        number: selectedTooth,
                        condition: prev[selectedTooth]?.condition || 'healthy',
                        notes: e.target.value
                      }
                    }))}
                    rows={3}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Odontogram */}
        <div className="xl:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smile className="h-5 w-5" />
                <span>Odontograma</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedPatient ? (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                  <p>Selecione um paciente para começar</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Upper Teeth */}
                  <div>
                    <h3 className="text-sm font-medium mb-4 text-center">Arcada Superior</h3>
                    <div className="flex justify-center space-x-1 md:space-x-2 overflow-x-auto pb-2">
                      {upperTeeth.map((toothNumber) => (
                        <ToothComponent 
                          key={toothNumber} 
                          number={toothNumber} 
                          isUpper={true}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-dashed border-gray-300" />

                  {/* Lower Teeth */}
                  <div>
                    <h3 className="text-sm font-medium mb-4 text-center">Arcada Inferior</h3>
                    <div className="flex justify-center space-x-1 md:space-x-2 overflow-x-auto pb-2">
                      {lowerTeeth.map((toothNumber) => (
                        <ToothComponent 
                          key={toothNumber} 
                          number={toothNumber} 
                          isUpper={false}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="text-center text-sm text-muted-foreground bg-gray-50 p-4 rounded-lg">
                    <p>
                      <strong>Instruções:</strong> Selecione uma condição na barra lateral e clique nos dentes para aplicá-la.
                      Clique em um dente para adicionar observações específicas.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* General Notes */}
          {selectedPatient && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Observações Gerais</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Observações gerais sobre o estado bucal do paciente..."
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Treatment Summary */}
      {selectedPatient && Object.keys(teethData).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Tratamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {toothConditions.map((condition) => {
                const count = Object.values(teethData).filter(t => t.condition === condition.value).length;
                if (count === 0) return null;
                
                return (
                  <div key={condition.value} className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded ${condition.color}`} />
                    <span className="text-sm">
                      {condition.label}: <strong>{count}</strong>
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}