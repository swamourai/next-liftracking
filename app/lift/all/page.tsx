// app/lifts/page.tsx
"use client";
import { useQuery } from "react-query";
import axios from "axios";
import { LiftWithId } from "@/src/schemas/liftSchema";
import { useEffect } from "react";
import { dayByDate } from "@/src/lib/utils";
import {
    Avatar,
    AvatarImage,
} from "@/components/ui/avatar";
import { CircleX } from 'lucide-react';
import Link from "next/link";
import { Pencil, TicketCheck, TicketX, MessageCircle } from 'lucide-react';
import Loader from "@/src/components/Loader";
import { usePageContext } from "@/src/contexts/breadcrumbContext";
import { useDeleteLiftContext } from "@/src/contexts/deleteLiftContext";

const LiftListPage = () => {
    const { setOpenDialog, setLiftToDelete } = useDeleteLiftContext();

    const { setBreadcrumbs } = usePageContext();

    useEffect(() => {
        setBreadcrumbs([
            { title: 'Liste des lifts' }
        ]);
    }, [setBreadcrumbs]);

    const fetchLifts = async (): Promise<LiftWithId[]> => {
        const { data } = await axios.get("/api/lift");
        return data;
    };
    const { data: lifts, isLoading, isError, isIdle } = useQuery(["lift", "all"], fetchLifts);

    if (isLoading || isIdle) return <Loader />;
    if (isError) return <p>Error...</p>;

    const handleDeleteButton = (lift: LiftWithId) => {
        setLiftToDelete(lift);
        setOpenDialog(true);
    };

    if (!lifts.length) return <p className="p-5">Pas de lift disponible.</p>;

    return (
        <div>
            <ul>
                {lifts.map((lift) => (
                    <li key={lift.id} className="flex text-center h-[60px] items-center border-b-[2px] border-gray-100">
                        <span className="flex-1">
                            <Avatar className="m-auto">
                                <AvatarImage src="https://github.com/swamourai.png" alt="@shadcn" />
                            </Avatar>
                        </span>
                        <span className="flex-1">{dayByDate(lift.date)}</span>
                        <span className="flex-1 flex gap-2">
                            {lift.failure ? <TicketX /> : <TicketCheck />}
                            {lift.comment ? <MessageCircle /> : null}
                        </span>
                        <span className="flex-1 capitalize">{lift.type}</span>
                        <span className="flex-1">{lift.serie} x {lift.rep} reps</span>
                        <span className="flex-1">{lift.weight} kg</span>
                        <span className="flex-1">(RPE {lift.rpe})</span>
                        <span className="flex-0 flex gap-5 pr-5">
                            <Link href={`/lift/update/${lift.id}`}><Pencil /></Link>
                            <button onClick={() => handleDeleteButton(lift)}><CircleX /></button>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LiftListPage;
