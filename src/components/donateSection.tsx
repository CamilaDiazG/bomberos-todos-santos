'use client'

import { Link } from '@/lib/i18n/routing'

export default function DonateSection({ item }: { item: any }) {
  return (
    <Link
      href={`/donate?itemId=${item.id}&title=${encodeURIComponent(item.title_es)}`}
      className="w-full h-14 inline-flex justify-center items-center bg-zinc-900 hover:bg-red-600 text-white font-bold px-4 rounded-xl transition-colors duration-200 shadow-sm"
    >
      Donar para este equipo
    </Link>
  )
}
