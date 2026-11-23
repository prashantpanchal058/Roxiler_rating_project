
import { useEffect, useState } from "react";
import api from "../services/api";
import DataTable from "../components/DataTable";

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [filters, setFilters] = useState({
        name: "",
        email: "",
        address: ""
    });

    const [sortBy, setSortBy] = useState("name");
    const [order, setOrder] = useState("ASC");
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        owner_id: ""
    });

    const role = JSON.parse(localStorage.getItem("user") || "null")?.role;

    const loadStores = async () => {
        const res = await api.get("/stores", {
            params: { ...filters, sortBy, order }
        });
        setStores(res.data);
    };

    useEffect(() => {
        loadStores().catch(console.error);
    }, [filters, sortBy, order]);

    const createStore = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            await api.post("/stores", {
                ...form,
                owner_id: form.owner_id ? Number(form.owner_id) : null
            });

            setMessage("Store created successfully");
            setForm({ name: "", email: "", address: "", owner_id: "" });
            setShowForm(false);
            loadStores();
        } catch (err) {
            setMessage(err.response?.data?.message || "Unable to create store");
        }
    };

    const columns = [
        { key: "name", label: "Store Name" },
        { key: "email", label: "Email" },
        { key: "address", label: "Address" },
        {
            key: "overall_rating",
            label: "Overall Rating",
            render: row => Number(row.overall_rating).toFixed(2)
        }
    ];

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <div className="flex flex-wrap justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        {role === "ADMIN" ? "Manage Stores" : "Stores"}
                    </h1>
                    <p className="text-gray-500 mt-1">Browse registered stores</p>
                </div>

                {role === "ADMIN" && (
                    <button onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 text-white px-5 py-3 rounded-lg">
                        Add Store
                    </button>
                )}
            </div>

            {message && <p className="mb-4 text-blue-700">{message}</p>}

            {showForm && role === "ADMIN" && (
                <form onSubmit={createStore}
                    className="bg-white p-6 rounded-xl shadow mb-8 grid md:grid-cols-2 gap-4">

                    <input required placeholder="Store Name"
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        className="border rounded-lg p-3" />

                    <input required type="email" placeholder="Store Email"
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                        className="border rounded-lg p-3" />

                    <input required maxLength="400" placeholder="Store Address"
                        value={form.address}
                        onChange={e => setForm({...form, address: e.target.value})}
                        className="border rounded-lg p-3" />

                    <input type="number" min="1" placeholder="Owner User ID (optional)"
                        value={form.owner_id}
                        onChange={e => setForm({...form, owner_id: e.target.value})}
                        className="border rounded-lg p-3" />

                    <button className="bg-green-600 text-white rounded-lg p-3">
                        Create Store
                    </button>
                </form>
            )}

            <div className="bg-white p-5 rounded-xl shadow mb-6">
                <div className="grid md:grid-cols-3 gap-4">
                    {["name", "email", "address"].map(key => (
                        <input key={key}
                            placeholder={`Search by ${key}`}
                            value={filters[key]}
                            onChange={e => setFilters({...filters, [key]: e.target.value})}
                            className="border rounded-lg p-3" />
                    ))}
                </div>

                <div className="flex gap-3 mt-4">
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                        className="border rounded-lg p-3">
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        <option value="address">Address</option>
                    </select>

                    <select value={order} onChange={e => setOrder(e.target.value)}
                        className="border rounded-lg p-3">
                        <option value="ASC">Ascending</option>
                        <option value="DESC">Descending</option>
                    </select>
                </div>
            </div>

            <DataTable columns={columns} data={stores} />
        </div>
    );
};

export default Stores;
