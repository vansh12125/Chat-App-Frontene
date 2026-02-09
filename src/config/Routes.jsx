import { Routes, Route } from "react-router";
import ChatPage from "../components/ChatPage";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";
import Login from "../components/Login";
import Register from "../components/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";
import Home from "../components/Home";
import About from "../components/About";
import Contact from "../components/Contact";
import EditProfile from "../components/EditProfile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/home"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout>
            <Register />
          </Layout>
        }
      />

      <Route
        path="/join"
        element={
          <ProtectedRoute>
            <Layout>
              <JoinRoom />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:roomId"
        element={
          <ProtectedRoute> 
              <ChatPage />    
          </ProtectedRoute>
        }
      />

      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <Layout>
              <CreateRoom />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/about"
        element={
          <Layout>
            <About />
          </Layout>
        }
      />

      <Route
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <EditProfile />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
