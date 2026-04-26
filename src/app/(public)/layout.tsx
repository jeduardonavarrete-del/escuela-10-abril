import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import ChatBot from '@/components/shared/ChatBot'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">{children}</main>
      <Footer />
      <ChatBot />
    </>
  )
}
