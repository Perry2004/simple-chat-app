import { useMutation } from "@tanstack/react-query";
import { useSignup } from "../stores/useSignup";
import { useShallow } from "zustand/shallow";
import { axiosInstance } from "@/utils/axiosInstance";

export default function useSendVerification() {
  const {
    nextStep,
    registrationToken,
    registrationEmail,
    setResendCooldown,
    step,
  } = useSignup(
    useShallow((state) => ({
      nextStep: state.nextStep,
      registrationToken: state.registrationToken,
      registrationEmail: state.registrationEmail,
      setResendCooldown: state.setResendCooldown,
      step: state.step,
    })),
  );
  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/auth/send-verification", {
        registrationToken: registrationToken,
        email: registrationEmail,
      });
      return response.data;
    },
    onSuccess: () => {
      setResendCooldown();
      if (step === "entered-credentials") {
        nextStep();
      }
    },
  });
}
