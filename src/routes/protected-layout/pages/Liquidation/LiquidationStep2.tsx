import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiquidationStore } from '@/store/useLiquidationStore';
import { Info, ArrowRight, CloudUpload, Loader, CircleCheck, CircleMinus } from 'lucide-react';
import { toast } from 'sonner';
import Stepper from '@/components/Stepper';
import { AiFillFilePdf, AiFillFileImage, AiFillFileWord, AiFillFile } from 'react-icons/ai';
import { MdVideoFile } from 'react-icons/md';

const LIQUIDATION_STEPS = [
    { label: 'Liquidation Details' },
    { label: 'Supporting Documents' },
    { label: 'Review & Submit' },
];

interface UploadedFile {
    id: string;
    file: File;
    progress: number;
    status: 'uploading' | 'completed' | 'error';
}

const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'video/mp4'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB in bytes

export default function LiquidationStep2() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { step2Files, saveStep2Files } = useLiquidationStore();

    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    // Load persisted files on mount
    useEffect(() => {
        if (step2Files && step2Files.length > 0) {
            const reconstructedFiles: UploadedFile[] = step2Files.map(meta => ({
                id: meta.id,
                file: new File([], meta.name, { type: meta.type }),
                progress: 100,
                status: 'completed' as const,
            }));
            setUploadedFiles(reconstructedFiles);
        }
    }, [step2Files]);

    //Auto-save files to store
    useEffect(() => {
        const completedFiles = uploadedFiles.filter(f => f.status === 'completed');
        const fileMetadata = completedFiles.map(f => ({
            id: f.id,
            name: f.file.name,
            size: f.file.size,
            type: f.file.type,
        }));
        saveStep2Files(fileMetadata);
    }, [uploadedFiles, saveStep2Files]);

    // Simulate file upload
    const uploadFile = useCallback((file: File) => {
        const fileId = Math.random().toString(36).substring(7);
        const newFile: UploadedFile = {
            id: fileId,
            file,
            progress: 0,
            status: 'uploading',
        };

        setUploadedFiles(prev => [...prev, newFile]);

        // Simulate upload progress
        const interval = setInterval(() => {
            setUploadedFiles(prev =>
                prev.map(f => {
                    if (f.id === fileId && f.status === 'uploading') {
                        const newProgress = f.progress + 10;
                        if (newProgress >= 100) {
                            clearInterval(interval);
                            return { ...f, progress: 100, status: 'completed' };
                        }
                        return { ...f, progress: newProgress };
                    }
                    return f;
                })
            );
        }, 300);
    }, []);

    // Handle file selection
    const handleFiles = useCallback((files: FileList | null) => {
        if (!files) return;

        Array.from(files).forEach(file => {
            // Validate file type
            if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
                toast.error(`File type not supported: ${file.name}`);
                return;
            }

            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                toast.error(`File too large: ${file.name}. Maximum size is 50MB.`);
                return;
            }

            uploadFile(file);
        });
    }, [uploadFile]);

    // Handle drag and drop
    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    // Handle browse file click
    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    // Handle file input change
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    // Add delete confirmation
    const handleRemoveFile = (fileId: string) => {
        if (window.confirm('Are you sure you want to remove this file?')) {
            setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
            toast.success('File removed successfully');
        }
    };

    // Format file size
    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const getFileIcon = (file: File) => {
        const extension = file.name.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'pdf':
                return <AiFillFilePdf size={40} className="text-red-500" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
                return <AiFillFileImage size={40} className="text-blue-500" />;
            case 'doc':
            case 'docx':
                return <AiFillFileWord size={40} className="text-indigo-500" />;
            case 'mp4':
                return <MdVideoFile size={40} className="text-purple-500" />;
            default:
                return <AiFillFile size={40} className="text-gray-500" />;
        }
    };

    // Handle Back
    const handleBack = () => {
        navigate('/liquidation/step1');
    };

    // Handle Next
    const handleNext = () => {
        // Check if at least one file is uploaded and completed
        const completedFiles = uploadedFiles.filter(f => f.status === 'completed');

        if (completedFiles.length === 0) {
            toast.error('Please upload at least one supporting document');
            return;
        }

        // Check if any files are still uploading
        const uploadingFiles = uploadedFiles.filter(f => f.status === 'uploading');
        if (uploadingFiles.length > 0) {
            toast.error('Please wait for all files to finish uploading');
            return;
        }

        // Save file metadata to Zustand store (not the actual File objects)
        const fileMetadata = completedFiles.map(f => ({
            id: f.id,
            name: f.file.name,
            size: f.file.size,
            type: f.file.type,
        }));
        saveStep2Files(fileMetadata);

        // Navigate to Step 3
        toast.success('Supporting documents uploaded!');
        navigate('/liquidation/step3');
    };

    const hasCompletedFiles = uploadedFiles.some(f => f.status === 'completed');

    return (
        <div className="flex flex-col h-full bg-[#f3f3f3] px-[30px] py-[20px] gap-[20px]">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.mp4"
                onChange={handleFileInputChange}
                className="hidden"
            />

            {/* Step Progress Indicator */}
            <Stepper steps={LIQUIDATION_STEPS} currentStep={2} showLeadingLine={false} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-[20px]">
                {/* Header with Info Icon */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[20px]">
                        <h1 className="font-['Montserrat'] font-bold text-[32px] leading-[40px] text-[#001c43]">
                            Step 2
                        </h1>
                        <h2 className="font-['Montserrat'] font-bold text-[24px] leading-[32px] text-[#001c43]">
                            Supporting Documents
                        </h2>
                    </div>
                    <div className="w-[40px] h-[40px] bg-white rounded-[10px] shadow-[1px_0px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <Info className="w-[24px] h-[24px] text-[#e50019]" />
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-[20px] p-[20px] flex-1 flex flex-col gap-[20px]">
                    {/* Title */}
                    <h3 className="font-['Montserrat'] font-bold text-[24px] leading-[32px] text-[#001c43]">
                        Add attachments
                    </h3>

                    {/* Browse Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleBrowseClick}
                            className="border-2 border-[#001c43] bg-white rounded-[16px] px-[41px] py-[16px] font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43] hover:bg-gray-50 transition-colors"
                        >
                            Browse File
                        </button>
                    </div>

                    {/* Drag and Drop Area */}
                    <div
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                            border-4 border-dashed rounded-[26px] 
                            flex flex-col items-center justify-center
                            px-[107px] py-[69px] gap-[44px]
                            transition-colors
                            ${isDragging
                                ? 'border-[#001c43] bg-blue-50'
                                : 'border-[#b1b1b1] bg-white'
                            }
                        `}
                    >
                        <div className="flex flex-col items-center gap-[10px]">
                            <CloudUpload className="w-[24px] h-[24px] text-[#001c43]" />
                            <div className="flex flex-col items-center gap-[15px]">
                                <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43] text-center">
                                    Choose a file or drag & drop it here
                                </p>
                                <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#b1b1b1] text-center">
                                    JPEG, PNG, PDF, and MP4 formats, up to 50MB
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                        <div className="border border-[#b1b1b1] rounded-[20px] overflow-hidden">
                            {uploadedFiles.map((uploadedFile, index) => (
                                <div
                                    key={uploadedFile.id}
                                    className={`
                                        flex items-center justify-between px-[20px] py-[20px]
                                        ${index % 2 === 1 ? 'bg-[#f5f5f5]' : 'bg-white'}
                                    `}
                                >
                                    <div className="flex items-center gap-[34px] flex-1">
                                        {/* File Icon */}
                                        <div className="w-[40px] h-[40px] flex items-center justify-center">
                                            {getFileIcon(uploadedFile.file)}
                                        </div>

                                        {/* File Info */}
                                        <div className="flex flex-col gap-[16px] flex-1">
                                            <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                                {uploadedFile.file.name}
                                            </p>
                                            <div className="flex items-center gap-[10px]">
                                                <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#b1b1b1]">
                                                    {uploadedFile.status === 'uploading'
                                                        ? `${formatFileSize(uploadedFile.file.size * uploadedFile.progress / 100)} of ${formatFileSize(uploadedFile.file.size)}`
                                                        : `${formatFileSize(uploadedFile.file.size)} of ${formatFileSize(uploadedFile.file.size)}`
                                                    } •
                                                </p>

                                                {uploadedFile.status === 'uploading' && (
                                                    <>
                                                        <Loader className="w-[24px] h-[24px] text-[#001c43] animate-spin" />
                                                        <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                                            Uploading...
                                                        </p>
                                                    </>
                                                )}

                                                {uploadedFile.status === 'completed' && (
                                                    <>
                                                        <CircleCheck className="w-[24px] h-[24px] text-[#4DB487]" />
                                                        <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                                            Completed
                                                        </p>
                                                    </>
                                                )}
                                            </div>

                                            {/* Progress Bar */}
                                            {uploadedFile.status === 'uploading' && (
                                                <div className="w-[248px] h-[2px] bg-[#e0e0e0] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#001c43] transition-all duration-300"
                                                        style={{ width: `${uploadedFile.progress}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => handleRemoveFile(uploadedFile.id)}
                                        className="w-[24px] h-[24px] flex items-center justify-center text-[#e50019] hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <CircleMinus className="w-[24px] h-[24px]" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-[10px]">
                    <button
                        onClick={handleBack}
                        className="w-[137px] h-[46px] bg-white rounded-[10px] flex items-center justify-center gap-[10px] hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <ArrowRight className="w-[24px] h-[24px] text-[#001c43] rotate-180" />
                        <span className="font-['Montserrat'] font-medium text-[14px] leading-[20px] text-[#001c43]">
                            Back
                        </span>
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!hasCompletedFiles}
                        className={`
                            w-[137px] h-[46px] rounded-[10px] flex items-center justify-center gap-[5px] transition-colors cursor-pointer
                            ${hasCompletedFiles
                                ? 'bg-[#001c43] hover:bg-[#002856] cursor-pointer'
                                : 'bg-[#b1b1b1] cursor-not-allowed'
                            }
                        `}
                    >
                        <span className="font-['Montserrat'] font-medium text-[14px] leading-[20px] text-white">
                            Next
                        </span>
                        <ArrowRight className="w-[24px] h-[24px] text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}