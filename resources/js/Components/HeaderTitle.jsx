import { cn } from '@/libs/utils';
export default function HeaderTitle({ title, subtitle, icon: Icon, color = false }) {
    return (
        <div className="flex flex-col">
            <div className="flex flex-row items-center gap-x-1">
                {/* <Icon className={cn("size-6", color ? 'lg:text-white': 'text-black')} /> */}
                <h1 className={cn("text-lg font-bold lg:text-2xl", color ? 'lg:text-white': 'text-black')}>{title}</h1>
            </div>
            <p className={cn("text-sm font-medium text-muted-foreground",color ? 'lg:text-white': 'text-black')}>{subtitle}</p>
        </div>
    );
}
