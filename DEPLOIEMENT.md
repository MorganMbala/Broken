# Déploiement sur Vercel 🚀

## Étapes de déploiement

### 1. Aller sur Vercel
- Aller sur [vercel.com](https://vercel.com)
- Se connecter avec GitHub
- Cliquer sur "New Project"

### 2. Importer le projet
- Sélectionner le repo : `MorganMbala/Broken`
- Framework détecté automatiquement : **Vite**
- Build Command : `npm run build` (auto-détecté)
- Output Directory : `dist` (auto-détecté)
- Root Directory : (laisser vide)

### 3. Variables d'environnement
**IMPORTANT** : Avant de déployer, ajouter la variable d'environnement :
- Aller dans l'onglet "Environment Variables"
- Ajouter :
  - **Key** : `VITE_GA_ID`
  - **Value** : `G-79562MR3JZ`
  - **Environment** : Production + Preview

### 4. Déployer
- Cliquer sur "Deploy"
- Vercel va :
  - Cloner le repo
  - Installer les dépendances (`npm install`)
  - Builder le projet (`npm run build`)
  - Déployer le dossier `dist`

### 5. Vérifications post-déploiement
1. **Audio** : Tester que la preview audio 1s→7s fonctionne
2. **Google Analytics** : 
   - Ouvrir les outils de développement
   - Vérifier que `window.gtag` existe
   - Aller sur GA4 Realtime pour voir les page views
3. **Responsive** : Tester sur mobile/desktop
4. **Liens** : Vérifier que tous les liens de streaming fonctionnent

### 6. URL du site
Une fois déployé, vous aurez une URL comme :
`https://broken-xxxxx.vercel.app`

### 7. Domaine personnalisé (optionnel)
- Aller dans Settings → Domains
- Ajouter votre domaine
- Configurer les enregistrements DNS selon les instructions

## Structure des fichiers pour Vercel

```
dist/                     # Généré par `vite build`
├── index.html           # Page principale
├── assets/              # JS/CSS minifiés avec hash
├── broken.jpeg          # Cover image
├── skaska.mp3          # Audio preview
└── logos/              # Logos des plateformes
```

## Variables d'environnement

| Variable | Description | Valeur |
|----------|-------------|--------|
| `VITE_GA_ID` | Google Analytics 4 ID | `G-79562MR3JZ` |

## Commandes utiles

```bash
# Développement local
npm run dev

# Build de production (test local)
npm run build
npm run preview

# Variables d'env locale (.env.local)
VITE_GA_ID=G-79562MR3JZ
```

## Débogage

Si le déploiement échoue :
1. Vérifier les logs dans l'onglet "Functions" de Vercel
2. Tester le build localement : `npm run build`
3. Vérifier que tous les assets sont dans `public/`

## Mise à jour
Pour mettre à jour le site :
1. Faire des modifications en local
2. `git add . && git commit -m "Update"`
3. `git push`
4. Vercel redéploie automatiquement ✨
