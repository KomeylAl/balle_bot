import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useSetAccountId() {
   return useMutation({
    mutationFn: async (accountId: any) => {
      const res = await fetch("/api/account/set", {
        method: "POST",
        body: JSON.stringify(accountId),
      });
      if (!res.ok) {
        const data = await res.json();
        console.log(data)
        throw new Error("مشکلی در دریافت اطلاعات پیش آمده!");
      }
    },
    onError(error) {
      toast.error(error.message);
      console.log(error);
    },
  });
 }

 export function useFund() {
  return useQuery({
    queryKey: ["fund"],
    queryFn: async () => {
      const res = await fetch("/api/account");
      return res.json();
    },
  });
}