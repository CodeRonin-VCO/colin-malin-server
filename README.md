# Colin-Malin Server 

Backend Node.js pour l'application de quiz **Colin-Malin**, offrant une API complète de gestion des utilisateurs, questions et parties de jeu.

## Description
Colin-Malin est une application de quiz permettant aux utilisateurs de :
- créer un compte et se connecter
- jouer à des parties de quiz en solo
- répondre à des questions filtrées (thème, difficulté)
- enregistrer et consulter leurs scores

Le mode multijoueur est prévu mais non encore implémenté.

## Stack technique

- Node.js
- Express
- PostgreSQL
- Sequelize (ORM)
- JWT (authentification)
- Validation des données via schémas

## État du projet

Fonctionnalités implémentées :
- Authentification
- Gestion des utilisateurs
- Quiz solo
- Scores

Fonctionnalités prévues :
- Mode multijoueur
- leaderBoard
- Tests automatisés
- Amélioration de la sécurité
- Rôle (admin/user)

## Installation

Cloner le dépôt :

git clone https://github.com/CodeRonin-VCO/colin-malin-server.git
cd colin-malin-server

Installer les dépendances :

```npm install```

## Configuration

Créer un fichier `.env` à la racine du projet :
```
PORT=

DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

JWT_SECRET=
JWT_ISSUER=
JWT_AUDIENCE=
```

## Lancement du projet
Mode développement (avec nodemon) :

```npm run dev```

Mode production :

```npm start```

## Vérification du projet
### Linter :

```npx @eslint/create-config```

Ajouter le script dans package.json :
```
"scripts": {
    "lint": "eslint ."
}
```

Lancer lint :
```npm run lint```

### Tests

## Sécurité
Mesures actuelles : 
- helmet
- rate-limit
- Mot de passe hashé (argon2)
- Routes protégées par JWT

Améliorations prévues : 
- Renforcement de la gestion des rôles

## Gestion des erreurs
Les erreurs sont centralisées via un middleware global (errorHandler) et un héritage de la classe Error (ApiError).

Format de réponse standard (en dev):
```
{
    method: req.method,
    path: req.originalUrl,
    statusCode,
    name: error.name,
    message: error.message,
    stack: error.stack
}
```

Format ApiError : 
```
statusCode, message, expose = statusCode < 500
```

## Routes de l'api

```
/api
    /auth
        POST    /login          # Connexion utilisateur
        POST    /register       # Inscription utilisateur
        POST    /update-pwd     # Mise à jour du mot de passe
    /user
        GET     /               # Récupérer le profil utilisateur
        PUT     /               # Mettre à jour le profil
        DELETE  /               # Supprimer le compte
    /games
        GET     /               # Lister les parties (historique)
        POST    /               # Créer une nouvelle partie
        GET     /:id            # Récupérer une partie spécifique
    /questions
            GET     /           # Lister les questions (pour admin ou sélection aléatoire)
            GET     /search     # Chercher une question (pour admin)
            POST    /filtered   # Questions filtrées (nb_questions, difficulté, thèmes)
            POST    /           # Ajouter une question (admin)
            GET     /:id        # Récupérer une question spécifique
            PUT     /:id        # Mettre à jour une question (admin)
            DELETE  /:id        # Supprimer une question (admin)
    /scores
        POST    /addResults     # Enregistrer les résultats d'une partie
        GET     /filtered       # Récupérer les scores filtrés (thème, date, points)
        GET     /user/:id       # Scores d’un utilisateur spécifique
        GET     /leaderboard    # (optionnel) Top scores globaux
```

## 📁 Structure du projet

```
src/
├── app.js                          # Point d'entrée de l'application
├── config/
│   └── init-db.js                  # Configuration et initialisation BD (sequelize)
├── controllers/
│   ├── auth.controller.js          # Logique authentification
│   ├── games.controller.js         # Logique des parties
│   ├── questions.controller.js     # Logique des questions
│   └── scores.controller.js        # Logique des scores
│   └── user.controller.js          # Logique des profils utilisateurs
├── errors/
│   └── apiError.js                 # Extension de Error pour une meilleure gestion des erreurs
├── middlewares/
│   ├── auth.middleware.js          # Vérification JWT et autorisation
│   ├── errorHandler.middleware.js  # Gestion globale des erreurs
│   ├── pagination.middleware.js    # Pagination des résultats
│   └── validationBody.middleware.js # Validation des données du body
├── models/
│   ├── users.model.js              # Modèle Utilisateur
│   ├── questions.model.js          # Modèle Questions
│   ├── games.model.js              # Modèle Parties
│   ├── gameQuestion.model.js       # Modèle association Partie-Question
│   ├── multiplayer.model.js        # Modèle Multijoueur (futur)
│   ├── scores.model.js             # Modèle Scores
│   └── index.js                    # Configuration Sequelize
├── routers/
│   ├── index.js                    # Router principal
│   ├── auth.router.js              # Routes authentification
│   ├── user.router.js              # Routes profil utilisateur
│   ├── games.router.js             # Routes parties
│   ├── scores.router.js            # Routes scores
│   └── questions.router.js         # Routes questions
├── schemas/
│   ├── auth.schema.js              # Schéma authentification (pour la validation du Body)
│   ├── user.schema.js              # Schéma profil utilisateur (pour la validation du Body)
│   ├── games.schema.js             # Schéma parties (pour la validation du Body)
│   ├── scores.schema.js            # Schéma scores (pour la validation du Body)
│   └── questions.schema.js         # Schéma questions (pour la validation du Body)
├── services/
│   ├── auth.service.js              # Service authentification (logique métier des controllers)
│   ├── user.service.js              # Service profil utilisateur (logique métier des controllers)
│   ├── games.service.js             # Service parties (logique métier des controllers)
│   ├── scores.service.js            # Service scores (logique métier des controllers)
│   └── questions.service.js         # Service questions (logique métier des controllers)
└── utils/
    └── jwt.utils.js                # Utilitaires JWT
```


## Améliorations techniques possibles
- Remplacer le custom middleware gérant la validation du body par une librairie (Joi)
  

## Licence

Projet personnel – usage pédagogique.
