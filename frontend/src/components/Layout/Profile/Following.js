import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, List } from "semantic-ui-react";
import { NoFollowData } from "../NoData";

export default function Following({ userFollowStats, profile, setActiveItem }) {
  const navigate = useNavigate();

  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (userFollowStats) {
      setFollowing(userFollowStats.following);
    }
  }, [userFollowStats]);

  return (
    <>
      {following.length > 0 ? (
        following.map((followed) => {
          return (
            <div key={followed.user._id} style={{ marginTop: "30px" }}>
              <List divided verticalAlign="middle">
                <List.Item>
                  <Image avatar src={followed.user.profilePicUrl} />
                  <List.Content
                    as="a"
                    onClick={() => {
                      navigate(`/account/profile/${followed.user.username}`);
                      setActiveItem("profile");
                    }}
                  >
                    {followed.user.username}
                  </List.Content>
                </List.Item>
              </List>
            </div>
          );
        })
      ) : (
        <NoFollowData
          profileName={profile.user.name}
          followersComponent={false}
          followingComponent={true}
        />
      )}
    </>
  );
}
