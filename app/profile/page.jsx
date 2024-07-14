"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

function MyProfile() {
  const router = useRouter();
  const { data: session } = useSession();

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();
      setPosts(data);
    };
    if (session?.user.id) fetchPosts();
  }, [session]);

  const handleEdit = (prompt) => {
    router.push(`/update-prompt?id=${prompt._id}`);
  };

  const handleDelete = async (prompt) => {
    const hadConfirmed = confirm("Are you sure you want to delete this post?");

    if (!hadConfirmed) return;

    try {
      await fetch(`/api/prompt/${prompt._id.toString()}`, {
        method: "DELETE",
      });

      const filteredPosts = posts.filter((post) => post._id !== prompt._id);
      setPosts(filteredPosts);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Profile
      name={"My"}
      desc="Welcome to your personalized profile page"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
}

export default MyProfile;
