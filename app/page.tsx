import Link from 'next/link'
import { TbBrandNextjs } from 'react-icons/tb'
import { FaReact } from 'react-icons/fa'
import { SiPrisma, SiTailwindcss } from 'react-icons/si'
import { BiLogoMongodb } from 'react-icons/bi'
import { GoPlus } from 'react-icons/go'
import { IoLogoGithub, IoLogoVercel } from 'react-icons/io5'

import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <>
      <section className="flex items-center justify-center h-screen">
        <div className="space-y-6 pb-8 py-8 md:py-16 lg:py-20 text-center">
          <div className="container flex flex-col items-center gap-4 mx-auto max-w-[64rem]">
            <h1 className="font-bold leading-normal text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Welcome to Identifika.
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Your Trusted Face API
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Link href="/dashboard">
                <Button>
                  Get Started
                </Button>
            </Link>
           
          </div>
        </div>
      </section>



    </>
  )
}
