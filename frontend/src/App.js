import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import logo from "./logo_reduit.png";

function App() {
  const [subreddit, setSubreddit] = useState("worldnews");
  const [keyword, setKeyword] = useState("");
  const [showkeyword, setShowKeyword] = useState(false);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]); 
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPosts, setShowPosts] = useState(false); //Pour l'affichage des posts
  const [stats, setStats] = useState({ positive: 0, negative: 0, neutral: 0, total: 0 });

  const [postsStats, setPostsStats] = useState({ positive: 0, negative: 0, neutral: 0, total: 0 });
  const [commentsStats, setCommentsStats] = useState({ positive: 0, negative: 0, neutral: 0, total: 0 });


  //Pour reccuoerer les posts du subreddit
  const fetchPosts = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/posts`, {
        params: { subreddit, keyword, limit: 15 },
      });
      setPosts(response.data.posts);
      setPostsStats(response.data.stats); //stocke les stats des posts séparément
      setStats(response.data.stats);
      setComments([]);
      setSelectedPost(null);
      setShowPosts(true); //Afficher les posts lors d'une nouvelle recherche
    } catch (error) {
      console.error("Erreur lors de la récupération des posts", error);
    }
  };

  //Rrécupère les commentaires d'un post sélectionné
  const fetchComments = async (title) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/comments`, {
        params: { title, subreddit },
      });
      setComments(response.data.comments); //on reccupere les comments
      setCommentsStats(response.data.stats); //permet de stocker les stats des commentaire
      setStats(response.data.stats);  //servira a afficher les stats 

      setSelectedPost(title);
      setShowPosts(false); //Masquer les posts et afficher les commentaires
    } catch (error) {
      console.error("Erreur lors de la récupération des commentaires", error);
    }
  };



  const classSentiment = (sentiment) => {
    switch (sentiment) {
      case "POSITIVE":
        return "positive";
      case "NEGATIVE":
        return "negative";
      default:
        return "neutral";
    }
  };

  return (
    
    <div className="container">
      <img src={logo} width="400" height="200" alt="Logo" />
      <h1>Analyse de Sentiment Reddit</h1>

      {/* Formulaire de recherche */}
      <form onSubmit={fetchPosts} className="search-bar">
        <input
          type="search"
          placeholder="  Subreddit"
          onChange={(e) => {
            setSubreddit(e.target.value);
            //Si le champ est vide on réinitialise les états
            if (e.target.value === "") {
              setShowKeyword(false);
              setShowPosts(false);
              setSelectedPost(false);
              setKeyword("");
            }
          }}
          required
        />
        <button type="submit" onClick={() => setShowKeyword(true)} className="search-btn"  ></button>
      </form>

      {showkeyword &&
        <div className="zoneMotCle">
          <label>Mot-clé :</label>
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        </div>
      }
      
     
      
      {/* Affichage des posts seulement si showPosts est vrai */}
      {showPosts && (
        <>
          <br></br>
          <br></br>
          <div className="containerRepartitionSentiment">
            <h2>Subreddits Recherchés  </h2>

            {stats.total > 0 && (
              <div className="zoneBarreStat">
                <h3>Répartition des sentiments</h3>
                <div className="miniBarre">
                  <div className="partie_BarreSentiment positive_bar" style={{ width: `${(stats.positive / stats.total) * 100}%` }}></div>
                  <div className="partie_BarreSentiment neutral_bar" style={{ width: `${(stats.neutral / stats.total) * 100}%` }}></div>
                  <div className="partie_BarreSentiment negative_bar" style={{ width: `${(stats.negative / stats.total) * 100}%` }}></div>
                </div>
                <div className="legendeBarre">
                  <span style={{ color: '#4CAF50' }}>Positive: {stats.positive}</span>
                  <span style={{ color: '#F44336' }}>Negative: {stats.negative}</span>
                  <span style={{ color: '#9E9E9E' }}>Neutral: {stats.neutral}</span>
                </div>
              </div>
            )}
          </div>

          <div className="results">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <button
                  key={index}
                  className={`zonePosts ${classSentiment(post.sentiment)}`}
                  onClick={() => fetchComments(post.title)}
                >
                  <div className="zonePostsBadge">
                    <span className="sentimentBadge">{post.sentiment}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p><b>Score:</b> <i>{post.score.toFixed(2)}</i></p>
                </button>
              ))
            ) : (
              <p>Aucun Subreddit trouvé.</p>
            )}
          </div>
        </>
      )}

      {/* Affichage des commentaires si un post est sélectionné */}
      {!showPosts && selectedPost && (
        <div>
          <br></br>
          <br></br>

          <button className="back-button" onClick={() => {
            setShowPosts(true);
            setStats(postsStats); // Restaure les stats des posts
          }}>
            🔙 Retour aux Subreddits Recherchés
          </button>

          <br></br>
          <br></br>

          <div className="containerRepartitionSentiment">
            <h2>Commentaires pour le Subreddit : {selectedPost}</h2>

            {stats.total > 0 && (
              <div className="zoneBarreStat">
                <h3>Répartition des sentiments</h3>
                <div className="miniBarre">
                  <div className="partie_BarreSentiment positive_bar" style={{ width: `${(stats.positive / stats.total) * 100}%` }}></div>
                  <div className="partie_BarreSentiment neutral_bar" style={{ width: `${(stats.neutral / stats.total) * 100}%` }}></div>
                  <div className="partie_BarreSentiment negative_bar" style={{ width: `${(stats.negative / stats.total) * 100}%` }}></div>
                </div>
                <div className="legendeBarre">
                  <span style={{ color: '#4CAF50' }}>Positive: {stats.positive}</span>
                  <span style={{ color: '#F44336' }}>Negative: {stats.negative}</span>
                  <span style={{ color: '#9E9E9E' }}>Neutral: {stats.neutral}</span>
                </div>
              </div>
            )}
          </div>

          <div className="comments">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className={`zoneCommentaire ${classSentiment(comment.sentiment)}`}>
                  <p>{comment.text}</p>
                  <p>
                    <b>Sentiment:  </b>
                    <b>  
                      <i style={{
                        color: comment.sentiment === "POSITIVE" ? "green" : 
                              comment.sentiment === "NEGATIVE" ? "red" : 
                              "gray"
                      }}>
                        { comment.sentiment}
                      </i>
                    </b>
                  </p>
                  <p><b>Score:  <i>{comment.score.toFixed(2)}</i></b></p>
                </div>
              ))
            ) : (
              <p>Aucun Commentaire trouvé.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
