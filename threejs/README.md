# Visualiseur d'Hôtels 3D

Une application web interactive pour visualiser des modèles 3D d'hôtels en utilisant Three.js et Vue.js.

## Fonctionnalités

- Visualisation de modèles 3D d'hôtels
- Navigation interactive avec la souris
- Interface utilisateur intuitive
- Chargement dynamique des modèles
- Adaptation automatique de la caméra

## Installation

1. Clonez le repository
2. Installez les dépendances :
```bash
npm install
```

3. Lancez le serveur de développement :
```bash
npm run dev
```

## Ajout de modèles d'hôtels

Pour ajouter un nouvel hôtel :

1. Placez le fichier du modèle 3D (format .glb) dans le dossier `public/models/`
2. Ajoutez les informations de l'hôtel dans le tableau `hotels` dans `src/App.vue` :
```javascript
{
  id: 3,
  name: 'Nom de l\'hôtel',
  thumbnail: 'URL de l\'image miniature',
  modelUrl: '/models/nom-du-modele.glb'
}
```

## Contrôles

- Clic gauche + déplacement : Rotation de la caméra
- Clic droit + déplacement : Pan de la caméra
- Molette : Zoom avant/arrière

## Technologies utilisées

- Vue.js 3
- Three.js
- Vite
- GLTFLoader 