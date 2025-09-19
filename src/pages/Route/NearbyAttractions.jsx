import React from "react";

export default function NearbyAttractions({ attractions, budget = 5000 }) {
  // Test API key availability
  React.useEffect(() => {
    console.log('Google Maps API Key available:', !!process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
    console.log('API Key (first 10 chars):', process.env.REACT_APP_GOOGLE_MAPS_API_KEY?.substring(0, 10));
  }, []);
  // Function to get real place photos from Google Places API
  const getPlacePhoto = (place) => {
    // Debug log to check if photos are available
    console.log('Place data:', place.name);
    console.log('Photos available:', place.photos?.length || 0);
    
    // If place has photos from Google Places API
    if (place.photos && place.photos.length > 0) {
      const photoReference = place.photos[0].photo_reference;
      // Use backend proxy to avoid CORS issues - adjust path based on your server setup
      const photoUrl = `${process.env.REACT_APP_API_BASE_URL}/../backend-photo-proxy.php?photo_reference=${photoReference}&maxwidth=600&maxheight=400`;
      console.log('Generated proxy photo URL for:', place.name);
      return photoUrl;
    }
    
    console.log('No Google photos, using fallback for:', place.name);
    // Fallback to local images if no Google photo available
    return getLocalPlaceImage(place.name, place.types ? place.types.join(' ') : place.type || '');
  };

  // Fallback function for local images
  const getLocalPlaceImage = (placeName, placeType) => {
    // Map common place names/types to available images
    const imageMap = {
      'sigiriya': '/images/sigiriya.jpg',
      'kandy': '/images/dalada-maligawa.jpg', 
      'ella': '/images/ella.jpeg',
      'anuradhapura': '/images/anuradhapura.jpg',
      'yala': '/images/yala.jpg',
      'mirissa': '/images/mirissa.jpg',
      'galle': '/images/dutch.jpg',
      'colombo': '/images/colombo_food.jpg',
      'temple': '/images/temple.jpeg',
      'cultural': '/images/culture.png',
      'food': '/images/rice-curry.jpg',
      'beach': '/images/mirissa.jpg',
      'wildlife': '/images/yala.jpg',
      'historical': '/images/sigiriya.jpg',
      'mountain': '/images/ella.jpeg',
      'art': '/images/art.jpg',
      'garden': '/images/garden.jpg',
      'market': '/images/market.jpg',
      'festival': '/images/esala-perahera.jpg'
    };

    // Try to find matching image by place name
    const placeLower = placeName.toLowerCase();
    for (const [key, image] of Object.entries(imageMap)) {
      if (placeLower.includes(key)) {
        return image;
      }
    }

    // Default images by type
    const typeLower = placeType.toLowerCase();
    if (typeLower.includes('temple') || typeLower.includes('church') || typeLower.includes('mosque') || typeLower.includes('hindu_temple')) 
      return '/images/temple.jpeg';
    if (typeLower.includes('beach')) return '/images/mirissa.jpg';
    if (typeLower.includes('park') || typeLower.includes('zoo')) return '/images/yala.jpg';
    if (typeLower.includes('museum') || typeLower.includes('art_gallery')) return '/images/art.jpg';
    if (typeLower.includes('food') || typeLower.includes('restaurant')) return '/images/rice-curry.jpg';
    if (typeLower.includes('tourist_attraction')) return '/images/sigiriya.jpg';
    if (typeLower.includes('university') || typeLower.includes('library')) return '/images/garden.jpg';
    
    return '/images/culture.png'; // Default fallback
  };

  const generateRating = (place) => {
    // Use real Google rating if available, otherwise generate random
    if (place.rating) {
      return place.rating.toFixed(1);
    }
    return (Math.random() * 2 + 3).toFixed(1); // Random rating between 3.0-5.0
  };

  const getRatingColor = (rating) => {
    const numRating = parseFloat(rating);
    if (numRating >= 4.5) return '#FFD700'; // Gold for excellent
    if (numRating >= 4.0) return '#32CD32'; // Green for very good  
    if (numRating >= 3.5) return '#FFA500'; // Orange for good
    return '#87CEEB'; // Light blue for okay
  };

  const getRatingIcon = (rating) => {
    const numRating = parseFloat(rating);
    if (numRating >= 4.5) return '🌟'; // Star for excellent
    if (numRating >= 4.0) return '⭐'; // Regular star for very good
    return '⭐'; // Regular star for others
  };

  const generatePrice = (budget) => {
    if (budget <= 5000) return `Rs. ${Math.floor(Math.random() * 1000 + 500)}`;
    if (budget <= 10000) return `Rs. ${Math.floor(Math.random() * 2000 + 1000)}`;
    return `Rs. ${Math.floor(Math.random() * 3000 + 2000)}`;
  };

  return (
    <div className="nearby-attractions">
      <h2 className="attractions-title">Recommended Places</h2>
      {attractions.length === 0 ? (
        <div className="no-attractions">
          <div className="no-attractions-icon">📍</div>
          <p className="no-attractions-text">
            No attractions yet — enter a starting point & select a package!
          </p>
        </div>
      ) : (
        <div className="attractions-grid">
          {attractions
            .sort((a, b) => (b.rating || 0) - (a.rating || 0)) // Sort by rating (highest first)
            .map((place, index) => (
            <div key={index} className="place-card">
              <div className="place-image-container">
                <img 
                  src={getPlacePhoto(place)} 
                  alt={place.name}
                  className="place-image"
                  onError={(e) => {
                    console.log('Image failed to load:', e.target.src);
                    console.log('Trying fallback for place:', place.name);
                    
                    // First try: local fallback based on place name/type
                    const fallbackSrc = getLocalPlaceImage(place.name, place.types ? place.types.join(' ') : place.type || '');
                    
                    if (e.target.src !== fallbackSrc && !e.target.src.includes(fallbackSrc)) {
                      console.log('Switching to fallback:', fallbackSrc);
                      e.target.src = fallbackSrc;
                      return;
                    }
                    
                    // Second try: default culture image
                    if (!e.target.src.includes('culture.png')) {
                      console.log('Using default culture image');
                      e.target.src = '/images/culture.png';
                      return;
                    }
                    
                    // Last resort: basic placeholder
                    console.log('All images failed, using placeholder');
                    e.target.style.display = 'none';
                    e.target.parentElement.style.backgroundColor = '#f0f0f0';
                    e.target.parentElement.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:200px;color:#666;font-size:2rem;">📍</div>`;
                  }}
                  onLoad={(e) => {
                    console.log('Image loaded successfully for:', place.name);
                  }}
                />
                <div className="place-rating" style={{ backgroundColor: `${getRatingColor(generateRating(place))}20`, border: `1px solid ${getRatingColor(generateRating(place))}` }}>
                  <span className="rating-star">{getRatingIcon(generateRating(place))}</span>
                  <span className="rating-number" style={{ color: getRatingColor(generateRating(place)) }}>
                    {generateRating(place)}
                  </span>
                </div>
              </div>
              
              <div className="place-content">
                <h3 className="place-name">{place.name}</h3>
                <p className="place-type">{place.types ? place.types[0].replace(/_/g, ' ') : place.type}</p>
                <p className="place-address">{place.vicinity || place.address}</p>
                
                <div className="place-footer">
                  <div className="place-price">
                    {generatePrice(budget)}
                  </div>
                  <button className="explore-btn">
                    Explore
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}