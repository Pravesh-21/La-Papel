"use client";

import { useEffect, useMemo, useState } from "react";

type Service = {
  id: number;
  title: string;
  icon: string;
  description: string;
  price: string;
};

type Appointment = {
  id: number;
  clientName: string;
  email: string;
  date: string;
  time: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  service: Service;
};

const statusStyles: Record<string, string> = {
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-slate-100 text-slate-700",
  CANCELLED: "bg-rose-100 text-rose-700",
  PENDING: "bg-amber-100 text-amber-700",
};

const parsePrice = (price: string) => {
  const cleaned = price.replace(/[^0-9.-]/g, "");
  const value = parseFloat(cleaned);
  return Number.isFinite(value) ? value : 0;
};

const formatDate = (value: string) => {
  const parsed = new Date(value);
  return isNaN(parsed.getTime())
    ? value
    : new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(parsed);
};

const formatStatus = (status: string) => {
  const label = status.toUpperCase();
  return label === "CONFIRMED" ? "Confirmed" : label.charAt(0) + label.slice(1).toLowerCase();
};

const buildAppointmentDate = (date: string, time: string) => {
  const normalizedTime = time?.trim() || "00:00";
  const timeSegment = normalizedTime.split(":");
  const normalizedSegment =
    timeSegment.length === 3 ? normalizedTime : `${normalizedTime}:00`;
  const iso = `${date}T${normalizedSegment}`;
  const parsed = new Date(iso);
  return isNaN(parsed.getTime()) ? new Date(date) : parsed;
};

export default function AppointmentDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/appointments", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Failed to load appointments (${response.status})`);
      }

      const data = await response.json();
      setAppointments(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    const timer = window.setInterval(fetchAppointments, 20000);
    return () => window.clearInterval(timer);
  }, []);

  const summary = useMemo(() => {
    const totals = {
      total: appointments.length,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
      upcoming: 0,
      revenue: 0,
      popularService: "—",
    };

    const serviceCount: Record<string, number> = {};

    const now = new Date();
    appointments.forEach((appointment) => {
      const status = appointment.status?.toUpperCase() || "CONFIRMED";
      totals[status.toLowerCase() as keyof typeof totals] =
        (totals[status.toLowerCase() as keyof typeof totals] as number) + 1;

      const price = parsePrice(appointment.service?.price ?? "0");
      if (status === "CONFIRMED") {
        totals.revenue += price;
      }

      const serviceTitle = appointment.service?.title || "Unknown service";
      serviceCount[serviceTitle] = (serviceCount[serviceTitle] || 0) + 1;

      const appointmentDate = buildAppointmentDate(appointment.date, appointment.time);
      if (appointmentDate >= now) {
        totals.upcoming += 1;
      }
    });

    if (Object.keys(serviceCount).length) {
      totals.popularService = Object.entries(serviceCount).sort((a, b) => b[1] - a[1])[0][0];
    }

    return totals;
  }, [appointments]);

  const statusMap = useMemo(() => {
    const map: Record<string, number> = { CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0 };
    appointments.forEach((appointment) => {
      const status = appointment.status?.toUpperCase() || "CONFIRMED";
      map[status] = (map[status] || 0) + 1;
    });
    return map;
  }, [appointments]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 uppercase tracking-[0.2em]">Total appointments</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{summary.total}</p>
          <p className="mt-2 text-sm text-gray-500">All records currently tracked.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 uppercase tracking-[0.2em]">Upcoming</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{summary.upcoming}</p>
          <p className="mt-2 text-sm text-gray-500">Appointments scheduled today and later.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 uppercase tracking-[0.2em]">Estimated revenue</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">₹{summary.revenue.toLocaleString()}</p>
          <p className="mt-2 text-sm text-gray-500">Confirmed bookings only.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 uppercase tracking-[0.2em]">Top service</p>
          <p className="mt-4 text-2xl font-semibold text-slate-900">{summary.popularService}</p>
          <p className="mt-2 text-sm text-gray-500">Most booked service this week.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(statusMap).map(([status, count]) => (
          <div key={status} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-500">{formatStatus(status)}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{count}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Appointment queue</h2>
            <p className="mt-1 text-sm text-gray-500">Live appointment list with refresh and status details.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              {lastUpdated ? `Last updated ${new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric", second: "numeric" }).format(lastUpdated)}` : "Loading data..."}
            </div>
            <button
              type="button"
              onClick={fetchAppointments}
              className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-[0.18em] text-xs">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-500">
                    Loading appointments...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-500">
                    No appointments found yet.
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 text-sm text-slate-900">
                      <div className="font-medium">{appointment.clientName}</div>
                      <div className="text-xs text-gray-500">Booked {formatDate(appointment.createdAt)}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-900">
                      <div className="font-medium">{appointment.service?.title || "Service removed"}</div>
                      <div className="text-xs text-gray-500">₹{parsePrice(appointment.service?.price || "0").toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-900">{formatDate(appointment.date)}</td>
                    <td className="px-4 py-4 text-sm text-slate-900">{appointment.time}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[appointment.status?.toUpperCase() ?? "CONFIRMED"] ?? statusStyles.PENDING}`}>
                        {formatStatus(appointment.status || "CONFIRMED")}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 truncate max-w-[220px]">{appointment.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
