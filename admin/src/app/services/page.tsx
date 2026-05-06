import AdminLayout from "../../components/AdminLayout";

export default function ServicesPage() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Service Library</h1>
        <p className="text-gray-600 mt-2">
          Keep service definitions and pricing in one place. This page is under construction, but appointment monitoring is ready.
        </p>
      </div>

      <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-gray-700">
          The service management view is coming soon. For now, use the appointments monitor to review all active bookings.
        </p>
      </div>
    </AdminLayout>
  );
}
