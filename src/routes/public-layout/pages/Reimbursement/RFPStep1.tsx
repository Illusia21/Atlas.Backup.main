import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { ChevronRight, Pencil, Info } from "lucide-react";
import CancelIcon from "@/assets/cancel.svg";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/selectRFPStep1";

// Dummy schema
const step1RequestorInfoSchema = z.object({
  requestedBy: z.string().min(1, "Requested by is required"),
  department: z.string().min(1, "Department is required"),
  departmentId: z.string().min(1, "Department is required"),
});

type Step1RequestorInfoFormData = z.infer<typeof step1RequestorInfoSchema>;

// Dummy user data
const dummyUser = {
  id: "user-1",
  fullName: "Aisha Nicole Dones",
  departmentId: "dept-1",
  department: "Finance",
};

// Dummy departments data
const dummyDepartments = [
  { id: "dept-1", name: "CCIS" },
  { id: "dept-2", name: "CAS" },
  { id: "dept-3", name: "CHS" },
  { id: "dept-4", name: "ATYCB" },
  { id: "dept-5", name: "CEA" },
];

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

export default function Step1MainLayout() {
  const navigate = useNavigate();
  const user = dummyUser; // Using dummy user data
  const departments = dummyDepartments; // Using dummy departments data
  const departmentsLoading = false;
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
    watch,
  } = useForm<Step1RequestorInfoFormData>({
    resolver: zodResolver(step1RequestorInfoSchema),
    mode: "onChange",
    defaultValues: {
      requestedBy: user?.fullName || "",
      department: "",
      departmentId: "",
    },
  });

  const selectedDepartmentId = watch("departmentId");

  useEffect(() => {
    if (user) {
      setValue("requestedBy", user.fullName);
      if (user.departmentId) {
        setValue("departmentId", user.departmentId);
        setValue("department", user.department || "");
      }
    }
  }, [user, setValue]);

  useEffect(() => {
    if (selectedDepartmentId && departments.length > 0) {
      const selectedDept = departments.find(
        (d: { id: string; name: string }) => d.id === selectedDepartmentId
      );
      if (selectedDept) {
        setValue("department", selectedDept.name);
      }
    }
  }, [selectedDepartmentId, departments, setValue]);

  const onSubmit = async (data: Step1RequestorInfoFormData) => {
    if (!user) return;
    
    // Validate that department is selected
    if (!data.departmentId || !data.department) {
      console.error("Please Select a Department to proceed");
      return;
    }
    
    // Dummy draft creation - simulate API call
    setIsCreatingDraft(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dummy draft data
      const draftData = {
        requestedBy: data.requestedBy,
        requestedById: user.id,
        department: data.department,
        departmentId: data.departmentId,
      };
      
      console.log("Draft created (dummy):", draftData);
      // Navigate to next step (dummy - you can implement actual navigation)
      // navigate("/reimbursement/step2");
    } catch (error) {
      console.error("Failed to create draft:", error);
    } finally {
      setIsCreatingDraft(false);
    }
  };

  const handleCancel = () => navigate("/");
  const isEditingRequestedBy = false;

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <div className="flex flex-col w-full">
        <Topbar pageTitle="Reimbursement Request" />
        <main className="flex-1 bg-[#F5F5F5]">
          <div
            className="bg-[#F3F3F3] box-border gap-[20px] grid grid-cols-3 grid-rows-[170px_40px_minmax(0,_1fr)_70px] overflow-clip p-[30px] relative shrink-0"
            style={{ minHeight: "calc(100vh - 92px)" }}
          >
      {/* STEP PROGRESS - Centered */}
