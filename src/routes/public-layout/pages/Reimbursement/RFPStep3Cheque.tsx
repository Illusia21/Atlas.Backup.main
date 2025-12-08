import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight, Info, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/selectRFPStep3";

// Simple form components
const FormField = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  error?: string; 
  className?: string;
}) => (
  <div className={className}>
    {children}
  </div>
);

const FormLabel = ({ 
  htmlFor, 
  children, 
  className 
}: { 
  htmlFor?: string; 
  children: React.ReactNode; 
  className?: string;
}) => (
  <label htmlFor={htmlFor} className={className}>
    {children}
  </label>
);

const FormError = ({ message }: { message?: string }) => (
  message ? <p className="text-[#E50019] text-[12px] mt-1">{message}</p> : null
);

const step3BankSchema = z.object({
  modeOfPayment: z.string().min(1, "Mode of Payment is required"),
  termsOfPayment: z.string().min(1, "Terms of Payment is required"),
  taxRegistration: z.string().min(1, "Tax Registration is required"),
  typeOfBusiness: z.string().min(1, "Type of Business is required"),
  bankName: z.string().min(1, "Bank Name is required"),
  accountName: z.string().min(1, "Account Name is required"),
  accountNumber: z.string().min(1, "Account Number is required"),
  instructions: z.string().optional(),
  poType: z.enum(["PO", "Non-PO"]).optional(),
  pr: z.string().optional(),
  rr: z.string().optional(),
  serviceFee: z.string().optional(),
  lessEWT: z.string().optional(),
});

type Step3BankFormData = z.infer<typeof step3BankSchema>;

// Dummy draft data
const dummyDraft = {
  modeOfPayment: "cheque",
  totalAmount: 0,
  currency: "PHP",
};

