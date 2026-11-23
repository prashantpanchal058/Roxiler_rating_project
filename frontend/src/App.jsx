
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import Users from "./pages/Users";
import Stores from "./pages/Stores";
import UpdatePassword from "./pages/UpdatePassword";

const Layout = () => (
    <>
        <Navbar />
        <Outlet />
    </>
);

const Home = () => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
    if (user.role === "OWNER") return <Navigate to="/owner" replace />;

    return <Navigate to="/user" replace />;
};

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    <Route element={<ProtectedRoute allowedRoles={["ADMIN", "USER", "OWNER"]} />}>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/update-password" element={<UpdatePassword />} />
                        </Route>
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                        <Route element={<Layout />}>
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/users" element={<Users />} />
                            <Route path="/admin/stores" element={<Stores />} />
                        </Route>
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
                        <Route element={<Layout />}>
                            <Route path="/user" element={<UserDashboard />} />
                        </Route>
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["OWNER"]} />}>
                        <Route element={<Layout />}>
                            <Route path="/owner" element={<OwnerDashboard />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
