import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { X, Send, MoveRight, Download, Link2, HardDriveDownload } from "lucide-react";
import { useMemo } from "react";
import { mockRequestDetails, type RequestDetail } from "@/data/mockRequestDetails";

export default function RequestDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"form" | "comments" | "journey">("form");

    const handleClose = () => {
        navigate(-1);
    };

    // Load request data by ID
    const request = useMemo<RequestDetail | null>(() => {
        if (!id) return null;
        return mockRequestDetails[id] || null;
    }, [id]);

    // Handle request not found
    if (!id) {
        return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-[20px] p-8 max-w-md">
                    <h2 className="text-xl font-montserrat font-bold text-[#e50019] mb-4">Invalid Request</h2>
                    <p className="font-montserrat text-[#001c43] mb-6">No request ID provided.</p>
                    <button
                        onClick={handleClose}
                        className="bg-[#001c43] text-white px-6 py-2 rounded-lg hover:bg-[#002855] transition-colors font-montserrat"
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
                    <h2 className="text-xl font-montserrat font-bold text-[#e50019] mb-4">Request Not Found</h2>
                    <p className="font-montserrat text-[#001c43] mb-6">
                        Request with ID "{id}" could not be found.
                    </p>
                    <button
                        onClick={handleClose}
                        className="bg-[#001c43] text-white px-6 py-2 rounded-lg hover:bg-[#002855] transition-colors font-montserrat"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        // Modal Overlay
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            {/* Modal Container */}
            <div className="bg-[#fcfcfc] rounded-[20px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] w-[95vw] max-w-[1393px] h-[90vh] max-h-[946px] grid grid-cols-[1fr_400px] grid-rows-[70px_1fr] overflow-hidden">

                {/* LEFT PANEL - TABS (Header) */}
                <div className="col-[1] row-[1] bg-[#f4f4f5] p-[4px] rounded-[6px] flex items-center self-start">
                    {/* Tab Buttons */}
                    <button
                        onClick={() => setActiveTab("form")}
                        className={`px-[12px] py-[6px] rounded-[4px] flex-1 font-montserrat text-[14px] leading-[20px] transition-all ${activeTab === "form"
                            ? "bg-white text-[#09090b] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]"
                            : "text-[#71717a]"
                            }`}
                    >
                        Form
                    </button>
                    <button
                        onClick={() => setActiveTab("comments")}
                        className={`px-[12px] py-[6px] rounded-[4px] flex-1 font-montserrat text-[14px] leading-[20px] transition-all ${activeTab === "comments"
                            ? "bg-white text-[#09090b] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]"
                            : "text-[#71717a]"
                            }`}
                    >
                        Comments
                    </button>
                    <button
                        onClick={() => setActiveTab("journey")}
                        className={`px-[12px] py-[6px] rounded-[4px] flex-1 font-montserrat text-[14px] leading-[20px] transition-all ${activeTab === "journey"
                            ? "bg-white text-[#09090b] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]"
                            : "text-[#71717a]"
                            }`}
                    >
                        Journey
                    </button>
                </div>

                {/* LEFT PANEL - MAIN CONTENT */}
                <div className="col-[1] row-[2] flex flex-col gap-[10px] items-center justify-center p-[20px] overflow-hidden">

                    {/* Download Form Button - Positioned at top */}
                    <div className="bg-[rgba(0,28,67,0.7)] flex items-center justify-end gap-[10px] px-[31px] py-[14px] rounded-tl-[20px] rounded-tr-[20px] w-full">
                        <button className="bg-[#001c43] flex items-center gap-[10px] px-[10px] py-[2px] h-[30px] rounded-[10px] hover:bg-[#002855] transition-colors">
                            <HardDriveDownload className="w-[18px] h-[18px] text-white" />
                            <p className="font-montserrat text-[14px] text-white leading-[20px]">
                                Download Form
                            </p>
                        </button>
                    </div>

                    {/* Form Preview Area - Placeholder */}
                    <div className="bg-[#f5f5f5] border border-[#b1b1b1] rounded-[20px] flex-1 w-full flex items-center justify-center overflow-hidden">
                        <div className="text-center p-8">
                            <p className="text-gray-400 text-lg font-montserrat mb-2">
                                Form Preview
                            </p>
                            <p className="text-gray-500 text-sm font-montserrat">
                                pota
                            </p>
                            <p className="text-gray-400 text-xs font-montserrat mt-4">
                                Active Tab: <span className="font-semibold text-[#001c43]">{activeTab}</span>
                            </p>
                        </div>
                    </div>

                </div>

                {/* RIGHT PANEL */}
                <div className="col-[2] row-[1_/_span_2] bg-[#fcfcfc] rounded-tr-[20px] flex flex-col justify-between p-[10px] pb-[20px] pt-[10px]">

                    {/* Scrollable Content Area */}
                    <div className="flex flex-col gap-0 overflow-y-auto">

                        {/* Header: Workflow Status + Close Button */}
                        <div className="flex items-center justify-between h-[67px] px-[5px] py-[10px]">
                            <div className="flex items-center gap-[20px]">
                                <p className="font-montserrat text-[14px] text-[#001c43]">
                                    Workflow Status:
                                </p>
                                <div className="bg-[rgba(139,139,139,0.1)] border border-[#8c8b8b] rounded-[10px] px-[10px] h-[31px] flex items-center">
                                    <p className="font-montserrat text-[14px] text-[#8c8b8b]">
                                        {request.status}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-[24px] h-[24px] flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-[18px] h-[18px] text-[#001c43]" />
                            </button>
                        </div>

                        {/* Separator */}
                        <div className="w-full h-[2px] bg-[#b1b1b1]" />

                        {/* Approver Section */}
                        <div className="flex flex-col gap-[10px] p-[20px]">
                            <p className="font-montserrat font-semibold text-[18px] text-[#001c43] leading-[24px]">
                                Approver
                            </p>
                            <div className="flex items-center gap-[15px]">
                                {/* Avatar */}
                                <div className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                    <span className="text-white font-montserrat font-semibold text-[20px]">
                                        {request.approver.initials}
                                    </span>
                                </div>
                                {/* Name and Role */}
                                <div className="flex flex-col gap-[2px]">
                                    <p className="font-montserrat text-[14px] text-[#001c43] leading-[20px]">
                                        {request.approver.name}
                                    </p>
                                    <p className="font-montserrat text-[14px] text-[#e50019] leading-[20px]">
                                        {request.approver.role}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="w-full h-[2px] bg-[#b1b1b1]" />

                        {/* Recent Comments Section */}
                        <div className="flex flex-col gap-[10px] p-[10px]">
                            <p className="font-montserrat text-[14px] text-[#001c43] leading-[20px]">
                                Recent Comments:
                            </p>

                            {/* Separator */}
                            <div className="w-full h-[2px] bg-[#d9d9d9]" />

                            {/* Comment Item - Show most recent comment */}
                            {request.comments.length > 0 ? (
                                <div className="flex flex-col gap-[3px] px-[9px]">
                                    {/* Comment Header */}
                                    <div className="flex items-center justify-between px-[9px]">
                                        <p className="font-montserrat text-[12px] text-[#001c43] leading-[20px]">
                                            <span>{request.comments[0].author} - </span>
                                            <span className="text-[#e50019]">{request.comments[0].role}</span>
                                        </p>
                                        <p className="font-montserrat text-[8px] text-[#b1b1b1] leading-[20px]">
                                            {request.comments[0].timestamp}
                                        </p>
                                    </div>

                                    {/* Vertical Line */}
                                    <div className="w-[1px] h-[17px] bg-[#d9d9d9] ml-[9px]" />

                                    {/* Comment Text */}
                                    <div className="bg-[#f4f4f5] px-[16px] min-h-[49px] flex items-center rounded-sm py-2">
                                        <p className="font-montserrat text-[10px] text-black leading-[20px]">
                                            {request.comments[0].text}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="font-montserrat text-[12px] text-[#b1b1b1] px-[9px]">
                                    No comments yet
                                </p>
                            )}

                            {/* View Full Comments History Link */}
                            <div className="flex flex-col items-start">
                                <div className="flex items-center gap-[5px] cursor-pointer hover:opacity-70 transition-opacity">
                                    <p className="font-montserrat text-[12px] text-[#b1b1b1] leading-[20px]">
                                        View full comments history
                                    </p>
                                    <MoveRight className="w-[24px] h-[24px] text-[#b1b1b1]" />
                                </div>
                                <div className="w-[195px] h-[1px] bg-[#d9d9d9]" />
                            </div>

                            {/* Comment Input */}
                            <div className="flex items-center gap-[10px] w-full">
                                <div className="flex-1 border border-[#b1b1b1] rounded-[10px] h-[36px] px-[20px] flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Type your comment here"
                                        className="w-full bg-transparent outline-none font-montserrat text-[14px] text-[#b1b1b1] placeholder:text-[#b1b1b1]"
                                    />
                                </div>
                                <button className="w-[24px] h-[24px] flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                                    <Send className="w-[18px] h-[18px] text-[#001c43]" />
                                </button>
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="w-full h-[2px] bg-[#b1b1b1]" />

                        {/* Attachments Header */}
                        <div className="bg-[#fcfcfc] flex items-center justify-center gap-[10px] px-[20px] py-[8px] rounded-[10px] w-fit">
                            <Link2 className="w-[20px] h-[20px] text-[#001c43] shrink-0" />
                            <p className="font-montserrat text-[14px] text-[#001c43] leading-[20px]">
                                Attachments
                            </p>
                        </div>

                        {/* Attachments List */}
                        <div className="border border-[#b1b1b1] bg-white rounded-[10px] mx-[10px]">
                            {request.attachments.map((attachment, index) => (
                                <div
                                    key={attachment.id}
                                    className={`bg-[#fcfcfc] flex items-center gap-[16px] p-[16px] ${index < request.attachments.length - 1 ? 'border-b border-[#e5e5e5]' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-[12px] flex-1">
                                        {/* PDF Icon */}
                                        <div className="w-[28px] h-[28px] bg-[#f14848] rounded-sm flex items-center justify-center">
                                            <span className="text-white font-montserrat font-semibold text-[8px]">
                                                {attachment.type.toUpperCase()}
                                            </span>
                                        </div>
                                        {/* File Info */}
                                        <div className="flex flex-col gap-[2px] flex-1">
                                            <p className="font-montserrat text-[14px] text-[#001c43] leading-[20px]">
                                                {attachment.filename}
                                            </p>
                                            <p className="font-montserrat text-[14px] text-[#b1b1b1] leading-[20px]">
                                                {attachment.size} . {attachment.date}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Download Icon */}
                                    <button className="w-[16px] h-[16px] hover:opacity-70 transition-opacity">
                                        <Download className="w-[16px] h-[16px] text-[#001c43]" />
                                    </button>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Action Buttons at Bottom */}
                    <div className="h-[110px] w-full px-[10px] flex items-end">
                        <button className="bg-[#e50019] w-full h-[50px] rounded-[12px] flex items-center justify-center hover:bg-[#c40015] transition-colors">
                            <p className="font-montserrat font-bold text-[16px] text-[#fcfcfc] leading-[24px]">
                                Request to Cancel
                            </p>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}