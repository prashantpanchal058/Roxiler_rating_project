
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const UpdatePassword = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(form.newPassword)) {
            setError("Password must be 8-16 characters with uppercase and special character");
            return;
        }

        try {
            const res = await api.put("/auth/update-password", form);
            setMessage(res.data.message);
            setForm({ currentPassword: "", newPassword: "" });
        } catch (err) {
            setError(err.response?.data?.message || "Unable to update password");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

                <h1 className="text-2xl font-bold mb-6">
                    Update Password
                </h1>

                {message && (
                    <p className="bg-green-100 text-green-700 p-3 rounded mb-4">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </p>
                )}

                <label className="block font-medium mb-2">
                    Current Password
                </label>

                <input
                    type="password"
                    required
                    value={form.currentPassword}
                    onChange={e => setForm({...form, currentPassword: e.target.value})}
                    className="w-full border rounded-lg p-3 mb-5"
                />

                <label className="block font-medium mb-2">
                    New Password
                </label>

                <input
                    type="password"
                    required
                    value={form.newPassword}
                    onChange={e => setForm({...form, newPassword: e.target.value})}
                    className="w-full border rounded-lg p-3 mb-6"
                />

                <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
                    Update Password
                </button>

                <button type="button"
                    onClick={() => navigate(-1)}
                    className="w-full mt-3 border p-3 rounded-lg">
                    Go Back
                </button>
            </form>
        </div>
    );
};

export default UpdatePassword;
