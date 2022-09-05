const axios = require("axios");
const API_PAGE_ENDPOINT = "https://api.notion.com/v1/pages/";
const API_BLOCK_ENDPOINT = "https://api.notion.com/v1/blocks/";

const getPageData = async (id) => {
  try {
    const data = await axios.get(`${API_PAGE_ENDPOINT}${id}`, {
      headers: {
        "Notion-Version": "2022-02-22",
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      },
    });
    return data.data.results || data.data;
  } catch (error) {
    console.log(error);
  }
};

const getBlockData = async (id) => {
  try {
    const data = await axios.get(`${API_BLOCK_ENDPOINT}${id}/children`, {
      headers: {
        "Notion-Version": "2022-02-22",
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      },
    });
    return data.data.results || data.data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getPageData,
  getBlockData,
};
