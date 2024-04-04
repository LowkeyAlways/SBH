import React, { useState, useEffect } from 'react'
import axios from 'axios';
import EventCarousel from './EventCarousel'

function Carousel() {
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
    <div  className="carousel_p">
        <EventCarousel events={events} />
    </div>
  )
}

export default Carousel