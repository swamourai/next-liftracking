"use client"

import { liftNameSchema } from "@/src/schemas/liftNameSchema"
import { notFound, useParams } from "next/navigation"
import { useEffect, useMemo } from "react"
import axios from "axios"
import { useQuery } from "react-query"
import { format } from "date-fns";

import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
} from "@/components/ui/chart"
import Loader from "@/src/components/Loader"
import { LiftWithId } from "@/src/schemas/liftSchema"
import { usePageContext } from "@/src/contexts/breadcrumbContext"

// Fonction pour récupérer les lifts (avec option de filtrage)
const fetchLifts = async (liftType: string): Promise<LiftWithId[]> => {
    const response = await axios.get(`/api/lift/${liftType}`);
    return response.data;  // Retourne les données de l'API
};

// Hook React Query pour récupérer uniquement les lifts de type "dips"
const useLifts = (liftType: string) => {
    return useQuery(['lift', liftType], () => fetchLifts(liftType), {
        enabled: !!liftType,  // Ne fait la requête que si un type est sélectionné
    });
};

type ChartData = {
    date: string; // Formatté comme "DD/MM"
    tonnage: number; // Tonnage total pour cette date
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0].payload; // Récupérer les données associées au point
    return (
        <div className="rounded-md bg-white shadow-lg p-2 text-sm text-gray-800">
            <p className="font-medium">Date: {label}</p>
            <p>Tonnage: {data.tonnage}</p>
            <p>Détails: {data.serie} séries x {data.rep} reps x {data.weight} kg</p>
        </div>
    );
};

function ChartType() {
    const params = useParams<{ type: string }>();
    const type = params.type;

    // Valider le type avant les Hooks
    const parse = liftNameSchema.safeParse(type);
    if (!parse.success) {
        return notFound();
    }

    const { setBreadcrumbs } = usePageContext();

    useEffect(() => {
        setBreadcrumbs([
            { title: 'Statistique', url: '/lift/chart' },
            { title: type }
        ]);
    }, [setBreadcrumbs]);

    const { data: lifts, isLoading } = useLifts(type);

    // Ne pas conditionner les Hooks
    const chartData: ChartData[] = useMemo(() => {
        if (!lifts) return [];

        return lifts.map((lift: LiftWithId) => ({
            date: format(new Date(lift.date), "dd/MM"),
            tonnage: lift.weight * lift.rep * lift.serie,
            serie: lift.serie, // Ajout
            rep: lift.rep,     // Ajout
            weight: lift.weight, // Ajout
        }));
    }, [lifts]);

    if (isLoading) return <Loader />;

    const chartConfig = {
        tonnage: {
            label: "Tonnage",
            color: `hsl(var(--chart-${type}))`,
        },
    } satisfies ChartConfig;

    return (
        <div className="p-5">
            <h1 className="mb-5 text-center text-xl"><span className="capitalize">{type}</span> - Séance par tonnage</h1>
            <ChartContainer config={chartConfig}>
                <LineChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                        top: 20,
                        left: 12,
                        right: 12,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        interval="preserveStartEnd"
                        tickFormatter={(value) => value.slice(0, 5)}
                    />
                    <ChartTooltip
                        cursor={{ stroke: 'var(--color-cursor)', strokeWidth: 1 }}
                        content={<CustomTooltip />}
                    />
                    <Line
                        dataKey="tonnage"
                        type="natural"
                        stroke="var(--color-tonnage)"
                        strokeWidth={2}
                        dot={{
                            fill: "var(--color-tonnage)",
                        }}
                        activeDot={{
                            r: 6,
                        }}
                    >
                        <LabelList
                            position="top"
                            offset={12}
                            className="fill-foreground"
                            fontSize={12}
                        />
                    </Line>
                </LineChart>
            </ChartContainer>

        </div>
    );
}


export default ChartType
