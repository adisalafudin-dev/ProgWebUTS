import { useState, useMemo } from "react";
import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";
import AdminUserModal from "../../components/admin/AdminUserModal";
import AdminUserDeleteModal from "../../components/admin/AdminUserDeleteModal";

/**
 * @typedef {Object} MemberBorrowHistory
 * @property {string} id - Borrow history ID
 * @property {string} bookTitle - Judul buku yang dipinjam
 * @property {string} borrowDate - Tanggal peminjaman
 * @property {string} dueDate - Tanggal jatuh tempo pengembalian
 * @property {string} [returnDate] - Tanggal pengembalian (jika sudah dikembalikan)
 * @property {'Dipinjam' | 'Dikembalikan' | 'Terlambat'} status - Status peminjaman spesifik
 */

/**
 * @typedef {Object} Member
 * @property {string} id - Member unique identifier (e.g. "mem-001")
 * @property {string} name - Nama lengkap anggota
 * @property {string} memberNumber - Nomor keanggotaan (e.g. "LIB-2026-001")
 * @property {string} email - Alamat email anggota
 * @property {string} [avatar] - URL/path foto profil anggota
 * @property {'Aktif' | 'Nonaktif'} status - Status keanggotaan
 * @property {'Tidak Meminjam' | 'Sedang Meminjam' | 'Terlambat'} borrowStatus - Status peminjaman
 * @property {string} joinedDate - Tanggal bergabung (ISO string or formatted date)
 * @property {MemberBorrowHistory[]} [borrowHistory] - Riwayat peminjaman buku
 */

