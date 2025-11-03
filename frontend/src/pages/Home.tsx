import { useState, useEffect } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useAuth0 } from "@auth0/auth0-react";
import MoviesExplorer from "../components/Movies/MoviesExplorer";
import FavoriteMovie from "../components/FavoriteMovie";

export const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { logout, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect]);

  const header = () => {
    return (
      <div style={{position: 'absolute', right: '10px', top: '12px'}}>
        <Button label='Sign Out' severity='secondary' onClick={() => logout()}></Button>
      </div>
    )
  }

  return (
    <div className="Home">
      <div className="card">
        <Card title='Movie Explorer' header={header}></Card>
      </div>
      <TabView
        className="tabview-header-icon"
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <TabPanel header="Search movies" leftIcon="pi pi-list">
          <MoviesExplorer></MoviesExplorer>
        </TabPanel>
        <TabPanel header="Favorites" leftIcon="pi pi-star">
          <FavoriteMovie></FavoriteMovie>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default Home;
