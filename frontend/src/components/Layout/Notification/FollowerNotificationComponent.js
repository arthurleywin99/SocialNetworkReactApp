import React from "react";
import { Feed, Image } from "semantic-ui-react";
import { calculateTime } from "../../../utils/utils";
import { Link } from "react-router-dom";

export default function FollowerNotificationComponent({ notification }) {
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
                đã bắt đầu theo dõi bạn.
                <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
              </>
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
      </Feed>
      <br />
    </>
  );
}
