import { useRef, useState } from "react"
import { Calendar, Camera, Check, Mail, Pencil, Shield, X } from "lucide-react"

import { Card } from "@/components/ui/card"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import {
  avatarUrl,
  useMe,
  useUpdateProfile,
  useUploadAvatar,
} from "@/features/auth/queries"

const emptyValue = "-"

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <Icon size={18} className="shrink-0 text-accent" />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase text-text-secondary">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm text-text-primary">{value}</p>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const fileRef = useRef(null)
  const toast = useToast()

  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState("")

  const { data: user, isLoading } = useMe()
  const updateProfileMutation = useUpdateProfile()
  const uploadAvatarMutation = useUploadAvatar()

  const saving = updateProfileMutation.isPending
  const uploadingPhoto = uploadAvatarMutation.isPending

  async function saveName() {
    try {
      await updateProfileMutation.mutateAsync({ name: nameInput })
      setEditingName(false)
      toast.success("Profile updated")
    } catch {
      toast.error("Failed to update profile")
    }
  }

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const form = new FormData()
    form.append("file", file)

    try {
      await uploadAvatarMutation.mutateAsync(form)
      toast.success("Avatar uploaded")
    } catch {
      toast.error("Failed to upload avatar")
    } finally {
      event.target.value = ""
    }
  }

  const displayName = user?.name || user?.email?.split("@")[0] || emptyValue
  const userAvatarUrl = avatarUrl(user?.avatar)
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : emptyValue

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <Card variant="glass" className="p-8">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </Card>
        <Card>
          <Card.Body className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </Card.Body>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Card
        variant="glass"
        className="flex flex-col items-center p-8 text-center"
      >
        <div className="relative mb-4">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-accent/10">
            {userAvatarUrl ? (
              <img
                src={userAvatarUrl}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-accent">
                {displayName[0]?.toUpperCase()}
              </span>
            )}
          </div>

          <IconButton
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploadingPhoto}
            variant="primary"
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
            aria-label="Upload avatar"
          >
            {uploadingPhoto ? (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Camera size={14} />
            )}
          </IconButton>

          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        {editingName ? (
          <div className="mt-1 flex w-full max-w-xs items-center gap-2">
            <Input
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              autoFocus
            />
            <IconButton
              type="button"
              onClick={saveName}
              disabled={saving}
              aria-label="Save name"
            >
              <Check size={18} />
            </IconButton>
            <IconButton
              type="button"
              onClick={() => {
                setEditingName(false)
                setNameInput(user?.name || "")
              }}
              aria-label="Cancel"
            >
              <X size={18} />
            </IconButton>
          </div>
        ) : (
          <div className="mt-1 flex items-center gap-2">
            <h2 className="font-display text-xl font-bold text-text-primary">
              {displayName}
            </h2>
            <IconButton
              type="button"
              onClick={() => {
                setEditingName(true)
                setNameInput(user?.name || "")
              }}
              className="h-8 w-8"
              aria-label="Edit name"
            >
              <Pencil size={14} />
            </IconButton>
          </div>
        )}

        <p className="mt-1 text-sm text-text-secondary">
          {user?.email ?? emptyValue}
        </p>
      </Card>

      <Card>
        <Card.Body className="divide-y divide-border-subtle p-0">
          <InfoRow icon={Mail} label="Email" value={user?.email ?? emptyValue} />
          <InfoRow icon={Calendar} label="Member since" value={joinedDate} />
          <InfoRow
            icon={Shield}
            label="Account ID"
            value={user?.id ? `#${user.id}` : emptyValue}
          />
        </Card.Body>
      </Card>
    </div>
  )
}
