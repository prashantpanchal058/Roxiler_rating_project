
import { useEffect, useState } from "react";
import api from "../services/api";
import DataTable from "../components/DataTable";

const OwnerDashboard = () => {
    const [data, setData] = useState({
        stores: [],
        submittedRatings: []
    });

    useEffect(() => {
        api.get("/users/owner/dashboard")
            .then(res => setData(res.data))
            .catch(console.error);
    }, []);

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <h1 className="text-3xl font-bold">Store Owner Dashboard</h1>
            <p className="text-gray-500 mt-2 mb-8">
                Overview of your store ratings
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
                {data.stores.map(store => (
                    <div key={store.store_id}
                        className="bg-white rounded-xl shadow p-7">
                        <h2 className="text-xl font-bold">
                            {store.store_name}
                        </h2>

                        <div className="mt-5 grid grid-cols-2 gap-4">
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <p className="text-gray-500">Average Rating</p>
                                <p className="text-3xl font-bold text-yellow-600">
                                    ★ {Number(store.average_rating).toFixed(2)}
                                </p>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-gray-500">Total Ratings</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    {store.total_ratings}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-bold mb-5">
                Users Who Submitted Ratings
            </h2>

            <DataTable
                columns={[
                    { key: "name", label: "User Name" },
                    { key: "email", label: "Email" },
                    { key: "rating", label: "Rating" },
                    {
                        key: "updated_at",
                        label: "Last Updated",
                        render: row => new Date(row.updated_at).toLocaleString()
                    }
                ]}
                data={data.submittedRatings}
            />
        </div>
    );
};

export default OwnerDashboard;
