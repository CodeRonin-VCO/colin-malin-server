# Server pour l'application "Colin-Malin"

## Routes de l'api :
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

## Schéma des modèles
![alt text](image.png)