'use client'

import { useState, useEffect, useCallback } from 'react'
import { addMonths, subMonths, format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import MainCalendar from '@/components/MainCalendar'

export interface BookedDate {
  date: string
  event?: string
}

const MOCK_BOOKED_DATES: BookedDate[] = [
  { date: format(new Date(new Date().getFullYear(), new Date().getMonth(), 7), 'yyyy-MM-dd'), event: 'Casamento Silva' },
  { date: format(new Date(new Date().getFullYear(), new Date().getMonth(), 14), 'yyyy-MM-dd'), event: 'Festa de 15 anos' },
  { date: format(new Date(new Date().getFullYear(), new Date().getMonth(), 21), 'yyyy-MM-dd'), event: 'Confraternização' },
  { date: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 4), 'yyyy-MM-dd'), event: 'Casamento Ferreira' },
  { date: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 11), 'yyyy-MM-dd'), event: 'Aniversário corporativo' },
]

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [bookedDates, setBookedDates] = useState<BookedDate[]>(MOCK_BOOKED_DATES)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBookedDates = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/booked-dates', { cache: 'no-store' })
      if (!res.ok) throw new Error('Falha ao carregar datas')
      const data = await res.json()
      if (data.bookedDates && data.bookedDates.length > 0) {
        setBookedDates(data.bookedDates)
      }
    } catch {
      // Keep current data (mock or previously fetched)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBookedDates() }, [fetchBookedDates])

  useEffect(() => {
    if (selectedDate && bookedDates.some(b => b.date === selectedDate)) {
      setSelectedDate(null)
    }
  }, [bookedDates, selectedDate])

  const handlePrevMonth = () => setCurrentMonth(prev => subMonths(prev, 1))
  const handleNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1))
  const handleDateSelect = (date: string) => {
    if (!bookedDates.some(b => b.date === date)) {
      setSelectedDate(prev => prev === date ? null : date)
    }
  }

  const handleBooking = () => {
    if (!selectedDate || !name.trim() || !email.trim()) return
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'
    const [year, month, day] = selectedDate.split('-')
    const message = encodeURIComponent(
      `Olá! Meu nome é ${name.trim()} (email: ${email.trim()}) e tenho interesse em reservar o espaço na data ${day}/${month}/${year}. Aguardo o retorno!`
    )
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  const isBookingReady = !!(selectedDate && name.trim() && email.trim())

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>

      {/* Desktop layout: grid 200px + 1fr */}
      <div
        className="hidden lg:grid"
        style={{
          height: '100vh',
          gridTemplateColumns: '200px 1fr',
          gap: '1.5rem',
          padding: '1.5rem',
        }}
      >
        <Sidebar
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          bookedDates={bookedDates}
          name={name}
          email={email}
          isBookingReady={isBookingReady}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onDateSelect={handleDateSelect}
          onNameChange={setName}
          onEmailChange={setEmail}
          onBooking={handleBooking}
        />

        <div
          style={{
            border: '0.5px solid var(--border-default)',
            borderRadius: 12,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <MainCalendar
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            bookedDates={bookedDates}
            loading={loading}
            error={error}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}

            onDateSelect={handleDateSelect}
            onRefresh={fetchBookedDates}
          />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden flex flex-col h-screen">

        {/* Mobile top bar */}
        <div
          className="flex items-center justify-between px-4 flex-shrink-0 h-20"
          style={{
            background: 'var(--bg-card)',
            borderBottom: '0.5px solid var(--border-default)',
          }}
        >
          <img src="/capela.png" alt="Capela dos Milagres" className="h-16 object-contain mix-blend-multiply" />
          <div className="flex items-center gap-1">
            <span className="text-[13px] font-semibold capitalize mr-1" style={{ color: 'var(--text-primary)' }}>
              {format(currentMonth, 'MMM yyyy', { locale: ptBR })}
            </span>
            <button
              onClick={handlePrevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={handleNextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <ChevronRight size={15} />
            </button>
            <button
              onClick={fetchBookedDates}
              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${loading ? 'animate-spin' : ''}`}
              style={{ color: 'var(--text-secondary)' }}
            >
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        {/* Calendar */}
        <MainCalendar
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          bookedDates={bookedDates}
          loading={loading}
          error={error}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onDateSelect={handleDateSelect}
          onRefresh={fetchBookedDates}
        />

        {/* Mobile bottom panel */}
        <div
          className="flex-shrink-0 px-4 pt-3 pb-4"
          style={{
            background: 'var(--bg-card)',
            borderTop: '0.5px solid var(--border-default)',
          }}
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--border-default)' }} />
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Disponível</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--badge-bg)' }} />
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Reservado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent)' }} />
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Selecionado</span>
            </div>
          </div>

          {selectedDate && (
            <p className="text-[11px] font-semibold capitalize mb-2" style={{ color: 'var(--text-primary)' }}>
              {format(parseISO(selectedDate), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </p>
          )}

          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Seu nome"
              className="flex-1 min-w-0 px-3 py-2 text-[12px] rounded-lg focus:outline-none"
              style={{
                background: 'var(--bg-primary)',
                border: '0.5px solid var(--border-input)',
                color: 'var(--text-primary)',
              }}
            />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="flex-1 min-w-0 px-3 py-2 text-[12px] rounded-lg focus:outline-none"
              style={{
                background: 'var(--bg-primary)',
                border: '0.5px solid var(--border-input)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <button
            onClick={handleBooking}
            disabled={!isBookingReady}
            className="w-full rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2"
            style={{
              background: 'var(--accent)',
              color: 'var(--accent-text)',
              border: 'none',
              padding: '10px 16px',
              opacity: isBookingReady ? 1 : 0.4,
              cursor: isBookingReady ? 'pointer' : 'not-allowed',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {isBookingReady ? 'Demonstrar interesse' : selectedDate ? 'Preencha seus dados' : 'Selecione uma data'}
          </button>
        </div>

      </div>
    </div>
  )
}
