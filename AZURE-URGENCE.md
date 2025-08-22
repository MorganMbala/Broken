# 🆘 GUIDE URGENCE - Créer Azure Static Web App

## 🚀 Création Rapide (5 minutes)

### 1. Ouvrir Azure Portal
https://portal.azure.com

### 2. Créer une Ressource
- Cliquez sur **"+ Créer une ressource"**
- Tapez **"Static Web Apps"**
- Cliquez sur **"Créer"**

### 3. Configuration EXACTE
```
Abonnement: [Votre abonnement]
Groupe de ressources: broken-music (créer nouveau)
Nom: broken-music-app
Plan: Gratuit
Région: West Europe

Source: GitHub
Organisation: MorganMbala
Repository: Broken
Branche: main

Build Details:
- Build Presets: React
- App location: /
- Api location: (laisser vide)
- Output location: dist
```

### 4. Après Création
1. **Copiez l'URL** générée (quelque chose comme `https://xyz.azurestaticapps.net`)
2. **Notez le nom** de votre Static Web App
3. **Allez dans Configuration > Environment variables**
4. **Ajoutez** : `VITE_GA_ID` = `G-79562MR3JZ`

### 5. Récupérer le Token
1. **Manage deployment token**
2. **Copiez le token** généré
3. **Allez sur GitHub** : https://github.com/MorganMbala/Broken/settings/secrets/actions
4. **Créez un nouveau secret** :
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN_YELLOW_ROCK_00BD19B1E`
   - Value: [Le token copié]

## ⚡ Test Rapide
Une fois tout configuré :
1. **Faites un petit changement** dans votre code
2. **Push vers GitHub**
3. **Attendez 2-3 minutes**
4. **Testez l'URL Azure**
