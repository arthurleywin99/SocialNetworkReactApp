import React from 'react';
import { Grid, Segment, Sticky, Visibility } from 'semantic-ui-react';
import SearchComponent from '../components/Layout/SearchComponent';
import SideMenuComponent from '../components/Layout/SideMenuComponent';
import PostMain from '../components/Post/PostMain';

export default function PostScreen() {
  return (
    <div style={{ marginLeft: '1rem', marginRight: '1rem' }}>
      <Grid>
        <Grid.Column floated='left' width={2}>
          <Sticky>
            <SideMenuComponent />
          </Sticky>
        </Grid.Column>
        <Grid.Column width={10}>
          <Visibility>
            <PostMain />
          </Visibility>
        </Grid.Column>
        <Grid.Column floated='left' width={4}>
          <Sticky>
            <Segment basic>
              <SearchComponent />
            </Segment>
          </Sticky>
        </Grid.Column>
      </Grid>
    </div>
  );
}
