import { useMutation, useQuery } from "@tanstack/react-query";

export function useUser(userId: string) {
   return useQuery({
     queryKey: ["user"],
     queryFn: async () => {
       const res = await fetch(`/api/auth/user?userId=${userId}`);
       return res.json();
     },
   });
 }