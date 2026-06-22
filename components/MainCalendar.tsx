'use client'

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isBefore,
  startOfDay,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { BookedDate } from '@/app/page'

interface MainCalendarProps {
  currentMonth: Date
  selectedDate: string | null
  bookedDates: BookedDate[]
  loading: boolean
  error: string | null
  onPrevMonth: () => void
  onNextMonth: () => void
  onDateSelect: (date: string) => void
  onRefresh: () => void
}

const WEEK_DAYS       = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const WEEK_DAYS_SHORT = ['D',   'S',   'T',   'Q',   'Q',   'S',   'S'  ]

export default function MainCalendar({
  currentMonth,
  selectedDate,
  bookedDates,
  loading,
  error,
  onPrevMonth,
  onNextMonth,
  onDateSelect,
  onRefresh,
}: MainCalendarProps) {
  const monthStart = startOfMonth(currentMonth)
  const monthEnd   = endOfMonth(currentMonth)
  const calStart   = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calEnd     = endOfWeek(monthEnd,     { weekStartsOn: 0 })
  const calDays    = eachDayOfInterval({ start: calStart, end: calEnd })

  const bookedMap = new Map(bookedDates.map(b => [b.date, b]))

  const weeks: Date[][] = []
  for (let i = 0; i < calDays.length; i += 7) weeks.push(calDays.slice(i, i + 7))

  return (
    <main
      className="flex-1 flex flex-col overflow-hidden min-h-0"
      style={{ background: 'var(--bg-primary)' }}
    >

      {/* Desktop-only header */}
      <div
        className="hidden lg:flex items-center justify-between flex-shrink-0"
        style={{
          padding: '1.25rem 1.5rem',
          background: 'var(--bg-primary)',
          borderBottom: '0.5px solid var(--border-default)',
        }}
      >
        <div className="flex items-center gap-3">
          <h2 style={{ fontSize: 20, fontWeight: 500, color: 'var(--text-primary)', margin: 0, lineHeight: 1, textTransform: 'capitalize' }}>
            {format(currentMonth, 'MMMM', { locale: ptBR })}
          </h2>
          <span style={{ fontSize: 20, fontWeight: 500, color: 'var(--text-secondary)', opacity: 0.5, lineHeight: 1 }}>
            {format(currentMonth, 'yyyy')}
          </span>
          <div className="flex items-center gap-1 ml-1">
            <button
              onClick={onPrevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-hover)]"
              style={{ border: '0.5px solid var(--border-input)', color: 'var(--text-muted)' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={onNextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-hover)]"
              style={{ border: '0.5px solid var(--border-input)', color: 'var(--text-muted)' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-hover)] ${loading ? 'animate-spin' : ''}`}
          style={{ color: 'var(--text-secondary)' }}
          title="Atualizar disponibilidade"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div
          className="mx-4 mt-3 px-4 py-2 rounded-lg text-[11px] flex-shrink-0"
          style={{
            background: 'var(--bg-reserved)',
            border: '0.5px solid var(--badge-bg)',
            color: 'var(--badge-text)',
          }}
        >
          {error}
        </div>
      )}

      {/* Week-day headers */}
      <div
        className="grid grid-cols-7 flex-shrink-0"
        style={{ background: 'var(--bg-card)', borderBottom: '0.5px solid var(--border-default)' }}
      >
        {WEEK_DAYS.map((day, i) => (
          <div
            key={day}
            className="py-2 text-center uppercase"
            style={{ fontSize: 11, letterSpacing: '0.05em', color: 'var(--text-secondary)' }}
          >
            <span className="hidden lg:inline">{day}</span>
            <span className="lg:hidden">{WEEK_DAYS_SHORT[i]}</span>
          </div>
        ))}
      </div>

      {/* Calendar body */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-8 h-8 border-2 rounded-full animate-spin"
              style={{ borderColor: 'var(--border-default)', borderTopColor: 'var(--text-muted)' }}
            />
            <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
              Carregando disponibilidade…
            </p>
          </div>
        </div>
      ) : (
        <div
          className="flex-1 overflow-hidden grid min-h-0"
          style={{ gridTemplateRows: `repeat(${weeks.length}, minmax(72px, 1fr))` }}
        >
          {weeks.map((week, wi) => (
            <div
              key={wi}
              className="grid grid-cols-7"
              style={{
                borderBottom: wi < weeks.length - 1 ? '0.5px solid var(--border-default)' : 'none',
              }}
            >
              {week.map((day, di) => {
                const dateStr        = format(day, 'yyyy-MM-dd')
                const isCurrentMonth = isSameMonth(day, currentMonth)
                const isSelected     = selectedDate === dateStr
                const bookedInfo     = bookedMap.get(dateStr)
                const isBooked       = !!bookedInfo && isCurrentMonth
                const isTodayDate    = isToday(day)
                const isPast         = isBefore(day, startOfDay(new Date()))
                const isClickable    = isCurrentMonth && !isBooked && !isPast

                let cellBg = 'var(--bg-primary)'
                if (!isCurrentMonth)              cellBg = '#F2EFE9'
                if (isPast && isCurrentMonth)     cellBg = 'var(--bg-card)'
                if (isBooked)                     cellBg = 'var(--bg-reserved)'
                if (isSelected && !isBooked)      cellBg = 'var(--bg-hover)'

                const showCircle = isTodayDate || (isSelected && !isBooked)

                return (
                  <div
                    key={dateStr}
                    onClick={() => isClickable && onDateSelect(dateStr)}
                    className={[
                      'flex flex-col transition-colors duration-150',
                      'items-center justify-center',
                      'lg:items-start lg:justify-start',
                      isClickable ? 'cursor-pointer' : 'cursor-default',
                    ].join(' ')}
                    style={{
                      padding: 8,
                      background: cellBg,
                      borderRight: di < 6 ? '0.5px solid var(--border-default)' : 'none',
                    }}
                    onMouseEnter={e => {
                      if (isClickable && !isSelected) e.currentTarget.style.background = 'var(--bg-hover)'
                    }}
                    onMouseLeave={e => {
                      if (isClickable && !isSelected) e.currentTarget.style.background = cellBg
                    }}
                  >
                    {/* Day number */}
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: showCircle ? 'var(--accent)' : 'transparent',
                        color: showCircle
                          ? 'var(--accent-text)'
                          : !isCurrentMonth
                          ? 'var(--border-input)'
                          : isPast
                          ? 'var(--text-secondary)'
                          : 'var(--text-primary)',
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      {format(day, 'd')}
                    </div>

                    {/* Mobile: indicator dot */}
                    <div className="lg:hidden mt-1 h-2 flex items-center justify-center">
                      {isBooked && isCurrentMonth && (
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--badge-bg)' }} />
                      )}
                      {isSelected && !isBooked && isCurrentMonth && (
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)', opacity: 0.5 }} />
                      )}
                    </div>

                    {/* Desktop: badge pill */}
                    <div className="hidden lg:flex flex-col gap-0.5 overflow-hidden w-full">
                      {isBooked && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: 11,
                            fontWeight: 500,
                            padding: '3px 8px',
                            borderRadius: 20,
                            width: '100%',
                            background: 'var(--badge-bg)',
                            color: 'var(--badge-text)',
                            marginTop: 6,
                          }}
                        >
                          <div
                            className="rounded-full flex-shrink-0"
                            style={{ width: 6, height: 6, background: 'var(--badge-text)', opacity: 0.6 }}
                          />
                          <span className="truncate leading-tight">
                            {bookedInfo!.event || 'Reservado'}
                          </span>
                        </div>
                      )}
                      {isSelected && !isBooked && isCurrentMonth && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: 11,
                            fontWeight: 500,
                            padding: '3px 8px',
                            borderRadius: 20,
                            width: '100%',
                            background: 'var(--accent)',
                            color: 'var(--accent-text)',
                            marginTop: 6,
                            opacity: 0.75,
                          }}
                        >
                          <div
                            className="rounded-full flex-shrink-0"
                            style={{ width: 6, height: 6, background: 'var(--accent-text)', opacity: 0.7 }}
                          />
                          <span className="truncate leading-tight">Sua seleção</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
