import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useSignup } from "../stores/useSignup";

export default function usePreregister() {
  const nextStep = useSignup((state) => state.nextStep);
  const setRegistrationToken = useSignup((state) => state.setRegistrationToken);
  return useMutation({
    mutationFn: async (userData: { email: string; password: string }) => {
      const response = await axiosInstance.post("/auth/pre-register", userData);
      return response.data;
    },
    onSuccess: (data) => {
      nextStep();
      setRegistrationToken(data);
    },
  });
}
