import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import {ThemeProvider} from "./context/themeContext";
import {AppContent} from "./AppContent";


function App() {
  return (
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ThemeProvider>
  );
}

export default App;