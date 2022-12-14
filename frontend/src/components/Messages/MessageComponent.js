import React, { useState } from "react";
import { Icon, Popup } from "semantic-ui-react";
import { calculateTime } from "../../utils/utils";

export default function MessageComponent({
  divRef,
  message,
  user,
  bannerProfilePic,
  deleteMsg,
}) {
  const [setDeleteIcon, setShowDeleteIcon] = useState(false);

  const isYouSender = message.sender === user._id;

  const handleClick = () => {
    isYouSender && setShowDeleteIcon(!setDeleteIcon);
  };

  return (
    <div className="bubbleWrapper" ref={divRef}>
      <div
        className={isYouSender ? "inlineContainer own" : "inlineContainer"}
        onClick={handleClick}
      >
        <img
          className="inlineIcon"
          alt="Profile"
          src={isYouSender ? user.profilePicUrl : bannerProfilePic}
        />
        <div className={isYouSender ? "ownBubble own" : "otherBubble other"}>
          {message.msg}
        </div>
        {setDeleteIcon && (
          <Popup
            trigger={
              <Icon
                name="trash"
                color="red"
                style={{ cursor: "pointer" }}
                onClick={() => deleteMsg(message._id)}
              />
            }
            content="Chúng tôi sẽ gỡ tin nhắn này ở phía bạn. Những người khác trong đoạn chat vẫn có thể xem được!"
            position="top right"
          />
        )}
      </div>
      <span className={isYouSender ? "own" : "other"}>
        {calculateTime(message.date)}
      </span>
    </div>
  );
}
