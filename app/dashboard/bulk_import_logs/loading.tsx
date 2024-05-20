import { SiProgress } from "react-icons/si";
import { TbProgress } from "react-icons/tb";

export default function Loading() {
    return (

        <section className="flex flex-col items-center justify-center h-screen">
            <div className="flex gap-1 items-center ">
                <TbProgress className="w-10 h-10 animate-spin" />
            </div>
        </section>
    )
}
