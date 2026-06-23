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
  parseISO,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BookedDate } from '@/app/page'

interface SidebarProps {
  currentMonth: Date
  selectedDate: string | null
  bookedDates: BookedDate[]
  name: string
  email: string
  isBookingReady: boolean
  onPrevMonth: () => void
  onNextMonth: () => void
  onDateSelect: (date: string) => void
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onBooking: () => void
}

const WEEK_INITIALS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const card: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '0.5px solid var(--border-default)',
  borderRadius: 12,
  padding: '0.875rem',
}

const sectionLabel: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--text-secondary)',
  marginBottom: '0.5rem',
}

export default function Sidebar({
  currentMonth,
  selectedDate,
  bookedDates,
  name,
  email,
  isBookingReady,
  onPrevMonth,
  onNextMonth,
  onDateSelect,
  onNameChange,
  onEmailChange,
  onBooking,
}: SidebarProps) {
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const calDays = eachDayOfInterval({ start: calStart, end: calEnd })
  const bookedSet = new Set(bookedDates.map(b => b.date))

  return (
    <aside
      className="hidden lg:flex flex-col overflow-hidden"
      style={{ gap: '0.625rem', paddingTop: 0, paddingBottom: 0 }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center" style={{ paddingTop: 0, gap: '0.5rem' }}>
        <a
          href="https://capeladosmilagres.com"
          className="flex items-center gap-1.5 text-[12px] font-medium transition-colors hover:bg-[var(--bg-hover)]"
          style={{
            color: 'var(--text-primary)',
            border: '0.5px solid var(--border-input)',
            borderRadius: 8,
            padding: '6px 12px',
            width: '100%',
            justifyContent: 'center',
          }}
        >
          ← Voltar para home
        </a>
        <img
          src="/capela.png"
          alt="Capela dos Milagres"
          className="object-contain"
          style={{ width: 120, mixBlendMode: 'multiply' }}
        />
      </div>

      {/* Mini Calendar Card */}
      <div style={card}>
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onPrevMonth}
            className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <ChevronLeft size={13} />
          </button>
          <span className="text-[11px] font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
            {format(currentMonth, 'MMM yyyy', { locale: ptBR })}
          </span>
          <button
            onClick={onNextMonth}
            className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {WEEK_INITIALS.map((d, i) => (
            <div key={i} className="text-center py-1" style={{ fontSize: 9, color: 'var(--text-secondary)' }}>
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-0.5">
          {calDays.map(day => {
            const dateStr        = format(day, 'yyyy-MM-dd')
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isSelected     = selectedDate === dateStr
            const isBooked       = bookedSet.has(dateStr)
            const isTodayDate    = isToday(day)
            const isPast         = isBefore(day, startOfDay(new Date()))
            const isClickable    = isCurrentMonth && !isBooked && !isPast

            return (
              <button
                key={dateStr}
                onClick={() => isClickable && onDateSelect(dateStr)}
                disabled={!isClickable}
                className="relative w-6 h-6 mx-auto flex items-center justify-center rounded-full text-[9px] transition-all"
                style={{
                  background: isSelected ? 'var(--accent)' : 'transparent',
                  color: isSelected
                    ? 'var(--accent-text)'
                    : !isCurrentMonth || isPast
                    ? 'var(--text-secondary)'
                    : isBooked
                    ? 'var(--text-secondary)'
                    : 'var(--text-primary)',
                  outline: isTodayDate && !isSelected ? '1px solid var(--accent)' : 'none',
                  opacity: !isCurrentMonth ? 0.4 : 1,
                  cursor: isClickable ? 'pointer' : 'default',
                  fontWeight: isTodayDate ? 700 : 400,
                }}
              >
                {format(day, 'd')}
                {isBooked && isCurrentMonth && !isSelected && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: 'var(--badge-bg)' }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Form Card */}
      <div style={card}>
        <span style={sectionLabel}>Seus dados</span>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={name}
            onChange={e => onNameChange(e.target.value)}
            placeholder="Seu nome completo"
            className="w-full px-3 py-2 text-[12px] rounded-lg focus:outline-none"
            style={{
              background: 'var(--bg-primary)',
              border: '0.5px solid var(--border-input)',
              color: 'var(--text-primary)',
            }}
          />
          <input
            type="email"
            value={email}
            onChange={e => onEmailChange(e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-3 py-2 text-[12px] rounded-lg focus:outline-none"
            style={{
              background: 'var(--bg-primary)',
              border: '0.5px solid var(--border-input)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {selectedDate && (
          <div
            className="mt-3 px-3 py-2 rounded-lg"
            style={{
              border: '0.5px solid var(--border-default)',
              background: 'var(--bg-primary)',
            }}
          >
            <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Data escolhida</p>
            <p className="text-[11px] font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
              {format(parseISO(selectedDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
        )}
      </div>

      {/* Legend Card */}
      <div style={card}>
        <span style={sectionLabel}>Legenda</span>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: 'var(--border-default)' }} />
            <span className="text-[11px]" style={{ color: 'var(--text-primary)' }}>Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: 'var(--badge-bg)' }} />
            <span className="text-[11px]" style={{ color: 'var(--text-primary)' }}>Reservado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px]" style={{ color: 'var(--text-primary)' }}>Selecionado</span>
          </div>
        </div>
      </div>

      {/* WhatsApp Button — pushed to bottom */}
      <button
        onClick={onBooking}
        disabled={!isBookingReady}
        className="flex items-center justify-center gap-2 text-[13px] font-medium"
        style={{
          background: 'var(--accent)',
          color: 'var(--accent-text)',
          border: 'none',
          borderRadius: 8,
          padding: '10px 16px',
          width: '100%',
          cursor: isBookingReady ? 'pointer' : 'not-allowed',
          opacity: isBookingReady ? 1 : 0.4,
          marginTop: 'auto',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        {isBookingReady ? 'Demonstrar interesse' : 'Selecione uma data'}
      </button>
    </aside>
  )
}
