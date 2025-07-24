import { LoginForm } from "@/components/auth/login/LoginCard";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useLoginState } from "../stores/useLoginState";

export default function useLogin() {
  const login = useLoginState((state) => state.login);
  return useMutation({
    mutationFn: async (loginData: LoginForm) => {
      const response = await axiosInstance.post("/auth/login", {
        email: loginData.email,
        password: loginData.password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      const email = data.email;
      const message = data.message;
      login(email);
      console.log("Login successful:", message);
    },
  });
}
