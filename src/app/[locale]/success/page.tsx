import { getTranslations } from 'next-intl/server'
import { CheckCircle, ArrowLeft, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@/lib/i18n/routing'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'success' })
  return { title: t('meta_title') }
}

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ title?: string }>
}) {
  const { locale } = await params
  const { title } = await searchParams

  const t = await getTranslations({ locale, namespace: 'success' })

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-10">

        <div className="flex justify-center mb-6">
          <CheckCircle className="size-20 text-red-600" strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl font-extrabold text-zinc-900 mb-3">
          {t('title')}
        </h1>

        <p className="text-gray-600 mb-4 leading-relaxed">
          {t('subtitle')}
        </p>

        {title && (
          <p className="text-sm text-red-700 bg-red-50 rounded-lg px-4 py-2 mb-6 font-medium">
            {t('context', { item: decodeURIComponent(title) })}
          </p>
        )}

        <Heart className="mx-auto size-5 text-red-300 mb-6" fill="currentColor" />

        <Button asChild size="lg" className="w-full bg-zinc-900 hover:bg-red-600 text-white">
          <Link href="/">
            <ArrowLeft className="size-4" />
            {t('cta')}
          </Link>
        </Button>

      </div>
    </div>
  )
}
