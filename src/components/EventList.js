// src/components/EventList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from './EventCard';
import EventCarousel from './EventCarousel';
import '../App.css';

function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HOST}/api/events`)
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, []);

  
  return (
    <div>
      <h2 className='my-5 home_title'>Événements à venir</h2>
      <div className="row event_list">
        {events.map(event => (
          <div className="col-md-4" key={event.id}>
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventList;
