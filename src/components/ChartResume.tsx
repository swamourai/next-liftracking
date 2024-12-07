import { Label, Pie, PieChart } from "recharts";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { LiftWithId } from "@/src/schemas/liftSchema";
import { dayByDate } from "@/src/lib/utils";
import { liftNameType } from '../schemas/liftNameSchema';
import Link from 'next/link';
import { CHART_CONFIG } from '../constants/constants';

function ChartResume({ lifts }: { lifts: LiftWithId[] }) {

    // Étape 1 : Agréger les données par type
    const liftCounts = lifts.reduce((acc: Record<string, number>, lift: LiftWithId) => {
        acc[lift.type] = (acc[lift.type] || 0) + 1;
        return acc;
    }, {});

    // Étape 2 : Mapper les données au format `chartDataResume`
    const chartDataResume = Object.entries(liftCounts).map(([type, count]) => ({
        type: type as liftNameType,  // Forcer le type pour `type`
        number: count,
        fill: `var(--color-${type})`, // Assurez-vous que les couleurs existent dans votre CSS
    }));

    const totalLift = chartDataResume.reduce((acc, curr) => acc + curr.number, 0);

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
        <>
            <h1>Nombre total de lift</h1>
            <h2 className="text-gray-500 text-sm">
                {dayByDate(minDate)} au {dayByDate(maxDate)}
            </h2>
            <div>
                <ChartContainer
                    config={CHART_CONFIG}
                    className="mx-auto aspect-square max-h-[250px] min-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartDataResume}
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
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </div>
            <ul className="flex items-center gap-2 font-medium leading-none">
                {chartDataResume.map(c => (
                    <li key={c.type}
                        className="px-2 py-1 rounded"
                        style={{ backgroundColor: `hsl(var(--chart-${c.type}))` }}
                    >
                        <Link href={`/lift/chart/${c.type}`} className='capitalize text-white'>{c.type}</Link>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default ChartResume;