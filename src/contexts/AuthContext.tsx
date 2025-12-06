import { createContext, useState, useEffect, type ReactNode } from 'react';
import { ACCESS_TOKEN } from '../constants';

export interface User {
    id: string;
    name: string;
    department: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in (token exists)
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (token) {
            // TODO: In the future, fetch user data from backend using token
            // For now, use mock data
            const mockUser: User = {
                id: '12345',
                name: 'Aisha Nicole Dones',
                department: 'CCIS',
                email: 'aisha.dones@mapua.edu.ph',
                role: 'CSA Facilitator'
            };
            setUser(mockUser);
        }

        setIsLoading(false);
    }, []);

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};