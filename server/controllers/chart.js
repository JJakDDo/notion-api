const axios = require("axios");
const fs = require("fs");

function getData() {
  return new Promise(async (resolve, reject) => {
    try {
      const today = new Date();
      const day = today.getDate();
      const weekAgo = new Date(
        new Date().setDate(day - 7)
      ).toLocaleDateString();
      const newDate = weekAgo.replace(/\. /g, "-").replace(".", "");
      const response = await axios.get(
        `https://tessverso.io/koex/api/stat/korbit/btc/minute?from=${newDate}`
      );

      resolve(
        response.data.map((item) => {
          return [item.date, item.close];
        })
      );
    } catch (error) {
      reject(error);
    }
  });
}

const generateChart = async (req, res) => {
  let svg = [];
  const data = await getData();
  const hourlyData = data
    .filter((item) => {
      const date = new Date(item[0]);
      const minutes = date.getMinutes();
      return minutes === 0;
    })
    .map((item) => item[1]);
  svg.push(
    `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
          <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
          <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" height="48px" version="1.1" viewBox="0 0 164 48" width="164px" x="0px" y="0px">

          <defs>
            <clipPath id="clip">
              <rect height="48" width="164" x="0" y="0"></rect>
            </clipPath>
          </defs>

          <rect height="48" style="fill:rgb(255,255,255);fill-opacity:0;stroke:none;" width="164" x="0" y="0"></rect>
          <g clip-path="url(#clip)">`
  );

  const max = Math.max(...hourlyData);
  const min = Math.min(...hourlyData);
  let widthFactor = 160 / (hourlyData.length - 1);
  for (let i = 0; i < hourlyData.length - 1; i++) {
    svg.push(`
            <line style="fill:none;stroke:rgb(237,194,64);stroke-width:2;stroke-miterlimit:10;stroke-linecap:round;" x1="${
              widthFactor * i + 2
            }" x2="${widthFactor * (i + 1) + 2}" y1="${
      ((hourlyData[i] - max) / (min - max)) * 44 + 2
    }" y2="${((hourlyData[i + 1] - max) / (min - max)) * 44 + 2}"></line>
          `);
  }
  svg.push(`
        </g>
        </svg>
      `);

  fs.writeFile(
    "./public/chart/chart.svg",
    svg.join("").replace(/\n/g, ""),
    (err) => {
      if (err) throw err;

      console.log("SVG written");

      fs.readFile("./public/chart/chart.svg", (err, data) => {
        if (err) throw err;

        // res.set({
        //   "content-type": "img/svg+xml",
        // });
        res.writeHead(201, { "content-type": "img/svg+xml" });
        res.end(data);
      });
    }
  );
};

module.exports = {
  generateChart,
};
