import { toast } from "sonner"
import mapuaLogo from '@/assets/images/mapuaLogo.png'
import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { X, Send, MoveRight, Download, Link, HardDriveDownload, Link2 } from "lucide-react";
import { mockLiquidationDetails, type LiquidationDetail, type LiquidationLineItem } from "@/data/mockLiquidationDetails";
import type { Comment, Attachment, JourneyStep } from "@/data/mockRequestDetails";
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

// Liquidation Form Content Component - The actual liquidation form display (for screen)
function LiquidationFormContent({ request }: { request: LiquidationDetail }) {
    return (
        <div className="bg-white min-h-full p-8">
            {/* Header with Logo and Title */}
            <div className="grid grid-cols-3 items-center pb-4 mb-8 border-b border-gray-300">
                {/* Left: Logo */}
                <div className="flex items-center">
                    <img
                        src={mapuaLogo}
                        alt="MAPUA Logo"
                        className="w-[284px] h-[108px] object-contain"
                    />
                </div>

                {/* Center: Title */}
                <div className="flex justify-center">
                    <h1 className="text-[#001c43] font-bold text-[32px] leading-normal">Liquidation Report</h1>
                </div>

                {/* Right: Reference Number */}
                <div className="flex justify-end items-end">
                    <p className="text-[#001c43] text-[16px] font-semibold tracking-[-0.32px]">{request.referenceNumber}</p>
                </div>
            </div>

            <div className="border-b border-gray-300 mb-8" />

            {/* Requester Information Section */}
            <div className="bg-white rounded-[20px] p-[20px] mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[#001c43] font-semibold text-[20px] leading-[28px]">Requester Information</h2>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                        <p className="text-[#001c43] font-bold text-[14px] leading-[20px] mb-[10px]">Requested By</p>
                        <p className="text-[#001c43] text-[14px] leading-[20px]">{request.requesterInfo.requestedBy}</p>
                    </div>
                    <div>
                        <p className="text-[#001c43] font-bold text-[14px] leading-[20px] mb-[10px]">Department</p>
                        <p className="text-[#001c43] text-[14px] leading-[20px]">{request.requesterInfo.department}</p>
                    </div>
                </div>
            </div>

            <div className="border-b border-gray-300 mb-8" />

            {/* Request Details Section */}
            <div className="bg-white rounded-[20px] p-[20px] mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[#001c43] font-semibold text-[20px] leading-[28px]">Request Details</h2>
                </div>

                <div className="mb-4">
                    <p className="text-[#001c43] font-bold text-[14px] leading-[20px] mb-[10px]">Cash Advance Form</p>
                    <p className="text-[#001c43] text-[14px] leading-[20px]">{request.requestDetailsInfo.cashAdvanceForm}</p>
                </div>

                <div className="mb-4">
                    <p className="text-[#001c43] font-bold text-[14px] leading-[20px] mb-[10px]">Description/Purpose</p>
                    <p className="text-[#001c43] text-[14px] leading-[20px]">{request.requestDetailsInfo.descriptionPurpose}</p>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                    <div>
                        <p className="text-[#001c43] font-bold text-[14px] leading-[20px] mb-[10px]">Source of Fund</p>
                        <p className="text-[#001c43] text-[14px] leading-[20px]">{request.requestDetailsInfo.sourceOfFund}</p>
                    </div>
                    <div>
                        <p className="text-[#001c43] font-bold text-[14px] leading-[20px] mb-[10px]">Cost Center</p>
                        <p className="text-[#001c43] text-[14px] leading-[20px]">{request.requestDetailsInfo.costCenter}</p>
                    </div>
                    <div>
                        <p className="text-[#001c43] font-bold text-[14px] leading-[20px] mb-[10px]">Date Requested</p>
                        <p className="text-[#001c43] text-[14px] leading-[20px]">{request.requestDetailsInfo.dateRequested}</p>
                    </div>
                    <div>
                        <p className="text-[#001c43] font-bold text-[14px] leading-[20px] mb-[10px]">Date Needed</p>
                        <p className="text-[#001c43] text-[14px] leading-[20px]">{request.requestDetailsInfo.dateNeeded}</p>
                    </div>
                    <div>
                        <p className="text-[#001c43] font-bold text-[14px] leading-[20px] mb-[10px]">Date Start</p>
                        <p className="text-[#001c43] text-[14px] leading-[20px]">{request.requestDetailsInfo.dateStart}</p>
                    </div>
                    <div>
                        <p className="text-[#001c43] font-bold text-[14px] leading-[20px] mb-[10px]">Date End</p>
                        <p className="text-[#001c43] text-[14px] leading-[20px]">{request.requestDetailsInfo.dateEnd}</p>
                    </div>
                </div>

                {/* Line Items Table */}
                <div className="overflow-hidden rounded-[12px]">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#001c43] text-white">
                                <th className="py-[12px] px-[24px] text-center font-bold text-[14px] leading-[20px] border-b border-[#fcfcfc]">Line/Item</th>
                                <th className="py-[12px] px-[24px] text-center font-bold text-[14px] leading-[20px] border-b border-[#fcfcfc]">Category</th>
                                <th className="py-[12px] px-[24px] text-center font-bold text-[14px] leading-[20px] border-b border-[#fcfcfc]">Activity/Description</th>
                                <th className="py-[12px] px-[24px] text-center font-bold text-[14px] leading-[20px] border-b border-[#fcfcfc]">Quantity</th>
                                <th className="py-[12px] px-[24px] text-center font-bold text-[14px] leading-[20px] border-b border-[#fcfcfc]">UOM</th>
                                <th className="py-[12px] px-[24px] text-center font-bold text-[14px] leading-[20px] border-b border-[#fcfcfc]">Price</th>
                                <th className="py-[12px] px-[24px] text-center font-bold text-[14px] leading-[20px] border-b border-[#fcfcfc]">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {request.lineItems.map((item, index) => (
                                <tr key={index} className="bg-[#fcfcfc] border-b border-[#fcfcfc] last:border-b-0">
                                    <td className="py-[12px] px-[24px] text-[#001c43] text-[14px] font-bold leading-[20px] text-center">{item.lineNumber}</td>
                                    <td className="py-[12px] px-[24px] text-[#001c43] text-[14px] font-bold leading-[20px]">{item.category}</td>
                                    <td className="py-[12px] px-[24px] text-[#001c43] text-[14px] font-bold leading-[20px]">{item.activityDescription}</td>
                                    <td className="py-[12px] px-[24px] text-[#001c43] text-[14px] font-bold leading-[20px] text-center">{item.quantity}</td>
                                    <td className="py-[12px] px-[24px] text-[#001c43] text-[14px] font-bold leading-[20px] text-center">{item.uom}</td>
                                    <td className="py-[12px] px-[24px] text-[#001c43] text-[14px] font-bold leading-[20px] text-center">{formatNumber(item.price)}</td>
                                    <td className="py-[12px] px-[24px] text-[#001c43] text-[14px] font-bold leading-[20px] text-center">{formatNumber(item.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="border-b border-gray-300 mb-8" />

            {/* Amount Summary */}
            <div className="mb-8 bg-[#ececec] p-6 rounded-[20px]">
                <div className="flex justify-between items-start">
                    <div className="text-[14px] leading-[20px] text-[#001c43]">
                        <span className="font-bold">Currency: {request.amountSummary.currency}</span>
                    </div>
                    <div className="text-right space-y-3 min-w-[300px]">
                        <div className="flex justify-between gap-8">
                            <span className="text-[#001c43] text-[14px] leading-[20px] font-bold">Total Amount</span>
                            <span className="text-[#001c43] text-[14px] leading-[20px] font-bold">{formatNumber(request.amountSummary.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between gap-8">
                            <span className="text-[#001c43] text-[14px] leading-[20px] font-bold">Cash Advance</span>
                            <span className="text-[#001c43] text-[14px] leading-[20px] font-bold">{formatNumber(request.amountSummary.cashAdvance)}</span>
                        </div>
                        <div className="border-t-2 border-[#b1b1b1] pt-3 mt-3">
                            <div className="flex justify-between gap-8">
                                <span className="text-[#001c43] text-[14px] leading-[20px] font-bold">Amount to Return/(Refund)</span>
                                <span className="text-[#001c43] text-[14px] leading-[20px] font-bold">{formatNumber(request.amountSummary.amountToReturn)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b border-gray-300 mb-8" />

            {/* Attachments Section */}
            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-[10px]">
                    <Link className="w-[24px] h-[24px] text-[#001c43]" />
                    <p className="text-[#001c43] text-[14px] leading-[20px] font-normal">Attachments</p>
                </div>

                <div className="border border-[#001c43] rounded-[20px] p-[10px] min-w-[541px]">
                    {request.attachments.length > 0 ? (
                        <div className="space-y-2">
                            {request.attachments.map((attachment) => (
                                <div key={attachment.id} className="flex items-center gap-[10px] px-[20px] py-0">
                                    <div className="w-[17px] h-[17px] flex-shrink-0">
                                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                                            <path d="M9.5 2.5H4.5C4.10218 2.5 3.72064 2.65804 3.43934 2.93934C3.15804 3.22064 3 3.60218 3 4V13C3 13.3978 3.15804 13.7794 3.43934 14.0607C3.72064 14.342 4.10218 14.5 4.5 14.5H12.5C12.8978 14.5 13.2794 14.342 13.5607 14.0607C13.842 13.7794 14 13.3978 14 13V7L9.5 2.5Z" stroke="#001C43" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M9.5 2.5V7H14" stroke="#001C43" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <p className="text-[#001c43] text-[14px] font-medium leading-[20px]">{attachment.filename}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[#9ca3af] text-sm text-center py-2">No attachments</p>
                    )}
                </div>
            </div>

        </div>
    );
}

// Print-optimized Liquidation Form Content
function PrintLiquidationFormContent({ request }: { request: LiquidationDetail }) {
    return (
        <div className="bg-white p-4 text-[9px]">
            {/* Header */}
            <div className="grid grid-cols-3 items-center pb-2 mb-3 border-b border-gray-300">
                <img src={mapuaLogo} alt="MAPUA Logo" className="w-[80px] h-auto object-contain" />
                <h1 className="text-[#001c43] font-bold text-[16px] text-center">Liquidation Report</h1>
                <p className="text-[#001c43] text-[9px] font-medium text-right">{request.referenceNumber}</p>
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
                    <p className="text-[#001c43] font-bold">Cash Advance Form</p>
                    <p className="text-[#001c43]">{request.requestDetailsInfo.cashAdvanceForm}</p>
                </div>
                <div className="mb-2">
                    <p className="text-[#001c43] font-bold">Description/Purpose</p>
                    <p className="text-[#001c43]">{request.requestDetailsInfo.descriptionPurpose}</p>
                </div>
                <div className="grid grid-cols-3 gap-x-4 gap-y-1 mb-2">
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
                    <div>
                        <p className="text-[#001c43] font-bold">Date Start</p>
                        <p className="text-[#001c43]">{request.requestDetailsInfo.dateStart}</p>
                    </div>
                    <div>
                        <p className="text-[#001c43] font-bold">Date End</p>
                        <p className="text-[#001c43]">{request.requestDetailsInfo.dateEnd}</p>
                    </div>
                </div>

                {/* Line Items Table */}
                <table className="w-full border-collapse text-[8px] border border-gray-200">
                    <thead>
                        <tr className="bg-[#001c43] text-white">
                            <th className="py-1 px-1 text-center font-bold border border-gray-300">Line/Item</th>
                            <th className="py-1 px-1 text-center font-bold border border-gray-300">Category</th>
                            <th className="py-1 px-1 text-center font-bold border border-gray-300">Activity/Description</th>
                            <th className="py-1 px-1 text-center font-bold border border-gray-300">Quantity</th>
                            <th className="py-1 px-1 text-center font-bold border border-gray-300">UOM</th>
                            <th className="py-1 px-1 text-center font-bold border border-gray-300">Price</th>
                            <th className="py-1 px-1 text-center font-bold border border-gray-300">Amount</th>
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
                                <td className="py-1 px-1 text-[#001c43] text-center border border-gray-200">{formatNumber(item.price)}</td>
                                <td className="py-1 px-1 text-[#001c43] text-center border border-gray-200">{formatNumber(item.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="border-b border-gray-300 mb-3" />

            {/* Amount Summary */}
            <div className="mb-3 bg-gray-100 p-3 rounded">
                <div className="flex justify-between">
                    <p className="text-[#001c43] font-bold">Currency: {request.amountSummary.currency}</p>
                    <div className="text-right space-y-1">
                        <div className="flex justify-between gap-4">
                            <span className="text-[#001c43] font-bold">Total Amount</span>
                            <span className="text-[#001c43]">{formatNumber(request.amountSummary.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-[#001c43] font-bold">Cash Advance</span>
                            <span className="text-[#001c43]">{formatNumber(request.amountSummary.cashAdvance)}</span>
                        </div>
                        <div className="border-t border-gray-300 pt-1 mt-1">
                            <div className="flex justify-between gap-4">
                                <span className="text-[#001c43] font-bold text-[10px]">Amount to Return/(Refund)</span>
                                <span className="text-[#001c43] font-bold text-[10px]">{formatNumber(request.amountSummary.amountToReturn)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Comments Tab Content (Same as RequestDetails)
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

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useMemo(() => {
        scrollToBottom();
    }, [comments]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {comments.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400 text-sm">No comments yet. Be the first to comment!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="space-y-1 animate-in fade-in-0 duration-300">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-[#001c43] text-sm">{comment.author}</span>
                                <span className="text-sm">-</span>
                                <span className="text-sm font-medium text-[#e50019]">{comment.role}</span>
                            </div>
                            <div className="bg-[#f5f5f5] rounded-md p-3 border border-gray-200">
                                <p className="text-sm text-[#001c43]">{comment.text}</p>
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
                                                <button onClick={() => window.open(attachment.url, '_blank')} className="text-blue-600 hover:text-blue-800">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-400">{comment.timestamp}</p>
                        </div>
                    ))
                )}
                <div ref={commentsEndRef} />
            </div>

            <div className="border-t border-gray-200 p-4 bg-white">
                {attachedFiles && attachedFiles.length > 0 && (
                    <div className="mb-3 space-y-2">
                        {attachedFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                <span className="text-xs text-gray-600 flex-1 truncate">{file.name}</span>
                                <button onClick={() => onRemoveAttachment(index)} className="text-red-500 hover:text-red-700 text-xs">✕</button>
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
                    <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Link className="h-5 w-5 text-gray-600" />
                        <input type="file" multiple onChange={onFileAttach} className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
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

// Journey Tab Content (Same as RequestDetails)
// function JourneyContent({ journey }: { journey: JourneyStep[] }) {
//     return (
//         <div className="flex-1 overflow-y-auto p-8">
//             {journey.length === 0 ? (
//                 <div className="flex items-center justify-center h-full">
//                     <p className="text-gray-400 text-sm">No journey data available</p>
//                 </div>
//             ) : (
//                 <div className="relative max-w-3xl mx-auto ml-[40px]">
//                     <div className="absolute left-[35px] top-0 bottom-0 w-[2px] bg-[#d1d5db]" />
//                     {journey.map((step, index) => {
//                         const isCompleted = step.action === 'Approved' || step.action === 'Submitted' || step.action === 'Completed';
//                         const isActive = !isCompleted && step.action !== 'Pending';

//                         return (
//                             <div key={step.id} className="relative pb-8 last:pb-0">
//                                 <div className="w-[475px] bg-[#F0F0F0] rounded-r-2xl border border-[#8C8B8B] p-5 relative">
//                                     <div className="flex items-center gap-4 mb-10">
//                                         <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0 ${isCompleted || isActive ? 'bg-[#114B9F]' : 'bg-gray-400'}`}>
//                                             {index + 1}
//                                         </div>
//                                         <div className="flex items-center justify-between flex-1">
//                                             <h3 className="text-[#114B9F] font-semibold text-base">{step.step}</h3>
//                                             <span className="text-xs font-medium text-[#001C43]">{step.timestamp}</span>
//                                         </div>
//                                     </div>
//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div>
//                                             <p className="text-sm text-[#114B9F] mb-[10px]">Form Received</p>
//                                             <p className="text-sm font-bold text-[#001c43]">{step.action}</p>
//                                         </div>
//                                         <div className="text-right">
//                                             <p className="text-sm text-[#114B9F] mb-[10px]">Assigned Approver:</p>
//                                             <p className="text-sm font-bold text-[#001c43]">{step.actor}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// }

export default function LiquidationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"form" | "comments" | "journey">("form");
    const [commentText, setCommentText] = useState("");
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

    const printRef = useRef<HTMLDivElement>(null);

    const handleClose = () => {
        navigate(-1);
    };

    const request = useMemo<LiquidationDetail | null>(() => {
        if (!id) return null;
        return mockLiquidationDetails[id] || null;
    }, [id]);

    useMemo(() => {
        if (request?.comments) {
            setComments(request.comments);
        }
    }, [request]);

    const handleDownloadForm = useReactToPrint({
        contentRef: printRef,
        documentTitle: request?.referenceNumber || "Liquidation Form",
        pageStyle: `
            @page { size: A4; margin: 10mm; }
            @media print {
                body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                table { border-collapse: collapse !important; }
                thead tr { background-color: #001c43 !important; }
                th { color: white !important; background-color: #001c43 !important; }
                .bg-gray-100 { background-color: #f3f4f6 !important; }
            }
        `,
    });

    const handleCommentSubmit = () => {
        if (commentText.trim()) {
            console.log("Comment submitted:", commentText);
            setCommentText("");
        }
    };

    const handleViewFullComments = () => {
        setActiveTab("comments");
    };

    if (!id) {
        return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-[20px] p-8 max-w-md">
                    <h2 className="text-xl font-bold text-[#e50019] mb-4">Invalid Request</h2>
                    <p className="text-[#001c43] mb-6">No request ID provided.</p>
                    <button onClick={handleClose} className="bg-[#001c43] text-white px-6 py-2 rounded-lg hover:bg-[#002855] transition-colors">
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
                    <p className="text-[#001c43] mb-6">Liquidation request with ID "{id}" could not be found.</p>
                    <button onClick={handleClose} className="bg-[#001c43] text-white px-6 py-2 rounded-lg hover:bg-[#002855] transition-colors">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const getFileType = (filename: string): 'pdf' | 'doc' | 'xls' | 'jpg' | 'png' => {
        const ext = filename.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'pdf': return 'pdf';
            case 'doc':
            case 'docx': return 'doc';
            case 'xls':
            case 'xlsx': return 'xls';
            case 'jpg':
            case 'jpeg': return 'jpg';
            case 'png': return 'png';
            default: return 'pdf';
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

    const handleLiquidateRequest = () => {
        toast.success('Liquidation request processed successfully!', {
            duration: 3000,
        });
        setTimeout(() => {
            navigate('/liquidation');
        }, 1500);
    };

    return (
        <TooltipProvider delayDuration={300}>
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-[#fcfcfc] rounded-[20px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] w-[95vw] max-w-[1393px] h-[90vh] max-h-[946px] grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_380px] grid-rows-[auto_1fr_auto] lg:grid-rows-[auto_1fr] overflow-hidden">

                    {/* LEFT PANEL - TABS */}
                    <div className="col-[1] row-[1] p-4 flex justify-center">
                        <div className="bg-[#f4f4f5] p-[3px] rounded-[6px] flex items-center">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => setActiveTab("form")}
                                        className={`px-[60px] py-[4px] rounded-[4px] text-[13px] leading-[18px] transition-all ${activeTab === "form" ? "bg-white text-[#09090b] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]" : "text-[#71717a]"}`}
                                    >
                                        Form
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent><p>View form details</p></TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => setActiveTab("comments")}
                                        className={`px-[60px] py-[4px] rounded-[4px] text-[13px] leading-[18px] transition-all ${activeTab === "comments" ? "bg-white text-[#09090b] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]" : "text-[#71717a]"}`}
                                    >
                                        Comments
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent><p>View all comments</p></TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => setActiveTab("journey")}
                                        className={`px-[60px] py-[4px] rounded-[4px] text-[13px] leading-[18px] transition-all ${activeTab === "journey" ? "bg-white text-[#09090b] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]" : "text-[#71717a]"}`}
                                    >
                                        Journey
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent><p>View workflow journey</p></TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    {/* LEFT PANEL - MAIN CONTENT */}
                    <div className="col-[1] row-[2] flex flex-col gap-[10px] p-[20px] pt-0 overflow-hidden">
                        {activeTab === "form" && (
                            <div className="bg-[rgba(0,28,67,0.7)] flex items-center justify-end px-[31px] py-[14px] rounded-tl-[20px] rounded-tr-[20px]">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button onClick={() => handleDownloadForm()} className="bg-[#001c43] flex items-center gap-[10px] px-[16px] py-[6px] rounded-[10px] hover:bg-[#002855] transition-colors">
                                            <HardDriveDownload className="w-[18px] h-[18px] text-white" />
                                            <p className="text-[14px] text-white leading-[20px]">Download Form</p>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Download or print this form</p></TooltipContent>
                                </Tooltip>
                            </div>
                        )}

                        <div className="bg-white border border-[#b1b1b1] rounded-b-[20px] flex-1 overflow-y-auto">
                            {activeTab === "form" && <LiquidationFormContent request={request} />}
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
                            {/* {activeTab === "journey" && <JourneyContent journey={request?.journey || []} />} */}
                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="col-[1] row-[3] lg:col-[2] lg:row-[1_/_span_2] bg-[#fafafa] border-t lg:border-t-0 lg:border-l border-[#e5e7eb] flex flex-col overflow-hidden max-h-[300px] lg:max-h-none">
                        <div className="p-4 border-b border-[#e5e7eb] flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <span className="text-[#001c43] text-sm font-medium">Workflow Status:</span>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="bg-[rgba(139,139,139,0.1)] border border-[#8c8b8b] text-[#8c8b8b] px-3 py-1 rounded-lg text-xs font-medium cursor-default">
                                            {request.status}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Current status: {request.status}</p></TooltipContent>
                                </Tooltip>
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors">
                                        <X className="w-5 h-5 text-[#001c43]" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent><p>Close</p></TooltipContent>
                            </Tooltip>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <div className="p-4 border-b border-[#e5e7eb]">
                                <h3 className="font-semibold text-base text-[#001c43] mb-3">Approver</h3>
                                <div className="flex items-center gap-3">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] flex items-center justify-center flex-shrink-0 cursor-default">
                                                <span className="text-white font-semibold text-lg">{request.approver.initials}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent><p>{request.approver.name}</p></TooltipContent>
                                    </Tooltip>
                                    <div className="flex flex-col">
                                        <p className="text-sm text-[#001c43] font-medium">{request.approver.name}</p>
                                        <p className="text-sm text-[#e50019]">{request.approver.role}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-b border-[#e5e7eb]">
                                <p className="text-sm text-[#001c43] font-medium mb-2">Recent Comments:</p>
                                {comments.length > 0 ? (
                                    <div className="space-y-2 mb-3">
                                        <div className="flex items-start justify-between">
                                            <p className="text-xs text-[#001c43]">
                                                <span className="font-medium">{comments[comments.length - 1].author}</span>
                                                <span className="text-[#e50019]"> - {comments[comments.length - 1].role}</span>
                                            </p>
                                            <p className="text-[10px] text-[#9ca3af]">{comments[comments.length - 1].timestamp}</p>
                                        </div>
                                        <div className="pl-3 border-l-2 border-[#e5e7eb]">
                                            <div className="bg-white border border-[#e5e7eb] rounded-lg px-3 py-2">
                                                <p className="text-xs text-[#374151]">{comments[comments.length - 1].text}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-[#9ca3af] mb-2">No comments yet</p>
                                )}

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button onClick={handleViewFullComments} className="flex items-center gap-1 text-[#9ca3af] hover:text-[#6b7280] transition-colors mb-3">
                                            <span className="text-xs">View full comments history</span>
                                            <MoveRight className="w-4 h-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>View all comments</p></TooltipContent>
                                </Tooltip>

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
                                            <button onClick={handleCommentSubmit} className="w-9 h-9 flex items-center justify-center hover:bg-[#001c43] hover:text-white rounded-lg transition-colors text-[#001c43]">
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent><p>Send comment</p></TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Link2 className="w-5 h-5 text-[#001c43]" />
                                    <h3 className="text-sm text-[#001c43] font-medium">Attachments</h3>
                                </div>
                                <div className="space-y-2">
                                    {request.attachments.length > 0 ? (
                                        request.attachments.map((attachment) => (
                                            <div key={attachment.id} className="bg-white border border-[#e5e7eb] rounded-lg p-3 flex items-center gap-3 hover:border-[#001c43] transition-colors">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="w-10 h-10 bg-[#ef4444] rounded flex items-center justify-center flex-shrink-0 cursor-default">
                                                            <span className="text-white font-bold text-[10px]">{attachment.type.toUpperCase()}</span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent><p>{attachment.type.toUpperCase()} file</p></TooltipContent>
                                                </Tooltip>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-[#001c43] font-medium truncate">{attachment.filename}</p>
                                                    <p className="text-xs text-[#9ca3af]">{attachment.size} • {attachment.date}</p>
                                                </div>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button onClick={() => window.open(attachment.url, '_blank')} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors flex-shrink-0">
                                                            <Download className="w-4 h-4 text-[#001c43]" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent><p>Download {attachment.filename}</p></TooltipContent>
                                                </Tooltip>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-[#9ca3af]">No attachments</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Liquidate Request Button */}
                        <div className="p-4 border-t border-[#e5e7eb] flex-shrink-0">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={handleLiquidateRequest}
                                        className="w-full border border-[#fbc421] bg-transparent text-[#ffcd00] font-bold text-[16px] py-3 rounded-xl hover:bg-[#fbc421] hover:text-[#001c43] transition-colors"
                                    >
                                        Liquidate Request
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent><p>Process liquidation request</p></TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden Print Content */}
            <div style={{ display: 'none' }}>
                <div ref={printRef}>
                    <PrintLiquidationFormContent request={request} />
                </div>
            </div>
        </TooltipProvider>
    );
}