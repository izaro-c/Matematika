/**
 * @fileoverview Store global para la gestión del sistema de notificaciones flotantes (Toasts).
 */

import { create } from 'zustand';

/** Tipos de notificaciones soportados por la UI */
export type ToastType = 'success' | 'error' | 'info';

/**
 * Interfaz que representa una única notificación (Toast).
 */
export interface Toast {
  /** Identificador único generado secuencialmente */
  id: string;
  /** Mensaje de texto a mostrar al usuario */
  message: string;
  /** Tipo de notificación que determina los colores en el componente ToastContainer */
  type: ToastType;
}

/**
 * Estado y acciones para la bandeja de notificaciones.
 */
interface ToastState {
  /** Cola activa de notificaciones a mostrar */
  toasts: Toast[];
  /** 
   * Función para disparar una notificación. Desaparece automáticamente a los 4 segundos.
   * @param message - Texto a mostrar.
   * @param type - Clasificación de la notificación (por defecto 'info').
   */
  addToast: (message: string, type?: ToastType) => void;
  /**
   * Elimina manualmente una notificación antes de que expire su tiempo.
   * @param id - Identificador de la notificación a eliminar.
   */
  removeToast: (id: string) => void;
}

let counter = 0;

/**
 * Store global de Zustand para encolar y renderizar notificaciones interactivas
 * que proveen retroalimentación al usuario (ej: guardado con éxito, error de red).
 */
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  
  addToast: (message: string, type: ToastType = 'info') => {
    const id = `toast-${++counter}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    
    // Auto-eliminar después de 4 segundos
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  
  removeToast: (id: string) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
