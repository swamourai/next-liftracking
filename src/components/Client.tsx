'use client';

import { QueryClientProvider } from "react-query";
import queryClient from "../lib/react-query";
import { Oswald } from 'next/font/google';
import Nav from "@/src/components/Nav";
import { PageProvider } from "../contexts/breadcrumbContext";
import { DeleteLiftContextProvider } from "../contexts/deleteLiftContext";
import DialogDeleteLift from "./DialogDeleteLift";
import { Toaster } from "@/components/ui/toaster";

const oswald = Oswald({
    weight: ['400', '700'],
    style: ['normal'],
    subsets: ['latin'],
    display: 'swap',
});

export default function Client({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <QueryClientProvider client={queryClient}>
            <PageProvider>
                <DeleteLiftContextProvider>
                    <h1 className={`text-gray-300 tracking-widest uppercase absolute text-5xl top-[10px] text-center w-full font-bold sm:text-8xl sm:top-0 ${oswald.className}`}>Liftracking</h1>
                    <section className="max-w-[850px] w-full bg-white z-1 relative m-auto top-[70px] rounded min-h-[400px] mb-40">
                        <Nav />
                        <div>
                            {children}
                        </div>
                    </section>
                    <Toaster />
                    <DialogDeleteLift />
                </DeleteLiftContextProvider>
            </PageProvider>
        </QueryClientProvider>
    );
}