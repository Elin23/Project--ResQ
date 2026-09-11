type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeNotificationsChanged(listener: Listener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function emitNotificationsChanged() {
  for (const listener of listeners) {
    try { listener(); } catch { /* UI refresh listeners must not break API actions */ }
  }
}
