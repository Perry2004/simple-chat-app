import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
export const useLoginState = create(
  devtools(
    persist(
      immer(
        combine(
          {
            loggedEmail: null as string | null,
          },
          (set) => ({
            login: (email: string) => {
              set((state) => {
                state.loggedEmail = email;
              });
            },
            logout: () => {
              set((state) => {
                state.loggedEmail = null;
              });
            },
          }),
        ),
      ),
      {
        name: "login-state-storage",
      },
    ),
    {
      name: "login-state-store",
    },
  ),
);
