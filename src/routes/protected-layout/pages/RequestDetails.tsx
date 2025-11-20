import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { X } from "lucide-react";

export default function RequestDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"form" | "comments" | "journey">("form");

    const handleClose = () => {
        navigate(-1);
    };

    return (
        // Modal Overlay
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            {/* Modal Container */}
            <div className="bg-[#fcfcfc] rounded-[20px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] w-[95vw] max-w-[1393px] h-[90vh] max-h-[946px] grid grid-cols-[1fr_400px] grid-rows-[70px_1fr] overflow-hidden">

                {/* PLACEHOLDER FOR MAIN CONTENT - We'll build this last */}
                <div className="col-[1] row-[1_/_span_2] bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-400">Main Content Area - Coming Soon</p>
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
                                        Submitted
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
                                        JD
                                    </span>
                                </div>
                                {/* Name and Role */}
                                <div className="flex flex-col gap-[2px]">
                                    <p className="font-montserrat text-[14px] text-[#001c43] leading-[20px]">
                                        John Doe
                                    </p>
                                    <p className="font-montserrat text-[14px] text-[#e50019] leading-[20px]">
                                        Role
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="w-full h-[2px] bg-[#b1b1b1]" />

                        {/* PLACEHOLDER - Comments section coming */}
                        <div className="p-4">
                            <p className="text-gray-400 text-sm">Comments section coming...</p>
                        </div>

                    </div>

                    {/* PLACEHOLDER - Action buttons at bottom */}
                    <div className="h-[110px] w-full">
                        <p className="text-gray-400 text-sm p-4">Cancel button coming...</p>
                    </div>

                </div>

            </div>
        </div>
    );
}