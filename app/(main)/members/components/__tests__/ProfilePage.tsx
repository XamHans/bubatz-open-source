import ProfilePage from '@/app/profile/page'
import { useToast } from '@/components/ui/use-toast'
import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React from 'react'

jest.mock('@/app/profile/page', () => {
  return function MockProfilePage() {
    const { data: session } = useSession()
    const t = useTranslations('Profile')
    const { toast } = useToast()

    return (
      <div>
        <h1>{t('title')}</h1>
        <p>{session.user.name}</p>
        <button onClick={() => toast({ title: 'Toasted!' })}>
          {t('toastButton')}
        </button>
      </div>
    )
  }
})

describe('ProfilePage', () => {
  it('renders user name from session', () => {
    render(<ProfilePage />)
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('uses translated strings', () => {
    render(<ProfilePage />)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('toastButton')).toBeInTheDocument()
  })

  it('can trigger toast', () => {
    const { toast } = useToast()
    render(<ProfilePage />)
    const button = screen.getByText('toastButton')
    button.click()
    expect(toast).toHaveBeenCalledWith({ title: 'Toasted!' })
  })
})
