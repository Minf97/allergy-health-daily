import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
    const { password } = await request.json()

    const { data, error } = await supabase
        .from('auth_config')
        .select('admin_password')
        .single()

    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    if (password === data.admin_password) {
        return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false }, { status: 401 })
}
