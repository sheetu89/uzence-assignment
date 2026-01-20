// Storybook stories for DataGrid component
// This file demonstrates large datasets, keyboard navigation,
// sorting, editing states, and accessibility behavior
import React from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { DataGrid } from '../components/DataGrid';
import type { Column, DataGridProps, RowData } from '../components/DataGrid';

interface DemoRow extends RowData {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  salary: number;
  status: string;
  startDate: string;
}

const roles = ['Developer', 'Designer', 'Manager', 'Analyst', 'Engineer'];
const departments = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales'];
const statuses = ['Active', 'Inactive', 'On Leave'];

const buildColumns = (): Column<DemoRow>[] => [
  { id: 'id', field: 'id', header: 'ID', width: 80, pinned: 'left' },
  { id: 'name', field: 'name', header: 'Name', width: 200, pinned: 'left' },
  { id: 'email', field: 'email', header: 'Email', width: 240 },
  { id: 'role', field: 'role', header: 'Role', width: 140 },
  { id: 'department', field: 'department', header: 'Department', width: 160 },
  {
    id: 'salary',
    field: 'salary',
    header: 'Salary',
    width: 140,
    renderer: ({ value }) => (
      <span className="font-mono">
        ${typeof value === 'number' ? value.toLocaleString() : '0'}
      </span>
    ),
  },
  {
    id: 'status',
    field: 'status',
    header: 'Status',
    width: 120,
    renderer: ({ value }) => (
      <span
        className={`inline-flex items-center px-2 py-0.5 text-xs border ${
          value === 'Active'
            ? 'border-foreground text-foreground'
            : value === 'Inactive'
            ? 'border-muted-foreground text-muted-foreground'
            : 'border-accent text-accent'
        }`}
      >
        {String(value ?? '')}
      </span>
    ),
  },
  { id: 'startDate', field: 'startDate', header: 'Start Date', width: 140 },
];

const buildRows = (count: number): DemoRow[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    email: `employee${i + 1}@company.com`,
    role: roles[i % roles.length] ?? 'Developer',
    department: departments[i % departments.length] ?? 'Engineering',
    salary: Math.floor(Math.random() * 100000) + 50000,
    status: statuses[i % statuses.length] ?? 'Active',
    startDate:
      new Date(2020 + Math.floor(i / 10000), i % 12, (i % 28) + 1)
        .toISOString()
        .split('T')[0] ?? '',
  }));
};

const baseArgs: DataGridProps<DemoRow> = {
  data: buildRows(1000),
  columns: buildColumns(),
  height: 520,
  width: '100%',
  rowHeight: 40,
  headerHeight: 44,
  overscanRowCount: 5,
  overscanColumnCount: 2,
};

const DemoDataGrid: React.FC<DataGridProps<DemoRow>> = (props) => (
  <DataGrid<DemoRow> {...props} />
);

const meta: Meta<typeof DemoDataGrid> = {
  title: 'Components/DataGrid',
  component: DemoDataGrid,
  parameters: {
    layout: 'fullscreen',
    chromatic: { delay: 500 },
  },
  args: baseArgs,
  argTypes: {
    data: { control: false },
    columns: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;
const Template: StoryFn<typeof DemoDataGrid> = (args) => <DemoDataGrid {...args} />;

export const LargeDataset = Template.bind({});
LargeDataset.storyName = '50k Rows (Virtualized)';
LargeDataset.args = {
  ...baseArgs,
  data: buildRows(50000),
};
LargeDataset.parameters = {
  chromatic: { delay: 800 },
  docs: {
    description: {
      story:
        'Demonstrates sustained virtualization performance with 50,000 rows, sticky headers, and pinned columns. Scroll vertically/horizontally to validate rendering.',
    },
  },
};

export const KeyboardNavigation = Template.bind({});
KeyboardNavigation.args = {
  ...baseArgs,
  data: buildRows(2000),
};
KeyboardNavigation.parameters = {
  docs: {
    description: {
      story:
        'Focus the grid, then use Tab, Shift+Tab, and Arrow keys to move between cells. This story is intended for manual keyboard-only testing.',
    },
  },
};

export const EditingFailure = Template.bind({});
EditingFailure.args = {
  ...baseArgs,
  data: buildRows(250),
  onCellEdit: async (rowIndex, columnId, value) => {
    const shouldFail = typeof value === 'string' && value.toLowerCase().includes('fail');
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (shouldFail) {
      throw new Error(`Validation failed for ${columnId} at row ${rowIndex + 1}`);
    }
  },
};
EditingFailure.parameters = {
  docs: {
    description: {
      story:
        'Simulates in-cell editing with async validation. Typing "fail" anywhere triggers an error to verify rollback UI and toast behavior.',
    },
  },
};

export const Accessibility = Template.bind({});
Accessibility.args = {
  ...baseArgs,
  data: buildRows(100),
};
Accessibility.parameters = {
  a11y: { disable: false },
  docs: {
    description: {
      story:
        'Accessibility-focused scenario: inspect ARIA grid roles, focus outlines, and screen-reader labels. Combine with Storybook a11y addon audits.',
    },
  },
};
