import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { RevealLayout } from '@/components/RevealLayout'
import SubPageHeader from '@/components/layout/SubPageHeader'
import { useAuth } from '@/contexts/AuthProvider'
import { supabase } from '@/lib/supabaseClient'

export default function EditProfile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.id) fetchProfile(user.id)
  }, [user])

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('id', userId)
      .single()
    if (data) {
      setDisplayName(data.display_name || user?.user_metadata?.name || '')
      setAvatarUrl(data.avatar_url || '')
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!displayName.trim()) { setError('Name cannot be empty.'); return }
    setSaving(true)
    setError('')

    const { error: err } = await supabase
      .from('profiles')
      .update({ display_name: displayName.trim(), avatar_url: avatarUrl || null })
      .eq('id', user.id)

    if (err) {
      setError(err.message)
    } else {
      setSaved(true)
      setTimeout(() => navigate('/profile'), 1000)
    }
    setSaving(false)
  }

  const handleAvatarClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5 MB.'); return }

    setUploading(true)
    setError('')

    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadErr) {
      setError('Upload failed: ' + uploadErr.message)
    } else {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      setAvatarUrl(data.publicUrl)
    }
    setUploading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SubPageHeader title="Edit Profile" />
        <div className="px-6 pt-8 space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SubPageHeader title="Edit Profile" />

      <div className="flex-1 px-6 pt-8 flex flex-col gap-6">

        {/* Avatar Upload */}
        <RevealLayout className="flex flex-col items-center gap-3 py-4">
          <div className="relative">
            <button
              onClick={handleAvatarClick}
              disabled={uploading}
              className="relative w-28 h-28 rounded-full bg-primary/10 border-4 border-primary/30 shadow-xl overflow-hidden flex items-center justify-center group transition-all hover:border-primary/60"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="material-icons-round text-primary text-5xl">person</span>
              )}
              {/* Camera overlay on hover */}
              {!uploading && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity rounded-full">
                  <span className="material-icons-round text-white text-2xl">photo_camera</span>
                  <span className="text-white text-[9px] font-bold mt-1">CHANGE</span>
                </div>
              )}
              {/* Uploading spinner */}
              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                  <span className="material-icons-round text-white animate-spin text-3xl">sync</span>
                </div>
              )}
            </button>

            {/* Camera badge */}
            <button
              onClick={handleAvatarClick}
              disabled={uploading}
              className="absolute bottom-0.5 end-0.5 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg border-2 border-background hover:scale-110 transition-transform"
            >
              <span className="material-icons-round text-[18px]">photo_camera</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {uploading ? 'Uploading...' : 'Tap to change photo'}
          </p>
        </RevealLayout>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-xl border border-destructive/20 text-sm font-bold flex items-center gap-2">
            <span className="material-icons-round text-base">error</span>
            {error}
          </div>
        )}

        {/* Display Name */}
        <RevealLayout delay={0.1} className="space-y-1.5">
          <label className="text-xs font-bold text-foreground px-1 uppercase tracking-wider">Display Name</label>
          <div className="flex items-center h-14 bg-card text-card-foreground rounded-2xl shadow-sm border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 overflow-hidden transition-all px-4">
            <span className="material-icons-round text-muted-foreground/60 mr-3">badge</span>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full h-full outline-none text-base font-medium text-foreground bg-transparent placeholder:text-muted-foreground/40"
            />
          </div>
        </RevealLayout>

        {/* Read-only email */}
        <RevealLayout delay={0.2} className="space-y-1.5">
          <label className="text-xs font-bold text-foreground px-1 uppercase tracking-wider">Email</label>
          <div className="flex items-center h-14 bg-muted/50 rounded-2xl border border-border/50 overflow-hidden px-4 opacity-60">
            <span className="material-icons-round text-muted-foreground/60 mr-3">email</span>
            <span className="text-base font-medium text-muted-foreground">{user?.email}</span>
          </div>
        </RevealLayout>

      </div>

      {/* Save CTA */}
      <div className="px-6 pb-10 pt-4">
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className={`w-full h-14 rounded-2xl font-bold text-base transition-all shadow-lift ${
            saved
              ? 'bg-green-500 text-white'
              : saving
              ? 'bg-primary/70 text-primary-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:opacity-90'
          }`}
        >
          {saved ? (
            <span className="flex items-center justify-center gap-2">
              <span className="material-icons-round text-sm">check_circle</span> Saved!
            </span>
          ) : saving ? (
            <span className="flex items-center justify-center gap-2">
              <span className="material-icons-round animate-spin text-sm">sync</span> Saving...
            </span>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  )
}
