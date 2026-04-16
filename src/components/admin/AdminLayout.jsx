import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-500">
      <AdminHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
