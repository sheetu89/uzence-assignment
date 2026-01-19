'use client';

import { DataGrid } from '@/components/DataGrid';
import { useMemo } from 'react';
import type { Column, RowData } from '@/components/DataGrid';

interface DemoData extends RowData {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  salary: number;
  status: string;
  startDate: string;
}

function generateData(count: number): DemoData[] {
  const roles = ['Developer', 'Designer', 'Manager', 'Analyst', 'Engineer'];
  const departments = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales'];
  const statuses = ['Active', 'Inactive', 'On Leave'];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    email: `employee${i + 1}@company.com`,
    role: roles[i % roles.length] ?? 'Developer',
    department: departments[i % departments.length] ?? 'Engineering',
    salary: Math.floor(Math.random() * 100000) + 50000,
    status: statuses[i % statuses.length] ?? 'Active',
    startDate: new Date(2020 + Math.floor(i / 10000), (i % 12), (i % 28) + 1).toISOString().split('T')[0] ?? '',
  }));
}

export default function Home() {
  const data = useMemo(() => generateData(50000), []);

  const columns: Column<DemoData>[] = useMemo(
    () => [
      {
        id: 'id',
        field: 'id',
        header: 'ID',
        width: 80,
        pinned: 'left',
      },
      {
        id: 'name',
        field: 'name',
        header: 'Name',
        width: 200,
        pinned: 'left',
      },
      {
        id: 'email',
        field: 'email',
        header: 'Email',
        width: 250,
      },
      {
        id: 'role',
        field: 'role',
        header: 'Role',
        width: 150,
      },
      {
        id: 'department',
        field: 'department',
        header: 'Department',
        width: 150,
      },
      {
        id: 'salary',
        field: 'salary',
        header: 'Salary',
        width: 120,
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
      {
        id: 'startDate',
        field: 'startDate',
        header: 'Start Date',
        width: 120,
      },
    ],
    []
  );

  return (
    <div className="flex flex-col min-h-screen p-8 gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Advanced Data Grid</h1>
        <p className="text-muted-foreground">
          Virtualized grid with 50,000 rows - Scroll to test performance
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <DataGrid
          data={data}
          columns={columns}
          height="calc(100vh - 200px)"
          rowHeight={40}
          headerHeight={44}
        />
      </div>

      <div className="flex gap-4 text-sm text-muted-foreground">
        <div>Total Rows: {data.length.toLocaleString()}</div>
        <div>•</div>
        <div>Columns: {columns.length}</div>
        <div>•</div>
        <div>Virtualized: Yes</div>
      </div>
    </div>
  );
}
