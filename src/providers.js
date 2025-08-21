const base = '/logos'

const providers = [
  { key: 'spotify', name: 'Spotify', logo: `${base}/spotify.svg`, actions: [{ label: 'Play', href: 'https://open.spotify.com/artist/1zE51oPt9MOmwy4WNVcFdh?si=5xHpI37QR5WeReWzFeCswQ' }] },
  { key: 'apple', name: 'Apple Music', logo: `${base}/apple-music.svg`, actions: [{ label: 'Play', href: 'https://music.apple.com/ca/artist/broken/1765815997?l=fr-CA' }] },
  { key: 'youtube', name: 'YouTube Music', logo: `${base}/youtube-music.svg`, actions: [{ label: 'Play', href: 'https://youtube.com/@brokenska?si=DoeIYrof6yxuZMLO' }] },
]

export default providers
