import { useState, useEffect } from "react";

const API_ENDPOINT = "http://localhost:5000/api/v1/page/";

export const useFetch = ({ id }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API_ENDPOINT}${id}`);
      const data = await response.json();
      console.log(data);
      setData(data);
    };

    fetchData();
  }, [id]);
  return data;
};
