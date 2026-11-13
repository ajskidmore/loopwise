import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { ProgressProvider } from './progress/ProgressContext';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Pip } from './components/Pip';
import Learn from './pages/Learn';
import { Landing } from './pages/Misc';

// Everything except the landing page and the learning path loads on demand.
const Courses = lazy(() => import('./pages/Courses'));
const Practice = lazy(() => import('./pages/Practice'));
const ProblemPage = lazy(() => import('./pages/Practice').then((m) => ({ default: m.ProblemPage })));
const LessonPage = lazy(() => import('./pages/PlayPages').then((m) => ({ default: m.LessonPage })));
const CheckpointPage = lazy(() => import('./pages/PlayPages').then((m) => ({ default: m.CheckpointPage })));
const FinalExamPage = lazy(() => import('./pages/PlayPages').then((m) => ({ default: m.FinalExamPage })));
const ReviewPage = lazy(() => import('./pages/PlayPages').then((m) => ({ default: m.ReviewPage })));
const SearchPage = lazy(() => import('./pages/Misc').then((m) => ({ default: m.SearchPage })));
const Profile = lazy(() => import('./pages/Misc').then((m) => ({ default: m.Profile })));
const Login = lazy(() => import('./pages/Misc').then((m) => ({ default: m.Login })));
const NotFound = lazy(() => import('./pages/Misc').then((m) => ({ default: m.NotFound })));
const Welcome = lazy(() => import('./pages/Welcome'));

function Loading() {
  return (
    <div className="loading-screen" role="status" aria-label="Loading">
      <Pip size={72} mood="think" className="bounce" />
    </div>
  );
}

/** Scroll to the top when the page changes (unless jumping to an #anchor). */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ProgressProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/welcome" element={<Welcome />} />
              {/* Full-screen play views (no nav) */}
              <Route path="/lesson/:lessonId" element={<LessonPage />} />
              <Route path="/checkpoint/:unitId" element={<CheckpointPage />} />
              <Route path="/final/:trackId" element={<FinalExamPage />} />
              <Route path="/review" element={<ReviewPage />} />
              <Route element={<Layout />}>
                <Route path="/learn" element={<Learn />} />
                <Route path="/learn/:trackId" element={<Learn />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/practice/:problemId" element={<ProblemPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ProgressProvider>
    </ErrorBoundary>
  );
}
