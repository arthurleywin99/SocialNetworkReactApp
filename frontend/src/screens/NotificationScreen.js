import React from 'react';
import { Visibility, Grid, Sticky, Segment } from 'semantic-ui-react';
import SideMenuComponent from '../components/Layout/SideMenuComponent';
import SearchComponent from '../components/Layout/SearchComponent';
import NotificationMain from '../components/Layout/Notification/NotificationMain';
import { createMedia } from '@artsy/fresnel';
import MobileHeader from '../components/Layout/MobileHeader';

const AppMedia = createMedia({
  breakpoints: { zero: 0, mobile: 549, tablet: 850, computer: 1080 },
});
const mediaStyles = AppMedia.createMediaStyle();
const { Media, MediaContextProvider } = AppMedia;

export default function NotificationScreen() {
  return (
    <>
      <style>{mediaStyles}</style>
      <MediaContextProvider>
        <div style={{ marginLeft: '1rem', marginRight: '1rem' }}>
          <Media greaterThanOrEqual='computer'>
            <Grid>
              <Grid.Column floated='left' width={2}>
                <Sticky>
                  <SideMenuComponent pc={true} />
                </Sticky>
              </Grid.Column>
              <Grid.Column width={10}>
                <Visibility>
                  <NotificationMain />
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
          </Media>

          <Media between={['tablet', 'computer']}>
            <Grid>
              <Grid.Column floated='left' width={1}>
                <Sticky>
                  <SideMenuComponent pc={false} />
                </Sticky>
              </Grid.Column>
              <Grid.Column width={15}>
                <Visibility>
                  <NotificationMain />
                </Visibility>
              </Grid.Column>
            </Grid>
          </Media>

          <Media between={['mobile', 'tablet']}>
            <Grid>
              <Grid.Column floated='left' width={2}>
                <Sticky>
                  <SideMenuComponent pc={false} />
                </Sticky>
              </Grid.Column>
              <Grid.Column width={14}>
                <Visibility>
                  <NotificationMain />
                </Visibility>
              </Grid.Column>
            </Grid>
          </Media>

          <Media between={['zero', 'mobile']}>
            <MobileHeader />
            <Sticky>
              <Segment basic>
                <SearchComponent />
              </Segment>
            </Sticky>
            <Visibility>
              <NotificationMain />
            </Visibility>
          </Media>
        </div>
      </MediaContextProvider>
    </>
  );
}
