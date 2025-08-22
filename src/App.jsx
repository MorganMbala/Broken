import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import providers from './providers'
import { initGA, trackMusicLinkClick } from './analytics'

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.08 * i, duration: .4, ease: 'easeOut' } })
}

// === i18n simple ===
const MESSAGES = {
  en: {
    newSongs: 'NEW SONGS AVAILABLE',
    links: 'OFFICIAL\nLINKS',
    cookies: 'Cookies',
    privacy: 'Privacy',
    play: 'Play',
    powered: 'POWERED BY',
    brand: 'Zyrasoft'
  },
  fr: {
    newSongs: 'NOUVEAUX TITRES DISPONIBLES',
    links: 'LIENS\nOFFICIELS',
    cookies: 'Cookies',
    privacy: 'Confidentialité',
    play: 'Écouter',
    powered: 'PROPULSÉ PAR',
    brand: 'Zyrasoft'
  }
}

const detectLang = () => {
  if (typeof window === 'undefined') return 'en'
  const stored = localStorage.getItem('app_lang')
  if (stored && MESSAGES[stored]) return stored
  const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase()
  return nav.startsWith('fr') ? 'fr' : 'en'
}

// Composant pour l'animation BROKEN avec DotLottie uniquement
const BrokenAnimation = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 'clamp(180px, 35vw, 240px)',
      width: '100%',
      margin: '0 auto'
    }}>
      <DotLottieReact
        src="https://lottie.host/ac98a8cd-1fd8-4f23-81e6-d896d1213e2f/ICxJ8YXJew.lottie"
        loop
        autoplay
        style={{
          width: 'clamp(480px, 80vw, 640px)',
          height: 'clamp(180px, 35vw, 240px)',
          position: 'relative'
        }}
      />
    </div>
  )
}

