import { useState, useEffect } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AddContactModal from './AddContactModal';
import { supabase } from '@/lib/supabase';
import { SocialContact } from '@/types';

const SocialMonitoringDashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('engagement');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [contacts, setContacts] = useState<SocialContact[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editContactId, setEditContactId] = useState<string | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      let query = supabase.from('social_contacts').select('*');

      if (selectedStatus && selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus.toLowerCase().trim());
      }

      if (selectedPlatform && selectedPlatform !== 'all') {
        query = query.eq('platform', selectedPlatform.toLowerCase().trim());
      }

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (sortBy === 'engagement') {
        query = query.order('engagement_score', { ascending: false });
      } else if (sortBy === 'status') {
        query = query.order('status');
      }

      const { data, error } = await query;
      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('social_contacts')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchContacts();
    } catch (error) {
      console.error('Erro ao deletar contato:', error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [selectedStatus, selectedPlatform, sortBy, searchTerm]);

  if (loading) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Social Monitoring</h2>
        </div>
        <Button variant="default" onClick={() => setCreateModalOpen(true)}>
          + Novo Contato
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Status</label>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="conectado">Conectado</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="nao_conectado">Não Conectado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Plataforma</label>
            <Select
              value={selectedPlatform}
              onValueChange={setSelectedPlatform}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as plataformas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Ordenar por</label>
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engagement">Engajamento</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-2">Nome</th>
                <th className="text-left py-2">Cargo</th>
                <th className="text-left py-2">Empresa</th>
                <th className="text-left py-2">Plataforma</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Engajamento</th>
                <th className="text-left py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.name}</td>
                  <td>{contact.role}</td>
                  <td>{contact.company}</td>
                  <td>{contact.platform}</td>
                  <td>{contact.status}</td>
                  <td>{contact.engagement_score}</td>
                  <td>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditContactId(contact.id);
                        setEditModalOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteContact(contact.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddContactModal
        open={createModalOpen}
        mode="add"
        onCreated={fetchContacts}
        onClose={() => setCreateModalOpen(false)}
        onUpdated={fetchContacts}
      />

      <AddContactModal
        open={editModalOpen}
        mode="edit"
        initialData={contacts.find(c => c.id === editContactId) || {
          id: '',
          name: '',
          role: '',
          company: '',
          last_activity_type: '',
          last_activity_time: '',
          platform: 'linkedin',
          alert: '',
          status: '',
          engagement_score: 0
        }}
        onClose={() => {
          setEditModalOpen(false);
          setEditContactId(null);
        }}
        onCreated={fetchContacts}
        onUpdated={fetchContacts}
      />
    </div>
  );
};

export default SocialMonitoringDashboard;