export default function Step3Cheque() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const draft = dummyDraft; // Using dummy data
  const draftLoading = false;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    trigger,
    setValue,
  } = useForm<Step3BankFormData>({
    resolver: zodResolver(step3BankSchema),
    mode: "onChange",
    defaultValues: {
      modeOfPayment: "cheque",
      termsOfPayment: "",
      taxRegistration: "",
      typeOfBusiness: "",
      bankName: "",
      accountName: "",
      accountNumber: "",
      instructions: "",
      poType: undefined,
      pr: "",
      rr: "",
      serviceFee: "",
      lessEWT: "",
    },
  });

  const poType = watch("poType");
  const isPO = poType === "PO";

  const modeOfPaymentValue = watch("modeOfPayment");
  const termsOfPaymentValue = watch("termsOfPayment");
  const taxRegistrationValue = watch("taxRegistration");
  const typeOfBusinessValue = watch("typeOfBusiness");
  const bankNameValue = watch("bankName");
  const accountNameValue = watch("accountName");
  const accountNumberValue = watch("accountNumber");

  // Navigate to different step3 components based on Mode of Payment
  useEffect(() => {
    if (modeOfPaymentValue === "bank-transfer" && id) {
      navigate(`/reimbursement/step3-bank/${id}`, { replace: true });
    } else if (modeOfPaymentValue === "cash" && id) {
      navigate(`/reimbursement/step3/${id}`, { replace: true });
    }
  }, [modeOfPaymentValue, id, navigate]);

  const serviceFee = watch("serviceFee") || "";
  const lessEWT = watch("lessEWT") || "";
  // Get total amount from draft data (from step 2), default to 0 if not available
  const totalAmount = draft.totalAmount || 0;

  const serviceFeeNum = serviceFee ? parseFloat(serviceFee) : 0;
  const lessEWTNum = lessEWT ? parseFloat(lessEWT) : 0;
  const calculatedTotal = Math.max(0, totalAmount + serviceFeeNum - lessEWTNum);

  const onSubmit = async (data: Step3BankFormData) => {
    if (!isValid) {
      // Trigger validation to show all errors
      await trigger();
      return;
    }
    
    console.log("Step 3 Cheque data:", data);
   
    if (id) {
      navigate(`/reimbursement/step4/${id}`);
    }
  };

  const handleBack = () => {
    if (id) {
      navigate(`/reimbursement/step2/${id}`);
    }
  };

  if (draftLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="bg-[#F3F3F3] box-border gap-[20px] grid grid-cols-3 grid-rows-[170px_40px_minmax(0,_1fr)_70px] overflow-clip p-[30px] relative shrink-0"
      style={{ minHeight: "100vh" }}
    >
      {/* STEP PROGRESS - Centered */}
      <div className="col-[1_/_span_3] row-[1] flex justify-center items-center relative mb-[75px] mx-auto">
        <div className="relative w-[1240px]">
          <div className="absolute inset-0 flex flex-col items-center justify-start">
            {/* Step circles + connecting lines */}
            <div className="flex items-center justify-center gap-[0px] mt-[10px]">
              {/* Step 1 - Completed */}
              <div className="relative shrink-0 size-[60px]">
                <div className="absolute left-0 size-[60px] top-0 bg-[#114B9F] rounded-full flex items-center justify-center">
                  <div className="flex flex-col font-['Montserrat',sans-serif] font-bold h-[60px] justify-center text-[24px] text-[#FCFCFC] text-center">
                    <p className="leading-[32px]">1</p>
                  </div>
                </div>
              </div>

              {/* Steps 2–5 */}
              {[2, 3, 4, 5].map((num) => (
                <React.Fragment key={num}>
                  <div className="h-0 relative shrink-0 w-[100px]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`h-[2px] w-full ${
                          num === 2 || num === 3 ? "bg-[#114B9F]" : "bg-[#B1B1B1]"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="relative shrink-0 size-[60px]">
                    <div className={`absolute left-0 size-[60px] top-0 ${
                      num === 3 
                        ? "bg-[#114B9F]" 
                        : num === 2
                        ? "bg-[#114B9F]"
                        : "bg-[#FCFCFC] border border-[#B1B1B1]"
                    } rounded-full flex items-center justify-center`}>
                      <div className={`flex flex-col font-['Montserrat',sans-serif] font-bold justify-center text-[24px] ${
                        num === 3 || num === 2 ? "text-[#FCFCFC]" : "text-[#B1B1B1]"
                      } text-center`}>
                        <p className="leading-[32px]">{num}</p>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Step Labels - Below step progress, auto-centered */}
            <div className="flex items-start justify-center gap-[0px] mt-[10px] w-full">
              {/* Step 1 Label */}
              <div className="text-[14px] text-[#001C43] font-['Montserrat',sans-serif] text-center" style={{ width: '60px' }}>
                <p>Requester Information</p>
              </div>

              {/* Labels for Steps 2–5 */}
              {[
                { label: "Request Details", width: '100px' },
                { label: ["Payment Terms", "& Schedule"], width: '100px'},
                { label: ["Supporting", "Documents"], width: '100px' },
                { label: "Review & Submit", width: '100px' },
              ].map(({ label, width }, index) => (
                <React.Fragment key={index}>
                  <div style={{ width }}></div>
                  <div className="text-[14px] text-[#001C43] font-['Montserrat',sans-serif] text-center" style={{ width: '60px' }}>
                    {Array.isArray(label) ? (
                      <div className="flex flex-col items-center gap-[2px]">
                        <p className="mb-0 whitespace-nowrap">{label[0]}</p>
                        <p className="mt-0 whitespace-nowrap">{label[1]}</p>
                      </div>
                    ) : (
                      <p className="whitespace-nowrap">{label}</p>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div
        className="col-[1] row-[2] flex items-center gap-[20px]"
        style={{
          color: "#001C43",
          textAlign: "center",
          fontFamily: "Montserrat, sans-serif",
          fontSize: "32px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "40px",
        }}
      >
        <p>Step 3</p>
        <p
          style={{
            fontSize: "24px",
            lineHeight: "32px",
            margin: 0,
          }}
        >
          Payment Terms & Schedule
        </p>
      </div>

      {/* Info Button */}
      <div className="col-[3] row-[2] flex items-center justify-end">
        <div className="bg-white w-[40px] h-[40px] flex items-center justify-center rounded-[10px] shadow-[1px_0px_4px_rgba(0,0,0,0.25)]">
          <Info className="w-[24px] h-[24px] text-[#E50019]" />
        </div>
      </div>

      {/* FORM CARD */}
      <form
        id="step3-cheque-form"
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#FCFCFC] col-[1_/_span_3] row-[3] p-[20px] flex flex-col gap-[30px] rounded-[20px]"
      >
        <div className="px-3">
          <h3 className="font-['Montserrat',sans-serif] font-bold text-[24px] text-[#001C43] leading-[32px] mt-[-10px]">
            Payment Schedule
          </h3>
        </div>

        {/* Top row - Four fields aligned horizontally */}
        <div className="grid grid-cols-4 gap-[30px] px-5 min-w-0">
          {/* Mode of Payment */}
          <FormField error={errors.modeOfPayment?.message} className="gap-[10px] mt-[-20px] font-[700]">
            <FormLabel>Mode of Payment</FormLabel>
            <Select
              value={modeOfPaymentValue || ""}
              onValueChange={(value: string) => {
                setValue("modeOfPayment", value, { shouldValidate: true });
              }}
            >
              <SelectTrigger className={`w-full h-[46px] rounded-[10px] shadow-[0px_1px_2px_rgba(0,0,0,0.08)] font-normal ${
                errors.modeOfPayment
                  ? "border-[#E50019] focus:ring-[#E50019]"
                  : "border-[#E4E4E7]"
              }`}>
                <SelectValue placeholder="Select Mode of Payment" className="font-normal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
            <FormError message={errors.modeOfPayment?.message} />
          </FormField>

          {/* Terms of Payment */}
          <FormField error={errors.termsOfPayment?.message} className="gap-[10px] mt-[-20px] font-[700]">
            <FormLabel>Terms of Payment</FormLabel>
            <Select
              value={termsOfPaymentValue || ""}
              onValueChange={(value: string) => {
                setValue("termsOfPayment", value, { shouldValidate: true });
              }}
            >
              <SelectTrigger className={`w-full h-[46px] rounded-[10px] shadow-[0px_1px_2px_rgba(0,0,0,0.08)] font-normal ${
                errors.termsOfPayment
                  ? "border-[#E50019] focus:ring-[#E50019]"
                  : "border-[#E4E4E7]"
              }`}>
                <SelectValue placeholder="Select Term of Payment" className="font-normal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="installment">Installment</SelectItem>
                <SelectItem value="full-payment">Full Payment</SelectItem>
              </SelectContent>
            </Select>
            <FormError message={errors.termsOfPayment?.message} />
          </FormField>

          {/* Tax Registration */}
          <FormField error={errors.taxRegistration?.message} className="gap-[10px] mt-[-20px] font-[700]">
            <FormLabel>Tax Registration</FormLabel>
            <Select
              value={taxRegistrationValue || ""}
              onValueChange={(value: string) => {
                setValue("taxRegistration", value, { shouldValidate: true });
              }}
            >
              <SelectTrigger className={`w-full h-[46px] rounded-[10px] shadow-[0px_1px_2px_rgba(0,0,0,0.08)] font-normal ${
                errors.taxRegistration
                  ? "border-[#E50019] focus:ring-[#E50019]"
                  : "border-[#E4E4E7]"
              }`}>
                <SelectValue placeholder="Select Tax Registration" className="font-normal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vat">VAT</SelectItem>
                <SelectItem value="non-vat">Non-Vat</SelectItem>
              </SelectContent>
            </Select>
            <FormError message={errors.taxRegistration?.message} />
          </FormField>

          {/* Type of Business */}
          <FormField error={errors.typeOfBusiness?.message} className="gap-[10px] mt-[-20px] font-[700]">
            <FormLabel>Type of Business</FormLabel>
            <Select
              value={typeOfBusinessValue || ""}
              onValueChange={(value: string) => {
                setValue("typeOfBusiness", value, { shouldValidate: true });
              }}
            >
              <SelectTrigger className={`w-full h-[46px] rounded-[10px] shadow-[0px_1px_2px_rgba(0,0,0,0.08)] font-normal ${
                errors.typeOfBusiness
                  ? "border-[#E50019] focus:ring-[#E50019]"
                  : "border-[#E4E4E7]"
              }`}>
                <SelectValue placeholder="Select Type of Business" className="font-normal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="goods">Goods</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="honorarium-5">Honorarium 5%</SelectItem>
                <SelectItem value="honorarium-10">Honorarium 10%</SelectItem>
              </SelectContent>
            </Select>
            <FormError message={errors.typeOfBusiness?.message} />
          </FormField>
        </div>

        <div className="grid grid-cols-3 gap-[24px] px-5">
          <FormField error={errors.bankName?.message} className="gap-[8px] col-span-1 w-[530px] h-[40px]">
            <FormLabel className="font-[700]">Bank Name</FormLabel>
            <Input {...register("bankName")} placeholder="ex" className="h-[46px]" />
            <FormError message={errors.bankName?.message} />
          </FormField>

          <FormField error={errors.accountName?.message} className="gap-[8px] w-[400px] h-[40px] ml-[90px]">
            <FormLabel className="font-[700]">Account Name</FormLabel>
            <Input {...register("accountName")} placeholder="ex" className="h-[46px]" />
            <FormError message={errors.accountName?.message} />
          </FormField>

          <FormField error={errors.accountNumber?.message} className="gap-[8px] w-[400px] h-[40px]">
            <FormLabel className="font-[700]">Account Number</FormLabel>
            <Input {...register("accountNumber")} placeholder="ex" className="h-[46px]" />
            <FormError message={errors.accountNumber?.message} />
          </FormField>
        </div>

        <div className="px-5 mt-[40px]">
          <FormField error={errors.instructions?.message} className="gap-[8px] w-[630px] h-[40px]">
            <FormLabel className="font-[700]">Instructions</FormLabel>
            <Input {...register("instructions")} placeholder="Enter instructions" className="h-[46px]" />
            <FormError message={errors.instructions?.message} />
          </FormField>
        </div>

        <div className="grid grid-cols-[minmax(0,_1fr)_320px] gap-[40px] px-5 items-start">
          {/* Left column - PO/Non-PO and related fields */}
          <div className="flex flex-col gap-[60px] mt-[120px]">
            {/* PO/Non-PO Radio Buttons */}
            <FormField className="gap-[10px]">
              <div className="flex flex-col gap-[20px]">
                <div className="flex items-center gap-[10px]">
                  <input
                    type="radio"
                    id="bankPoTypePO"
                    value="PO"
                    {...register("poType")}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label
                    htmlFor="bankPoTypePO"
                    className="font-['Montserrat',sans-serif] font-[600] text-[16px] text-[#001C43] leading-none tracking-[-0.32px] cursor-pointer"
                  >
                    PO
                  </label>
                </div>
                <div className="flex items-center gap-[10px]">
                  <input
                    type="radio"
                    id="bankPoTypeNonPO"
                    value="Non-PO"
                    {...register("poType")}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label
                    htmlFor="bankPoTypeNonPO"
                    className="font-['Montserrat',sans-serif] font-[600] text-[16px] text-[#001C43] leading-none tracking-[-0.32px] cursor-pointer"
                  >
                    Non-PO
                  </label>
                </div>
              </div>
            </FormField>

            {/* PR and RR Fields */}
            <div className="grid grid-cols-2 gap-[-900px]">
              <FormField error={errors.pr?.message} className="gap-[6px] w-[487px]">
                <FormLabel className="font-[700]">PR</FormLabel>
                <Input
                  {...register("pr")}
                  placeholder="ex"
                  className="w-full h-[40px] rounded-md border border-[#E4E4E7] px-3 py-[10px]"
                  disabled={!isPO}
                />
                <FormError message={errors.pr?.message} />
              </FormField>

              <FormField error={errors.rr?.message} className="gap-[6px] w-[487px] ml-[-300px]">
                <FormLabel className="font-[700]">RR</FormLabel>
                <Input
                  {...register("rr")}
                  placeholder="ex"
                  className="w-full h-[40px] rounded-md border border-[#E4E4E7] px-3 py-[10px]"
                  disabled={!isPO}
                />
                <FormError message={errors.rr?.message} />
              </FormField>
            </div>
          </div>

          {/* Right column - Payment summary */}
          <div className="flex flex-col gap-[16px] w-full max-w-[320px] justify-self-end mt-[100px]">
            <div className="flex items-center justify-between mt-[3px]">
              <p className="font-['Montserrat',sans-serif] font-[700] text-[14px] text-[#001C43] leading-[20px]">
                Total Amount:
              </p>
              <p className="font-['Montserrat',sans-serif] font-[700] text-[14px] text-[#001C43] leading-[20px] mr-[170px]">
                {draft.currency || "PHP"}
              </p>
            </div>

            <div className="flex flex-col gap-[14px]">
              <div className="flex items-center gap-[12px]">
                <p className="font-['Montserrat',sans-serif] font-[700] text-[16px] text-[#001C43] leading-none tracking-[-0.32px] w-[110px]">
                  Service Fee:
                </p>
                <Input
                  {...register("serviceFee")}
                  placeholder="PHP"
                  className="flex-1"
                />
              </div>

              <div className="flex items-center gap-[12px]">
                <p className="font-['Montserrat',sans-serif] font-[700] text-[16px] text-[#001C43] leading-none tracking-[-0.32px] w-[110px]">
                  Less EWT:
                </p>
                <Input
                  {...register("lessEWT")}
                  placeholder="PHP"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="relative overflow-visible">
              <div className="w-[320px] h-[3px] bg-[#B1B1B1] relative left-[0px]"></div>
            </div>

            <div className=" w-[300px] h-[39px] bg-[#114B9F] rounded-bl-[12px] rounded-br-[12px] px-0 py-[12px]">
              <p className="font-['Montserrat',sans-serif] font-[700] text-[#FFFFFF] leading-[24px] ml-[20px]">
                <span className="text-[12px]">Total Amount</span>
                <span className="text-[14px]">{`: `}</span>
                <span className="text-[18px]">
                  {draft.currency || "PHP"}{" "}
                  {calculatedTotal.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* Action buttons */}
      <div className="col-[3] row-[4] grid grid-cols-2 gap-[30px] justify-self-end w-[293px] mt-[30px]">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={isSubmitting}
          className="w-[137px] gap-[7px] justify-self-center"
        >
          <ArrowRight className="w-[20px] h-[20px] rotate-180 text-[#001C43]" />
          <span>Back</span>
        </Button>
        <Button
          type="submit"
          form="step3-cheque-form"
          disabled={isSubmitting || !isValid}
          className="w-[137px] gap-[7px] justify-self-center"
        >
          <span>Next</span>
          <ChevronRight className="size-[24px]" />
        </Button>
      </div>
    </div>
  );
}