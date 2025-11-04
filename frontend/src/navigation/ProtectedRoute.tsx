import { ReactElement } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactElement;
}
const ProtectedRoute = ({ children }: ProtectedRouteProps): ReactElement | null => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    loginWithRedirect({
      appState: { returnTo: location.pathname },
    });
    return null;
  }

  return children;
};

export default ProtectedRoute;
