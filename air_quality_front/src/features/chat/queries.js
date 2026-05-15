import { useMutation } from "@tanstack/react-query"

import { post } from "@/lib/http"

export function useSendChat() {
  return useMutation({
    mutationFn: (message) => post("/chat", { message }),
  })
}
