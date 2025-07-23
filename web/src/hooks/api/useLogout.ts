import { useMutation } from "@tanstack/react-query";
import { useLoginState } from "../stores/useLoginState";
import { axiosInstance } from "@/utils/axiosInstance";

export default function useLogout() {
  const logout = useLoginState((state) => state.logout);
  return useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/auth/logout");
    },
    onSuccess: () => {
      logout();
    },
  });
}
