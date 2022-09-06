export const getListGroup = (blocks) => {
  let output = [];
  let lastType = undefined;
  let index = -1;

  Object.keys(blocks).forEach((blockId) => {
    let childrenBlock = [];
    if (
      blocks[blockId].value.children &&
      Object.keys(blocks[blockId].value.children).length
    ) {
      childrenBlock.push(...getListGroup(blocks[blockId].value.children));
    }
    output = [...output, ...childrenBlock];
    if (blocks[blockId].value.type !== lastType) {
      index = output.length;
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
