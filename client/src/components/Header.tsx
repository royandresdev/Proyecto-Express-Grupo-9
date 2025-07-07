import { formateadDate } from "@/lib/utils";
import InitialsAvatar from "./InitialsAvatar";
import { useAuthStore } from "@/store/auth.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return (
    <header className="px-4 pt-2 pb-4 flex justify-between border-b border-var(--border) items-center">
      <h1 className="text-[#6b6fd4] font-bold text-xl">ConverSAFe</h1>
      <div className="flex items-center gap-4">
        <p>
          Equipo Alpha - <span>{formateadDate()}</span>
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <InitialsAvatar
              name={user?.username}
              size={32}
              className="rounded-md"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-white shadow-lg rounded-md border border-border mt-2">
            <div className="p-2">
              <p className="text-sm font-semibold">{user?.username}</p>
            </div>
            <hr className="my-1" />
            <button
              onClick={() => {
                logout()
                navigate('/login');
              }}
              className="w-full text-left px-2 py-2 hover:bg-gray-100 flex gap-2 items-center">
              <LogOut size={16} /> Cerrar sesión
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
export default Header;
