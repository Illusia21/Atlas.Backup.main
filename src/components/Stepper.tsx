interface Step {
    label: string;
}

interface StepperProps {
    steps: Step[];
    currentStep?: number;
}

const Stepper = ({ steps, currentStep = 1 }: StepperProps) => {
    return (
        <div className="flex items-start justify-between w-full max-w-[900px] mx-auto py-[20px] pl-[calc((100%/10)/2)]">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber <= currentStep;
                const isLastStep = index === steps.length - 1;

                return (
                    <div
                        key={stepNumber}
                        className="flex flex-col items-center relative flex-1"
                    >
                        {/* Leading Line - before first step */}
                        {index === 0 && (
                            <div
                                className={`
                                    absolute top-[30px] right-[calc(-50%+30px)] left-[calc(-50%+30px)] h-[2px]
                                    ${currentStep >= 1 ? 'bg-[#114B9F]' : 'bg-[#b1b1b1]'}
                                `}
                            />
                        )}

                        {/* Connector Line - positioned to connect circles */}
                        {!isLastStep && (
                            <div
                                className={`
                                    absolute top-[30px] left-[calc(50%+30px)] right-[calc(-50%+30px)] h-[2px]
                                    ${stepNumber < currentStep ? 'bg-[#114B9F]' : 'bg-[#b1b1b1]'}
                                `}
                            />
                        )}

                        {/* Circle */}
                        <div
                            className={`
                                w-[60px] h-[60px] rounded-full flex items-center justify-center z-10
                                ${isActive
                                    ? 'bg-[#114B9F]'
                                    : 'bg-white border-2 border-[#b1b1b1]'
                                }
                            `}
                        >
                            <span
                                className={`
                                    font-['Montserrat'] font-bold text-[24px] leading-[32px]
                                    ${isActive ? 'text-white' : 'text-[#b1b1b1]'}
                                `}
                            >
                                {stepNumber}
                            </span>
                        </div>

                        {/* Label */}
                        <span className="mt-2 font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43] text-center max-w-[100px]">
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default Stepper;