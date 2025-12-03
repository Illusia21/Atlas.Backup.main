// Mapping of departments to their programs (cost centers)
export const DEPARTMENT_PROGRAMS: Record<string, string[]> = {
    CCIS: [
        'CS - Computer Science',
        'EMC - Entertainment and Multimedia Computing',
        'IS - Information Systems',
    ],
    CEA: [
        'CE - Civil Engineering',
        'CHE - Chemical Engineering',
        'ECE - Electronics and Communications Engineering',
        'EE - Electrical Engineering',
        'IE - Industrial Engineering',
        'ME - Mechanical Engineering',
    ],
    CAFA: [
        'ARCH - Architecture',
        'ID - Interior Design',
        'MMA - Multimedia Arts',
    ],
    CSB: [
        'ACCTG - Accountancy',
        'BA - Business Administration',
        'ECON - Economics',
        'ENTREP - Entrepreneurship',
    ],
    CHTM: [
        'HM - Hotel Management',
        'TM - Tourism Management',
    ],
    COL: [
        'AB - Arts and Letters',
        'PSYCH - Psychology',
        'SOCIO - Sociology',
    ],
    Admin: [
        'ADMIN - Administration',
        'FACILITIES - Facilities Management',
    ],
    Finance: [
        'FIN - Finance Department',
        'ACCT - Accounting Department',
    ],
    HR: [
        'HR - Human Resources',
        'PAYROLL - Payroll',
    ],
};

// Get programs for a specific department
export const getProgramsByDepartment = (department: string): string[] => {
    return DEPARTMENT_PROGRAMS[department] || [];
};