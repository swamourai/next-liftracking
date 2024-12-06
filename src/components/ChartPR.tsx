import React from 'react'
import { LiftWithId } from "@/src/schemas/liftSchema"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { CHART_CONFIG } from '../constants/constants'

function ChartPR({ lifts }: { lifts: LiftWithId[] }) {

    const chartData = Object.keys(CHART_CONFIG).map((liftType) => {
        const liftsOfType = lifts.filter((lift) => lift.type === liftType);

        // Trouver le PR (poids maximum) et sa date associée
        const maxLift = liftsOfType.reduce(
            (max, current) =>
                current.weight > max.weight ? current : max,
            { weight: 0, date: null } as { weight: number; date: Date | null }
        );

        return {
            lift: liftType,
            pr: maxLift.weight,
            date: maxLift.date ? new Date(maxLift.date).toLocaleDateString("fr-FR") : "N/A",
            fill: CHART_CONFIG[liftType]?.color || "hsl(var(--chart-default))",
        };
    });


    interface TooltipData {
        lift: number;
        pr: number;
        date: string
    }
    interface CustomTooltipProps {
        active?: boolean;
        payload?: { payload: TooltipData }[];  // Le payload est un tableau d'objets avec une clé 'payload' qui contient les données du graphique
        label?: string;
    }
    const CustomTooltip = ({ active, payload, label }: CustomTooltipProps): JSX.Element | null => {
        if (!active || !payload || payload.length === 0) return null;

        const data = payload[0].payload; // Récupérer les données associées au point
        return (
            <div className="rounded-md bg-white shadow-lg p-2 text-sm text-gray-800">
                {data.lift} : {data.pr} kg<br />{data.date}
            </div>
        );
    };


    return (
        <>
            <h1 className="text-center mb-5">Records personnels (PR) par type de levée</h1>
            <div style={{ overflow: 'visible' }}>
                <ChartContainer config={CHART_CONFIG}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{
                            top: 20,
                            bottom: 20,
                            left: 20,
                            right: 20,
                        }}

                    >
                        <CartesianGrid horizontal={false} />
                        <XAxis
                            dataKey="pr"
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<CustomTooltip />}
                        />
                        <YAxis dataKey="lift" type="category" />
                        <Bar
                            dataKey="pr"
                            layout="vertical"
                            radius={5}
                        >
                            <LabelList
                                dataKey="pr"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </div>
        </>
    )
}

export default ChartPR
