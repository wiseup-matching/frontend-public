import React, { useState } from 'react';
import { type Control, Controller } from 'react-hook-form';
import type { Retiree, ExpertiseArea } from '@/api/openapi-client/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Target, X } from 'lucide-react';
import { validationRules } from '@/lib/validation';

interface ExpertiseSectionProps {
  control: Control<Retiree>;
  allExpertise: ExpertiseArea[];
}

const ExpertiseSection: React.FC<ExpertiseSectionProps> = ({ control, allExpertise }) => {
  const [expertiseSearch, setExpertiseSearch] = useState('');

  const filteredExpertise = allExpertise.filter((a) =>
    a.name.toLowerCase().includes(expertiseSearch.toLowerCase()),
  );

  // Use centralized validation rules
  const retireeRules = validationRules.retiree;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Expertise Areas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Controller
          name="expertiseAreas"
          control={control}
          rules={retireeRules.expertiseAreas}
          render={({
            field: { value: selected = [], onChange },
            fieldState: { error: _error },
          }) => {
            const selectedIds = Array.isArray(selected)
              ? selected.map((item) =>
                  typeof item === 'string' ? item : (item as ExpertiseArea).id,
                )
              : [];

            // Find full expertise objects for the selected IDs
            const selectedAreas = selectedIds.map((id) => {
              const area = allExpertise.find((a) => a.id === id);
              return area ?? { id, name: id };
            });

            const isMaxReached = selectedIds.length >= 5;

            return (
              <div className="space-y-4">
                {/* Selected expertise count */}
                <div className="text-sm text-muted-foreground">
                  {selectedAreas.length}/5 expertise areas selected
                </div>

                {/* Selected expertise badges */}
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
                        onClick={() => onChange(selectedIds.filter((x) => x !== area.id))}
                        className="cursor-pointer ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {selectedAreas.length === 0 && (
                    <div className="text-muted-foreground text-center py-2 w-full text-sm">
                      No expertise areas added yet
                    </div>
                  )}
                </div>

                {/* Only show search and selection when not at max limit */}
                {!isMaxReached && (
                  <>
                    {/* Search input */}
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

                    {/* List of available expertise areas */}
                    {expertiseSearch && (
                      <ScrollArea className="h-40 border rounded-md p-2">
                        <div className="space-y-1">
                          {filteredExpertise.map((a) => {
                            const isSelected = selectedIds.includes(a.id);
                            return (
                              <div
                                key={a.id}
                                onClick={() => {
                                  if (!isSelected) {
                                    onChange([...selectedIds, a.id]);
                                    setExpertiseSearch('');
                                  }
                                }}
                                className={`p-2 rounded transition-colors text-sm ${
                                  isSelected
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'hover:bg-accent hover:text-accent-foreground cursor-pointer'
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

export default ExpertiseSection;
