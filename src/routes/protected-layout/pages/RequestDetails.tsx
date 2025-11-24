import { toast } from "sonner"
import mapuaLogo from '@/assets/images/mapuaLogo.png'
import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { X, Send, MoveRight, Download, Link2, HardDriveDownload, CloudUpload } from "lucide-react";
import { mockRequestDetails, type RequestDetail, type Comment, type JourneyStep } from "@/data/mockRequestDetails";
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

// Form Content Component - The actual reimbursement form display (for screen)
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
                        className="w-[150px] h-[100px] object-contain"
                    />
                </div>
                <h1 className="text-[#001c43] font-bold text-[20px]">{request.formTitle}</h1>
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
                            <tr className="bg-[#001c43] text-white text-xs">
                                <th className="py-2 px-2 text-center font-bold whitespace-nowrap">Line/Item</th>
                                <th className="py-2 px-2 text-left font-bold whitespace-nowrap">Category</th>
                                <th className="py-2 px-2 text-left font-bold">Activity/Description</th>
                                <th className="py-2 px-2 text-center font-bold whitespace-nowrap">Quantity</th>
                                <th className="py-2 px-2 text-center font-bold whitespace-nowrap">UOM</th>
                                <th className="py-2 px-2 text-right font-bold whitespace-nowrap">Price</th>
                                <th className="py-2 px-2 text-right font-bold whitespace-nowrap">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {request.lineItems.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200 last:border-b-0 bg-white font-bold">
                                    <td className="py-2 px-2 text-[#001c43] text-xs text-center">{item.lineNumber}</td>
                                    <td className="py-2 px-2 text-[#001c43] text-xs">{item.category}</td>
                                    <td className="py-2 px-2 text-[#001c43] text-xs">{item.activityDescription}</td>
                                    <td className="py-2 px-2 text-[#001c43] text-xs text-center">{item.quantity}</td>
                                    <td className="py-2 px-2 text-[#001c43] text-xs text-center">{item.uom}</td>
                                    <td className="py-2 px-2 text-[#001c43] text-xs text-right whitespace-nowrap">{formatNumber(item.price)}</td>
                                    <td className="py-2 px-2 text-[#001c43] text-xs text-right whitespace-nowrap">{formatNumber(item.amount)}</td>
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

                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <div>
                            <p className="text-[#001c43] font-bold text-sm mb-1">Mode of Payment</p>
                            <p className="text-[#001c43] text-sm">{request.paymentTerms.modeOfPayment}</p>
                        </div>
                        <div>
                            <p className="text-[#001c43] font-bold text-sm mb-1">Tax Registration Type</p>
                            <p className="text-[#001c43] text-sm">{request.paymentTerms.taxRegistrationType}</p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <div>
                            <p className="text-[#001c43] font-bold text-sm mb-1">Terms of Payment</p>
                            <p className="text-[#001c43] text-sm">{request.paymentTerms.termsOfPayment}</p>
                        </div>
                        <div>
                            <p className="text-[#001c43] font-bold text-sm mb-1">Type of Business</p>
                            <p className="text-[#001c43] text-sm">{request.paymentTerms.typeOfBusiness}</p>
                        </div>

                        {/* PO, PR, RR underneath Type of Business with spacing */}
                        <div className="pt-5 space-y-4">
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
                </div>
            </div>

        </div>
    );
}

