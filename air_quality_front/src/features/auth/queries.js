import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { get, httpRoot, post } from "@/lib/http"

export const authKeys = {
  me: ["auth", "me"],
}

export function avatarUrl(filename) {
  if (!filename) return null
  return `${httpRoot.defaults.baseURL}/uploads/${filename}`
}

export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: () => get("/auth/me"),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => post("/auth/update-profile", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me })
    },
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData) =>
      post("/auth/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me })
    },
  })
}

export function useLogin() {
  return useMutation({
    mutationFn: (payload) => post("/auth/login", payload),
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload) => post("/auth/register", payload),
  })
}
