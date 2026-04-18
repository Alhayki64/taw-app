import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RevealLayout } from '@/components/RevealLayout'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthProvider'
import { useLanguage } from '@/contexts/LanguageProvider'
import { signUpSchema } from '@/lib/schemas'
import { useToast } from '@/contexts/ToastProvider'

export default function SignUpScreen() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const { t } = useLanguage()
  const toast = useToast()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const countries = [
    { code: '+973', id: 'bh', name: 'Bahrain' },
    { code: '+966', id: 'sa', name: 'Saudi Arabia' },
    { code: '+971', id: 'ae', name: 'UAE' },
    { code: '+965', id: 'kw', name: 'Kuwait' },
    { code: '+968', id: 'om', name: 'Oman' },
    { code: '+974', id: 'qa', name: 'Qatar' },
  ]
  
  const [selectedCountry, setSelectedCountry] = useState(countries[0])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSignUp = async () => {
    setErrors({})

    const result = signUpSchema.safeParse(formData)
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }

    setLoading(true)
    try {
      await signUp(formData.email, formData.password, {
        display_name: formData.name,
        phone: `${selectedCountry.code}${formData.phone}`,
      })
      navigate('/onboarding/gender')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 pt-12 pb-8">
      {/* Header */}
      <RevealLayout className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary-foreground hover:bg-secondary/20 transition-colors"
        >
          <span className="material-icons-round text-primary">arrow_back</span>
        </button>
      </RevealLayout>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <RevealLayout delay={0.1} className="space-y-2 mb-8">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{t('create_account')}</h1>
          <p className="text-muted-foreground font-medium text-[15px] leading-relaxed">
            Join the movement. Set up your volunteer profile below.
          </p>
        </RevealLayout>

        <RevealLayout delay={0.2} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-bold text-foreground px-1 uppercase tracking-wider">{t('full_name')}</label>
            <div className={`flex items-center h-14 bg-card text-card-foreground rounded-xl shadow-sm border overflow-hidden transition-all px-4 focus-within:ring-2 focus-within:ring-primary ${errors.name ? 'border-destructive' : 'border-border'}`}>
              <span className="material-icons-round text-muted-foreground/60 me-3">person</span>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ali Alsayed"
                className="w-full h-full outline-none text-base font-medium text-foreground bg-transparent placeholder:text-muted-foreground/50"
              />
            </div>
            {errors.name && <p className="text-xs text-destructive font-medium px-1">{errors.name[0]}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="signup-email" className="text-xs font-bold text-foreground px-1 uppercase tracking-wider">{t('email')}</label>
            <div className={`flex items-center h-14 bg-card text-card-foreground rounded-xl shadow-sm border overflow-hidden transition-all px-4 focus-within:ring-2 focus-within:ring-primary ${errors.email ? 'border-destructive' : 'border-border'}`}>
              <span className="material-icons-round text-muted-foreground/60 me-3">email</span>
              <input
                id="signup-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ali@example.com"
                className="w-full h-full outline-none text-base font-medium text-foreground bg-transparent placeholder:text-muted-foreground/50"
              />
            </div>
            {errors.email && <p className="text-xs text-destructive font-medium px-1">{errors.email[0]}</p>}
          </div>

          {/* Mobile Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground px-1 uppercase tracking-wider">{t('phone')}</label>
            <div className="flex gap-3">
              <div className="relative">
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  dir="ltr"
                  className="w-[104px] h-14 rounded-xl border border-border bg-card text-card-foreground shadow-sm flex items-center justify-center gap-1.5 hover:border-primary/50 transition-all cursor-pointer group hover:bg-muted/50"
                >
                  <img src={`https://flagcdn.com/w40/${selectedCountry.id}.png`} alt={selectedCountry.name} className="w-[18px] object-contain rounded-[2px]" />
                  <span className="font-semibold text-foreground text-sm tracking-tight">{selectedCountry.code}</span>
                  <span className="material-icons-round text-[16px] text-muted-foreground/50 group-hover:text-primary transition-colors">expand_more</span>
                </div>
                
                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsDropdownOpen(false)} 
                    />
                    <div className="absolute top-16 left-0 w-56 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                      {countries.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => {
                            setSelectedCountry(c)
                            setIsDropdownOpen(false)
                          }}
                          dir="ltr"
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left ${selectedCountry.code === c.code ? 'bg-primary/5' : ''}`}
                        >
                          <img src={`https://flagcdn.com/w40/${c.id}.png`} alt={c.name} className="w-5 object-contain rounded-[2px] shadow-sm" />
                          <span className="font-bold text-sm text-foreground">{c.name}</span>
                          <span className="font-medium text-xs text-muted-foreground ml-auto">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="flex-1 flex items-center h-14 bg-card text-card-foreground rounded-xl shadow-sm border border-border focus-within:ring-2 focus-within:ring-primary overflow-hidden transition-all px-4">
                <span className="material-icons-round text-muted-foreground/60 me-3">phone</span>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="3X XX XX XX" 
                  className="w-full h-full outline-none text-base font-medium text-foreground bg-transparent placeholder:text-muted-foreground/50"
                />
              </div>
            </div>
            {errors.phone && <p className="text-xs text-destructive font-medium px-1">{errors.phone[0]}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="signup-password" className="text-xs font-bold text-foreground px-1 uppercase tracking-wider">{t('password')}</label>
            <div className={`flex items-center h-14 bg-card text-card-foreground rounded-xl shadow-sm border overflow-hidden transition-all px-4 focus-within:ring-2 focus-within:ring-primary ${errors.password ? 'border-destructive' : 'border-border'}`}>
              <span className="material-icons-round text-muted-foreground/60 me-3">lock</span>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="w-full h-full outline-none text-base font-medium text-foreground bg-transparent placeholder:text-muted-foreground/50"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground/60 hover:text-foreground transition-colors ms-2"
              >
                <span className="material-icons-round">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive font-medium px-1">{errors.password[0]}</p>}
          </div>

        </RevealLayout>

        <div className="flex-1"></div>

        {/* Footer */}
        <RevealLayout delay={0.3} className="pt-6">
          <Button 
            className="w-full h-14 text-lg" 
            onClick={handleSignUp}
            disabled={!formData.email || !formData.password || !formData.name || loading}
          >
            {loading ? t('signing_up') : t('sign_up_btn')}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-4 leading-relaxed px-4">
            By continuing, you agree to Tawwa's{' '}
            <span className="text-primary font-semibold underline underline-offset-2">Terms</span> and{' '}
            <span className="text-primary font-semibold underline underline-offset-2">Privacy Policy</span>.
          </p>
        </RevealLayout>
      </div>
    </div>
  )
}