<div className="col-[1_/_span_3] row-[1] flex justify-center items-center relative mb-[75px] mx-auto">
  <div className="relative w-[1240px]">
    <div className="absolute inset-0 flex flex-col items-center justify-start">
      {/* Step circles + connecting lines */}
      <div className="flex items-center justify-center gap-[0px] mt-[10px]">
        {/* Step 1 - Active */}
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
                    num === 2 ? "bg-[#114B9F]" : "bg-[#B1B1B1]"
                  }`}
                />
              </div>
            </div>
            <div className="relative shrink-0 size-[60px]">
              <div className="absolute left-0 size-[60px] top-0 bg-[#FCFCFC] border border-[#B1B1B1] rounded-full flex items-center justify-center">
                <div className="flex flex-col font-['Montserrat',sans-serif] font-bold justify-center text-[24px] text-[#B1B1B1] text-center">
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
          { label: ["Payment Terms", "& Schedule"], width: '100px' },
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


<div
  className="col-[1] row-[2] flex items-center gap-[20px]"
  style={{
    color: "var(--Text-Primary, #001C43)",
    textAlign: "center",
    fontFamily: "Montserrat, sans-serif",
    fontSize: "32px",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "40px",
  }}
>
  <p>Step 1</p>
  <p
    style={{
      fontSize: "24px",
      lineHeight: "32px",
      margin: 0,
    }}
  >
    Requestor Information
  </p>
</div>

{/* INFO ICON — on the same level with Step 1 Requestor Information, rightmost corner */}
<div className="col-[3] row-[2] flex items-center justify-end">
  <div className="bg-white w-[40px] h-[40px] flex items-center justify-center rounded-[10px] shadow-[1px_0px_4px_rgba(0,0,0,0.25)]">
    <Info className="w-[24px] h-[24px] text-[#E50019]" />
  </div>
</div>


      {/* FORM */}
      <form
        id="step1-form"
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#FCFCFC] col-[1_/_span_3] row-[3] p-[20px] grid grid-cols-2 gap-[60px] rounded-[20px]"
      >
        {/* Requested By */}
        <FormField
          error={errors.requestedBy?.message}
          className="flex flex-col items-start gap-1.5 px-5"
        >
          <FormLabel
          htmlFor="requestedBy"
    className="text-[#001C43] text-[14] font-[700] font-[Montserrat]"
    >
            Requested By
          </FormLabel>
          <div className="flex items-center gap-2 px-3 py-2.5 w-full bg-white rounded-md border border-solid border-[#e4e4e7]">
            <div className="flex-1 flex gap-2 items-center">
              {isEditingRequestedBy ? (
                <Input
                  id="requestedBy"
                  {...register("requestedBy")}
                  className="flex-1 border-0 p-0 focus-visible:ring-0"
                />
              ) : (
              <p className="flex-1 text-[14px] text-[#001C43] leading-[20px]">
              {watch("requestedBy") || user?.fullName}
              </p>

              )}
              <Pencil
                className="size-[24px] cursor-pointer text-[#001C43]"
              />
            </div>
          </div>
          <FormError message={errors.requestedBy?.message} />
        </FormField>

        {/* Department */}
        {/* Department */}
<FormField
  error={errors.departmentId?.message}
  className="flex flex-col items-start gap-2.5 px-5"
>
  <FormLabel
    htmlFor="departmentId"
    className="text-[#001C43] text-[14] font-[700]"
  >
    Department
  </FormLabel>

  {/* Container based on provided Figma specs */}
  <div
    className={`flex items-center gap-2.5 w-[584px] h-[46px] rounded-md ${
      errors.departmentId ? "border border-[#E50019]" : ""
    }`}
  >
    <Select
      value={selectedDepartmentId || ""}
      onValueChange={(value) => {
        setValue("departmentId", value, { shouldValidate: true });
        const selectedDept = departments.find(
          (d: { id: string; name: string }) => d.id === value
        );
        if (selectedDept) {
          setValue("department", selectedDept.name, { shouldValidate: true });
        }
      }}
      disabled={departmentsLoading}
    >
      <SelectTrigger
        className={`flex-1 h-[46px] border ${
          errors.departmentId
            ? "border-[#E50019] focus:ring-[#E50019]"
            : "border-[#E4E4E7]"
        } bg-white text-[14px] text-[#001C43] font-[Montserrat] leading-[20px] rounded-md`}
      >
        <SelectValue placeholder="Select Department" />
      </SelectTrigger>
      <SelectContent>
        {departments.map((dept: { id: string; name: string }) => (
          <SelectItem key={dept.id} value={dept.id}>
            {dept.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  <FormError
    message={errors.departmentId?.message || errors.department?.message}
  />
</FormField>
</form>

      {/* ACTION BUTTONS */}
      <div className="col-[3] row-[4] grid grid-cols-2 gap-[30px] justify-self-end w-[293px] mt-[30px]">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="w-[137px] h-[46px] gap-[7px] justify-self-center"
        >
          <img alt="" className="size-[24px]" src={CancelIcon} />
          <span>Cancel</span>
        </Button>
        <Button
          type="submit"
          form="step1-form"
          disabled={isSubmitting || isCreatingDraft || !isValid}
          className="w-[137px] h-[46px] gap-[7px] justify-self-center"
        >
          <span>Next</span>
          <ChevronRight className="size-[24px]" />
        </Button>
      </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
