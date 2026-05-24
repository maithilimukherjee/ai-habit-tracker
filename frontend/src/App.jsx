import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./styles/globals.css"
import AISuggestions from "./pages/AISuggestions";
import RecoveryPlan from "./pages/RecoveryPlan";

import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {

  return (
    <Routes>

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/ai/suggestions" element={<ProtectedRoute><AISuggestions /></ProtectedRoute>} />
      <Route path="/ai/recovery" element={<ProtectedRoute><RecoveryPlan /></ProtectedRoute>} />

    </Routes>
  );
}

export default App;