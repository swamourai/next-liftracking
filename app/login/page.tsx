"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent, useEffect, useState } from "react";
import { loginSchema, LoginType } from "@/src/schemas/userSchema";
import { usePageContext } from "@/src/contexts/breadcrumbContext";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { useMutation } from "react-query";

const loginUser = async (userData: LoginType) => {
    const { data } = await axios.post("/api/auth/login", userData);
    return data;
};

export default function Login() {
    const { toast } = useToast();
    // title
    const { setBreadcrumbs } = usePageContext();

    useEffect(() => {
        setBreadcrumbs([
            { title: 'Connexion' }
        ]);
    }, [setBreadcrumbs]);

    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    useEffect(() => {
        if (errorMessages.length) {
            errorMessages.forEach((message) =>
                toast({ title: message, variant: "destructive" })
            );
        }
    }, [errorMessages, toast]);

    const { mutate: loginUserMutate, isLoading } = useMutation(loginUser, {
        onSuccess: () => {
            toast({ title: "Utilisateur connecté !" });
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

        const userData: LoginType = {
            email: String(formData.get("email")),
            password: String(formData.get("password"))
        };

        const parsed = loginSchema.safeParse(userData);

        if (!parsed.success) {
            setErrorMessages(parsed.error.errors.map((err) => err.message));
            return;
        }

        loginUserMutate(userData);
    };
    return <div>
        <form onSubmit={handleSubmit} className="p-5">
            <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                    <label htmlFor="email">E-mail</label>
                    <Input id="email" type="email" name="email" placeholder="e-mail" />
                </div>
                <div>
                    <label htmlFor="password">Mot de passe</label>
                    <Input id="password" type="password" name="password" placeholder="mot de passe" />
                </div>
            </div>
            <Button disabled={isLoading} type="submit" variant="default" className="w-full">
                {isLoading ? 'En cours...' : 'Connexion'}
            </Button>
        </form>
    </div>;
}