'use client';
import { RxDashboard } from "react-icons/rx";
import { PiUsers } from "react-icons/pi";
import { TbFaceId } from "react-icons/tb";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
    { name: 'Home', href: '/dashboard', icon: RxDashboard },
    {
        name: 'Users',
        href: '/dashboard/users',
        icon: PiUsers,
    },
    { name: 'Faces', href: '/dashboard/faces', icon: TbFaceId },
];


export default function NavLinks() {
    const pathname = usePathname();

    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            'flex h-[48px] grow items-center justify-center rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start  md:px-3',
                            {
                                'bg-blue-100 text-white-600': pathname === link.href,
                            },
                        )}
                    >
                        <LinkIcon className="w-6" />
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}
