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
            <div className="bg-[#fcfcfc] rounded-[20px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] w-[1393px] h-[946px] grid grid-cols-[1fr_400px] grid-rows-[70px_1fr] overflow-hidden">

                {/* PLACEHOLDER FOR MAIN CONTENT - We'll build this last */}
                <div className="col-[1] row-[1_/_span_2] bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-400">Main Content Area - Coming Soon</p>
                </div>

                {/* RIGHT PANEL - We're building this now! */}
                <div className="col-[2] row-[1_/_span_2] bg-[#fcfcfc] rounded-tr-[20px] flex flex-col">
                    <p className="p-4">Right Panel - Under Construction</p>
                </div>

            </div>
        </div>
    );
}