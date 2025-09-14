import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'submitted';
      case 'acknowledged':
      case 'in-progress':
        return 'progress';
      case 'resolved':
        return 'resolved';
      default:
        return 'secondary';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Badge variant={getVariant(status)} className={className}>
      {formatStatus(status)}
    </Badge>
  );
};