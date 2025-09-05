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
const formatDate = (v: Date | string | null | undefined) =>
  v ? (v instanceof Date ? v : new Date(v)).toISOString().split('T')[0] : '';
import type { Retiree, CareerElement, Position } from '@/api/openapi-client/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Briefcase, Plus, Trash2, X } from 'lucide-react';

interface JobCareerSectionProps {
  control: Control<Retiree>;
  register: UseFormRegister<Retiree>;
  fields: FieldArrayWithId<Retiree, 'careerElements'>[];
  append: UseFieldArrayAppend<Retiree, 'careerElements'>;
  remove: UseFieldArrayRemove;
  careerElements: CareerElement[];
  positions: Position[];
}

const JobCareerSection: React.FC<JobCareerSectionProps> = ({
  register,
  control,
  fields,
  append,
  remove,
  careerElements,
  positions,
}) => {
  const [positionSearch, setPositionSearch] = useState('');
  const [currSearchedElementIndex, setCurrSearchedElementIndex] = useState(-1);

  const jobs = careerElements.map((ce, idx) => ({ ...ce, idx })).filter((ce) => ce.kind === 'job');

  // filter job positions based on search term
  const filteredPositions = positions.filter((position) =>
    position.title.toLowerCase().includes(positionSearch.toLowerCase()),
  );

  // Validation rules for work experience
  const jobRules = {
    title: {
      required: 'Job title is required',
      minLength: { value: 2, message: 'Job title must be at least 2 characters' },
    },
    organizationName: {
      required: 'Company is required',
      minLength: { value: 2, message: 'Company must be at least 2 characters' },
    },
    position: { required: 'Job position is required' },
    fromDate: {
      required: 'From date is required',
    },
    untilDate: {
      required: 'Until date is required',
    },
    description: {
      maxLength: { value: 500, message: 'Description must be below 500 characters' },
    },
  };

  // Function to create date validation rules for specific indices
  const getDateValidationRules = (idx: number) => ({
    fromDate: {
      ...jobRules.fromDate,
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
      ...jobRules.untilDate,
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
      {/* Jobs Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Work Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {jobs.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              No job entries yet. Click the button below to add one.
            </p>
          )}

          {jobs.map(({ idx }) => (
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
                  defaultValue="job"
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  {...register(`careerElements.${idx}.kind` as const)}
                />

                {/* Title & Company */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      htmlFor={`careerElements.${idx}.title`}
                    >
                      Job Title
                    </Label>
                    <Controller
                      control={control}
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      name={`careerElements.${idx}.title` as const}
                      defaultValue={careerElements[idx].title}
                      rules={jobRules.title}
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
                            placeholder="Senior Developer"
                            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                            id={`careerElements.${idx}.title`}
                          />
                          {error && <span className="text-red-500 text-xs">{error.message}</span>}
                        </>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      htmlFor={`careerElements.${idx}.organizationName`}
                    >
                      Company
                    </Label>
                    <Controller
                      control={control}
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      name={`careerElements.${idx}.organizationName` as const}
                      defaultValue={careerElements[idx].organizationName}
                      rules={jobRules.organizationName}
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
                            placeholder="Company Name"
                            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                            id={`careerElements.${idx}.organizationName`}
                          />
                          {error && <span className="text-red-500 text-xs">{error.message}</span>}
                        </>
                      )}
                    />
                  </div>
                </div>

                {/* Job Position Searchable Dropdown */}
                <div className="space-y-2">
                  <Label
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    htmlFor={`careerElements.${idx}.position`}
                  >
                    Job Position
                  </Label>
                  <Controller
                    control={control}
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    name={`careerElements.${idx}.position` as const}
                    defaultValue={careerElements[idx].position ?? ''}
                    rules={jobRules.position}
                    render={({ field: { onChange, value }, fieldState: { error } }) => {
                      const selectedPosition = positions.find((p) => p.id === value);
                      return (
                        <div className="space-y-2">
                          {/* Display selected position */}
                          {selectedPosition && (
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant="secondary"
                                className="flex items-center gap-1 px-3 py-1.5 text-sm"
                              >
                                <span>{selectedPosition.title}</span>
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
                              id={`position-search-${idx.toString()}`}
                              type="text"
                              value={idx === currSearchedElementIndex ? positionSearch : ''}
                              onChange={(e) => {
                                setPositionSearch(e.target.value);
                                setCurrSearchedElementIndex(idx);
                              }}
                              placeholder="Search for your job position..."
                              className="w-full text-sm"
                            />
                          </div>

                          {/* Search results */}
                          {positionSearch && idx === currSearchedElementIndex && (
                            <ScrollArea className="h-32 border rounded-md p-2">
                              <div className="space-y-1">
                                {filteredPositions.map((position) => {
                                  const isSelected = value === position.id;
                                  return (
                                    <div
                                      key={position.id}
                                      onClick={() => {
                                        onChange(position.id);
                                        setPositionSearch('');
                                      }}
                                      className={`p-2 rounded transition-colors text-sm ${
                                        isSelected
                                          ? 'bg-primary/10 text-primary font-medium'
                                          : 'hover:bg-accent hover:text-accent-foreground cursor-pointer'
                                      }`}
                                    >
                                      {position.title}
                                    </div>
                                  );
                                })}

                                {filteredPositions.length === 0 && (
                                  <div className="p-2 text-muted-foreground text-center text-sm">
                                    No matching job positions found
                                  </div>
                                )}
                              </div>
                            </ScrollArea>
                          )}

                          {error && <span className="text-red-500 text-xs">{error.message}</span>}
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
                          {error && <span className="text-red-500 text-xs">{error.message}</span>}
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
                          {error && <span className="text-red-500 text-xs">{error.message}</span>}
                        </>
                      )}
                    />
                  </div>
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
                    rules={jobRules.description}
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
                          placeholder="Describe your responsibilities, achievements, etc."
                          className="min-h-[80px] resize-none"
                          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                          id={`careerElements.${idx}.description`}
                        />
                        {error && <span className="text-red-500 text-xs">{error.message}</span>}
                      </>
                    )}
                  />
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(idx)}
                  className="absolute top-4 right-4 bg-destructive hover:bg-destructive/90 text-sm"
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
                kind: 'job',
                title: '',
                organizationName: '',
                fromDate: null,
                untilDate: null,
                description: '',
                position: '', // default to empty; user will select
              })
            }
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Job
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobCareerSection;
