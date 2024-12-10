// /lib/iron-session.ts
"use server";

import { cookies } from 'next/headers';
import { getIronSession, SessionOptions } from 'iron-session';
import { SessionData } from '../schemas/session.type';

const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET!,
    cookieName: "liftracking-session",
    cookieOptions: {
      httpOnly: true,
      // Secure only works in `https` environments. So if the environment is `https`, it'll return true.
      secure: process.env.NODE_ENV === "production",
    }
};

export async function getSession() {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    return session;
}