import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useLoginState } from "../stores/useLoginState";

export const authenticateQueryOptions = {
  queryKey: ["authenticate"],
  queryFn: async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const response = await axiosInstance.get("/auth/profile");
    if (response.data?.email) {
      useLoginState.getState().login(response.data.email);
    } else {
      useLoginState.getState().logout();
    }
    return response.data;
  },
  staleTime: 15 * 60 * 1000, // 15 minutes
  gcTime: 30 * 60 * 1000, // 30 minutes
  retry: false,
  refetchInterval: 20 * 60 * 1000, // 20 minutes
};

export default function useAuthenticate() {
  return useQuery(authenticateQueryOptions);
}
