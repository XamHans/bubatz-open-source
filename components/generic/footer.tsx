'use client'

import Link from 'next/link'

const YEAR = new Date().getFullYear()

function Footer() {
  return (
    <footer className="py-4 ">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between text-sm text-gray-500 dark:text-gray-400 sm:flex-row">
          <p>© {YEAR} Bubatz Club Manager. All rights reserved.</p>
          <nav className="mt-2 flex space-x-4 sm:mt-0">
            <Link
              href="/dsgvo"
              className="hover:text-gray-700 dark:hover:text-gray-200"
            >
              Datenschutz
            </Link>
            <Link
              href="/impressum"
              className="hover:text-gray-700 dark:hover:text-gray-200"
            >
              Impressum
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer
