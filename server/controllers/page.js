const { getPageData, getBlockData } = require("../api/notion");

const parsePage = (page) => {
  return {
    [page.id]: {
      value: {
        id: page.id,
        type: page.object,
        properties: {
          title: {
            text: page.properties.title.title[0].text.content,
          },
        },
      },
    },
  };
};

const parseBlock = async (block) => {
  const title = [];
  let children = {};
  if (block.has_children) {
    const childrenBlock = await getBlockData(block.id);
    const temp = [];
    for (const child of childrenBlock) {
      temp.push(parseBlock(child));
    }

    const newTemp = await Promise.all(temp);
    for (let i = 0; i < newTemp.length; i++) {
      children = { ...children, ...newTemp[i] };
    }
  }
  if (block.type === "child_page") {
    return {
      [block.id]: {
        value: {
          id: block.id,
          type: block.type,
          properties: {
            title: [{ text: block["child_page"].title }],
          },
          children,
        },
      },
    };
  }

  if (block.type === "divider") {
    return {
      [block.id]: {
        value: {
          id: block.id,
          type: block.type,
        },
      },
    };
  }
  const texts = block[block.type]?.rich_text || [];
  for (let i = 0; i < texts.length; i++) {
    title.push({
      text: texts[i].text.content,
      annotations: texts[i].annotations,
      href: texts[i].href,
    });
  }

  if (block.type === "to_do") {
    return {
      [block.id]: {
        value: {
          id: block.id,
          type: block.type,
          properties: {
            title: [...title],
            checked: block["to_do"].checked,
          },
          children,
        },
      },
    };
  }
  return {
    [block.id]: {
      value: {
        id: block.id,
        type: block.type,
        properties: {
          title: [...title],
        },
        children,
      },
    },
  };
};

const getPage = async (req, res) => {
  const {
    params: { id },
  } = req;
  let responseData = {};
  const [page, blocks] = await Promise.all([getPageData(id), getBlockData(id)]);
  responseData = { ...responseData, ...parsePage(page) };
  const parsedBlock = [];
  for (const block of blocks) {
    parsedBlock.push(parseBlock(block));
  }
  //responseData = { ...responseData, ...parsedBlock };
  const newBlocks = await Promise.all(parsedBlock);
  for (let i = 0; i < newBlocks.length; i++) {
    responseData = { ...responseData, ...newBlocks[i] };
  }
  res.status(200).json({ ...responseData });
};

module.exports = {
  getPage,
};
