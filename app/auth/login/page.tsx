"use client";

import { loginSchema, LoginType } from "@/src/schemas/userSchema";
import axios from "axios";
import AuthForm from "@/src/components/AuthForm";
import { Input } from "@/components/ui/input";

const loginUser = async (data: LoginType) => {
    const { data: responseData } = await axios.post("/api/auth/login", data);
    return responseData;
};

export default function LoginPage() {
    return <AuthForm schema={loginSchema} mutationFn={loginUser} title="Connexion" successMessage="Connexion réussi !">
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
    </AuthForm>;
}