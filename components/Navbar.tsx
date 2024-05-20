'use client'
import Link from 'next/link'

import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { useSession } from 'next-auth/react'
import AuthButton from './AuthButton'
import { usePathname } from 'next/navigation'


const Navbar = () => {
  const { data } = useSession()
  const pathname = usePathname()

  if (pathname.includes('/dashboard')) {
    return null
  }

  return (
    <header className='bg-white dark:bg-neutral-950 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto flex items-center justify-between py-2 px-4'>
        <Link className='font-bold text-lg' href={'/'}>
          Identifika.
        </Link>
        <NavigationMenu>
          <NavigationMenuList className='gap-2'>
            <NavigationMenuItem>
              <Link href='/dashboard' legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), 'font-medium')}
                >
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            

            <NavigationMenuItem>
              {/* if pathname == signin  */}
              {pathname === '/signin' ? (
                null
              ) : (
                <AuthButton />
              )}
            </NavigationMenuItem>

            <NavigationMenuItem>
              <ThemeToggle />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}
export default Navbar
