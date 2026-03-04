import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { Dashboard } from './pages/Dashboard';
import { FocusMode } from './pages/FocusMode';
import { Planner } from './pages/Planner';
import { Gamification } from './pages/Gamification';
import { Reports } from './pages/Reports';
import { Impact } from './pages/Impact';
import { ProfessorMode } from './pages/ProfessorMode';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/landing',
    Component: Landing,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/register',
    Component: Register,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: 'focus', Component: FocusMode },
      { path: 'planner', Component: Planner },
      { path: 'gamification', Component: Gamification },
      { path: 'reports', Component: Reports },
      { path: 'impact', Component: Impact },
      { path: 'professor', Component: ProfessorMode },
    ],
  },
]);