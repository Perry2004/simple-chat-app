import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useLoginState } from "../stores/useLoginState";

export default function useAuthenticate() {
  const login = useLoginState((state) => state.login);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["authenticate"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/profile");
      console.log("Authentication check response:", response.data);

      if (response.data?.email) {
        login(response.data.email);
      }

      return response.data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: false,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });

  return { data, isLoading, isError };
}
