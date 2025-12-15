import React, { useState } from "react";
import "./Cultural.css";

// All 24 districts (you can add more)
const allDistricts = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
  "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa",
  "Badulla", "Monaragala", "Ratnapura", "Kegalle"
];

// Example data structure — extend this!
const eventsData = {
  "Most Favorites": [
    {
      id: 1,
      title: "Kandy Esala Perahera",
      image: "/images/esala-perahera.jpg",
      month: "July - August",
      location: "Kandy",
      description: "A spectacular procession with elephants, dancers and fire shows."
    },
    {
      id: 2,
      title: "Sri Lankan Rice & Curry",
      image: "/images/rice-curry.jpg",
      month: "All Year",
      location: "Islandwide",
      description: "A classic Sri Lankan meal served with rice, lentils, curries and sambols."
    },
    {
      id: 3,
      title: "Colombo Street Food Festival",
      image: "/images/kottu-roti.jpg",
      month: "Every Month",
      location: "Colombo",
      description: "Taste authentic street food: kottu, hoppers and more."
    },
    {
      id: 4,
      title: "Galle Seafood Fiesta",
      image: "/images/galleseafood.jpg",
      month: "November",
      location: "Galle",
      description: "Enjoy fresh seafood and coastal cuisine."
    }
  ],
  Kandy: [
    {
      id: 1,
      title: "Kandy Esala Perahera",
      image: "/images/esala-perahera.jpg",
      month: "July - August",
      location: "Kandy City",
      description: "A historic Buddhist festival with majestic tuskers."
    },
    {
      id: 2,
      title: "Temple of the Tooth",
      image: "/images/dalada-maligawa.jpg",
      month: "All Year",
      location: "Kandy",
      description: "Visit the sacred temple where Buddha’s tooth relic is kept."
    },
    {
      id: 3,
      title: "Kandy Snacks",
      image: "/images/kandy_food.jpg",
      month: "All Year",
      location: "Kandy Markets",
      description: "Try local sweets like kavum, kokis and milk rice."
    },
    {
      id: 4,
      title: "Peradeniya Gardens",
      image: "/images/garden.jpg",
      month: "All Year",
      location: "Peradeniya",
      description: "A beautiful botanical garden with exotic plants."
    }
  ],
  Colombo: [
    {
      id: 1,
      title: "Navam Perahera",
      image: "/images/navam.jpg",
      month: "February",
      location: "Gangaramaya Temple",
      description: "A colorful night parade in Colombo."
    },
    {
      id: 2,
      title: "Colombo Street Food",
      image: "/images/colombo_food.jpg",
      month: "All Year",
      location: "Galle Face",
      description: "Sample kottu, isso wade, and ice cream by the ocean."
    },
    {
      id: 3,
      title: "Colombo Night Market",
      image: "/images/market.jpg",
      month: "Every Friday",
      location: "Colombo City",
      description: "Street food, music and local handicrafts."
    },
    {
      id: 4,
      title: "Dutch Hospital Dining",
      image: "/images/dutch.jpg",
      month: "All Year",
      location: "Fort, Colombo",
      description: "Trendy eateries in a colonial setting."
    }
  ],
  Ampara: [
    {
      id: 1,
      title: "Kiribath (Milk Rice)",
      image: "/images/milk rice.jpg",
      month: "All Year",
      location: "Ampara",
      description: "Traditional Sri Lankan milk rice, especially popular during celebrations."
    },
    {
      id: 2,
      title: "Ambul Thiyal Fish",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Ampara",
      description: "Sour fish curry cooked with kokum, a specialty of the region."
    },
    {
      id: 3,
      title: "Pol Sambol",
      image: "/images/pol roti.jpg",
      month: "All Year",
      location: "Ampara",
      description: "Spicy coconut relish served with rice and roti."
    },
    {
      id: 4,
      title: "Thai Pongal Festival",
      image: "/images/rice and curry.jpg",
      month: "January",
      location: "Ampara Tamil Communities",
      description: "Tamil harvest festival celebrating the rice harvest season."
    },
    {
      id: 5,
      title: "Vesak Festival",
      image: "/images/vesak-festival.jpg",
      month: "May",
      location: "Ampara",
      description: "Buddhist festival with colorful lanterns and pandals."
    },
    {
      id: 6,
      title: "Sinhala & Tamil New Year",
      image: "/images/rice and curry.jpg",
      month: "April",
      location: "Ampara",
      description: "Traditional New Year celebrations with cultural activities."
    }
  ],
  Anuradhapura: [
    {
      id: 1,
      title: "Freshwater Fish Curry",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Anuradhapura",
      description: "Traditional rice and curry with fresh tank fish."
    },
    {
      id: 2,
      title: "Hakuru Sweets",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Anuradhapura",
      description: "Handmade jaggery sweets and pancakes."
    },
    {
      id: 3,
      title: "Lunu Miris",
      image: "/images/pol roti.jpg",
      month: "All Year",
      location: "Anuradhapura",
      description: "Spicy onion and chili paste served with dhal."
    },
    {
      id: 4,
      title: "Poson Festival",
      image: "/images/vesak-festival.jpg",
      month: "June",
      location: "Anuradhapura",
      description: "Major Buddhist festival commemorating Buddhism's arrival in Sri Lanka."
    },
    {
      id: 5,
      title: "Ancient Stupa Festivals",
      image: "/images/anuradhapura.jpg",
      month: "Various",
      location: "Ancient City",
      description: "Temple festivals at historic Buddhist stupas."
    }
  ],
  Badulla: [
    {
      id: 1,
      title: "String Hoppers",
      image: "/images/hoppers.jpg",
      month: "All Year",
      location: "Badulla",
      description: "Hill-country short-eats with steamed rice noodles."
    },
    {
      id: 2,
      title: "Kithul Treacle Sweets",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Badulla",
      description: "Traditional sweets made from kithul palm treacle."
    },
    {
      id: 3,
      title: "Red Rice Chicken Curry",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Badulla",
      description: "Hill-country style chicken curry served with red rice."
    },
    {
      id: 4,
      title: "Kataragama Perahera",
      image: "/images/esala-perahera.jpg",
      month: "July-August",
      location: "Badulla Region",
      description: "Regional perahera visits and Hindu temple festivals."
    },
    {
      id: 5,
      title: "Estate Worker Festivals",
      image: "/images/rice and curry.jpg",
      month: "Various",
      location: "Tea Estates",
      description: "Cultural festivals in tea plantation communities."
    }
  ],
  Batticaloa: [
    {
      id: 1,
      title: "Isso Wade",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Batticaloa",
      description: "Crispy shrimp fritters with Malay-Tamil coastal influence."
    },
    {
      id: 2,
      title: "Crab Curry",
      image: "/images/seafood.jpg",
      month: "All Year",
      location: "Batticaloa Coast",
      description: "Rich crab curry with coconut and spices."
    },
    {
      id: 3,
      title: "Dosai & Idiyappam",
      image: "/images/hoppers.jpg",
      month: "All Year",
      location: "Batticaloa",
      description: "South Indian influenced breakfast items."
    },
    {
      id: 4,
      title: "Thai Pongal",
      image: "/images/rice and curry.jpg",
      month: "January",
      location: "Tamil Communities",
      description: "Tamil harvest festival with traditional foods."
    },
    {
      id: 5,
      title: "Muharram & Eid",
      image: "/images/rice and curry.jpg",
      month: "Various",
      location: "Muslim Communities",
      description: "Islamic festivals with community celebrations."
    }
  ],
  Galle: [
    {
      id: 1,
      title: "Isso Wade (Shrimp Fritters)",
      image: "/images/seafood.jpg",
      month: "All Year",
      location: "Galle",
      description: "Crispy shrimp fritters, a coastal specialty."
    },
    {
      id: 2,
      title: "Hoppers (Appa)",
      image: "/images/hoppers.jpg",
      month: "All Year",
      location: "Galle",
      description: "Bowl-shaped pancakes made from fermented rice batter."
    },
    {
      id: 3,
      title: "Seafood Kottu",
      image: "/images/kottu-roti.jpg",
      month: "All Year",
      location: "Galle",
      description: "Kottu prepared with fresh seafood from the coast."
    },
    {
      id: 4,
      title: "Devilled Prawns",
      image: "/images/seafood.jpg",
      month: "All Year",
      location: "Galle",
      description: "Spicy prawns stir-fried with onions and peppers."
    },
    {
      id: 5,
      title: "Galle Literary Festival",
      image: "/images/dutch.jpg",
      month: "January",
      location: "Galle Fort",
      description: "International literary festival in historic Galle Fort."
    },
    {
      id: 6,
      title: "Galle Seafood Fiesta",
      image: "/images/galleseafood.jpg",
      month: "November",
      location: "Galle",
      description: "Enjoy fresh seafood and coastal cuisine."
    }
  ],
  Gampaha: [
    {
      id: 1,
      title: "Coconut-based Curries",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Gampaha",
      description: "Traditional curries made with fresh coconut and red rice."
    },
    {
      id: 2,
      title: "Short-eats (Vada & Pastries)",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Gampaha",
      description: "Local snacks including vada and various pastries."
    },
    {
      id: 3,
      title: "Jaggery Sweets",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Gampaha",
      description: "Traditional sweets made from palm jaggery."
    },
    {
      id: 4,
      title: "Vesak Celebrations",
      image: "/images/vesak-festival.jpg",
      month: "May",
      location: "Gampaha",
      description: "Buddhist festival with elaborate lanterns and pandals."
    }
  ],
  Hambantota: [
    {
      id: 1,
      title: "Southern Seafood Curries",
      image: "/images/seafood.jpg",
      month: "All Year",
      location: "Hambantota",
      description: "Rich seafood curries in southern Sri Lankan style."
    },
    {
      id: 2,
      title: "Pol Sambol with Grilled Fish",
      image: "/images/pol roti.jpg",
      month: "All Year",
      location: "Hambantota Coast",
      description: "Spicy coconut relish served with freshly grilled fish."
    },
    {
      id: 3,
      title: "Kerala-influenced Prawn Dishes",
      image: "/images/seafood.jpg",
      month: "All Year",
      location: "Hambantota",
      description: "Prawn preparations with South Indian coastal influences."
    },
    {
      id: 4,
      title: "Kataragama Pilgrimage",
      image: "/images/esala-perahera.jpg",
      month: "July-August",
      location: "Regional",
      description: "Religious pilgrimage events in the region."
    }
  ],
  Jaffna: [
    {
      id: 1,
      title: "Jaffna Crab Curry",
      image: "/images/seafood.jpg",
      month: "All Year",
      location: "Jaffna",
      description: "Famous spicy crab curry with unique Jaffna spices."
    },
    {
      id: 2,
      title: "Achcharu (Pickles)",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Jaffna",
      description: "Traditional Tamil pickles made with various fruits and vegetables."
    },
    {
      id: 3,
      title: "Foxtail Millet Dishes",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Jaffna",
      description: "Nutritious millet-based traditional dishes."
    },
    {
      id: 4,
      title: "Nallur Festival",
      image: "/images/temple.jpeg",
      month: "August",
      location: "Nallur Kandaswamy Temple",
      description: "Major Hindu festival with elaborate temple ceremonies."
    },
    {
      id: 5,
      title: "Thai Pongal",
      image: "/images/rice and curry.jpg",
      month: "January",
      location: "Jaffna Tamil Communities",
      description: "Tamil harvest festival with traditional celebrations."
    }
  ],
  Kalutara: [
    {
      id: 1,
      title: "Southern Coastal Seafood",
      image: "/images/seafood.jpg",
      month: "All Year",
      location: "Kalutara Coast",
      description: "Fresh crab, prawns and fish from the southern coast."
    },
    {
      id: 2,
      title: "Coconut-roasted Snacks",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Kalutara",
      description: "Traditional snacks roasted with fresh coconut."
    },
    {
      id: 3,
      title: "Kalutara Duruthu Perahera",
      image: "/images/esala-perahera.jpg",
      month: "January",
      location: "Kalutara Temple",
      description: "Regional temple procession and cultural events."
    }
  ],
  Kegalle: [
    {
      id: 1,
      title: "River-fish Curries",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Kegalle",
      description: "Fresh river fish prepared with local spices."
    },
    {
      id: 2,
      title: "Cassava & Manioc Specialties",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Kegalle",
      description: "Traditional root vegetable dishes and curries."
    },
    {
      id: 3,
      title: "Rural Harvest Fairs",
      image: "/images/rice and curry.jpg",
      month: "Various",
      location: "Kegalle Villages",
      description: "Local agricultural fairs celebrating harvest seasons."
    }
  ],
  Kilinochchi: [
    {
      id: 1,
      title: "Tamil-influenced Fish Curries",
      image: "/images/seafood.jpg",
      month: "All Year",
      location: "Kilinochchi",
      description: "Fish and crab curries with Jaffna-Tamil influences."
    },
    {
      id: 2,
      title: "Dosai & Idiyappam",
      image: "/images/hoppers.jpg",
      month: "All Year",
      location: "Kilinochchi",
      description: "Traditional Tamil breakfast items."
    },
    {
      id: 3,
      title: "Hindu Temple Festivals",
      image: "/images/temple.jpeg",
      month: "Various",
      location: "Local Temples",
      description: "Hindu religious festivals and celebrations."
    }
  ],
  Kurunegala: [
    {
      id: 1,
      title: "Northern-interior Curries",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Kurunegala",
      description: "Fish and chicken curries from the northern interior region."
    },
    {
      id: 2,
      title: "Agricultural Fairs",
      image: "/images/rice and curry.jpg",
      month: "Various",
      location: "Kurunegala",
      description: "Local farming community celebrations and fairs."
    }
  ],
  Mannar: [
    {
      id: 1,
      title: "Coastal Lobster & Crab",
      image: "/images/seafood.jpg",
      month: "All Year",
      location: "Mannar Coast",
      description: "Fresh lobster and crab from Mannar's coastal waters."
    },
    {
      id: 2,
      title: "Toddy-infused Sweets",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Mannar",
      description: "Regional sweets made with palm toddy."
    },
    {
      id: 3,
      title: "St. Mary's Church Festivals",
      image: "/images/temple.jpeg",
      month: "Various",
      location: "Mannar",
      description: "Christian community festivals and celebrations."
    }
  ],
  Matale: [
    {
      id: 1,
      title: "Spiced Curries",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Matale",
      description: "Aromatic curries made with hill spices."
    },
    {
      id: 2,
      title: "Jackfruit Dishes",
      image: "/images/rice and curry.jpg",
      month: "Seasonal",
      location: "Matale",
      description: "Traditional jackfruit preparations and curries."
    },
    {
      id: 3,
      title: "Kithul Treacle Sweets",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Matale",
      description: "Sweet treats made with kithul palm treacle."
    },
    {
      id: 4,
      title: "Spice Market Events",
      image: "/images/market.jpg",
      month: "Various",
      location: "Matale",
      description: "Local spice market fairs and cultural events."
    }
  ],
  Matara: [
    {
      id: 1,
      title: "Southern Seafood Sambal",
      image: "/images/seafood.jpg",
      month: "All Year",
      location: "Matara",
      description: "Spicy fish sambal and fried fish preparations."
    },
    {
      id: 2,
      title: "Devilled Cuttlefish",
      image: "/images/seafood.jpg",
      month: "All Year",
      location: "Matara Coast",
      description: "Spicy cuttlefish and prawn preparations."
    },
    {
      id: 3,
      title: "Matara Peraheras",
      image: "/images/esala-perahera.jpg",
      month: "Various",
      location: "Local Temples",
      description: "Local temple processions and cultural events."
    }
  ],
  Monaragala: [
    {
      id: 1,
      title: "Rural Rice & Curry",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Monaragala",
      description: "Traditional rural-style rice and curry meals."
    },
    {
      id: 2,
      title: "Ragi & Millet Items",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Monaragala",
      description: "Nutritious finger millet and millet-based dishes."
    },
    {
      id: 3,
      title: "Rural Harvest Festivals",
      image: "/images/rice and curry.jpg",
      month: "Various",
      location: "Monaragala Villages",
      description: "Local community harvest celebrations."
    }
  ],
  Mullaitivu: [
    {
      id: 1,
      title: "Tamil Coastal Cuisine",
      image: "/images/seafood.jpg",
      month: "All Year",
      location: "Mullaitivu",
      description: "Fish and crab curries with Tamil coastal influences."
    },
    {
      id: 2,
      title: "Achcharu Pickles",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Mullaitivu",
      description: "Traditional Tamil pickles and preserves."
    },
    {
      id: 3,
      title: "Community Events",
      image: "/images/rice and curry.jpg",
      month: "Various",
      location: "Mullaitivu",
      description: "Local remembrance and community celebrations."
    }
  ],
  "Nuwara Eliya": [
    {
      id: 1,
      title: "Tea-influenced Snacks",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Nuwara Eliya",
      description: "Short-eats and snacks for tea estate workers."
    },
    {
      id: 2,
      title: "Hill-country Hoppers",
      image: "/images/hoppers.jpg",
      month: "All Year",
      location: "Nuwara Eliya",
      description: "Piping hot hoppers perfect for cool hill climate."
    },
    {
      id: 3,
      title: "Fresh Strawberries",
      image: "/images/rice and curry.jpg",
      month: "March-May",
      location: "Nuwara Eliya",
      description: "Fresh hill-country strawberries and fruits."
    },
    {
      id: 4,
      title: "English Bakery Items",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Nuwara Eliya",
      description: "Colonial-influenced bakery items and pastries."
    },
    {
      id: 5,
      title: "Tea Harvest Events",
      image: "/images/rice and curry.jpg",
      month: "Various",
      location: "Tea Estates",
      description: "Tea plantation harvest celebrations and events."
    },
    {
      id: 6,
      title: "Spring Flower Shows",
      image: "/images/garden.jpg",
      month: "April-May",
      location: "Nuwara Eliya",
      description: "Horticultural events and flower shows."
    }
  ],
  Polonnaruwa: [
    {
      id: 1,
      title: "Dry-zone Rice & Curry",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Polonnaruwa",
      description: "Traditional dry-zone cuisine with tank fish."
    },
    {
      id: 2,
      title: "Freshwater Fish Curries",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Polonnaruwa",
      description: "Fish from ancient irrigation tanks."
    },
    {
      id: 3,
      title: "Ancient Ruins Festivals",
      image: "/images/anuradhapura.jpg",
      month: "Various",
      location: "Ancient City",
      description: "Temple festivals at historic archaeological sites."
    }
  ],
  Puttalam: [
    {
      id: 1,
      title: "Coastal Seafood",
      image: "/images/seafood.jpg",
      month: "All Year",
      location: "Puttalam Coast",
      description: "Fresh coastal seafood including crab and prawns."
    },
    {
      id: 2,
      title: "Burgher-influenced Snacks",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Coastal Towns",
      description: "Dutch Burgher influenced coastal snacks."
    },
    {
      id: 3,
      title: "St. Anne's Church Feasts",
      image: "/images/temple.jpeg",
      month: "July",
      location: "Puttalam/Mannar",
      description: "Christian community church festivals and feasts."
    }
  ],
  Ratnapura: [
    {
      id: 1,
      title: "Kithul Treacle Sweets",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Ratnapura",
      description: "Traditional sweets made from kithul palm jaggery."
    },
    {
      id: 2,
      title: "River-fish Curries",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Ratnapura",
      description: "Fresh river fish from local waterways."
    },
    {
      id: 3,
      title: "Manioc & Tuber Dishes",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Ratnapura",
      description: "Traditional root vegetable preparations."
    },
    {
      id: 4,
      title: "Gem Mining Fairs",
      image: "/images/market.jpg",
      month: "Various",
      location: "Ratnapura",
      description: "Local fairs related to gem mining communities."
    }
  ],
  Trincomalee: [
    {
      id: 1,
      title: "Excellent Seafood",
      image: "/images/seafood.jpg",
      month: "All Year",
      location: "Trincomalee",
      description: "Outstanding crab, prawns and fish from Trinco waters."
    },
    {
      id: 2,
      title: "Toddy-influenced Dishes",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Trincomalee Coast",
      description: "Coastal dishes with palm toddy influences."
    },
    {
      id: 3,
      title: "Dosai with Crab Curries",
      image: "/images/hoppers.jpg",
      month: "All Year",
      location: "Trincomalee",
      description: "South Indian breakfast items with local crab curry."
    },
    {
      id: 4,
      title: "Koneswaram Temple Festival",
      image: "/images/temple.jpeg",
      month: "Various",
      location: "Koneswaram Temple",
      description: "Major Hindu temple festivals and celebrations."
    },
    {
      id: 5,
      title: "Vel Festival",
      image: "/images/temple.jpeg",
      month: "July-August",
      location: "Hindu Temples",
      description: "Hindu religious festival with temple processions."
    }
  ],
  Vavuniya: [
    {
      id: 1,
      title: "Tamil-influenced Rice & Curry",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Vavuniya",
      description: "Inland Tamil-style rice and curry preparations."
    },
    {
      id: 2,
      title: "Local Short-eats",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Vavuniya",
      description: "Traditional snacks and short-eats."
    },
    {
      id: 3,
      title: "Coconut-based Curries",
      image: "/images/rice and curry.jpg",
      month: "All Year",
      location: "Vavuniya",
      description: "Rich coconut milk-based curry preparations."
    },
    {
      id: 4,
      title: "Hindu Temple Festivals",
      image: "/images/temple.jpeg",
      month: "Various",
      location: "Local Temples",
      description: "Local Hindu temple celebrations and peraheras."
    }
  ]
  // ➜ All districts now have comprehensive food and festival data!
};

