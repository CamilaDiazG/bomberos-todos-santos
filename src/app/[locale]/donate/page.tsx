import { DonationFlow } from '@/components/DonationFlow'

interface Props {
  searchParams: Promise<{ itemId?: string; title?: string }>
}

export default async function DonatePage({ searchParams }: Props) {
  const { itemId, title } = await searchParams
  return <DonationFlow itemId={itemId} itemTitle={title} />
}
