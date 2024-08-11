import { generateId } from "@/utils";

export default class User {
  static localStorage = {
    getId: () => {
      let userId = window.localStorage.getItem("userId");
      if (typeof userId === "string") {
        return userId;
      }
      userId = generateId();
      window.localStorage.setItem("userId", userId);
      return userId;
    },
    removeId: () => {
      window.localStorage.removeItem("userId");
    },
  };
}
