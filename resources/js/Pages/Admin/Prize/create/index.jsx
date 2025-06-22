import {
    Button,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    useDisclosure,
} from "@heroui/react";
import {
    FaBriefcase,
    FaBuilding,
    FaImage,
    FaUpload,
    FaUser,
} from "react-icons/fa";
import { useRef, useState } from "react";

import { IoGift } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { formatCurrency } from "@/libs/utils";
import { useForm } from "@inertiajs/react";

export default function Create({ onSuccess }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [imagePreview, setImagePreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        ItemName: "",
        ImagePath: "",
        Point: "",
        Price: "",
        Stock: "",
        PeriodStart: "",
        PeriodEnd: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create FormData for file upload
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });

        post(route("admin.prize.store"), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                reset();
                setImagePreview(null);
                onOpenChange(false);

                if (onSuccess) {
                    onSuccess();
                }
            },
            onError: (errors) => {
                console.error("Create failed:", errors);
            },
        });
    };

    // Handle modal close
    const handleModalClose = () => {
        reset();
        setImagePreview(null);
        onOpenChange(false);
    };

    // Handle file selection
    const handleFileSelect = (file) => {
        if (file && file.type.startsWith("image/")) {
            setData("ImagePath", file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle drag and drop
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const removeImage = () => {
        setData("ImagePath", "");
        setImagePreview(null);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <Button onPress={onOpen} color="primary">
                Add
            </Button>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                size="4xl"
                scrollBehavior="inside"
                backdrop="opaque"
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                classNames={{
                    backdrop:
                        "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <IoGift className="text-primary" />
                                    <span>Add New Prize</span>
                                </div>
                                <p className="text-small text-default-500 font-normal">
                                    Fill in the prize information below
                                </p>
                            </ModalHeader>
                            <form onSubmit={handleSubmit}>
                                <ModalBody>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Left Column - Image Upload */}
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium">
                                                    Price Image
                                                </label>

                                                {/* Image Upload Area */}
                                                <div
                                                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                                        dragActive
                                                            ? "border-primary bg-primary/10"
                                                            : "border-gray-300 hover:border-primary"
                                                    }`}
                                                    onDragEnter={handleDrag}
                                                    onDragLeave={handleDrag}
                                                    onDragOver={handleDrag}
                                                    onDrop={handleDrop}
                                                >
                                                    {imagePreview ? (
                                                        <div className="relative">
                                                            <img
                                                                src={
                                                                    imagePreview
                                                                }
                                                                alt="Preview"
                                                                className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
                                                            />
                                                            <Button
                                                                isIconOnly
                                                                // size="md"
                                                                radius="lg"
                                                                color="danger"
                                                                className="absolute top-2 right-2 z-10"
                                                                onPress={
                                                                    removeImage
                                                                }
                                                            >
                                                                <IoMdClose />
                                                            </Button>

                                                            <Button
                                                                size="sm"
                                                                variant="solid"
                                                                color="primary"
                                                                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10"
                                                                onPress={
                                                                    triggerFileInput
                                                                }
                                                                startContent={
                                                                    <FaUpload />
                                                                }
                                                            >
                                                                Change
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            <FaImage className="mx-auto text-4xl text-gray-400" />
                                                            <div>
                                                                <p className="text-sm text-gray-600">
                                                                    Drag and
                                                                    drop an
                                                                    image here,
                                                                    or click to
                                                                    select
                                                                </p>
                                                                <p className="text-xs text-gray-400 mt-1">
                                                                    PNG, JPG,
                                                                    GIF up to
                                                                    10MB
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={
                                                            handleFileInput
                                                        }
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                </div>

                                                {errors.ImagePath && (
                                                    <p className="text-red-500 text-sm">
                                                        {errors.ImagePath}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Column - Form Fields */}
                                        <div className="space-y-4">
                                            <Input
                                                autoFocus
                                                variant="bordered"
                                                label="Item Name"
                                                placeholder="Enter prize name"
                                                value={data.ItemName}
                                                onChange={(e) =>
                                                    setData(
                                                        "ItemName",
                                                        e.target.value,
                                                    )
                                                }
                                                isInvalid={!!errors.ItemName}
                                                errorMessage={errors.ItemName}
                                                startContent={
                                                    <IoGift className="text-default-400" />
                                                }
                                            />

                                            <Input
                                                autoFocus
                                                variant="bordered"
                                                label="Price Value"
                                                placeholder="Enter prize value"
                                                value={
                                                    data.Price
                                                        ? formatCurrency.rupiahNumber(
                                                              data.Price,
                                                          )
                                                        : ""
                                                }
                                                onChange={(e) => {
                                                    // Remove non-numeric characters
                                                    const rawValue =
                                                        e.target.value.replace(
                                                            /\D/g,
                                                            "",
                                                        );
                                                    setData(
                                                        "Price",
                                                        rawValue
                                                            ? parseInt(
                                                                  rawValue,
                                                                  10,
                                                              )
                                                            : "",
                                                    );
                                                }}
                                                isInvalid={!!errors.Price}
                                                errorMessage={errors.Price}
                                                startContent={
                                                    <span className="text-default-500 text-sm">
                                                        Rp
                                                    </span>
                                                }
                                            />

                                            <Input
                                                autoFocus
                                                variant="bordered"
                                                label="Points Required"
                                                placeholder="Enter points needed"
                                                type="number"
                                                value={data.Point}
                                                onChange={(e) =>
                                                    setData(
                                                        "Point",
                                                        e.target.value,
                                                    )
                                                }
                                                isInvalid={!!errors.Point}
                                                errorMessage={errors.Point}
                                                startContent={
                                                    <span className="text-default-400">
                                                        ⭐
                                                    </span>
                                                }
                                            />

                                            <Input
                                                autoFocus
                                                variant="bordered"
                                                label="Stock Quantity"
                                                placeholder="Enter available stock"
                                                type="number"
                                                value={data.Stock}
                                                onChange={(e) =>
                                                    setData(
                                                        "Stock",
                                                        e.target.value,
                                                    )
                                                }
                                                isInvalid={!!errors.Stock}
                                                errorMessage={errors.Stock}
                                                startContent={
                                                    <span className="text-default-400">
                                                        #
                                                    </span>
                                                }
                                            />

                                            <div className="grid grid-cols-1 gap-4">
                                                <Input
                                                    autoFocus
                                                    variant="bordered"
                                                    label="Period Start"
                                                    placeholder="Select start date"
                                                    type="date"
                                                    value={data.PeriodStart}
                                                    onChange={(e) =>
                                                        setData(
                                                            "PeriodStart",
                                                            e.target.value,
                                                        )
                                                    }
                                                    isInvalid={
                                                        !!errors.PeriodStart
                                                    }
                                                    errorMessage={
                                                        errors.PeriodStart
                                                    }
                                                />

                                                <Input
                                                    autoFocus
                                                    variant="bordered"
                                                    label="Period End"
                                                    placeholder="Select end date"
                                                    type="date"
                                                    value={data.PeriodEnd}
                                                    onChange={(e) =>
                                                        setData(
                                                            "PeriodEnd",
                                                            e.target.value,
                                                        )
                                                    }
                                                    isInvalid={
                                                        !!errors.PeriodEnd
                                                    }
                                                    errorMessage={
                                                        errors.PeriodEnd
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        className="bg-transparent text-[#063D56]"
                                        variant="flat"
                                        onPress={handleModalClose}
                                        isDisabled={processing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        color="primary"
                                        type="submit"
                                        isLoading={processing}
                                        className="bg-[#063D56]"
                                    >
                                        {processing
                                            ? "Creating..."
                                            : "Create Price"}
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
