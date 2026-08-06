'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, Loader2, UploadCloud } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
];

function safeFileName(name: string) {
  const extension = name.includes('.') ? `.${name.split('.').pop()?.toLowerCase()}` : '';
  const base = name
    .replace(/\.[^.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'fichier';
  return `${base}${extension}`;
}

export function MediaUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function upload() {
    setMessage('');
    if (!file) {
      setStatus('error');
      setMessage('Choisissez d’abord un fichier.');
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      setStatus('error');
      setMessage('Format non autorisé. Utilisez JPG, PNG, WebP, SVG ou PDF.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setStatus('error');
      setMessage('Le fichier dépasse la limite de 10 Mo.');
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setStatus('error');
      setMessage('Supabase n’est pas encore configuré.');
      return;
    }

    setStatus('uploading');
    const now = new Date();
    const path = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
    const { error: uploadError } = await supabase.storage.from('media').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

    if (uploadError) {
      setStatus('error');
      setMessage(uploadError.message);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(path);
    const { data: userData } = await supabase.auth.getUser();
    const { error: rowError } = await supabase.from('media_assets').insert({
      storage_path: path,
      public_url: publicUrlData.publicUrl,
      alt_text: altText.trim() || file.name,
      mime_type: file.type,
      size_bytes: file.size,
      created_by: userData.user?.id || null,
    });

    if (rowError) {
      await supabase.storage.from('media').remove([path]);
      setStatus('error');
      setMessage(rowError.message);
      return;
    }

    setStatus('success');
    setMessage('Le média a été ajouté à la bibliothèque.');
    setFile(null);
    setAltText('');
    if (inputRef.current) inputRef.current.value = '';
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-blue-50 p-3 text-ocean"><ImagePlus className="h-5 w-5" /></span>
        <div><h2 className="text-xl font-black text-ink">Ajouter un média</h2><p className="mt-1 text-sm leading-6 text-slate-500">Images et PDF, jusqu’à 10 Mo.</p></div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <label htmlFor="media-file" className="mb-2 block text-xs font-black uppercase tracking-[0.11em] text-slate-500">Fichier</label>
          <input ref={inputRef} id="media-file" type="file" accept={allowedTypes.join(',')} onChange={(event) => setFile(event.target.files?.[0] || null)} className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label htmlFor="media-alt" className="mb-2 block text-xs font-black uppercase tracking-[0.11em] text-slate-500">Texte alternatif</label>
          <input id="media-alt" value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="Décrivez l’image" className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm focus:border-ocean focus:outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
        <button type="button" onClick={upload} disabled={status === 'uploading'} className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 font-black text-white disabled:opacity-60">
          {status === 'uploading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
          Téléverser
        </button>
      </div>

      {message && <p className={`mt-4 rounded-xl px-4 py-3 text-sm ${status === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}>{message}</p>}
    </div>
  );
}
