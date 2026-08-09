export default function Avatar({ initials = 'DG', size = 'md' }) {
  const sizes = { sm: 'h-8 w-8 text-[.68rem]', md: 'h-11 w-11 text-sm', lg: 'h-16 w-16 text-lg' };
  return <span className={`inline-flex items-center justify-center rounded-full bg-ink font-semibold text-paper ${sizes[size] || sizes.md}`}>{initials}</span>;
}
