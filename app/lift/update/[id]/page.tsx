// app/lift/update/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { Lift, LiftWithId, liftWithIdSchema } from "@/src/schemas/liftSchema";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import FormLift from "@/src/components/FormLift";
import { useParams } from 'next/navigation';
import queryClient from "@/src/lib/react-query";
import Loader from "@/src/components/Loader";
import { usePageContext } from "@/src/contexts/breadcrumbContext";

const updateLift = async (newLift: LiftWithId) => {
    const { data } = await axios.put(`/api/lift/${newLift.id}`, newLift);
    return data;
};

const AddLiftPage = () => {
    // title
    const { setBreadcrumbs } = usePageContext();

    useEffect(() => {
        setBreadcrumbs([
            { title: `Modification d'un lift` }
        ]);
    }, [setBreadcrumbs]);

    const params = useParams<{ id: string }>();
    const liftId = params.id;
    const { data: existingLift, isLoading: isLoadingLift, isError, isIdle } = useQuery(
        ['lift', liftId],
        async () => {
            const { data } = await axios.get<LiftWithId>(`/api/lift/${liftId}`);
            return data;
        },
        {
            onError: (error: Error) => {
                toast.error(`Something went wrong: ${error.message}`);
                router.push('/lift/all');
            },
            enabled: !!liftId, // Se déclenche uniquement si liftId est présent
        }
    );

    // add
    const router = useRouter();
    const { mutate: addNewLift, isLoading } = useMutation(updateLift, {
        onSuccess: () => {
            queryClient.invalidateQueries(["lift", "all"]);
            queryClient.invalidateQueries(["lift", liftId]);
            toast.success('Lift modifié !');
            router.push('/lift/all');
        },
    });

    // submit
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const handleSubmit = (e: React.FormEvent, newLift: Lift) => {
        e.preventDefault();

        const updatedLift = { ...newLift, id };
        const parsed = liftWithIdSchema.safeParse(updatedLift);

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

    if (isLoadingLift || isIdle) return <Loader />;

    if (isError) return <p>Error</p>;

    const { id, ...otherProperties } = existingLift;
    const basedLift: Lift = {
        ...otherProperties,
    };

    return (
        <div>
            <FormLift
                handleSubmit={handleSubmit}
                basedLift={basedLift}
                isLoading={isLoading}
                idUpdateLift={id}
            />
        </div >
    );
};

export default AddLiftPage;
