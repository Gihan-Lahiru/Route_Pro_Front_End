import React from 'react';
import './LocalEventsFoods.css';
import food1 from './images/milk rice.jpg'; // sample images
import food2 from './images/pittu.jpg';
import food3 from './images/rice and curry.jpg';
import food4 from './images/pol roti.jpg';
import food5 from './images/malu abul.jpg';

const LocalEventsFoods = () => {
  return (
    <section className="events-section">
      <div className="overlay">
        <div className="content">
          <h1>
            <span className="highlight-teal">EXPLORE</span>{' '}
            <span className="highlight-white">LOCAL</span><br />
            <span className="highlight-bold">EVENTS & FOODS</span>
          </h1>
          <p className="description">
            Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem
            Ipsum has been the industry's standard dummy text ever since the 1500s.
          </p>
          <button className="explore-btn">Explore More</button>

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
              <p>Pol Roti</p>
            </div>
             <div className="food-card">
              <img src={food5} alt="Meal 5" />
              <p>Malu abul thiyal</p>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalEventsFoods;
