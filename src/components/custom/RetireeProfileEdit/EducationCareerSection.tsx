import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import type {
  Control,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from 'react-hook-form';
const normalizeString = (value: string | null | undefined) => value ?? '';
// Safely formats a Date instance or ISO‑8601 string for the `<input type="date" />` value prop
const formatDate = (v: Date | string | null | undefined) =>
  v ? (v instanceof Date ? v : new Date(v)).toISOString().split('T')[0] : '';
import type { Retiree, CareerElement, Degree } from '@/api/openapi-client/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GraduationCap, Plus, Trash2, X } from 'lucide-react';

interface EducationCareerSectionProps {
  control: Control<Retiree>;
  register: UseFormRegister<Retiree>;
  fields: FieldArrayWithId<Retiree, 'careerElements'>[];
  append: UseFieldArrayAppend<Retiree, 'careerElements'>;
  remove: UseFieldArrayRemove;
  careerElements: CareerElement[];
  degrees: Degree[];
}

const EducationCareerSection: React.FC<EducationCareerSectionProps> = ({
  register,
  control,
  fields,
  append,
  remove,
  careerElements,
  degrees,
}) => {
  const [degreeSearch, setDegreeSearch] = useState('');
  const [currSearchedElementIndex, setCurrSearchedElementIndex] = useState(-1);

  const educations = careerElements
    .map((ce, idx) => ({ ...ce, idx }))
    .filter((ce) => ce.kind === 'education');

  // filter degrees types based on search term
  const filteredDegrees = degrees.filter((degree) =>
    degree.title.toLowerCase().includes(degreeSearch.toLowerCase()),
  );

  // Validation rules for education
  const educationRules = {
    title: {
      required: 'Title is required',
      minLength: { value: 2, message: 'Title must be at least 2 characters' },
    },
    organizationName: {
      required: 'Institution is required',
      minLength: { value: 2, message: 'Institution must be at least 2 characters' },
    },
    degree: { required: 'Degree type is required' },
    fromDate: {
      required: 'From date is required',
    },
    untilDate: {
      required: 'Until date is required',
    },
    finalGrade: {},
    description: {
      maxLength: { value: 500, message: 'Description must be below 500 characters' },
    },
  };

  // Function to create date validation rules for specific indices
  const getDateValidationRules = (idx: number) => ({
    fromDate: {
      ...educationRules.fromDate,
      validate: (value: Date | null | undefined) => {
        if (!value) return 'From date is required';
        const untilDate = careerElements[idx]?.untilDate;
        if (untilDate && value > untilDate) {
          return 'From date must be before until date';
        }
        return true;
      },
    },
    untilDate: {
      ...educationRules.untilDate,
      validate: (value: Date | null | undefined) => {
        if (!value) return 'Until date is required';
        const fromDate = careerElements[idx]?.fromDate;
        if (fromDate && value < fromDate) {
          return 'Until date must be after from date';
        }
        return true;
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Education Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {educations.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              No education entries yet. Click the button below to add one.
            </p>
          )}

          {educations.map(({ idx }) => (
            <Card key={idx} className="relative border-l-4 border-l-primary">
              <CardContent className="pt-6 space-y-4">
                {fields[idx].id && (
                  <input
                    type="hidden"
                    defaultValue={fields[idx].id}
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    {...register(`careerElements.${idx}.id` as const)}
                  />
                )}
                <input
                  type="hidden"
                  defaultValue="education"
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  {...register(`careerElements.${idx}.kind` as const)}
                />

                {/* Title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      htmlFor={`careerElements.${idx}.title`}
                    >
                      Title
                    </Label>
                    <Controller
                      control={control}
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      name={`careerElements.${idx}.title` as const}
                      defaultValue={careerElements[idx].title}
                      rules={educationRules.title}
                      render={({
                        field: { value, onChange, onBlur, name },
                        fieldState: { error },
                      }) => (
                        <>
                          <Input
                            name={name}
                            value={normalizeString(value)}
                            onChange={(e) => onChange(e.target.value)}
                            onBlur={onBlur}
                            placeholder="e.g. Information Technology"
                            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                            id={`careerElements.${idx}.title`}
                          />
                          {error && (
                            <span className="text-destructive text-xs">{error.message}</span>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      htmlFor={`careerElements.${idx}.organizationName`}
                    >
                      Institution
                    </Label>
                    <Controller
                      control={control}
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      name={`careerElements.${idx}.organizationName` as const}
                      defaultValue={careerElements[idx].organizationName}
                      rules={educationRules.organizationName}
                      render={({
                        field: { value, onChange, onBlur, name },
                        fieldState: { error },
                      }) => (
                        <>
                          <Input
                            name={name}
                            value={normalizeString(value)}
                            onChange={(e) => onChange(e.target.value)}
                            onBlur={onBlur}
                            placeholder="University Name"
                            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                            id={`careerElements.${idx}.organizationName`}
                          />
                          {error && (
                            <span className="text-destructive text-xs">{error.message}</span>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>

                {/* Degree Type Searchable Dropdown */}
                <div className="space-y-2">
                  <Label
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    htmlFor={`careerElements.${idx}.degree`}
                  >
                    Degree Type
                  </Label>
                  <Controller
                    control={control}
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    name={`careerElements.${idx}.degree` as const}
                    defaultValue={careerElements[idx].degree ?? ''}
                    rules={educationRules.degree}
                    render={({ field: { onChange, value }, fieldState: { error } }) => {
                      const selectedDegree = degrees.find((d) => d.id === value);
                      return (
                        <div className="space-y-2">
                          {/* Display selected degree */}
                          {selectedDegree && (
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant="secondary"
                                className="flex items-center gap-1 px-3 py-1.5 text-sm"
                              >
                                <span>{selectedDegree.title}</span>
                                <button
                                  type="button"
                                  onClick={() => onChange('')}
                                  className="cursor-pointer ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            </div>
                          )}

                          {/* Search input */}
                          <div className="space-y-2">
                            <Input
                              id={`degree-search-${idx.toString()}`}
                              type="text"
                              value={idx === currSearchedElementIndex ? degreeSearch : ''}
                              onChange={(e) => {
                                setCurrSearchedElementIndex(idx);
                                setDegreeSearch(e.target.value);
                              }}
                              placeholder="Search for your degree type..."
                              className="w-full text-sm"
                            />
                          </div>

                          {/* Search results */}
                          {degreeSearch && idx === currSearchedElementIndex && (
                            <ScrollArea className="h-32 border rounded-md p-2">
                              <div className="space-y-1">
                                {filteredDegrees.map((degree) => {
                                  const isSelected = value === degree.id;
                                  return (
                                    <div
                                      key={degree.id}
                                      onClick={() => {
                                        onChange(degree.id);
                                        setDegreeSearch('');
                                      }}
                                      className={`p-2 rounded transition-colors text-sm ${
                                        isSelected
                                          ? 'bg-primary/10 text-primary font-medium'
                                          : 'hover:bg-accent hover:text-accent-foreground cursor-pointer'
                                      }`}
                                    >
                                      {degree.title}
                                    </div>
                                  );
                                })}

                                {filteredDegrees.length === 0 && (
                                  <div className="p-2 text-muted-foreground text-center text-sm">
                                    No matching degree types found
                                  </div>
                                )}
                              </div>
                            </ScrollArea>
                          )}

                          {error && (
                            <span className="text-destructive text-xs">{error.message}</span>
                          )}
                        </div>
                      );
                    }}
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      htmlFor={`careerElements.${idx}.fromDate`}
                    >
                      From Date
                    </Label>
                    <Controller
                      control={control}
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      name={`careerElements.${idx}.fromDate` as const}
                      defaultValue={careerElements[idx].fromDate}
                      rules={getDateValidationRules(idx).fromDate}
                      render={({ field: { value, onChange, ...rest }, fieldState: { error } }) => (
                        <>
                          <Input
                            type="date"
                            value={formatDate(value)}
                            onChange={(e) =>
                              onChange(e.target.value ? new Date(e.target.value) : null)
                            }
                            {...rest}
                            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                            id={`careerElements.${idx}.fromDate`}
                          />
                          {error && (
                            <span className="text-destructive text-xs">{error.message}</span>
                          )}
                        </>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      htmlFor={`careerElements.${idx}.untilDate`}
                    >
                      Until Date
                    </Label>
                    <Controller
                      control={control}
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      name={`careerElements.${idx}.untilDate` as const}
                      defaultValue={careerElements[idx].untilDate ?? null}
                      rules={getDateValidationRules(idx).untilDate}
                      render={({ field: { value, onChange, ...rest }, fieldState: { error } }) => (
                        <>
                          <Input
                            type="date"
                            value={formatDate(value)}
                            onChange={(e) =>
                              onChange(e.target.value ? new Date(e.target.value) : null)
                            }
                            {...rest}
                            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                            id={`careerElements.${idx}.untilDate`}
                          />
                          {error && (
                            <span className="text-destructive text-xs">{error.message}</span>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>

                {/* Final Grade */}
                <div className="space-y-2">
                  <Label
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    htmlFor={`careerElements.${idx}.finalGrade`}
                  >
                    Final Grade
                  </Label>
                  <Controller
                    control={control}
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    name={`careerElements.${idx}.finalGrade` as const}
                    defaultValue={careerElements[idx].finalGrade ?? ''}
                    rules={educationRules.finalGrade}
                    render={({
                      field: { value, onChange, onBlur, name },
                      fieldState: { error },
                    }) => (
                      <>
                        <Input
                          name={name}
                          value={normalizeString(value)}
                          onChange={(e) => onChange(e.target.value)}
                          onBlur={onBlur}
                          placeholder="Grade"
                          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                          id={`careerElements.${idx}.finalGrade`}
                        />
                        {error && <span className="text-destructive text-xs">{error.message}</span>}
                      </>
                    )}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    htmlFor={`careerElements.${idx}.description`}
                  >
                    Description
                  </Label>
                  <Controller
                    control={control}
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    name={`careerElements.${idx}.description` as const}
                    defaultValue={careerElements[idx].description ?? ''}
                    rules={educationRules.description}
                    render={({
                      field: { value, onChange, onBlur, name },
                      fieldState: { error },
                    }) => (
                      <>
                        <Textarea
                          name={name}
                          value={normalizeString(value)}
                          onChange={(e) => onChange(e.target.value)}
                          onBlur={onBlur}
                          placeholder="Describe your studies, achievements, etc."
                          className="min-h-[80px] resize-none"
                          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                          id={`careerElements.${idx}.description`}
                        />
                        {error && <span className="text-destructive text-xs">{error.message}</span>}
                      </>
                    )}
                  />
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(idx)}
                  className="absolute top-4 right-4"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                id: 'NO_ID',
                kind: 'education',
                title: '',
                organizationName: '',
                fromDate: null,
                untilDate: null,
                description: '',
                finalGrade: '',
                degree: '',
              })
            }
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationCareerSection;
