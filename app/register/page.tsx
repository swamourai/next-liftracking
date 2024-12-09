"use client";

import { useToast } from "@/hooks/use-toast";
import { genderSchema, registerSchema, RegisterType } from "@/src/schemas/userSchema";
import axios, { AxiosError } from "axios";
import { FormEvent, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { usePageContext } from "@/src/contexts/breadcrumbContext";

const addUser = async (userData: RegisterType) => {
    const { data } = await axios.post("/api/auth/register", userData);
    return data;
};

function RegisterPage() {
    const { toast } = useToast();
    // title
    const { setBreadcrumbs } = usePageContext();

    useEffect(() => {
        setBreadcrumbs([
            { title: 'Inscription' }
        ]);
    }, [setBreadcrumbs]);

    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [date, setDate] = useState<Date | undefined>(undefined);

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
            birthday: date,
        };
        if (formData.get("weight") && Number(formData.get("weight")) > 0) {
            userData.weight = Number(formData.get("weight"));
        }
        const genderValue = String(formData.get("gender"));
        const parsedGender = genderSchema.safeParse(genderValue);
        if (parsedGender.success) {
            userData.gender = parsedGender.data;
        }

        const parsed = registerSchema.safeParse(userData);

        if (!parsed.success) {
            setErrorMessages(parsed.error.errors.map((err) => err.message));
            return;
        }

        registerNewUser(userData);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="p-5">
                <div className="grid grid-cols-2 gap-5 mb-5">
                    <div>
                        <label htmlFor="email">E-mail <sup className="text-red-800">*</sup></label>
                        <Input id="email" type="email" name="email" placeholder="e-mail" />
                    </div>
                    <div>
                        <label htmlFor="password">Mot de passe <sup className="text-red-800">*</sup></label>
                        <Input id="password" type="password" name="password" placeholder="mot de passe" />
                    </div>
                    <div>
                        <label htmlFor="username">Username <sup className="text-red-800">*</sup></label>
                        <Input id="username" type="text" name="username" placeholder="username" />
                    </div>
                    <div>
                        <label htmlFor="weight">Poids</label>
                        <Input id="weight" type="number" name="weight" />
                    </div>
                    <div>
                        <label>Date de naissance</label>
                        <div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={date => date && setDate(date)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div>
                        <label>Genre</label>
                        <Select name="gender">
                            <SelectTrigger className="capitalize">
                                <SelectValue placeholder="Genre" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="homme">Homme</SelectItem>
                                <SelectItem value="femme">Femme</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button disabled={isLoading} type="submit" variant="default" className="w-full">
                    {isLoading ? 'En cours...' : 'Inscription'}
                </Button>
            </form>
        </div>
    );
}

export default RegisterPage;
