import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Image, Divider, Message, Icon } from 'semantic-ui-react';
import { uploadImage } from '../../actions/utilActions';
import { createPost } from '../../actions/postActions';
import Axios from 'axios';

export default function CreatePost({ user, setPostList }) {
  const dispatch = useDispatch();

  const [newPost, setNewPost] = useState({ text: '', location: '' });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [highlighted, setHighlighted] = useState(false);
  const [ip, setIP] = useState(null);

  const createNewPost = useSelector((state) => state.createPost);
  const { success, data } = createNewPost;

  const uploadImageCloudinary = useSelector((state) => state.uploadImageCloudinary);
  const { urlData } = uploadImageCloudinary;

  const inputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (e) => {
    const { name, value, files } = e.target;
    setMedia(files[0]);
    setMediaPreview(URL.createObjectURL(files[0]));
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (media) {
      let formData = new FormData();
      formData.set('file', media);
      dispatch(uploadImage(formData));
    } else {
      dispatch(createPost({ ...newPost, picUrl: urlData }));
    }
  };

  const getCurrenIP = async () => {
    const res = await Axios.get('https://geolocation-db.com/json/');
    setIP(res.data.IPv4);
  };

  useEffect(() => {
    getCurrenIP();
  }, []);

  const getCurrentLocation = async (IP) => {
    const { data } = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/util/getlocation/${IP}/LRSUYX0G5P`);
    if (data.response === 'OK') {
      setNewPost((prev) => ({ ...prev, location: data.city_name + ', ' + data.country_name }));
    }
  };

  useEffect(() => {
    if (ip) {
      getCurrentLocation(ip);
    }
  }, [ip]);

  useEffect(() => {
    if (urlData) {
      dispatch(createPost({ ...newPost, picUrl: urlData }));
    }
  }, [urlData]);

  useEffect(() => {
    if (success && data) {
      setLoading(false);
      setPostList((prev) => [data, ...prev]);
    }
  }, [success, data]);

  return (
    <>
      <Form error={error !== null} onSubmit={handleSubmit}>
        <Message error header='Lỗi!' content={error} onDismiss={() => setError(null)} />

        <Form.Group>
          <Image src={user.profilePicUrl} circular avatar inline />
          <Form.TextArea
            placeholder={`${[...user.name.split(' ')].at(-1)} ơi, bạn đang nghĩ gì thế?`}
            name='text'
            value={newPost.text}
            onChange={handleChange}
            rows={4}
            width={14}
          />
        </Form.Group>

        <Form.Group>
          <Form.Input
            value={newPost.location}
            name='location'
            onChange={handleChange}
            label='Thêm vị trí'
            icon='map marker alternate'
            placeholder='Bạn có muốn chia sẻ vị trí không?'
          />
        </Form.Group>

        <Form.Group>
          <input ref={inputRef} onChange={handleMediaChange} name='media' style={{ display: 'none' }} type='file' accept='image/*' />
        </Form.Group>

        <div
          onClick={() => {
            inputRef.current.click();
          }}
          style={{
            textAlign: 'center',
            height: '150px',
            width: '150px',
            border: 'dotted',
            paddingTop: media === null && '60px',
            cursor: 'pointer',
            borderColor: highlighted ? 'green' : 'black',
          }}
          onDrag={(e) => {
            e.preventDefault();
            setHighlighted(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setHighlighted(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setHighlighted(true);
            const dropedFile = Array.from(e.dataTransfer.files);
            setMedia(dropedFile[0]);
            setMediaPreview(URL.createObjectURL(dropedFile[0]));
          }}
        >
          {media === null ? (
            <>
              <Icon name='plus' size='big' />
            </>
          ) : (
            <>
              <Image style={{ height: '150px', width: '150px' }} src={mediaPreview} alt='PostImage' centered size='medium' />
            </>
          )}
        </div>

        <Divider hidden />

        <Button
          circular
          disabled={newPost.text === '' || loading}
          content={<strong>Đăng</strong>}
          style={{ backgroundColor: '#1DA1F2', color: 'white' }}
          icon='send'
          loading={loading}
        />
      </Form>
      <Divider />
    </>
  );
}
