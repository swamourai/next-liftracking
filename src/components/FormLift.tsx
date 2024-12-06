"use client";

import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CirclePlus } from 'lucide-react';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Lift } from "../schemas/liftSchema";
import { useEffect, useState } from "react";
import { liftNames } from "../schemas/liftNameSchema";

function FormLift({ handleSubmit, basedLift, isLoading, isUpdateLift }: {
    handleSubmit: (e: React.FormEvent, newLift: Lift) => void,
    basedLift: Lift,
    isLoading: boolean,
    isUpdateLift?: boolean
}) {
    const [date, setDate] = useState<Date>(basedLift.date);
    const [newLift, setNewLift] = useState<Lift>(basedLift);

    useEffect(() => {
        setNewLift(prevLift => ({ ...prevLift, date: date }));
    }, [date]);

    return (
        <form onSubmit={e => handleSubmit(e, newLift)} className="p-5">
            <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                    <label>Date</label>
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
                    <label htmlFor="rpe">RPE</label>
                    <Input
                        id="rpe"
                        type="number"
                        placeholder="RPE"
                        value={newLift.rpe}
                        onChange={(e) => setNewLift({ ...newLift, rpe: +e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="series">Series</label>
                    <Input
                        id="series"
                        type="number"
                        placeholder="Series"
                        value={newLift.serie}
                        onChange={(e) => setNewLift({ ...newLift, serie: +e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="reps">Reps</label>
                    <Input
                        id="reps"
                        type="number"
                        placeholder="Reps"
                        value={newLift.rep}
                        onChange={(e) => setNewLift({ ...newLift, rep: +e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="Weight">Poids (kg)</label>
                    <Input
                        id="Weight"
                        type="number"
                        placeholder="Weight"
                        value={newLift.weight}
                        onChange={(e) => setNewLift({ ...newLift, weight: +e.target.value })}
                    />
                </div>
                <div>
                    <label>Lift</label>
                    <Select
                        value={newLift.type}
                        onValueChange={type => setNewLift({ ...newLift, type: type })}
                    >
                        <SelectTrigger className="capitalize">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {liftNames.map(liftName => <SelectItem key={liftName} value={liftName} className="capitalize">{liftName}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="mb-5">
                <label>Commentaire</label>
                <Textarea onChange={e => setNewLift({ ...newLift, comment: e.target.value || null })} placeholder="Commentaire sur le lift" />
            </div>
            <div className="flex items-center space-x-2 mb-5">
                <Checkbox id="failure" checked={Boolean(newLift.failure)} onCheckedChange={check => setNewLift({ ...newLift, failure: Boolean(check) })} />
                <label
                    htmlFor="failure"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Échec lors du lift
                </label>
            </div>
            {newLift.failure && <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                    <label htmlFor="failure-serie">Série de l&apos;échec</label>
                    <Input
                        id="failure-serie"
                        type="number"
                        value={Number(newLift.failureSerie)}
                        onChange={(e) => setNewLift({ ...newLift, failureSerie: +e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="failure-rep">Rép à l&apos;échec</label>
                    <Input
                        id="failure-rep"
                        type="number"
                        value={Number(newLift.failureRep)}
                        onChange={(e) => setNewLift({ ...newLift, failureRep: +e.target.value })}
                    />
                </div>
            </div>}
            <Button disabled={isLoading} type="submit" variant="outline" className="w-full">
                <CirclePlus /> {isUpdateLift ? 'Modifier' : 'Ajouter'} le lift
            </Button>
        </form>
    );
}

export default FormLift;
