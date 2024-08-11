import { APP_VERSION } from "@/globals";
import { logEvent as _logEvent } from "firebase/analytics";
import { firebaseAnalytics } from ".";

export function logEvent(
  eventName: string,
  eventParams?: {
    [key: string]: any;
  }
) {
  _logEvent(firebaseAnalytics, eventName, {
    ...eventParams,
    app_version: APP_VERSION,
  }); // Always include the current app version
}
