
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total_users: 0,
        total_stores: 0,
        total_ratings: 0
    });

    useEffect(() => {
        api.get("/admin/dashboard")
            .then(res => setStats(res.data))
            .catch(console.error);
    }, []);

    const cards = [
        { title: "Total Users", value: stats.total_users, color: "bg-blue-600" },
        { title: "Total Stores", value: stats.total_stores, color: "bg-purple-600" },
        { title: "Total Ratings", value: stats.total_ratings, color: "bg-green-600" }
    ];

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-500 mb-8">Platform overview</p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
                {cards.map(card => (
                    <div key={card.title}
                        className={`${card.color} text-white p-7 rounded-xl shadow`}>
                        <p className="text-lg">{card.title}</p>
                        <h2 className="text-4xl font-bold mt-3">
                            {card.value}
                        </h2>
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Link to="/admin/users"
                    className="bg-white p-8 rounded-xl shadow hover:shadow-lg">
                    <h2 className="text-xl font-bold">Manage Users</h2>
                    <p className="text-gray-500 mt-2">View and add users and admins</p>
                </Link>

                <Link to="/admin/stores"
                    className="bg-white p-8 rounded-xl shadow hover:shadow-lg">
                    <h2 className="text-xl font-bold">Manage Stores</h2>
                    <p className="text-gray-500 mt-2">View and add stores</p>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
