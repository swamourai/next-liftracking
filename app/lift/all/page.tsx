// app/lifts/page.tsx
"use client"
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { LiftWithId } from "@/src/schemas/liftSchema";
import { useEffect, useState } from "react";
import { dayByDate } from "@/src/lib/utils";
import {
    Avatar,
    AvatarImage,
} from "@/components/ui/avatar"
import { CircleX } from 'lucide-react';
import queryClient from "@/src/lib/react-query";
import { toast } from 'react-toastify';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil, TicketCheck, TicketX } from 'lucide-react';
import Loader from "@/src/components/Loader";
import { usePageContext } from "@/src/contexts/breadcrumbContext";

const LiftListPage = () => {
    const [openDialog, setOpenDialog] = useState(false)
    const [liftToDelete, setLiftToDelete] = useState<LiftWithId | null>(null)

    useEffect(() => {
        if (!openDialog && liftToDelete) {
            setLiftToDelete(null)
        }
    }, [openDialog])

    const { setBreadcrumbs } = usePageContext();

    useEffect(() => {
        setBreadcrumbs([
            { title: 'Liste des lifts' }
        ]);
    }, [setBreadcrumbs]);

    const deleteMutation = useMutation(
        async (id: number) => {
            await axios.delete(`/api/lift/${id}`);
        }, {
        onSuccess: () => {
            setOpenDialog(false);
            toast.success('Lift deleted successfully!');
        },
        onSettled: () => {
            // Ré-invalider la requête après suppression
            queryClient.invalidateQueries(["lift", "all"]);
        },
    }
    )

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
    }

    return (
        <div>
            {liftToDelete && <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Êtes-vous sûr de vouloir supprimer ce lift ?</DialogTitle>
                        <DialogDescription>
                            <span className="capitalize">{liftToDelete.type}</span> - {dayByDate(liftToDelete.date)}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end">
                        <Button type="button" variant="destructive" onClick={() => deleteMutation.mutate(liftToDelete.id)}>
                            Supprimer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>}
            <ul>
                {lifts.map((lift) => (
                    <li key={lift.id} className="flex text-center h-[60px] items-center border-b-[2px] border-gray-100">
                        <span className="flex-1">
                            <Avatar className="m-auto">
                                <AvatarImage src="https://github.com/swamourai.png" alt="@shadcn" />
                            </Avatar>
                        </span>
                        <span className="flex-1">{dayByDate(lift.date)}</span>
                        <span className="flex-1">{lift.failure ? <TicketX /> : <TicketCheck />}</span>
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
