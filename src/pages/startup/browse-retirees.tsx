import { RetireeStatusEnum } from '@/api/openapi-client/models/Retiree';
import BrowseRetireesResultItemCard from '@/components/custom/browse-retirees-result-item-card';
import ProtectedRoute from '@/components/custom/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/context/AuthContext';
import { useDegrees } from '@/hooks/useDegrees';
import { useExpertiseAreas } from '@/hooks/useExpertiseAreas';
import { useLanguages } from '@/hooks/useLanguages';
import { useRetirees } from '@/hooks/useRetiree';
import { useSkills } from '@/hooks/useSkills';
import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingPage from '../loading-page';
import { SearchIcon } from 'lucide-react';

const BrowseRetirees: React.FC = () => {
  const { user: _user, loading: loadingUser } = useAuth();
  const { retirees, loading, error } = useRetirees();
  const { skills } = useSkills();
  const { languages } = useLanguages();
  const { expertiseAreas } = useExpertiseAreas();
  const { degrees: _degrees } = useDegrees();

  // State for search bar and filters
  const [search, setSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [minAvailability, setMinAvailability] = useState<number | undefined>(undefined);
  const [salaryMax, setSalaryMax] = useState<number | undefined>(undefined);
  const [location, setLocation] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [languageSearch, setLanguageSearch] = useState('');

  // Multi-Select Handler
  const toggleMultiSelect = (value: string, arr: string[], setArr: (a: string[]) => void) => {
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  // Helper function to get the most recent career element based on dates
  const getMostRecentCareerElement = (careerElements?: any[]) => {
    if (!careerElements || careerElements.length === 0) {
      return undefined;
    }

    return careerElements.reduce((mostRecent, current) => {
      // Get the end date or current date for comparison
      const mostRecentEndDate = mostRecent.untilDate || new Date();
      const currentEndDate = current.untilDate || new Date();

      // If current element has a later end date, it's more recent
      if (currentEndDate > mostRecentEndDate) {
        return current;
      }

      // If dates are equal, prefer the one with a later start date
      if (currentEndDate.getTime() === mostRecentEndDate.getTime()) {
        const mostRecentStartDate = mostRecent.fromDate || new Date(0);
        const currentStartDate = current.fromDate || new Date(0);

        if (currentStartDate > mostRecentStartDate) {
          return current;
        }
      }

      return mostRecent;
    });
  };

  // Filtered skills and languages for search
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => skill.name.toLowerCase().includes(skillSearch.toLowerCase()));
  }, [skills, skillSearch]);

  const filteredLanguages = useMemo(() => {
    return languages.filter((language) =>
      language.name.toLowerCase().includes(languageSearch.toLowerCase()),
    );
  }, [languages, languageSearch]);

  // Filtered retirees by all criteria
  const filteredRetirees = useMemo(() => {
    // First filter to only show available retirees
    let filtered = retirees.filter((r) => r.status === RetireeStatusEnum.Available);

    if (search.trim() !== '') {
      filtered = filtered.filter((r) => {
        // Get the most recent career element based on dates
        const mostRecentCareerElement = getMostRecentCareerElement(r.careerElements);

        // Search in the title of the most recent career element
        const mostRecentWorkExperience = mostRecentCareerElement?.title ?? '';
        const searchTerm = search.trim().toLowerCase();

        return mostRecentWorkExperience.toLowerCase().includes(searchTerm);
      });
    }
    if (selectedSkills.length > 0) {
      filtered = filtered.filter((r) => r.skills?.some((id) => selectedSkills.includes(id)));
    }
    if (selectedLanguages.length > 0) {
      filtered = filtered.filter((r) =>
        r.languageProficiencies?.some((lp) => selectedLanguages.includes(lp.languageId)),
      );
    }
    if (minAvailability !== undefined && !isNaN(minAvailability)) {
      filtered = filtered.filter((r) => (r.desiredWorkHoursPerWeek ?? 0) >= minAvailability);
    }
    if (salaryMax !== undefined && !isNaN(salaryMax)) {
      filtered = filtered.filter((r) => (r.expectedHourlySalaryEUR ?? 0) <= salaryMax);
    }
    if (location.trim() !== '') {
      filtered = filtered.filter(
        (r) =>
          //because filtering must work for both city and country
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          r.addressCity?.toLowerCase().includes(location.trim().toLowerCase()) ||
          r.addressCountry?.toLowerCase().includes(location.trim().toLowerCase()),
      );
    }
    if (selectedExpertise.length > 0) {
      filtered = filtered.filter((r) =>
        r.expertiseAreas?.some((id) => selectedExpertise.includes(id)),
      );
    }
    if (selectedDegrees.length > 0) {
      filtered = filtered.filter((r) =>
        r.careerElements?.some((ce) => selectedDegrees.includes(ce.degree ?? '')),
      );
    }
    return filtered;
  }, [
    retirees,
    search,
    selectedSkills,
    selectedLanguages,
    minAvailability,
    salaryMax,
    location,
    selectedExpertise,
    selectedDegrees,
  ]);

  // Reset handler
  const resetFilters = () => {
    setSearch('');
    setSelectedSkills([]);
    setSelectedLanguages([]);
    setMinAvailability(undefined);
    setSalaryMax(undefined);
    setLocation('');
    setSelectedExpertise([]);
    setSelectedDegrees([]);
    setSkillSearch('');
    setLanguageSearch('');
  };

  if (loadingUser || loading) return <LoadingPage />;

  return (
    <ProtectedRoute requiredUserType="Startup">
      <Helmet>
        <title>Browse Retirees</title>
      </Helmet>
      <div className="min-h-screen">
        <div className="min-h-screen px-2 sm:px-6 lg:px-12">
          <div className="max-w-5xl mx-auto py-6 px-2 sm:px-4">
            {/* Search bar and reset button */}
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-3 justify-between">
                <div className="relative w-full max-w-[350px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <SearchIcon className="h-5 w-5" />
                  </span>
                  <Input
                    placeholder="Search"
                    className="pl-10 bg-secondary/50 rounded-xl border-none shadow-none focus:ring-0"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  className="cursor-pointer rounded-full px-6 bg-white border border-white shadow text-primary font-semibold hover:bg-white hover:border-primary hover:text-primary ml-auto"
                  onClick={resetFilters}
                  type="button"
                >
                  Reset Filters
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 items-end">
                {/* Skills Multi-Select */}
                <div className="flex flex-col items-start min-w-[140px]">
                  <Label className="text-xs text-gray-500 mb-1 ml-1">Skills</Label>
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        variant="outline"
                        className="rounded-full min-w-[140px] h-9 px-6 bg-white border-none shadow text-foreground font-semibold w-full justify-between"
                      >
                        {selectedSkills.length > 0 ? (
                          (() => {
                            const firstSkill = skills.find((s) => s.id === selectedSkills[0]);
                            const firstName = firstSkill ? firstSkill.name : '';
                            return selectedSkills.length === 1
                              ? firstName
                              : `${firstName}, +${(selectedSkills.length - 1).toString()}`;
                          })()
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="bg-white rounded-lg shadow p-2 w-64"
                      sideOffset={5}
                      align="start"
                    >
                      <Input
                        placeholder="Search skills..."
                        value={skillSearch}
                        onChange={(e) => setSkillSearch(e.target.value)}
                        className="mb-2 rounded-full px-3 bg-white border-none shadow text-gray-900 font-semibold w-full h-8 text-sm"
                      />
                      {filteredSkills.map((skill) => (
                        <div key={skill.id} className="flex items-center gap-2 py-1">
                          <Checkbox
                            checked={selectedSkills.includes(skill.id)}
                            onCheckedChange={() =>
                              toggleMultiSelect(skill.id, selectedSkills, setSelectedSkills)
                            }
                            id={`skill-${skill.id}`}
                          />
                          <Label htmlFor={`skill-${skill.id}`}>{skill.name}</Label>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>
                {/* Expertise Multi-Select */}
                <div className="flex flex-col items-start min-w-[140px]">
                  <Label className="text-xs text-gray-500 mb-1 ml-1">Expertise Area</Label>
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        variant="outline"
                        className="rounded-full min-w-[140px] h-9 px-6 bg-white border-none shadow text-foreground font-semibold w-full justify-between"
                      >
                        {selectedExpertise.length > 0 ? (
                          selectedExpertise.length.toString()
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="bg-white rounded-lg shadow p-2 w-64"
                      sideOffset={5}
                      align="start"
                    >
                      {expertiseAreas.map((ea) => (
                        <div key={ea.id} className="flex items-center gap-2 py-1">
                          <Checkbox
                            checked={selectedExpertise.includes(ea.id)}
                            onCheckedChange={() =>
                              toggleMultiSelect(ea.id, selectedExpertise, setSelectedExpertise)
                            }
                            id={`expertise-${ea.id}`}
                          />
                          <Label htmlFor={`expertise-${ea.id}`}>{ea.name}</Label>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>
                {/* Languages Multi-Select */}
                <div className="flex flex-col items-start min-w-[140px]">
                  <Label className="text-xs text-gray-500 mb-1 ml-1">Languages</Label>
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        variant="outline"
                        className="rounded-full min-w-[140px] h-9 px-6 bg-white border-none shadow text-foreground font-semibold w-full justify-between"
                      >
                        {selectedLanguages.length > 0 ? (
                          (() => {
                            const firstLang = languages.find((l) => l.id === selectedLanguages[0]);
                            const firstName = firstLang ? firstLang.name : '';
                            return selectedLanguages.length === 1
                              ? firstName
                              : `${firstName}, +${(selectedLanguages.length - 1).toString()}`;
                          })()
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="bg-white rounded-lg shadow p-2 w-64"
                      sideOffset={5}
                      align="start"
                    >
                      <Input
                        placeholder="Search languages..."
                        value={languageSearch}
                        onChange={(e) => setLanguageSearch(e.target.value)}
                        className="mb-2 rounded-full px-3 bg-white border-none shadow text-gray-900 font-semibold w-full h-8 text-sm"
                      />
                      {filteredLanguages.map((lang) => (
                        <div key={lang.id} className="flex items-center gap-2 py-1">
                          <Checkbox
                            checked={selectedLanguages.includes(lang.id)}
                            onCheckedChange={() =>
                              toggleMultiSelect(lang.id, selectedLanguages, setSelectedLanguages)
                            }
                            id={`lang-${lang.id}`}
                          />
                          <Label htmlFor={`lang-${lang.id}`}>{lang.name}</Label>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>
                {/* Min Availability Input */}
                <div className="flex flex-col items-start min-w-[80px] max-w-[100px]">
                  <Label className="text-xs text-gray-500 mb-1 ml-1">Min Availability</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={
                      minAvailability !== undefined && !isNaN(minAvailability)
                        ? minAvailability.toString()
                        : ''
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setMinAvailability(undefined);
                      } else {
                        const numValue = Number(value);
                        if (!isNaN(numValue) && numValue >= 0) {
                          setMinAvailability(numValue);
                        }
                      }
                    }}
                    className="rounded-full h-9 px-3 bg-white border-none shadow text-gray-900 font-semibold w-full text-sm"
                    placeholder=""
                  />
                </div>
                {/* Salary Max */}
                <div className="flex flex-col items-start min-w-[80px] max-w-[100px]">
                  <Label className="text-xs text-gray-500 mb-1 ml-1">Max Salary</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={salaryMax !== undefined && !isNaN(salaryMax) ? salaryMax.toString() : ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setSalaryMax(undefined);
                      } else {
                        const numValue = Number(value);
                        if (!isNaN(numValue) && numValue >= 0) {
                          setSalaryMax(numValue);
                        }
                      }
                    }}
                    className="rounded-full h-9 px-3 bg-white border-none shadow text-gray-900 font-semibold w-full text-sm"
                    placeholder=""
                  />
                </div>
                {/* Location Input */}
                <div className="flex flex-col items-start min-w-[120px]">
                  <Label className="text-xs text-gray-500 mb-1 ml-1">Location</Label>
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="rounded-full px-6 bg-white border-none shadow text-gray-900 font-semibold"
                    placeholder=""
                  />
                </div>
              </div>
            </div>
            {/* Retiree-List */}
            <div className="space-y-4">
              {Boolean(error) && <div>Error loading retirees.</div>}
              {!error && filteredRetirees.length === 0 && (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="w-16 h-16 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No retirees found</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Try expanding your search criteria or adjusting your filters to find more
                      candidates.
                    </p>
                    <Button
                      variant="outline"
                      className="rounded-full px-6 bg-secondary border-none shadow text-primary font-semibold hover:bg-secondary/70"
                      onClick={resetFilters}
                      type="button"
                    >
                      Clear all filters
                    </Button>
                  </div>
                </div>
              )}
              {!error &&
                filteredRetirees.map((retiree) => (
                  <a key={retiree.id} href={`/retiree/public/${retiree.id}`} className="block">
                    <BrowseRetireesResultItemCard
                      retiree={retiree}
                      skills={skills}
                      languages={languages}
                      expertiseAreas={expertiseAreas}
                      getMostRecentCareerElement={getMostRecentCareerElement}
                    />
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default BrowseRetirees;
