import { useState, useEffect } from 'react';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';
import './App.css'; 

function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(''); 
  const [activeCategory, setActiveCategory] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  
  // Lightbox States
  const [lightboxImg, setLightboxImg] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Favorites State (LocalStorage se load hoga)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('reactGalleryFavs');
    return saved ? JSON.parse(saved) : [];
  });

  const { ref, inView } = useInView({ threshold: 1.0 });

  // ⚠️ Apni Unsplash Access Key yahan dalein
  const UNSPLASH_API_KEY = '2FVi9ANWIcSQOGVNCMB1ENe1FEd-O67dwqMO9Dhe0ns';

  const fetchImages = async (reset = false) => {
    // Agar favorites tab active hai toh API call nahi karni
    if (activeCategory === 'favorites') return;

    setLoading(true);
    try {
      // Agar activeCategory 'all' nahi hai aur query khali hai, toh category ko hi query bana do
      const searchQuery = query || (activeCategory !== 'all' ? activeCategory : '');
      
      const url = searchQuery 
        ? `https://api.unsplash.com/search/photos` 
        : `https://api.unsplash.com/photos`;

      const currentPage = reset ? 1 : page;

      const response = await axios.get(url, {
        params: {
          client_id: UNSPLASH_API_KEY,
          page: currentPage,
          per_page: 12,
          query: searchQuery
        },
      });
      
      const fetchedImages = searchQuery ? response.data.results : response.data;

      if (currentPage === 1) {
        setImages(fetchedImages);
      } else {
        setImages((prev) => [...prev, ...fetchedImages]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  // Jab bhi page change ho, images fetch karo
  useEffect(() => {
    if (page > 1) fetchImages();
  }, [page]);

  // Jab bhi category change ho, reset karo aur fetch karo
  useEffect(() => {
    setPage(1);
    if (activeCategory === 'favorites') {
      setImages(favorites);
    } else {
      fetchImages(true);
    }
  }, [activeCategory]);

  // Infinite Scroll Trigger
  useEffect(() => {
    if (inView && !loading && activeCategory !== 'favorites') {
      setPage((prev) => prev + 1);
    }
  }, [inView, loading, activeCategory]);

  // Search Submit
  const handleSearch = (e) => {
    e.preventDefault();
    setActiveCategory('custom'); // Category buttons se active state hata do
    setPage(1);
    fetchImages(true);
  };

  // Toggle Favorite Logic
  const toggleFavorite = (e, image) => {
    e.stopPropagation(); // Lightbox ko open hone se rokne ke liye
    let updatedFavs = [...favorites];
    const isFav = favorites.some(fav => fav.id === image.id);

    if (isFav) {
      updatedFavs = favorites.filter(fav => fav.id !== image.id);
    } else {
      updatedFavs.push(image);
    }

    setFavorites(updatedFavs);
    localStorage.setItem('reactGalleryFavs', JSON.stringify(updatedFavs));

    // Agar favorites tab par hain toh screen se fauran remove karo
    if (activeCategory === 'favorites') {
      setImages(updatedFavs);
    }
  };

  // Lightbox Navigation
  const openLightbox = (image, index) => {
    setLightboxImg(image.urls.regular);
    setLightboxIndex(index);
  };

  const changeLightboxImage = (step) => {
    const newIndex = lightboxIndex + step;
    if (newIndex >= 0 && newIndex < images.length) {
      setLightboxImg(images[newIndex].urls.regular);
      setLightboxIndex(newIndex);
    }
  };

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      
      {/* Header & Controls Section (Aapke UI design jaisa) */}
      <header className="header">
        <div className="top-bar">
          <form onSubmit={handleSearch} className="search-form">
            <input 
              type="text" 
              placeholder="Search by name (e.g., Nature, City)..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="category-filters">
          {['all', 'nature', 'city', 'tech'].map((cat) => (
            <button 
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => { setQuery(''); setActiveCategory(cat); }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
          <button 
            className={`filter-btn ${activeCategory === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveCategory('favorites')}
          >
            ❤️ Favorites
          </button>
        </div>
      </header>

      {/* Main Gallery Grid */}
      <main className="gallery-grid">
        {images.map((image, index) => {
          const isFav = favorites.some(fav => fav.id === image.id);
          return (
            <div className="image-card" key={`${image.id}-${index}`} onClick={() => openLightbox(image, index)}>
              <img src={image.urls.regular} alt={image.alt_description} loading="lazy" />
              
              {/* Heart Overlay (🤍 / ❤️) */}
              <span className={`heart-icon ${isFav ? 'liked' : ''}`} onClick={(e) => toggleFavorite(e, image)}>
                {isFav ? '❤️' : '🤍'}
              </span>

              <div className="overlay">
                <p>📸 {image.user.name}</p>
              </div>
            </div>
          );
        })}
      </main>

      {/* Empty State for Favorites */}
      {activeCategory === 'favorites' && images.length === 0 && (
        <div className="empty-state">Aapne abhi tak koi image pasand nahi ki! 🤍</div>
      )}

      {/* Infinite Scroll Loader */}
      {activeCategory !== 'favorites' && (
        <div ref={ref} className="loader-container">
          {loading && <p>Loading more amazing images... 🚀</p>}
        </div>
      )}

      {/* Lightbox / Fullscreen Modal */}
      {lightboxImg && (
        <div className="lightbox-modal">
          <span className="close-btn" onClick={() => setLightboxImg(null)}>X</span>
          <span className="nav-btn prev" onClick={() => changeLightboxImage(-1)}>&#10094;</span>
          <img src={lightboxImg} alt="Fullscreen View" />
          <span className="nav-btn next" onClick={() => changeLightboxImage(1)}>&#10095;</span>
        </div>
      )}

    </div>
  );
}

export default App;