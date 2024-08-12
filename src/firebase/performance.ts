import { trace as _trace } from "firebase/performance";
import { firebasePerformance } from ".";

export function trace(name: string) {
  return _trace(firebasePerformance, name);
}

export async function wrapTrace<T>(name: string, callback: Promise<T>) {
  const t = _trace(firebasePerformance, name);
  t.start();
  const r = await new Promise((res) => res(callback));
  t.stop();
  return r;
}
