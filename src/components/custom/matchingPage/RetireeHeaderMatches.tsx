import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Retiree } from '@/api/openapi-client/models/Retiree';

interface RetireeHeaderProps {
  retiree: Retiree;
  isObscured: boolean;
}

const RetireeHeader: React.FC<RetireeHeaderProps> = ({ retiree, isObscured }) => (
  <CardHeader className="border-b pb-3 pt-3">
    <div className="flex flex-col items-center text-center w-full">
      <CardTitle className={`text-2xl font-bold text-primary ${isObscured ? 'blur-sm' : ''}`}>
        {retiree.nameFirst} {retiree.nameLast}
      </CardTitle>

      {retiree.addressCity && retiree.addressCountry && (
        <CardDescription className="text-gray-800 mt-1 text-base">
          {retiree.addressCity}, {retiree.addressCountry}
        </CardDescription>
      )}
    </div>
  </CardHeader>
);

export default RetireeHeader;
