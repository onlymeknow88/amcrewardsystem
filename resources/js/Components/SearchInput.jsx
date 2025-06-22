import { Input } from "@heroui/react";
import { IoSearch } from "react-icons/io5";
export const SearchInput = ({ ...nativeProps }) => {
    return (
        <Input
            {...nativeProps}
            isClearable
            color="primary"
            variant="bordered"
            radius="sm"
            size="lg"
            className="ml-8 z-0 w-full"
            placeholder="search"
            startContent={<IoSearch />}
            labelPlacement="outside-left"
            classNames={{
                inputWrapper:
                    "border-1 border-gray-300 hover:!border-blue-500 bg-white focus-within:!bg-white text-lg",
            }}
        />
    );
};
