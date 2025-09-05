// src/Routing.tsx
import { Routes, Route } from 'react-router-dom';

import LandingPage from './pages/landing-page';
import Imprint from './pages/imprint';
import Privacy from './pages/privacy';
import Terms from './pages/terms';
import Login from './pages/login';
import Signup from './pages/signup';
import ForStartups from './pages/for-startups';
import ForRetirees from './pages/for-retirees';

// Retiree
import RetireeProfile from './pages/retiree/profile';
import RetireeProfileEdit from './pages/retiree/profile/edit';
import RetireeBrowseJobs from './pages/retiree/browse-jobs';

// Startup
import StartupBrowseRetirees from './pages/startup/browse-retirees';
import StartupMatches from './pages/startup/matches';
import StartupProfile from './pages/startup/profile';
import StartupProfileEdit from './pages/startup/profile/edit';
import StartupPaywall from './pages/startup/paywall';

// General / Dynamic
import Job from './pages/job';
import Retiree from './pages/retiree';
import StartupDetails from './pages/startup';
import ConversationsPage from './pages/chat/conversations';
import NotFound from './components/custom/NotFound';
import ChatRedirect from './pages/chat/chat-redirect';
import ProtectedRoute from './components/custom/ProtectedRoute';
import EditJobPage from './pages/startup/edit-job';

const Routing = () => (
  <Routes>
    {/* General Pages */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/imprint" element={<Imprint />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/for-startups" element={<ForStartups />} />
    <Route path="/for-retirees" element={<ForRetirees />} />
    {/* Retiree */}
    <Route path="/retiree/browse-jobs" element={<RetireeBrowseJobs />} />
    <Route path="/retiree/conversations/" element={<ConversationsPage isRetiree={true} />} />
    <Route path="/retiree/conversations/:id" element={<ConversationsPage isRetiree={true} />} />
    <Route path="/retiree/profile" element={<RetireeProfile />} />
    <Route
      path="/retiree/profile/edit"
      element={
        <ProtectedRoute requiredUserType="Retiree">
          <RetireeProfileEdit />
        </ProtectedRoute>
      }
    />
    {/* Startup */}
    <Route path="/startup/browse-retirees" element={<StartupBrowseRetirees />} />
    <Route path="/startup/new-posting" element={<EditJobPage />} />
    <Route path="/startup/matches" element={<StartupMatches />} />
    <Route path="/startup/matches/:jobPostingId" element={<StartupMatches />} />
    <Route path="/startup/conversations/" element={<ConversationsPage isRetiree={false} />} />
    <Route path="/startup/conversations/:id" element={<ConversationsPage isRetiree={false} />} />
    <Route path="/startup/profile" element={<StartupProfile />} />
    <Route
      path="/startup/profile/edit"
      element={
        <ProtectedRoute requiredUserType="Startup">
          <StartupProfileEdit />
        </ProtectedRoute>
      }
    />
    <Route path="/startup/edit-job/:id" element={<EditJobPage />} />
    <Route path="/startup/paywall" element={<StartupPaywall />} />
    {/* Dynamic Routes */}
    <Route path="/job/:id" element={<Job />} />
    <Route path="/retiree/public/:id" element={<Retiree />} />
    <Route path="/startup/public/:id" element={<StartupDetails />} />
    {/*  Convenience Redirects */}
    <Route path="/conversation" element={<ChatRedirect />} />
    <Route path="/conversation/:id" element={<ChatRedirect />} />

    {/* 404 Route - must be last */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default Routing;
