# 🚀 Guide de Déploiement Azure Static Web Apps

## Prérequis
- Compte Azure actif
- Repository GitHub avec le code source
- Azure CLI installé (optionnel)

## 📋 Étapes de Déploiement

### 1. Créer une Azure Static Web App

1. **Connectez-vous au portail Azure** : https://portal.azure.com
2. **Créer une ressource** :
   - Cliquez sur "Créer une ressource"
   - Recherchez "Static Web Apps"
   - Cliquez sur "Créer"

3. **Configuration de base** :
   - **Abonnement** : Sélectionnez votre abonnement Azure
   - **Groupe de ressources** : Créez-en un nouveau ou utilisez un existant
   - **Nom** : `broken-music-landing` (ou votre nom préféré)
   - **Type de plan** : Gratuit (pour commencer)
   - **Région** : Europe Ouest ou votre région préférée

4. **Détails du déploiement** :
   - **Source** : GitHub
   - **Organisation GitHub** : MorganMbala
   - **Repository** : Broken
   - **Branche** : main

5. **Détails de build** :
   - **Build preset** : React
   - **App location** : `/` (racine)
   - **Api location** : `` (vide)
   - **Output location** : `dist`

### 2. Configuration des Variables d'Environnement

1. **Allez dans votre Static Web App** dans le portail Azure
2. **Configuration** > **Variables d'environnement**
3. **Ajoutez** :
   ```
   VITE_GA_ID=G-79562MR3JZ
   ```

### 3. Configuration GitHub Secrets

1. **Dans votre repository GitHub** : https://github.com/MorganMbala/Broken
2. **Settings** > **Secrets and variables** > **Actions**
3. **Ajoutez ces secrets** :
   ```
   AZURE_STATIC_WEB_APPS_API_TOKEN=<token généré par Azure>
   VITE_GA_ID=G-79562MR3JZ
   ```

### 4. Déploiement Automatique

Le déploiement se fera automatiquement via GitHub Actions :

1. **Push vers main** déclenche un déploiement
2. **Pull Request** crée un environnement de preview
3. **Merge** déploie en production

## 🌐 URLs

- **Production** : `https://broken-music-landing.azurestaticapps.net` (ou votre domaine personnalisé)
- **Staging** : Généré automatiquement pour chaque PR

## 🔧 Configuration Avancée

### Domaine Personnalisé

1. **Configuration** > **Domaines personnalisés**
2. **Ajouter** votre domaine
3. **Configurer les enregistrements DNS** :
   ```
   Type: CNAME
   Nom: www
   Valeur: broken-music-landing.azurestaticapps.net
   ```

### Headers de Sécurité

Le fichier `staticwebapp.config.json` inclut :
- Cache optimal pour les assets
- Support des fichiers audio MP3
- Redirection SPA pour React Router
- Headers de sécurité

## 📊 Monitoring

- **Application Insights** : Activez pour le monitoring avancé
- **Logs** : Consultables dans le portail Azure
- **Métriques** : Trafic, performance, erreurs

## 🚨 Troubleshooting

### Problèmes Courants

1. **Build qui échoue** :
   - Vérifiez les variables d'environnement
   - Consultez les logs GitHub Actions

2. **Fichiers audio non accessibles** :
   - Vérifiez le `staticwebapp.config.json`
   - Assurez-vous que les fichiers sont dans `/public`

3. **Google Analytics ne fonctionne pas** :
   - Vérifiez que `VITE_GA_ID` est défini
   - Testez en mode production

## 💡 Commandes Utiles

```bash
# Build local
npm run build

# Preview local
npm run preview

# Test production locale
npx vite build && npx vite preview
```

## 📞 Support

- Documentation Azure : https://docs.microsoft.com/azure/static-web-apps/
- Support Azure : Via le portail Azure
- Issues GitHub : https://github.com/MorganMbala/Broken/issues
