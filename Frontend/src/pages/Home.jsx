import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Home = ({ type }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const results = await axios.get(
          `http://localhost:3000/api/videos/${type}`,
          {
            withCredentials: true,
          }
        );
        setVideos(results.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchVideos();
  }, [type]);
  return (
    <Container>
      {videos && videos.map((video) => <Card key={video._id} video={video} />)}
    </Container>
  );
};

export default Home;
