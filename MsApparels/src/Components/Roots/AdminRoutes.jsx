import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../Admin/Dashboard/DashboardLayout';
import Dashboard from '../Admin/Dashboard/Dashboard';
import AddModerator from '../Admin/Moderator/AddModerator';
import ShowModerator from '../Admin/Moderator/ShowModerator';
import AddProducts from '../Admin/Products/AddProducts';
import ShowProducts from '../Admin/Products/ShowProducts';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import { useAuth } from '../../AuthContext';


const AdminRoutes = () => {
  const { userRole } = useAuth();

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/moderator/add"
            element={
              userRole === 'admin' ? <AddModerator /> : <Navigate to="/dashboard" />
            }
          />
          <Route
            path="/moderator/show"
            element={
              userRole === 'admin' ? <ShowModerator /> : <Navigate to="/dashboard" />
            }
          />
          <Route path="/products/add" element={<AddProducts />} />
          <Route path="/products/show" element={<ShowProducts />} />
          {/* Fallback route for unmatched admin paths */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminRoutes;