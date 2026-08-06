import Link from 'next/link';

export default function NotFound() {
  return <section className="bg-cloud px-4 py-28 text-center"><h1 className="text-5xl font-black text-ink">Page introuvable</h1><p className="mt-4 text-slate-600">Le contenu demandé n’existe pas ou n’est pas encore publié.</p><Link href="/" className="mt-8 inline-block rounded-xl bg-ink px-5 py-3 font-black text-white">Retour à l’accueil</Link></section>;
}
