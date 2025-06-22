import { Link } from "@inertiajs/react";
import { cn } from "@/libs/utils";
export default function ApplicationLogo({ url = "#"}) {
    return (
        <Link href={url} className="flex items-center gap-2">
            <img
                src="/assets/img/Alamtri Geo Full Monochrome.png"
                alt="logo"
                className={cn('h-[50px]')}
            />
        </Link>
    );
}
