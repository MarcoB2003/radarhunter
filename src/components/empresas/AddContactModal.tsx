import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { SocialContact } from '@/types';

interface AddContactModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'edit' | 'add';
  initialData?: SocialContact;
  onCreated?: (contact: SocialContact) => void;
  onUpdated?: (contact: SocialContact) => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ open, onClose, mode, initialData, onCreated, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SocialContact>({
    id: '',
    name: '',
    role: '',
    company: '',
    last_activity_type: '',
    last_activity_time: '',
    platform: 'linkedin',
    alert: '',
    status: 'conectado',
    engagement_score: 0
  });

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData);
    }
  }, [mode, initialData]);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'engagement_score' ? Math.min(Math.max(parseInt(value), 0), 100) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validar campos obrigatórios
      if (!formData.name.trim()) {
        throw new Error('Nome é obrigatório');
      }
      if (!formData.platform.trim()) {
        throw new Error('Plataforma é obrigatória');
      }
      if (!formData.status.trim()) {
        throw new Error('Status é obrigatório');
      }

      const normalizedData = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        company: formData.company.trim(),
        platform: formData.platform.trim().toLowerCase(),
        status: formData.status.trim().toLowerCase(),
        engagement_score: formData.engagement_score,
        last_activity_type: formData.last_activity_type || '',
        last_activity_time: formData.last_activity_time || new Date().toISOString(),
        alert: formData.alert || '',
      };

      if (mode === 'edit') {
        if (!formData.id) {
          throw new Error('ID do contato é obrigatório para edição');
        }

        const { data, error } = await supabase
          .from('social_contacts')
          .update(normalizedData)
          .eq('id', formData.id)
          .select()
          .single();

        if (error) throw error;
        onUpdated?.(data);
      } else {
        const { data, error } = await supabase
          .from('social_contacts')
          .insert([normalizedData])  // Enviar como array
          .select()
          .single();

        if (error) throw error;
        onCreated?.(data);
      }

      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao salvar contato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Editar Contato' : 'Novo Contato'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit' ? 'Edite as informações do contato' : 'Adicione um novo contato'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nome do contato"
              />
            </div>
            <div>
              <Label htmlFor="role">Cargo</Label>
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Cargo"
              />
            </div>
            <div>
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Empresa"
              />
            </div>
            <div>
              <Label>Plataforma</Label>
              <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a plataforma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conectado">Conectado</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="nao_conectado">Não Conectado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="engagement_score">Engajamento</Label>
              <Input
                id="engagement_score"
                name="engagement_score"
                type="number"
                value={formData.engagement_score}
                onChange={handleChange}
                placeholder="Pontuação de engajamento"
              />
            </div>
            <div>
              <Label htmlFor="last_activity_type">Última Atividade</Label>
              <Input
                id="last_activity_type"
                name="last_activity_type"
                value={formData.last_activity_type}
                onChange={handleChange}
                placeholder="Tipo de atividade"
              />
            </div>
            <div>
              <Label htmlFor="last_activity_time">Hora da Atividade</Label>
              <Input
                id="last_activity_time"
                name="last_activity_time"
                type="datetime-local"
                value={formData.last_activity_time}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="alert">Alerta</Label>
              <Input
                id="alert"
                name="alert"
                value={formData.alert}
                onChange={handleChange}
                placeholder="Alerta"
              />
            </div>

          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : mode === 'edit' ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactModal;
