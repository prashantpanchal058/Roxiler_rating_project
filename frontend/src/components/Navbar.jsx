
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">
                StoreRate
            </Link>

            <div className="flex items-center gap-6">
                {user && (
                    <>
                        <span className="text-sm text-slate-300">
                            {user.name}
                        </span>

                        <button
                            onClick={() => navigate("/update-password")}
                            className="hover:text-blue-300"
                        >
                            Change Password
                        </button>

                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
