
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const user = await login(form.email, form.password);

            if (user.role === "ADMIN") navigate("/admin");
            else if (user.role === "OWNER") navigate("/owner");
            else navigate("/user");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit}
                className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

                <h1 className="text-3xl font-bold text-center mb-2">
                    Welcome Back
                </h1>

                <p className="text-gray-500 text-center mb-8">
                    Login to your StoreRate account
                </p>

                {error && (
                    <p className="bg-red-100 text-red-600 p-3 rounded mb-4">
                        {error}
                    </p>
                )}

                <label className="block mb-2 font-medium">Email</label>
                <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="w-full border rounded-lg p-3 mb-5 outline-blue-500"
                    placeholder="Enter your email"
                />

                <label className="block mb-2 font-medium">Password</label>
                <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    className="w-full border rounded-lg p-3 mb-6 outline-blue-500"
                    placeholder="Enter your password"
                />

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                    Login
                </button>

                <p className="text-center mt-6 text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-600 font-semibold">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
