# Colin-Malin Server 

Backend Node.js pour l'application de quiz **Colin-Malin**, offrant une API complète de gestion des utilisateurs, questions et parties de jeu.## Routes de l'api :

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
            GET     /filtered   # Questions filtrées (nb_questions, difficulté, thèmes)
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
├── app.js                    # Point d'entrée de l'application
├── config/
│   └── init-db.js           # Configuration et initialisation BD
├── controllers/
│   ├── auth.controller.js    # Logique authentification
│   ├── games.controller.js   # Logique des parties
│   ├── questions.controller.js # Logique des questions
│   └── user.controller.js    # Logique des profils utilisateurs
├── middlewares/
│   ├── auth.middleware.js    # Vérification JWT et autorisation
│   └── pagination.middleware.js # Pagination des résultats
├── models/
│   ├── users.model.js        # Modèle Utilisateur
│   ├── questions.model.js    # Modèle Questions
│   ├── games.model.js        # Modèle Parties
│   ├── gameQuestion.model.js # Modèle association Partie-Question
│   ├── multiplayer.model.js  # Modèle Multijoueur (futur)
│   └── index.js              # Configuration Sequelize
├── routers/
│   ├── index.js              # Router principal
│   ├── auth.router.js        # Routes authentification
│   ├── user.router.js        # Routes profil utilisateur
│   ├── games.router.js       # Routes parties
│   └── questions.router.js   # Routes questions
└── utils/
    └── jwt.utils.js          # Utilitaires JWT
```
