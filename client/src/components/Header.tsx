import { formateadDate } from "@/lib/utils"
import InitialsAvatar from "./InitialsAvatar"
import { useAuthStore } from "@/store/auth.store"

function Header() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="px-4 pt-2 pb-4 flex justify-between border-b border-var(--border) items-center">
      <h1 className="text-[#6b6fd4] font-bold text-xl">ConverSAFe</h1>
      <div className="flex items-center gap-4">
        <p>Equipo Alpha - <span>{formateadDate()}</span></p>
        <InitialsAvatar name={user?.username} size={32} className="rounded-md" />
      </div>
    </header>
  )
}
export default Header
