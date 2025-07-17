import { Outlet } from "@remix-run/react"
import PageTransition from "@/components/PageTransition"
import MainLayout from "@/layouts/MainLayout"
import MobileMainLayout from "@/layouts/MobileMainLayout"

export default function Layout() {
  return (
    <PageTransition>
      <div className="desktop-only">
        <MainLayout>
            <Outlet />
        </MainLayout>
      </div>
      <div className="mobile-only">
        <MobileMainLayout>
            <Outlet />
        </MobileMainLayout>
      </div>
    </PageTransition>
  )
}