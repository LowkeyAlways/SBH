import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function EventsPage() {
  const [eventsByDay, setEventsByDay] = useState({});

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  axios.defaults.withCredentials = true;
  useEffect(() => {
    // Récupérer les événements depuis le backend
    axios.get("http://localhost:3002/api/events")
      .then(res => {
        const events = res.data;

        // Organiser les événements par jour
        const eventsByDayObject = {};
        events.forEach(event => {
          const eventDate = formatDate(event.date);
          if (!eventsByDayObject[eventDate]) {
            eventsByDayObject[eventDate] = [];
          }
          eventsByDayObject[eventDate].push(event);
        });

        setEventsByDay(eventsByDayObject);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className='margin_main'>
      <h1 className='my-5'>Événements à venir</h1>
      {Object.keys(eventsByDay).map(day => (
        <div className='events_calendar' key={day}>
          <h2>{day}</h2>
          <ul>
            {eventsByDay[day].map(event => (
              
              <li key={event.id}>
                <Link to={`/events/${event.id}`}>
                <img src={event.imageUrl} className='event_list_img' alt={event.title}></img> <strong>{event.title}</strong> - {formatTime(event.time_start)}-{formatTime(event.time_end)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default EventsPage;
