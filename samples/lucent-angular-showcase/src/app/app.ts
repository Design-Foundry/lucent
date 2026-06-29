import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DfActivityBar,
  DfAvatar,
  DfBreadcrumbs,
  DfButton,
  DfCard,
  DfCheckbox,
  DfChip,
  DfError,
  DfHint,
  DfIcon,
  DfIconButton,
  DfInlineInput,
  DfInput,
  DfLabel,
  DfList,
  DfListItem,
  DfMenu,
  DfMenuDivider,
  DfMenuItem,
  DfMenuTrigger,
  DfModal,
  DfNavDivider,
  DfNavIcon,
  DfNavRail,
  DfPrefix,
  DfSelect,
  DfSnackbar,
  DfStatusTag,
  DfSupporting,
  DfTab,
  DfTabList,
  DfTag,
  DfToast,
  DfToggle,
  DfTooltip,
  type BreadcrumbItem,
  type SelectOption,
} from '@design-foundry/lucent';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    DfIcon, DfTag, DfStatusTag, DfTooltip,
    DfButton, DfIconButton, DfToggle, DfChip, DfCheckbox,
    DfNavIcon, DfNavRail, DfNavDivider, DfActivityBar, DfBreadcrumbs,
    DfAvatar, DfInput, DfInlineInput, DfSelect,
    DfList, DfListItem, DfTab, DfTabList, DfCard,
    DfMenu, DfMenuTrigger, DfMenuItem, DfMenuDivider, DfModal,
    DfToast, DfSnackbar,
    DfLabel, DfHint, DfError, DfPrefix, DfSupporting,
  ],
  templateUrl: './app.html',
})
export class App {
  /** Theme is applied to <html data-theme="…"> and seeded from ?theme= so Playwright
   *  can drive both themes by URL — the same contract the Razor showcase uses. */
  readonly theme = signal<Theme>(this.initialTheme());

  readonly activeTab = signal('overview');
  readonly modalOpen = signal(false);

  readonly selectOptions: SelectOption[] = [
    { label: 'Production', value: 'prod' },
    { label: 'Staging', value: 'staging' },
    { label: 'Development', value: 'dev' },
  ];

  readonly crumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Settings', path: '/settings' },
    { label: 'Profile' },
  ];

  constructor() {
    effect(() => {
      document.documentElement.dataset['theme'] = this.theme();
    });
  }

  toggleTheme(): void {
    this.theme.update(t => (t === 'light' ? 'dark' : 'light'));
  }

  private initialTheme(): Theme {
    const q = new URLSearchParams(window.location.search).get('theme');
    return q === 'dark' ? 'dark' : 'light';
  }
}
