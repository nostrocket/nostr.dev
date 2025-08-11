import { notFound } from 'next/navigation'
import { eventKinds } from '@/data/eventKinds'
import { KindPageClient } from './KindPageClient'

interface KindPageProps {
  params: Promise<{
    kind: string
  }>
}

export async function generateStaticParams() {
  // Generate static pages for all known event kinds
  return eventKinds.map((eventKind) => ({
    kind: eventKind.kind.toString(),
  }))
}

export async function generateMetadata({ params }: KindPageProps) {
  const resolvedParams = await params
  const kindNum = parseInt(resolvedParams.kind)
  const eventKind = eventKinds.find(kind => kind.kind === kindNum)
  
  if (!eventKind) {
    return {
      title: 'Event Kind Not Found - Nostr Event Kinds Reference',
      description: 'The requested event kind was not found',
    }
  }

  return {
    title: `Kind ${kindNum}: ${eventKind.name} - Nostr Event Kinds Reference`,
    description: eventKind.description,
  }
}

export default async function KindPage({ params }: KindPageProps) {
  const resolvedParams = await params
  const kindNum = parseInt(resolvedParams.kind)

  // Validate that the kind exists
  const eventKind = eventKinds.find(kind => kind.kind === kindNum)
  if (!eventKind || isNaN(kindNum)) {
    notFound()
  }

  return <KindPageClient kindNum={kindNum} />
}