// LocalGuidesSection.jsx
import React from "react";
import "./LocalGuidesSection.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiMethods } from "../../utils/api-client";

const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`star ${i < rating ? "filled" : ""}`}>
      ★
    </span>
  ));
};

export default function LocalGuidesSection({ onGuideSelect }) {
  const navigate = useNavigate();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get trip dates from localStorage
  const tripDatesStr = localStorage.getItem('tripDates');
  let tripDates = null;
  if (tripDatesStr) {
    try {
      tripDates = JSON.parse(tripDatesStr);
    } catch (error) {
      console.log('Error parsing trip dates');
    }
  }

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        console.log("🚀 Attempting to fetch guides from API...");
        console.log("API Base URL:", apiMethods.getBackendUrl());
        console.log("Full URL:", `${apiMethods.getBackendUrl()}/guides`);
        
        // Test direct fetch first - try the existing available endpoint
        const directUrl = `${apiMethods.getBackendUrl()}/guides/available`;
        console.log("🔍 Testing direct fetch to existing endpoint:", directUrl);
        
        const directResponse = await fetch(directUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        console.log("📊 Direct fetch response status:", directResponse.status);
        console.log("📊 Direct fetch response headers:", directResponse.headers);
        
        if (directResponse.ok) {
          const directData = await directResponse.json();
          console.log("📊 Direct fetch response data:", directData);
          console.log("📊 Direct data type:", typeof directData);
          console.log("📊 Direct data keys:", Object.keys(directData || {}));
        } else {
          console.log("❌ Direct fetch failed with status:", directResponse.status);
          const errorText = await directResponse.text();
          console.log("❌ Direct fetch error text:", errorText);
        }
        
        // Now try with the API client - use existing available endpoint
        const response = await apiMethods.authenticatedRequest("/guides/available", null, "GET");
        console.log("📊 API Client Response:", response);
        console.log("📊 Response type:", typeof response);
        console.log("📊 Response.data:", response.data);
        console.log("📊 Response.data type:", typeof response.data);
        
        // Handle different response structures
        let guideData = [];
        if (response && response.data) {
          console.log("📊 Processing response.data...");
          // Check for different response structures from backend
          if (Array.isArray(response.data.guides)) {
            console.log("📊 Found guides in response.data.guides");
            guideData = response.data.guides;
          } else if (Array.isArray(response.data.data)) {
            console.log("📊 Found guides in response.data.data");
            guideData = response.data.data;
          } else if (Array.isArray(response.data)) {
            console.log("📊 Found guides in response.data directly");
            guideData = response.data;
          } else {
            console.log("📊 Response.data is not an array:", response.data);
          }
        } else if (response && Array.isArray(response.guides)) {
          console.log("📊 Found guides in response.guides directly");
          guideData = response.guides;
        } else if (Array.isArray(response)) {
          console.log("📊 Response is directly an array");
          guideData = response;
        } else {
          console.log("📊 Unexpected response structure:", response);
        }
        
        console.log("✅ Processed guides data:", guideData);
        console.log("✅ Guide data length:", guideData.length);
        console.log("✅ Guide data type:", typeof guideData);
        console.log("✅ Is guide data array?", Array.isArray(guideData));
        
        // Fetch ratings for each guide before setting the data
        if (Array.isArray(guideData) && guideData.length > 0) {
          console.log("🔄 Fetching ratings for guides...");
          
          const guidesWithRatings = await Promise.all(
            guideData.map(async (guide) => {
              try {
                const ratingResponse = await apiMethods.authenticatedRequest(
                  `/reviews.php?type=guide&user_id=${guide.user_id || guide.id}`,
                  null,
                  "GET"
                );
                
                if (ratingResponse && ratingResponse.data) {
                  const avgRating = parseFloat(ratingResponse.data.average_rating || 0);
                  const totalReviews = parseInt(ratingResponse.data.total_reviews || 0);
                  return {
                    ...guide,
                    rating: avgRating > 0 ? avgRating : null,
                    totalReviews: totalReviews
                  };
                }
              } catch (error) {
                console.log(`❌ Failed to fetch rating for guide ${guide.name}:`, error);
              }
              
              return {
                ...guide,
                rating: null,
                totalReviews: 0
              };
            })
          );
          
          console.log("✅ Guides with ratings:", guidesWithRatings);
          setGuides(guidesWithRatings);
        } else {
          // Always set the guides data, even if empty, for debugging
          setGuides(guideData);
        }
        
        if (guideData.length === 0) {
          console.log("⚠️ No guides found - checking if API returned empty array or no data");
          console.log("⚠️ Original response:", response);
          setError("No guides available at the moment - check console for API details");
        }
        
      } catch (err) {
        console.error("❌ Error fetching guides from API:", err);
        setGuides([]);
        setError("Failed to load guides. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch real guides from database
    fetchGuides();
  }, []);

  // Helper function to check if a guide is available - check database status
  const isGuideAvailable = (guide) => {
    // Debug: Log each guide's status
    console.log(`Guide ${guide.name || guide.user_name} status:`, guide.status);
    console.log("Full guide object:", guide);
    
    // Since we're using /guides/available endpoint, all returned guides should be shown
    // The backend already filtered for available guides
    return true;
  };
  
  // Filter guides based on availability only (ignore date filtering)
  const availableGuides = Array.isArray(guides) ? guides.filter(isGuideAvailable) : [];
  
  // Add debug logging
  console.log("Total guides fetched:", guides);
  console.log("Available guides after filtering:", availableGuides);
  console.log("Trip dates:", tripDates);
  
  if (loading) return <div>Loading guides...</div>;
  if (error) return <div style={{padding: '20px', color: 'red'}}>{error}</div>;
  
  // Show message if no guides available
  if (availableGuides.length === 0) {
    return (
      <section className="guides-section">
        <h2>MEET YOUR LOCAL GUIDES</h2>
        <p className="subtitle">
          {Array.isArray(guides) && guides.length > 0 
            ? `Found ${guides.length} guides, but none are available for the selected dates.`
            : "No guides found in the database."
          }
        </p>
        <div style={{marginTop: '10px', fontSize: '14px', color: '#666'}}>
          <p>Debug info:</p>
          <p>Total guides: {Array.isArray(guides) ? guides.length : 'Not an array'}</p>
          <p>Trip dates: {tripDates ? `${tripDates.fromDate} to ${tripDates.toDate}` : 'None selected'}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="guides-section">
      <h2>MEET YOUR LOCAL GUIDES</h2>
      <p className="subtitle">
        Expert local guides ready to unlock the hidden gems of Sri Lanka!
        {tripDates && tripDates.fromDate && tripDates.toDate && 
          ` Available for your trip from ${new Date(tripDates.fromDate).toLocaleDateString()} to ${new Date(tripDates.toDate).toLocaleDateString()}.`
        }
      </p>
      <div className="cards">
        {availableGuides.map((guide) => (
          <article key={guide.id} className="guide-card">
            <div className="image-container">
              <img 
                src={guide.photo_url || guide.image || 'https://via.placeholder.com/150x150/28A745/FFFFFF?text=Guide'} 
                alt={guide.name} 
                className="guide-image" 
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150x150/28A745/FFFFFF?text=Guide';
                }}
              />
              <span className="price-badge">{guide.status || guide.availability || 'Available'}</span>
              {guide.verified && <span className="badge verified">Verified</span>}
              {guide.recommended && <span className="badge recommended">Recommended</span>}
            </div>
            <div className="card-body">
              <h3>{guide.name}</h3>
              <ul className="guide-info">
                <li>🌍 {guide.specialization || guide.languages || 'Specialization'}</li>
                <li>📍 {guide.location || 'Location Info'}</li>
                <li>✅ {guide.languages || 'Languages'}</li>
              </ul>
              <div className="rating">
                {renderStars(guide.rating ? Math.round(guide.rating) : 0)}
                <span className="rating-text">
                  ({guide.rating ? guide.rating.toFixed(1) : '0.0'}/5)
                  {guide.totalReviews > 0 && ` • ${guide.totalReviews} reviews`}
                </span>
              </div>
              <div className="experience">
                <span>Experience: {guide.experience || '5+'} years</span>
              </div>
              <button 
                className="book-now-btn"
                onClick={() => {
                  if (onGuideSelect) {
                    // Pass the selected guide data to parent for modal
                    // Use user_id for backend validation, keep guide.id as fallback
                    onGuideSelect({
                      id: guide.id, // This is user_id from the API
                      user_id: guide.user_id, // Explicitly include user_id  
                      guide_table_id: guide.guide_table_id, // Use the correct guide_table_id from API
                      name: guide.name,
                      specialization: guide.specialization || guide.languages,
                      languages: guide.languages || 'English',
                      location: guide.location,
                      rating: guide.rating || 0,
                      totalReviews: guide.totalReviews || 0,
                      phone: guide.phone,
                      photo_url: guide.photo_url,
                      experience: guide.experience || '5+'
                    });
                  }
                }}
              >
                Book Now
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
