import {
    Avatar,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
} from "@heroui/react";
import { router, usePage } from "@inertiajs/react";
import { useMemo, useState } from "react";

import ApplicationLogo from "@/Components/ApplicationLogo";

export default function Header({ url, auth }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const publicNavigation = [
        { name: "Home", href: "/", current: url === "/" },
        {
            name: "Leaderboard",
            href: "/leaderboard",
            current: url.startsWith("/leaderboard"),
        },
    ];
    const menuItems = ["Home", "Leaderboard", "Log Out"];

    const adminNavigation = [
        {
            name: "Employees",
            href: "/admin/employe",
            current: url.startsWith("/admin/employe"),
        },
        {
            name: "Master Points",
            href: "/admin/master-point",
            current: url.startsWith("/admin/master-point"),
        },
        {
            name: "Prizes",
            href: "/admin/prize",
            current: url.startsWith("/admin/prize"),
        },
        {
            name: "Transaction Points",
            href: "/admin/transaction-point",
            current: url.startsWith("/admin/transaction-point"),
        },
        {
            name: "Claim Histories",
            href: "/admin/claim-history",
            current: url.startsWith("/admin/claim-history"),
        },
    ];

    const isAdmin =
        auth?.user?.role?.name === "admin" ||
        auth?.user?.role?.name === "super_admin";
    const navigation = [
        ...publicNavigation,
        ...(isAdmin ? adminNavigation : []),
    ];

    const initials = useMemo(() => {
        if (!auth?.user?.name) return "?";

        return auth?.user?.name
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase())
            .slice(0, 2) // Take only first 2 initials
            .join("");
    }, [auth?.user?.name]);

    const Logout = () => {
        router.post("/logout");
    };

    return (
        <Navbar
            onMenuOpenChange={setIsMenuOpen}
            className="bg-[#063D56] backdrop-blur-sm "
            maxWidth="2xl"
            height={80}
        >
            <NavbarContent className="lg:hidden">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden text-white"
                />
                <NavbarBrand>
                    <ApplicationLogo />
                </NavbarBrand>
            </NavbarContent>

            <NavbarBrand className="flex-shrink-0 gap-10" justify="start">
                <ApplicationLogo />
                <NavbarContent className="gap-8 hidden sm:flex" justify="start">
                    {/* <NavbarItem>
                </NavbarItem> */}
                    {navigation.map((item) => (
                        <NavbarItem key={item.name}>
                            <Link
                                href={item.href}
                                className={`"w-full text-md text-gray-300 hover:text-white transition-colors", ${item.current ? "text-white font-bold" : ""}`}
                                size="lg"
                            >
                                {item.name}
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>
            </NavbarBrand>
            <NavbarContent as="div" justify="end">
                {auth?.user && (
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                color="primary"
                                name={initials}
                                size="sm"
                            />
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Profile Actions"
                            variant="flat"
                        >
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold">
                                    {auth.user.name}
                                </p>
                            </DropdownItem>
                            <DropdownItem
                                key="logout"
                                color="danger"
                                onPress={Logout}
                            >
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                )}
            </NavbarContent>
            <NavbarMenu className="bg-[#1F5067]">
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            className={`"w-full text-white hover:text-[#B4C5CC] transition-colors", ${index === menuItems.length - 1 ? "text-danger" : ""}`}
                            href="#"
                            size="lg"
                        >
                            {item}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}
