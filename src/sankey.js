import data from "./sankeyData.json";
import { ResponsiveSankey } from "@nivo/sankey";
import { Chip } from "@nivo/tooltip";
import _ from "lodash";
import { useMemo } from "react";

const transformData = (data, type) => {
  data.links.forEach((link) => {
    if (type === "log2") link.value = Math.log2(link.originalValue) + 1;
    else if (type === "log10") link.value = Math.log10(link.originalValue) + 1;
    else if (type === "none") link.value = link.originalValue;
    else link.value = link.originalValue;
  });

  return data;
};

const SankeyChart = ({ transformationType }) => {
  const transformedData = useMemo(
    () => transformData(_.cloneDeep(data), transformationType),
    [transformationType]
  );

  return (
    <div className="sankey">
      <ResponsiveSankey
        data={transformedData}
        margin={{ top: 8, right: 160, bottom: 40, left: 75 }}
        align="justify"
        colors={{ scheme: "category10" }}
        nodeOpacity={1}
        nodeThickness={18}
        nodeInnerPadding={3}
        nodeSpacing={24}
        nodeBorderWidth={0}
        nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
        linkOpacity={0.5}
        linkHoverOthersOpacity={0.1}
        enableLinkGradient={true}
        labelPosition="outside"
        labelOrientation="horizontal"
        labelPadding={16}
        labelTextColor={{ from: "color", modifiers: [["darker", 1]] }}
        nodeTooltip={(node) => (
          <span>Custom tooltip for node: {node.label}</span>
        )}
        linkTooltip={(link) => {
          return (
            <span style={{ display: "flex", alignContent: "center" }}>
              <Chip color={link.source.color} style={{ margin: "4px" }} />
              <strong>{link.source.label}</strong>
              {" > "}
              <strong>{link.target.label}</strong>
              <Chip color={link.target.color} style={{ margin: "4px" }} />
              <strong style={{ paddingLeft: "4px" }}>
                {link.originalValue}
              </strong>
            </span>
          );
        }}
      />
    </div>
  );
};

export default SankeyChart;
