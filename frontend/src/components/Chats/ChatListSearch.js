import React, { useState } from "react";
import { Image, List, Search } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

export default function ChatListSearch({ chats, setChats, token }) {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    const { value } = e.target;
    setText(value);
    setLoading(true);

    try {
      const res = await Axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/search/${value}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.length === 0) {
        return setLoading(false);
      }

      setResults(res.data);
    } catch (error) {
      console.log("Error searching");
    }
  };

  const addChat = (result) => {
    const alreadyInChat =
      chats &&
      chats.length > 0 &&
      chats.filter((chat) => chat.messagesWith === result._id).length > 0;

    if (alreadyInChat) {
      return navigate(`/messages?message=${result._id}`);
    } else {
      const newChat = {
        messagesWith: result._id,
        name: result.name,
        profilePicUrl: result.profilePicUrl,
        lastMessage: "",
        date: Date.now(),
      };

      setChats((prev) => [newChat, ...prev]);
      return navigate(`/messages?message=${result._id}`);
    }
  };

  const ResultRenderer = ({ _id, profilePicUrl, name }) => {
    return (
      <>
        <List key={_id}>
          <List.Item>
            <Image src={profilePicUrl} alt={name} avatar />
            <List.Content header={name} as="a" />
          </List.Item>
        </List>
      </>
    );
  };

  return (
    <>
      <Search
        onBlur={() => {
          results.length > 0 && setResults([]);
          loading && setLoading(false);
          setText("");
        }}
        loading={loading}
        value={text}
        resultRenderer={ResultRenderer}
        results={results}
        onSearchChange={handleChange}
        minCharacters={1}
        onResultSelect={(e, data) => {
          addChat(data.result);
        }}
      />
    </>
  );
}
