import { createClient } from '@/lib/supabase/server'
import { DonationFlow, type EquipmentItem } from '@/components/DonationFlow'

interface Props {
  searchParams: Promise<{ itemId?: string }>
}

export default async function DonatePage({ searchParams }: Props) {
  const { itemId } = await searchParams

  let item: EquipmentItem | null = null

  if (itemId) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('equipment_needs')
      .select(
        'id, title_es, estimated_cost_usd, estimated_cost_mxn, current_amount_usd, quantity_needed, quantity_received'
      )
      .eq('id', itemId)
      .single()

    // current_amount_usd exists in the real DB but not in the generated types
    if (data) item = data as unknown as EquipmentItem
  }

  return <DonationFlow item={item} />
}
