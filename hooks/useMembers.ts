import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useMembers() {
   return useQuery({
     queryKey: ["members"],
     queryFn: async () => {
       const res = await fetch(`/api/members`);
       return res.json();
     },
   });
}

export function useAddMember(onMemberAdded: () => void) {
  return useMutation({
    mutationFn: async (assetData: any) => {
      const res = await fetch("/api/members", {
        method: "POST",
        body: JSON.stringify(assetData),
      });
      if (!res.ok) {
        const data = await res.json();
        console.log(data)
        throw new Error("مشکلی در افزودن عضو پیش آمده!");
      }
    },
    onError(error) {
      toast.error(error.message);
      console.log(error);
    },
    onSuccess: () => {
      toast.success("عضو با موفقت افزوده شد");
      onMemberAdded();
    },
  });
}