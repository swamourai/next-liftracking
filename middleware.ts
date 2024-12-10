import { NextResponse } from 'next/server';
import { getSession } from './src/lib/iron-session';

export async function middleware(req: Request) {
  const url = new URL(req.url); // Créez un objet URL pour extraire le chemin
  const path = url.pathname; // Récupérez le chemin (exemple : "/user")

  const session = await getSession();

  const protectedRoutes = ['/user', '/settings']; // Liste des routes protégées
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));

  if (isProtectedRoute && (!session || !session.isLoggedIn)) {
    const loginUrl = new URL('/auth/login', req.url);
    return NextResponse.redirect(loginUrl); // Redirigez l'utilisateur non authentifié
  }

  return NextResponse.next(); // Laissez passer la requête
}

// Configuration des routes pour lesquelles le middleware s'applique
export const config = {
  matcher: ['/user/:path*', '/settings/:path*'], // Routes protégées
};
