
import { useEffect, useState } from "react";
import api from "../services/api";
import DataTable from "../components/DataTable";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({
        name: "",
        email: "",
        address: "",
        role: ""
    });

    const [sortBy, setSortBy] = useState("name");
    const [order, setOrder] = useState("ASC");
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "USER"
    });

    const [message, setMessage] = useState("");

    const loadUsers = async () => {
        const res = await api.get("/admin/users", {
            params: { ...filters, sortBy, order }
        });
        setUsers(res.data);
    };

    useEffect(() => {
        loadUsers().catch(console.error);
    }, [filters, sortBy, order]);

    const createUser = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            await api.post("/admin/users", form);
            setMessage("User created successfully");
            setForm({
                name: "",
                email: "",
                address: "",
                password: "",
                role: "USER"
            });
            setShowForm(false);
            loadUsers();
        } catch (err) {
            setMessage(err.response?.data?.message || "Unable to create user");
        }
    };

    const columns = [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "address", label: "Address" },
        { key: "role", label: "Role" },
        {
            key: "action",
            label: "Details",
            render: row => (
                <button
                    onClick={async () => {
                        const res = await api.get(`/admin/users/${row.id}`);
                        const u = res.data;
                        alert(
                            `Name: ${u.name}\nEmail: ${u.email}\nAddress: ${u.address}\nRole: ${u.role}` +
                            (u.role === "OWNER" ? `\nRating: ${Number(u.rating).toFixed(2)}` : "")
                        );
                    }}
                    className="text-blue-600 hover:underline"
                >
                    View
                </button>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Users</h1>
                    <p className="text-gray-500">Manage platform users</p>
                </div>

                <button onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-5 py-3 rounded-lg">
                    Add User
                </button>
            </div>

            {message && <p className="mb-4 text-blue-700">{message}</p>}

            {showForm && (
                <form onSubmit={createUser}
                    className="bg-white rounded-xl shadow p-6 mb-8 grid md:grid-cols-2 gap-4">

                    <input required minLength="20" maxLength="60"
                        placeholder="Name (20-60 characters)"
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        className="border rounded-lg p-3" />

                    <input required type="email" placeholder="Email"
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                        className="border rounded-lg p-3" />

                    <input required maxLength="400" placeholder="Address"
                        value={form.address}
                        onChange={e => setForm({...form, address: e.target.value})}
                        className="border rounded-lg p-3" />

                    <input required type="password" minLength="8" maxLength="16"
                        placeholder="Password"
                        value={form.password}
                        onChange={e => setForm({...form, password: e.target.value})}
                        className="border rounded-lg p-3" />

                    <select value={form.role}
                        onChange={e => setForm({...form, role: e.target.value})}
                        className="border rounded-lg p-3">
                        <option value="USER">Normal User</option>
                        <option value="ADMIN">Administrator</option>
                        <option value="OWNER">Store Owner</option>
                    </select>

                    <button className="bg-green-600 text-white rounded-lg p-3">
                        Create User
                    </button>
                </form>
            )}

            <div className="bg-white rounded-xl shadow p-5 mb-6 grid md:grid-cols-4 gap-3">
                {["name", "email", "address", "role"].map(key => (
                    <input key={key}
                        placeholder={`Filter by ${key}`}
                        value={filters[key]}
                        onChange={e => setFilters({...filters, [key]: e.target.value})}
                        className="border rounded-lg p-3" />
                ))}

                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="border rounded-lg p-3">
                    <option value="name">Sort by Name</option>
                    <option value="email">Sort by Email</option>
                    <option value="address">Sort by Address</option>
                    <option value="role">Sort by Role</option>
                </select>

                <select value={order} onChange={e => setOrder(e.target.value)}
                    className="border rounded-lg p-3">
                    <option value="ASC">Ascending</option>
                    <option value="DESC">Descending</option>
                </select>
            </div>

            <DataTable columns={columns} data={users} />
        </div>
    );
};

export default Users;
