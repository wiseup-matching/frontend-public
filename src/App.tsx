import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Routing from './Routing';
import Navbar from './components/custom/Navbar';
import { Toaster } from './components/ui/sonner';
import BrowseJobsTutorial from './components/custom/BrowseJobsTutorial';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Navbar />
        <Toaster
          position="top-right"
          theme="light"
          closeButton={true}
          toastOptions={{ classNames: { content: 'w-full' } }}
        />
        <div className="pt-16 flex flex-col min-h-screen h-full">
          {/* conditionally start tutorial for retiree browse-jobs page */}
          <BrowseJobsTutorial />
          <Routing />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
