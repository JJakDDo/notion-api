export const getListGroup = (blocks) => {
  const output = [];
  let lastType = undefined;
  let index = -1;

  Object.keys(blocks).forEach((blockId) => {
    if (blocks[blockId].value.type !== lastType) {
      index++;
      output[index] = [blockId];
      lastType = blocks[blockId].value.type;
    } else {
      output[index].push(blockId);
    }
  });

  return output;
};

export const findListGroupIndex = (blockGroup, id) => {
  const group = blockGroup.find((bg) => bg.includes(id));
  if (group) {
    return group.indexOf(id) + 1;
  }
};
