import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EventDetails from './components/EventDetails';
import Connexion from './pages/Connexion';
import Subscription from './pages/Subscription';
import './App.css';
import Home from './components/Home';
import EventsPage from './components/EventsPage';
import SubToEvent from './components/SubToEvent';
import ParentComponent from './components/ParentComponent';
import Contacts from './pages/Contacts';

function App() {
  return (
    <Router> {/* Wrap your components with BrowserRouter */}
      <div className="App">
        <Navbar />
        <main className="container main-content my-4">
        <Routes> {/* Wrap Routes around all Route components */}
            <Route path="/" element={<Home />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/login" element={<Connexion />} />
            <Route path="/subscribe" element={<Subscription />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/subscribe/:id" element={<SubToEvent />} />
            <Route path="/test" element={<ParentComponent />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
