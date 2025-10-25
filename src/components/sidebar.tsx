import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  UserCheck,
  Building2, 
  FileText, 
  CreditCard, 
  Smile,
  Shield,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from './ui/utils';
import { Button } from './ui/button';
import { useIsMobile } from './ui/use-mobile';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

const clinicMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Pacientes', path: '/patients' },
  { icon: Calendar, label: 'Agendamentos', path: '/appointments' },
  { icon: UserCheck, label: 'Profissionais', path: '/professionals' },
  { icon: Building2, label: 'Clínica', path: '/clinic' },
  { icon: FileText, label: 'Documentos', path: '/documents' },
  { icon: CreditCard, label: 'Pagamentos', path: '/payments' },
  { icon: Smile, label: 'Odontograma', path: '/odontogram' },
];

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard Admin', path: '/dashboard' },
  { icon: Building2, label: 'Clínicas', path: '/clinics' },
  { icon: Users, label: 'Usuários', path: '/users' },
  { icon: BarChart3, label: 'Análises', path: '/analytics' },
  { icon: CreditCard, label: 'Financeiro', path: '/finances' },
  { icon: Settings, label: 'Configurações', path: '/settings' },
];

interface SidebarProps {
  userRole: 'clinic' | 'admin' | null;
  onLogout?: () => void;
}

export function Sidebar({ userRole, onLogout }: SidebarProps) {
  const router = useRouter();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const menuItems = userRole === 'admin' ? adminMenuItems : clinicMenuItems;

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    setLogoutDialogOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-4 left-4 z-50 md:hidden bg-background shadow-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 ease-in-out",
        isMobile ? "fixed left-0 top-0 h-full w-64 z-40" : "w-64",
        isMobile && !isOpen && "-translate-x-full"
      )}>
      <div className="p-6">
        <div className="flex items-center space-x-2">
          {userRole === 'admin' ? (
            <Shield className="h-8 w-8 text-dental-ocean-blue" />
          ) : (
            <Smile className="h-8 w-8 text-dental-ocean-blue" />
          )}
          <div>
            <h1 className="text-xl font-semibold">DentalSaaS</h1>
            {userRole === 'admin' && (
              <p className="text-xs text-sidebar-foreground/70">Admin Panel</p>
            )}
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={() => isMobile && setIsOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Seção inferior com botão de sair */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        {userRole === 'admin' && (
          <div className="flex items-center space-x-2 text-xs text-sidebar-foreground/70">
            <Shield className="h-4 w-4" />
            <span>Modo Administrador</span>
          </div>
        )}
        
        <Button
          variant="ghost"
          onClick={handleLogoutClick}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sair da plataforma
        </Button>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente para acessar o sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLogout}>
              Sair da conta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </>
  );
}