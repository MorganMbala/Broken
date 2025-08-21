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

// Composant pour l'animation BROKEN avec DotLottie
const BrokenAnimation = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0px',
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontWeight: 900,
      letterSpacing: '2px',
      height: '80px',
      width: '100%',
      margin: '0 auto'
    }}>
      <motion.span
        initial={{ opacity: 0.7, scale: 1 }}
        animate={{
          opacity: [0.7, 0.7, 0.7, 0.7, 0.7, 1, 0.4, 1, 0.3, 0.7],
          scale: [1, 1, 1, 1, 1, 1.08, 0.95, 1.12, 0.88, 1],
          textShadow: [
            "0 0 8px rgba(125, 211, 33, 0.3)",
            "0 0 8px rgba(125, 211, 33, 0.3)",
            "0 0 8px rgba(125, 211, 33, 0.3)",
            "0 0 8px rgba(125, 211, 33, 0.3)",
            "0 0 8px rgba(125, 211, 33, 0.3)",
            "0 0 25px rgba(125, 211, 33, 1), 0 0 50px rgba(125, 211, 33, 0.8)",
            "0 0 4px rgba(125, 211, 33, 0.2)",
            "0 0 30px rgba(125, 211, 33, 1), 0 0 60px rgba(125, 211, 33, 0.9)",
            "0 0 2px rgba(125, 211, 33, 0.1)",
            "0 0 8px rgba(125, 211, 33, 0.3)"
          ],
          filter: [
            "brightness(1) contrast(1) saturate(1)",
            "brightness(1) contrast(1) saturate(1)",
            "brightness(1) contrast(1) saturate(1)",
            "brightness(1) contrast(1) saturate(1)",
            "brightness(1) contrast(1) saturate(1)",
            "brightness(1.3) contrast(1.2) saturate(1)",
            "brightness(0.7) contrast(0.9) saturate(1)",
            "brightness(1.4) contrast(1.3) saturate(1)",
            "brightness(0.5) contrast(0.8) saturate(1)",
            "brightness(1) contrast(1) saturate(1)"
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.3, 0.4, 0.5, 0.6, 0.65, 0.7, 0.75, 0.8, 1]
        }}
        style={{
          fontSize: '48px',
          color: '#7DD321',
          lineHeight: '1',
          fontWeight: 900,
          zIndex: 1,
          position: 'relative',
          filter: 'drop-shadow(0 0 6px rgba(125, 211, 33, 0.4))'
        }}
      >
        BROKE
      </motion.span>
      <DotLottieReact
        src="https://lottie.host/f2157860-6a5b-4acb-9595-512db3fdb931/0NxljSbPg3.lottie"
        loop
        autoplay
        style={{
          width: '80px',
          height: '60px',
          marginLeft: '-15px',
          transform: 'translateY(-1px)',
          zIndex: 2,
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

  // Lecture audio segment 1s -> 7s en boucle infinie (démarrage direct, fade-in sur première lecture)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.__previewActive) { console.log('[preview] already active, skip'); return }
    window.__previewActive = true

    const START_AT = 1.0
    const END_AT = 7.0
    const LOOP_LEN_MS = ((END_AT - START_AT) * 1000) | 0

    const audio = new Audio('/skaska.mp3')
    audio.preload = 'auto'
    audio.playsInline = true
    audio.muted = true
    audio.volume = 1

    let rafLoop = null
    let stopped = false
    let hasUnmuted = false
    let stagnantChecks = 0
    let lastCT = 0
    let loopStarted = false

    const log = (...args) => { console.log('[preview]', ...args); pushLog(args.join(' ')) }

    const cleanup = () => { try { audio.pause() } catch {} if (rafLoop) cancelAnimationFrame(rafLoop) }

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

    const ensureLooping = () => {
      if (loopStarted) return
      loopStarted = true
      log('loop start', `${START_AT}-${END_AT}s len=${LOOP_LEN_MS}ms`)
      const loopTick = () => {
        if (stopped) return
        const ct = audio.currentTime
        if (ct >= END_AT) {
          try { audio.currentTime = START_AT } catch {}
          log('loop segment ct=' + audio.currentTime.toFixed(3))
        }
        if (!audio.paused) {
          if (Math.abs(ct - lastCT) < 0.005) {
            stagnantChecks++
            if (stagnantChecks > 30) { // ~0.5s
              log('stagnation detected -> force play()')
              stagnantChecks = 0
              audio.play().catch(err => log('retry play blocked', err?.message || err))
            }
          } else {
            stagnantChecks = 0
          }
          lastCT = ct
        }
        rafLoop = requestAnimationFrame(loopTick)
      }
      rafLoop = requestAnimationFrame(loopTick)
    }

    const tryStart = (label) => {
      log('attempt play', label)
      const p = audio.play()
      if (p && p.then) {
        p.then(() => {
          log('play started')
          unmuteWithFade(label)
          // Attendre progression réelle puis aligner sur START_AT si besoin
          const waitProgress = () => {
            if (stopped) return
            if (audio.currentTime === 0) {
              requestAnimationFrame(waitProgress)
              return
            }
            if (audio.currentTime < START_AT - 0.02) {
              try { audio.currentTime = START_AT } catch {}
            } else if (audio.currentTime < START_AT) {
              // laisser approcher
            } else if (audio.currentTime > END_AT) {
              try { audio.currentTime = START_AT } catch {}
            }
            ensureLooping()
            setPreviewBlocked(false)
          }
          requestAnimationFrame(waitProgress)
        }).catch(err => {
          log('autoplay blocked', err?.name + ':' + err?.message)
          setPreviewBlocked(true)
        })
      }
      // Timeout fallback progression
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
      try { audio.currentTime = START_AT } catch {}
    })
    audio.addEventListener('canplaythrough', () => log('canplaythrough readyState=' + audio.readyState))
    audio.addEventListener('playing', () => log('playing event ct=' + audio.currentTime.toFixed(3)))
    audio.addEventListener('error', () => log('error code=' + (audio.error?.code || '?')))
    audio.addEventListener('volumechange', () => log('volumechange muted=' + audio.muted + ' vol=' + audio.volume.toFixed(2)))

    const onPointer = () => { log('pointer gesture fallback'); tryStart('pointer') }

    log('init preview (direct loop)')
    tryStart('auto')
    window.addEventListener('pointerdown', onPointer, { once: true })

    window.__retryPreview = () => { log('manual retry'); tryStart('manual') }

    return () => { stopped = true; cleanup(); window.removeEventListener('pointerdown', onPointer); delete window.__retryPreview; delete window.__previewActive }
  }, [])

  return (
    <>
      {/* UI debug retirée */}
      {/* Small language toggle button */}
      <div style={{ position: 'absolute', top: 8, right: 12, zIndex: 10 }}>
        <button onClick={toggleLang} style={{ background: 'transparent', color: '#7DD321', border: '1px solid #7DD321', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>
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
          height: '100px',
          marginTop: '20px',
          marginBottom: '10px',
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
