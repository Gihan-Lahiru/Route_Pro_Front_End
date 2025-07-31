import React from "react";
import DriversSection from "./DriversSection";
import LocalGuidesSection from "./LocalGuidesSection";
import { ReviewSection } from './ReviewSection';


export default function BookDriver() {
  return (
    <div>
      {/* <h2>Book Your Driver & Guide</h2> */}
      <DriversSection />
      <LocalGuidesSection />
      <ReviewSection />
    </div>
  );
}
