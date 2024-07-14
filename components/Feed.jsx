"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const PromptCardList = ({ data, handleTagClick, handleUserClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
          handleUserClick={handleUserClick}
        />
      ))}
    </div>
  );
};

function Feed() {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const router = useRouter();
  const { data: session } = useSession();

  const handleSearchChange = (value) => {
    const filteredPosts = posts.filter(
      (post) =>
        value === "" ||
        post.tag.includes(value) ||
        post.prompt.includes(value) ||
        post.creator.username.includes(value)
    );
    setDisplayedPosts(filteredPosts);
  };

  useEffect(() => {
    handleSearchChange(searchText);
  }, [searchText]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    setDisplayedPosts(posts);
  }, [posts]);

  const handleUserClick = (userId) => {
    if (session?.user.id === userId) router.push(`/profile`);
    else router.push(`/user/${userId}`);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          name=""
          id=""
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          required
          className="search_input peer"
        />
      </form>
      <PromptCardList
        data={displayedPosts}
        handleTagClick={setSearchText}
        handleUserClick={handleUserClick}
      />
    </section>
  );
}

export default Feed;
