import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Mail, Calendar, Shield, Pencil, Camera, Check, X } from "lucide-react";

const API = "http://127.0.0.1:5000";

export default function ProfilePage() {
  const { token } = useAuth();
  const fileRef = useRef(null);

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setUser(data);
          setNameInput(data.name || "");
        }
      })
      .catch(() => setError("Failed to load profile"));
  }, [token]);

  async function saveName() {
    setSaving(true);
    const res = await fetch(`${API}/api/auth/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: nameInput }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.ok) {
      setUser((u) => ({ ...u, name: nameInput }));
      setEditingName(false);
    }
  }

  async function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API}/api/auth/upload-avatar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const data = await res.json();
    setUploadingPhoto(false);
    if (data.avatar) {
      setUser((u) => ({ ...u, avatar: data.avatar }));
    }
  }

  const avatarUrl = user?.avatar ? `${API}/uploads/${user.avatar}` : null;

  const displayName = user?.name || user?.email?.split("@")[0] || "—";

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="p-6 bg-[#F8FAFC] dark:bg-[#0F1117] min-h-screen">
      <div className="max-w-lg mx-auto space-y-6">

        {/* Avatar + name card */}
        <div className="bg-white dark:bg-[#1A1D2E] rounded-2xl shadow-sm border dark:border-gray-800 p-8 flex flex-col items-center text-center">

          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-[#E6E8FF] dark:bg-[#2D3150] flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-[#5B5BD6]">
                  {displayName[0]?.toUpperCase()}
                </span>
              )}
            </div>

            <button
              onClick={() => fileRef.current.click()}
              disabled={uploadingPhoto}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#5B5BD6] text-white flex items-center justify-center shadow-md hover:bg-[#4A4ABF] transition"
            >
              {uploadingPhoto ? (
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera size={14} />
              )}
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          {/* Name */}
          {editingName ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="border dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-[#0F1117] text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5B5BD6]"
                autoFocus
              />
              <button
                onClick={saveName}
                disabled={saving}
                className="text-green-500 hover:text-green-600 transition"
              >
                <Check size={18} />
              </button>
              <button
                onClick={() => { setEditingName(false); setNameInput(user?.name || ""); }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {displayName}
              </h2>
              <button
                onClick={() => setEditingName(true)}
                className="text-gray-400 hover:text-[#5B5BD6] transition"
              >
                <Pencil size={14} />
              </button>
            </div>
          )}

          <p className="text-sm text-gray-400 mt-1">{user?.email ?? "—"}</p>
        </div>

        {/* Info */}
        <div className="bg-white dark:bg-[#1A1D2E] rounded-2xl shadow-sm border dark:border-gray-800 divide-y dark:divide-gray-800">
          <div className="flex items-center gap-4 px-6 py-4">
            <Mail size={18} className="text-[#5B5BD6] flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Email</p>
              <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{user?.email ?? "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-4">
            <Calendar size={18} className="text-[#5B5BD6] flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Member since</p>
              <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{joinedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-4">
            <Shield size={18} className="text-[#5B5BD6] flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Account ID</p>
              <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">#{user?.id ?? "—"}</p>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-center text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}
