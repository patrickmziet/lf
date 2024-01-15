import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { PageLoader } from "./components/page-loader";
import { AuthenticationGuard } from "./components/authentication-guard";
import { Route, Routes } from "react-router-dom";
import { AdminPage } from "./pages/admin-page";
import { CallbackPage } from "./pages/callback-page";
import { HomePage } from "./pages/home-page";
import { NotFoundPage } from "./pages/not-found-page";
import { ProfilePage } from "./pages/profile-page";
import { ProtectedPage } from "./pages/protected-page";
import { PublicPage } from "./pages/public-page";
import { NotesPage } from "./pages/notes-page";
import { TopicsPage } from "./pages/topics-page";
import { UploadPage } from "./pages/upload-page";
import { LearnPage } from "./pages/learn-page";
import { CardPage } from "./pages/card-page";

export const App: React.FC = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="page-layout">
        <PageLoader />
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/profile"
        element={<AuthenticationGuard component={ProfilePage} />}
      />
      <Route path="/public" element={<PublicPage />} />
      <Route
        path="/protected"
        element={<AuthenticationGuard component={ProtectedPage} />}
      />
      <Route
        path="/admin"
        element={<AuthenticationGuard component={AdminPage} />}
      />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route
        path="/notes"
        element={<AuthenticationGuard component={NotesPage} />}
      />
      <Route
        path="/topics"
        element={<AuthenticationGuard component={TopicsPage} />}
      />
      <Route
        path="/upload/:topicId"
        element={<AuthenticationGuard component={UploadPage} />}
      />
      <Route
        path="/learn/:topicId"
        element={<AuthenticationGuard component={LearnPage} />}
      />
      <Route
        path="/cards/:topicId"
        element={<AuthenticationGuard component={CardPage} />}
      />
    </Routes>
  );
};
