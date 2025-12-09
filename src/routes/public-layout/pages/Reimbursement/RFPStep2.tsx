import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { ChevronDown, CircleMinus, PencilLine, Plus, ArrowRight, Info, ChevronRight } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import Calendar from "@/assets/calendar.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/selectRFPStep2";

// Dummy schema
const lineItemSchema = z.object({
  category: z.string().min(1, "Category is required"),
  activity: z.string().min(1, "Activity is required"),
  quantity: z.number().int().positive("Quantity must be a positive whole number"),
  uom: z.string().min(1, "UOM is required"),
  price: z.number().min(0, "Price must be 0 or greater"),
  amount: z.number().min(0),
});

const step2RequestDetailsSchema = z.object({
  sourceOfFunds: z.string().min(1, "Source of Funds is required"),
  costCenter: z.string().min(1, "Cost Center is required"),
  description: z.string().min(1, "Description is required"),
  dateRangeStart: z.string().min(1, "Start date is required"),
  dateRangeEnd: z.string().min(1, "End date is required"),
  currency: z.string().min(1, "Currency is required"),
  lineItems: z.array(lineItemSchema).min(1, "At least one line item is required"),
});

type Step2RequestDetailsFormData = z.infer<typeof step2RequestDetailsSchema>;
type LineItem = z.infer<typeof lineItemSchema>;

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

// Dummy data
const dummySourceOfFunds = [
  { id: "fund-1", name: "General Fund" },
  { id: "fund-2", name: "Funds Payable" },
  { id: "fund-3", name: "DOST Fund" },
  { id: "fund-4", name: "Special Fund" },
  { id: "fund-4", name: "Sponsorship Fund" },
];

// Dummy draft data - moved outside component to prevent recreation on every render
const dummyDraft = {
  sourceOfFunds: "",
  costCenter: "",
  description: "",
  dateRangeStart: "",
  dateRangeEnd: "",
  currency: "PHP",
  lineItems: [],
};

// Simple DatePicker replacement
const SimpleDatePicker = ({ 
  startDate, 
  endDate, 
  onChange 
}: { 
  startDate: Date | null; 
  endDate: Date | null; 
  onChange: (dates: [Date | null, Date | null]) => void;
}) => {
  const [start, setStart] = useState<Date | null>(startDate);
  const [end, setEnd] = useState<Date | null>(endDate);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setStart(date);
    onChange([date, end]);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setEnd(date);
    onChange([start, date]);
  };

  return (
    <div className="flex gap-2">
      <input
        type="date"
        value={start ? start.toISOString().split('T')[0] : ''}
        onChange={handleStartChange}
        className="flex-1 rounded-[6px] border-0 bg-transparent px-[10px] py-[2px] text-[14px] focus-visible:outline-none"
      />
      <span className="px-2">to</span>
      <input
        type="date"
        value={end ? end.toISOString().split('T')[0] : ''}
        onChange={handleEndChange}
        className="flex-1 rounded-[6px] border-0 bg-transparent px-[10px] py-[2px] text-[14px] focus-visible:outline-none"
      />
    </div>
  );
};

