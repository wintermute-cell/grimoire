import { useState, useEffect } from 'react';
import { Tabs, Paper, Grid, Loader, Alert, Title, useMantineTheme, Container } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

interface MediaItem {
  type: 'youtube' | 'bandcamp' | 'soundcloud';
  link: string;
  title?: string;
  artist?: string;
  description?: string;
}

const TABS = ['releases', 'mixes', 'interviews'] as const;

export default function Home() {
  const theme = useMantineTheme();
  const [activeTab, setActiveTab] = useState<string | null>('releases');
  const [content, setContent] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://raw.githubusercontent.com/wintermute-cell/grimoire/master/content/${activeTab}.json`
        );

        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();
        setContent(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
        Notifications.show({
          title: 'Manifestation Failure',
          message: 'The runes resist interpretation',
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const renderEmbed = (item: MediaItem) => {
    const isVertical = item.type === 'bandcamp';

    return (
      <Paper
        style={{
          borderColor: theme.colors.dark[4],
        }}
      >
        <div style={{
          position: 'relative',
          paddingBottom: isVertical ? '120%' : '56.25%',
          height: 0,
          overflow: 'hidden'
        }}>
          <iframe
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0
            }}
            src={(() => {
              switch (item.type) {
                case 'youtube':
                  return `https://www.youtube.com/embed/${extractYoutubeId(item.link)}`;
                case 'soundcloud':
                  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(item.link)}`;
                case 'bandcamp':
                  return `https://bandcamp.com/EmbeddedPlayer/track=${extractBandcampId(item.link)}/size=large/bgcol=333333/linkcol=ffffff/artwork=none/`;
              }
            })()}
            allow="encrypted-media; fullscreen"
          />
        </div>

        <Container p="md">
          {item.title && (
            <Title
              order={4}
              style={{
                fontFamily: 'Georama, sans-serif',
                letterSpacing: '0.05em',
              }}
            >
              {item.title}
            </Title>
          )}

          {item.artist && (
            <div style={{
              fontFamily: 'Georama, sans-serif',
              fontSize: theme.fontSizes.sm,
              fontWeight: 500,
              marginBottom: theme.spacing.xs
            }}>
              {item.artist}
            </div>
          )}

          {item.description && (
            <div style={{
              fontSize: theme.fontSizes.sm,
              color: theme.colors.dark[3],
              lineHeight: 1.4
            }}>
              {item.description}
            </div>
          )}
        </Container>
      </Paper>
    );
  };

  return (
    <Container size="md" py="xl">
      <Title
        order={1}
        style={{
          fontFamily: 'Cormorant SC, serif',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textAlign: 'center',
          marginBottom: '1.5em',
          color: theme.colors.dark[1]
        }}
      >
        GRIMOIRE
        <div style={{
          fontSize: theme.fontSizes.sm,
          fontWeight: 400,
          letterSpacing: '0.2em',
          marginTop: theme.spacing.xs,
          color: theme.colors.dark[3]
        }}>
          ARCHIVUM SONORUM OCCULTUM
        </div>
      </Title>

      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        variant="default"
      >
        <Tabs.List style={{ borderBottom: `1px solid ${theme.colors.dark[4]}` }}>
          {TABS.map((tab) => (
            <Tabs.Tab
              key={tab}
              value={tab}
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: theme.fontSizes.sm,
                padding: '0.5em 1em',
                borderBottom: '2px solid transparent',
                color: activeTab === tab ? theme.colors.dark[2] : theme.colors.dark[0],
                ...(activeTab === tab && {
                  borderBottomColor: theme.colors.dark[2]
                })
              }}
            >
              {tab}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {TABS.map((tab) => (
          <Tabs.Panel key={tab} value={tab} pt="xl">
            {loading ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '1.5em'
              }}>
                <Loader size="lg" variant="dots" />
              </div>
            ) : error ? (
              <Alert
                color="red"
                variant="filled"
                title="Chamber Sealed"
                style={{ marginBottom: theme.spacing.xl }}
              >
                {error}
              </Alert>
            ) : (
              <Grid gutter="xl">
                {content.map((item, index) => (
                  <Grid.Col key={index} span={12}>
                    {renderEmbed(item)}
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </Tabs.Panel>
        ))}
      </Tabs>
    </Container>
  );
}

// Helper functions for ID extraction
const extractYoutubeId = (url: string) =>
  url.split(/v=|\/embed\/|\.be\//)[1]?.split(/[?&]/)[0] || '';

const extractBandcampId = (url: string) =>
  url.split(/track=|\/album\//)[1]?.split(/\/|&/)[0] || '';

