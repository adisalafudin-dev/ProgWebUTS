import { ROLES } from "../../constants/roles.js";
import EmptyState from "../../components/EmptyState";

const mockUsers = [
  {
    id: 1,
    name: "Admin AksaraHub",
    email: "admin@aksarahub.local",
    role: ROLES.ADMIN,
    status: "Aktif",
  },
  {
    id: 2,
    name: "Demo Reader",
    email: "demo@aksarahub.local",
    role: ROLES.USER,
    status: "Aktif",
  },
  {
    id: 3,
    name: "Budi Santoso",
    email: "budi@example.com",
    role: ROLES.USER,
    status: "Aktif",
  },
  {
    id: 4,
    name: "Siti Rahma",
    email: "siti@example.com",
    role: ROLES.USER,
    status: "Nonaktif",
  },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-playfair text-2xl font-bold text-slate-900">
          Daftar Pengguna
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Pantau akun pengguna dan peran akses mereka.
        </p>
      </div>

      {mockUsers.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Nama</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4 font-semibold text-slate-900">{user.name}</td>
                    <td className="px-5 py-4 text-slate-600">{user.email}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.role === ROLES.ADMIN
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.status === "Aktif"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon="users"
          title="Tidak ada pengguna"
          description="Belum ada pengguna yang terdaftar dalam sistem."
        />
      )}
    </div>
  );
}