export default function Cultural() {
  const [selectedDistrict, setSelectedDistrict] = useState("Most Favorites");
  const [selectedType, setSelectedType] = useState("All");

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  // Helper to classify items
  const getType = (item) => {
    const title = item.title.toLowerCase();
    const desc = item.description.toLowerCase();
    if (title.includes("festival") || title.includes("perahera") || desc.includes("festival") || desc.includes("perahera")) {
      return "Festival";
    }
    if (title.includes("food") || title.includes("curry") || title.includes("snack") || title.includes("rice") || title.includes("seafood") || desc.includes("food") || desc.includes("curry") || desc.includes("snack") || desc.includes("rice") || desc.includes("seafood")) {
      return "Food";
    }
    return "Other";
  };

  const selectedData = (eventsData[selectedDistrict] || eventsData["Most Favorites"]).filter((item) => {
    if (selectedType === "All") return true;
    return getType(item) === selectedType;
  });

  return (
    <div className="cultural-container">
      <h1>Discover Sri Lankan foods and festivals</h1>
      <p>Explore the rich cultural heritage and delicious cuisine of the Pearl of the Indian Ocean</p>

      <div className="dropdown-container">
        <select value={selectedDistrict} onChange={handleDistrictChange}>
          <option value="Most Favorites">All Districts (Most Favorites)</option>
          {allDistricts.map((district) => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>
        <select value={selectedType} onChange={handleTypeChange}>
          <option value="All">All</option>
          <option value="Food">Food</option>
          <option value="Festival">Festival</option>
        </select>
      </div>

      <div className="cards-grid">
        {selectedData.length === 0 ? (
          <p>No results found for this filter.</p>
        ) : (
          selectedData.map((item) => (
            <div className="card" key={item.id}>
              <img src={item.image} alt={item.title} />
              <div className="card-content">
                <h3>{item.title}</h3>
                <p><strong>Month:</strong> {item.month}</p>
                <p><strong>Location:</strong> {item.location}</p>
                <p>{item.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <p className="selected-district-text">
        Showing the most popular cultural events and foods across <strong>{selectedDistrict}</strong> filtered by <strong>{selectedType}</strong>
      </p>
    </div>
  );
}
