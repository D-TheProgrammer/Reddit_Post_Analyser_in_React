# Reddit_Post_Analyser_in_React
[Français] ASR est un outil d'analyse de sentiment pour posts/comments Reddit, utilisant un modèle NLP avancé (positif/négatif/neutre). Fait avec: Flask (backend) + React (frontend).  

[English] ASR is a sentiment analysis tool for Reddit posts/comments, using an NLP model (positive/negative/neutral). Built with Flask (backend) + React (frontend)



# **Documentation Technique - Analyse de Sentiment Reddit**  

## **1. Introduction**  
Ce document technique décrit l'architecture, les composants et les technologies utilisées dans le projet d'analyse de sentiment des posts et commentaires Reddit.


## **2. Inventaire des Librairies et Versions**  

### **Backend (Python - Flask)**
- **Flask** (`>=2.2`) : Framework léger pour créer l'API  
- **PRAW** (`>=7.7`) : Wrapper Python pour accéder à l’API Reddit  
- **Transformers** (`>=4.37`) : Librairie pour le traitement du langage naturel  
- **Torch** (`>=2.1`) : Backend pour exécuter les modèles de Machine Learning  
- **Flask-CORS** (`>=4.0`) : Permet les requêtes cross-origin entre le frontend et le backend  

### **Frontend (React - JavaScript)**
- **React** (`>=18.0`) : Framework JavaScript pour l’interface utilisateur  
- **Axios** (`>=1.6`) : Requêtes HTTP entre le frontend et le backend  


## **3. Présentation des API**  

### **3.1 Endpoint : Récupération des Posts**
- **URL** : `GET /api/posts`  
- **Paramètres** :  
  - `subreddit` (string) : Nom du subreddit  
  - `keyword` (string, optionnel) : Mot-clé de recherche  
  - `limit` (int) : Nombre de résultats  
- **Exemple de requête** :  
  ```http
  GET http://127.0.0.1:5000/api/posts?subreddit=news&keyword=france&limit=15
  
Réponse JSON :
[
  {
    "title": "Titre du post",
    "sentiment": "positive",
    "score": 0.87
  }
]

### **3.2 Endpoint : Récupération des Commentaires**
- **URL**  : `GET /api/comments`
- **Paramètres** : 
  - `title (string)` : Titre du post
  - `subreddit (string)` : Nom du subreddit

- **Exemple de requête** :
    ```http
  GET http://127.0.0.1:5000/api/comments?title=Exemple+News&subreddit=worldnews 
  ```

Réponse JSON :
[
  {
    "text": "Contenu du commentaire",
    "sentiment": "negative",
    "score": 0.23
  }
]



## **4. Architecture Globale**  

### **4.1 Schéma Global**
L'application est composée de deux principaux modules :
- **Frontend React** : Interface utilisateur permettant de chercher des posts et afficher les résultats d'analyse
- **Backend Flask** : API qui récupère les données de Reddit et applique l'analyse de sentiment via un modèle NLP
```
Flux : Utilisateur ↔ React (Frontend) ↔ Flask API (Backend) ↔ API Reddit
```

### **4.2 Technologie NLP**
- **Modèle utilisé** : `cardiffnlp/twitter-roberta-base-sentiment`
- **Objectif** : Classer les textes en `positive`, `negative` ou `neutral`


## **5. Schéma de la Base de Données**
Bien que le projet ne stocke pas de données de manière persistante, voici la structure utilisé par le backend:

### **5.1 Table posts**

| ID  | Title           | Sentiment | Score | Subreddit  | Date       |
|-----|-----------------|-----------|-------|------------|------------|
| 1   | "Post Example"  | Positive  | 0.87  | worldnews  | 2025-03-01 |

### **5.2 Table commentaires**

| ID  | Post_ID | Text               | Sentiment | Score |
|-----|---------|--------------------|-----------|-------|
| 1   | 1       | "Commentaire Exemple"  | Negative  | 0.23  |


## **6. Mockups et Screenshots**
### Écran principal :
- Recherche par **subreddit** et **keyword**
<div align="center">
  <img width="946" alt="image" src="https://github.com/user-attachments/assets/c8bb0155-2d12-4e07-ad01-39a42189171d">
</div>

- Liste des posts avec sentiment
<div align="center">
  <img width="946" alt="image" src="https://github.com/user-attachments/assets/a5f73c47-f97d-491e-a3a2-7098698b4dc0">
</div>




### Écran des commentaires :
- Affichage des commentaires et leur analyse de sentiment
<div align="center">
  <img width="946" alt="image" src="https://github.com/user-attachments/assets/561a9ed8-754f-401a-a44b-59446ac085d9">
</div>


