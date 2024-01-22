import React from "react";
import { LFResource } from "../models/lf-resource";
import { PageFooterHyperlink } from "./page-footer-hyperlink";

export const PageFooter = () => {
  const resourceList: LFResource[] = [
    {
      path: "link 1",
      label: "Why LearnFast?",
    },
    {
      path: "link 2",
      label: "Cool deomos",
    },
    {
      path: "link 3",
      label: "Contact us",
    },
  ];

  return (
    <footer className="page-footer">
      <div className="page-footer-grid">
        <div className="page-footer-grid__info">
          <div className="page-footer-info__message">
            <p className="page-footer-message__headline">
              <span>This application is brought to you by the LearnFast corporation.</span>
            </p>
            <p className="page-footer-message__description">
                <>
                  <span>
                    Learn anything fast&nbsp;
                  </span>
                </>
            </p>
          </div>
          <div className="page-footer-info__resource-list">
            {resourceList.map((resource) => (
              <div
                key={resource.path}
                className="page-footer-info__resource-list-item"
              >
                <PageFooterHyperlink path={resource.path}>
                  <>{resource.label}</>
                </PageFooterHyperlink>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
