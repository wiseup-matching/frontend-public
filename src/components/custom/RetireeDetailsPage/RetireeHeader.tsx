import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { Retiree } from '@/api/openapi-client/models/Retiree';
import { getRandomDummyImage } from '../profileBlurringUtils';

interface RetireeHeaderProps {
  retiree: Retiree;
  isObscured?: boolean;
}

const RetireeHeader: React.FC<RetireeHeaderProps> = ({ retiree, isObscured }) => {
  return (
    <div>
      <CardHeader className="border-b pb-3 pt-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className={`text-2xl font-bold text-primary ${isObscured ? 'blur-sm' : ''}`}>
              {retiree.nameFirst} {retiree.nameLast}
            </CardTitle>
            <CardDescription className="text-gray-800 mt-1 text-base">
              {retiree.addressCity && retiree.addressCountry ? (
                <span>
                  {retiree.addressCity}, {retiree.addressCountry}
                </span>
              ) : (
                <span className="text-gray-500">Location not provided</span>
              )}
            </CardDescription>
          </div>
          <Avatar
            className={`h-16 w-16 ml-4 border-2 border-tier-free ${isObscured || retiree.profilePicture === 'hiddenProfilePicture' ? 'blur-sm' : ''}`}
          >
            {retiree.profilePicture === 'hiddenProfilePicture' ? (
              <AvatarImage
                src={getRandomDummyImage(retiree.id)}
                alt="Dummy"
                className="object-cover"
              />
            ) : retiree.profilePicture ? (
              <AvatarImage
                src={retiree.profilePicture}
                alt={`${retiree.nameFirst} ${retiree.nameLast}`}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-tier-free text-primary text-2xl">
                {retiree.nameFirst ? retiree.nameFirst.charAt(0).toUpperCase() : 'R'}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </CardHeader>
    </div>
  );
};

export default RetireeHeader;
