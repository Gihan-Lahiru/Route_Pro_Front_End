import React from 'react';
import './LocalEventsFoods.css';
import food1 from './images/milk rice.jpg';
import food2 from './images/pittu.jpg';
import food3 from './images/rice and curry.jpg';
import food4 from './images/navam.jpg';
import food5 from './images/vesak-festival.jpg';
import { useNavigate } from 'react-router-dom';

const LocalEventsFoods = () => {
  const navigate = useNavigate(); // ✅ Initialize the hook

  const handleExploreClick = () => {
    navigate('/culture'); // ✅ Navigate to your /culture page
  };

  return (
    <section className="events-section">
      <div className="overlay">
        <div className="content">
          <h1>
            <span className="highlight-teal">Explore Local Events & Foods</span>{' '}
            
          </h1>
          <p className="description">
          Local events bring people together to celebrate culture and community. Festivals, markets, and traditional foods keep ancient customs alive with timeless flavors.          </p>
          <button className="explore-btn" onClick={handleExploreClick}>
            Explore More
          </button>

          <div className="food-cards">
            <div className="food-card">
              <img src={food1} alt="Meal 1" />
              <p>Milk Rice (Kiribath)</p>
            </div>
            <div className="food-card">
              <img src={food2} alt="Meal 2" />
              <p>Pittu</p>
            </div>
            <div className="food-card">
              <img src={food3} alt="Meal 3" />
              <p>Rice and Curry</p>
            </div>
            <div className="food-card">
              <img src={food4} alt="Meal 4" />
              <p>Navam Perahara</p>
            </div>
            <div className="food-card">
              <img src={food5} alt="Meal 5" />
              <p>Vesak Festival</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalEventsFoods;
