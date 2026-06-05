import { cn } from '../../lib/cn'

export default function DataTable({ columns, rows, rowKey = (r) => r.id, onRowClick, className }) {
  return (
    <div className={cn('bg-white border border-ink-200/70 rounded-2xl shadow-soft overflow-hidden', className)}>
      <div className="overflow-x-auto scroll-slim">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ink-50/80 border-b border-ink-200/70">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-5 py-3 font-semibold text-ink-500 text-xs uppercase tracking-wide whitespace-nowrap',
                    col.align === 'right' ? 'text-right' : 'text-left',
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  'transition-colors',
                  onRowClick ? 'cursor-pointer hover:bg-brand-50/40' : 'hover:bg-ink-50/60',
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-5 py-3.5 text-ink-700 align-middle',
                      col.align === 'right' ? 'text-right' : 'text-left',
                      col.className,
                    )}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
