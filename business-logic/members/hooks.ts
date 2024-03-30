import { useQuery } from "@tanstack/react-query";
import { getMembers } from "./actions";

export function useGetMembers() {
  return useQuery({
    queryFn: async () => getMembers(),
    queryKey: ["members"],
  })
}