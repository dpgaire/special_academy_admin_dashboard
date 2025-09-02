import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Categories from "./pages/Categories";
import Subcategories from "./pages/Subcategories";
import Items from "./pages/Items";
import Profile from "./pages/Profile";
import "./App.css";

// Component to handle authenticated routes
const AuthenticatedApp = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/subcategories" element={<Subcategories />} />
                <Route path="/items" element={<Items />} />
                <Route path="/profile" element={<Profile />} />
                <Route
                  path="/"
                  element={
                    isAuthenticated() ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <AuthenticatedApp />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                theme: {
                  primary: "#4aed88",
                },
              },
              error: {
                duration: 4000,
                theme: {
                  primary: "#ff4b4b",
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
