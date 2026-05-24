import { useEffect, useState } from "react";

import Section from "../common/Section";

import {
  getHeatmapData
} from "../../services/logService";

import "../../styles/heatmap.css";

function HeatmapSection() {

  const [heatmap, setHeatmap] =
    useState({});

  useEffect(() => {

    const fetchHeatmap =
      async () => {

        try {

          const data =
            await getHeatmapData();

          setHeatmap(data);

        } catch (error) {

          console.log(error);

        }
      };

    fetchHeatmap();

  }, []);

  return (

    <Section
      title="consistency heatmap"
      subtitle="every square tells a story."
    >

      <div className="heatmap-grid">

        {
          Object.entries(heatmap).map(
            ([date, count]) => (

              <div
                key={date}
                className={`heatmap-cell level-${Math.min(count, 4)}`}
                title={`${count} completions`}
              />

            )
          )
        }

      </div>

    </Section>

  );
}

export default HeatmapSection;