import React, { useState } from 'react';
import { type Control, Controller } from 'react-hook-form';
import type { JobPosting } from '@/api/openapi-client/models';
import type { Skill } from '@/api/openapi-client/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Wrench, X } from 'lucide-react';
import { validationRules } from '@/lib/validation';

interface JobSkillsSectionProps {
  control: Control<JobPosting>;
  allSkills: Skill[];
}

const JobSkillsSection: React.FC<JobSkillsSectionProps> = ({ control, allSkills }) => {
  const [skillSearch, setSkillSearch] = useState('');

  // Use centralized validation rules
  const jobPostingRules = validationRules.jobPosting;

  const filteredSkills = allSkills.filter((s) =>
    s.name.toLowerCase().includes(skillSearch.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* skill Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Required Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            control={control}
            name="matchingSkills"
            rules={jobPostingRules.matchingSkills}
            render={({ field: { value = [], onChange }, fieldState: { error } }) => {
              const selectedSkills = allSkills.filter((skill) => value.includes(skill.id));

              const handleRemove = (id: string) => {
                onChange(value.filter((skillId: string) => skillId !== id));
              };

              return (
                <div className="space-y-4">
                  {/* Selected Skills */}
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill) => (
                      <Badge
                        key={skill.id}
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1.5 text-sm"
                      >
                        <span>{skill.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemove(skill.id)}
                          className="cursor-pointer ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  {/* Error message */}
                  {error && <div className="text-destructive text-sm mt-1">{error.message}</div>}

                  {/* Search input */}
                  <div className="space-y-2">
                    <Label htmlFor="skillSearch" className="text-sm">
                      Search Skills
                    </Label>
                    <Input
                      id="skillSearch"
                      type="text"
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                      placeholder="Search skills to add..."
                      className="w-full text-sm"
                    />
                  </div>

                  {/* List of available skills */}
                  {skillSearch && (
                    <ScrollArea className="h-40 border rounded-md p-2">
                      <div className="space-y-1">
                        {filteredSkills.map((s) => {
                          const isSelected = value.includes(s.id);
                          return (
                            <div
                              key={s.id}
                              onClick={() => {
                                if (!isSelected) {
                                  onChange([...value, s.id]);
                                  setSkillSearch('');
                                }
                              }}
                              className={`p-2 rounded cursor-pointer transition-colors text-sm ${
                                isSelected
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'hover:bg-accent hover:text-accent-foreground'
                              }`}
                            >
                              {s.name}
                            </div>
                          );
                        })}

                        {filteredSkills.length === 0 && (
                          <div className="p-2 text-muted-foreground text-center text-sm">
                            No matching skills found
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

export default JobSkillsSection;
