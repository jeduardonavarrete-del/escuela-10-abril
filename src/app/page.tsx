import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import ChatBot from '@/components/shared/ChatBot'
import Hero from '@/components/landing/Hero'
import InfoSection from '@/components/landing/InfoSection'
import Gallery from '@/components/landing/Gallery'
import CalendarioPreview from '@/components/landing/CalendarioPreview'
import AvisosPublicos from '@/components/landing/AvisosPublicos'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

async function getAvisos() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('avisos')
    .select('*')
    .eq('publicado', true)
    .order('created_at', { ascending: false })
    .limit(6)
  return data ?? []
}

async function getEventos() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('eventos_calendario')
    .select('*')
    .gte('fecha_inicio', today)
    .order('fecha_inicio', { ascending: true })
    .limit(10)
  return data ?? []
}

export default async function RootPage() {
  const [avisos, eventos] = await Promise.all([getAvisos(), getEventos()])

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        <Hero />
        <InfoSection />
        <Gallery />
        <CalendarioPreview eventos={eventos} />
        <AvisosPublicos avisos={avisos} />
      </main>
      <Footer />
      <ChatBot />
    </>
  )
}
