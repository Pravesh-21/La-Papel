import AdminLayout from "../components/AdminLayout";
import AppointmentDashboard from "../components/AppointmentDashboard";

export default function Home() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back. Here is what is happening at La Papel today.</p>
      </div>

      <AppointmentDashboard />
    </AdminLayout>
  );
}
