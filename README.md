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





## **6. Structure du Projet**
```bash
reddit-scraper/
├── backend/ # Traitement Python
│     └── app.py # Script principal de traitement Reddit
├── frontend/ # Application React
│ ├── node_modules/ # Dependencies React
│ ├── public/ # Fichiers statiques
│ └── src/ # Code source
│   ├── App.js # Composant principal
│   ├── App.css # Styles
│   └── (autres fichiers React)
├── node_modules/ # Dependencies Node.js
├── package-lock.json # Lock des versions
└── package.json # Config projet
```


### **6.1 Backend (Python)**
- **app.py** :
  - Gère la logique de scraping Reddit
  - Utilise une API pour le frontend
  - Formatte les données pour l'affichage

### **6.2 Frontend (React)**
- **App.js** :
  - Point d'entrée de l'application
  - Gère :
    - La communication API avec le backend
    - L'affichage dynamique des données
    - Les interactions utilisateur
- **App.css** :
  - Styles principaux de l'application
  - Mise en page des résultats

### **6.3 Workflow**
1. L'utilisateur lance une recherche via l'interface React
2. Le frontend appelle le backend Python
3. Le backend :
   - Récupère les données Reddit
   - Effectue le traitement nécessaire
4. Les résultats sont affichés dynamiquement

## **7. Dépendances**
### 7.1 Backend
```bash
pip install praw python-dotenv
```
### 7.2 Frontend
```bash
npm install axios react-chartjs-2
```

## **8. Mockups et Screenshots**
### Écran principal :
- Recherche par **subreddit** et **keyword**
<div align="center">
  <img width="946" alt="image" src="https://github.com/user-attachments/assets/8ca60e23-9ee8-4a30-949e-19b5c2d94027">
</div>


- Liste des posts avec sentiment et des statistique sur la répartition des sentiments pour les Subreddits 
<div align="center">
  <img width="1246" alt="image" src="https://github.com/user-attachments/assets/0547705e-5e54-42c6-9a19-6c345f3bc816">
</div>


### Écran des commentaires :
- Affichage des commentaires et leur analyse de sentiment , une **Nouvelle** répartition des sentiments pour les commentaires est affiché
<div align="center">
  <img width="946" alt="image" src="https://github.com/user-attachments/assets/95693a9b-ffee-45c3-8715-9c0a96824e85">
</div>


