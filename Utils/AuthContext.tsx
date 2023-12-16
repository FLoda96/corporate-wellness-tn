import { createContext } from 'react';

export const UserContext = createContext<UserContextType | null>(null);

export type UserContextType = {
    User: string;
    SetUser: Function;
};

export const UserIdContext = createContext<UserIdContextType | null>(null);

export type UserIdContextType = {
    UserId: number;
    SetUserId: Function;
};

export const LoginContext = createContext<LoginContextType | null>(null);

export type LoginContextType = {
    IsAuthenticated: boolean;
    SetIsAuthenticated: Function;
};