// Configuration Google Analytics 4
// Pas besoin d'import externe - on utilise l'API native du navigateur

// ID paramétrable via variable d'environnement Vite
const GA_MEASUREMENT_ID = import.meta.env?.VITE_GA_ID || 'G-79562MR3JZ'

export const isGAEnabled = () => typeof window !== 'undefined' && !!GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX'

// Initialiser Google Analytics (idempotent)
export const initGA = () => {
    if (typeof window === 'undefined') return
    if (!GA_MEASUREMENT_ID) return
    if (window.__GA_INIT_DONE) return
    window.__GA_INIT_DONE = true

    // Script gtag
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script1)

    // dataLayer + gtag
    window.dataLayer = window.dataLayer || []
    window.gtag = function () { window.dataLayer.push(arguments) }

    window.gtag('js', new Date())
    window.gtag('config', GA_MEASUREMENT_ID, {
        anonymize_ip: true,
        cookie_flags: 'secure;samesite=strict'
    })
}

// Suivre les pages vues
export const trackPageView = (url) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', { page_path: url })
    }
}

// Suivre les clics sur les liens musicaux
export const trackMusicLinkClick = (platform, action = 'click') => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: 'Music Links',
            event_label: platform,
            value: 1
        })
    }
}

// Suivre événements personnalisés
export const trackEvent = (action, category, label, value) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        })
    }
}
