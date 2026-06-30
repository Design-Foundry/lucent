import { useState } from 'react';
import {
  ActivityBar, Avatar, Breadcrumbs, Button, Card, Checkbox, Chip, Icon, IconButton,
  InlineInput, List, ListItem, Menu, MenuDivider, MenuItem, MenuTrigger, Modal, NavDivider,
  NavIcon, NavRail, Select, Snackbar, StatusTag, Tab, TabList, Tag, TextInput, Toast, Toggle, Tooltip,
  type BreadcrumbItem, type SelectOption,
} from '@design-foundry/lucent-react';

type Theme = 'light' | 'dark';

const SELECT_OPTIONS: SelectOption[] = [
  { label: 'Production', value: 'prod' },
  { label: 'Staging', value: 'staging' },
  { label: 'Development', value: 'dev' },
];

const CRUMBS: BreadcrumbItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Settings', path: '/settings' },
  { label: 'Profile' },
];

export function App() {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.dataset.theme as Theme) ?? 'light');
  const toggleTheme = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.dataset.theme = next;
  };

  const [on, setOn] = useState(true);
  const [smallOn, setSmallOn] = useState(true);
  const [checked, setChecked] = useState(true);
  const [smallChecked, setSmallChecked] = useState(true);
  const [env, setEnv] = useState<unknown>(null);
  const [search, setSearch] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="sc-header">
        <h1 className="sc-header__title">Lucent <small>· React showcase</small></h1>
        <button className="sc-theme-toggle" type="button" onClick={toggleTheme}>
          <span className="material-icons" style={{ fontSize: 18 }}>{theme === 'light' ? 'dark_mode' : 'light_mode'}</span>
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </header>

      <main className="sc-main">
        {/* ── Tier 1 ──────────────────────────────────────────────────────── */}
        <section className="sc-section">
          <p className="sc-section__head">Tier 1</p>
          <h2 className="sc-section__title">Primitives</h2>
          <div className="sc-card">
            <div className="sc-label">Icon — sizes</div>
            <div className="sc-row">
              <Icon name="settings" size="sm" /><Icon name="settings" size="md" />
              <Icon name="settings" size="lg" /><Icon name="rocket_launch" size="lg" />
            </div>
            <div className="sc-label">Tag</div>
            <div className="sc-row"><Tag>Default</Tag><Tag>v1.2.0</Tag></div>
            <div className="sc-label">Status tag</div>
            <div className="sc-row">
              <StatusTag variant="success" label="Success" /><StatusTag variant="neutral" label="Neutral" />
              <StatusTag variant="warning" label="Warning" /><StatusTag variant="error" label="Error" />
            </div>
            <div className="sc-label">Tooltip (hover / focus the button)</div>
            <div className="sc-row">
              <Tooltip content="Saves your changes"><Button variant="secondary">Hover me</Button></Tooltip>
            </div>
          </div>
        </section>

        {/* ── Tier 2 ──────────────────────────────────────────────────────── */}
        <section className="sc-section">
          <p className="sc-section__head">Tier 2</p>
          <h2 className="sc-section__title">Actions &amp; controls</h2>
          <div className="sc-card">
            <div className="sc-label">Button — variants</div>
            <div className="sc-row">
              <Button variant="primary">Primary</Button><Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button><Button variant="danger">Danger</Button><Button variant="text">Text</Button>
            </div>
            <div className="sc-label">Button — sizes &amp; states</div>
            <div className="sc-row">
              <Button size="xs">XS</Button><Button size="sm">SM</Button><Button size="md">MD</Button><Button size="lg">LG</Button>
              <Button loading>Loading</Button><Button disabled>Disabled</Button>
              <Button variant="primary" prefix={<Icon name="add" size="sm" />}>With icon</Button>
            </div>
            <div className="sc-label">Icon button</div>
            <div className="sc-row">
              <IconButton icon="favorite" variant="primary" ariaLabel="Like" />
              <IconButton icon="edit" variant="secondary" ariaLabel="Edit" />
              <IconButton icon="more_vert" variant="ghost" ariaLabel="More" />
              <IconButton icon="delete" variant="danger" ariaLabel="Delete" />
              <IconButton icon="sync" loading ariaLabel="Loading" />
            </div>
            <div className="sc-label">Toggle</div>
            <div className="sc-row">
              <Toggle label="Off" checked={false} onChange={() => {}} />
              <Toggle label="On" checked={on} onChange={setOn} />
              <Toggle label="Small" size="sm" checked={smallOn} onChange={setSmallOn} />
            </div>
            <div className="sc-label">Checkbox</div>
            <div className="sc-row">
              <Checkbox label="Unchecked" checked={false} onChange={() => {}} />
              <Checkbox label="Checked" checked={checked} onChange={setChecked} />
              <Checkbox label="Indeterminate" indeterminate checked={false} onChange={() => {}} />
              <Checkbox label="Small" size="sm" checked={smallChecked} onChange={setSmallChecked} />
            </div>
            <div className="sc-label">Chip</div>
            <div className="sc-row">
              <Chip label="Default" /><Chip label="Active" type="active" /><Chip label="Tag" type="tag" />
              <Chip label="Removable" type="action" /><Chip label="Small" type="action" size="sm" />
            </div>
          </div>
        </section>

        {/* ── Tier 3 ──────────────────────────────────────────────────────── */}
        <section className="sc-section">
          <p className="sc-section__head">Tier 3</p>
          <h2 className="sc-section__title">Navigation</h2>
          <div className="sc-card">
            <div className="sc-label">Breadcrumbs</div>
            <div className="sc-row"><Breadcrumbs items={CRUMBS} /></div>
            <div className="sc-label">Nav rail (with activity bar)</div>
            <div className="sc-row" style={{ alignItems: 'stretch' }}>
              <NavRail>
                <NavIcon name="dashboard" active ariaLabel="Dashboard" />
                <NavIcon name="folder" ariaLabel="Files" />
                <NavIcon name="group" ariaLabel="Team" />
                <NavDivider />
                <NavIcon name="settings" ariaLabel="Settings" />
              </NavRail>
              <ActivityBar>
                <NavIcon name="search" ariaLabel="Search" />
                <NavIcon name="notifications" active ariaLabel="Alerts" />
                <NavIcon name="help" ariaLabel="Help" />
              </ActivityBar>
            </div>
          </div>
        </section>

        {/* ── Tier 4 ──────────────────────────────────────────────────────── */}
        <section className="sc-section">
          <p className="sc-section__head">Tier 4</p>
          <h2 className="sc-section__title">Inputs &amp; data entry</h2>
          <div className="sc-card">
            <div className="sc-row" style={{ alignItems: 'flex-start' }}>
              <div className="sc-col" style={{ minWidth: 260 }}>
                <div className="sc-label">Input</div>
                <TextInput placeholder="you@example.com" label="Email" hint="We'll never share it." />
                <TextInput placeholder="Search…" clearable value={search} onChange={setSearch} prefix={<Icon name="search" size="sm" />} />
                <TextInput placeholder="Invalid" label="Username" error="Already taken." />
              </div>
              <div className="sc-col" style={{ minWidth: 260 }}>
                <div className="sc-label">Select</div>
                <Select placeholder="Choose environment" options={SELECT_OPTIONS} value={env} onChange={setEnv}
                  label="Environment" hint="Pick a deployment target." />
                <div className="sc-label" style={{ marginTop: 12 }}>Inline input</div>
                <InlineInput placeholder="Untitled document" typography="heading" value={docTitle} onChange={setDocTitle} />
              </div>
              <div className="sc-col">
                <div className="sc-label">Avatar</div>
                <div className="sc-row">
                  <Avatar name="Diego Cancho" scale="sm" />
                  <Avatar name="Ada Lovelace" scale="md" />
                  <Avatar name="Grace Hopper" tenant="Acme" scale="lg" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tier 5 ──────────────────────────────────────────────────────── */}
        <section className="sc-section">
          <p className="sc-section__head">Tier 5</p>
          <h2 className="sc-section__title">Data display</h2>
          <div className="sc-card">
            <div className="sc-label">List</div>
            <div className="sc-panel" style={{ width: 340 }}>
              <List>
                <ListItem icon="inbox" label="Inbox" selected />
                <ListItem icon="send" label="Sent" supporting="24 messages" />
                <ListItem icon="drafts" label="Drafts" />
                <ListItem icon="delete" label="Trash" tone="danger" />
                <ListItem icon="block" label="Disabled" disabled />
              </List>
            </div>
          </div>
        </section>

        {/* ── Tier 6 ──────────────────────────────────────────────────────── */}
        <section className="sc-section">
          <p className="sc-section__head">Tier 6</p>
          <h2 className="sc-section__title">Containers</h2>
          <div className="sc-card">
            <div className="sc-label">Card</div>
            <div className="sc-row">
              <Card>
                <div style={{ padding: 16, width: 240 }}>
                  <strong>Card title</strong>
                  <p style={{ margin: '8px 0 0', opacity: 0.7, fontSize: 14 }}>
                    A simple surface container with the shared elevation + radius.
                  </p>
                </div>
              </Card>
            </div>

            <div className="sc-label">Tabs</div>
            <div className="sc-row" style={{ display: 'block' }}>
              <TabList activeTab={activeTab} onTabChange={setActiveTab}>
                <Tab value="overview" label="Overview" icon="dashboard" />
                <Tab value="activity" label="Activity" icon="timeline" />
                <Tab value="settings" label="Settings" icon="settings" />
                <Tab value="locked" label="Locked" disabled />
              </TabList>
              <p className="sc-note">Active tab: {activeTab}</p>
            </div>

            <div className="sc-label">Menu</div>
            <div className="sc-row" style={{ alignItems: 'flex-start' }}>
              <MenuTrigger trigger={<button className="sc-theme-toggle" type="button">Open menu ▾</button>}>
                <MenuItem icon="edit" label="Rename" />
                <MenuItem icon="content_copy" label="Duplicate" />
                <MenuDivider />
                <MenuItem icon="delete" label="Delete" variant="danger" />
              </MenuTrigger>

              <div className="sc-panel">
                <div className="sc-label">Inline (always-open) preview</div>
                <Menu>
                  <MenuItem icon="edit" label="Rename" />
                  <MenuItem icon="content_copy" label="Duplicate" active />
                  <MenuDivider />
                  <MenuItem icon="delete" label="Delete" variant="danger" />
                </Menu>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tier 7 ──────────────────────────────────────────────────────── */}
        <section className="sc-section">
          <p className="sc-section__head">Tier 7</p>
          <h2 className="sc-section__title">Overlays &amp; feedback</h2>
          <div className="sc-card">
            <div className="sc-label">Modal</div>
            <div className="sc-row">
              <Button variant="primary" onClick={() => setModalOpen(true)}>Open modal</Button>
              <Modal open={modalOpen} onOpenChange={setModalOpen} variant="destructive"
                title="Delete project?" subtitle="This action cannot be undone."
                confirmLabel="Delete" cancelLabel="Keep" />
            </div>
            <div className="sc-label">Toast</div>
            <div className="sc-col">
              <Toast variant="success" title="Saved" message="Your changes are live." />
              <Toast variant="warning" title="Heads up" message="Storage is almost full." />
              <Toast variant="error" title="Failed" message="Could not reach the server." />
              <Toast variant="informative" title="FYI" message="A new version is available." />
            </div>
            <div className="sc-label" style={{ marginTop: 16 }}>Snackbar</div>
            <div className="sc-col">
              <Snackbar message="Message archived." actionLabel="Undo" />
              <Snackbar message="Copied to clipboard." icon="content_copy" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
