import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/lift/all');
  return null;  // Ne jamais rendre de contenu ici car on effectue une redirection.
}