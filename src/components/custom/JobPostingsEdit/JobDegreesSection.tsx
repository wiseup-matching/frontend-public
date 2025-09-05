import React, { useState } from 'react';
import { type Control, Controller } from 'react-hook-form';
import type { JobPosting } from '@/api/openapi-client/models';
import type { Degree } from '@/api/openapi-client/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { GraduationCap, X } from 'lucide-react';
import { validationRules } from '@/lib/validation';

interface JobDegreesSectionProps {
  control: Control<JobPosting>;
  allDegrees: Degree[];
}

const JobDegreesSection: React.FC<JobDegreesSectionProps> = ({ control, allDegrees }) => {
  const [degreeSearch, setDegreeSearch] = useState('');

  // use centralized validation rules
  const jobPostingRules = validationRules.jobPosting;

  const filteredDegrees = allDegrees.filter((degree) =>
    degree.title.toLowerCase().includes(degreeSearch.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Required Degrees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            control={control}
            name="matchingDegrees"
            rules={jobPostingRules.matchingDegrees}
            render={({ field: { value = [], onChange }, fieldState: { error } }) => {
              const degreeIds = Array.isArray(value) ? value : [];
              const selectedDegrees = allDegrees.filter((degree) => degreeIds.includes(degree.id));

              const handleRemove = (id: string) => {
                onChange(degreeIds.filter((degreeId) => degreeId !== id));
              };

              return (
                <div className="space-y-4">
                  {/* Degrees */}
                  <div className="flex flex-wrap gap-2">
                    {selectedDegrees.map((degree) => (
                      <Badge
                        key={degree.id}
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1.5 text-sm"
                      >
                        <span>{degree.title}</span>
                        <button
                          type="button"
                          onClick={() => handleRemove(degree.id)}
                          className="cursor-pointer ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {selectedDegrees.length === 0 && (
                      <div className="text-muted-foreground text-center py-2 w-full text-sm">
                        No degree requirements added yet
                      </div>
                    )}
                  </div>

                  {/* Error message */}
                  {error && <div className="text-destructive text-sm mt-1">{error.message}</div>}

                  {/* search input */}
                  <div className="space-y-2">
                    <Label htmlFor="degreeSearch" className="text-sm">
                      Search Degrees
                    </Label>
                    <Input
                      id="degreeSearch"
                      type="text"
                      value={degreeSearch}
                      onChange={(e) => setDegreeSearch(e.target.value)}
                      placeholder="Search degrees to add..."
                      className="w-full text-sm"
                    />
                  </div>

                  {/* list with all available degrees */}
                  {degreeSearch && (
                    <ScrollArea className="h-40 border rounded-md p-2">
                      <div className="space-y-1">
                        {filteredDegrees.map((degree) => {
                          const isSelected = degreeIds.includes(degree.id);
                          return (
                            <div
                              key={degree.id}
                              onClick={() => {
                                if (!isSelected) {
                                  onChange([...degreeIds, degree.id]);
                                  setDegreeSearch('');
                                }
                              }}
                              className={`p-2 rounded cursor-pointer transition-colors text-sm ${
                                isSelected
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'hover:bg-accent hover:text-accent-foreground'
                              }`}
                            >
                              {degree.title}
                            </div>
                          );
                        })}

                        {filteredDegrees.length === 0 && (
                          <div className="p-2 text-muted-foreground text-center text-sm">
                            No matching degrees found
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  )}

                  {degreeSearch && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => setDegreeSearch('')}
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

export default JobDegreesSection;
