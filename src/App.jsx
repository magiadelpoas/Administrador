
import { AppRouter } from "./Router/AppRouter";
import { AuthProvider } from "./Store/authContext/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
