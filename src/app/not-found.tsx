// app/not-found.js
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="mt-4 text-xl">Sorry, the page you are looking for does not exist.</p>
            <Link href="/" className="btn-primary mt-6 px-4 py-2 bg-blue-500 text-white rounded">
                Go Home
            </Link>
        </div>
    );
}
