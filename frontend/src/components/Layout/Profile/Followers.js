import React, { useEffect, useState } from "react";
import { Image, List } from "semantic-ui-react";
import { NoFollowData } from "../NoData";
import { useNavigate } from "react-router-dom";

export default function Followers({ userFollowStats, profile, setActiveItem }) {
  const navigate = useNavigate();

  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    if (userFollowStats) {
      setFollowers(userFollowStats.followers);
    }
  }, [userFollowStats]);

  return (
    <>
      {followers.length > 0 ? (
        followers.map((follower) => {
          return (
            <div key={follower.user._id} style={{ marginTop: "30px" }}>
              <List divided verticalAlign="middle">
                <List.Item>
                  <Image avatar src={follower.user.profilePicUrl} />
                  <List.Content
                    as="a"
                    onClick={() => {
                      navigate(`/account/profile/${follower.user.username}`);
                      setActiveItem("profile");
                    }}
                  >
                    {follower.user.username}
                  </List.Content>
                </List.Item>
              </List>
            </div>
          );
        })
      ) : (
        <NoFollowData
          profileName={profile.user.name}
          followersComponent={true}
          followingComponent={false}
        />
      )}
    </>
  );
}
