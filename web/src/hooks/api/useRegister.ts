import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useSignup } from "../stores/useSignup";

export default function useRegister() {
  const nextStep = useSignup((state) => state.nextStep);
  const registrationEmail = useSignup((state) => state.registrationEmail);
  const registrationToken = useSignup((state) => state.registrationToken);
  const verificationCode = useSignup((state) => state.verificationCode);
  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/auth/register", {
        verificationCode: verificationCode,
        email: registrationEmail,
        registrationToken: registrationToken,
      });
      return response.data;
    },
    onSuccess: (data) => {
      nextStep();
      console.log(data);
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
}
