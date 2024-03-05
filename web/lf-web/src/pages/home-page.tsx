import React from "react";
import { LFFeatures } from "src/components/lf-features";
import { HeroBanner } from "src/components/hero-banner";
import { PageLayoutHome } from "../components/page-layout-home";

export const HomePage: React.FC = () => (
  <PageLayoutHome>
    <>
      <HeroBanner />
      <LFFeatures />
    </>
  </PageLayoutHome>
);
