
import { AppRouter } from "./Router/AppRouter";
import { AuthProvider } from "./Store/authContext/AuthContext";
import "./Sistema/styles/sidebar.css";
import "./styles/sweetalert.css";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
