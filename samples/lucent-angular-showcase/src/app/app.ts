import { Component, effect, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucentAccordion,
  LucentActivityBar,
  LucentAgendaRow,
  LucentAvatar,
  LucentBadge,
  LucentBreadcrumbs,
  LucentButton,
  LucentCalendar,
  LucentCard,
  LucentChatTrigger,
  LucentCheckbox,
  LucentChip,
  LucentCodeBlock,
  LucentComposer,
  LucentConversationRow,
  LucentDatePicker,
  LucentDateRangePicker,
  LucentError,
  LucentEventBlock,
  LucentEventChip,
  LucentHint,
  LucentIcon,
  LucentIconButton,
  LucentInlineInput,
  LucentInlineNotice,
  LucentJumpToLatest,
  LucentTextInput,
  LucentLabel,
  LucentList,
  LucentListItem,
  LucentMenu,
  LucentMenuItem,
  LucentMenuTrigger,
  LucentMessageBubble,
  LucentModal,
  LucentMonthCell,
  LucentNavGroup,
  LucentNavItem,
  LucentDivider,
  LucentNavRail,
  LucentPrefix,
  LucentProgress,
  LucentPromptSuggestion,
  LucentRadio,
  LucentRadioGroup,
  LucentReferenceTag,
  LucentSchedulerAgenda,
  LucentSchedulerMonth,
  LucentSchedulerWeek,
  LucentSegmentedControl,
  LucentSelect,
  LucentSkeleton,
  LucentSnackbar,
  LucentSpinner,
  LucentStatusTag,
  LucentSupporting,
  LucentTab,
  LucentTabList,
  LucentTable,
  LucentTag,
  LucentTextarea,
  LucentTimePicker,
  LucentToast,
  LucentToggle,
  LucentTooltip,
  LucentTypingIndicator,
  type BreadcrumbItem,
  type DatedEvent,
  type DateRange,
  type SchedulerEvent,
  type SegmentedOption,
  type SelectOption,
  type Time,
  type TimedEvent,
} from '@designfoundry/lucent-angular';

type Theme = 'light' | 'dark';

const today = new Date();
const day = (offset: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    LucentIcon, LucentTag, LucentStatusTag, LucentBadge, LucentTooltip,
    LucentButton, LucentIconButton, LucentToggle, LucentChip, LucentCheckbox,
    LucentRadio, LucentRadioGroup, LucentSegmentedControl,
    LucentNavItem, LucentNavGroup, LucentNavRail, LucentDivider, LucentActivityBar, LucentBreadcrumbs,
    LucentAvatar, LucentTextInput, LucentTextarea, LucentInlineInput, LucentSelect,
    LucentDatePicker, LucentDateRangePicker, LucentTimePicker,
    LucentList, LucentListItem, LucentTable, LucentCalendar,
    LucentTab, LucentTabList, LucentCard, LucentAccordion,
    LucentMenu, LucentMenuTrigger, LucentMenuItem, LucentModal,
    LucentToast, LucentSnackbar, LucentInlineNotice, LucentProgress, LucentSpinner, LucentSkeleton,
    LucentMessageBubble, LucentTypingIndicator, LucentReferenceTag, LucentCodeBlock,
    LucentPromptSuggestion, LucentComposer, LucentChatTrigger, LucentConversationRow, LucentJumpToLatest,
    LucentEventChip, LucentMonthCell, LucentEventBlock, LucentAgendaRow,
    LucentSchedulerMonth, LucentSchedulerWeek, LucentSchedulerAgenda,
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

  readonly frequency = signal('weekly');
  readonly view = signal<string | null>('week');
  readonly viewOptions: SegmentedOption<string>[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ];

  readonly date = signal<Date | null>(day(3));
  readonly range = signal<DateRange | null>({ start: day(-2), end: day(4) });
  readonly time = signal<Time | null>({ hours: 9, minutes: 30 });
  readonly calendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  readonly calendarValue = signal<Date>(day(0));

  readonly releases = [
    { version: '0.6.0', owner: 'Diego Cancho', status: 'success' as const, label: 'Published', files: 64 },
    { version: '0.6.1-rc.0', owner: 'Diego Cancho', status: 'warning' as const, label: 'Candidate', files: 64 },
    { version: '0.5.0', owner: 'Ada Lovelace', status: 'neutral' as const, label: 'Superseded', files: 71 },
  ];

  readonly draft = signal('');
  readonly snippet = "import { LucentButton } from '@designfoundry/lucent-angular';";

  readonly cellEvents: SchedulerEvent[] = [
    { category: 'meeting', label: 'Design review', time: '10:00' },
    { category: 'work', label: 'Token audit' },
    { category: 'deadline', label: 'Release 0.7' },
  ];

  readonly schedulerMonth = signal(new Date(today.getFullYear(), today.getMonth(), 1));
  readonly weekStart = signal<Date | null>(day(0));
  readonly datedEvents: DatedEvent[] = [
    { date: day(0), category: 'meeting', label: 'Design review', time: '10:00' },
    { date: day(0), category: 'work', label: 'Token audit' },
    { date: day(0), category: 'personal', label: 'Dentist', time: '17:30' },
    { date: day(2), category: 'deadline', label: 'Release 0.7' },
    { date: day(5), category: 'work', label: 'Kit API pass', time: '09:00' },
  ];
  readonly timedEvents: TimedEvent[] = [
    { date: day(0), startHour: 10, endHour: 11, category: 'meeting', title: 'Design review' },
    { date: day(1), startHour: 9, endHour: 12, category: 'work', title: 'Token audit' },
    { date: day(2), startHour: 14, endHour: 15, category: 'deadline', title: 'Release 0.7' },
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
