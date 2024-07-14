"use client";
import { useState, useEffect } from "react";

import Profile from "@components/Profile";

function OtherProfile({ params }) {
  const userId = params.id;
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      setUser(data);
    };
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${userId}/posts`);
      const data = await response.json();
      setPosts(data);
    };
    if (userId) {
      fetchUser();
      fetchPosts();
    }
  }, [userId]);

  return (
    user && (
      <Profile
        name={user.name}
        desc={`Welcome to ${user.name}'s profile page`}
        data={posts}
      />
    )
  );
}

export default OtherProfile;
