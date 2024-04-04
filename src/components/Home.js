import React, { useState, useEffect } from "react";
import Carousel from "./Carousel";
import EventList from "./EventList";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HOST}/`)
      .then( res => {
        console.log(res.data); // Log the response data
        if(res.data.valid) {
          setName(res.data.username);
          setId(res.data.id);
        } else {
          
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <Carousel />
      <EventList />
    </div>
  );
}

export default Home;
