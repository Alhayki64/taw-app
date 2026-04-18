import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RevealLayout } from '../components/RevealLayout'
import { Button } from '../components/ui/button'
import { useAuth } from '../contexts/AuthProvider'
import { useLanguage } from '../contexts/LanguageProvider'

export default function SignUpScreen() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const { t } = useLanguage()
  
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  
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
    setLoading(true)
    setErrorMsg('')
    try {
      // Pass the unverified phone number inside user_metadata
      await signUp(formData.email, formData.password, {
        display_name: formData.name,
        phone: `${selectedCountry.code}${formData.phone}`
      })
      navigate('/onboarding/gender')
    } catch (err) {
      setErrorMsg(err.message)
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
          
          {errorMsg && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 text-sm font-bold flex items-center gap-2 mb-2">
              <span className="material-icons-round text-base">error</span>
              {errorMsg}
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground px-1 uppercase tracking-wider">{t('full_name')}</label>
            <div className="flex items-center h-14 bg-card text-card-foreground rounded-xl shadow-sm border border-border focus-within:ring-2 focus-within:ring-primary overflow-hidden transition-all px-4">
              <span className="material-icons-round text-muted-foreground/60 me-3">person</span>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ali Alsayed" 
                className="w-full h-full outline-none text-base font-medium text-foreground bg-transparent placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground px-1 uppercase tracking-wider">{t('email')}</label>
            <div className="flex items-center h-14 bg-card text-card-foreground rounded-xl shadow-sm border border-border focus-within:ring-2 focus-within:ring-primary overflow-hidden transition-all px-4">
              <span className="material-icons-round text-muted-foreground/60 me-3">email</span>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ali@example.com" 
                className="w-full h-full outline-none text-base font-medium text-foreground bg-transparent placeholder:text-muted-foreground/50"
              />
            </div>
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
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground px-1 uppercase tracking-wider">{t('password')}</label>
            <div className="flex items-center h-14 bg-card text-card-foreground rounded-xl shadow-sm border border-border focus-within:ring-2 focus-within:ring-primary overflow-hidden transition-all px-4">
              <span className="material-icons-round text-muted-foreground/60 me-3">lock</span>
              <input 
                type={showPassword ? "text" : "password"} 
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
