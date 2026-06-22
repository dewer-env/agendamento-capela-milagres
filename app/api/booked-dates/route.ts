import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL

  if (!scriptUrl) {
    // No script configured — client falls back to mock data
    return NextResponse.json({ bookedDates: [] }, { status: 200 })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const response = await fetch(scriptUrl, { signal: controller.signal })
    clearTimeout(timeout)

    if (!response.ok) {
      throw new Error(`Script respondeu com status ${response.status}`)
    }

    const data = await response.json()

    // Script returns { ocupados: ['2026-07-12', ...] }
    const ocupados: string[] = data.ocupados ?? []
    const bookedDates = ocupados.map(date => ({ date }))

    return NextResponse.json({ bookedDates })
  } catch (err) {
    console.error('[booked-dates] Erro ao buscar planilha:', err)
    return NextResponse.json(
      { bookedDates: [], error: 'Falha ao buscar datas da planilha' },
      { status: 502 }
    )
  }
}
