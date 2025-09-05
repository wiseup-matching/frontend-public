import React, { useState } from 'react';
import { type Control, Controller } from 'react-hook-form';
import type { JobPosting } from '@/api/openapi-client/models';
import type { LanguageProficiencyLevel, Language } from '@/api/openapi-client/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Languages, X, Plus } from 'lucide-react';
import { validationRules } from '@/lib/validation';

interface JobLanguagesSectionProps {
  control: Control<JobPosting>;
  allLanguages: Language[];
  languageProficiencyLevels: LanguageProficiencyLevel[];
}

const JobLanguagesSection: React.FC<JobLanguagesSectionProps> = ({
  control,
  allLanguages,
  languageProficiencyLevels,
}) => {
  const [languageSearch, setLanguageSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  // use centralized validation rules
  const jobPostingRules = validationRules.jobPosting;

  // filter languages by search term
  const filteredLanguages = allLanguages.filter((lang) =>
    lang.name.toLowerCase().includes(languageSearch.toLowerCase()),
  );

  const getLanguageName = (id: string): string => allLanguages.find((l) => l.id === id)?.name ?? id;
  const getLevelCode = (id: string): string =>
    languageProficiencyLevels.find((l) => l.id === id)?.code ?? id;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Required Language Proficiencies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Controller
          control={control}
          name="matchingLanguageProficiencies"
          rules={jobPostingRules.matchingLanguageProficiencies}
          render={({ field: { value = [], onChange }, fieldState: { error } }) => {
            const requirements = value;
            return (
              <div className="space-y-4">
                {/* selected Language Requirements */}
                <div className="flex flex-wrap gap-2">
                  {requirements.map((entry, idx) => (
                    <Badge
                      key={entry.languageId || idx}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1.5 text-sm"
                    >
                      <span>{getLanguageName(entry.languageId)}</span>
                      <Badge variant="default" className="ml-1 text-xs px-1.5 py-0.5">
                        {getLevelCode(entry.levelId)}
                      </Badge>
                      <button
                        type="button"
                        onClick={() =>
                          onChange(value.filter((e) => e.languageId !== entry.languageId))
                        }
                        className="cursor-pointer ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {requirements.length === 0 && (
                    <div className="cursor-pointer text-muted-foreground text-center py-2 w-full text-sm">
                      No language requirements added yet
                    </div>
                  )}
                </div>

                {/* Error message */}
                {error && <div className="text-destructive text-sm mt-1">{error.message}</div>}

                {/* add Language Requirement */}
                <div className="space-y-4 p-4 border rounded-md bg-card">
                  <h4 className="font-medium text-sm">Add Language Requirement</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* language search and select */}
                    <div className="space-y-2">
                      <Label htmlFor="languageSearch" className="text-sm">
                        Search Language
                      </Label>
                      <Input
                        id="languageSearch"
                        value={languageSearch}
                        placeholder="Search for a language..."
                        onChange={(e) => setLanguageSearch(e.target.value)}
                        className="text-sm"
                      />

                      {languageSearch && (
                        <ScrollArea className="h-32 border rounded-md p-2">
                          <div className="space-y-1">
                            {filteredLanguages.map((lang) => {
                              const isAlreadySelected = requirements.some(
                                (req) => req.languageId === lang.id,
                              );

                              return (
                                <div
                                  key={lang.id}
                                  onClick={() => {
                                    if (!isAlreadySelected) {
                                      setSelectedLanguage(lang.id);
                                      setLanguageSearch(lang.name);
                                    }
                                  }}
                                  className={`p-2 rounded cursor-pointer transition-colors text-sm ${
                                    isAlreadySelected
                                      ? 'bg-primary/10 text-primary font-medium'
                                      : selectedLanguage === lang.id
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-accent hover:text-accent-foreground'
                                  }`}
                                >
                                  {lang.name}
                                </div>
                              );
                            })}

                            {filteredLanguages.length === 0 && (
                              <div className="p-2 text-muted-foreground text-center text-sm">
                                No matching languages found
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      )}
                    </div>

                    {/* selection of proficiency level */}
                    <div className="space-y-2">
                      <Label htmlFor="levelSelect" className="text-sm">
                        Required Proficiency Level
                      </Label>
                      <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                        <SelectTrigger id="levelSelect" className="text-sm">
                          <SelectValue placeholder="Select minimum level" />
                        </SelectTrigger>
                        <SelectContent className="text-sm">
                          {languageProficiencyLevels.map((level) => (
                            <SelectItem key={level.id} value={level.id}>
                              {level.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="w-full text-sm"
                    disabled={!selectedLanguage || !selectedLevel}
                    onClick={() => {
                      const updated = [
                        ...value,
                        { languageId: selectedLanguage, levelId: selectedLevel },
                      ];

                      onChange(updated);

                      // reset mini-form
                      setSelectedLanguage('');
                      setSelectedLevel('');
                      setLanguageSearch('');
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Language Requirement
                  </Button>
                </div>
              </div>
            );
          }}
        />
      </CardContent>
    </Card>
  );
};

export default JobLanguagesSection;