export default function App() {
  const [lang, setLang] = useState('en')
  const dict = MESSAGES[lang]
  // Overlay debug audio
  const [previewLogs, setPreviewLogs] = useState([])
  const [previewVisible, setPreviewVisible] = useState(true)
  // Nouvel état: blocage autoplay / bouton manuel
  const [previewBlocked, setPreviewBlocked] = useState(false)
  const pushLog = (msg) => setPreviewLogs(l => [...l.slice(-40), `${new Date().toLocaleTimeString()} ${msg}`])

  useEffect(() => {
    setLang(detectLang())
  }, [])

  // expose small toggle (optional)
  const toggleLang = () => {
    const next = lang === 'en' ? 'fr' : 'en'
    setLang(next)
    localStorage.setItem('app_lang', next)
  }

  // Initialiser Google Analytics au chargement de l'app
  useEffect(() => {
    initGA()
  }, [])

  // Fonction pour suivre les clics sur les liens musicaux
  const handleMusicLinkClick = (platform) => {
    trackMusicLinkClick(platform)
  }

  // Lecture audio complète une seule fois au chargement de la page
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.__previewActive) { console.log('[preview] already active, skip'); return }
    window.__previewActive = true

    const audio = new Audio('/skaska.mp3')
    audio.preload = 'auto'
    audio.playsInline = true
    audio.muted = true
    audio.volume = 1

    let stopped = false
    let hasUnmuted = false

    const log = (...args) => { console.log('[preview]', ...args); pushLog(args.join(' ')) }

    const cleanup = () => { try { audio.pause() } catch {} }

    const unmuteWithFade = (why) => {
      if (stopped) return
      if (!audio.muted) return
      if (hasUnmuted) return
      audio.volume = 0
      const DURATION = 900
      const t0 = performance.now()
      const step = (now) => {
        if (stopped) return
        const ratio = Math.min(1, (now - t0) / DURATION)
        audio.volume = ratio
        if (ratio < 1) requestAnimationFrame(step)
        else log('fade-in terminé')
      }
      setTimeout(() => {
        try { audio.muted = false; hasUnmuted = true; log('unmuted (fade)', why || ''); requestAnimationFrame(step) } catch {}
      }, 40)
    }

    const tryStart = (label) => {
      log('attempt play', label)
      const p = audio.play()
      if (p && p.then) {
        p.then(() => {
          log('play started - playing full track')
          unmuteWithFade(label)
          setPreviewBlocked(false)
        }).catch(err => {
          log('autoplay blocked', err?.name + ':' + err?.message)
          setPreviewBlocked(true)
        })
      }
      // Timeout fallback
      setTimeout(() => {
        if (stopped) return
        if (audio.paused || audio.currentTime < 0.05) {
          log('progress timeout -> blocked fallback')
          setPreviewBlocked(true)
        }
      }, 1500)
    }

    audio.addEventListener('loadedmetadata', () => {
      log('loadedmetadata duration=' + audio.duration.toFixed(2))
    })
    audio.addEventListener('canplaythrough', () => log('canplaythrough readyState=' + audio.readyState))
    audio.addEventListener('playing', () => log('playing event ct=' + audio.currentTime.toFixed(3)))
    audio.addEventListener('ended', () => log('track ended - playback complete'))
    audio.addEventListener('error', () => log('error code=' + (audio.error?.code || '?')))
    audio.addEventListener('volumechange', () => log('volumechange muted=' + audio.muted + ' vol=' + audio.volume.toFixed(2)))

    const onPointer = () => { log('pointer gesture fallback'); tryStart('pointer') }

    log('init preview (full track)')
    tryStart('auto')
    window.addEventListener('pointerdown', onPointer, { once: true })

    window.__retryPreview = () => { log('manual retry'); tryStart('manual') }

    return () => { stopped = true; cleanup(); window.removeEventListener('pointerdown', onPointer); delete window.__retryPreview; delete window.__previewActive }
  }, [])

  return (
    <>
      {/* UI debug retirée */}
      {/* Small language toggle button */}
      <div style={{ position: 'absolute', top: 'clamp(5px, 1.2vw, 6px)', right: 'clamp(6px, 1.5vw, 10px)', zIndex: 10 }}>
        <button onClick={toggleLang} style={{ 
          background: 'transparent', 
          color: '#7DD321', 
          border: '1px solid #7DD321', 
          borderRadius: 'clamp(3px, 0.8vw, 5px)', 
          padding: 'clamp(2px, 0.8vw, 3px) clamp(5px, 1.5vw, 8px)', 
          fontSize: 'clamp(9px, 2vw, 10px)', 
          cursor: 'pointer',
          fontWeight: '600'
        }}>
          {lang === 'en' ? 'FR' : 'EN'}
        </button>
      </div>
      {/* Section Hero avec couverture et animation */}
      <div className="hero">
        <img className="cover"
          src="/broken.jpeg"
          alt="BROKEN Cover" />
        <div style={{
          width: '100%',
          height: 'clamp(180px, 35vw, 240px)',
          marginTop: 'clamp(12px, 2.5vw, 15px)',
          marginBottom: 'clamp(6px, 1.5vw, 8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <BrokenAnimation />
        </div>
        <div className="album"></div>
        <div className="tag">{dict.newSongs}</div>
      </div>

      {/* Séparateur */}
      <div className="divider"></div>

      {/* Section Links */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, ease: 'easeOut' }}>
            <motion.div className="stack" initial="hidden" animate="show">
              <div className="section-title" style={{ whiteSpace: 'pre-line' }}>{dict.links}</div>
              {providers.map((p, i) => (
                <motion.div key={p.key} className="row" custom={i} variants={itemVariants} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <div className="left">
                    {p.logo && (
                      p.key === 'youtube' ? (
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          <img className="logo" src={p.logo} alt={p.name} loading="lazy" style={{ marginRight: '6px' }} />
                          <span style={{ fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 500, fontSize: '2rem', color: '#111', letterSpacing: 0 }}>YouTube Music</span>
                        </span>
                      ) : p.key === 'spotify' ? (
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          <img className="logo" src={p.logo} alt={p.name} loading="lazy" style={{ height: '2.2rem', width: '2.2rem', marginRight: '10px' }} />
                          <span style={{ fontFamily: 'Arial Black, Arial, sans-serif', fontWeight: 700, fontSize: '2rem', color: '#1ED760', letterSpacing: 0, position: 'relative', display: 'inline-block', lineHeight: 1 }}>
                            Spotify<sup style={{ fontSize: '0.55em', color: '#1ED760', fontFamily: 'Arial, sans-serif', fontWeight: 700, marginLeft: '1px', verticalAlign: 'top', lineHeight: 1 }}>&reg;</sup>
                          </span>
                        </span>
                      ) : p.key === 'apple' ? (
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          <img className="logo" src={p.logo} alt={p.name} loading="lazy" style={{ height: '3.5rem', width: '3.5rem', marginRight: '10px' }} />
                          <span style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", Arial, sans-serif', fontWeight: 700, fontSize: '2rem', color: '#111', letterSpacing: 0, display: 'inline-block', lineHeight: 1 }}>Music</span>
                        </span>
                      ) : (
                        <img className="logo" src={p.logo} alt={p.name} loading="lazy" />
                      )
                    )}
                    <div className="label">{p.name}</div>
                  </div>
                  <div className="cta">
                    {p.actions.map(a => (
                      <a
                        key={a.label}
                        href={a.href}
                        className="btn"
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => handleMusicLinkClick(p.name)}
                      >
                        {dict.play}
                      </a>
                    ))}
                  </div>
                </motion.div>
              ))}
              <div className="dots">⋯⋯⋯⋯ </div>
              <div className="legal">
                <a href="#" target="_blank" rel="noreferrer">{dict.cookies}</a>
                <span>•</span>
                <a href="#" target="_blank" rel="noreferrer">{dict.privacy}</a>
              </div>
              <footer style={{textAlign:'center', color:'#374151', fontSize:14, letterSpacing:'.16em', marginTop:24}}>
                {dict.powered}<br/><br/><strong>{' '}{dict.brand}<span className="copy-mark">©</span></strong>
              </footer>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
