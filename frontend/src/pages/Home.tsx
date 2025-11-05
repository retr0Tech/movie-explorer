import { useState, useContext } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import { useAuth0 } from "@auth0/auth0-react";
import MoviesExplorer from "../components/movies/MoviesExplorer";
import FavoriteMovie from "../components/favorites/FavoriteMovie";
import Recommendations from "../components/recommendations/Recommendations";
import { motion } from "framer-motion";
import { DarkModeContext } from "../App";
import "./Home.css";

export const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { logout, user } = useAuth0();
  const darkModeContext = useContext(DarkModeContext);

  return (
    <motion.div
      className="Home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="movie-explorer-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="p-card-title">Movie Explorer</h1>
          <div className="user-section">
            <span>Hi, {user?.nickname}</span>
            <button
              className="dark-mode-toggle"
              onClick={() => darkModeContext?.toggleDarkMode()}
              title={darkModeContext?.darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <i className={darkModeContext?.darkMode ? "pi pi-sun" : "pi pi-moon"}></i>
            </button>
            <Button
              label='Sign Out'
              severity='secondary'
              onClick={() => logout()}
            ></Button>
          </div>
        </div>
      </div>
      <TabView
        className="tabview-header-icon"
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <TabPanel header={
          <div className="flex items-center">
            <i className="pi pi-list" style={{marginRight: '10px'}}/>
            <span>Search movies</span>
          </div>
        }>
          <MoviesExplorer></MoviesExplorer>
        </TabPanel>
        <TabPanel header={
          <div className="flex items-center">
            <i className="pi pi-star" style={{marginRight: '10px'}}/>
            <span>Favorites</span>
          </div>
        }>
          <FavoriteMovie></FavoriteMovie>
        </TabPanel>
        <TabPanel header={
          <div className="flex items-center">
            <i className="pi pi-sparkles" style={{marginRight: '10px'}}/>
            <span>Recommendations</span>
          </div>
        }>
          <Recommendations></Recommendations>
        </TabPanel>
      </TabView>
    </motion.div>
  );
};

export default Home;
