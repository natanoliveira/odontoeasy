import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface PatientAutocompleteProps {
  patients: Patient[];
  selectedPatientId?: string;
  onPatientSelect: (patientId: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function PatientAutocomplete({
  patients,
  selectedPatientId,
  onPatientSelect,
  placeholder = "Selecione um paciente...",
  disabled = false,
  className
}: PatientAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedPatient = patients.find(patient => patient.id === selectedPatientId);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
    patient.phone?.includes(searchValue)
  );

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedPatient ? (
              <div className="flex flex-col items-start">
                <span className="truncate">{selectedPatient.name}</span>
                {selectedPatient.email && (
                  <span className="text-xs text-muted-foreground truncate">
                    {selectedPatient.email}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Pesquisar paciente..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>
                <div className="flex flex-col items-center py-6 text-center">
                  <Search className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum paciente encontrado
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tente ajustar sua pesquisa
                  </p>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {filteredPatients.map((patient) => (
                  <CommandItem
                    key={patient.id}
                    value={patient.id}
                    onSelect={() => {
                      onPatientSelect(patient.id === selectedPatientId ? null : patient.id);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{patient.name}</span>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        {patient.email && <span>{patient.email}</span>}
                        {patient.phone && <span>{patient.phone}</span>}
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4",
                        selectedPatientId === patient.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}