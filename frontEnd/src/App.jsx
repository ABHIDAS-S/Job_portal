import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AppLayout from "./layouts/AppLayout";
import LandingPage from "./pages/LandingPage";
import Onboarding from "./pages/Onboarding";
import JobListing from "./pages/JobListing";
import Job from "./pages/Job";
import Posting from "./pages/Posting";
import SavedJobs from "./pages/SavedJobs";
import MyJobs from "./pages/MyJobs";
import { ThemeProvider } from "./components/theme-provider";
import ProtectedRoute from "./components/ProtectedRoute";
import Contact from "./pages/Conatct";
import Error from "./pages/errorPages/Error";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/onboarding",
        element: (
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        ),
      },
      {
        path: "/jobs",
        element: (
          <ProtectedRoute>
            <JobListing />
          </ProtectedRoute>
        ),
      },
      {
        path: "/job/:id",
        element: (
          <ProtectedRoute>
            <Job />
          </ProtectedRoute>
        ),
      },
      {
        path: "/postJob",
        element: (
          <ProtectedRoute>
            <Posting />
          </ProtectedRoute>
        ),
      },
      {
        path: "/savedJobs",
        element: (
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/myJobs",
        element: (
          <ProtectedRoute>
            <MyJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/contact",
        element: (
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        ),
      },
      {
        path: "/serverError",
        element: (
          <ProtectedRoute>
            <Error
              statusCode={500}
              title="Internal Server Error"
              message="Sorry, something went wrong on our side. Please try again later."
            />
          </ProtectedRoute>
        ),
      },

      {
        path: "*",
        element: (
          <ProtectedRoute>
            <Error
              statusCode={404}
              title="Page Not Found"
              message="Sorry, the page you are looking for doesn't exist.."
            />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}

export default App;
