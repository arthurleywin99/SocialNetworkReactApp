import React from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Segment, Image, Icon, Header } from 'semantic-ui-react';

export default function ImageDropComponent({
  mediaPreview,
  setMediaPreview,
  highlighted,
  setHighlighted,
  inputRef,
  handleMediaChange,
  setMedia,
  profilePicUrl,
}) {
  const location = useLocation();
  const signUpRoute = location.pathname === '/signup';

  return (
    <>
      <Form.Field>
        <Segment placeholder basic secondary>
          <input
            style={{ display: 'none' }}
            type='file'
            accept='image/*'
            onChange={handleMediaChange}
            name='media'
            ref={inputRef}
          />
          <div
            onDragOver={(e) => {
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
            {mediaPreview === null ? (
              <>
                <Segment color={highlighted ? 'green' : ''} placeholder basic>
                  {signUpRoute ? (
                    <Header icon>
                      <Icon
                        name='file image outline'
                        style={{ cursor: 'pointer' }}
                        onClick={() => inputRef.current.click()}
                      />
                      Kéo thả hoặc chọn ảnh từ thư viện
                    </Header>
                  ) : (
                    <span style={{ textAlign: 'center' }}>
                      <Image
                        src={profilePicUrl}
                        style={{ cursor: 'pointer' }}
                        onClick={() => inputRef.current.click()}
                        size='huge'
                        centered
                      />
                    </span>
                  )}
                </Segment>
              </>
            ) : (
              <>
                <Segment color='green' placeholder basic>
                  <Image
                    src={mediaPreview}
                    size='medium'
                    centered
                    style={{ cursor: 'pointer' }}
                    onClick={() => inputRef.current.click()}
                  />
                </Segment>
              </>
            )}
          </div>
        </Segment>
      </Form.Field>
    </>
  );
}
