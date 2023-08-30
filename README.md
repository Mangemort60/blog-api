# Blog-Api

## Description

Il s'agit d'une API pour un blog construit avec la MERN Stack. Cette API permet des opérations CRUD standard sur des articles de blog, des utilisateurs, et inclut également des fonctionnalités d'authentification.

## Technologies utilisées

- MongoDB
- Express.js
- React.js (pour le Front-end, pas inclus dans ce repo)
- Node.js
- Mongoose
- JSON Web Token (JWT) pour l'authentification
- Joi pour la validation des données
- Winston pour la journalisation
- Bcrypt pour le hachage de mot de passe

## Installation

1. Installez les dépendances
   ```npm install```
      
2. Lancez le projet
   ```npm run dev```

## Fonctionnalités

- CRUD pour les articles de blog
- CRUD pour les commentaires
- Authentification JWT
- Validation des données avec Joi
- Journalisation des événements avec Winston

## Endpoints

### Articles de blog

- `GET /api/post/get` : Obtenir un article spécifique
- `POST /api/post` : Créer un nouvel article
- `GET /api/posts` : Obtenir tous les articles
- `PUT /api/post/update` : Mettre à jour un article existant
- `DELETE /api/post/delete` : Supprimer un article

### Commentaires

- `POST /api/comment` : Créer un nouveau commentaire
- `PUT /api/comment/update` : Mettre à jour un commentaire existant
- `DELETE /api/comment/delete` : Supprimer un commentaire

### Utilisateurs

- `POST /api/user` : S'inscrire en tant qu'utilisateur
- `POST /api/user/login` : Se connecter en tant qu'utilisateur
- `DELETE /api/user/delete` : Supprimer un utilisateur
