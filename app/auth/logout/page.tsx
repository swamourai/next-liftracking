"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "react-query";

const LogoutPage = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => {
        const performLogout = async () => {
            await fetch("/api/auth/logout", { method: "POST" }); // Appel à l'API de déconnexion
            queryClient.invalidateQueries(["session"]);
            router.push("/"); // Redirige vers la page d'accueil après la déconnexion
        };

        performLogout();
    }, [router, queryClient]);

    return <p>Déconnexion en cours...</p>; // Message temporaire
};

export default LogoutPage;
