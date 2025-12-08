import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Profile() {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        return <div>Loading...</div>;
    }

    const { user } = authContext;

    // TODO: Remove this dummy if ready
    const userData = user || {
        id: '2017181910',
        name: 'Aisha Nicole Dones',
        username: 'username',
        department: 'Human Resources',
        position: 'Manager',
        email: 'flName@mcm.edu.ph',
        role: 'CSA Facilitator',
        contactNumber: '097778888191',
        avatar: '/Ellipse 2824.svg',
    };

    // WHEN BACKEND IS READY:
    // const userData = user;

    const getInitials = (name: string) => {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
<<<<<<< HEAD
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Gradient Banner */}
            <div
                className="h-24 sm:h-32 md:h-40 lg:h-[150px] w-full rounded-tl-lg rounded-tr-lg sm:rounded-tl-xl sm:rounded-tr-xl relative mb-2 sm:mb-[10px]"
=======
        <div className="w-full max-w-7xl mx-auto">
            {/* Gradient Banner */}
            <div
                className="h-[150px] w-full rounded-tl-[20px] rounded-tr-[20px] relative mb-[10px]"
>>>>>>> 6984b49 (AC-122-124 done)
                style={{
                    background: 'linear-gradient(90deg, #093471 10%, #114B9F 41%, #0D3F88 63%, #001C43 100%)',
                }}
            />

            {/* Profile Content Card */}
<<<<<<< HEAD
            <div className="bg-white rounded-b-lg sm:rounded-b-xl shadow-sm relative pb-12 sm:pb-16 md:pb-20 pt-20 sm:pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-8">
                {/* Profile Picture - Overlapping banner and card */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-12 sm:-top-16 md:-top-20 lg:-top-[100px]">
                    <Avatar className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-[200px] lg:w-[200px] border-2 sm:border-4 border-white shadow-lg">
=======
            <div className="bg-white rounded-b-[20px] shadow-sm relative pb-30 pt-32 px-8">
                {/* Profile Picture - Overlapping banner and card */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-[100px]">
                    <Avatar className="h-[200px] w-[200px] border-4 border-white shadow-lg">
>>>>>>> 6984b49 (AC-122-124 done)
                        <AvatarImage
                            src={userData.avatar || '/Ellipse 2824.svg'}
                            alt={userData.name}
                        />
<<<<<<< HEAD
                        <AvatarFallback className="bg-[#001c43] text-white font-['Montserrat'] text-xl sm:text-2xl md:text-3xl lg:text-4xl">
=======
                        <AvatarFallback className="bg-[#001c43] text-white font-['Montserrat'] text-4xl">
>>>>>>> 6984b49 (AC-122-124 done)
                            {getInitials(userData.name)}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* Name and Username */}
<<<<<<< HEAD
                <div className="flex flex-col items-center gap-1 mb-8 sm:mb-10 md:mb-12">
                    <h1 className="text-base sm:text-lg md:text-xl font-normal text-[#0F2554] leading-tight text-center px-4">
                        {userData.name}
                    </h1>
                    <p className="text-sm sm:text-base font-normal text-[#0f2554] leading-tight">
=======
                <div className="flex flex-col items-center gap-1 mb-12">
                    <h1 className="text-[18px] font-normal text-[#0F2554] leading-[28px]">
                        {userData.name}
                    </h1>
                    <p className="text-[16px] font-normal text-[#0f2554] leading-[24px]">
>>>>>>> 6984b49 (AC-122-124 done)
                        @{userData.username || 'username'}
                    </p>
                </div>

<<<<<<< HEAD
                {/* User Details Grid - Responsive Layout */}
                <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 border border-black">
                    {/* Mobile: Single Column, Tablet+: Two Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto_1fr] gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-4 sm:gap-y-6 md:gap-y-8 lg:gap-y-10">
                        {/* Row 1 - Department */}
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-normal text-[#0f2554] md:text-right">
                            Department :
                        </p>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-normal text-[#0f2554] mb-3 md:mb-0">
                            {userData.department || 'N/A'}
                        </p>

                        {/* Row 1 - User ID */}
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-normal text-[#0f2554] md:text-right">
                            User ID :
                        </p>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-normal text-[#0f2554] mb-3 md:mb-0">
                            {userData.id || 'N/A'}
                        </p>

                        {/* Row 2 - Position */}
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-normal text-[#0f2554] md:text-right">
                            Position :
                        </p>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-normal text-[#0f2554] mb-3 md:mb-0">
                            {userData.position || 'N/A'}
                        </p>

                        {/* Row 2 - Email */}
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-normal text-[#0f2554] md:text-right">
                            Email (s) :
                        </p>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-normal text-[#0f2554] mb-3 md:mb-0 break-words">
                            {userData.email || 'N/A'}
                        </p>

                        {/* Row 3 - System Role */}
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-normal text-[#0f2554] md:text-right">
                            System Role :
                        </p>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-normal text-[#0f2554] mb-3 md:mb-0">
                            {userData.role || 'N/A'}
                        </p>

                        {/* Row 3 - Contact */}
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-normal text-[#0f2554] md:text-right">
                            Contact No. :
                        </p>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-normal text-[#0f2554]">
                            {userData.contactNumber || 'N/A'}
                        </p>
                    </div>
=======
                {/* User Details Grid - Single unified grid */}
                <div className="grid grid-cols-[auto_1fr_auto_1fr] gap-x-8 gap-y-10 max-w-3xl mx-auto items-center">
                    {/* Row 1 */}
                    <p className="text-[20px] font-normal text-[#0f2554] text-right">
                        Department :
                    </p>
                    <p className="text-[20px] font-normal text-[#0f2554]">
                        {userData.department || 'N/A'}
                    </p>
                    <p className="text-[20px] font-normal text-[#0f2554] text-right">
                        User ID :
                    </p>
                    <p className="text-[20px] font-normal text-[#0f2554]">
                        {userData.id || 'N/A'}
                    </p>

                    {/* Row 2 */}
                    <p className="text-[20px] font-normal text-[#0f2554] text-right">
                        Position :
                    </p>
                    <p className="text-[20px] font-normal text-[#0f2554]">
                        {userData.position || 'N/A'}
                    </p>
                    <p className="text-[20px] font-normal text-[#0f2554] text-right">
                        Email (s) :
                    </p>
                    <p className="text-[20px] font-normal text-[#0f2554]">
                        {userData.email || 'N/A'}
                    </p>

                    {/* Row 3 */}
                    <p className="text-[20px] font-normal text-[#0f2554] text-right">
                        System Role :
                    </p>
                    <p className="text-[20px] font-normal text-[#0f2554]">
                        {userData.role || 'N/A'}
                    </p>
                    <p className="text-[20px] font-normal text-[#0f2554] text-right">
                        Contact No. :
                    </p>
                    <p className="text-[20px] font-normal text-[#0f2554]">
                        {userData.contactNumber || 'N/A'}
                    </p>
>>>>>>> 6984b49 (AC-122-124 done)
                </div>
            </div>
        </div>
    );
}