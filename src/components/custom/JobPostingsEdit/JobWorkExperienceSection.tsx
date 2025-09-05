import React, { useState } from 'react';
import { type Control, Controller } from 'react-hook-form';
import type { JobPosting } from '@/api/openapi-client/models';
import type { Position } from '@/api/openapi-client/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Briefcase, X } from 'lucide-react';
import { validationRules } from '@/lib/validation';

interface JobWorkExperienceSectionProps {
  control: Control<JobPosting>;
  allPositions: Position[];
}

const JobWorkExperienceSection: React.FC<JobWorkExperienceSectionProps> = ({
  control,
  allPositions,
}) => {
  const [positionSearch, setPositionSearch] = useState('');

  // Use centralized validation rules
  const jobPostingRules = validationRules.jobPosting;

  const filteredPositions = allPositions.filter((position) =>
    position.title.toLowerCase().includes(positionSearch.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Required Work Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            control={control}
            name="matchingPositions"
            rules={jobPostingRules.matchingPositions}
            render={({ field: { value = [], onChange }, fieldState: { error } }) => {
              // make sure value is an array of strings
              const positionIds = Array.isArray(value) ? value : [];
              const selectedPositions = allPositions.filter((position) =>
                positionIds.includes(position.id),
              );

              const handleRemove = (id: string) => {
                onChange(positionIds.filter((positionId) => positionId !== id));
              };

              return (
                <div className="space-y-4">
                  {/* Work Job Positions */}
                  <div className="flex flex-wrap gap-2">
                    {selectedPositions.map((position) => (
                      <Badge
                        key={position.id}
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1.5 text-sm"
                      >
                        <span>{position.title}</span>
                        <button
                          type="button"
                          onClick={() => handleRemove(position.id)}
                          className="cursor-pointer ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {selectedPositions.length === 0 && (
                      <div className="text-muted-foreground text-center py-2 w-full text-sm">
                        No work experience requirements added yet
                      </div>
                    )}
                  </div>

                  {/* eror message */}
                  {error && <div className="text-destructive text-sm mt-1">{error.message}</div>}

                  {/* search the input */}
                  <div className="space-y-2">
                    <Label htmlFor="positionSearch" className="text-sm">
                      Search Job Positions
                    </Label>
                    <Input
                      id="positionSearch"
                      type="text"
                      value={positionSearch}
                      onChange={(e) => setPositionSearch(e.target.value)}
                      placeholder="Search positions to add..."
                      className="w-full text-sm"
                    />
                  </div>

                  {/* list of all of available positions */}
                  {positionSearch && (
                    <ScrollArea className="h-40 border rounded-md p-2">
                      <div className="space-y-1">
                        {filteredPositions.map((position) => {
                          const isSelected = positionIds.includes(position.id);
                          return (
                            <div
                              key={position.id}
                              onClick={() => {
                                if (!isSelected) {
                                  onChange([...positionIds, position.id]);
                                  setPositionSearch('');
                                }
                              }}
                              className={`p-2 rounded cursor-pointer transition-colors text-sm ${
                                isSelected
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'hover:bg-accent hover:text-accent-foreground'
                              }`}
                            >
                              {position.title}
                            </div>
                          );
                        })}

                        {filteredPositions.length === 0 && (
                          <div className="p-2 text-muted-foreground text-center text-sm">
                            No matching positions found
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  )}

                  {positionSearch && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => setPositionSearch('')}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear Search
                    </Button>
                  )}
                </div>
              );
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default JobWorkExperienceSection;
