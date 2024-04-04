// src/components/EventCarousel.js
import React, { useState } from 'react';

function EventCarousel({ events }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = (event) => {
    event.preventDefault();
    const nextIndex = activeIndex === events.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const prevSlide = (event) => {
    event.preventDefault();
    const prevIndex = activeIndex === 0 ? events.length - 1 : activeIndex - 1;
    setActiveIndex(prevIndex);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
      <div className="carousel-inner">
        {events.map((event, index) => (
          <div key={event.id} className={`carousel-item${index === activeIndex ? ' active' : ''}`}>
            <img src={event.imageUrl} className="d-block w-100" alt={event.title} />
            <div className="carousel-caption d-none d-md-block">
              <div className="overlay"></div>
              <h5>{event.title}</h5>
              <p>{formatDate(event.date)}</p>
              <p>{event.location}</p>
            </div>
          </div>
        ))}
      </div>
      <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" onClick={prevSlide}>
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="sr-only">Previous</span>
      </a>
      <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" onClick={nextSlide}>
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="sr-only">Next</span>
      </a>
    </div>
  );
}

export default EventCarousel;
