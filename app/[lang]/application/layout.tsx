import { AppSidebar } from "@/components/layout/app-sidebar";
import { Navbar } from "@/components/layout/navbar";

interface IProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: IProps) {
  return (
    <div className="space-y-5">
      <Navbar />

      <div className="min-h-screen flex flex-row">
        {/* Sidebar on the left */}
        <aside className="w-12 hidden md:flex flex-col">
          <AppSidebar />
        </aside>

        {/* Main content area (Navbar, page content, footer) */}
        <div className="flex flex-col flex-1">
          <div className="bg-background px-2 sm:px-3 pb-5 flex-grow lg:ms-6">
            <main className="mx-auto mt-3 px-2 pt-0">{children}</main>
          </div>
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
}
