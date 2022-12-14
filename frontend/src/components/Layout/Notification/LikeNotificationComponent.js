import React from "react";
import { Feed, Image } from "semantic-ui-react";
import { calculateTime } from "../../../utils/utils";
import { Link } from "react-router-dom";

export default function LikeNotificationComponent({ notification }) {
  return (
    <>
      <Feed>
        <Feed.Event>
          <Feed.Label>
            <Image src={notification.user.profilePicUrl} avatar />
          </Feed.Label>
          <Feed.Content>
            <Feed.Summary>
              <>
                <Feed.User as="a">
                  <Link to={`/account/profile/${notification.user.username}`}>
                    {notification.user.username}
                  </Link>
                </Feed.User>{" "}
                đã thích một{" "}
                <Link to={`/post/${notification.post._id}`}>bài viết</Link>
                <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
              </>
            </Feed.Summary>

            {notification.post.picUrl && (
              <Feed.Extra images>
                <a href={`/post/${notification.post._id}`}>
                  <img src={notification.post.picUrl} alt="images" />
                </a>
              </Feed.Extra>
            )}
          </Feed.Content>
        </Feed.Event>
      </Feed>
      <br />
    </>
  );
}
