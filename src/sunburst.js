import { useMemo, useState } from "react";
import { ResponsiveSunburst } from "@nivo/sunburst";
import _ from "lodash";
import {formatLabel} from "./util";

const returnSunburstSubtree = (data, path) => {
  if (!path) return data;

  const parts = path.split(".");

  const parseSubTree = (input, pathIndex) => {
    if (input.children) {
      for (let index = 0; index < input.children.length; index++) {
        if (input.children[index].name === parts[pathIndex]) {
          if (parts.length - 1 === pathIndex)
            return {
              name: parts[pathIndex - 1],
              children: [input.children[index]]
            };
          return parseSubTree(input.children[index], pathIndex + 1);
        }
      }
    }
  };

  return parseSubTree(data, 1);
};

const SunburstChart = ({ transformedData }) => {
  const [sunburstPath, setSunBurstPath] = useState("");
  const sunburstSubTree = useMemo(
    () => returnSunburstSubtree(_.cloneDeep(transformedData), sunburstPath),
    [transformedData, sunburstPath]
  );

  return (
    <div className="sunburst">
      <ResponsiveSunburst
        data={sunburstSubTree}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        id="name"
        value="transformedCount"
        cornerRadius={2}
        borderWidth={2}
        borderColor={"white"}
        colors={{ scheme: "nivo" }}
        childColor={{ from: "color", modifiers: [["brighter", 0.5]] }}
        enableArcLabels={true}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 3]] }}
        arcLabel={formatLabel}
        tooltip={(props) => {
          return (
            <span style={{ backgroundColor: "white", padding: "5px" }}>
              {[...props.path].reverse().join("/")}
              {": "}
              {props.data.count ? props.data.count : props.data.total}
            </span>
          );
        }}
        onClick={(value) => {
          let path = [...value.path].reverse().join(".");
          const oldParts = sunburstPath.split(".");
          const newParts = [...value.path].reverse();

          if (sunburstPath && sunburstPath.endsWith(path)) {
            path = "";
          } else if (oldParts[oldParts.length - 1] === newParts[0])
            path = oldParts
              .concat(newParts.slice(1, newParts.length))
              .join(".");

          setSunBurstPath(path);
        }}
      />
    </div>
  );
};

export default SunburstChart;