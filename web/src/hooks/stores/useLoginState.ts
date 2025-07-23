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
            tokenExpiresAt: null as number | null,
          },
          (set) => ({
            login: (email: string, tokenExpiresAt: number) => {
              set((state) => {
                state.loggedEmail = email;
                state.tokenExpiresAt = tokenExpiresAt;
              });
            },
            logout: () => {
              set((state) => {
                state.loggedEmail = null;
                state.tokenExpiresAt = null;
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
