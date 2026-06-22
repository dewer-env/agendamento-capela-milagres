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
    <aside className="hidden lg:flex flex-col w-[272px] h-full flex-shrink-0 bg-[#E9E1D3] border-r border-[#D5C9BC] overflow-y-auto">

      {/* Logo */}
      <div className="px-6 pt-6 pb-5 border-b border-[#D5C9BC] flex justify-center">
        <img
          src="/capela.png"
          alt="Capela dos Milagres"
          className="w-32 mx-auto object-contain mix-blend-multiply"
        />
      </div>

      {/* Mini Calendar */}
      <div className="px-4 pt-4 pb-4 border-b border-[#D5C9BC]">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onPrevMonth}
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[#D5C9BC] transition-colors"
          >
            <ChevronLeft size={13} className="text-[#2C1A14]" />
          </button>
          <span className="font-playfair text-[12px] font-semibold text-[#2C1A14] capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <button
            onClick={onNextMonth}
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[#D5C9BC] transition-colors"
          >
            <ChevronRight size={13} className="text-[#2C1A14]" />
          </button>
        </div>

        {/* Week day initials */}
        <div className="grid grid-cols-7 mb-1">
          {WEEK_INITIALS.map((d, i) => (
            <div key={i} className="text-center text-[9px] font-semibold text-[#7D5A4A] py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-y-0.5">
          {calDays.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd')
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isSelected = selectedDate === dateStr
            const isBooked = bookedSet.has(dateStr)
            const isTodayDate = isToday(day)
            const isPast = isBefore(day, startOfDay(new Date()))

            return (
              <button
                key={dateStr}
                onClick={() => isCurrentMonth && !isBooked && !isPast && onDateSelect(dateStr)}
                disabled={!isCurrentMonth || isBooked || isPast}
                className={[
                  'relative w-7 h-7 mx-auto flex items-center justify-center rounded-full text-[10px] transition-all',
                  !isCurrentMonth ? 'text-[#C5B5A8] cursor-default' : '',
                  isPast && isCurrentMonth ? 'text-[#D4897A] cursor-default' : '',
                  isCurrentMonth && !isPast && !isBooked && !isSelected ? 'text-[#2C1A14] hover:bg-[#D5C9BC] cursor-pointer' : '',
                  isBooked && isCurrentMonth ? 'text-[#C27B6E] cursor-default' : '',
                  isSelected ? 'bg-[#2C1A14] !text-[#E9E1D3]' : '',
                  isTodayDate && !isSelected ? 'ring-1 ring-[#2C1A14] font-bold' : '',
                ].join(' ')}
              >
                {format(day, 'd')}
                {isBooked && isCurrentMonth && !isSelected && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C27B6E]" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Form */}
      <div className="px-5 pt-4 pb-4 border-b border-[#D5C9BC]">
        <h3 className="font-playfair text-[13px] font-semibold text-[#2C1A14] mb-3">
          Seus dados
        </h3>
        <div className="space-y-2">
          <input
            type="text"
            value={name}
            onChange={e => onNameChange(e.target.value)}
            placeholder="Seu nome completo"
            className="w-full px-3 py-2 text-[12px] bg-white/60 border border-[#D5C9BC] rounded-lg text-[#2C1A14] placeholder-[#B8A89A] focus:outline-none focus:border-[#7D5A4A] focus:bg-white/90 transition-all font-playfair"
          />
          <input
            type="email"
            value={email}
            onChange={e => onEmailChange(e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-3 py-2 text-[12px] bg-white/60 border border-[#D5C9BC] rounded-lg text-[#2C1A14] placeholder-[#B8A89A] focus:outline-none focus:border-[#7D5A4A] focus:bg-white/90 transition-all font-playfair"
          />
        </div>

        {selectedDate && (
          <div className="mt-3 px-3 py-2 bg-[#2C1A14]/8 rounded-lg border border-[#2C1A14]/15">
            <p className="text-[10px] text-[#7D5A4A]">
              Data escolhida
            </p>
            <p className="text-[12px] font-semibold text-[#2C1A14] capitalize">
              {format(parseISO(selectedDate), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
        )}
      </div>

      {/* Color Legend */}
      <div className="px-5 pt-4 pb-4 border-b border-[#D5C9BC]">
        <h3 className="font-playfair text-[13px] font-semibold text-[#2C1A14] mb-3">
          Legenda
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-white border border-[#D5C9BC] flex-shrink-0 shadow-sm" />
            <span className="text-[11px] text-[#2C1A14]">Disponível</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-[#C27B6E] flex-shrink-0" />
            <span className="text-[11px] text-[#2C1A14]">Reservado</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-[#2C1A14] flex-shrink-0" />
            <span className="text-[11px] text-[#2C1A14]">Selecionado por você</span>
          </div>
        </div>
      </div>

      {/* Book Button */}
      <div className="px-5 pt-4 pb-6 mt-auto">
        <button
          onClick={onBooking}
          disabled={!isBookingReady}
          className={[
            'w-full py-3 px-4 rounded-xl text-[13px] font-semibold transition-all duration-200 flex items-center justify-center gap-2',
            isBookingReady
              ? 'bg-[#2C1A14] text-[#E9E1D3] hover:bg-[#3D2520] shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98]'
              : 'bg-[#C5B5A8]/60 text-[#A89580] cursor-not-allowed',
          ].join(' ')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {isBookingReady ? 'Demonstrar interesse' : 'Selecione uma data'}
        </button>

        {!selectedDate && (
          <p className="text-[10px] text-[#7D5A4A] text-center mt-2 leading-snug">
            Clique em um dia disponível no calendário
          </p>
        )}
        {selectedDate && (!name.trim() || !email.trim()) && (
          <p className="text-[10px] text-[#7D5A4A] text-center mt-2 leading-snug">
            Preencha seu nome e email para continuar
          </p>
        )}
      </div>
    </aside>
  )
}
