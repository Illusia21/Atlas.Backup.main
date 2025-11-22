import mapuaLogo from '@/assets/images/mapuaLogo.png'
import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { X, Send, MoveRight, Download, Link2, HardDriveDownload } from "lucide-react";
import { mockRequestDetails, type RequestDetail } from "@/data/mockRequestDetails";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// Helper function to format numbers with commas
const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Form Content Component - The actual reimbursement form display
function FormContent({ request }: { request: RequestDetail }) {
    return (
        <div className="bg-white min-h-full p-8">
            {/* Header with Logo and Title */}
            <div className="flex items-center justify-between pb-4 mb-8 border-b border-gray-300">
                <div className="flex items-center gap-3">
                    {/* MAPUA Logo */}
                    <img
                        src={mapuaLogo}
                        alt="MAPUA Logo"
                        className="w-[120px] h-auto object-contain"
                    />
                </div>
                <h1 className="text-[#001c43] font-bold text-2xl">{request.formTitle}</h1>
                <p className="text-[#001c43] text-sm font-medium">{request.referenceNumber}</p>
            </div>

            {/* Requester Information Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[#001c43] font-semibold text-lg">Requester Information</h2>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                        <p className="text-[#001c43] font-bold text-sm mb-1">Requested By</p>
                        <p className="text-[#001c43] text-sm">{request.requesterInfo.requestedBy}</p>
                    </div>
                    <div>
                        <p className="text-[#001c43] font-bold text-sm mb-1">Department</p>
                        <p className="text-[#001c43] text-sm">{request.requesterInfo.department}</p>
                    </div>
                </div>
            </div>

            <div className="border-b border-gray-300 mb-8" />

            {/* Request Details Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[#001c43] font-bold text-lg">Request Details</h2>
                </div>

                <div className="mb-4">
                    <p className="text-[#001c43] font-bold text-sm mb-1">Request Type</p>
                    <p className="text-[#001c43] text-sm">{request.requestDetailsInfo.requestType}</p>
                </div>

                <div className="mb-4">
                    <p className="text-[#001c43] font-bold text-sm mb-1">Description/Purpose</p>
                    <p className="text-[#001c43] text-sm">{request.requestDetailsInfo.descriptionPurpose}</p>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                    <div>
                        <p className="text-[#001c43] font-bold text-sm mb-1">Source of Fund</p>
                        <p className="text-[#001c43] text-sm">{request.requestDetailsInfo.sourceOfFund}</p>
                    </div>
                    <div>
                        <p className="text-[#001c43] font-bold text-sm mb-1">Cost Center</p>
                        <p className="text-[#001c43] text-sm">{request.requestDetailsInfo.costCenter}</p>
                    </div>
                    <div>
                        <p className="text-[#001c43] font-bold text-sm mb-1">Date Requested</p>
                        <p className="text-[#001c43] text-sm">{request.requestDetailsInfo.dateRequested}</p>
                    </div>
                    <div>
                        <p className="text-[#001c43] font-bold text-sm mb-1">Date Needed</p>
                        <p className="text-[#001c43] text-sm">{request.requestDetailsInfo.dateNeeded}</p>
                    </div>
                </div>

                {/* Line Items Table */}
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#001c43] text-white text-sm">
                                <th className="py-3 px-4 text-center font-bold">Line/Item</th>
                                <th className="py-3 px-4 text-left font-bold">Category</th>
                                <th className="py-3 px-4 text-left font-bold">Activity/Description</th>
                                <th className="py-3 px-4 text-center font-bold">Quantity</th>
                                <th className="py-3 px-4 text-center font-bold">UOM</th>
                                <th className="py-3 px-4 text-right font-bold">Price</th>
                                <th className="py-3 px-4 text-right font-bold">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {request.lineItems.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200 last:border-b-0 bg-white font-bold">
                                    <td className="py-3 px-4 text-[#001c43] text-sm text-center">{item.lineNumber}</td>
                                    <td className="py-3 px-4 text-[#001c43] text-sm">{item.category}</td>
                                    <td className="py-3 px-4 text-[#001c43] text-sm">{item.activityDescription}</td>
                                    <td className="py-3 px-4 text-[#001c43] text-sm text-center">{item.quantity}</td>
                                    <td className="py-3 px-4 text-[#001c43] text-sm text-center">{item.uom}</td>
                                    <td className="py-3 px-4 text-[#001c43] text-sm text-right">{formatNumber(item.price)}</td>
                                    <td className="py-3 px-4 text-[#001c43] text-sm text-right">{formatNumber(item.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="border-b border-gray-300 mb-8" />

            {/* Amount Summary */}
            <div className="mb-8 bg-gray-100 p-6 rounded-lg">
                <div className="flex justify-between items-start">
                    <div className="text-sm text-[#001c43]">
                        <span className="font-bold">Currency: {request.amountSummary.currency}</span>
                    </div>
                    <div className="text-right space-y-3 min-w-[300px]">
                        <div className="flex justify-between gap-8">
                            <span className="text-[#001c43] text-sm font-bold">Amount</span>
                            <span className="text-[#001c43] text-sm">{formatNumber(request.amountSummary.amount)}</span>
                        </div>
                        <div className="flex justify-between gap-8">
                            <span className="text-[#001c43] text-sm font-bold">Service Fee</span>
                            <span className="text-[#001c43] text-sm">{formatNumber(request.amountSummary.serviceFee)}</span>
                        </div>
                        <div className="flex justify-between gap-8">
                            <span className="text-[#001c43] text-sm font-bold">Less: EWT</span>
                            <span className="text-[#001c43] text-sm">({request.amountSummary.ewtRate}%) {formatNumber(request.amountSummary.ewtAmount)}</span>
                        </div>
                        <div className="border-t border-gray-300 pt-3 mt-3">
                            <div className="flex justify-between gap-8">
                                <span className="text-[#001c43] text-base font-bold">Net Total Amount</span>
                                <span className="text-[#001c43] text-base font-bold">{formatNumber(request.amountSummary.netTotalAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b border-gray-300 mb-8" />

            {/* Payment Terms & Schedule Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[#001c43] font-bold text-lg">Payment Terms & Schedule</h2>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                    <div>
                        <p className="text-[#001c43] font-bold text-sm mb-1">Mode of Payment</p>
                        <p className="text-[#001c43] text-sm">{request.paymentTerms.modeOfPayment}</p>
                    </div>
                    <div>
                        <p className="text-[#001c43] font-bold text-sm mb-1">Terms of Payment</p>
                        <p className="text-[#001c43] text-sm">{request.paymentTerms.termsOfPayment}</p>
                    </div>
                    <div>
                        <p className="text-[#001c43] font-bold text-sm mb-1">Tax Registration Type</p>
                        <p className="text-[#001c43] text-sm">{request.paymentTerms.taxRegistrationType}</p>
                    </div>
                    <div>
                        <p className="text-[#001c43] font-bold text-sm mb-1">Type of Business</p>
                        <p className="text-[#001c43] text-sm">{request.paymentTerms.typeOfBusiness}</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                    <div>
                        <p className="text-[#001c43] font-bold text-sm mb-1">PO</p>
                        <p className="text-[#001c43] text-sm">{request.paymentTerms.po}</p>
                    </div>
                    <div>
                        <p className="text-[#001c43] font-bold text-sm mb-1">PR</p>
                        <p className="text-[#001c43] text-sm">{request.paymentTerms.pr}</p>
                    </div>
                    <div>
                        <p className="text-[#001c43] font-bold text-sm mb-1">RR</p>
                        <p className="text-[#001c43] text-sm">{request.paymentTerms.rr}</p>
                    </div>
                </div>
            </div>

            {/* Attachments Section */}
            <div className="border-t border-gray-300 pt-6">
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-[#001c43] font-bold text-base">Attachments</h3>
                </div>
                <div className="border border-gray-300 rounded-lg p-4">
                    {request.attachments.length > 0 ? (
                        <ul className="space-y-2">
                            {request.attachments.map((attachment) => (
                                <li key={attachment.id} className="text-[#001c43] text-sm">
                                    □ {attachment.filename}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 text-sm">No attachments</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Comments Tab Placeholder
function CommentsContent() {
    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8">
                <p className="text-gray-400 text-lg mb-2">Comments</p>
                <p className="text-gray-500 text-sm">
                    Full comments history will be displayed here.
                </p>
                <p className="text-gray-400 text-xs mt-4">
                    (Coming soon - separate ticket)
                </p>
            </div>
        </div>
    );
}

// Journey Tab Placeholder
function JourneyContent() {
    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8">
                <p className="text-gray-400 text-lg mb-2">Journey</p>
                <p className="text-gray-500 text-sm">
                    Workflow timeline will be displayed here.
                </p>
                <p className="text-gray-400 text-xs mt-4">
                    (Coming soon - separate ticket)
                </p>
            </div>
        </div>
    );
}

export default function MyRequestDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"form" | "comments" | "journey">("form");
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [commentText, setCommentText] = useState("");

    const handleClose = () => {
        navigate(-1);
    };

    // Load request data by ID
    const request = useMemo<RequestDetail | null>(() => {
        if (!id) return null;
        return mockRequestDetails[id] || null;
    }, [id]);

    // Handle Download Form (print)
    const handleDownloadForm = () => {
        window.print();
    };

    // Handle Request to Cancel
    const handleRequestToCancel = () => {
        setShowCancelDialog(true);
    };

    const confirmCancel = () => {
        // TODO: Implement actual cancel logic
        console.log("Request cancelled");
        setShowCancelDialog(false);
        navigate(-1);
    };

    // Handle comment submit
    const handleCommentSubmit = () => {
        if (commentText.trim()) {
            // TODO: Implement actual comment posting
            console.log("Comment submitted:", commentText);
            setCommentText("");
        }
    };

    // Handle View full comments history click
    const handleViewFullComments = () => {
        setActiveTab("comments");
    };

    // Handle request not found
    if (!id) {
        return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-[20px] p-8 max-w-md">
                    <h2 className="text-xl font-bold text-[#e50019] mb-4">Invalid Request</h2>
                    <p className="text-[#001c43] mb-6">No request ID provided.</p>
                    <button
                        onClick={handleClose}
                        className="bg-[#001c43] text-white px-6 py-2 rounded-lg hover:bg-[#002855] transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-[20px] p-8 max-w-md">
                    <h2 className="text-xl font-bold text-[#e50019] mb-4">Request Not Found</h2>
                    <p className="font-montserrat text-[#001c43] mb-6">
                        Request with ID "{id}" could not be found.
                    </p>
                    <button
                        onClick={handleClose}
                        className="bg-[#001c43] text-white px-6 py-2 rounded-lg hover:bg-[#002855] transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <TooltipProvider delayDuration={300}>
            {/* Modal Overlay */}
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 print:hidden">
                {/* Modal Container */}
                <div className="bg-[#fcfcfc] rounded-[20px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] w-[95vw] max-w-[1393px] h-[90vh] max-h-[946px] grid grid-cols-[1fr_380px] grid-rows-[auto_1fr] overflow-hidden">

                    {/* LEFT PANEL - TABS (Header) */}
                    <div className="col-[1] row-[1] p-4 flex justify-center">
                        <div className="bg-[#f4f4f5] p-[3px] rounded-[6px] flex items-center">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => setActiveTab("form")}
                                        className={`px-[60px] py-[4px] rounded-[4px] text-[13px] leading-[18px] transition-all ${activeTab === "form"
                                            ? "bg-white text-[#09090b] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]"
                                            : "text-[#71717a]"
                                            }`}
                                    >
                                        Form
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>View form details</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => setActiveTab("comments")}
                                        className={`px-[60px] py-[4px] rounded-[4px] text-[13px] leading-[18px] transition-all ${activeTab === "comments"
                                            ? "bg-white text-[#09090b] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]"
                                            : "text-[#71717a]"
                                            }`}
                                    >
                                        Comments
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>View all comments</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => setActiveTab("journey")}
                                        className={`px-[60px] py-[4px] rounded-[4px] text-[13px] leading-[18px] transition-all ${activeTab === "journey"
                                            ? "bg-white text-[#09090b] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]"
                                            : "text-[#71717a]"
                                            }`}
                                    >
                                        Journey
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>View workflow journey</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    {/* LEFT PANEL - MAIN CONTENT */}
                    <div className="col-[1] row-[2] flex flex-col gap-[10px] p-[20px] pt-0 overflow-hidden">

                        {/* Download Form Button Header */}
                        <div className="bg-[rgba(0,28,67,0.7)] flex items-center justify-end px-[31px] py-[14px] rounded-tl-[20px] rounded-tr-[20px]">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={handleDownloadForm}
                                        className="bg-[#001c43] flex items-center gap-[10px] px-[10px] py-[2px] h-[30px] rounded-[10px] hover:bg-[#002855] transition-colors"
                                    >
                                        <HardDriveDownload className="w-[18px] h-[18px] text-white" />
                                        <p className="text-[14px] text-white leading-[20px]">
                                            Download Form
                                        </p>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Download or print this form</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        {/* Form Preview Area */}
                        <div className="bg-white border border-[#b1b1b1] rounded-b-[20px] flex-1 overflow-y-auto">
                            {activeTab === "form" && <FormContent request={request} />}
                            {activeTab === "comments" && <CommentsContent />}
                            {activeTab === "journey" && <JourneyContent />}
                        </div>

                    </div>

                    {/* RIGHT PANEL */}
                    <div className="col-[2] row-[1_/_span_2] bg-[#fafafa] border-l border-[#e5e7eb] flex flex-col overflow-hidden">

                        {/* Header with Workflow Status & Close Button */}
                        <div className="p-4 border-b border-[#e5e7eb] flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <span className="text-[#001c43] text-sm font-medium">
                                    Workflow Status:
                                </span>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="bg-[#f0f0f0] border border-[#8b8b8b] text-[#6b7280] px-3 py-1 rounded-lg text-xs font-medium cursor-default">
                                            {request.status}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Current status: {request.status}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={handleClose}
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5 text-[#001c43]" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Close</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto">

                            {/* Approver Section */}
                            <div className="p-4 border-b border-[#e5e7eb]">
                                <h3 className="font-semibold text-base text-[#001c43] mb-3">
                                    Approver
                                </h3>
                                <div className="flex items-center gap-3">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] flex items-center justify-center flex-shrink-0 cursor-default">
                                                <span className="text-white font-semibold text-lg">
                                                    {request.approver.initials}
                                                </span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{request.approver.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <div className="flex flex-col">
                                        <p className="text-sm text-[#001c43] font-medium">
                                            {request.approver.name}
                                        </p>
                                        <p className="text-sm text-[#e50019]">
                                            {request.approver.role}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Comments Section */}
                            <div className="p-4 border-b border-[#e5e7eb]">
                                <p className="text-sm text-[#001c43] font-medium mb-2">
                                    Recent Comments:
                                </p>

                                {/* Comment Item or No Comments */}
                                {request.comments.length > 0 ? (
                                    <div className="space-y-2 mb-3">
                                        <div className="flex items-start justify-between">
                                            <p className="text-xs text-[#001c43]">
                                                <span className="font-medium">{request.comments[0].author}</span>
                                                <span className="text-[#e50019]"> - {request.comments[0].role}</span>
                                            </p>
                                            <p className="text-[10px] text-[#9ca3af]">
                                                {request.comments[0].timestamp}
                                            </p>
                                        </div>
                                        <div className="pl-3 border-l-2 border-[#e5e7eb]">
                                            <div className="bg-white border border-[#e5e7eb] rounded-lg px-3 py-2">
                                                <p className="text-xs text-[#374151]">
                                                    {request.comments[0].text}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-[#9ca3af] mb-2">
                                        No comments yet
                                    </p>
                                )}

                                {/* View Full History Link */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={handleViewFullComments}
                                            className="flex items-center gap-1 text-[#9ca3af] hover:text-[#6b7280] transition-colors mb-3"
                                        >
                                            <span className="text-xs">
                                                View full comments history
                                            </span>
                                            <MoveRight className="w-4 h-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>View all comments</p>
                                    </TooltipContent>
                                </Tooltip>

                                {/* Comment Input */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                                        placeholder="Type your comment here"
                                        className="flex-1 border border-[#d1d5db] rounded-lg px-3 py-2 text-sm placeholder:text-[#9ca3af] focus:outline-none focus:border-[#001c43] focus:ring-1 focus:ring-[#001c43]"
                                    />
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={handleCommentSubmit}
                                                className="w-9 h-9 flex items-center justify-center hover:bg-[#001c43] hover:text-white rounded-lg transition-colors text-[#001c43]"
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Send comment</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>

                            {/* Attachments Section */}
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Link2 className="w-5 h-5 text-[#001c43]" />
                                    <h3 className="text-sm text-[#001c43] font-medium">
                                        Attachments
                                    </h3>
                                </div>

                                <div className="space-y-2">
                                    {request.attachments.length > 0 ? (
                                        request.attachments.map((attachment) => (
                                            <div
                                                key={attachment.id}
                                                className="bg-white border border-[#e5e7eb] rounded-lg p-3 flex items-center gap-3 hover:border-[#001c43] transition-colors"
                                            >
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="w-10 h-10 bg-[#ef4444] rounded flex items-center justify-center flex-shrink-0 cursor-default">
                                                            <span className="text-white font-bold text-[10px]">
                                                                {attachment.type.toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{attachment.type.toUpperCase()} file</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-[#001c43] font-medium truncate">
                                                        {attachment.filename}
                                                    </p>
                                                    <p className="text-xs text-[#9ca3af]">
                                                        {attachment.size} • {attachment.date}
                                                    </p>
                                                </div>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            onClick={() => window.open(attachment.url, '_blank')}
                                                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                                                        >
                                                            <Download className="w-4 h-4 text-[#001c43]" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Download {attachment.filename}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-[#9ca3af]">
                                            No attachments
                                        </p>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Request to Cancel Button - Fixed at Bottom */}
                        <div className="p-4 border-t border-[#e5e7eb] flex-shrink-0">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={handleRequestToCancel}
                                        className="w-full bg-[#e50019] hover:bg-[#c40015] text-white font-bold text-sm py-3 rounded-xl transition-colors"
                                    >
                                        Request to Cancel
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Request to cancel this submission</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>

                    </div>

                </div>
            </div>

            {/* Cancel Confirmation Dialog */}
            {showCancelDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-[20px] p-8 max-w-md mx-4 shadow-xl">
                        <h2 className="text-xl font-bold text-[#001c43] mb-4">
                            Confirm Cancellation
                        </h2>
                        <p className="text-[#001c43] mb-6">
                            Are you sure you want to request cancellation for this reimbursement? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => setShowCancelDialog(false)}
                                        className="flex-1 bg-gray-200 text-[#001c43] px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                                    >
                                        No, Keep It
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Keep this request</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={confirmCancel}
                                        className="flex-1 bg-[#e50019] text-white px-6 py-3 rounded-lg hover:bg-[#c40015] transition-colors font-semibold"
                                    >
                                        Yes, Cancel
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Confirm cancellation</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            )}

            {/* Print-only content */}
            <div className="hidden print:block">
                <FormContent request={request} />
            </div>
        </TooltipProvider>
    );
}