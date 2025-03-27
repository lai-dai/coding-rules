'use client'

import React, { useEffect, useState } from 'react'
import { atom, useAtom } from 'jotai'
import _ from 'lodash'
import { useLocale } from 'next-intl'
import { useUpdateEffect } from 'react-use'

import { PATHNAMES } from '@/config/pathnames'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { LoginForm } from '@/components/forms/login'
import { RegisterForm } from '@/components/forms/register'

import { ForgotPasswordForm } from '../forms/forgot-password'
import { Image } from '../my-ui/image'
import { ResponsiveDialog } from '../my-ui/responsive-dialog'
import { Tabs, TabsContent } from '../ui/tabs'
import { ResetPasswordForm } from '../forms/reset-password'

export const authOpenAtom = atom({
  open: false,
  href: '',
})

export function AuthModal() {
  const locale = useLocale()

  const [{ open, href }, setOpen] = useAtom(authOpenAtom)
  const state = React.useRef(false)
  const [closeOutside, setCloseOutside] = useState(false)

  const FORM_TABS = React.useMemo(
    () => [
      {
        value: `/login`,
        content: <LoginForm inModal />,
      },
      {
        value: `/register`,
        content: <RegisterForm inModal />,
      },
      {
        value: `/forgot-password`,
        content: <ForgotPasswordForm inModal />,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    setCloseOutside(href === '/login')
  }, [href])

  useUpdateEffect(() => {
    if (href) {
      window.history.scrollRestoration = 'manual'

      if (open) {
        const found = _.get(PATHNAMES, href)
        const _url =
          typeof found === 'string'
            ? found
            : typeof found === 'object'
              ? _.get(found, locale, href)
              : href
        const url = locale === 'en' ? `/en${_url}` : _url
        if (state.current) {
          window.history.replaceState(null, '', url)
        } else {
          window.history.pushState(null, '', url)
        }
        state.current = true
      } else {
        window.history.back()
        state.current = false
      }
    }

    return () => {
      window.history.scrollRestoration = 'auto'
    }
  }, [open, href])

  return (
    <ResponsiveDialog
      closeOutside={closeOutside}
      open={open}
      onOpenChange={(open) => setOpen((prev) => ({ ...prev, open }))}
    >
      <Card
        className={cn(
          'max-h-svh w-svw overflow-auto rounded-2xl border-0 p-0 shadow-none lg:max-w-6xl'
        )}
      >
        <CardContent className="grid h-full min-h-screen p-0 lg:grid-cols-2">
          <div className="self-center md:px-6">
            <Tabs value={href}>
              {FORM_TABS.map((item) => (
                <TabsContent key={item.value} value={item.value}>
                  {item.content}
                </TabsContent>
              ))}
            </Tabs>
          </div>
          <div className="hidden flex-col p-6 lg:flex">
            <div className="pointer-events-none relative flex-1 select-none overflow-hidden rounded-3xl">
              <Image
                alt={siteConfig.authBackground.alt}
                src={siteConfig.authBackground.src}
                isSrcLocal
                className="size-full object-cover"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </ResponsiveDialog>
  )
}
