
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.name.length < 8 || form.name.length > 60) {
            return setError("Name must contain 20-60 characters");
        }

        if (form.address.length > 400) {
            return setError("Address cannot exceed 400 characters");
        }

        if (!/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(form.password)) {
            return setError("Password must be 8-16 characters with uppercase and special character");
        }

        try {
            await signup(form);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit}
                className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-lg">

                <h1 className="text-3xl font-bold mb-2 text-center">
                    Create Account
                </h1>

                <p className="text-gray-500 text-center mb-6">
                    Register as a normal user
                </p>

                {error && (
                    <p className="bg-red-100 text-red-600 p-3 rounded mb-4">
                        {error}
                    </p>
                )}

                {[
                    ["name", "Full Name", "text"],
                    ["email", "Email Address", "email"],
                    ["address", "Address", "text"],
                    ["password", "Password", "password"]
                ].map(([key, label, type]) => (
                    <div key={key} className="mb-4">
                        <label className="block mb-2 font-medium">{label}</label>
                        <input
                            type={type}
                            required
                            value={form[key]}
                            maxLength={
                                key === "name" ? 60 :
                                key === "address" ? 400 : undefined
                            }
                            onChange={(e) => setForm({
                                ...form,
                                [key]: e.target.value
                            })}
                            className="w-full border rounded-lg p-3 outline-blue-500"
                        />
                        {key === "name" && (
                            <p className="text-xs text-gray-500 mt-1">
                                Minimum 20, maximum 60 characters
                            </p>
                        )}
                    </div>
                ))}

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                    Register
                </button>

                <p className="text-center mt-5">
                    Already registered?{" "}
                    <Link to="/login" className="text-blue-600 font-semibold">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
