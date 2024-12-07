// app/lift/new/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import axios from "axios";
import { Lift, liftSchema } from "@/src/schemas/liftSchema";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import FormLift from "@/src/components/FormLift";
import queryClient from "@/src/lib/react-query";
import { usePageContext } from "@/src/contexts/breadcrumbContext";

const addLift = async (newLift: Lift) => {
    const { data } = await axios.post("/api/lift", newLift);
    return data;
};

const AddLiftPage = () => {
    // title
    const { setBreadcrumbs } = usePageContext();

    useEffect(() => {
        setBreadcrumbs([
            { title: 'Nouveau lift' }
        ]);
    }, [setBreadcrumbs]);
    // add
    const router = useRouter();
    const { mutate: addNewLift, isLoading } = useMutation(addLift, {
        onSuccess: () => {
            toast.success('Lift ajouté !');
            queryClient.invalidateQueries(["lift", "all"]);
            router.push('/lift/all');
        },
    });

    const basedLift: Lift = {
        rpe: 7,
        rep: 1,
        weight: 10,
        type: "",
        userId: 1,
        serie: 1,
        date: new Date,
        comment: null,
        failure: false,
        failureSerie: null,
        failureRep: null
    };

    // submit
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const handleSubmit = (e: React.FormEvent, newLift: Lift) => {
        e.preventDefault();

        const parsed = liftSchema.safeParse(newLift);

        if (!parsed.success) {
            setErrorMessages(parsed.error.errors.map((err) => err.message));
            return;
        }

        setErrorMessages([]);
        addNewLift(parsed.data);
    };

    useEffect(() => {
        if (errorMessages.length) {
            errorMessages.forEach((message) => (
                toast.warn(message)
            ));
        }
    }, [errorMessages]);

    return (
        <div>
            <FormLift
                handleSubmit={handleSubmit}
                basedLift={basedLift}
                isLoading={isLoading}
            />
        </div >
    );
};

export default AddLiftPage;
