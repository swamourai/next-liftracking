"use client";

import React from 'react';
import Link from "next/link";
import { List, SquarePen, ChartArea } from 'lucide-react';
import Breadcrumb from './Breadcrumb';

function Nav() {
    return (
        <nav className="flex gap-5 items-center justify-end h-[50px] border-b-[2px] pr-5 pl-5 border-slate-100">
            <div className="flex-1">
                <Breadcrumb />
            </div>
            <div className="flex-none">
                <Link href="/lift/chart">
                    <ChartArea />
                </Link>
            </div>
            <div className="flex-none">
                <Link href="/lift/all">
                    <List />
                </Link>
            </div>
            <div className="flex-none">
                <Link href="/lift/new">
                    <SquarePen />
                </Link>
            </div>
        </nav>
    );
}

export default Nav;