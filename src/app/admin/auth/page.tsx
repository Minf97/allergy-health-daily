'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const res = await fetch('/api/checkPassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        })

        const data = await res.json()

        if (data.success) {
            // 验证成功，存入 localStorage
            localStorage.setItem('isAuthed', 'true')
            router.replace('/admin') // 跳回 admin 页面
        } else {
            setError('Incorrect password, please try again.')
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
                <h2 className="text-2xl font-bold mb-4 text-center">Enter Access Password</h2>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                    placeholder="Enter password"
                />
                <button
                    type="submit"
                    className="btn-primary w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                >
                    submit
                </button>
                {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            </form>
        </div>
    )
}
