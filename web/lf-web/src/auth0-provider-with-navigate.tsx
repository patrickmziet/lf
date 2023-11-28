import { Auth0Provider, AppState, useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, PropsWithChildren } from "react"; // React imports
import { useNavigate } from "react-router-dom"; // React Router hook
import { createUserIfNotExist } from "./services/message.service"; // Your custom service

interface Auth0ProviderWithNavigateProps {
  children: React.ReactNode; // Prop type
}

const Auth0Wrapper = ({ children }: { children: React.ReactNode }) => { // Component
  const navigate = useNavigate(); // Hook
  const auth0 = useAuth0(); // Hook

  useEffect(() => { // Hook
    const onRedirectCallback = async (appState?: AppState) => { // Function
      navigate(appState?.returnTo || window.location.pathname); // Navigation logic
      console.log("appState", appState?.returnTo); 

      try {
        const token = await auth0.getAccessTokenSilently(); // Auth0 method
        const response = await createUserIfNotExist(token); // Custom service call
        console.log(response);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message); // Error handling
        }
      }
    };

    onRedirectCallback(); // Invoke the callback
  }, [auth0, navigate]); // Dependency array for useEffect

  return <>{children}</>; // Render children
};

export const Auth0ProviderWithNavigate = ({
  children,
}: PropsWithChildren<Auth0ProviderWithNavigateProps>): JSX.Element | null => {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN; // Environment variable
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID; // Environment variable
  const redirectUri = process.env.REACT_APP_AUTH0_CALLBACK_URL; // Environment variable
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE; // Environment variable

  if (!(domain && clientId && redirectUri && audience)) {
    return null; // Guard clause for missing env variables
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience: audience,
        redirect_uri: redirectUri,
      }}
    >
      <Auth0Wrapper>
        {children} 
      </Auth0Wrapper>
    </Auth0Provider>
  );
};
