import { useMemo, useState } from "react";
import { MenuItem, Select, Tab, Tabs } from "@material-ui/core";
import SankeyChart from "./sankey";
import TreeMapChart from "./treemap";
import SunburstChart from "./sunburst";
import data from "./data";
import _ from "lodash";
import { transformData } from "./util";
import "./styles.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("sankey");
  const [transformationType, setTransformationType] = useState("log2");
  const transformedData = useMemo(
    () => transformData(_.cloneDeep(data), transformationType),
    [transformationType]
  );

  return (
    <div style={{ margin: "20px" }}>
      <div
        style={{
          display: "flex",
          alignContent: "center",
          marginBottom: "16px"
        }}
      >
        <p style={{ paddingRight: "16px" }}>Choose data transformation</p>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={transformationType}
          onChange={(event) => setTransformationType(event.target.value)}
        >
          <MenuItem value="log2">Log2</MenuItem>
          <MenuItem value="log10">Log10</MenuItem>
          <MenuItem value="none">None</MenuItem>
        </Select>
      </div>
      <Tabs
        value={activeTab}
        onChange={(event, value) => {
          setActiveTab(value);
        }}
        aria-label="simple tabs example"
      >
        <Tab value="sankey" label="Sankey Chart" />
        <Tab value="treemap" label="TreeMap Chart" />
        <Tab value="sunburst" label="Sunburst Chart" />
      </Tabs>
      <div hidden={activeTab !== "sankey"}>
        <SankeyChart transformationType={transformationType} />
      </div>
      <div hidden={activeTab !== "treemap"}>
        <TreeMapChart transformedData={transformedData} />
      </div>
      <div hidden={activeTab !== "sunburst"}>
        <SunburstChart transformedData={transformedData} />
      </div>
    </div>
  );
}
