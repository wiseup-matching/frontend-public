import React, { useState } from 'react';
import { type Control, Controller } from 'react-hook-form';
import type { Retiree, Skill } from '@/api/openapi-client/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Wrench, X } from 'lucide-react';
import { validationRules } from '@/lib/validation';

interface SkillsSectionProps {
  control: Control<Retiree>;
  allSkills: Skill[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ control, allSkills }) => {
  const [skillSearch, setSkillSearch] = useState('');

  const filteredSkills = allSkills.filter((s) =>
    s.name.toLowerCase().includes(skillSearch.toLowerCase()),
  );

  // Use centralized validation rules
  const retireeRules = validationRules.retiree;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Skills
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Controller
          name="skills"
          control={control}
          rules={retireeRules.skills}
          render={({ field: { value: selectedIds = [], onChange }, fieldState: { error } }) => {
            const selectedSkills: Skill[] = (Array.isArray(selectedIds) ? selectedIds : [])
              .map((id) => allSkills.find((s) => s.id === id))
              .filter(Boolean) as Skill[];

            const isMaxReached = selectedIds.length >= 10;

            const handleAdd = (skill: Skill) => {
              if (!selectedIds.includes(skill.id) && !isMaxReached) {
                onChange([...selectedIds, skill.id]);
                setSkillSearch('');
              }
            };

            const handleRemove = (skillId: string) => {
              onChange(selectedIds.filter((id) => id !== skillId));
            };

            return (
              <div className="space-y-4">
                {/* Selected skills count */}
                <div className="text-sm text-muted-foreground">
                  {selectedIds.length}/10 skills selected
                </div>

                {/* Currently selected skills */}
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
                  {selectedSkills.length === 0 && (
                    <div className="text-muted-foreground text-center py-2 w-full text-sm">
                      No skills added yet
                    </div>
                  )}
                </div>

                {/* Validation error message */}
                {error && <span className="text-red-500 text-xs block">{error.message}</span>}

                {/* Only show search and selection when not at max limit */}
                {!isMaxReached && (
                  <>
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

                    {/* Search results */}
                    {skillSearch && (
                      <ScrollArea className="h-40 border rounded-md p-2">
                        <div className="space-y-1">
                          {filteredSkills.map((s) => {
                            const isSelected = selectedIds.includes(s.id);

                            return (
                              <div
                                key={s.id}
                                onClick={() => !isSelected && handleAdd(s)}
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
                  </>
                )}
              </div>
            );
          }}
        />
      </CardContent>
    </Card>
  );
};

export default SkillsSection;
