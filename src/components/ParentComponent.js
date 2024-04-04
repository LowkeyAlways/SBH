import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubToEvent from './SubToEvent';

function ParentComponent() {
  const [eventId, setEventId] = useState(null);

  useEffect(() => {
    axios.get('/api/events2/:id') 
      .then(response => {
        const eventIdServer = response.data.eventId;
        setEventId(eventIdServer);
      })
      .catch(error => {
        console.error('Error fetching event ID:', error);
      });
  }, []);

  if (eventId) {
    return (
      <div>
        <h1>Parent Component</h1>
        <SubToEvent eventId={eventId} />
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default ParentComponent;
