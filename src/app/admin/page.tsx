'use client'

import Link from 'next/link'
import { MainLayout } from '@/components/layout'

export default function AdminPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your blog content and settings</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/blog-editor"
            className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-primary-dark hover:shadow-md transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary-dark text-white rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Create New Blog</h3>
            </div>
            <p className="text-gray-600">Write and publish a new blog article</p>
          </Link>

          <Link
            href="/admin/blogs"
            className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-primary-dark hover:shadow-md transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-600 text-white rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Manage Blogs</h3>
            </div>
            <p className="text-gray-600">View, edit, and manage all blog posts</p>
          </Link>

          <Link
            href="/blog"
            className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-primary-dark hover:shadow-md transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-600 text-white rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">View Public Blog</h3>
            </div>
            <p className="text-gray-600">See how your blog looks to visitors</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-sm text-gray-600">Total Blogs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">10</div>
              <div className="text-sm text-gray-600">Published</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <div className="text-sm text-gray-600">Drafts</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}