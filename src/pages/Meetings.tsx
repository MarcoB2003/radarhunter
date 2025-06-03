// ✅ src/pages/Meetings.tsx
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MeetingModal from '@/components/MeetingModal';
import { Plus, Building2, User, Briefcase, Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { supabase } from '@/lib/supabase';
import { startOfDay, endOfDay } from 'date-fns';

interface Meeting {
  id: string;
  name: string;
  role: string;
  company: string;
  date_time: string;
}

const Meetings: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [allMeetings, setAllMeetings] = useState<Meeting[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastCreatedMeeting, setLastCreatedMeeting] = useState<Meeting | null>(null);

  const fetchAllMeetings = async () => {
    const { data, error } = await supabase.from('meetings').select('*');
    if (error) console.error(error);
    else setAllMeetings(data || []);
  };

  const fetchMeetings = async (date: Date | undefined) => {
    if (!date) return;
    const start = startOfDay(date).toISOString();
    const end = endOfDay(date).toISOString();

    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .gte('date_time', start)
      .lt('date_time', end);

    if (error) console.error('Erro ao buscar reuniões:', error);
    else setMeetings(data || []);
  };

  const handleCreated = async (newMeeting: Meeting) => {
    setLastCreatedMeeting(newMeeting);
    setTimeout(() => setLastCreatedMeeting(null), 5000);
    await fetchAllMeetings();
    await fetchMeetings(selectedDate);
  };

  useEffect(() => {
    fetchAllMeetings();
    fetchMeetings(selectedDate);
  }, [selectedDate]);

  const datesWithMeetings = allMeetings.map((m) => new Date(m.date_time).toDateString());

  return (
    <MainLayout title="Reuniões Agendadas">
      <div className="pl-8 pr-4 py-8">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-2xl font-bold">Reuniões Agendadas</h1>
          <p className="text-muted-foreground">Gerencie suas reuniões com leads qualificados</p>
        </div>

        {lastCreatedMeeting && (
          <div className="mb-4 p-4 rounded-lg border border-green-500 bg-green-50 shadow-sm">
            <p className="text-green-700 font-semibold">Reunião criada com sucesso!</p>
            <p><strong>Nome:</strong> {lastCreatedMeeting.name}</p>
            <p><strong>Cargo:</strong> {lastCreatedMeeting.role}</p>
            <p><strong>Empresa:</strong> {lastCreatedMeeting.company}</p>
            <p><strong>Data:</strong> {format(new Date(lastCreatedMeeting.date_time), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Calendário</CardTitle>
              <CardDescription>Selecione uma data para ver as reuniões</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => setSelectedDate(date ?? new Date())}
                className="w-full rounded-lg border p-4 bg-white shadow-sm"
                locale={ptBR}
                modifiers={{
                  booked: (day) => datesWithMeetings.includes(day.toDateString())
                }}
                modifiersClassNames={{ booked: 'bg-blue-500 text-white' }}
              />
              <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                Dias com reuniões agendadas
              </p>
            </CardContent>
          </Card>

          <Card className="w-full min-h-[400px]">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  Reuniões para {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: ptBR }) : '--/--/----'}
                </CardTitle>
                <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Reunião
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {meetings.length > 0 ? (
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-lg">{meeting.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="w-4 h-4" />
                        <span>{meeting.role}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="w-4 h-4" />
                        <span>{meeting.company}</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        Horário: {format(new Date(meeting.date_time), 'HH:mm', { locale: ptBR })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <CalendarIcon className="h-8 w-8 mb-2" />
                  <p className="text-center">Nenhuma reunião agendada para esta data</p>
                  <Button variant="outline" className="mt-4" onClick={() => setIsModalOpen(true)}>
                    Agendar nova reunião
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <MeetingModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleCreated}
      />
    </MainLayout>
  );
};

export default Meetings;
