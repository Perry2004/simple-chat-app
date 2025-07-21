import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type SignupStep =
  | "initial"
  | "entered-credentials"
  | "verification-sent"
  | "verified";

interface SignupState {
  step: SignupStep;
  registrationToken: string | null;
  registrationEmail: string | null;
  verificationCode: string | null;
  resendCooldownExpiry: number | null;
  nextStep: () => void;
  reset: () => void;
  setRegistrationToken: (token: string) => void;
  setRegistrationEmail: (email: string) => void;
  setVerificationCode: (code: string) => void;
  setResendCooldown: () => void;
}

export const useSignup = create<SignupState>()(
  devtools(
    immer(
      combine(
        {
          step: "initial" as SignupStep,
          registrationToken: null as string | null,
          registrationEmail: null as string | null,
          verificationCode: null as string | null,
          resendCooldownExpiry: null as number | null,
        },
        (set) => ({
          nextStep: () => {
            set((state) => {
              if (state.step === "initial") {
                state.step = "entered-credentials";
              } else if (state.step === "entered-credentials") {
                state.step = "verification-sent";
              } else if (state.step === "verification-sent") {
                state.step = "verified";
              }
            });
          },
          reset: () => {
            set((state) => {
              state.step = "initial";
              state.registrationToken = null;
              state.registrationEmail = null;
              state.verificationCode = null;
              state.resendCooldownExpiry = null;
            });
          },
          setRegistrationToken: (token: string) => {
            set((state) => {
              state.registrationToken = token;
            });
          },
          setRegistrationEmail: (email: string) => {
            set((state) => {
              state.registrationEmail = email;
            });
          },
          setVerificationCode: (code: string) => {
            set((state) => {
              state.verificationCode = code;
            });
          },
          setResendCooldown: () => {
            set((state) => {
              state.resendCooldownExpiry = Date.now() + 60000; // 1 minute from now
            });
          },
        }),
      ),
    ),
    { name: "signup-store" },
  ),
);
