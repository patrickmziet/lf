import React from "react";

interface LFFeatureProps {
  title: string;
  description: string;
  resourceUrl: string;
  icon: string;
}

export const LFFeature: React.FC<LFFeatureProps> = ({
  title,
  description,
  resourceUrl,
  icon,
}) => (
  <a
    href={resourceUrl}
    className="lf-feature"
    target="_blank"
    rel="noopener noreferrer"
  >
    <h3 className="lf-feature__headline">
      <img
        className="lf-feature__icon"
        src={icon}
        alt="external link icon"
      />
      {title}
    </h3>
    <p className="lf-feature__description">{description}</p>
  </a>
);