import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { LiftWithId } from "../schemas/liftSchema";
import { useMutation, UseMutationResult } from "react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import queryClient from "../lib/react-query";

interface DeleteLiftContextType {
    liftToDelete: LiftWithId | null;
    setLiftToDelete: React.Dispatch<React.SetStateAction<LiftWithId | null>>;
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
    deleteMutation: UseMutationResult<void, unknown, number, unknown>;
}

const DeleteLiftContext = createContext<DeleteLiftContextType>({
    liftToDelete: null,
    setLiftToDelete: () => { },
    openDialog: false,
    setOpenDialog: () => { },
    deleteMutation: {} as UseMutationResult<void, unknown, number, unknown>,
});

export const DeleteLiftContextProvider = ({ children }: { children: ReactNode }) => {
    const [liftToDelete, setLiftToDelete] = useState<LiftWithId | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (!openDialog && liftToDelete) {
            setLiftToDelete(null);
        }
    }, [openDialog, liftToDelete]);

    const deleteMutation = useMutation(
        async (id: number) => {
            await axios.delete(`/api/lift/${id}`);
        }, {
        onSuccess: () => {
            setOpenDialog(false);
            toast({ title: 'Lift deleted successfully!' });
        },
        onSettled: () => {
            queryClient.invalidateQueries(["lift", "all"]);
        },
    });

    return (
        <DeleteLiftContext.Provider value={{ liftToDelete, setLiftToDelete, openDialog, setOpenDialog, deleteMutation }}>
            {children}
        </DeleteLiftContext.Provider>
    );
};

export const useDeleteLiftContext = () => {
    const context = useContext(DeleteLiftContext);
    return context;
};
