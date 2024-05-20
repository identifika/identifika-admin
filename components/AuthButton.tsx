import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function AuthButton() {
  const { data } = useSession()
  // function to get avatar abbreviation
  function getAbbreviation(name: string) {
    var abbr = name
      .split(' ')
      .map((n) => n[0])
      .join('')
    if (abbr.length > 2) {
      return abbr.slice(0, 2)
    }
    return abbr
  }
  return data?.user ? (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={data?.user?.image!} alt='@shadcn' />
          <AvatarFallback>{getAbbreviation(data?.user?.name!)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{data?.user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href='/api/auth/signout'>Logout</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Link href='/signin'>
      <Button>Sign in</Button>
    </Link>
  )
}
