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
  onGoToday: () => void
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
  onGoToday,
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
    <main className="flex-1 flex flex-col overflow-hidden bg-[#FAFAF8] min-h-0">

      {/* Desktop-only header */}
      <div className="hidden lg:flex items-center justify-between px-8 py-5 border-b border-[#EDE8E2] flex-shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="font-playfair text-[32px] font-bold text-[#2C1A14] capitalize leading-none">
            {format(currentMonth, 'MMMM', { locale: ptBR })}
          </h2>
          <span className="font-playfair text-[32px] text-[#B8A89A] font-light leading-none">
            {format(currentMonth, 'yyyy')}
          </span>
          <div className="flex items-center gap-0.5 ml-1">
            <button onClick={onPrevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#E9E1D3] transition-colors text-[#7D5A4A] hover:text-[#2C1A14]">
              <ChevronLeft size={18} />
            </button>
            <button onClick={onNextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#E9E1D3] transition-colors text-[#7D5A4A] hover:text-[#2C1A14]">
              <ChevronRight size={18} />
            </button>
          </div>
          <button onClick={onGoToday} className="ml-2 px-3 py-1.5 text-[11px] font-semibold text-[#7D5A4A] border border-[#D5C9BC] rounded-lg hover:bg-[#E9E1D3] hover:text-[#2C1A14] transition-colors">
            Hoje
          </button>
        </div>
        <button
          onClick={onRefresh}
          className={`w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#E9E1D3] transition-colors text-[#B8A89A] hover:text-[#7D5A4A] ${loading ? 'animate-spin' : ''}`}
          title="Atualizar disponibilidade"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-4 lg:mx-8 mt-3 px-4 py-2 bg-[#F5E8E6] border border-[#C27B6E]/30 rounded-lg text-[11px] text-[#C27B6E] flex-shrink-0">
          {error}
        </div>
      )}

      {/* Week-day headers */}
      <div className="grid grid-cols-7 border-b border-[#EDE8E2] flex-shrink-0">
        {WEEK_DAYS.map((day, i) => (
          <div key={day} className="py-2 text-center font-semibold text-[#B8A89A] uppercase tracking-widest">
            <span className="hidden lg:inline text-[11px]">{day}</span>
            <span className="lg:hidden text-[10px]">{WEEK_DAYS_SHORT[i]}</span>
          </div>
        ))}
      </div>

      {/* Calendar body */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#E9E1D3] border-t-[#7D5A4A] rounded-full animate-spin" />
            <p className="font-playfair text-[13px] text-[#B8A89A]">Carregando disponibilidade…</p>
          </div>
        </div>
      ) : (
        <div
          className="flex-1 overflow-hidden grid min-h-0"
          style={{ gridTemplateRows: `repeat(${weeks.length}, minmax(44px, 1fr))` }}
        >
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 border-b border-[#EDE8E2] last:border-b-0">
              {week.map(day => {
                const dateStr        = format(day, 'yyyy-MM-dd')
                const isCurrentMonth = isSameMonth(day, currentMonth)
                const isSelected     = selectedDate === dateStr
                const bookedInfo     = bookedMap.get(dateStr)
                const isBooked       = !!bookedInfo && isCurrentMonth
                const isTodayDate    = isToday(day)
                const isPast         = isBefore(day, startOfDay(new Date()))
                const isClickable    = isCurrentMonth && !isBooked && !isPast

                return (
                  <div
                    key={dateStr}
                    onClick={() => isClickable && onDateSelect(dateStr)}
                    className={[
                      'border-r border-[#EDE8E2] last:border-r-0 transition-colors duration-150',
                      // Mobile: center content; Desktop: top-left with padding for pills
                      'flex flex-col items-center justify-center p-1',
                      'lg:items-start lg:justify-start lg:p-2',
                      isSelected && !isBooked                    ? 'bg-[#EDE4D8]'  : '',
                      isPast && isCurrentMonth                   ? 'bg-[#FDF0EF]'  : '',
                      !isCurrentMonth && !isPast                 ? 'bg-[#F5F3F0]'  : '',
                      isClickable && !isSelected ? 'hover:bg-[#F2EDE5] cursor-pointer' : '',
                      !isClickable               ? 'cursor-default' : '',
                    ].join(' ')}
                  >
                    {/* Day number — slightly larger on mobile for easier tapping */}
                    <div className={[
                      'flex items-center justify-center rounded-full font-medium transition-colors flex-shrink-0',
                      'w-8 h-8 text-[14px] lg:w-7 lg:h-7 lg:text-[13px]',
                      isTodayDate                                    ? 'bg-[#2C1A14] text-[#E9E1D3] font-bold' : '',
                      isSelected && !isTodayDate                     ? 'bg-[#2C1A14] text-[#E9E1D3]'           : '',
                      isPast && isCurrentMonth && !isTodayDate       ? 'text-[#D4897A]'  : '',
                      !isCurrentMonth && !isTodayDate                ? 'text-[#D0C4BB]'  : '',
                      isCurrentMonth && !isPast && !isTodayDate && !isSelected ? 'text-[#2C1A14]' : '',
                    ].join(' ')}>
                      {format(day, 'd')}
                    </div>

                    {/* Mobile: dot / × indicator */}
                    <div className="lg:hidden mt-1 h-2 flex items-center justify-center">
                      {isPast && isCurrentMonth && (
                        <span className="text-[#D4897A] text-[10px] leading-none">×</span>
                      )}
                      {isBooked && isCurrentMonth && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C27B6E]" />
                      )}
                      {isSelected && !isBooked && isCurrentMonth && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2C1A14]/40" />
                      )}
                    </div>

                    {/* Desktop: full event pill */}
                    <div className="hidden lg:flex mt-1 flex-col gap-0.5 overflow-hidden w-full">
                      {isPast && isCurrentMonth && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5">
                          <span className="text-[#D4897A] text-[13px] leading-none">×</span>
                        </div>
                      )}
                      {isBooked && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#C27B6E] rounded-md">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0" />
                          <span className="text-white text-[10px] font-medium truncate leading-tight">
                            {bookedInfo!.event || 'Reservado'}
                          </span>
                        </div>
                      )}
                      {isSelected && !isBooked && isCurrentMonth && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#2C1A14]/12 rounded-md">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#2C1A14]/60 flex-shrink-0" />
                          <span className="text-[#2C1A14] text-[10px] font-medium truncate leading-tight">
                            Sua seleção
                          </span>
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
