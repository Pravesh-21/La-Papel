import AdminLayout from "../../components/AdminLayout";
import AppointmentDashboard from "../../components/AppointmentDashboard";

export default function AppointmentsPage() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Appointments Monitor</h1>
        <p className="text-gray-600 mt-2">
          Review every booking, status, and upcoming service in one place.
        </p>
      </div>

      <AppointmentDashboard />
    </AdminLayout>
  );
}
