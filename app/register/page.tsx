"use client";

import { useToast } from "@/hooks/use-toast";
import { registerSchema, RegisterType } from "@/src/schemas/userSchema";
import axios, { AxiosError } from "axios";
import { FormEvent, useEffect, useState } from "react";
import { useMutation } from "react-query";

const addUser = async (userData: RegisterType) => {
    const { data } = await axios.post("/api/auth/register", userData);
    return data;
};

function RegisterPage() {
    const { toast } = useToast();
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    useEffect(() => {
        if (errorMessages.length) {
            errorMessages.forEach((message) =>
                toast({ title: message, variant: "destructive" })
            );
        }
    }, [errorMessages, toast]);

    const { mutate: registerNewUser, isLoading } = useMutation(addUser, {
        onSuccess: () => {
            toast({ title: "Utilisateur enregistré avec succès !" });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast({
                title: error.response?.data?.error || "Une erreur s'est produite",
                variant: "destructive",
            });
        },
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const userData: RegisterType = {
            email: String(formData.get("email")),
            password: String(formData.get("password")),
            username: String(formData.get("username")),
        };

        const parsed = registerSchema.safeParse(userData);
        if (!parsed.success) {
            setErrorMessages(parsed.error.errors.map((err) => err.message));
            return;
        }

        registerNewUser(userData);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="email" placeholder="email" />
                <input type="text" name="username" placeholder="username" />
                <input type="password" name="password" placeholder="password" />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "En cours..." : "S'inscrire"}
                </button>
            </form>
        </div>
    );
}

export default RegisterPage;