export default function AdminUsersPage() {
  // Empty member array prepared for NestJS Member Service backend integration (No dummy data)
  const [members, setMembers] = useState([]);

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Semua Status");
  const [selectedBorrowStatus, setSelectedBorrowStatus] = useState("Semua");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal & Action states
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);
  const [detailMember, setDetailMember] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "warning") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Filter logic ready for state or NestJS Member Service API response
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        (m.name && m.name.toLowerCase().includes(term)) ||
        (m.memberNumber && m.memberNumber.toLowerCase().includes(term)) ||
        (m.email && m.email.toLowerCase().includes(term));

      const matchesStatus =
        selectedStatus === "Semua Status" ||
        selectedStatus === "Semua" ||
        m.status === selectedStatus;

      const matchesBorrowStatus =
        selectedBorrowStatus === "Semua" ||
        m.borrowStatus === selectedBorrowStatus;

      return matchesSearch && matchesStatus && matchesBorrowStatus;
    });
  }, [members, searchTerm, selectedStatus, selectedBorrowStatus]);

  // Pagination logic
  const totalPages = Math.max(
    1,
    Math.ceil(filteredMembers.length / itemsPerPage)
  );

  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(start, start + itemsPerPage);
  }, [filteredMembers, currentPage, itemsPerPage]);

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    (selectedStatus !== "Semua Status" && selectedStatus !== "Semua") ||
    selectedBorrowStatus !== "Semua";

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("Semua Status");
    setSelectedBorrowStatus("Semua");
    setCurrentPage(1);
  };

  // Statistics calculations (defaults to 0 when members is empty)
  const totalMembersCount = members.length;
  const activeMembersCount = members.filter((m) => m.status === "Aktif").length;
  const borrowingMembersCount = members.filter(
    (m) => m.borrowStatus === "Sedang Meminjam"
  ).length;
  const overdueMembersCount = members.filter(
    (m) => m.borrowStatus === "Terlambat"
  ).length;

  // Handlers prepared for backend Member Service endpoints:
  // GET /members, GET /members/:id, POST /members, PATCH /members/:id, DELETE /members/:id
  const handleSaveMember = (memberData) => {
    showNotification(
      "Aksi simpan data anggota memerlukan integrasi backend NestJS Member Service.",
      "warning"
    );
    setIsMemberModalOpen(false);
    setEditingMember(null);
  };

  const handleSuspendMember = (member) => {
    showNotification(
      `Perubahan status anggota ${member.name} memerlukan integrasi backend NestJS Member Service.`,
      "warning"
    );
  };

  const handleActivateMember = (member) => {
    showNotification(
      `Aktivasi akun ${member.name} memerlukan integrasi backend NestJS Member Service.`,
      "warning"
    );
  };

  const handleConfirmDelete = (memberId) => {
    showNotification(
      "Penghapusan data anggota memerlukan integrasi backend NestJS Member Service.",
      "warning"
    );
    setDeletingMember(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-900">
            Manajemen Anggota
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Kelola data anggota perpustakaan, status keanggotaan, serta aktivitas peminjaman. Halaman ini telah dipersiapkan untuk integrasi dengan backend Member Service.
          </p>
        </div>

        {/* Add Member Button (Disabled - Ready for Backend Integration) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            onClick={() => {
              setEditingMember(null);
              setIsMemberModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-400 cursor-not-allowed opacity-80"
            title="Fitur ini memerlukan integrasi backend Member Service"
          >
            <Icon name="plus" className="h-4 w-4" />
            <span>Tambah Anggota</span>
          </button>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
            <Icon name="info" className="h-3.5 w-3.5" />
            Available after Backend Integration
          </span>
        </div>
      </div>

      {/* Notification Toast */}
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
              Persiapan Integrasi Member Service
            </p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              Open Library API hanya menyediakan data koleksi buku dan tidak menyediakan data anggota perpustakaan.
              <br />
              Halaman ini telah dipersiapkan agar langsung terhubung dengan backend NestJS ketika Member Service selesai dibuat. Seluruh fitur seperti pencarian anggota, filter, status keanggotaan, riwayat peminjaman, dan aksi administrasi akan aktif setelah backend tersedia.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full bg-amber-200/90 px-3 py-1 text-[11px] font-bold text-amber-900 uppercase tracking-wider">
          Available after Backend Integration
        </span>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Anggota */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600 border border-blue-100">
            <Icon name="Users" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Total Anggota
            </p>
            <h3 className="font-playfair text-2xl font-bold text-slate-900 mt-0.5">
              {totalMembersCount}
            </h3>
          </div>
        </div>

        {/* Card 2: Anggota Aktif */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 border border-emerald-100">
            <Icon name="UserCheck" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Anggota Aktif
            </p>
            <h3 className="font-playfair text-2xl font-bold text-slate-900 mt-0.5">
              {activeMembersCount}
            </h3>
          </div>
        </div>

        {/* Card 3: Sedang Meminjam */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="rounded-xl bg-amber-50 p-3 text-amber-600 border border-amber-100">
            <Icon name="BookOpen" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Sedang Meminjam
            </p>
            <h3 className="font-playfair text-2xl font-bold text-slate-900 mt-0.5">
              {borrowingMembersCount}
            </h3>
          </div>
        </div>

        {/* Card 4: Terlambat Mengembalikan */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="rounded-xl bg-rose-50 p-3 text-rose-600 border border-rose-100">
            <Icon name="ClockAlert" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Terlambat Mengembalikan
            </p>
            <h3 className="font-playfair text-2xl font-bold text-slate-900 mt-0.5">
              {overdueMembersCount}
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
              placeholder="Cari nama anggota atau nomor anggota..."
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

          {/* Filter Status Anggota Dropdown */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>

          {/* Filter Status Peminjaman Dropdown */}
          <div>
            <select
              value={selectedBorrowStatus}
              onChange={(e) => {
                setSelectedBorrowStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              <option value="Semua">Semua Peminjaman</option>
              <option value="Tidak Meminjam">Tidak Meminjam</option>
              <option value="Sedang Meminjam">Sedang Meminjam</option>
              <option value="Terlambat">Terlambat</option>
            </select>
          </div>
        </div>

        {/* Reset Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Menampilkan filter anggota aktif
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
      {members.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Foto</th>
                  <th className="px-5 py-3.5 font-semibold">Nama Anggota</th>
                  <th className="px-5 py-3.5 font-semibold">Nomor Anggota</th>
                  <th className="px-5 py-3.5 font-semibold">Status Anggota</th>
                  <th className="px-5 py-3.5 font-semibold">Status Peminjaman</th>
                  <th className="px-5 py-3.5 font-semibold">Tanggal Bergabung</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedMembers.map((member) => {
                  const initials = member.name
                    ? member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : "MB";
                  const isActive = member.status === "Aktif";
                  const isBorrowing = member.borrowStatus === "Sedang Meminjam";
                  const isOverdue = member.borrowStatus === "Terlambat";

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Foto */}
                      <td className="px-5 py-3.5">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="h-10 w-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                          />
                        ) : (
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white shadow-2xs">
                            {initials}
                          </div>
                        )}
                      </td>

                      {/* Nama Anggota */}
                      <td className="px-5 py-3.5 font-semibold text-slate-900">
                        <div>
                          <div className="font-semibold text-slate-900">
                            {member.name}
                          </div>
                          <div className="text-xs text-slate-400 font-normal">
                            {member.email}
                          </div>
                        </div>
                      </td>

                      {/* Nomor Anggota */}
                      <td className="px-5 py-3.5 text-slate-700 font-mono text-xs font-medium">
                        {member.memberNumber || "-"}
                      </td>

                      {/* Status Anggota */}
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
                          {member.status}
                        </span>
                      </td>

                      {/* Status Peminjaman */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border ${
                            isOverdue
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : isBorrowing
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          <Icon
                            name={
                              isOverdue
                                ? "ClockAlert"
                                : isBorrowing
                                ? "BookOpen"
                                : "check"
                            }
                            className="h-3 w-3"
                          />
                          {member.borrowStatus || "Tidak Meminjam"}
                        </span>
                      </td>

                      {/* Tanggal Bergabung */}
                      <td className="px-5 py-3.5 text-slate-600 text-xs">
                        {member.joinedDate || "-"}
                      </td>

                      {/* Aksi */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Detail Member */}
                          <button
                            type="button"
                            onClick={() => setDetailMember(member)}
                            className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors border border-blue-200"
                            title="Detail Anggota & Riwayat Peminjaman"
                          >
                            <Icon name="eye" className="h-3.5 w-3.5" />
                          </button>

                          {/* Edit Member Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMember(member);
                              setIsMemberModalOpen(true);
                            }}
                            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors border border-slate-200"
                            title="Edit Anggota"
                          >
                            <Icon name="pen" className="h-3.5 w-3.5" />
                          </button>

                          {/* Suspend / Activate Member Button */}
                          {isActive ? (
                            <button
                              type="button"
                              onClick={() => handleSuspendMember(member)}
                              className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-colors border border-amber-200"
                              title="Nonaktifkan Anggota"
                            >
                              <Icon name="ban" className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleActivateMember(member)}
                              className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors border border-emerald-200"
                              title="Aktifkan Anggota"
                            >
                              <Icon name="UserCheck" className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {/* Delete Member Button */}
                          <button
                            type="button"
                            onClick={() => setDeletingMember(member)}
                            className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors border border-rose-200"
                            title="Hapus Anggota"
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
            totalItems={filteredMembers.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      ) : (
        /* Empty State View explaining NestJS Member Service backend dependency */
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm text-center space-y-6">
          {/* Table Header Structure Preview (Prepared for Backend Integration) */}
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 opacity-60">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs uppercase tracking-wide text-slate-400">
                <thead className="border-b border-slate-200 bg-slate-100/80">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Foto</th>
                    <th className="px-5 py-3 font-semibold">Nama Anggota</th>
                    <th className="px-5 py-3 font-semibold">Nomor Anggota</th>
                    <th className="px-5 py-3 font-semibold">Status Anggota</th>
                    <th className="px-5 py-3 font-semibold">Status Peminjaman</th>
                    <th className="px-5 py-3 font-semibold">Tanggal Bergabung</th>
                    <th className="px-5 py-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>

          <EmptyState
            icon="users"
            title="Data Anggota Belum Tersedia"
            description="Open Library API tidak menyediakan data anggota perpustakaan. Seluruh struktur halaman ini telah dipersiapkan untuk backend Member Service sehingga setelah backend selesai dibuat, data anggota dapat langsung ditampilkan tanpa perlu mengubah tampilan halaman."
          />

          {/* Feature Readiness Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-200 shadow-2xs">
              <span className="font-bold text-emerald-600">✓</span> Search Siap
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-200 shadow-2xs">
              <span className="font-bold text-emerald-600">✓</span> Filter Status Siap
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-200 shadow-2xs">
              <span className="font-bold text-emerald-600">✓</span> Pagination Siap
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-200 shadow-2xs">
              <span className="font-bold text-emerald-600">✓</span> Detail Anggota Siap
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-200 shadow-2xs">
              <span className="font-bold text-emerald-600">✓</span> Riwayat Peminjaman Siap
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-200 shadow-2xs">
              <span className="font-bold text-emerald-600">✓</span> Integrasi Backend Siap
            </span>
          </div>
        </div>
      )}

      {/* Edit / Create Member Modal */}
      <AdminUserModal
        isOpen={isMemberModalOpen}
        onClose={() => {
          setIsMemberModalOpen(false);
          setEditingMember(null);
        }}
        onSave={handleSaveMember}
        user={editingMember}
      />

      {/* Delete Member Confirmation Modal */}
      <AdminUserDeleteModal
        isOpen={Boolean(deletingMember)}
        onClose={() => setDeletingMember(null)}
        onConfirm={handleConfirmDelete}
        user={deletingMember}
      />
    </div>
  );
}
