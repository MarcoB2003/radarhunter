// ✅ src/components/MeetingModal.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface MeetingModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (newMeeting: {
    id: string;
    name: string;
    role: string;
    company: string;
    date_time: string;
  }) => void;
}

const MeetingModal: React.FC<MeetingModalProps> = ({ open, onClose, onCreated }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    role: '',
    company: '',
    date_time: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.from('meetings').insert([{
        name: formData.name,
        role: formData.role,
        company: formData.company,
        date_time: new Date(formData.date_time).toISOString()
      }]).select().single(); // <-- pega os dados inseridos

      if (error) {
        console.error('Erro Supabase:', error);
        alert(`Erro ao agendar reunião: ${error.message}`);
        return;
      }

      alert('Reunião agendada com sucesso');
      onClose();
      onCreated(data); // <-- envia os dados da reunião criada
    } catch (err) {
      console.error('Erro inesperado:', err);
      alert('Erro inesperado ao agendar reunião');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agendar Reunião</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Lead</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Cargo</Label>
            <Input
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_time">Data e Hora</Label>
            <Input
              id="date_time"
              name="date_time"
              type="datetime-local"
              value={formData.date_time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Agendar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
