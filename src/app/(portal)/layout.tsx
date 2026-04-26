import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import ChatBot from '@/components/shared/ChatBot'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-gray-50">{children}</main>
      <Footer />
      <ChatBot />
    </>
  )
}
