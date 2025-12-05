import { toast } from "sonner"
import mapuaLogo from '@/assets/images/mapuaLogo.png'
import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { X, Send, MoveRight, Download, Link, HardDriveDownload, Link2 } from "lucide-react";
import { mockLiquidationDetails, type LiquidationDetail, type LiquidationLineItem } from "@/data/mockLiquidationDetails";
import type { Comment, Attachment, JourneyStep } from "@/data/mockRequestDetails";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
            {/* === HEADER SECTION === */}
            <div className="grid grid-cols-3 items-end h-[100px] gap-[10px] mb-8">
                {/* Logo */}
                <div className="flex items-start">
                    <img
                        src={mapuaLogo}
                        alt="MAPUA Logo"
                        className="h-[108px] w-auto object-contain"
                    />
                </div>

                {/* Title */}
                <div className="flex items-end justify-center pb-[10px]">
                    <h2 className="font-['DM_Sans'] font-bold text-[32px] leading-[normal] text-[#001c43] text-center">
                        Liquidation Report
                    </h2>
                </div>

                {/* Reference Number */}
                <div className="flex items-end justify-end pb-[10px]">
                    <p className="font-['Montserrat'] font-semibold text-[16px] leading-none text-[#001c43] tracking-[-0.32px]">
                        {request.referenceNumber}
                    </p>
                </div>
            </div>

            {/* Separator */}
            <div className="h-[2px] bg-[#b1b1b1] mb-8" />

            {/* === REQUESTER INFORMATION SECTION === */}
            <div className="bg-white rounded-[20px] p-[20px] border border-transparent mb-8">
                <div className="grid grid-cols-2 gap-y-[10px]">
                    {/* Section Title */}
                    <div className="col-span-2">
                        <h3 className="font-['Montserrat'] font-semibold text-[20px] leading-[28px] text-[#001c43] mb-[10px]">
                            Requester Information
                        </h3>
                    </div>

                    {/* Requested By */}
                    <div className="col-span-1 flex flex-col gap-[10px] px-[20px]">
                        <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                            Requested By
                        </p>
                        <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                            {request.requesterInfo.requestedBy}
                        </p>
                    </div>

                    {/* Department */}
                    <div className="col-span-1 flex flex-col gap-[10px] px-[20px]">
                        <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                            Department
                        </p>
                        <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                            {request.requesterInfo.department}
                        </p>
                    </div>
                </div>
            </div>

            {/* Separator */}
            <div className="h-[2px] bg-[#b1b1b1] mb-8" />

            {/* === REQUEST DETAILS SECTION === */}
            <div className="bg-white rounded-[20px] p-[20px] border border-transparent mb-8">
                <div className="grid grid-cols-2 gap-y-[10px]">
                    {/* Section Title */}
                    <div className="col-span-2">
                        <h3 className="font-['Montserrat'] font-semibold text-[20px] leading-[28px] text-[#001c43] mb-[10px]">
                            Request Details
                        </h3>
                    </div>

                    {/* Cash Advance Form */}
                    <div className="col-span-2 flex flex-col gap-[10px] px-[20px]">
                        <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                            Cash Advance Form
                        </p>
                        <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                            {request.requestDetailsInfo.cashAdvanceForm}
                        </p>
                    </div>

                    {/* Description/Purpose */}
                    <div className="col-span-2 flex flex-col gap-[10px] px-[20px]">
                        <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                            Description/Purpose
                        </p>
                        <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                            {request.requestDetailsInfo.descriptionPurpose}
                        </p>
                    </div>

                    {/* Source of Fund */}
                    <div className="col-span-1 flex flex-col gap-[10px] px-[20px]">
                        <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                            Source of Fund
                        </p>
                        <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                            {request.requestDetailsInfo.sourceOfFund}
                        </p>
                    </div>

                    {/* Cost Center */}
                    <div className="col-span-1 flex flex-col gap-[10px] px-[20px]">
                        <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                            Cost Center
                        </p>
                        <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                            {request.requestDetailsInfo.costCenter}
                        </p>
                    </div>

                    {/* Date Requested */}
                    <div className="col-span-1 flex flex-col gap-[10px] px-[20px]">
                        <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                            Date Requested
                        </p>
                        <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                            {request.requestDetailsInfo.dateRequested}
                        </p>
                    </div>

                    {/* Date Needed */}
                    <div className="col-span-1 flex flex-col gap-[10px] px-[20px]">
                        <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                            Date Needed
                        </p>
                        <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                            {request.requestDetailsInfo.dateNeeded}
                        </p>
                    </div>

                    {/* Date Start */}
                    <div className="col-span-1 flex flex-col gap-[10px] px-[20px]">
                        <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                            Date Start
                        </p>
                        <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                            {request.requestDetailsInfo.dateStart}
                        </p>
                    </div>

                    {/* Date End */}
                    <div className="col-span-1 flex flex-col gap-[10px] px-[20px]">
                        <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                            Date End
                        </p>
                        <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                            {request.requestDetailsInfo.dateEnd}
                        </p>
                    </div>

                    {/* Line Items Table - Full Width */}
                    <div className="col-span-2 px-[20px] mt-[10px]">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#001c43] hover:bg-[#001c43]">
                                    <TableHead className="text-white font-['Montserrat'] font-bold text-[14px] text-center border-b border-white rounded-tl-[12px]">
                                        Line/Item
                                    </TableHead>
                                    <TableHead className="text-white font-['Montserrat'] font-bold text-[14px] text-center border-b border-white">
                                        Category
                                    </TableHead>
                                    <TableHead className="text-white font-['Montserrat'] font-bold text-[14px] text-center border-b border-white">
                                        Activity/Description
                                    </TableHead>
                                    <TableHead className="text-white font-['Montserrat'] font-bold text-[14px] text-center border-b border-white">
                                        Quantity
                                    </TableHead>
                                    <TableHead className="text-white font-['Montserrat'] font-bold text-[14px] text-center border-b border-white">
                                        UOM
                                    </TableHead>
                                    <TableHead className="text-white font-['Montserrat'] font-bold text-[14px] text-center border-b border-white">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-white font-['Montserrat'] font-bold text-[14px] text-center border-b border-white rounded-tr-[12px]">
                                        Amount
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {request.lineItems.map((item, index) => (
                                    <TableRow key={index} className="hover:bg-white">
                                        <TableCell className="text-center font-['Montserrat'] font-bold text-[14px] text-[#001c43] border-b border-white">
                                            {item.lineNumber}
                                        </TableCell>
                                        <TableCell className="font-['Montserrat'] font-bold text-[14px] text-[#001c43] border-b border-white">
                                            {item.category}
                                        </TableCell>
                                        <TableCell className="font-['Montserrat'] font-bold text-[14px] text-[#001c43] border-b border-white">
                                            {item.activityDescription}
                                        </TableCell>
                                        <TableCell className="text-center font-['Montserrat'] font-bold text-[14px] text-[#001c43] border-b border-white">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell className="font-['Montserrat'] font-bold text-[14px] text-[#001c43] border-b border-white">
                                            {item.uom}
                                        </TableCell>
                                        <TableCell className="text-center font-['Montserrat'] font-bold text-[14px] text-[#001c43] border-b border-white">
                                            {formatNumber(item.price)}
                                        </TableCell>
                                        <TableCell className="text-center font-['Montserrat'] font-bold text-[14px] text-[#001c43] border-b border-white">
                                            {formatNumber(item.amount)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Separator */}
            <div className="h-[2px] bg-[#b1b1b1] mb-8" />

            {/* === AMOUNT SUMMARY SECTION === */}
            <div className="bg-[#ececec] rounded-[20px] p-[20px] mb-8">
                <div className="grid grid-cols-2 gap-y-[10px] px-[20px]">
                    {/* Currency */}
                    <div className="col-span-1 flex items-center gap-[10px]">
                        <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                            Currency:
                        </p>
                        <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                            {request.amountSummary.currency}
                        </p>
                    </div>

                    {/* Total Amount */}
                    <div className="col-span-1 grid grid-cols-2 gap-[10px]">
                        <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43] text-right">
                            Total Amount
                        </p>
                        <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43] text-right">
                            {formatNumber(request.amountSummary.totalAmount)}
                        </p>
                    </div>

                    {/* Empty cell for spacing */}
                    <div className="col-span-1" />

                    {/* Cash Advance */}
                    <div className="col-span-1 grid grid-cols-2 gap-[10px]">
                        <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43] text-right">
                            Cash Advance
                        </p>
                        <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43] text-right">
                            {formatNumber(request.amountSummary.cashAdvance)}
                        </p>
                    </div>

                    {/* Separator line */}
                    <div className="col-span-1" />
                    <div className="col-span-1">
                        <div className="h-[2px] bg-[#b1b1b1]" />
                    </div>

                    {/* Empty cell for spacing */}
                    <div className="col-span-1" />

                    {/* Amount to Return/(Refund) */}
                    <div className="col-span-1 grid grid-cols-2 gap-[10px]">
                        <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43] text-right">
                            Amount to Return/(Refund)
                        </p>
                        <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43] text-right">
                            {formatNumber(request.amountSummary.amountToReturn)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Separator */}
            <div className="h-[2px] bg-[#b1b1b1] mb-8" />

            {/* === ATTACHMENTS SECTION === */}
            <div className="flex items-start px-[20px] py-[10px]">
                {/* Attachments Button */}
                <div className="flex items-center">
                    <button className="bg-white border-0 rounded-[16px] px-[41px] py-[16px] flex items-center gap-[10px] h-[36px] hover:bg-gray-50 transition-colors">
                        <Link2 className="w-[24px] h-[24px] text-[#001c43]" />
                        <span className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                            Attachments
                        </span>
                    </button>
                </div>

                {/* 85px gap */}
                <div className="w-[85px]" />

                {/* Attachments List */}
                <div className="border border-[#001c43] rounded-[20px] p-[20px] w-[541px] flex flex-col gap-[10px]">
                    {request.attachments.length > 0 ? (
                        request.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center gap-[10px]">
                                <div className="w-[17px] h-[17px] flex-shrink-0">
                                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                                        <path d="M9.5 2.5H4.5C4.10218 2.5 3.72064 2.65804 3.43934 2.93934C3.15804 3.22064 3 3.60218 3 4V13C3 13.3978 3.15804 13.7794 3.43934 14.0607C3.72064 14.342 4.10218 14.5 4.5 14.5H12.5C12.8978 14.5 13.2794 14.342 13.5607 14.0607C13.842 13.7794 14 13.3978 14 13V7L9.5 2.5Z" stroke="#001C43" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9.5 2.5V7H14" stroke="#001C43" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="font-['Montserrat'] font-medium text-[14px] leading-[20px] text-[#001c43]">
                                    {attachment.filename}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-[#9ca3af] text-sm text-center py-2">No attachments</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// === PRINT VERSION WITH ATTACHMENTS AT THE BOTTOM ===
function PrintLiquidationFormContent({ request }: { request: LiquidationDetail }) {
    return (
        <div className="bg-white p-6 text-[10px]">
            {/* === HEADER SECTION === */}
            <div className="grid grid-cols-3 items-end h-[80px] gap-[8px] mb-5">
                {/* Logo */}
                <div className="flex items-start">
                    <img
                        src={mapuaLogo}
                        alt="MAPUA Logo"
                        className="h-[80px] w-auto object-contain"
                    />
                </div>

                {/* Title */}
                <div className="flex items-end justify-center pb-[6px]">
                    <h2 className="font-['DM_Sans'] font-bold text-[20px] leading-[normal] text-[#001c43] text-center">
                        Liquidation Report
                    </h2>
                </div>

                {/* Reference Number */}
                <div className="flex items-end justify-end pb-[6px]">
                    <p className="font-['Montserrat'] font-semibold text-[10px] leading-none text-[#001c43] tracking-[-0.32px]">
                        {request.referenceNumber}
                    </p>
                </div>
            </div>

            {/* Separator */}
            <div className="h-[2px] bg-[#b1b1b1] mb-5" />

            {/* === REQUESTER INFORMATION SECTION === */}
            <div className="bg-white rounded-[12px] p-[14px] border border-transparent mb-5">
                <div className="grid grid-cols-2 gap-y-[10px]">
                    {/* Section Title */}
                    <div className="col-span-2 mb-[6px]">
                        <h3 className="font-['Montserrat'] font-bold text-[12px] leading-[16px] text-[#001c43]">
                            Requester Information
                        </h3>
                    </div>

                    {/* Requested By */}
                    <div className="col-span-1 flex flex-col gap-[6px] px-[12px]">
                        <p className="font-['Montserrat'] font-bold text-[10px] leading-[14px] text-[#001c43]">
                            Requested By
                        </p>
                        <p className="font-['Montserrat'] font-normal text-[10px] leading-[14px] text-[#001c43]">
                            {request.requesterInfo.requestedBy}
                        </p>
                    </div>

                    {/* Department */}
                    <div className="col-span-1 flex flex-col gap-[6px] px-[12px]">
                        <p className="font-['Montserrat'] font-bold text-[10px] leading-[14px] text-[#001c43]">
                            Department
                        </p>
                        <p className="font-['Montserrat'] font-normal text-[10px] leading-[14px] text-[#001c43]">
                            {request.requesterInfo.department}
                        </p>
                    </div>
                </div>
            </div>

            {/* Separator */}
            <div className="h-[2px] bg-[#b1b1b1] mb-5" />

            {/* === REQUEST DETAILS SECTION === */}
            <div className="bg-white rounded-[12px] p-[14px] border border-transparent mb-5">
                <div className="grid grid-cols-2 gap-y-[10px]">
                    {/* Section Title */}
                    <div className="col-span-2 mb-[6px]">
                        <h3 className="font-['Montserrat'] font-bold text-[12px] leading-[16px] text-[#001c43]">
                            Request Details
                        </h3>
                    </div>

                    {/* Cash Advance Form */}
                    <div className="col-span-2 flex flex-col gap-[6px] px-[12px]">
                        <p className="font-['Montserrat'] font-bold text-[10px] leading-[14px] text-[#001c43]">
                            Cash Advance Form
                        </p>
                        <p className="font-['Montserrat'] font-normal text-[10px] leading-[14px] text-[#001c43]">
                            {request.requestDetailsInfo.cashAdvanceForm}
                        </p>
                    </div>

                    {/* Description/Purpose */}
                    <div className="col-span-2 flex flex-col gap-[6px] px-[12px]">
                        <p className="font-['Montserrat'] font-bold text-[10px] leading-[14px] text-[#001c43]">
                            Description/Purpose
                        </p>
                        <p className="font-['Montserrat'] font-normal text-[10px] leading-[14px] text-[#001c43]">
                            {request.requestDetailsInfo.descriptionPurpose}
                        </p>
                    </div>

                    {/* Source of Fund */}
                    <div className="col-span-1 flex flex-col gap-[6px] px-[12px]">
                        <p className="font-['Montserrat'] font-bold text-[10px] leading-[14px] text-[#001c43]">
                            Source of Fund
                        </p>
                        <p className="font-['Montserrat'] font-normal text-[10px] leading-[14px] text-[#001c43]">
                            {request.requestDetailsInfo.sourceOfFund}
                        </p>
                    </div>

                    {/* Cost Center */}
                    <div className="col-span-1 flex flex-col gap-[6px] px-[12px]">
                        <p className="font-['Montserrat'] font-bold text-[10px] leading-[14px] text-[#001c43]">
                            Cost Center
                        </p>
                        <p className="font-['Montserrat'] font-normal text-[10px] leading-[14px] text-[#001c43]">
                            {request.requestDetailsInfo.costCenter}
                        </p>
                    </div>

                    {/* Date Requested */}
                    <div className="col-span-1 flex flex-col gap-[6px] px-[12px]">
                        <p className="font-['Montserrat'] font-bold text-[10px] leading-[14px] text-[#001c43]">
                            Date Requested
                        </p>
                        <p className="font-['Montserrat'] font-normal text-[10px] leading-[14px] text-[#001c43]">
                            {request.requestDetailsInfo.dateRequested}
                        </p>
                    </div>

                    {/* Date Needed */}
                    <div className="col-span-1 flex flex-col gap-[6px] px-[12px]">
                        <p className="font-['Montserrat'] font-bold text-[10px] leading-[14px] text-[#001c43]">
                            Date Needed
                        </p>
                        <p className="font-['Montserrat'] font-normal text-[10px] leading-[14px] text-[#001c43]">
                            {request.requestDetailsInfo.dateNeeded}
                        </p>
                    </div>

                    {/* Date Start */}
                    <div className="col-span-1 flex flex-col gap-[6px] px-[12px]">
                        <p className="font-['Montserrat'] font-bold text-[10px] leading-[14px] text-[#001c43]">
                            Date Start
                        </p>
                        <p className="font-['Montserrat'] font-normal text-[10px] leading-[14px] text-[#001c43]">
                            {request.requestDetailsInfo.dateStart}
                        </p>
                    </div>

                    {/* Date End */}
                    <div className="col-span-1 flex flex-col gap-[6px] px-[12px]">
                        <p className="font-['Montserrat'] font-bold text-[10px] leading-[14px] text-[#001c43]">
                            Date End
                        </p>
                        <p className="font-['Montserrat'] font-normal text-[10px] leading-[14px] text-[#001c43]">
                            {request.requestDetailsInfo.dateEnd}
                        </p>
                    </div>

                    {/* Line Items Table - Full Width - ROUNDED CORNERS */}
                    <div className="col-span-2 px-[12px] mt-[8px]">
                        <div className="overflow-hidden rounded-[8px]">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#001c43] hover:bg-[#001c43]">
                                        <TableHead className="text-white font-['Montserrat'] font-bold text-[9px] text-center border-b border-white py-[2px] px-2 rounded-tl-[8px]">
                                            Line/Item
                                        </TableHead>
                                        <TableHead className="text-white font-['Montserrat'] font-bold text-[9px] text-center border-b border-white py-[2px] px-2">
                                            Category
                                        </TableHead>
                                        <TableHead className="text-white font-['Montserrat'] font-bold text-[9px] text-center border-b border-white py-[2px] px-2">
                                            Activity/Description
                                        </TableHead>
                                        <TableHead className="text-white font-['Montserrat'] font-bold text-[9px] text-center border-b border-white py-[2px] px-2">
                                            Quantity
                                        </TableHead>
                                        <TableHead className="text-white font-['Montserrat'] font-bold text-[9px] text-center border-b border-white py-[2px] px-2">
                                            UOM
                                        </TableHead>
                                        <TableHead className="text-white font-['Montserrat'] font-bold text-[9px] text-center border-b border-white py-[2px] px-2">
                                            Price
                                        </TableHead>
                                        <TableHead className="text-white font-['Montserrat'] font-bold text-[9px] text-center border-b border-white py-[2px] px-2 rounded-tr-[8px]">
                                            Amount
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {request.lineItems.map((item, index) => (
                                        <TableRow key={index} className="hover:bg-white">
                                            <TableCell className="text-center font-['Montserrat'] font-bold text-[9px] text-[#001c43] border-b border-white py-[6px] px-2">
                                                {item.lineNumber}
                                            </TableCell>
                                            <TableCell className="font-['Montserrat'] font-bold text-[9px] text-[#001c43] border-b border-white py-[6px] px-2">
                                                {item.category}
                                            </TableCell>
                                            <TableCell className="font-['Montserrat'] font-bold text-[9px] text-[#001c43] border-b border-white py-[6px] px-2">
                                                {item.activityDescription}
                                            </TableCell>
                                            <TableCell className="text-center font-['Montserrat'] font-bold text-[9px] text-[#001c43] border-b border-white py-[6px] px-2">
                                                {item.quantity}
                                            </TableCell>
                                            <TableCell className="font-['Montserrat'] font-bold text-[9px] text-[#001c43] border-b border-white py-[6px] px-2">
                                                {item.uom}
                                            </TableCell>
                                            <TableCell className="text-center font-['Montserrat'] font-bold text-[9px] text-[#001c43] border-b border-white py-[6px] px-2">
                                                {formatNumber(item.price)}
                                            </TableCell>
                                            <TableCell className="text-center font-['Montserrat'] font-bold text-[9px] text-[#001c43] border-b border-white py-[6px] px-2">
                                                {formatNumber(item.amount)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Separator */}
            <div className="h-[2px] bg-[#b1b1b1] mb-5" />

            {/* === AMOUNT SUMMARY SECTION === */}
            <div className="bg-[#ececec] rounded-[12px] p-[14px] mb-5">
                <div className="grid grid-cols-2 gap-y-[8px] px-[12px]">
                    {/* Currency */}
                    <div className="col-span-1 flex items-center gap-[6px]">
                        <p className="font-['Montserrat'] font-bold text-[10px] leading-[14px] text-[#001c43]">
                            Currency:
                        </p>
                        <p className="font-['Montserrat'] font-bold text-[10px] leading-[14px] text-[#001c43]">
                            {request.amountSummary.currency}
                        </p>
                    </div>

                    {/* Total Amount */}
                    <div className="col-span-1 grid grid-cols-2 gap-[6px]">
                        <p className="font-['Montserrat'] font-bold text-[10px] leading-[14px] text-[#001c43] text-right">
                            Total Amount
                        </p>
                        <p className="font-['Montserrat'] font-bold text-[10px] leading-[14px] text-[#001c43] text-right">
                            {formatNumber(request.amountSummary.totalAmount)}
                        </p>
                    </div>

                    {/* Empty cell for spacing */}
                    <div className="col-span-1" />

                    {/* Cash Advance */}
                    <div className="col-span-1 grid grid-cols-2 gap-[6px]">
                        <p className="font-['Montserrat'] font-bold text-[10px] leading-[14px] text-[#001c43] text-right">
                            Cash Advance
                        </p>
                        <p className="font-['Montserrat'] font-bold text-[10px] leading-[14px] text-[#001c43] text-right">
                            {formatNumber(request.amountSummary.cashAdvance)}
                        </p>
                    </div>

                    {/* Separator line */}
                    <div className="col-span-1" />
                    <div className="col-span-1 pt-[4px]">
                        <div className="h-[2px] bg-[#b1b1b1]" />
                    </div>

                    {/* Empty cell for spacing */}
                    <div className="col-span-1" />

                    {/* Amount to Return/(Refund) */}
                    <div className="col-span-1 grid grid-cols-2 gap-[6px] pt-[4px]">
                        <p className="font-['Montserrat'] font-bold text-[10px] leading-[14px] text-[#001c43] text-right">
                            Amount to Return/(Refund)
                        </p>
                        <p className="font-['Montserrat'] font-bold text-[10px] leading-[14px] text-[#001c43] text-right">
                            {formatNumber(request.amountSummary.amountToReturn)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Separator */}
            <div className="h-[2px] bg-[#b1b1b1] mb-4" />

            {/* === ATTACHMENTS SECTION - MATCHING SCREEN DESIGN === */}
            <div className="px-[12px] py-[6px] flex justify-end">
                <div className="flex items-start">
                    {/* Attachments Label (left side) */}
                    <div className="flex-shrink-0 mr-[55px]">
                        <p className="font-['Montserrat'] font-normal text-[10px] leading-[14px] text-[#001c43]">
                            Attachments
                        </p>
                    </div>

                    {/* Attachments Box - Fixed Width with proper border */}
                    <div className="border border-[#001c43] rounded-[12px] p-[10px] w-[350px] mr-[55px]">
                        {request.attachments.length > 0 ? (
                            <div className="flex flex-col gap-[5px]">
                                {request.attachments.map((attachment) => (
                                    <div key={attachment.id} className="flex items-center gap-[6px]">
                                        <div className="w-[11px] h-[11px] flex-shrink-0">
                                            <svg width="11" height="11" viewBox="0 0 17 17" fill="none">
                                                <path d="M9.5 2.5H4.5C4.10218 2.5 3.72064 2.65804 3.43934 2.93934C3.15804 3.22064 3 3.60218 3 4V13C3 13.3978 3.15804 13.7794 3.43934 14.0607C3.72064 14.342 4.10218 14.5 4.5 14.5H12.5C12.8978 14.5 13.2794 14.342 13.5607 14.0607C13.842 13.7794 14 13.3978 14 13V7L9.5 2.5Z" stroke="#001C43" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M9.5 2.5V7H14" stroke="#001C43" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <p className="font-['Montserrat'] font-medium text-[10px] leading-[14px] text-[#001c43]">
                                            {attachment.filename}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[#9ca3af] text-[10px] text-center">No attachments</p>
                        )}
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

// Journey Step Card Component
function JourneyStepCard({
    stepNumber,
    stepName,
    timestamp,
    status,
    approver,
    isActive,
    showConnectorBefore,
    showConnectorAfter
}: {
    stepNumber: number;
    stepName: string;
    timestamp?: string;
    status?: string;
    approver?: string;
    isActive: boolean;
    showConnectorBefore: boolean;
    showConnectorAfter: boolean;
}) {
    return (
        <>
            {/* Connector Line BEFORE Card */}
            {showConnectorBefore && (
                <div className="w-full flex items-center h-[100px]">
                    <div className={`w-[2px] h-full ${isActive ? 'bg-[#8c8b8b]' : 'bg-[#b1b1b1]'}`} />
                </div>
            )}

            {/* Journey Step Card */}
            <div
                className={`
                    w-full
                    ${isActive
                        ? 'bg-[rgba(140,139,139,0.1)] border-[#8c8b8b]'
                        : 'bg-[rgba(177,177,177,0.1)] border-[#b1b1b1]'
                    }
                    border border-solid 
                    rounded-tr-[20px] rounded-br-[20px] 
                    p-[20px]
                `}
            >
                {/* Header Row: Badge + Name + Timestamp */}
                <div className="flex items-center justify-between mb-[40px]">
                    {/* Left Side: Badge + Name */}
                    <div className="flex items-center gap-[10px] flex-1 min-w-0">
                        {/* Circular Number Badge */}
                        <div
                            className={`
                                w-[60px] h-[60px] 
                                rounded-[30px] 
                                flex items-center justify-center 
                                flex-shrink-0
                                ${isActive ? 'bg-[#114b9f]' : 'bg-[#b1b1b1]'}
                            `}
                        >
                            <span className="text-white font-['Montserrat'] font-bold text-[24px] leading-[32px]">
                                {stepNumber}
                            </span>
                        </div>

                        {/* Step Name */}
                        <p
                            className={`
                                font-['Montserrat'] font-bold text-[14px] leading-[20px]
                                ${isActive ? 'text-[#114b9f]' : 'text-[#b1b1b1]'}
                            `}
                        >
                            {stepName}
                        </p>
                    </div>

                    {/* Right Side: Timestamp (only for active/completed steps) */}
                    {timestamp && (
                        <p className="font-['Montserrat'] font-medium text-[12px] leading-[16px] tracking-[0.24px] text-[#001c43] flex-shrink-0 ml-[10px]">
                            {timestamp}
                        </p>
                    )}
                </div>

                {/* Details Row: Status + Approver (only for active steps) */}
                {isActive && status && approver && (
                    <div className="flex items-start justify-between py-[5px] gap-[20px]">
                        {/* Left Side - Status Info */}
                        <div className="flex flex-col gap-[10px] w-[113px] flex-shrink-0">
                            <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#114b9f]">
                                Form Received
                            </p>
                            <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                {status}
                            </p>
                        </div>

                        {/* Right Side - Approver Info */}
                        <div className="flex flex-col gap-[10px] items-end flex-1 min-w-0">
                            <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#114b9f] whitespace-nowrap">
                                Assigned Approver:
                            </p>
                            <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43] text-right">
                                {approver}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Connector Line AFTER Card */}
            {showConnectorAfter && (
                <div className="w-full flex items-center h-[100px]">
                    <div
                        className={`
                                w-[2px] h-full
                                ${isActive ? 'bg-[#8c8b8b]' : 'bg-[#b1b1b1]'}
                            `}
                    />
                </div>
            )}
        </>
    );
}

// Journey Tab Content - Liquidation Workflow Timeline
function JourneyContent({ journey }: { journey: JourneyStep[] }) {
    // Define the complete workflow stages
    const workflowStages = [
        { id: 1, name: 'Submission', key: 'submission' },
        { id: 2, name: 'Department Head', key: 'department_head' },
        { id: 3, name: 'Budget', key: 'budget' },
        { id: 4, name: 'Accounting', key: 'accounting' },
        { id: 5, name: 'Controller', key: 'controller' },
        { id: 6, name: 'EVPCOO', key: 'evpcoo' },
        { id: 7, name: 'Treasury', key: 'treasury' },
    ];

    // Map journey steps to stages
    const getStageData = (stageKey: string): JourneyStep | undefined => {
        return journey.find(j => {
            const stepLower = j.step.toLowerCase();
            const normalizedStep = stepLower.replace(/\s+/g, '_');

            return (
                stepLower.includes(stageKey) ||
                normalizedStep === stageKey ||
                normalizedStep.includes(stageKey)
            );
        });
    };

    return (
        <div className="flex-1 overflow-y-auto px-[20px] py-0">
            {/* Timeline Container */}
            <div className="flex flex-col items-start w-full max-w-[475px] ml-[40px]">
                {workflowStages.map((stage, index) => {
                    const stageData = getStageData(stage.key);
                    const isActive = !!stageData;
                    const showConnectorBefore = index === 0;
                    const showConnectorAfter = index < workflowStages.length - 1;

                    return (
                        <JourneyStepCard
                            key={stage.id}
                            stepNumber={stage.id}
                            stepName={stage.name}
                            timestamp={stageData?.timestamp}
                            status={stageData?.action}
                            approver={stageData?.actor}
                            isActive={isActive}
                            showConnectorBefore={showConnectorBefore}
                            showConnectorAfter={showConnectorAfter}
                        />
                    );
                })}
            </div>
        </div>
    );
}

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
        if (!commentText.trim() || !request) return;

        const newCommentObj = {
            id: `c${comments.length + 1}`,
            author: "Current User",
            role: "Requester",
            timestamp: new Date().toLocaleString(),
            text: commentText.trim(),
            attachments: []
        };

        setComments([...comments, newCommentObj]);
        setCommentText("");
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
                            {activeTab === "journey" && <JourneyContent journey={request?.journey || []} />}
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