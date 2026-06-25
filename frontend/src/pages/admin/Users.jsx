import Layout from "../../components/common/Layout";
import { useEffect, useState } from "react";
import API from "../../services/api";
import { Trash2, Phone, Mail, Calendar, Shield, Users as UsersIcon, Search } from "lucide-react";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await API.get("/users?role=user");
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm("Are you sure? This action cannot be undone.")) {
            try {
                await API.delete(`/users/${id}`);
                setUsers(users.filter((user) => user._id !== id));
            } catch {
                alert("Failed to delete user.");
            }
        }
    };

    const filteredUsers = users.filter(u =>
        u.role !== 'admin' &&
        u.role !== 'vendor' &&
        (
            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
                            <UsersIcon className="text-emerald-600" size={28} /> User Management
                        </h1>
                        <p className="text-slate-500 text-sm font-medium mt-1">Control platform access and permissions.</p>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all shadow-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">

                    {/* Desktop Table (Hidden on Mobile) */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-[0.15em]">User Details</th>
                                    <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-[0.15em]">Contact Info</th>
                                    <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-[0.15em]">Role</th>
                                    <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-[0.15em]">Joined</th>
                                    <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-[0.15em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <TableLoadingState />
                                ) : filteredUsers.map((u) => (
                                    <UserRow key={u._id} user={u} onDelete={deleteUser} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile List (Hidden on Desktop) */}
                    <div className="md:hidden divide-y divide-slate-50">
                        {loading ? (
                            <div className="p-10 text-center animate-pulse text-slate-400 font-bold">LOADING DATABASE...</div>
                        ) : filteredUsers.map((u) => (
                            <div key={u._id} className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                                            {u.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800">{u.name}</p>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.role}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteUser(u._id)}
                                        disabled={u.role === 'admin'}
                                        className="p-2 text-rose-400 disabled:opacity-20"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                                        <Mail size={14} /> {u.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                                        <Calendar size={14} /> Joined {new Date(u.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredUsers.length === 0 && !loading && (
                        <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">No matching users found</div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

// Sub-components for cleaner code
function UserRow({ user, onDelete }) {
    return (
        <tr className="hover:bg-slate-50/50 transition-colors">
            <td className="p-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-black">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-slate-800 font-black text-sm">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {user._id.slice(-6)}</p>
                    </div>
                </div>
            </td>
            <td className="p-5">
                <div className="text-sm font-semibold text-slate-600">{user.email}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{user.phone || 'No Phone'}</div>
            </td>
            <td className="p-5">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                    {user.role === 'admin' && <Shield size={10} />}
                    {user.role}
                </span>
            </td>
            <td className="p-5 text-sm font-bold text-slate-500">
                {new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td className="p-5 text-right">
                <button
                    onClick={() => onDelete(user._id)}
                    disabled={user.role === 'admin'}
                    className="p-2 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all disabled:opacity-20"
                >
                    <Trash2 size={18} />
                </button>
            </td>
        </tr>
    );
}

function TableLoadingState() {
    return (
        <tr>
            <td colSpan="5" className="p-20 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Accessing Registry...</p>
                </div>
            </td>
        </tr>
    );
}