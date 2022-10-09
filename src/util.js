export const formatLabel = (value) => {
  const name = value.data.name.split("/")[2];

  if (!name) return value.id;
  else if (name === "Unknown")
    return value.data.name.split("/").slice(0, -1).join("/");
  else return name.split(":")[0];
};

export const transformData = (inputData, type) => {
  Object.keys(inputData).forEach((key) => {
    if (key === "children") {
      inputData.children.forEach((child) => {
        transformData(child, type);
      });
    } else if (key === "count") {
      if (type === "log2")
        inputData.transformedCount = Math.log2(inputData.count) + 1;
      else if (type === "log10")
        inputData.transformedCount = Math.log10(inputData.count) + 1;
      else if (type === "none") inputData.transformedCount = inputData.count;
      else inputData.transformedCount = inputData.count;
    }
  });

  return inputData;
};
