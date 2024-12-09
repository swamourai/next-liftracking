"use client";

import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, FormEvent, ReactNode } from "react";
import { ZodObject, ZodSchema } from "zod";
import { usePageContext } from "../contexts/breadcrumbContext";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { getRequiredFields } from "../schemas/userSchema";

interface AuthFormProps<T, R> {
    schema: ZodSchema<T>;
    title: string;
    children: ReactNode;
    mutationFn: (data: T) => Promise<R>; // R représente le type de la réponse de la mutation
}

function AuthForm<T, R>({ schema, title, children, mutationFn }: AuthFormProps<T, R>) {
    // title
    const { setBreadcrumbs } = usePageContext();

    useEffect(() => {
        setBreadcrumbs([
            { title: title }
        ]);
    }, [setBreadcrumbs, title]);

    // error
    const { toast } = useToast();
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    useEffect(() => {
        if (errorMessages.length) {
            errorMessages.forEach((message) =>
                toast({ title: message, variant: "destructive" })
            );
        }
    }, [errorMessages, toast]);

    const { mutate: mutateFn, isLoading } = useMutation(mutationFn, {
        onSuccess: () => {
            toast({ title: "Succès !" });
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

        if (schema instanceof ZodObject) {
            // Récupérer les champs non optionnels
            const requiredFields = getRequiredFields(schema);

            // Convertir FormData en objet en supprimant les champs vides
            const formObject = Object.fromEntries(
                Array.from(formData.entries()).filter(
                    ([key, value]) =>
                        requiredFields.includes(key) || value !== "" // Garder les champs non optionnels et les champs non vides
                )
            );

            // Validation des données avec le schéma Zod
            const parsed = schema.safeParse(formObject);
            if (!parsed.success) {
                setErrorMessages(parsed.error.errors.map((err) => err.message));
                return;
            }

            mutateFn(parsed.data); // Appeler la fonction de mutation avec les données valides
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-5">
            {children}
            <Button disabled={isLoading} type="submit" variant="default" className="w-full">
                {isLoading ? 'En cours...' : title}
            </Button>
        </form>
    );
}

export default AuthForm;
