import { useState, useEffect } from "react";
import { TabView, TabPanel } from "primereact/tabview";
/*New imports */
import { Card } from "primereact/card";
import MoviesExplorer from "../components/Movies/MoviesExplorer";

export const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {}, []);

  return (
    <div className="Home">
      <div className="card">
        <Card title="Movie Explorer"></Card>
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
          {/* favorite movies */}
        </TabPanel>
      </TabView>
    </div>
  );
};

export default Home;
