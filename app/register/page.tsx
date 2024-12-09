"use client";

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
import { registerSchema, RegisterType } from "@/src/schemas/userSchema";
import axios from "axios";
import AuthForm from "@/src/components/AuthForm";
import { useState } from "react";

const registerUser = async (data: RegisterType) => {
    const { data: responseData } = await axios.post("/api/auth/register", data);
    return responseData;
};

export default function RegisterPage() {
    const [date, setDate] = useState<Date | undefined>(undefined);

    return (
        <AuthForm schema={registerSchema} title="Inscription" mutationFn={registerUser}>
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
                        <input type="hidden" name="birthday" value={date ? String(date) : ""} />
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
        </AuthForm>
    );
}