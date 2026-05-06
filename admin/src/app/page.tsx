import AdminLayout from "../components/AdminLayout";

export default function Home() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back. Here is what is happening at La Papel today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Appointments</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">--</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Services</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">--</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Revenue (Est)</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹--</p>
        </div>
      </div>
    </AdminLayout>
  );
}
