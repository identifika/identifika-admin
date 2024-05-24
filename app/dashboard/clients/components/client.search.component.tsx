import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { IoCloseCircle } from "react-icons/io5";

type ClientSearchComponentProps = {
    page: number
    limit: number
    search: string
}

export default function ClientSearchComponent(props: ClientSearchComponentProps) {
    const searchText = useRef<HTMLInputElement>(null)
    const router = useRouter()


    function onSearchFunction(e: any) {
        e.preventDefault()
        const search = searchText.current?.value;
        router.push(`/dashboard/clients?page=${props.page}&limit=${props.limit}&search=${search}`)

    }

    return (
        <div className="mt-6 md:flex md:items-center md:justify-between">
            <div className="relative flex items-center mt-4 md:mt-0 justify-between">
                <div className="relative flex items-center">
                    <span className="absolute">
                        <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 ml-4" />
                    </span>
                    <form method="get" action="/dashboard/faces">
                        <input
                            type="text"
                            placeholder="Search"
                            className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            ref={searchText}
                        />
                        <button
                            type="submit"
                            onClick={onSearchFunction}
                            hidden
                        >
                        </button>
                    </form>
                </div>
                <button
                    onClick={() => {
                        searchText.current!.value = '';
                        router.push(`/dashboard/clients?page=${props.page}&limit=${props.limit}`)
                    }}
                    className="absolute right-0 top-0 bottom-0 px-3 py-1.5 text-gray-400 dark:text-gray-500"
                >
                    <IoCloseCircle className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}