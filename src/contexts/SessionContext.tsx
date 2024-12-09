// /contexts/SessionContext.tsx
import React, { createContext, useContext, ReactNode } from "react";
import { useQuery } from "react-query";
import { SessionData } from "../schemas/session.type";

// Définir le contexte avec un type
type SessionContextType = {
    session: SessionData;
    refetchSession: () => void; // Fonction pour rafraîchir la session
    isLoading: boolean
};

// Initialiser le contexte
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Fonction pour récupérer les données de session depuis l'API
const fetchSession = async (): Promise<SessionData> => {
    const res = await fetch("/api/auth/session");
    if (!res.ok) {
        throw new Error("Failed to fetch session data");
    }
    return res.json();
};

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Utilisation de react-query pour récupérer la session
    const { data: session, isLoading, refetch } = useQuery(
        ["session"], // Identifiant de la query
        fetchSession, // Fonction de récupération des données de session
        {
            refetchOnWindowFocus: false, // Ne pas refetcher automatiquement lors du focus sur la fenêtre
            staleTime: 5 * 60 * 1000, // L'état reste valide pendant 5 minutes
        }
    );

    // Fournir le contexte à l'application
    return (
        <SessionContext.Provider value={{ session: session || { isLoggedIn: false }, refetchSession: refetch, isLoading }}>
            {children}
        </SessionContext.Provider>
    );
};

// Hook personnalisé pour accéder au contexte
export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
};
