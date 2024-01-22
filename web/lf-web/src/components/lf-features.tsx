import React from "react";
import { LFFeature } from "./lf-feature";

export const LFFeatures: React.FC = () => {
const logoUrl = process.env.PUBLIC_URL + '/lf.png';
const logoUrl2 = process.env.PUBLIC_URL + '/logo192.png';
  const featuresList = [
    {
      title: "Demonstration 1",
      description:
        "Demonstration 1 shows you ...",
      resourceUrl: "link to demonstration 1",
      icon: logoUrl2,
    },
    {
        title: "Demonstration 2",
        description:
          "Demonstration 2 shows you ...",
        resourceUrl: "link to demonstration 2",
        icon: logoUrl2,
    },
    {
        title: "Demonstration 3",
        description:
          "Demonstration 3 shows you ...",
        resourceUrl: "link to demonstration 3",
        icon: logoUrl2,
    },
];

  return (
    <div className="lf-features">
      <h2 className="lf-features__title">Explore LF Features</h2>
      <div className="lf-features__grid">
        {featuresList.map((feature) => (
          <LFFeature
            key={feature.resourceUrl}
            title={feature.title}
            description={feature.description}
            resourceUrl={feature.resourceUrl}
            icon={feature.icon}
          />
        ))}
      </div>
    </div>
  );
};