import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function EventDetails() {
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    return `${hour}h${minute}`;
  };
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}/api/events/${id}`)
      .then((response) => {
        const eventData = response.data;

        // Récupérer les orateurs associés à l'événement
        axios
          .get(`${process.env.REACT_APP_HOST}/api/event/${id}/speakers`)
          .then((speakersResponse) => {
            const speakers = speakersResponse.data.speakers;
            eventData.speaker_names = speakers;

            // Récupérer les entrepreneurs associés à l'événement
            axios
              .get(`${process.env.REACT_APP_HOST}/api/event/${id}/entrepreneurs`)
              .then((entrepreneursResponse) => {
                const entrepreneurs = entrepreneursResponse.data.entrepreneurs;
                eventData.entrepreneur_names = entrepreneurs;

                // Récupérer les partenaires associés à l'événement
                axios
                  .get(`${process.env.REACT_APP_HOST}/api/event/${id}/partners`)
                  .then((partnersResponse) => {
                    const partners = partnersResponse.data.partners;
                    eventData.partner_names = partners;

                    // Mettre à jour les détails de l'événement dans l'état local
                    setEventDetails(eventData);
                    setLoading(false);
                  })
                  .catch((error) => {
                    console.error("Error fetching partners:", error);
                    setLoading(false);
                  });
              })
              .catch((error) => {
                console.error("Error fetching entrepreneurs:", error);
                setLoading(false);
              });
          })
          .catch((error) => {
            console.error("Error fetching speakers:", error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!eventDetails) {
    return <div>No event details available.</div>;
  }

  return (
    <div className="event_details">
      <div className="details_img">
        <img src={eventDetails.imageUrl} alt={eventDetails.title} />
      </div>
      <ul className="d-flex align-items-center descrp">
        <li>
          <h2>{eventDetails.title}</h2>
        </li>
        <li>
          <p>
            {formatDate(eventDetails.date)} /{" "}
            {formatTime(eventDetails.time_start)}-
            {formatTime(eventDetails.time_end)} / {eventDetails.location}
          </p>
        </li>
      </ul>

      <ul>
        <p className="descr_ev">
          <strong>Description :</strong> {eventDetails.details}
        </p>
      </ul>
      <h3 className="title_event">Intervenants</h3>
      <ul className="ev_addons">
        {eventDetails.speaker_names &&
          eventDetails.speaker_names.map((speaker, index) => (
            <li key={index}>{speaker}</li>
          ))}
      </ul>
      <h3 className="title_event">Entrepreneurs</h3>
      <ul className="ev_addons">
        {eventDetails.entrepreneur_names &&
          eventDetails.entrepreneur_names.map((entrepreneur, index) => (
            <li key={index}>{entrepreneur}</li>
          ))}
      </ul>
      <h3 className="title_event">Partenaires</h3>
      <ul className="ev_addons">
        {eventDetails.partner_names &&
          eventDetails.partner_names.map((partner, index) => (
            <li key={index}>{partner}</li>
          ))}
      </ul>
      <div className="text-center">
        <Link
          to={`/subscribe/${eventDetails.id}`}
          className="btn btn-success mt-5"
        >
          S'inscrire
        </Link>
      </div>
    </div>
  );
}

export default EventDetails;
