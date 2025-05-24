
import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

const Chatbot: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  
  // Example messages
  const messages = [
    {
      id: '1',
      senderId: 'ai-agent',
      senderType: 'ai',
      senderName: 'RadarHunter AI',
      content: 'Olá! Como posso ajudar você hoje?',
      timestamp: new Date().toISOString(),
    }
  ];

  return (
    <MainLayout title="Chatbot">
      <div className="flex flex-col h-[calc(100vh-120px)]">
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-radar-600" />
              RadarHunter AI Assistant
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.senderType === 'ai' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`flex items-start max-w-[80%] gap-2 ${message.senderType === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={message.senderType === 'ai' ? 'bg-radar-600 text-white' : 'bg-primary'}>
                          {message.senderType === 'ai' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div 
                        className={`rounded-lg p-3 ${
                          message.senderType === 'ai' 
                            ? 'bg-muted text-foreground' 
                            : 'bg-radar-600 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1"
                />
                <Button>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Chatbot;
