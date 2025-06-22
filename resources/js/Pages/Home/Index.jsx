import {
    Button,
    Card,
    CardFooter,
    CardHeader,
    Chip,
    Image,
} from "@heroui/react";

import AppLayout from "@/Layouts/AppLayout";

export default function Index(props) {
    const {prize} = props;
    console.log(prize)
    const rewards = [
        {
            id: 1,
            rank: "#1",
            name: "Samsung Galaxy Tab S9 Fe Wifi (6/128Gb)",
            image: "/assets/img/1-reward.png",
            points: 1000,
            exclusive: true,
        },
        {
            id: 2,
            rank: "#2",
            name: "Koper Samsonite Spinner Hardcase 78/29 Inch Large Size",
            image: "/assets/img/2-reward.png",
            points: 800,
            exclusive: true,
        },
        {
            id: 3,
            rank: "#3",
            name: "Samsung Galaxy A16 5G 8 Gb 256 Gb",
            image: "/assets/img/3-reward.png",
            points: 550,
            exclusive: true,
        },
        {
            id: 4,
            rank: "#4",
            name: "Tas Backpack Samsonite Garde Backpack Vi Navy",
            image: "/assets/img/4-reward.png",
            points: 450,
            exclusive: true,
        },
        {
            id: 5,
            rank: "#5",
            name: "Huawei Watch Fit 3 Smartwatch",
            image: "/assets/img/5-reward.png",
            points: 400,
            exclusive: true,
        },
        {
            id: 6,
            rank: "#6",
            name: "Eiger Tas Ventrex 30 Backpack Bag 91000 896B Awet",
            image: "/assets/img/6-reward.png",
            points: 350,
            exclusive: true,
        },
        {
            id: 7,
            rank: "#7",
            name: "Kalibre Kemeja Tangan Panjang Army",
            image: "/assets/img/7-reward.png",
            points: 265,
            exclusive: true,
        },
        {
            id: 8,
            rank: "#8",
            name: "Jacket Eg Reversible Parka Hoody L",
            image: "/assets/img/8-reward.png",
            points: 250,
            exclusive: true,
        },
        {
            id: 9,
            rank: "#9",
            name: "Tas Ransel Backpack Kalibre Eudora 20L Khaki 911285219",
            image: "/assets/img/9-reward.png",
            points: 200,
            exclusive: true,
        },
        {
            id: 10,
            rank: "#10",
            name: "Waist Bag Kalibre Infernus Original Tas Pinggang Kalibre",
            image: "/assets/img/10-reward.png",
            points: 175,
            exclusive: true,
        },
        {
            id: 11,
            rank: "#11",
            name: "Topi Eiger Corredor",
            image: "/assets/img/11-reward.png",
            points: 125,
            exclusive: true,
        },
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prize.map((reward,index) => (
                <Card key={reward.id}>
                    <img
                    src={`http://reward.test/storage/${reward.ImagePath}`}
                        // src={reward.ImagePath}
                        alt="Product Image"
                        className="w-full h-[280px] object-cover rounded-t-lg"
                    />
                    <Chip className="absolute top-4 right-4 bg-[#FFD600]">
                        <span className="font-bold">#{index+1}</span>
                    </Chip>
                    <CardFooter>
                        <div className="w-full px-4 pb-4">
                            <div className="flex flex-col">
                                <h3 className="text-lg font-bold">
                                    {reward.ItemName}
                                </h3>
                                <p className="text-sm text-gray-500 mt-4">
                                   Exclusive awards
                                </p>
                            </div>
                            <div className="my-4 w-full h-[1px] border-t border-gray-300"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-bold">
                                    Point Reward
                                </span>
                                <div className="flex items-center gap-2">
                                    <img
                                        src="/assets/icon/ic-reward.svg"
                                        alt="icon"
                                        className="w-4 h-4"
                                    />
                                    <span className="text-[#EC642C] font-bold">
                                        {reward.Point} pts
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
Index.layout = (page) => <AppLayout children={page} title="Home" heroSection={true}/>;
