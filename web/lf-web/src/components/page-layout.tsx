import React from "react";
import { Helmet } from "react-helmet";
import { NavBar } from "./navigation/desktop/nav-bar";
import { MobileNavBar } from "./navigation/mobile/mobile-nav-bar";
import { PageFooter } from "./page-footer";

interface Props {
  children: JSX.Element;
}

export const PageLayout: React.FC<Props> = ({ children }) => {
  const faviconUrl = process.env.PUBLIC_URL + '/favicon.ico';
  return (
    <div className="page-layout">
      <Helmet>
        <title>LearnFast</title>
        <link rel="icon" href={faviconUrl} />
      </Helmet>
      <NavBar />
      <MobileNavBar />
      <div className="page-layout__content">{children}</div>
    </div>
  );
};
