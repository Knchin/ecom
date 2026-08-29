import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { generateSessionId } from '@shop-platform/ui'
import type { AnalyticsEventType } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { event_type, product_id, category_id, metadata } = body

    const validEventTypes: AnalyticsEventType[] = [
      'PRODUCT_VIEW',
      'PRODUCT_SEARCH',
      'CONTACT_CLICK',
      'PHONE_CLICK',
      'WHATSAPP_CLICK',
      'DIRECTION_CLICK',
    ]

    if (!validEventTypes.includes(event_type)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }

    const sessionId = request.cookies.get('analytics_session')?.value ?? generateSessionId()

    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_type,
        product_id: product_id ?? null,
        category_id: category_id ?? null,
        session_id: sessionId,
        user_agent: request.headers.get('user-agent'),
        referrer: request.headers.get('referer'),
        metadata: metadata ?? {},
      })

    if (error) throw error

    const response = NextResponse.json({ success: true })
    
    if (!request.cookies.get('analytics_session')) {
      response.cookies.set('analytics_session', sessionId, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
    }

    return response
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
  }
}