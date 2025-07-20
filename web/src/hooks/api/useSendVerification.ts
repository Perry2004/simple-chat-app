import { useMutation } from "@tanstack/react-query";
import { useSignup } from "../stores/useSignup";
import { useShallow } from "zustand/shallow";
import { axiosInstance } from "@/utils/axiosInstance";

export default function useSendVerification() {
  const { nextStep, registrationToken, registrationEmail } = useSignup(
    useShallow((state) => ({
      nextStep: state.nextStep,
      registrationToken: state.registrationToken,
      registrationEmail: state.registrationEmail,
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
      nextStep();
    },
  });
}
