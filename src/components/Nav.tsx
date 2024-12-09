"use client";

import React from 'react';
import Link from "next/link";
import { List, SquarePen, ChartArea, UserPlus, User, UserRoundX } from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import { useSession } from '../contexts/SessionContext';

function Nav() {
    const { session, isLoading } = useSession();

    return (
        <nav className="flex gap-5 items-center justify-end h-[50px] border-b-[2px] pr-5 pl-5 border-slate-100">
            <div className="flex-1">
                <Breadcrumb />
            </div>
            {!isLoading && <>
                {session.isLoggedIn && <div className="flex-none">
                    <Link href="/auth/logout">
                        <UserRoundX />
                    </Link>
                </div>}
                {!session.isLoggedIn && <>
                    <div className="flex-none">
                        <Link href="/auth/login">
                            <User />
                        </Link>
                    </div>
                    <div className="flex-none">
                        <Link href="/auth/register">
                            <UserPlus />
                        </Link>
                    </div>
                </>}
            </>}
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