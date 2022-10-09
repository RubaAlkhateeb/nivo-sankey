import { ResponsiveTreeMap } from "@nivo/treemap";
import { useMemo, useState } from "react";
import _ from "lodash";
import { formatLabel } from "./util";

const returnTreemapSubtree = (data, path) => {
  if (!path) return data;

  const parts = path.split(".");

  const parseSubTree = (input, pathIndex) => {
    if (input.children) {
      for (let index = 0; index < input.children.length; index++) {
        if (input.children[index].name === parts[pathIndex])
          return parseSubTree(input.children[index], pathIndex + 1);
      }
    }

    if (parts.length === pathIndex) return input;
  };

  return parseSubTree(data, 1);
};

const TreeMapChart = ({ transformedData }) => {
  const [treemapPath, setTreemapPath] = useState("");
  const treemapSubTree = useMemo(
    () => returnTreemapSubtree(_.cloneDeep(transformedData), treemapPath),
    [transformedData, treemapPath]
  );

  return (
    <div className="treemap">
      <ResponsiveTreeMap
        onClick={(value) => {
          let path = value.path;
          const oldParts = treemapPath.split(".");
          const newParts = value.path.split(".");

          if (treemapPath && treemapPath.endsWith(value.path)) {
            path = "";
          } else if (oldParts[oldParts.length - 1] === newParts[0])
            path = oldParts
              .concat(newParts.slice(1, newParts.length))
              .join(".");

          setTreemapPath(path);
        }}
        data={treemapSubTree}
        identity="name"
        value="transformedCount"
        valueFormat=".02s"
        label={formatLabel}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        labelSkipSize={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        parentLabelTextColor={{ from: "color", modifiers: [["darker", 4]] }}
        borderWidth={2}
        borderColor={"white"}
        tooltip={({ node }) => {
          return (
            <span>
              {node.pathComponents.join("/")}:{" "}
              {node.data.count ? node.data.count : node.data.total}
            </span>
          );
        }}
      />
    </div>
  );
};

export default TreeMapChart;
