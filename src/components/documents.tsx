import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Upload,
  FileText,
  Image,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  Calendar,
  User,
  Loader2
} from 'lucide-react';
import { useDocuments } from '@/hooks/use-documents';
import { toast } from 'sonner';

// Mock data - COMENTADO APÓS INTEGRAÇÃO COM API
// const mockDocuments = [
//   {
//     id: 1,
//     patientName: 'Maria Silva',
//     fileName: 'raio_x_maria_silva.jpg',
//     fileType: 'image',
//     category: 'Exames',
//     uploadDate: '2024-01-15',
//     size: '2.3 MB',
//     status: 'approved'
//   },
//   {
//     id: 2,
//     patientName: 'João Santos',
//     fileName: 'anamnese_joao.pdf',
//     fileType: 'document',
//     category: 'Anamnese',
//     uploadDate: '2024-01-14',
//     size: '154 KB',
//     status: 'pending'
//   },
//   {
//     id: 3,
//     patientName: 'Ana Costa',
//     fileName: 'tratamento_canal_ana.pdf',
//     fileType: 'document',
//     category: 'Tratamento',
//     uploadDate: '2024-01-12',
//     size: '890 KB',
//     status: 'approved'
//   },
//   {
//     id: 4,
//     patientName: 'Pedro Lima',
//     fileName: 'panoramica_pedro.png',
//     fileType: 'image',
//     category: 'Exames',
//     uploadDate: '2024-01-10',
//     size: '5.1 MB',
//     status: 'rejected'
//   },
// ];

const documentCategories = [
  'Anamnese',
  'Exames',
  'Tratamento',
  'Receitas',
  'Atestados',
  'Orçamentos',
  'Outros'
];

export function Documents() {
  // Integração com API
  const {
    documents: apiDocuments,
    loading,
    error,
    deleteDocument
  } = useDocuments({ limit: 50 });

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Adaptar documents da API para o formato do componente
  const documents = apiDocuments.map(doc => ({
    id: doc.id,
    patientName: doc.patient.name,
    fileName: doc.name,
    fileType: doc.mimeType.includes('image') ? 'image' : 'document',
    category: doc.type,
    uploadDate: new Date(doc.createdAt).toISOString().split('T')[0],
    size: `${(doc.size / 1024 / 1024).toFixed(2)} MB`,
    status: 'approved', // API não tem status
    url: doc.url
  }));
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [uploadData, setUploadData] = useState({
    patientName: '',
    category: '',
    file: null as File | null
  });

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadData({ ...uploadData, file });
    }
  };

  const handleUploadDocument = () => {
    if (uploadData.file && uploadData.patientName && uploadData.category) {
      const newDocument = {
        id: Date.now(),
        patientName: uploadData.patientName,
        fileName: uploadData.file.name,
        fileType: uploadData.file.type.startsWith('image/') ? 'image' : 'document',
        category: uploadData.category,
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${(uploadData.file.size / 1024 / 1024).toFixed(1)} MB`,
        status: 'pending' as const
      };
      
      setDocuments([newDocument, ...documents]);
      setUploadData({ patientName: '', category: '', file: null });
      setIsUploadDialogOpen(false);
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, status: newStatus as any } : doc
    ));
  };

  const handleDeleteDocument = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const getFileIcon = (fileType: string) => {
    return fileType === 'image' ? Image : FileText;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: 'default',
      pending: 'secondary',
      rejected: 'destructive'
    } as const;

    const labels = {
      approved: 'Aprovado',
      pending: 'Pendente',
      rejected: 'Rejeitado'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-sm text-destructive">
            Erro ao carregar documentos: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1>Gestão de Documentos</h1>
        
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload de Documento</DialogTitle>
              <DialogDescription>
                Adicione um novo documento para um paciente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="patientName">Nome do Paciente</Label>
                <Input
                  id="patientName"
                  value={uploadData.patientName}
                  onChange={(e) => setUploadData({ ...uploadData, patientName: e.target.value })}
                  placeholder="Nome do paciente"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={uploadData.category} onValueChange={(value) => setUploadData({ ...uploadData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="file">Arquivo</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                {uploadData.file && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Arquivo selecionado: {uploadData.file.name}
                  </p>
                )}
              </div>
              
              <Button 
                onClick={handleUploadDocument} 
                className="w-full"
                disabled={!uploadData.file || !uploadData.patientName || !uploadData.category}
              >
                Fazer Upload
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {documentCategories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avançados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-dental-ocean-blue" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">
                  {documents.filter(d => d.status === 'pending').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aprovados</p>
                <p className="text-2xl font-bold">
                  {documents.filter(d => d.status === 'approved').length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejeitados</p>
                <p className="text-2xl font-bold">
                  {documents.filter(d => d.status === 'rejected').length}
                </p>
              </div>
              <Trash2 className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Arquivo</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Upload</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => {
                const FileIcon = getFileIcon(document.fileType);
                return (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{document.fileName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{document.patientName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{document.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(document.uploadDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </TableCell>
                    <TableCell>{document.size}</TableCell>
                    <TableCell>{getStatusBadge(document.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {document.status === 'pending' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleStatusChange(document.id, 'approved')}
                              className="text-green-600 hover:text-green-700"
                            >
                              Aprovar
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleStatusChange(document.id, 'rejected')}
                              className="text-red-600 hover:text-red-700"
                            >
                              Rejeitar
                            </Button>
                          </>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteDocument(document.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}