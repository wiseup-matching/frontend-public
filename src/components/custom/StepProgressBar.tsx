import React from 'react';
import { Check } from 'lucide-react';

interface StepProgressBarProps {
  steps: {
    id: string;
    label: string;
    completed: boolean;
    error?: boolean;
    description?: string;
  }[];
  onStepClick: (id: string) => void;
  currentSection?: string;
  startIndex?: number;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({
  steps,
  onStepClick,
  currentSection,
  startIndex = 1,
}) => {
  return (
    <div
      className="hidden md:block sticky top-16 z-20 
      backdrop-blur 
      supports-[backdrop-filter]:bg-background/60 py-4 mb-4 progress-bar-container
      
      border border-[rgba(255,255,255,0.3)] bg-white/40 bg-clip-padding backdrop-filter backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] group rounded-xl
      
      "
    >
      <div className="md:block w-full">
        {/* Desktop & Tablet Layout */}
        <div className="md:flex items-center overflow-x-auto py-2 w-full">
          <div className="flex items-center justify-between w-full px-4">
            {steps.map((step, index) => {
              const stepNumber = index + startIndex;
              const isCurrent = step.id === currentSection;
              const isCompleted = step.completed;
              const isError = step.error;

              return (
                <div key={step.id} className="flex flex-col items-center shrink-0 ">
                  <button
                    type="button"
                    className={`
                      h-8 w-8 rounded-full flex items-center justify-center transition-colors border cursor-pointer transition-transform duration-200 hover:scale-[1.05] ease-out group
                      ${
                        isCompleted
                          ? 'bg-primary text-white border-primary'
                          : isCurrent
                            ? 'bg-primary/10 text-primary border-primary ring-2 ring-primary/40'
                            : isError
                              ? 'text-red-500 border-red-400'
                              : 'text-gray-500 bg-secondary'
                      }
                    `}
                    onClick={() => onStepClick(step.id)}
                  >
                    {isCompleted ? (
                      <Check size={12} />
                    ) : (
                      <span className="text-xs font-semibold">{stepNumber}</span>
                    )}
                  </button>

                  <span
                    className={`
                      mt-1 text-xs font-medium whitespace-nowrap
                      ${
                        isCurrent
                          ? 'text-primary'
                          : isCompleted
                            ? 'text-gray-700'
                            : isError
                              ? 'text-red-500'
                              : 'text-gray-500'
                      }
                    `}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepProgressBar;
