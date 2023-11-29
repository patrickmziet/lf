import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { CodeSnippet } from "../components/code-snippet";
import { PageLayout } from "../components/page-layout";
import { createUserIfNotExist } from "../services/message.service";

export const ProfilePage: React.FC = () => {
  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const makeUser = async () => {
      if (!user) {
        return;
      }

      console.log("makeUser function has started executing");
      const token = await getAccessTokenSilently();

      const userData = {
        email: user.email,
        is_verified: user.email_verified,
        given_name: user.given_name,
        family_name: user.family_name,
        nickname: user.nickname,
        name: user.name,
        picture: user.picture,
        locale: user.locale,
        sub: user.sub,
        id: user?.sub?.split("|")[1],
      };

      const response = await createUserIfNotExist(token, userData);
      console.log("Response from backend", response);
    };

    makeUser();
  }, [user, getAccessTokenSilently]);

  if (!user) {
    return null;
  }


  return (
    <PageLayout>
      <div className="content-layout">
        <h1 id="page-title" className="content__title">
          Profile Page
        </h1>
        <div className="content__body">
          <p id="page-description">
            <span>
              You can use the <strong>ID Token</strong> to get the profile
              information of an authenticated user.
            </span>
            <span>
              <strong>Only authenticated users can access this page.</strong>
            </span>
          </p>
          <div className="profile-grid">
            <div className="profile__header">
              <img
                src={user.picture}
                alt="Profile"
                className="profile__avatar"
              />
              <div className="profile__headline">
                <h2 className="profile__title">{user.name}</h2>
                <span className="profile__description">{user.email}</span>
              </div>
            </div>
            <div className="profile__details">
              <CodeSnippet
                title="Decoded ID Token"
                code={JSON.stringify(user, null, 2)}
              />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
