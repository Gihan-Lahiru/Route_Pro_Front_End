"use client"

import { useState, useRef } from "react"
import { MapPin, Plus, ChevronDown, MoreHorizontal, Square, List, ChevronLeft, Search } from "lucide-react"
import "./PlacesSelector.css";

const PlacesSelector = ({ nearbyPlaces = [], setNearbyPlaces }) => {
  const [selectedPlaces, setSelectedPlaces] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isRecommendedOpen, setIsRecommendedOpen] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const scrollRef = useRef(null)

  // Debug logging
  console.log('🎪 PlacesSelector rendered with nearbyPlaces:', nearbyPlaces);
  console.log('📊 nearbyPlaces length:', nearbyPlaces?.length);
  console.log('🔍 nearbyPlaces type:', typeof nearbyPlaces);

  // Default places to show when nearbyPlaces is empty
  const defaultPlaces = [
    {
      name: "Sigiriya Rock",
      photos: null,
    },
    {
      name: "Temple of Tooth",
      photos: null,
    },
    {
      name: "Ella Rock",
      photos: null,
    },
    {
      name: "Nine Arch Bridge",
      photos: null,
    },
  ]

  // Use nearbyPlaces if available, otherwise use default places
  const placesToShow = nearbyPlaces && nearbyPlaces.length > 0 ? nearbyPlaces : defaultPlaces
  
  console.log('📋 Final placesToShow:', placesToShow.map(p => p.name));
  console.log('🎯 Using dynamic places:', nearbyPlaces && nearbyPlaces.length > 0);
  console.log('🔍 nearbyPlaces array:', nearbyPlaces);

  // Show a warning if we're still using default places
  if (!nearbyPlaces || nearbyPlaces.length === 0) {
    console.warn('⚠️ PlacesSelector: Still using default places. nearbyPlaces not populated.');
  }

  // Mock Places API search function with images
  const searchPlaces = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock API response with realistic image URLs
      const mockResults = [
        {
          id: Date.now() + 1,
          name: `${query} Beach`,
          image: `https://picsum.photos/200/120?random=${Date.now() + 1}`,
          description: "Beautiful beach location",
        },
        {
          id: Date.now() + 2,
          name: `${query} Temple`,
          image: `https://picsum.photos/200/120?random=${Date.now() + 2}`,
          description: "Historic temple site",
        },
        {
          id: Date.now() + 3,
          name: `${query} Park`,
          image: `https://picsum.photos/200/120?random=${Date.now() + 3}`,
          description: "Natural park area",
        },
      ]

      setSearchResults(mockResults)
    } catch (error) {
      console.error("Error fetching places:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    searchPlaces(value)
  }

  const addPlace = (place) => {
    if (!selectedPlaces.find((p) => p.id === place.id)) {
      const newPlace = {
        ...place,
        notes: "Add notes, links, etc. here",
      }
      setSelectedPlaces([...selectedPlaces, newPlace])
    }
    setSearchQuery("")
    setSearchResults([])
  }

  const removePlace = (placeId) => {
    setSelectedPlaces(selectedPlaces.filter((p) => p.id !== placeId))
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  return (
    <div className="places-selector">
      {/* Header */}
      <div className="places-header">
        <div className="places-title">
          <ChevronDown className="chevron-icon" />
          <h2>Places to visit</h2>
        </div>
        <MoreHorizontal className="more-icon" />
      </div>

      {/* Selected Places */}
      {selectedPlaces.map((place, index) => (
        <div key={place.id} className="selected-place-card">
          <div className="place-content">
            <div className="place-info">
              <div className="place-header-info">
                <div className="place-number">{index + 1}</div>
                <h3 className="place-name">{place.name}</h3>
                <button onClick={() => removePlace(place.id)} className="remove-button">
                  ×
                </button>
              </div>
              <p className="place-notes">{place.notes}</p>
            </div>
            <div className="place-image-container">
              <img src={place.image || "/placeholder.svg"} alt={place.name} className="place-image" />
            </div>
          </div>
        </div>
      ))}

      {/* Add a place section */}
      <div className="add-place-section">
        <div className="add-place-container">
          <MapPin className="map-pin-icon" />
          <div className="search-container">
            <input
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Add a place"
              className="search-input"
            />
            {isSearching && (
              <div className="search-loading">
                <div>Searching...</div>
              </div>
            )}
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((result) => (
                  <div key={result.id} onClick={() => addPlace(result)} className="search-result-item">
                    <img src={result.image || "/placeholder.svg"} alt={result.name} className="result-image" />
                    <span className="result-name">{result.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="action-buttons">
            <button className="action-button">
              <Square className="action-icon" />
            </button>
            <button className="action-button">
              <List className="action-icon" />
            </button>
          </div>
        </div>
      </div>

      {/* Recommended places */}
      <div className="recommended-section">
        <div className="recommended-header">
          <button onClick={() => setIsRecommendedOpen(!isRecommendedOpen)} className="recommended-toggle">
            <ChevronDown className={`chevron-icon ${!isRecommendedOpen ? "rotated" : ""}`} />
            <span>{nearbyPlaces && nearbyPlaces.length > 0 ? "🏛️ Places to Visit Along Your Route" : "Recommended places"}</span>
          </button>
          
          {/* Debug info for troubleshooting */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>
              Debug: {nearbyPlaces?.length || 0} dynamic places | Using: {nearbyPlaces && nearbyPlaces.length > 0 ? 'Dynamic' : 'Default'}
              <br />
              <button 
                onClick={() => {
                  console.log('🧪 Testing manual setNearbyPlaces');
                  const testPlaces = [
                    { name: 'Test Place 1', vicinity: 'Test Location', rating: 4.5, place_id: 'test1' },
                    { name: 'Test Place 2', vicinity: 'Test Location', rating: 4.2, place_id: 'test2' }
                  ];
                  setNearbyPlaces(testPlaces);
                }}
                style={{ 
                  fontSize: '10px', 
                  padding: '2px 6px', 
                  marginTop: '3px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                🧪 Test Set Places
              </button>
              <button 
                onClick={() => {
                  if (window.testGooglePlaces) {
                    console.log('🧪 Calling manual Google Places test');
                    window.testGooglePlaces();
                  } else {
                    console.log('🧪 testGooglePlaces not available');
                  }
                }}
                style={{ 
                  fontSize: '10px', 
                  padding: '2px 6px', 
                  marginTop: '3px',
                  marginLeft: '5px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                🧪 Test Google API
              </button>
            </div>
          )}
        </div>

        {isRecommendedOpen && (
          <div className="recommended-content">
            {nearbyPlaces && nearbyPlaces.length > 0 && (
              <div className="attraction-info" style={{ 
                padding: '12px', 
                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', 
                borderRadius: '8px', 
                margin: '8px 0 16px 0',
                border: '1px solid rgba(14, 165, 233, 0.2)',
                fontSize: '14px',
                color: '#0c4a6e'
              }}>
                ✨ Found {nearbyPlaces.length} attractions near your route! Click on any place to add it to your itinerary.
              </div>
            )}
            <div className="explore-container">
              <button onClick={scrollLeft} className="scroll-button">
                <ChevronLeft className="scroll-icon" />
              </button>

              <div className="explore-info">
                <MapPin className="explore-pin" />
                <span>{nearbyPlaces && nearbyPlaces.length > 0 ? "Places along your route" : "Explore more"}</span>
              </div>

              <div ref={scrollRef} className="places-scroll">
                {placesToShow.map((place, index) => {
                  // Handle both default places and Google Maps places
                  const placeId = place.place_id || place.id || `place_${index}`;
                  const placeName = place.name || 'Unnamed Place';
                  
                  // Debug each place
                  console.log('🎪 Rendering place:', { name: placeName, id: placeId, photos: place.photos });
                  
                  return (
                    <div key={placeId} className="place-thumbnail">
                      <div
                        onClick={() =>
                          addPlace({
                            id: Date.now() + index,
                            name: placeName,
                            image:
                              place.photos && place.photos[0]
                                ? (place.photos[0].getUrl ? place.photos[0].getUrl() : 
                                   `https://picsum.photos/80/60?random=${index}`)
                                : `https://picsum.photos/80/60?random=${index}`,
                          })
                        }
                        className="thumbnail-container"
                      >
                        <img
                          src={
                            place.photos && place.photos[0]
                              ? (place.photos[0].getUrl ? place.photos[0].getUrl() : 
                                 `https://picsum.photos/80/60?random=${index}`)
                              : `https://picsum.photos/80/60?random=${index}`
                          }
                          alt={placeName}
                          className="thumbnail-image"
                          onError={(e) => {
                            console.log('🖼️ Image load error for', placeName, 'falling back to placeholder');
                            e.target.src = `https://picsum.photos/80/60?random=${index}`;
                          }}
                        />
                        <span className="thumbnail-label">{placeName}</span>
                        {place.rating && (
                          <div className="place-rating">
                            ⭐ {place.rating}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button onClick={scrollRight} className="scroll-button">
                <Search className="scroll-icon" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlacesSelector
