"use client";
import { useQuery } from "react-query";
import { getLifts } from "../actions/liftActions";

export default function Page() {

    const { data: lifts, isLoading, isError, isIdle } = useQuery("lifts", async () => {
        const data = await getLifts();
        return data;
    });

    if (isLoading || isIdle) return <p>Loading...</p>;
    if (isError) return <p>Error loading lifts.</p>;

    return (
        <div>
            <h1>All Lifts</h1>
            <ul>
                {lifts.map((lift) => (
                    <li key={lift.id}>
                        {lift.type} - {lift.weight}kg - {new Date(lift.date).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}
