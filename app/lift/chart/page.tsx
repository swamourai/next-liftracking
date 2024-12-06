"use client";

import { LiftWithId } from "@/src/schemas/liftSchema";
import axios from "axios";
import { useQuery } from "react-query";
import Loader from "@/src/components/Loader";
import { useEffect } from "react";
import { usePageContext } from "@/src/contexts/breadcrumbContext";
import ChartResume from "@/src/components/ChartResume";
import ChartPR from "@/src/components/ChartPR";
import { liftNames } from "@/src/schemas/liftNameSchema";
import Link from "next/link";

// Déclarez les types pour `chartConfig`
type LiftType = 'muscle-up' | 'dips' | 'pull-up' | 'squat';

export default function Component() {

    const { setBreadcrumbs } = usePageContext();

    useEffect(() => {
        setBreadcrumbs([
            { title: 'Statistique' }
        ]);
    }, [setBreadcrumbs]);

    const fetchLifts = async (): Promise<LiftWithId[]> => {
        const { data } = await axios.get("/api/lift");
        return data;
    };
    const { data: lifts, isLoading, isError, isIdle } = useQuery(["lift", "all"], fetchLifts);

    if (isLoading || isIdle) return <Loader />;
    if (isError) return <p className="p-5">Erreur lors du chargement des données.</p>;

    if (!lifts.length) return <p className="p-5">Pas de lift disponible.</p>;

    const chartConfig: Record<LiftType, { label: string; color: string }> = {
        'muscle-up': {
            label: "Muscle-up",
            color: "hsl(var(--chart-muscle-up))",
        },
        'dips': {
            label: "Dips",
            color: "hsl(var(--chart-dips))",
        },
        'pull-up': {
            label: "Pull-up",
            color: "hsl(var(--chart-pull-up))",
        },
        'squat': {
            label: "Squat",
            color: "hsl(var(--chart-squat))",
        },
    };

    return (
        <>
            <div className="flex">
                {liftNames.map(l => <Link
                    key={l}
                    href={`/lift/chart/${l}`}
                    style={{ backgroundColor: `hsl(var(--chart-${l}))` }}
                    className={`flex-1 text-center h-10 leading-10 capitalize`}
                >{l}</Link>)}
            </div>
            <div className="flex flex-col md:flex-row">
                <div className="flex flex-col items-center p-5 flex-0">
                    <ChartResume lifts={lifts} />
                </div>
                <div className="flex flex-1 p-5">
                    <div className="w-full">
                        <ChartPR lifts={lifts} />
                    </div>
                </div>
            </div>
        </>
    );
}
