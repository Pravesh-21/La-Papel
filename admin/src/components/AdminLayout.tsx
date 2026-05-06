import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  // If there's no user, clerk middleware should have caught it, but just in case:
  if (!user) {
    redirect("/sign-in");
  }
  // This ignores the environment variable entirely for the pitch
  const adminEmail = "praveshpshrivastava@gmail.com";
  const userEmail = user.emailAddresses[0]?.emailAddress;

  if (userEmail !== adminEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized</h1>
          <p className="text-gray-700 mb-6">
            You do not have permission to view the admin dashboard. Your email ({userEmail}) does not match the registered admin email.
          </p>
          <UserButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold">La Papel</h2>
          <p className="text-sm text-gray-400">Admin Dashboard</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-800 hover:text-white">
            Dashboard
          </Link>
          <Link href="/appointments" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-800 hover:text-white">
            Appointments
          </Link>
          <Link href="/services" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-800 hover:text-white">
            Services
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800 flex items-center gap-4">
          <UserButton />
          <span className="text-sm truncate">{user.firstName || userEmail}</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
