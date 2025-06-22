import { Head, usePage } from "@inertiajs/react";

import { Chip } from "@heroui/react";
import Header from "./Partials/Header";

export default function AppLayout({ title, children, heroSection = false }) {

const { url } = usePage();
const { auth } = usePage().props;



    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-[#05374D]">
                <Header url={url} auth={auth} />

                {/* Hero Section */}
                {heroSection && (
                    <section className="container mx-auto px-4 py-12">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 max-w-xl">
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="w-8 h-8 rounded flex items-center justify-center">
                                        <img
                                            src="/assets/icon/ic-reward.svg"
                                            alt="icon"
                                            className="w-10"
                                        />
                                    </div>
                                    <Chip className="bg-[#517789] text-white">
                                        Reward System
                                    </Chip>
                                </div>
                                <h1 className="text-5xl font-bold text-white mb-4">
                                    Achievement{" "}
                                    <span className="text-[#EC642C]">Rewards</span>
                                </h1>
                                <p className="text-[#CCCCCC] text-lg">
                                    Unlock exclusive rewards and climb the ranks in
                                    our point-based achievement system
                                </p>
                            </div>
                            <div className="flex-1 flex justify-end">
                                <div className="relative">
                                    <img
                                        src="/assets/img/hero-illustration.png"
                                        alt="Achievement rewards illustration"
                                        width={663}
                                        height={316}
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <main className="bg-white min-h-screen py-16">
                    <div className="container mx-auto px-4">{children}</div>
                </main>

                <footer className="bg-[#05374D] py-6">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-white">© 2024 Rewards System.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
