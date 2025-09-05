import React, { useState } from 'react';
import { Controller, type Control } from 'react-hook-form';
import type { Retiree, LanguageProficiencyLevel, Language } from '@/api/openapi-client/models';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

// Icons
import { Languages, X, Plus, AlertCircle } from 'lucide-react';

interface LanguageSectionProps {
  control: Control<Retiree>;
  allLanguages: Language[];
  languageProficiencyLevels: LanguageProficiencyLevel[];
}

const LanguageSection: React.FC<LanguageSectionProps> = ({
  control,
  allLanguages,
  languageProficiencyLevels,
}) => {
  const [languageSearch, setLanguageSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  /* ---------- helpers ---------- */
  const filteredLanguages = allLanguages.filter((lang) =>
    lang.name.toLowerCase().includes(languageSearch.toLowerCase()),
  );

  const getLanguageName = (id: string): string => allLanguages.find((l) => l.id === id)?.name ?? id;

  const getLevelName = (id: string): string =>
    languageProficiencyLevels.find((l) => l.id === id)?.code ?? id;

  const hasLanguageData = allLanguages.length > 0;
  const hasLevelData = languageProficiencyLevels.length > 0;

  /* ---------- render ---------- */
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Language Proficiencies
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Controller<Retiree, 'languageProficiencies'>
          name="languageProficiencies"
          control={control}
          defaultValue={[]}
          render={({ field: { value: entries = [], onChange } }) => {
            return (
              <div className="space-y-4">
                {/* ---------- current list ---------- */}
                <div className="flex flex-wrap gap-2">
                  {entries.map((entry, idx) => (
                    <Badge
                      key={entry.languageId || idx}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1.5 text-sm"
                    >
                      <span>{getLanguageName(entry.languageId)}</span>
                      <Badge variant="default" className="ml-1 text-xs px-1.5 py-0.5">
                        {getLevelName(entry.levelId)}
                      </Badge>
                      <button
                        type="button"
                        onClick={() =>
                          onChange(entries.filter((e) => e.languageId !== entry.languageId))
                        }
                        className="cursor-pointer ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {entries.length === 0 && (
                    <div className="text-muted-foreground text-center py-2 w-full text-sm">
                      No languages added yet
                    </div>
                  )}
                </div>

                {/* ---------- add new language ---------- */}
                <div className="space-y-4 p-4 border rounded-md bg-card">
                  <h4 className="font-medium text-sm">Add Language</h4>

                  {!hasLanguageData || !hasLevelData ? (
                    <div className="flex items-center gap-2 p-3 border border-orange-200 rounded-md bg-orange-50">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <p className="text-sm text-orange-700">
                        {!hasLanguageData && !hasLevelData
                          ? 'Language and proficiency data are currently unavailable. Please try again later.'
                          : !hasLanguageData
                            ? 'Language data is currently unavailable. Please try again later.'
                            : 'Proficiency level data is currently unavailable. Please try again later.'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* ----- language search & select ----- */}
                      <div className="space-y-2">
                        <Label htmlFor="languageSearch" className="text-sm">
                          Search Language
                        </Label>
                        <Input
                          id="languageSearch"
                          value={languageSearch}
                          placeholder="Search for a language…"
                          onChange={(e) => setLanguageSearch(e.target.value)}
                          className="text-sm"
                        />

                        {languageSearch && (
                          <ScrollArea className="h-32 border rounded-md p-2">
                            <div className="space-y-1">
                              {filteredLanguages.map((lang) => {
                                const isSelected = entries.some((e) => e.languageId === lang.id);

                                return (
                                  <div
                                    key={lang.id}
                                    onClick={() => {
                                      if (!isSelected) {
                                        setSelectedLanguage(lang.id);
                                        setLanguageSearch(lang.name);
                                      }
                                    }}
                                    className={`p-2 rounded cursor-pointer transition-colors text-sm ${
                                      isSelected
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

                      {/* ----- level select ----- */}
                      <div className="space-y-2">
                        <Label htmlFor="levelSelect" className="text-sm">
                          Proficiency Level
                        </Label>
                        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                          <SelectTrigger id="levelSelect" className="text-sm">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent className="text-sm">
                            {languageProficiencyLevels.map((opt) => (
                              <SelectItem key={opt.id} value={opt.id}>
                                {opt.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <Button
                    type="button"
                    className="w-full text-sm"
                    disabled={
                      !selectedLanguage || !selectedLevel || !hasLanguageData || !hasLevelData
                    }
                    onClick={() => {
                      const exists = entries.some((e) => e.languageId === selectedLanguage);

                      const updated = exists
                        ? entries.map((e) =>
                            e.languageId === selectedLanguage
                              ? { ...e, languageId: selectedLanguage, levelId: selectedLevel }
                              : e,
                          )
                        : [...entries, { languageId: selectedLanguage, levelId: selectedLevel }];

                      onChange(updated);

                      setSelectedLanguage('');
                      setSelectedLevel('');
                      setLanguageSearch('');
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Language
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

export default LanguageSection;