export default function Step2MainLayout() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const sourceOfFunds = dummySourceOfFunds; // Using dummy data
  const sourceOfFundsLoading = false;
  const [isUpdating, setIsUpdating] = useState(false);
  const draft = dummyDraft;
  const draftLoading = false;

  const [editingLineItemIndex, setEditingLineItemIndex] = useState<number | null>(null);
  const [lineItemEditData, setLineItemEditData] = useState<Partial<LineItem>>({});

  // Category options - in a real app, this would come from an API
  const categoryOptions = [
    "Supplies",
    "Meals",
    "Transport",
    "Accommodation",
    "Equipment",
    "Services",
    "Other",
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    control,
    watch,
    setValue,
    trigger,
  } = useForm<Step2RequestDetailsFormData>({
    resolver: zodResolver(step2RequestDetailsSchema),
    mode: "onChange",
    defaultValues: {
      sourceOfFunds: "",
      costCenter: "",
      description: "",
      dateRangeStart: "",
      dateRangeEnd: "",
      currency: "PHP",
      lineItems: [],
    },
  });

  const { fields, append, remove, update, replace } = useFieldArray({
    control,
    name: "lineItems",
  });

  const lineItems = watch("lineItems");
  const currency = watch("currency");
  const dateRangeStart = watch("dateRangeStart");
  const dateRangeEnd = watch("dateRangeEnd");

  // Date range state for DatePicker component
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  // Create a stable dependency for lineItems quantity/price changes
  const lineItemsKey = React.useMemo(() => {
    return lineItems.map((item: LineItem) => `${item.quantity || 0}-${item.price || 0}`).join(',');
  }, [lineItems]);

  // Calculate total amount dynamically
  const totalAmount = React.useMemo(() => {
    return lineItems.reduce((sum: number, item: LineItem) => {
      const amount = (item.quantity || 0) * (item.price || 0);
      return sum + amount;
    }, 0);
  }, [lineItems]);

  // Load existing draft data - only run once on mount
  useEffect(() => {
    if (draft && !draftLoading) {
      if (draft.sourceOfFunds) setValue("sourceOfFunds", draft.sourceOfFunds, { shouldDirty: false });
      if (draft.costCenter) setValue("costCenter", draft.costCenter, { shouldDirty: false });
      if (draft.description) setValue("description", draft.description, { shouldDirty: false });
      if (draft.dateRangeStart) setValue("dateRangeStart", draft.dateRangeStart, { shouldDirty: false });
      if (draft.dateRangeEnd) setValue("dateRangeEnd", draft.dateRangeEnd, { shouldDirty: false });
      if (draft.currency) setValue("currency", draft.currency, { shouldDirty: false });
      if (draft.lineItems && draft.lineItems.length > 0) {
        replace(
          draft.lineItems.map((item: LineItem) => ({
            category: item.category,
            activity: item.activity,
            quantity: item.quantity,
            uom: item.uom,
            price: item.price,
            amount: item.amount || item.quantity * item.price,
          }))
        );
      } else {
        replace([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Sync form values with DatePicker state
  useEffect(() => {
    if (dateRangeStart) {
      const startDate = new Date(dateRangeStart);
      const endDate = dateRangeEnd ? new Date(dateRangeEnd) : null;
      setDateRange([startDate, endDate]);
    } else {
      setDateRange([null, null]);
    }
  }, [dateRangeStart, dateRangeEnd]);

  // Update line item amounts when quantity or price changes
  useEffect(() => {
    if (lineItems.length > 0) {
      lineItems.forEach((item: LineItem, index: number) => {
        const quantity = item.quantity || 0;
        const price = item.price || 0;
        const calculatedAmount = quantity * price;
        // Only update if the amount has changed to prevent infinite loops
        if (item.amount !== calculatedAmount) {
          setValue(`lineItems.${index}.amount`, calculatedAmount, { shouldDirty: false, shouldValidate: false });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineItemsKey]); // Only depend on quantity/price changes, not the entire lineItems array

  const handleAddLineItem = () => {
    append({
      category: "",
      activity: "",
      quantity: 0,
      uom: "",
      price: 0,
      amount: 0,
    });
    setEditingLineItemIndex(fields.length);
  };

  const handleEditLineItem = (index: number) => {
    const item = lineItems[index];
    setLineItemEditData({
      category: item.category,
      activity: item.activity,
      quantity: item.quantity,
      uom: item.uom,
      price: item.price,
    });
    setEditingLineItemIndex(index);
  };

  const handleSaveLineItem = (index: number) => {
    // Validate all required fields
    if (!lineItemEditData.category) {
      alert("Please select a category");
      return;
    }
    if (!lineItemEditData.activity) {
      alert("Please enter an activity/description");
      return;
    }
    if (!lineItemEditData.quantity || lineItemEditData.quantity <= 0) {
      alert("Please enter a valid quantity (must be a whole number greater than 0)");
      return;
    }
    if (!lineItemEditData.uom) {
      alert("Please enter a unit of measurement (UOM)");
      return;
    }
    if (lineItemEditData.price === undefined || lineItemEditData.price < 0) {
      alert("Please enter a valid price (must be 0 or greater)");
      return;
    }
    
    update(index, {
      ...lineItemEditData,
      quantity: Math.floor(Number(lineItemEditData.quantity)), // Ensure whole number
      price: Number(lineItemEditData.price),
      amount: Math.floor(Number(lineItemEditData.quantity)) * Number(lineItemEditData.price),
    } as LineItem);
    setEditingLineItemIndex(null);
    setLineItemEditData({});
    trigger("lineItems");
  };

  const handleDeleteLineItem = (index: number) => {
    remove(index);
    if (editingLineItemIndex === index) {
      setEditingLineItemIndex(null);
      setLineItemEditData({});
    }
  };

  const handleCancelEdit = () => {
    setEditingLineItemIndex(null);
    setLineItemEditData({});
  };

  const onSubmit = async (data: Step2RequestDetailsFormData) => {
    if (!id) {
      console.error("Draft ID is missing");
      alert("Draft ID is missing. Please try again.");
      return;
    }

    // If there's a line item being edited, save it first
    if (editingLineItemIndex !== null && lineItemEditData) {
      // Try to save - this will show alerts if incomplete
      const hasAllFields = lineItemEditData.category && 
                           lineItemEditData.activity && 
                           lineItemEditData.quantity && 
                           lineItemEditData.uom && 
                           lineItemEditData.price !== undefined;
      if (!hasAllFields) {
        handleSaveLineItem(editingLineItemIndex); // This will show appropriate alert
        return;
      }
      handleSaveLineItem(editingLineItemIndex);
      // Wait a bit for the form to update, then re-validate
      await new Promise(resolve => setTimeout(resolve, 100));
      const isValidNow = await trigger();
      if (!isValidNow) {
        alert("Please complete all required fields in the line items before submitting.");
        return;
      }
      // Get the updated data
      const updatedData = watch();
      data = updatedData as Step2RequestDetailsFormData;
    }

    // Validate form
    const isValidNow = await trigger();
    if (!isValidNow) {
      // Check for specific validation errors
      if (errors.sourceOfFunds) {
        alert("Please select a Source of Funds");
      } else if (errors.costCenter) {
        alert("Please enter a Cost Center");
      } else if (errors.description) {
        alert("Please enter a Description/Purpose");
      } else if (errors.dateRangeStart) {
        alert("Please select a start date");
      } else if (errors.dateRangeEnd) {
        alert(errors.dateRangeEnd.message || "Please select an end date that is the same as or after the start date");
      } else if (errors.currency) {
        alert("Please select a Currency");
      } else if (errors.lineItems) {
        alert("Please add at least one complete line item with all required fields filled.");
      } else {
        alert("Please complete all required fields before submitting.");
      }
      return;
    }

    // Validate line items are complete
    const incompleteItems = data.lineItems.filter((item: LineItem) => 
      !item.category || 
      !item.activity || 
      !item.quantity || 
      item.quantity <= 0 ||
      !item.uom || 
      item.price === undefined || 
      item.price < 0
    );
    
    if (incompleteItems.length > 0) {
      alert("Please ensure all line items have complete information (category, activity, quantity, UOM, and price).");
      return;
    }

    // Calculate total amount
    const calculatedTotal = data.lineItems.reduce((sum: number, item: LineItem) => {
      return sum + (item.quantity * item.price);
    }, 0);

    // Dummy save - simulate API call
    setIsUpdating(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = {
        id: id || "draft-1",
        data: {
          sourceOfFunds: data.sourceOfFunds,
          costCenter: data.costCenter,
          description: data.description,
          dateRangeStart: data.dateRangeStart,
          dateRangeEnd: data.dateRangeEnd,
          currency: data.currency,
          lineItems: data.lineItems.map((item: LineItem) => ({
            ...item,
            amount: item.quantity * item.price,
          })),
          totalAmount: calculatedTotal,
        },
      };
      
      console.log("Step 2 saved (dummy):", result);
      
      // Navigate to next step
      if (id) {
        navigate(`/reimbursement/step3/${id}`);
      } else {
        navigate(`/reimbursement/step3/draft-1`);
      }
    } catch (error) {
      console.error("Failed to save Step 2:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBack = () => {
    if (id) {
      navigate(`/reimbursement/step1`);
    }
  };


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (draftLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

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
                          num === 2 ? "bg-[#114B9F]" : "bg-[#B1B1B1]"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="relative shrink-0 size-[60px]">
                    <div className={`absolute left-0 size-[60px] top-0 ${
                      num === 2 
                        ? "bg-[#114B9F]" 
                        : "bg-[#FCFCFC] border border-[#B1B1B1]"
                    } rounded-full flex items-center justify-center`}>
                      <div className={`flex flex-col font-['Montserrat',sans-serif] font-bold justify-center text-[24px] ${
                        num === 2 ? "text-[#FCFCFC]" : "text-[#B1B1B1]"
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
        <p>Step 2</p>
        <p style={{ fontSize: "24px", lineHeight: "32px", margin: 0 }}>Request Details</p>
      </div>

      {/* Info Button */}
      <div className="col-[3] row-[2] flex items-center justify-end">
        <div className="bg-white w-[40px] h-[40px] flex items-center justify-center rounded-[10px] shadow-[1px_0px_4px_rgba(0,0,0,0.25)]">
          <Info className="w-[24px] h-[24px] text-[#E50019]" />
        </div>
      </div>

      {/* FORM CARD */}
      <form
        id="step2-form"
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#FCFCFC] col-[1_/_span_3] row-[3] p-[20px] grid grid-cols-2 gap-[20px] rounded-[20px]"
      >
        {/* Left column */}
        <div className="flex flex-col gap-[20px] px-5">
          <FormField error={errors.sourceOfFunds?.message} className="gap-[6px]">
            <FormLabel>Source of Funds</FormLabel>
            <Select
              value={watch("sourceOfFunds") || ""}
              onValueChange={(value: string) => {
                setValue("sourceOfFunds", value, { shouldValidate: true });
              }}
              disabled={sourceOfFundsLoading}
            >
              <SelectTrigger className={`w-full h-[46px] ${
                errors.sourceOfFunds
                  ? "border-[#E50019] focus:ring-[#E50019]"
                  : "border-[#E4E4E7]"
              }`}>
                <SelectValue placeholder="Select Source of Funds" />
              </SelectTrigger>
              <SelectContent>
                {sourceOfFunds.map((fund: { id: string; name: string }) => (
                  <SelectItem key={fund.id} value={fund.id}>
                    {fund.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormError message={errors.sourceOfFunds?.message} />
          </FormField>

          <FormField error={errors.description?.message} className="gap-[6px]">
            <FormLabel>Description/Purpose</FormLabel>
            <Input
              {...register("description")}
              placeholder="Enter description or purpose"
            />
            <FormError message={errors.description?.message} />
          </FormField>

          <FormField error={errors.currency?.message} className="gap-[6px]">
            <FormLabel>Currency</FormLabel>
            <Select
              value={watch("currency") || "PHP"}
              onValueChange={(value: string) => {
                setValue("currency", value, { shouldValidate: true });
              }}
            >
              <SelectTrigger className={`w-[180px] h-[46px] ${
                errors.currency
                  ? "border-[#E50019] focus:ring-[#E50019]"
                  : "border-[#E4E4E7]"
              }`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PHP">PHP</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
            <FormError message={errors.currency?.message} />
          </FormField>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-[30px] px-5">
          <FormField error={errors.costCenter?.message} className="gap-[6px] ml-[26px] w-[500px]">
            <FormLabel>Cost Center</FormLabel>
            <Input
              {...register("costCenter")}
              placeholder="Enter cost center"
            />
            <FormError message={errors.costCenter?.message} />
          </FormField>

          <FormField className="gap-[6px] ml-[26px] w-[500px]">
            <FormLabel>Date Range</FormLabel>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5 w-[525px] h-[36px] rounded-[6px] border border-[#001C43] bg-white px-3">
                <img src={Calendar} alt="Calendar" className="w-[20px] h-[20px] flex-shrink-0" />
                <SimpleDatePicker
                  startDate={dateRange[0]}
                  endDate={dateRange[1]}
                  onChange={(dates: [Date | null, Date | null]) => {
                    const [start, end] = dates;
                    setDateRange([start, end]);
                    if (start) {
                      const startDateStr = start.toISOString().split("T")[0];
                      setValue("dateRangeStart", startDateStr);
                      trigger("dateRangeStart");
                    } else {
                      setValue("dateRangeStart", "");
                    }
                    if (end) {
                      const endDateStr = end.toISOString().split("T")[0];
                      setValue("dateRangeEnd", endDateStr);
                      trigger("dateRangeEnd");
                    } else {
                      setValue("dateRangeEnd", "");
                    }
                  }}
                />
              </div>
              {errors.dateRangeStart && (
                <FormError message={errors.dateRangeStart.message} />
              )}
              {errors.dateRangeEnd && (
                <FormError message={errors.dateRangeEnd.message} />
              )}
            </div>
          </FormField>
        </div>

        {/* Line Items Table */}
        <div className="col-span-2 mt-[10px]">
          <div className="overflow-hidden rounded-[10px]">
            {/* Table header */}
            <div className="flex items-center justify-center bg-[#001C43] text-white grid grid-cols-[80px_168px_1fr_120px_100px_140px_120px_120px] px-5 py-6 text-[14px] text-[#FCFCFC] font-[700] h-[60px]">
              <div className="flex items-center justify-center">Line/Item</div>
              <div className="flex items-center justify-center">Category</div>
              <div className="flex items-center justify-center">Activity/Description</div>
              <div className="flex items-center justify-center">Quantity</div>
              <div className="flex items-center justify-center">UOM</div>
              <div className="flex items-center justify-center">Price</div>
              <div className="flex items-center justify-center">Amount</div>
              <div className="flex items-center justify-center">Action</div>
            </div>

            {/* Table rows */}
            {fields.map((field, index) => {
              const isEditing = editingLineItemIndex === index;
              const item = lineItems[index];

              return (
                <div
                  key={field.id}
                  className="grid grid-cols-[80px_168px_1fr_120px_100px_140px_120px_120px] items-center px-5 py-3 bg-white odd:bg-[#FCFCFC] text-[14px] text-[#001C43] min-h-[50px]"
                >
                  <div className="text-center">{index + 1}</div>

                  {isEditing ? (
                    <>
                      {/* Category */}
                      <div className="flex items-center justify-center">
                        <Select
                          value={lineItemEditData.category || ""}
                          onValueChange={(value: string) =>
                            setLineItemEditData({ ...lineItemEditData, category: value })
                          }
                        >
                          <SelectTrigger className="w-full text-center border-0 focus-visible:ring-0 bg-transparent">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Activity */}
                      <div className="pr-4">
                        <Input
                          value={lineItemEditData.activity || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setLineItemEditData({ ...lineItemEditData, activity: e.target.value })
                          }
                          placeholder="Activity/Description"
                          className="w-full"
                        />
                      </div>
                      {/* Quantity */}
                      <div className="flex items-center justify-center">
                        <Input
                          type="number"
                          value={lineItemEditData.quantity || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value;
                            // Only allow whole numbers
                            if (value === "" || /^\d+$/.test(value)) {
                              setLineItemEditData({
                                ...lineItemEditData,
                                quantity: value === "" ? undefined : parseInt(value, 10),
                              });
                            }
                          }}
                          placeholder="0"
                          className="w-full text-center"
                          min="0"
                          step="1"
                        />
                      </div>
                      {/* UOM */}
                      <div className="flex items-center justify-center">
                        <Input
                          value={lineItemEditData.uom || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setLineItemEditData({ ...lineItemEditData, uom: e.target.value })
                          }
                          placeholder="UOM"
                          className="w-full text-center"
                        />
                      </div>
                      {/* Price */}
                      <div className="flex items-center justify-center">
                        <Input
                          type="number"
                          value={lineItemEditData.price || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setLineItemEditData({
                              ...lineItemEditData,
                              price: Number(e.target.value),
                            })
                          }
                          placeholder="0.00"
                          className="w-full text-center"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      {/* Amount (read-only, calculated) */}
                      <div className="text-center">
                        {formatCurrency(
                          (lineItemEditData.quantity || 0) * (lineItemEditData.price || 0)
                        )}
                      </div>
                      {/* Action buttons */}
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveLineItem(index)}
                          className="text-[#114B9F] hover:text-[#0d3a7a]"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="text-[#E50019] hover:text-[#cc0017]"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Category */}
                <div className="relative w-[120px] flex items-center justify-center pr-4">
                  <span className="absolute left-1/2 transform -translate-x-1/2 text-center truncate">
                          {item.category || "-"}
                  </span>
                        {!item.category && (
                  <ChevronDown className="absolute right-[-7px] w-5 h-5 text-[#001C43]" />
                        )}
                      </div>
                      {/* Activity */}
                      <div className="truncate pr-4" title={item.activity}>
                        {item.activity || "-"}
                      </div>
                      {/* Quantity */}
                      <div className="text-center">{item.quantity || 0}</div>
                      {/* UOM */}
                      <div className="text-center">{item.uom || "-"}</div>
                      {/* Price */}
                      <div className="text-center">
                        {item.price ? formatCurrency(item.price) : "0.00"}
                      </div>
                      {/* Amount */}
                      <div className="text-center">
                        {item.amount ? formatCurrency(item.amount) : "0.00"}
                </div>
                {/* Action icons */}
                <div className="flex items-center justify-center gap-6">
                        <PencilLine
                          className="w-5 h-5 mr-[20px] text-[#114B9F] cursor-pointer hover:text-[#0d3a7a]"
                          onClick={() => handleEditLineItem(index)}
                        />
                        <CircleMinus
                          className="w-5 h-5 text-[#E50019] cursor-pointer hover:text-[#cc0017]"
                          onClick={() => handleDeleteLineItem(index)}
                        />
                </div>
                    </>
                  )}
              </div>
              );
            })}

            {/* Empty row with plus icon */}
            <div
              className="grid grid-cols-[80px_168px_1fr_120px_100px_140px_120px_120px] items-center px-5 py-3 bg-white text-[14px] text-[#001C43] cursor-pointer hover:bg-[#F3F3F3]"
              onClick={handleAddLineItem}
            >
              <div className="flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              {[...Array(7)].map((_, idx) => (
                <div key={idx} className="bg-[#F3F3F3] h-full"></div>
              ))}
            </div>

            {/* Footer row with total */}
            <div className="px-5 py-3 bg-white flex items-center h-[60px]">
              <div className="ml-auto bg-[#114B9F] text-white rounded-[8px] px-6 py-3 w-[306px] h-[50px] flex justify-between items-center whitespace-nowrap">
                <div className="text-[12px] font-[700] text-[#FFFFFF] ml-[60px]">
                  Total Amount: <span className="ml-1 text-[16px]">{currency}</span> <span className="ml-0.5 text-[16px]">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="text-[16px] font-[700] text-[#FFFFFF] mr-[7px]">
                </div>
              </div>
          </div>
        </div>
          {errors.lineItems && (
            <FormError message={errors.lineItems.message || "At least one line item is required"} />
          )}
      </div>
      </form>

      {/* Action buttons */}
      <div className="col-[3] row-[4] grid grid-cols-2 gap-[30px] justify-self-end w-[293px] mt-[30px]">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={isSubmitting}
          className="w-[137px] h-[46px] gap-[7px] justify-self-center"
        >
          <ArrowRight className="w-[20px] h-[20px] rotate-180 text-[#001C43]" />
          <span>Back</span>
          </Button>
        <Button
          type="submit"
          form="step2-form"
          disabled={isSubmitting || !isValid || isUpdating}
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
