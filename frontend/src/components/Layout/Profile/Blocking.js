import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, List } from 'semantic-ui-react';
import { NoBlockData } from '../NoData';

function Blocking({ userBlock, setActiveItem }) {
  const navigate = useNavigate();

  const [blockList, setBlockList] = useState([]);

  useEffect(() => {
    if (userBlock) {
      setBlockList(userBlock.blocks);
    }
  }, [userBlock]);

  return (
    <>
      {blockList.length > 0 ? (
        blockList.map((block) => {
          return (
            <div key={block.user._id} style={{ marginTop: '30px' }}>
              <List divided verticalAlign='middle'>
                <List.Item>
                  <Image avatar src={block.user.profilePicUrl} />
                  <List.Content
                    as='a'
                    onClick={() => {
                      navigate(`/account/profile/${block.user.username}`);
                      setActiveItem('profile');
                    }}
                  >
                    {block.user.username}
                  </List.Content>
                </List.Item>
              </List>
            </div>
          );
        })
      ) : (
        <>
          <NoBlockData />
        </>
      )}
    </>
  );
}

export default Blocking;
