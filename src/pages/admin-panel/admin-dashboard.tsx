import { useCheckServerStorageQuery } from "../../hooks/server-storage/use-server-storage";

const AdminDashboard = () => {
  const { data: storage } = useCheckServerStorageQuery();

  return <div>AdminDashboard</div>;
};

export default AdminDashboard;
