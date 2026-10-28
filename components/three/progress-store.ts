// Penghubung kecil antara potongan 3D (dimuat belakangan) dan preloader (bundel awal),
// supaya preloader tidak perlu mengimpor three.js atau drei.

type ProgressState = { progress: number; done: boolean };

let state: ProgressState = { progress: 0, done: false };
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

export const progressStore = {
  get: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  report: (progress: number) => {
    if (state.done) return;
    state = {
      ...state,
      progress: Math.max(state.progress, Math.min(100, Math.round(progress))),
    };
    emit();
  },
  finish: () => {
    if (state.done) return;
    state = { progress: 100, done: true };
    emit();
  },
};
