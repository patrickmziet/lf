import { Auth0Provider, AppState, useAuth0 } from "@auth0/auth0-react";
import React, { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { createUserIfNotExist } from "./services/message.service";

interface Auth0ProviderWithNavigateProps {
  children: React.ReactNode;
}

export const Auth0ProviderWithNavigate = ({
  children,
}: PropsWithChildren<Auth0ProviderWithNavigateProps>): JSX.Element | null => {
  const navigate = useNavigate();
  const auth0 = useAuth0();

  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_AUTH0_CALLBACK_URL;
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

  const onRedirectCallback = async (appState?: AppState) => {
      navigate(appState?.returnTo || window.location.pathname);
      console.log("appState", appState?.returnTo);
      
      try {
        const token = await auth0.getAccessTokenSilently();
        const response = await createUserIfNotExist(token);
        console.log(response);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
  };

  if (!(domain && clientId && redirectUri && audience)) {
    return null;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience: audience,
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
