# Colin-Malin Server

Backend Node.js pour l'application de quiz **Colin-Malin**, offrant une API REST complète de gestion des utilisateurs, questions et parties de jeu.

---

## Fonctionnalités

- Authentification (inscription / connexion / mise à jour du mot de passe)
- Gestion du profil utilisateur (modification, suppression)
- Quiz solo (création de partie, questions filtrées par thème et difficulté)
- Enregistrement et consultation des scores
- Espace admin pour gérer les questions (ajout, modification, suppression)

---

## Technologies

| Catégorie | Technologie |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Base de données | PostgreSQL |
| ORM | Sequelize |
| Authentification | JWT |
| Hashage | Argon2 |
| Sécurité | Helmet + express-rate-limit |
| Tests | Jest (ES Modules via `--experimental-vm-modules`) |

---

## Prérequis

- Node.js 18+
- PostgreSQL (via Docker en local)

---

## Installation

```bash
# Cloner le projet
git clone https://github.com/CodeRonin-VCO/colin-malin-server.git
cd colin-malin-server

# Installer les dépendances
npm install
```

---

## Variables d'environnement

Créer un fichier `.env` à la racine du projet à partir du `.env.example` :

```env
PORT="8008"
NODE_ENV="dev"

# JWT
JWT_SECRET=""
JWT_ISSUER=""
JWT_AUDIENCE=""

# Base de données
DB_DATABASE=""
DB_USER="postgres"
DB_PASSWORD=""
DB_SERVER="localhost"
DB_PORT="5432"

# Railway (alternative aux variables DB_* séparées)
# DATABASE_URL=""
```

> ⚠️ Ne jamais committer le fichier `.env` — il est dans `.gitignore`

---

## Lancer le projet

```bash
# Développement (avec nodemon)
npm run dev

# Production
npm start

# Initialiser la base de données
npm run init-db

# Linter
npm run lint

# Tests
npm test

# Tests en mode watch
npm run test:watch
```

---

## Tests

Les tests couvrent les middlewares, les erreurs et les routes avec Jest et Supertest.

```bash
npm test
```

### Ce qui est testé

| Fichier | Type |
|---|---|
| `apiError` | Classe d'erreur custom |
| `auth.middleware` | Vérification JWT |
| `errorHandler.middleware` | Gestion globale des erreurs |
| `validationBody.middleware` | Validation du body |
| `auth.router` | Tests d'intégration routes auth |

### Configuration Jest (ES Modules)

Ce projet utilise `"type": "module"`. Jest nécessite une configuration spécifique :

```json
"scripts": {
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js --forceExit",
    "test:watch": "node --experimental-vm-modules node_modules/jest/bin/jest.js --watch --forceExit"
}
```

---

## Architecture

```
src/
├── app.js                          # Point d'entrée de l'application
├── config/
│   └── init-db.js                  # Initialisation BD (Sequelize sync)
├── controllers/
│   ├── auth.controller.js          # Logique authentification
│   ├── games.controller.js         # Logique des parties
│   ├── questions.controller.js     # Logique des questions
│   ├── scores.controller.js        # Logique des scores
│   └── user.controller.js          # Logique des profils utilisateurs
├── errors/
│   ├── apiError.js                 # Extension de Error pour une meilleure gestion des erreurs
│   └── apiError.test.js            # Tests unitaires ApiError
├── middlewares/
│   ├── auth.middleware.js          # Vérification JWT et autorisation
│   ├── auth.middleware.test.js     # Tests unitaires auth middleware
│   ├── errorHandler.middleware.js  # Gestion globale des erreurs
│   ├── errorHandler.middleware.test.js  # Tests unitaires errorHandler
│   ├── pagination.middleware.js    # Pagination des résultats
│   ├── validationBody.middleware.js     # Validation des données du body
│   └── validationBody.middleware.test.js  # Tests unitaires validation
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
│   ├── auth.schema.js              # Schéma authentification
│   ├── user.schema.js              # Schéma profil utilisateur
│   ├── games.schema.js             # Schéma parties
│   ├── scores.schema.js            # Schéma scores
│   └── questions.schema.js         # Schéma questions
├── services/
│   ├── auth.service.js             # Service authentification
│   ├── user.service.js             # Service profil utilisateur
│   ├── games.service.js            # Service parties
│   ├── scores.service.js           # Service scores
│   └── questions.service.js        # Service questions
└── utils/
    └── jwt.utils.js                # Utilitaires JWT
tests/
└── auth.router.test.js             # Tests d'intégration routes auth
```

### Flux d'une requête

```
Route → Controller → Service → Model → PostgreSQL
```

Les erreurs remontent via `throw new ApiError(statusCode, message)` et sont interceptées par le middleware `errorHandler`.

---

## Routes de l'API

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
        GET     /               # Lister les questions
        GET     /search         # Chercher une question (admin)
        POST    /filtered       # Questions filtrées (nb, difficulté, thèmes)
        POST    /               # Ajouter une question (admin)
        GET     /:id            # Récupérer une question spécifique
        PUT     /:id            # Mettre à jour une question (admin)
        DELETE  /:id            # Supprimer une question (admin)
    /scores
        POST    /addResults     # Enregistrer les résultats d'une partie
        GET     /filtered       # Récupérer les scores filtrés
        GET     /user/:id       # Scores d'un utilisateur spécifique
        GET     /leaderboard    # Top scores globaux
```

---

## Gestion des erreurs

Les erreurs sont centralisées via un middleware global (`errorHandler`) et une classe custom (`ApiError`) :

```
throw new ApiError(statusCode, message)
        ↓
errorHandler.middleware.js
        ↓
Réponse JSON standardisée
```

Format de réponse en dev :
```json
{
    "method": "POST",
    "path": "/api/auth/login",
    "statusCode": 401,
    "name": "ApiError",
    "message": "Invalid credentials",
    "stack": "..."
}
```

---

## Sécurité

Mesures en place :
- `helmet` — headers HTTP sécurisés
- `express-rate-limit` — limitation du nombre de requêtes
- `argon2` — hashage des mots de passe
- JWT — routes protégées par token

Améliorations prévues :
- Gestion des rôles (admin / utilisateur)

---

## À venir

- Mode multijoueur
- Leaderboard global
- Gestion des rôles (admin / utilisateur)

---

## Améliorations techniques identifiées

- Remplacer le middleware de validation custom par une librairie (Joi)

---

## Licence

Projet personnel – usage pédagogique.