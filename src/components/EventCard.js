// src/components/EventCard.js
import React from 'react';
import { Link } from 'react-router-dom';

function EventCard({ event }) {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };

  return (
    <div className="card mb-3">
      <img src={event.imageUrl} className="card-img-top" alt={event.title} />
      <div className="card-body">
        <h5 className="card-title">{event.title}</h5>
        <p className="card-text"><strong>Date:</strong> {formatDate(event.date)}</p>
        <p className="card-text"><strong>Location:</strong> {event.location}</p>
        <Link to={`/events/${event.id}`} className="btn btn-primary mr-2">View Details</Link>
        <Link to={`/subscribe/${event.id}`} className="btn btn-success ms-2">S'inscrire</Link>
      </div>
    </div>
  );
}

export default EventCard;
