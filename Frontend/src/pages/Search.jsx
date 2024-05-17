import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Search = () => {
  const [videos, setVideos] = useState([]);
  const query = useLocation().search;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/videos/search${query}`
        );

        console.log(res.data)

        setVideos(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchVideos();
  }, [query]);

  return (
    <Container>
      {videos && videos.map((vid) => <Card key={vid._id} video={vid} />)}
    </Container>
  );
};

export default Search;
