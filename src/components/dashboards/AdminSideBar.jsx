"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  HomeIcon,
  TableCellsIcon,
  UsersIcon,
  Cog6ToothIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";
import { logout } from "@/Redux/Slice/AdminAuthSlice";

const AdminSidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard Overview", icon: HomeIcon, href: "/dashboard/admindashboard" },
    { name: "Manage Products", icon: TableCellsIcon, href: "/dashboard/ManageProducts" },
    {name:"Edit Product",icon:TableCellsIcon,href:'/dashboard/updateAllProduct'},
    { name: "Manage Advertise", icon: TableCellsIcon, href: "/dashboard/ManageAdvertise" },
    { name: "Manage Users", icon: UsersIcon, href: "/dashboard/ManageUsers" },
    { name: "Settings", icon: Cog6ToothIcon, href: "/admin-dashboard/settings" },
  ];

 const handleLogout = () => {
  if (confirm("Are you sure you want to logout?")) {
    dispatch(logout());
    router.push("/dashboard");
  }
};


  return (
    <div
      className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-lg"
      style={{ overflow: "hidden" }} // prevents scrolling inside sidebar
    >
      {/* LOGO */}
      <div className="p-6 text-2xl font-bold border-b border-gray-700 flex items-center gap-2">
        ⚡ <span>Admin Panel</span>
      </div>

      {/* MENU ITEMS */}
      <nav
        className="flex-1 p-4 space-y-2"
        style={{ overflow: "hidden" }} // prevent scroll for menu items
      >
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center w-full px-4 py-2 rounded-lg transition ease-in-out ${
                isActive
                  ? "bg-gray-700 text-yellow-400 font-semibold"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-red-700 bg-red-600 transition ease-in-out"
        >
          <PowerIcon className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
