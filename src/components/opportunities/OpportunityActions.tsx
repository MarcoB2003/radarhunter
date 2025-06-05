import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OpportunityActionsProps {
  opportunityId: string;
  onDelete: () => void;
  onEdit: () => void;
}

export const OpportunityActions: React.FC<OpportunityActionsProps> = ({
  opportunityId,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
      >
        <Edit className="w-4 h-4 mr-2" />
        Editar
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Excluir
      </Button>
    </div>
  );
};
