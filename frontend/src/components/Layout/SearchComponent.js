import React, { useState } from 'react';
import { List, Image, Search, Loader } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { useSelector } from 'react-redux';

export default function SearchComponent() {
  const navigate = useNavigate();

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const { userInfo, loading: userLoginLoading, error } = useSelector((state) => state.userLogin);

  const handleChange = async (e) => {
    setResults([]);
    const { value } = e.target;
    setText(value);
    setLoading(true);

    try {
      const res = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/search/${value}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      if (res.data.length === 0) {
        return setLoading(false);
      }

      setResults(res.data);
    } catch (error) {
      console.log('Lỗi tìm kiếm');
    }
  };

  const ResultRenderer = ({ _id, profilePicUrl, name }) => {
    return (
      <>
        <List key={_id}>
          <List.Item>
            <Image src={profilePicUrl} alt={name} avatar />
            <List.Content header={name} as='a' />
          </List.Item>
        </List>
      </>
    );
  };

  return (
    <>
      {userLoginLoading ? (
        <Loader />
      ) : error ? (
        <Loader />
      ) : (
        <Search
          onBlur={() => {
            results.length > 0 && setResults([]);
            loading && setLoading(false);
            setText('');
          }}
          loading={loading}
          value={text}
          resultRenderer={ResultRenderer}
          results={results}
          onSearchChange={handleChange}
          minCharacters={1}
          onResultSelect={(e, data) => {
            navigate(`/account/profile/${data.result.username}`);
          }}
        />
      )}
    </>
  );
}
