import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useDeleteLiftContext } from "../contexts/deleteLiftContext";
import { Button } from "@/components/ui/button";
import { dayByDate } from "../lib/utils";

function DialogDeleteLift() {
    const { openDialog, setOpenDialog, liftToDelete, deleteMutation } = useDeleteLiftContext();
    if (liftToDelete && openDialog) {
        return (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
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
            </Dialog>
        );
    }
    return null;
}

export default DialogDeleteLift;