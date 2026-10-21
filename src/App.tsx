import React, { useState } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from 'react-router-dom';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { Dashboard } from './pages/Dashboard';
import { WriteupDetail } from './pages/WriteupDetail';
import contentData from './data/content.json';
import { ContentData, Platform } from './types';

const data = contentData as ContentData;

// Inner layout component to have access to router parameters
const AppLayout: React.FC = () => {
  const [isLeftCollapsed, setIsLeftCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('sidebar-left-collapsed') === 'true';
  });
  const [globalSearch, setGlobalSearch] = useState<string>('');

  const handleToggleLeft = (collapsed: boolean) => {
    setIsLeftCollapsed(collapsed);
    localStorage.setItem('sidebar-left-collapsed', String(collapsed));
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        searchQuery={globalSearch}
        setSearchQuery={setGlobalSearch}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/cylab" replace />}
          />
          <Route
            path="/:platform"
            element={
              <PlatformRoute
                isLeftCollapsed={isLeftCollapsed}
                setIsLeftCollapsed={handleToggleLeft}
                globalSearch={globalSearch}
              />
            }
          />
          <Route
            path="/:platform/:slug"
            element={
              <WriteupRoute
                isLeftCollapsed={isLeftCollapsed}
                setIsLeftCollapsed={handleToggleLeft}
              />
            }
          />
          <Route
            path="*"
            element={<Navigate to="/cylab" replace />}
          />
        </Routes>
      </div>
    </div>
  );
};

// Route wrapper for Dashboard
const PlatformRoute: React.FC<{
  isLeftCollapsed: boolean;
  setIsLeftCollapsed: (collapsed: boolean) => void;
  globalSearch: string;
}> = ({ isLeftCollapsed, setIsLeftCollapsed, globalSearch }) => {
  const { platform: rawPlatformSlug } = useParams<{ platform: string }>();
  const platformSlug = rawPlatformSlug?.toLowerCase() || 'cylab';

  const currentPlatform: Platform =
    data.platforms.find((p) => p.slug.toLowerCase() === platformSlug) ||
    data.platforms[0] || {
      name: 'CyLab',
      slug: 'cylab',
      description: 'Comprehensive challenge documentation for CyLab cybersecurity challenges.',
      count: 10,
    };

  return (
    <>
      <LeftSidebar
        isCollapsed={isLeftCollapsed}
        setIsCollapsed={setIsLeftCollapsed}
        platforms={data.platforms}
        writeups={data.writeups}
        activePlatformSlug={currentPlatform.slug}
      />

      <Dashboard
        platform={currentPlatform}
        writeups={data.writeups}
        globalSearch={globalSearch}
      />

      <RightSidebar
        platform={currentPlatform}
        writeups={data.writeups}
      />
    </>
  );
};

// Route wrapper for Writeup Detail
const WriteupRoute: React.FC<{
  isLeftCollapsed: boolean;
  setIsLeftCollapsed: (collapsed: boolean) => void;
}> = ({ isLeftCollapsed, setIsLeftCollapsed }) => {
  const { platform: rawPlatformSlug } = useParams<{ platform: string }>();
  const platformSlug = rawPlatformSlug?.toLowerCase() || 'cylab';

  const currentPlatform: Platform =
    data.platforms.find((p) => p.slug.toLowerCase() === platformSlug) ||
    data.platforms[0];

  return (
    <>
      <LeftSidebar
        isCollapsed={isLeftCollapsed}
        setIsCollapsed={setIsLeftCollapsed}
        platforms={data.platforms}
        writeups={data.writeups}
        activePlatformSlug={platformSlug}
      />

      <WriteupDetail
        writeups={data.writeups}
        platforms={data.platforms}
      />

      <RightSidebar
        platform={currentPlatform}
        writeups={data.writeups}
      />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
