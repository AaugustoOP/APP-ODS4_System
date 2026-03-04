import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { StudyProvider } from './context/StudyContext';

export default function App() {
  return (
    <AuthProvider>
      <StudyProvider>
        <RouterProvider router={router} />
      </StudyProvider>
    </AuthProvider>
  );
}