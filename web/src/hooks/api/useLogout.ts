import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoginState } from "../stores/useLoginState";
import { axiosInstance } from "@/utils/axiosInstance";

export default function useLogout() {
  const logout = useLoginState((state) => state.logout);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/auth/logout");
    },
    onSuccess: () => {
      logout();
      queryClient.invalidateQueries({
        queryKey: ["authenticate"],
      });
    },
  });
}
