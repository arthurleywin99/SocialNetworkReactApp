import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Popup, Image, Button } from 'semantic-ui-react';
import { getLikesList } from '../../actions/postActions';
import { LikesPlaceHolder } from '../Layout/PlaceHolderGroup';
import { Link } from 'react-router-dom';

export default function LikesList({ postId, trigger }) {
  const dispatch = useDispatch();

  const getLikes = useSelector((state) => state.getLikesList);
  const { likes, error } = getLikes;

  const [likesList, setLikesList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (likes) {
      setLikesList(likes);
      setLoading(false);
    }
  }, [likes]);

  const handleClose = () => setLikesList([]);

  const handleOpen = () => {
    setLoading(true);
    dispatch(getLikesList(postId));
  };

  return (
    <Popup on='click' onClose={handleClose} onOpen={handleOpen} popperDependencies={[likesList]} trigger={trigger} wide>
      {loading ? (
        <LikesPlaceHolder />
      ) : (
        <>
          {likesList.length > 0 && (
            <div
              style={{
                overflow: 'auto',
                maxHeight: '15rem',
                height: '15rem',
                minWidth: '210px',
              }}
            >
              <Button
                color='red'
                content='Lượt thích'
                icon='heart'
                label={{
                  basic: true,
                  color: 'red',
                  pointing: 'left',
                  content: `${likesList.length}`,
                }}
              />
              <List selection size='large'>
                {likesList.map((like) => (
                  <List.Item key={like._id}>
                    <Image avatar src={like.user.profilePicUrl} />
                    <List.Content>
                      <Link to={`/${like.user.username}`}>
                        <List.Header as='a' content={like.user.name}></List.Header>
                      </Link>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </div>
          )}
        </>
      )}
    </Popup>
  );
}
