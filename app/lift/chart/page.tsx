"use client"

import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"


import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Lift, LiftWithId } from "@/src/schemas/liftSchema"
import axios from "axios"
import { useQuery } from "react-query"
import Loader from "@/src/components/Loader"
import { dayByDate } from "@/src/lib/utils"
import { useEffect } from "react"
import Link from "next/link"
import { usePageContext } from "@/src/contexts/breadcrumbContext"

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

    if (isLoading || isIdle) return <Loader />
    if (isError) return <p>Error</p>

    if (!lifts.length) return <p className="p-5">Pas de lift.</p>

    // Étape 1 : Agréger les données par type
    const liftCounts = lifts.reduce((acc: Record<string, number>, lift: any) => {
        acc[lift.type] = (acc[lift.type] || 0) + 1;
        return acc;
    }, {});

    // Étape 2 : Mapper les données au format `chartData`
    const chartData = Object.entries(liftCounts).map(([type, count]) => ({
        type: type,
        number: count,
        fill: `var(--color-${type})`,
    }));
    const chartConfig = {
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
    } satisfies ChartConfig

    const totalLift = chartData.reduce((acc, curr) => acc + curr.number, 0)

    const getMinMaxDates = (lifts: { date: string | Date }[]) => {
        const dates = lifts.map((lift) =>
            typeof lift.date === "string" ? new Date(lift.date) : lift.date
        );
        const minDate = new Date(Math.min(...dates.map((date) => date.getTime())));
        const maxDate = new Date(Math.max(...dates.map((date) => date.getTime())));

        return { minDate, maxDate };
    };

    const { minDate, maxDate } = getMinMaxDates(lifts);

    return (
        <div className="flex flex-col items-center p-5">
            <h1>Nombre total de lift</h1>
            <h2 className="text-gray-500 text-sm">
                {dayByDate(minDate)} au {dayByDate(maxDate)}
            </h2>
            <div>
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] min-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="number"
                            nameKey="type"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalLift.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Lifts
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </div>
            <ul className="flex items-center gap-2 font-medium leading-none">
                {chartData.map(c => (
                    <li key={c.type}
                        className="px-2 py-1 rounded"
                        style={{ backgroundColor: `hsl(var(--chart-${c.type}))` }}
                    >
                        <Link href={`/lift/chart/${c.type}`}>{c.type}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
