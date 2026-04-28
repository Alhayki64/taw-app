import { supabase } from '@/lib/supabaseClient'

export function useDownloadCV() {
  return async () => {
    // Lazy-load heavy PDF libraries only when the user triggers a download
    const [{ pdf }, { buildCVDocument }] = await Promise.all([
      import('@react-pdf/renderer'),
      import('@/components/cv/VolunteerCV'),
    ])

    const { data, error } = await supabase.functions.invoke('generate-cv')
    if (error) throw new Error(error.message || 'Failed to generate CV')

    const verifyBase = import.meta.env.VITE_PUBLIC_VERIFY_URL || `${window.location.origin}/verify`
    const verifyUrl  = `${verifyBase}/${data.verification_token}`

    const doc  = await buildCVDocument({ ...data, verifyUrl, verificationToken: data.verification_token })
    const blob = await pdf(doc).toBlob()

    const url = URL.createObjectURL(blob)
    const a   = document.createElement('a')
    a.href     = url
    a.download = `Tawwa-CV-${(data.profile.display_name || 'volunteer').replace(/\s+/g, '-')}-${Date.now()}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }
}
