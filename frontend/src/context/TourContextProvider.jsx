"use client"
import { createContext, useContext, useState } from "react";
const TourContext = createContext();

export function UseTourState() {
  return useContext(TourContext);
}

export function TourContextProvider({ children }) {
  const [location, setLocation] = useState("all");
  const categoryChangeHandler = (value = "all") => {
    setLocation(value.toLowerCase());
  };

  const contextObj = {
    categoryChangeHandler,
    location,
  };

  return (
    <TourContext.Provider value={contextObj}>{children}</TourContext.Provider>
  );
}
