import React from 'react';
import SubscriptionForm from '../components/SubscriptionForm';

function EventSubscriptionPage({ eventId }) {
  return (
    <div>
      <h2>Subscribe to Event</h2>
      <SubscriptionForm eventId={eventId} />
    </div>
  );
}

export default EventSubscriptionPage;
