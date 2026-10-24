import { Component, effect, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucentActivityBar,
  LucentAvatar,
  LucentBreadcrumbs,
  LucentButton,
  LucentCard,
  LucentCheckbox,
  LucentChip,
  LucentError,
  LucentHint,
  LucentIcon,
  LucentIconButton,
  LucentInlineInput,
  LucentTextInput,
  LucentLabel,
  LucentList,
  LucentListItem,
  LucentMenu,
  LucentMenuItem,
  LucentMenuTrigger,
  LucentModal,
  LucentNavItem,
  LucentDivider,
  LucentNavRail,
  LucentPrefix,
  LucentSelect,
  LucentSnackbar,
  LucentStatusTag,
  LucentSupporting,
  LucentTab,
  LucentTabList,
  LucentTag,
  LucentToast,
  LucentToggle,
  LucentTooltip,
  type BreadcrumbItem,
  type SelectOption,
} from '@design-foundry/lucent-angular';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    LucentIcon, LucentTag, LucentStatusTag, LucentTooltip,
    LucentButton, LucentIconButton, LucentToggle, LucentChip, LucentCheckbox,
    LucentNavItem, LucentNavRail, LucentDivider, LucentActivityBar, LucentBreadcrumbs,
    LucentAvatar, LucentTextInput, LucentInlineInput, LucentSelect,
    LucentList, LucentListItem, LucentTab, LucentTabList, LucentCard,
    LucentMenu, LucentMenuTrigger, LucentMenuItem, LucentModal,
    LucentToast, LucentSnackbar,
    LucentLabel, LucentHint, LucentError, LucentPrefix, LucentSupporting,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './app.html',
})
export class App {
  /** Theme is applied to <html data-theme="…"> and seeded from ?theme= so Playwright
   *  can drive both themes by URL. */
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
