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
        <div className="w-full max-w-7xl mx-auto">
            {/* Gradient Banner */}
            <div
                className="h-[150px] w-full rounded-tl-[20px] rounded-tr-[20px] relative mb-[10px]"
                style={{
                    background: 'linear-gradient(90deg, #093471 10%, #114B9F 41%, #0D3F88 63%, #001C43 100%)',
                }}
            />

            {/* Profile Content Card */}
            <div className="bg-white rounded-b-[20px] shadow-sm relative pb-30 pt-32 px-8">
                {/* Profile Picture - Overlapping banner and card */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-[100px]">
                    <Avatar className="h-[200px] w-[200px] border-4 border-white shadow-lg">
                        <AvatarImage
                            src={userData.avatar || '/Ellipse 2824.svg'}
                            alt={userData.name}
                        />
                        <AvatarFallback className="bg-[#001c43] text-white font-['Montserrat'] text-4xl">
                            {getInitials(userData.name)}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* Name and Username */}
                <div className="flex flex-col items-center gap-1 mb-12">
                    <h1 className="text-[18px] font-normal text-[#0F2554] leading-[28px]">
                        {userData.name}
                    </h1>
                    <p className="text-[16px] font-normal text-[#0f2554] leading-[24px]">
                        @{userData.username || 'username'}
                    </p>
                </div>

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
                </div>
            </div>
        </div>
    );
}