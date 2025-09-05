import React, { useState } from 'react';
import { type Control, Controller } from 'react-hook-form';
import type { JobPosting } from '@/api/openapi-client/models';
import type { ExpertiseArea } from '@/api/openapi-client/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Target, X } from 'lucide-react';
import { validationRules } from '@/lib/validation';

interface JobRequirementsSectionProps {
  control: Control<JobPosting>;
  allExpertise: ExpertiseArea[];
}

const JobRequirementsSection: React.FC<JobRequirementsSectionProps> = ({
  control,
  allExpertise,
}) => {
  const [expertiseSearch, setExpertiseSearch] = useState('');

  // use centralized validation rules
  const jobPostingRules = validationRules.jobPosting;

  const filteredExpertise = allExpertise.filter((a) =>
    a.name.toLowerCase().includes(expertiseSearch.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* expertise Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Required Expertise Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            control={control}
            name="matchingExpertiseAreas"
            rules={jobPostingRules.matchingExpertiseAreas}
            render={({ field: { value = [], onChange }, fieldState: { error } }) => {
              const selectedAreas = allExpertise.filter((area) => value.includes(area.id));

              return (
                <div className="space-y-4">
                  {/* selected expertise areas */}
                  <div className="flex flex-wrap gap-2">
                    {selectedAreas.map((area) => (
                      <Badge
                        key={area.id}
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1.5 text-sm"
                      >
                        <span>{area.name}</span>
                        <button
                          type="button"
                          onClick={() => onChange(value.filter((x: string) => x !== area.id))}
                          className="cursor-pointer ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  {/* error message */}
                  {error && <div className="text-destructive text-sm mt-1">{error.message}</div>}

                  {/* search input */}
                  <div className="space-y-2">
                    <Label htmlFor="expertiseSearch" className="text-sm">
                      Search Expertise Areas
                    </Label>
                    <Input
                      id="expertiseSearch"
                      type="text"
                      value={expertiseSearch}
                      onChange={(e) => setExpertiseSearch(e.target.value)}
                      placeholder="Search expertise areas to add..."
                      className="w-full text-sm"
                    />
                  </div>

                  {/* list of available expertise areas */}
                  {expertiseSearch && (
                    <ScrollArea className="h-40 border rounded-md p-2">
                      <div className="space-y-1">
                        {filteredExpertise.map((a) => {
                          const isSelected = value.includes(a.id);
                          return (
                            <div
                              key={a.id}
                              onClick={() => {
                                if (!isSelected) {
                                  onChange([...value, a.id]);
                                  setExpertiseSearch('');
                                }
                              }}
                              className={`p-2 rounded cursor-pointer transition-colors text-sm ${
                                isSelected
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'hover:bg-accent hover:text-accent-foreground'
                              }`}
                            >
                              {a.name}
                            </div>
                          );
                        })}

                        {filteredExpertise.length === 0 && (
                          <div className="p-2 text-muted-foreground text-center text-sm">
                            No matching expertise areas found
                          </div>
                        )}
                      </div>
                    </ScrollArea>
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

export default JobRequirementsSection;
