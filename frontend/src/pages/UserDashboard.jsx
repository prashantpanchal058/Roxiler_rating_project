
import { useEffect, useState } from "react";
import api from "../services/api";

const UserDashboard = () => {
    const [stores, setStores] = useState([]);
    const [filters, setFilters] = useState({
        name: "",
        address: ""
    });
    const [ratings, setRatings] = useState({});
    const [message, setMessage] = useState("");

    const loadStores = async () => {
        const res = await api.get("/users/stores", {
            params: filters
        });

        setStores(res.data);
        setRatings(prev => {
            const updated = { ...prev };
            res.data.forEach(store => {
                updated[store.id] = String(store.user_rating || "");
            });
            return updated;
        });
    };

    useEffect(() => {
        loadStores().catch(console.error);
    }, [filters]);

    const submitRating = async (storeId) => {
        const rating = Number(ratings[storeId]);

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            setMessage("Please select a rating between 1 and 5");
            return;
        }

        try {
            await api.post("/ratings", {
                store_id: storeId,
                rating
            });

            setMessage("Rating submitted successfully");
            loadStores();
        } catch (err) {
            setMessage(err.response?.data?.message || "Unable to submit rating");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <h1 className="text-3xl font-bold">Find Stores</h1>
            <p className="text-gray-500 mt-2 mb-8">
                Discover stores and share your ratings
            </p>

            {message && (
                <p className="bg-blue-100 text-blue-700 p-3 rounded-lg mb-5">
                    {message}
                </p>
            )}

            <div className="bg-white rounded-xl shadow p-5 mb-8 grid md:grid-cols-2 gap-4">
                <input
                    placeholder="Search store name"
                    value={filters.name}
                    onChange={e => setFilters({...filters, name: e.target.value})}
                    className="border rounded-lg p-3"
                />

                <input
                    placeholder="Search store address"
                    value={filters.address}
                    onChange={e => setFilters({...filters, address: e.target.value})}
                    className="border rounded-lg p-3"
                />
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {stores.map(store => (
                    <div key={store.id}
                        className="bg-white rounded-xl shadow p-6">

                        <h2 className="text-xl font-bold">{store.name}</h2>

                        <p className="text-gray-500 mt-2">
                            {store.address}
                        </p>

                        <div className="mt-5 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Overall Rating</span>
                                <span className="font-bold text-yellow-600">
                                    ★ {Number(store.overall_rating).toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Your Rating</span>
                                <span className="font-semibold">
                                    {store.user_rating || "Not rated"}
                                </span>
                            </div>
                        </div>

                        <div className="border-t mt-5 pt-5">
                            <label className="block font-medium mb-2">
                                Submit or modify your rating
                            </label>

                            <select
                                value={ratings[store.id] || ""}
                                onChange={e => setRatings({
                                    ...ratings,
                                    [store.id]: e.target.value
                                })}
                                className="w-full border rounded-lg p-3 mb-3"
                            >
                                <option value="">Select rating</option>
                                {[1, 2, 3, 4, 5].map(value => (
                                    <option key={value} value={value}>
                                        {value} Star{value > 1 ? "s" : ""}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={() => submitRating(store.id)}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                            >
                                {store.user_rating ? "Update Rating" : "Submit Rating"}
                            </button>
                        </div>
                    </div>
                ))}

                {stores.length === 0 && (
                    <p className="text-gray-500 col-span-full text-center py-10">
                        No stores found.
                    </p>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
