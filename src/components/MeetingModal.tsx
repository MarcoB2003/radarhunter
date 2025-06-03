import React, { useEffect } from 'react';
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
  editing?: {
    id: string;
    name: string;
    role: string;
    company: string;
    date_time: string;
  } | null;
}

const MeetingModal: React.FC<MeetingModalProps> = ({ open, onClose, onCreated, editing }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    role: '',
    company: '',
    date_time: ''
  });

  useEffect(() => {
    if (editing) {
      setFormData({
        name: editing.name,
        role: editing.role,
        company: editing.company,
        date_time: editing.date_time.slice(0, 16) // datetime-local format
      });
    } else {
      setFormData({
        name: '',
        role: '',
        company: '',
        date_time: ''
      });
    }
  }, [editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      role: formData.role,
      company: formData.company,
      date_time: new Date(formData.date_time).toISOString()
    };

    try {
      let response;
      if (editing) {
        response = await supabase
          .from('meetings')
          .update(payload)
          .eq('id', editing.id)
          .select()
          .single();
      } else {
        response = await supabase
          .from('meetings')
          .insert([payload])
          .select()
          .single();
      }

      const { data, error } = response;

      if (error) {
        console.error('Erro Supabase:', error);
        alert(`Erro ao ${editing ? 'editar' : 'criar'} reunião: ${error.message}`);
        return;
      }

      alert(`Reunião ${editing ? 'atualizada' : 'agendada'} com sucesso!`);
      onClose();
      onCreated(data);
    } catch (err) {
      console.error('Erro inesperado:', err);
      alert('Erro inesperado ao salvar reunião');
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
          <DialogTitle>{editing ? 'Editar Reunião' : 'Agendar Reunião'}</DialogTitle>
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
            <Button type="submit">
              {editing ? 'Salvar Alterações' : 'Agendar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