// Print-optimized Form Content - Compact for 1 page
function PrintFormContent({ request }: { request: RequestDetail }) {
    return (
        <div className="bg-white p-4 text-[9px]">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-300">
                <img src={mapuaLogo} alt="MAPUA Logo" className="w-[60px] h-auto object-contain" />
                <h1 className="text-[#001c43] font-bold text-[14px]">{request.formTitle}</h1>
                <p className="text-[#001c43] text-[9px] font-medium">{request.referenceNumber}</p>
            </div>

            {/* Requester Information */}
            <div className="mb-3">
                <h2 className="text-[#001c43] font-bold text-[11px] mb-2">Requester Information</h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div>
                        <p className="text-[#001c43] font-bold">Requested By</p>
                        <p className="text-[#001c43]">{request.requesterInfo.requestedBy}</p>
                    </div>
                    <div>
                        <p className="text-[#001c43] font-bold">Department</p>
                        <p className="text-[#001c43]">{request.requesterInfo.department}</p>
                    </div>
                </div>
            </div>

            <div className="border-b border-gray-300 mb-3" />

            {/* Request Details */}
            <div className="mb-3">
                <h2 className="text-[#001c43] font-bold text-[11px] mb-2">Request Details</h2>

                <div className="mb-2">
                    <p className="text-[#001c43] font-bold">Request Type</p>
                    <p className="text-[#001c43]">{request.requestDetailsInfo.requestType}</p>
                </div>

                <div className="mb-2">
                    <p className="text-[#001c43] font-bold">Description/Purpose</p>
                    <p className="text-[#001c43]">{request.requestDetailsInfo.descriptionPurpose}</p>
                </div>

                <div className="grid grid-cols-4 gap-x-4 gap-y-1 mb-2">
                    <div>
                        <p className="text-[#001c43] font-bold">Source of Fund</p>
                        <p className="text-[#001c43]">{request.requestDetailsInfo.sourceOfFund}</p>
                    </div>
                    <div>
                        <p className="text-[#001c43] font-bold">Cost Center</p>
                        <p className="text-[#001c43]">{request.requestDetailsInfo.costCenter}</p>
                    </div>
                    <div>
                        <p className="text-[#001c43] font-bold">Date Requested</p>
                        <p className="text-[#001c43]">{request.requestDetailsInfo.dateRequested}</p>
                    </div>
                    <div>
                        <p className="text-[#001c43] font-bold">Date Needed</p>
                        <p className="text-[#001c43]">{request.requestDetailsInfo.dateNeeded}</p>
                    </div>
                </div>

                {/* Line Items Table */}
                <table className="w-full border-collapse text-[8px] border border-gray-200">
                    <thead>
                        <tr className="bg-[#001c43] text-white">
                            <th className="py-1 px-1 text-center font-bold border border-gray-300">Line/Item</th>
                            <th className="py-1 px-1 text-left font-bold border border-gray-300">Category</th>
                            <th className="py-1 px-1 text-left font-bold border border-gray-300">Activity/Description</th>
                            <th className="py-1 px-1 text-center font-bold border border-gray-300">Quantity</th>
                            <th className="py-1 px-1 text-center font-bold border border-gray-300">UOM</th>
                            <th className="py-1 px-1 text-right font-bold border border-gray-300">Price</th>
                            <th className="py-1 px-1 text-right font-bold border border-gray-300">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {request.lineItems.map((item, index) => (
                            <tr key={index} className="border-b border-gray-200">
                                <td className="py-1 px-1 text-[#001c43] text-center border border-gray-200">{item.lineNumber}</td>
                                <td className="py-1 px-1 text-[#001c43] border border-gray-200">{item.category}</td>
                                <td className="py-1 px-1 text-[#001c43] border border-gray-200">{item.activityDescription}</td>
                                <td className="py-1 px-1 text-[#001c43] text-center border border-gray-200">{item.quantity}</td>
                                <td className="py-1 px-1 text-[#001c43] text-center border border-gray-200">{item.uom}</td>
                                <td className="py-1 px-1 text-[#001c43] text-right border border-gray-200">{formatNumber(item.price)}</td>
                                <td className="py-1 px-1 text-[#001c43] text-right border border-gray-200">{formatNumber(item.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="border-b border-gray-300 mb-3" />

            {/* Amount Summary */}
            <div className="mb-3 bg-gray-100 p-3 rounded">
                <div className="flex justify-between items-start">
                    <p className="text-[#001c43] font-bold">Currency: {request.amountSummary.currency}</p>
                    <div className="text-right space-y-1">
                        <div className="flex justify-between gap-4">
                            <span className="text-[#001c43] font-bold">Amount</span>
                            <span className="text-[#001c43]">{formatNumber(request.amountSummary.amount)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-[#001c43] font-bold">Service Fee</span>
                            <span className="text-[#001c43]">{formatNumber(request.amountSummary.serviceFee)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-[#001c43] font-bold">Less: EWT</span>
                            <span className="text-[#001c43]">({request.amountSummary.ewtRate}%) {formatNumber(request.amountSummary.ewtAmount)}</span>
                        </div>
                        <div className="border-t border-gray-300 pt-1 mt-1">
                            <div className="flex justify-between gap-4">
                                <span className="text-[#001c43] font-bold text-[10px]">Net Total Amount</span>
                                <span className="text-[#001c43] font-bold text-[10px]">{formatNumber(request.amountSummary.netTotalAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b border-gray-300 mb-3" />

            {/* Payment Terms - Updated to match Screenshot 1 layout */}
            <div>
                <h2 className="text-[#001c43] font-bold text-[11px] mb-2">Payment Terms & Schedule</h2>

                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[8px]">
                    {/* Left Column */}
                    <div className="space-y-2">
                        <div>
                            <p className="text-[#001c43] font-bold">Mode of Payment</p>
                            <p className="text-[#001c43]">{request.paymentTerms.modeOfPayment}</p>
                        </div>
                        <div>
                            <p className="text-[#001c43] font-bold">Tax Registration Type</p>
                            <p className="text-[#001c43]">{request.paymentTerms.taxRegistrationType}</p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-2">
                        <div>
                            <p className="text-[#001c43] font-bold">Terms of Payment</p>
                            <p className="text-[#001c43]">{request.paymentTerms.termsOfPayment}</p>
                        </div>
                        <div>
                            <p className="text-[#001c43] font-bold">Type of Business</p>
                            <p className="text-[#001c43]">{request.paymentTerms.typeOfBusiness}</p>
                        </div>

                        {/* PO, PR, RR underneath Type of Business */}
                        <div className="pt-2 space-y-2">
                            <div>
                                <p className="text-[#001c43] font-bold">PO</p>
                                <p className="text-[#001c43]">{request.paymentTerms.po}</p>
                            </div>
                            <div>
                                <p className="text-[#001c43] font-bold">PR</p>
                                <p className="text-[#001c43]">{request.paymentTerms.pr}</p>
                            </div>
                            <div>
                                <p className="text-[#001c43] font-bold">RR</p>
                                <p className="text-[#001c43]">{request.paymentTerms.rr}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Comments Tab Content
function CommentsContent({
    comments,
    newComment,
    setNewComment,
    onSend,
    attachedFiles,
    onFileAttach,
    onRemoveAttachment
}: {
    comments: Comment[];
    newComment: string;
    setNewComment: (value: string) => void;
    onSend: () => void;
    attachedFiles: File[];
    onFileAttach: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveAttachment: (index: number) => void;
}) {
    const commentsEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to newest comment
    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll when comments change
    useMemo(() => {
        scrollToBottom();
    }, [comments]);

    return (
        <div className="flex flex-col h-full">
            {/* Comments List - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {comments.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400 text-sm">No comments yet. Be the first to comment!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="space-y-1 animate-in fade-in-0 duration-300">
                            {/* Comment Author and Role - Single Line */}
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-[#001c43] text-sm">
                                    {comment.author}
                                </span>
                                <span className="text-sm">-</span>
                                <span
                                    className={`text-sm font-medium ${comment.role === "Role" || comment.role === "Approver"
                                        ? "text-[#e50019]"
                                        : comment.role === "Requestor" || comment.role === "Requester"
                                            ? "text-[#E50019]"
                                            : "text-gray-600"
                                        }`}
                                >
                                    {comment.role}
                                </span>
                            </div>

                            {/* Comment Text - Gray Box */}
                            <div className="bg-[#f5f5f5] rounded-md p-3 border border-gray-200">
                                <p className="text-sm text-[#001c43]">{comment.text}</p>

                                {/* Comment Attachments */}
                                {comment.attachments && comment.attachments.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {comment.attachments.map((attachment) => (
                                            <div key={attachment.id} className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2">
                                                <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white text-[8px] font-bold">
                                                        {attachment.type.toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-700 flex-1 truncate">{attachment.filename}</span>
                                                <span className="text-[10px] text-gray-400">{attachment.size}</span>
                                                <button
                                                    onClick={() => window.open(attachment.url, '_blank')}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Timestamp Below */}
                            <p className="text-xs text-gray-400">{comment.timestamp}</p>
                        </div>
                    ))
                )}
                <div ref={commentsEndRef} />
            </div>

            {/* Comment Input - Fixed at Bottom */}
            <div className="border-t border-gray-200 p-4 bg-white">
                {/* Attached Files Preview */}
                {attachedFiles && attachedFiles.length > 0 && (
                    <div className="mb-3 space-y-2">
                        {attachedFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                <span className="text-xs text-gray-600 flex-1 truncate">{file.name}</span>
                                <button
                                    onClick={() => onRemoveAttachment(index)}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                onSend();
                            }
                        }}
                        placeholder="Type your comment here..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* File Attachment Button */}
                    <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Link2 className="h-5 w-5 text-gray-600" />
                        <input
                            type="file"
                            multiple
                            onChange={onFileAttach}
                            className="hidden"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                    </label>

                    <button
                        onClick={onSend}
                        disabled={!newComment.trim() && (!attachedFiles || attachedFiles.length === 0)}
                        className="p-2 bg-[#001c43] text-white rounded-lg hover:bg-[#002856] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Journey Tab Content
function JourneyContent({ journey }: { journey: JourneyStep[] }) {
    return (
        <div className="flex-1 overflow-y-auto p-8">
            {journey.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 text-sm">No journey data available</p>
                </div>
            ) : (
                <div className="relative max-w-3xl mx-auto ml-[40px]">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-[35px] top-0 bottom-0 w-[2px] bg-[#d1d5db]" />

                    {journey.map((step, index) => {
                        const isCompleted = step.action === 'Approved' || step.action === 'Submitted' || step.action === 'Completed';
                        const isActive = !isCompleted && step.action !== 'Pending';

                        return (
                            <div key={step.id} className="relative pb-8 last:pb-0   ">
                                {/* Card - 20px padding all around */}
                                <div className="w-[475px] bg-[#F0F0F0] rounded-r-2xl border border-[#8C8B8B] p-5 relative">

                                    {/* TOP SECTION - Circle + Step Name + Timestamp */}
                                    <div className="flex items-center gap-4 mb-10">
                                        {/* Circle */}
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0 ${isCompleted || isActive ? 'bg-[#114B9F]' : 'bg-gray-400'
                                                }`}
                                        >
                                            {index + 1}
                                        </div>

                                        {/* Step Name and Timestamp */}
                                        <div className="flex items-center justify-between flex-1">
                                            <h3 className="text-[#114B9F] font-semibold text-base">
                                                {step.step}
                                            </h3>
                                            <span className="text-xs font-medium text-[#001C43]">
                                                {step.timestamp}
                                            </span>
                                        </div>
                                    </div>

                                    {/* BOTTOM SECTION - Form Received & Assigned Approver (40px gap from top) */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* LEFT COLUMN - Form Received */}
                                        <div>
                                            <p className="text-sm text-[#114B9F] mb-[10px]">Form Received</p>
                                            <p className="text-sm font-bold text-[#001c43]">{step.action}</p>
                                        </div>

                                        {/* RIGHT COLUMN - Assigned Approver */}
                                        <div className="text-right">
                                            <p className="text-sm text-[#114B9F] mb-[10px]">Assigned Approver:</p>
                                            <p className="text-sm font-bold text-[#001c43]">{step.actor}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function MyRequestDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"form" | "comments" | "journey">("form");
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelAttachments, setCancelAttachments] = useState<File[]>([]);

    // Ref for printing
    const printRef = useRef<HTMLDivElement>(null);

    const handleClose = () => {
        navigate(-1);
    };

    // Load request data by ID
    const request = useMemo<RequestDetail | null>(() => {
        if (!id) return null;
        return mockRequestDetails[id] || null;
    }, [id]);

    // Initialize comments when request loads
    useMemo(() => {
        if (request?.comments) {
            setComments(request.comments);
        }
    }, [request]);

    // Handle Download Form using react-to-print
    const handleDownloadForm = useReactToPrint({
        contentRef: printRef,
        documentTitle: request?.referenceNumber || "Form",
        pageStyle: `
            @page {
                size: A4;
                margin: 10mm;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                table {
                    border-collapse: collapse !important;
                }
                thead tr {
                    background-color: #001c43 !important;
                }
                th {
                    color: white !important;
                    background-color: #001c43 !important;
                }
                .bg-gray-100 {
                    background-color: #f3f4f6 !important;
                }
            }
        `,
    });

    // Handle Request to Cancel
    const handleRequestToCancel = () => {
        setShowCancelDialog(true);
    };

    const handleCancelFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setCancelAttachments(prev => [...prev, ...Array.from(files)]);
        }
    };

    const removeCancelAttachment = (index: number) => {
        setCancelAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const confirmCancel = () => {
        if (!cancelReason.trim()) {
            toast.error("Please provide a reason for cancellation");
            return;
        }

        // TODO: Replace with actual API call
        console.log("Cancel reason:", cancelReason);
        console.log("Attachments:", cancelAttachments);

        // Show success toast
        toast.success("Request cancelation submitted Successfully!", {
            duration: 3000,
            style: {
                background: 'white',
                color: '#001c43',
                border: '1px solid #e5e5e5',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
        });

        // Store cancellation in localStorage to update MyRequests page
        const cancelledRequests = JSON.parse(localStorage.getItem("cancelledRequests") || "[]");
        cancelledRequests.push(id);
        localStorage.setItem("cancelledRequests", JSON.stringify(cancelledRequests));

        // Close dialog and reset states
        setShowCancelDialog(false);
        setCancelReason("");
        setCancelAttachments([]);

        // Navigate back after showing toast briefly
        setTimeout(() => {
            navigate(-1);
        }, 1500);
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
                    <p className="text-[#001c43] mb-6">
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

    // Helper function to map file extensions to allowed types
    const getFileType = (filename: string): 'pdf' | 'doc' | 'xls' | 'jpg' | 'png' => {
        const ext = filename.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'pdf':
                return 'pdf';
            case 'doc':
            case 'docx':
                return 'doc';
            case 'xls':
            case 'xlsx':
                return 'xls';
            case 'jpg':
            case 'jpeg':
                return 'jpg';
            case 'png':
                return 'png';
            default:
                return 'pdf';
        }
    };

    const handleSendComment = () => {
        if ((!newComment.trim() && attachedFiles.length === 0) || !request) return;

        const newCommentObj = {
            id: `c${comments.length + 1}`,
            author: "Current User",
            role: "Requester",
            timestamp: new Date().toLocaleString(),
            text: newComment.trim(),
            attachments: attachedFiles.map((file, index) => ({
                id: `att${Date.now()}_${index}`,
                filename: file.name,
                size: `${(file.size / 1024).toFixed(2)} KB`,
                type: getFileType(file.name),
                url: URL.createObjectURL(file),
                date: new Date().toLocaleDateString()
            }))
        };

        setComments([...comments, newCommentObj]);
        setNewComment("");
        setAttachedFiles([]);
    };

    const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setAttachedFiles(Array.from(files));
        }
    };

    const removeAttachment = (index: number) => {
        setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
    };

    return (
        <TooltipProvider delayDuration={300}>
            {/* Modal Overlay */}
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                {/* Modal Container */}
                <div className="bg-[#fcfcfc] rounded-[20px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] w-[95vw] max-w-[1393px] h-[90vh] max-h-[946px] grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_380px] grid-rows-[auto_1fr_auto] lg:grid-rows-[auto_1fr] overflow-hidden">

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

                        {/* Download Form Button Header - Only show on Form tab */}
                        {activeTab === "form" && (
                            <div className="bg-[rgba(0,28,67,0.7)] flex items-center justify-end px-[31px] py-[14px] rounded-tl-[20px] rounded-tr-[20px]">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={() => handleDownloadForm()}
                                            className="bg-[#001c43] flex items-center gap-[10px] px-[16px] py-[6px] rounded-[10px] hover:bg-[#002855] transition-colors"
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
                        )}

                        {/* Form Preview Area */}
                        <div className="bg-white border border-[#b1b1b1] rounded-b-[20px] flex-1 overflow-y-auto">
                            {activeTab === "form" && <FormContent request={request} />}
                            {activeTab === "comments" && (
                                <CommentsContent
                                    comments={comments}
                                    newComment={newComment}
                                    setNewComment={setNewComment}
                                    onSend={handleSendComment}
                                    attachedFiles={attachedFiles}
                                    onFileAttach={handleFileAttach}
                                    onRemoveAttachment={removeAttachment}
                                />
                            )}
                            {activeTab === "journey" && <JourneyContent journey={request?.journey || []} />}
                        </div>

                    </div>

                    {/* RIGHT PANEL */}
                    <div className="col-[1] row-[3] lg:col-[2] lg:row-[1_/_span_2] bg-[#fafafa] border-t lg:border-t-0 lg:border-l border-[#e5e7eb] flex flex-col overflow-hidden max-h-[300px] lg:max-h-none">

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
                                {comments.length > 0 ? (
                                    <div className="space-y-2 mb-3">
                                        <div className="flex items-start justify-between">
                                            <p className="text-xs text-[#001c43]">
                                                <span className="font-medium">{comments[comments.length - 1].author}</span>
                                                <span className="text-[#e50019]"> - {comments[comments.length - 1].role}</span>
                                            </p>
                                            <p className="text-[10px] text-[#9ca3af]">
                                                {comments[comments.length - 1].timestamp}
                                            </p>
                                        </div>
                                        <div className="pl-3 border-l-2 border-[#e5e7eb]">
                                            <div className="bg-white border border-[#e5e7eb] rounded-lg px-3 py-2">
                                                <p className="text-xs text-[#374151]">
                                                    {comments[comments.length - 1].text}
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

            {/* Cancel Request Dialog */}
            {showCancelDialog && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-[20px] p-8 max-w-md w-full mx-4 shadow-xl">
                        {/* Header with Close Button */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-bold text-[#e50019]">
                                Cancel Request
                            </h2>
                            <button
                                onClick={() => {
                                    setShowCancelDialog(false);
                                    setCancelReason("");
                                    setCancelAttachments([]);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Reason Text Area */}
                        <div className="mb-6">
                            <label className="block text-sm text-[#001c43] mb-2">
                                Reason for Cancellation:
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Input..."
                                rows={5}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        {/* Attachments Section */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Link2 className="w-5 h-5 text-[#001c43]" />
                                <span className="text-sm font-medium text-[#001C43]">Attachments</span>
                            </div>

                            {/* File Upload Area */}
                            <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleCancelFileAttach}
                                    className="hidden"
                                    accept=".jpg,.jpeg,.png,.csv,.pdf"
                                />
                                <CloudUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">
                                    <span className="text-[#001C43] font-regular">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-sm text-[#535862] mt-1 font-regular">
                                    JPEG, PNG, CSV, and PDF formats, up to 50MB
                                </p>
                            </label>

                            {/* Attached Files List */}
                            {cancelAttachments.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {cancelAttachments.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                                            <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
                                            <button
                                                onClick={() => removeCancelAttachment(index)}
                                                className="text-red-500 hover:text-red-700 ml-2"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons - Right Aligned */}
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowCancelDialog(false);
                                    setCancelReason("");
                                    setCancelAttachments([]);
                                }}
                                className="w-[84px] h-[40px] bg-white border border-gray-300 text-[#001c43] rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmCancel}
                                className="w-[84px] h-[40px] bg-[#001c43] text-white rounded-lg hover:bg-[#002856] transition-colors font-medium text-sm"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden Print Content - This is what gets printed */}
            <div style={{ display: 'none' }}>
                <div ref={printRef}>
                    <PrintFormContent request={request} />
                </div>
            </div>
        </TooltipProvider>
    );
}