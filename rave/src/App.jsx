import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import MusicPage from "./pages/MusicPage";
import TicketPage from "./pages/TicketPage";
import CulturePage from "./pages/CulturePage";
import EventTicketForm from "./pages/EventTicketForm";
import TicketScanner from "./pages/TicketScanner"

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      <Route
        path="/about"
        element={
          <MainLayout>
            <AboutPage />
          </MainLayout>
        }
      />
      <Route
        path="/music"
        element={
          <MainLayout>
            <MusicPage />
          </MainLayout>
        }
      />
      <Route
        path="/ticket"
        element={
          <MainLayout>
            <TicketPage />
          </MainLayout>
        }
      />
      {/* <Route
        path="/tickets/:eventId"
        element={
          <MainLayout>
            <EventTicketForm />
          </MainLayout>
        }
      /> */}
      <Route
        path="/culture"
        element={
          <MainLayout>
            <CulturePage />
          </MainLayout>
        }
      />

      <Route
        path="/scanner"
        element={
          <MainLayout>
            <TicketScanner />
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default App;
