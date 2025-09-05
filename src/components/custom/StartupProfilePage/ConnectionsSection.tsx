import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface ConnectionsSectionProps {
  connectionBalance: number;
}

const ConnectionsSection: React.FC<ConnectionsSectionProps> = ({ connectionBalance }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Connection Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-gray-800 text-center">
            You currently have{' '}
            <span className="inline-flex items-center justify-center w-12 h-8 rounded-full bg-primary text-tier-free text-l border border-primary shadow">
              {connectionBalance}
            </span>{' '}
            {connectionBalance === 1 ? 'connection left.' : 'connections left.'}
          </span>
        </div>
        <div className="flex w-full overflow-hidden">
          <Button
            size="sm"
            variant="outline"
            className="mt-1 border-primary text-primary font-bold hover:border-primary hover:primary transition-colors flex items-center flex-1 min-w-0 bg-white"
            onClick={() => void navigate('/startup/paywall')}
          >
            <ArrowRight className="h-4 w-4 flex-shrink-0" />
            <span className="ml-2 overflow-hidden text-ellipsis whitespace-nowrap">
              Upgrade subscription for more connections
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionsSection;
