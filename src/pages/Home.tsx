import { useState, useEffect } from 'react';
import { Tabs, Paper, Grid, Loader, Alert, Title } from '@mantine/core';

interface MediaItem {
  type: 'youtube' | 'bandcamp' | 'soundcloud';
  link: string;
  title?: string;
  artist?: string;
  description?: string;
}

const TABS = ['releases', 'mixes', 'interviews'] as const;

export default function Home() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('releases');
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const renderEmbed = (item: MediaItem) => {
    const commonProps = {
      style: { border: 0, borderRadius: '4px', marginBottom: '1rem' },
      allow: 'encrypted-media; fullscreen',
    };

    switch (item.type) {
      case 'youtube':
        return (
          <iframe
            {...commonProps}
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${extractYoutubeId(item.link)}`}
            allowFullScreen
          />
        );

      case 'soundcloud':
        return (
          <iframe
            {...commonProps}
            width="100%"
            height="166"
            scrolling="no"
            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(item.link)}`}
          />
        );

      case 'bandcamp':
        return (
          <iframe
            {...commonProps}
            src={`https://bandcamp.com/EmbeddedPlayer/track=${extractBandcampId(item.link)}/size=large/bgcol=333333/linkcol=ffffff/artwork=none/`}
            height="310"
            width="100%"
          />
        );

      default:
        return <Alert color="red">Unsupported media type</Alert>;
    }
  };

  return (
    <Paper p="md" radius="md">
      <Title order={2} mb="xl" /* align="center" */>
        Dungeon Synth Archive
      </Title>

      <Tabs value={activeTab} /* onChange={(t: typeof TABS[number]) => setActiveTab(t)} */>
        <Tabs.List grow>
          {TABS.map((tab) => (
            <Tabs.Tab key={tab} value={tab}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {TABS.map((tab) => (
          <Tabs.Panel key={tab} value={tab} pt="lg">
            {loading ? (
              <Loader size="xl" variant="bars" mx="auto" display="block" />
            ) : error ? (
              <Alert color="red" title="Error">
                {error}
              </Alert>
            ) : (
              <Grid>
                {content.map((item, index) => (
                  <Grid.Col key={index} /* md={6} lg={4} */>
                    <Paper p="md" withBorder radius="md">
                      {renderEmbed(item)}
                      {item.title && <Title order={4}>{item.title}</Title>}
                      {item.artist && <div>{item.artist}</div>}
                      {item.description && (
                        <div style={{ opacity: 0.8 }}>{item.description}</div>
                      )}
                    </Paper>
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </Tabs.Panel>
        ))}
      </Tabs>
    </Paper>
  );
}

// Helper functions for ID extraction
const extractYoutubeId = (url: string) =>
  url.split(/v=|\/embed\/|\.be\//)[1]?.split(/[?&]/)[0] || '';

const extractBandcampId = (url: string) =>
  url.split(/track=|\/album\//)[1]?.split(/\/|&/)[0] || '';

