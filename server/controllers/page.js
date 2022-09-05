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
    for (const child of childrenBlock) {
      const temp = await parseBlock(child);
      children = { ...children, ...temp };
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
  const page = await getPageData(id);
  responseData = { ...responseData, ...parsePage(page) };
  const blocks = await getBlockData(id);
  for (const block of blocks) {
    const parsedBlock = await parseBlock(block);
    responseData = { ...responseData, ...parsedBlock };
  }
  res.status(200).json({ ...responseData });
};

module.exports = {
  getPage,
};
