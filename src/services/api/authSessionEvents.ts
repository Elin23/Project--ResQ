type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeSessionInvalidated(listener: Listener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function emitSessionInvalidated() {
  for (const listener of listeners) {
    try { listener(); } catch { /* session cleanup listeners must not break API flow */ }
  }
}
