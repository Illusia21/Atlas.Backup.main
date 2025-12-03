// Mapping of departments to their programs (cost centers)
export const DEPARTMENT_PROGRAMS: Record<string, string[]> = {
    ATYCB: [
        'AIS - Accounting Information System',
        'Accountancy',
        'BA - Business Administration',
        'ENTREP - Entrepreneurship',
        'TM - Tourism Management'
    ],
    CAS: [
        'COMM - Communication',
        'MMA - Multimedia Arts',
    ],
    CCIS: [
        'CS - Computer Science',
        'EMC - Entertainment and Multimedia Computing',
        'IS - Information Systems',
    ],
    CEA: [
        'AR - Architecture',
        'CE - Civil Engineering',
        'CHE - Chemical Engineering',
        'ChemE - Chemical Engineering',
        'CpE - Computer Engineering',
        'ECE - Electronics and Communications Engineering',
        'EE - Electrical Engineering',
        'IE - Industrial Engineering',
        'ME - Mechanical Engineering',
    ],
    CHS: [
        'BIO - Biology',
        'MT / MLS - Medical Technology / Medical Laboratory Science',
        'PHAR - Psychology',
        'PSYCH - Psychology',
        'PT - Physical Therapy',
    ],
    Admin: [
        'Lorem  Ipsum',
    ],
    Finance: [
        'Lorem  Ipsum',
    ],
    HR: [
        'Lorem  Ipsum',
    ],
};

// Get programs for a specific department
export const getProgramsByDepartment = (department: string): string[] => {
    return DEPARTMENT_PROGRAMS[department] || [];
};