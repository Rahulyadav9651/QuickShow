import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
console.log("image base:", import.meta.env.VITE_TMDB_IMAGE_BASE_URL)
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  const { user } = useUser();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchIsAdmin = async () => {
    setIsAdminLoading(true);
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAdmin(data.isAdmin === true);
    } catch (error) {
      console.log("is-admin failed:", error.response?.status, error.response?.data || error.message);
      setIsAdmin(false);

      const status = error.response?.status;
      if ((status === 401 || status === 403) && location.pathname.startsWith("/admin")) {
        navigate("/", { replace: true });
        toast.error("You are not authorized to access admin dashboard");
      }
    } finally {
      setIsAdminLoading(false);
    }
  };

  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");
      if (data.success) setShows(data.shows);
      else toast.error(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFavoriteMovies = async () => {
    try {
      const { data } = await axios.get("/api/user/favorites", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) setFavoriteMovies(data.movies);
      else toast.error(data.message);
    } catch (error) {
      console.error(error);
    }
  };
//console.log("fds",favoriteMovies)
  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      fetchIsAdmin();
      fetchFavoriteMovies();
    } else {
      setIsAdmin(false);
      setFavoriteMovies([]);
      setIsAdminLoading(false);
      if (location.pathname.startsWith("/admin")) {
        navigate("/", { replace: true });
      }
    }
  }, [isLoaded, isSignedIn]);

  const value = {
    axios,
    fetchIsAdmin,
    user,
    getToken,
    navigate,
    isAdmin,
    isAdminLoading,
    shows,
    favoriteMovies,
    fetchFavoriteMovies,
    image_base_url,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);