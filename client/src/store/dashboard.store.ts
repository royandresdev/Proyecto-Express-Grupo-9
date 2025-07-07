import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
interface DashboardState {
  totalMensajes: number;
  tonosPorcentaje: {
    positivo: number;
    neutro: number;
    tenso: number;
  };
  participacionPorUsuario: Array<{
    user_id: string;
    nombre: string;
    porcentaje: number;
  }>;
  decisionesCantidad: {
    resueltas: number;
    pendientes: number;
  };
  claridadPorUsuario: Array<{
    user_id: number;
    nombre: string;
    claridad: number;
  }>;
  sugerenciaGeneral: string | null;
  setDashboard: (data: Partial<DashboardState>) => void;
}

const initialState: Omit<DashboardState, 'setDashboard'> = {
  totalMensajes: 0,
  tonosPorcentaje: { positivo: 0, neutro: 0, tenso: 0 },
  participacionPorUsuario: [],
  decisionesCantidad: { resueltas: 0, pendientes: 0 },
  claridadPorUsuario: [],
  sugerenciaGeneral: null,
};

export const useDashboardStore = create<DashboardState>()(
  devtools((set) => ({
    ...initialState,
    setDashboard: (data) => set((state) => ({ ...state, ...data }), false, 'setDashboard'),
  }), {
    name: 'dashboard-storage',
  })
);