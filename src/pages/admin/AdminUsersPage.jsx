import { useState, useMemo } from "react";
import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";
import AdminUserModal from "../../components/admin/AdminUserModal";
import AdminUserDeleteModal from "../../components/admin/AdminUserDeleteModal";
import { ROLES } from "../../constants/roles.js";

export default function AdminUsersPage() {
  // Empty user list ready for User Service backend integration (No dummy data)
  const [users, setUsers] = useState([]);

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal & Action states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "warning") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Filter logic ready for state or API response
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term);
      const matchesRole = selectedRole === "Semua" || u.role === selectedRole;
      const matchesStatus =
        selectedStatus === "Semua" || u.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, selectedRole, selectedStatus]);

  // Pagination logic
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / itemsPerPage)
  );

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedRole !== "Semua" ||
    selectedStatus !== "Semua";

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedRole("Semua");
    setSelectedStatus("Semua");
    setCurrentPage(1);
  };

  // Statistics calculation ready for live data
  const totalUsersCount = users.length;
  const activeUsersCount = users.filter((u) => u.status === "Aktif").length;
  const suspendedUsersCount = users.filter(
    (u) => u.status === "Suspended" || u.status === "Nonaktif"
  ).length;
  const adminUsersCount = users.filter((u) => u.role === ROLES.ADMIN).length;

  // Handlers ready for backend User Service connection
  const handleSaveUser = (userData) => {
    showNotification(
      "Aksi simpan pengguna memerlukan integrasi backend User Service.",
      "warning"
    );
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleSuspendUser = (user) => {
    showNotification(
      `Nonaktifkan akun ${user.name} memerlukan integrasi backend User Service.`,
      "warning"
    );
  };

  const handleActivateUser = (user) => {
    showNotification(
      `Aktivasi akun ${user.name} memerlukan integrasi backend User Service.`,
      "warning"
    );
  };

  const handleConfirmDelete = (userId) => {
    showNotification(
      "Penghapusan pengguna memerlukan integrasi backend User Service.",
      "warning"
    );
    setDeletingUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Header Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-900">
            Daftar Pengguna
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Pantau akun pengguna, hak akses peranan, dan status aktivitas akun.
          </p>
        </div>

        {/* Add User Button (Disabled - Ready for Backend Integration) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            onClick={() => {
              setEditingUser(null);
              setIsUserModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-400 cursor-not-allowed opacity-80"
            title="Fitur ini memerlukan integrasi backend User Service"
          >
            <Icon name="plus" className="h-4 w-4" />
            <span>Tambah Pengguna</span>
          </button>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
            <Icon name="info" className="h-3.5 w-3.5" />
            Available after Backend Integration
          </span>
        </div>
      </div>

      {/* Notification Toast/Banner */}
      {notification && (
        <div
          className={`rounded-2xl p-4 text-xs sm:text-sm font-medium border flex items-center justify-between shadow-xs transition-all animate-fadeIn ${
            notification.type === "warning"
              ? "bg-amber-50 text-amber-900 border-amber-200"
              : "bg-blue-50 text-blue-900 border-blue-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg p-1.5 bg-amber-100 text-amber-800">
              <Icon name="info" className="h-4 w-4" />
            </div>
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Backend Integration Readiness Banner */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
            <Icon name="info" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold">
              Persiapan Integrasi User Service Backend
            </p>
            <p className="text-xs text-amber-700">
              Public API Open Library tidak menyediakan data pengguna. Seluruh komponen UI (Search, Filter, Pagination, Avatar, Badge, Modals) telah siap menerima data real-time saat User Service backend dibuat.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full bg-amber-200/90 px-3 py-1 text-[11px] font-bold text-amber-900 uppercase tracking-wider">
          Available after Backend Integration
        </span>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-4">
        {/* Card 1: Total Pengguna */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600 border border-blue-100">
            <Icon name="users" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Total Pengguna
            </p>
            <h3 className="font-playfair text-2xl font-bold text-slate-900 mt-0.5">
              {totalUsersCount}
            </h3>
          </div>
        </div>

        {/* Card 2: User Aktif */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 border border-emerald-100">
            <Icon name="userCheck" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Pengguna Aktif
            </p>
            <h3 className="font-playfair text-2xl font-bold text-slate-900 mt-0.5">
              {activeUsersCount}
            </h3>
          </div>
        </div>

        {/* Card 3: Suspended / Nonaktif */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="rounded-xl bg-rose-50 p-3 text-rose-600 border border-rose-100">
            <Icon name="userX" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Suspended / Nonaktif
            </p>
            <h3 className="font-playfair text-2xl font-bold text-slate-900 mt-0.5">
              {suspendedUsersCount}
            </h3>
          </div>
        </div>

        {/* Card 4: Administrator */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="rounded-xl bg-amber-50 p-3 text-amber-600 border border-amber-100">
            <Icon name="shield" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Administrator
            </p>
            <h3 className="font-playfair text-2xl font-bold text-slate-900 mt-0.5">
              {adminUsersCount}
            </h3>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Icon
              name="search"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari nama atau email..."
              className="w-full rounded-xl border border-slate-200 pl-10 pr-8 py-2 text-xs sm:text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <Icon name="close" className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filter Role Dropdown */}
          <div>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              <option value="Semua">Semua Role</option>
              <option value={ROLES.ADMIN}>ADMIN</option>
              <option value={ROLES.USER}>USER</option>
            </select>
          </div>

          {/* Filter Status Dropdown */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Reset Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Menampilkan filter pengguna aktif
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
            >
              <Icon name="refresh" className="h-3.5 w-3.5" />
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Main Table Structure & Empty State View */}
      {users.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Pengguna</th>
                  <th className="px-5 py-3.5 font-semibold">Email</th>
                  <th className="px-5 py-3.5 font-semibold">Role</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedUsers.map((user) => {
                  const initials = user.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : "U";
                  const isAdmin = user.role === ROLES.ADMIN;
                  const isActive = user.status === "Aktif";

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Avatar & Nama */}
                      <td className="px-5 py-3.5 font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-9 w-9 rounded-full object-cover border border-slate-200 shadow-2xs"
                            />
                          ) : (
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white shadow-2xs">
                              {initials}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-slate-900">
                              {user.name}
                            </div>
                            <div className="text-xs text-slate-400 font-normal sm:hidden">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-3.5 text-slate-600 font-mono text-xs">
                        {user.email}
                      </td>

                      {/* Role Badge */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border ${
                            isAdmin
                              ? "bg-amber-50 text-amber-800 border-amber-200/80"
                              : "bg-slate-100 text-slate-700 border-slate-200/80"
                          }`}
                        >
                          <Icon
                            name={isAdmin ? "shield" : "user"}
                            className="h-3 w-3"
                          />
                          {user.role}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          {user.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Edit User Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingUser(user);
                              setIsUserModalOpen(true);
                            }}
                            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors border border-slate-200"
                            title="Edit Pengguna"
                          >
                            <Icon name="pen" className="h-3.5 w-3.5" />
                          </button>

                          {/* Suspend / Activate User Button */}
                          {isActive ? (
                            <button
                              type="button"
                              onClick={() => handleSuspendUser(user)}
                              className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-colors border border-amber-200"
                              title="Suspend / Nonaktifkan Pengguna"
                            >
                              <Icon name="ban" className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleActivateUser(user)}
                              className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors border border-emerald-200"
                              title="Aktifkan Pengguna"
                            >
                              <Icon name="userCheck" className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {/* Delete User Button */}
                          <button
                            type="button"
                            onClick={() => setDeletingUser(user)}
                            className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors border border-rose-200"
                            title="Hapus Pengguna"
                          >
                            <Icon name="trash" className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Reusable Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      ) : (
        /* Empty State View explaining Backend User Service dependency */
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center space-y-6">
          {/* Table Header Preview Structure (Prepared for Backend Integration) */}
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 opacity-60">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs uppercase tracking-wide text-slate-400">
                <thead className="border-b border-slate-200 bg-slate-100/80">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Avatar & Nama</th>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">Role</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>

          <EmptyState
            icon="users"
            title="Fitur Manajemen Pengguna Akan Tersedia Setelah Backend User Service Selesai Dibuat"
            description="Karena Public API Open Library tidak menyediakan endpoint atau data akun pengguna, fitur ini disiapkan dengan struktur halaman, tabel modern, filter role/status, pagination, avatar, dan aksi akun yang siap terhubung secara langsung saat backend User Service diimplementasikan."
          />

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
              <Icon name="search" className="h-3.5 w-3.5" />
              Pencarian Siap
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
              <Icon name="filter" className="h-3.5 w-3.5" />
              Filter Role & Status Siap
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
              <Icon name="user" className="h-3.5 w-3.5" />
              Avatar & Role Badge Siap
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
              <Icon name="pen" className="h-3.5 w-3.5" />
              Aksi Edit / Suspend / Delete Siap
            </span>
          </div>
        </div>
      )}

      {/* Edit / Create User Modal */}
      <AdminUserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        user={editingUser}
      />

      {/* Delete User Confirmation Modal */}
      <AdminUserDeleteModal
        isOpen={Boolean(deletingUser)}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleConfirmDelete}
        user={deletingUser}
      />
    </div>
  );
}
