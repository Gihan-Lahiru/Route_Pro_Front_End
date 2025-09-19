import React, { createContext, useContext, useState } from "react";

const TripPackageContext = createContext({
  tripPackage: null,
  confirmTripPackage: () => {},
  clearTripPackage: () => {}
});

export function TripPackageProvider({ children }) {
  const [tripPackage, setTripPackage] = useState(null);

  const confirmTripPackage = (data) => setTripPackage(data);
  const clearTripPackage = () => setTripPackage(null);

  return (
    <TripPackageContext.Provider value={{ tripPackage, confirmTripPackage, clearTripPackage }}>
      {children}
    </TripPackageContext.Provider>
  );
}

export function useTripPackage() {
  return useContext(TripPackageContext);
}