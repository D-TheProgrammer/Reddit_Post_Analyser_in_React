from flask import Flask, jsonify, request
import praw
from transformers import pipeline
from flask_cors import CORS  

app = Flask(__name__)
CORS(app)  

#Pour configurer l'API Reddit
reddit = praw.Reddit(
    client_id="a-zeRHDrHsel4Sy_UkjY5Q",
    client_secret="B0N14KeJPsUFY1DdZb3UpuaVGmY3AQ",
    user_agent="sentiment-analyzer"
)

#Modele d'analyse de sentiment
sentiment_pipeline = pipeline("text-classification", model="cardiffnlp/twitter-roberta-base-sentiment")


#Fonction pour recuperer des posts d'un subreddit
def get_reddit_posts(subreddit_name, keyword=None, limit=5):
    subreddit = reddit.subreddit(subreddit_name)
    posts = []
    
    if keyword:
        #Recherche avec mot-clé
        for post in subreddit.search(keyword, sort="relevance", limit=limit):
            #Analyse sentimentale des posts
            sentiment = sentiment_pipeline(post.title.strip()[:500])[0]
            
            sentiment_label = sentiment["label"]
            if sentiment_label == "LABEL_2":
                sentiment_text = "POSITIVE"
            elif sentiment_label == "LABEL_0":
                sentiment_text = "NEGATIVE"
            elif sentiment_label == "LABEL_1":
                sentiment_text = "NEUTRAL"
            else:
                sentiment_text = "NEUTRAL"
            
            #On append les informations pour les traitere plus tard 
            posts.append({
                "title": post.title,
                "sentiment": sentiment_text,
                "score": sentiment["score"]
            })
            
    else:
        #Recherche sans mot clé (récupère les posts les plus récents)
        for post in subreddit.search(query=" ",sort="relevance",limit=limit):
            sentiment = sentiment_pipeline(post.title.strip()[:500])[0] #Analyse du sentiment du titre
            
            sentiment_label = sentiment["label"]
            if sentiment_label == "LABEL_2":
                sentiment_text = "POSITIVE"
            elif sentiment_label == "LABEL_0":
                sentiment_text = "NEGATIVE"
            elif sentiment_label == "LABEL_1":
                sentiment_text = "NEUTRAL"
            else:
                sentiment_text = "NEUTRAL"
            
            posts.append({
                "title": post.title,
                "sentiment": sentiment_text,
                "score": sentiment["score"]
            })
    
    return posts

#Fonction pour récupérer et analyser les commentaires d'un post
def get_comments_for_post(post_title, subreddit_name):
    subreddit = reddit.subreddit(subreddit_name)
    comments_data = []
    
    for post in subreddit.search(post_title, sort="relevance", limit=1):
        post.comments.replace_more(limit=0)  # eviter les commentaires "chargement plus"
        comments = post.comments.list()[:15]  # Limiter à 15 commentaires
        
        for comment in comments:
            if len(comment.body) > 5:  # eviter les petits commentaires inutiles
                sentiment_result = sentiment_pipeline(comment.body.strip()[:500])[0]  # Analyse sentimentale
                
                # Convertir le label en texte lisible
                sentiment_label = sentiment_result["label"]
                if sentiment_label == "LABEL_2":
                    sentiment_text = "POSITIVE"
                elif sentiment_label == "LABEL_0":
                    sentiment_text = "NEGATIVE"
                elif sentiment_label == "LABEL_1":
                    sentiment_text = "NEUTRAL"
                else:
                    sentiment_text = "NEUTRAL"
                
                comments_data.append({
                    "text": comment.body,
                    "sentiment": sentiment_text,
                    "score": sentiment_result["score"]
                })
    
    return comments_data

#Route API pour recuperer les posts
@app.route('/api/posts', methods=['GET'])
def get_posts():
    subreddit = request.args.get('subreddit', 'worldnews')
    keyword = request.args.get('keyword', 'politics')
    limit = int(request.args.get('limit', 15))

    posts = get_reddit_posts(subreddit, keyword, limit)
    #calcul des stats
    stats = {
        "positive": sum(1 for post in posts if post["sentiment"] == "POSITIVE"),
        "negative": sum(1 for post in posts if post["sentiment"] == "NEGATIVE"),
        "neutral": sum(1 for post in posts if post["sentiment"] == "NEUTRAL"),
        "total": len(posts)
    }
    
    return jsonify({"posts": posts, "stats": stats})


#Nouvelle route API pour récupérer les commentaires d'un post
@app.route('/api/comments', methods=['GET'])
def get_comments():
    title = request.args.get('title', '')
    subreddit = request.args.get('subreddit', 'worldnews')

    if not title:
        return jsonify({"error": "Titre du post manquant"}), 400

    comments = get_comments_for_post(title, subreddit)
    #calcul des stats pour les commentaires
    stats = {
        "positive": sum(1 for comment in comments if comment["sentiment"] == "POSITIVE"),
        "negative": sum(1 for comment in comments if comment["sentiment"] == "NEGATIVE"),
        "neutral": sum(1 for comment in comments if comment["sentiment"] == "NEUTRAL"),
        "total": len(comments)
    }
    
    return jsonify({"comments": comments, "stats": stats})

if __name__ == '__main__':
    app.run(debug=True)
 