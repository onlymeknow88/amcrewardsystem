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
    FaEdit,
    FaImage,
    FaUpload,
    FaUser,
} from "react-icons/fa";
import { router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

import { IoGift } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { formatCurrency } from "@/libs/utils";

export default function Edit({ prizes, onSuccess }) {
    const { props } = usePage();
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [imagePreview, setImagePreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const [data, setData] = useState({
        ItemName: prizes.ItemName || "",
        ImagePath: prizes.ImagePath || "",
        file: null,
        Point: prizes.Point || "",
        Price: prizes.Price || "",
        Stock: prizes.Stock || "",
        PeriodStart: prizes.PeriodStart || "",
        PeriodEnd: prizes.PeriodEnd || "",
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    // Watch for Inertia errors
    useEffect(() => {
        if (props.errors && Object.keys(props.errors).length > 0) {
            setErrors(props.errors);
        }
    }, [props.errors]);

    const reset = () => {
        setData({
            ItemName: prizes.ItemName || "",
            ImagePath: prizes.ImagePath || "",
            file: null,
            Point: prizes.Point || "",
            Price: prizes.Price || "",
            Stock: prizes.Stock || "",
            PeriodStart: prizes.PeriodStart || "",
            PeriodEnd: prizes.PeriodEnd || "",
        });
        setImagePreview(null);
        setErrors({});
        setProcessing(false);
    };

    const clearErrors = () => {
        setErrors({});
        setProcessing(false);
    };

    // Handle data change with error clearing
    const handleDataChange = (key, value) => {
        setData((prev) => ({ ...prev, [key]: value }));

        // Clear error for this field when user starts typing
        if (errors[key]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({}); // Clear existing errors

        // Create FormData for file upload
        const formData = new FormData();
        formData.append("ItemName", data.ItemName);
        formData.append("Point", data.Point);
        formData.append("Price", data.Price);
        formData.append("Stock", data.Stock);
        formData.append("PeriodStart", data.PeriodStart);
        formData.append("PeriodEnd", data.PeriodEnd);
        formData.append("_method", "put");

        // Only append file if a new file is selected
        if (data.file) {
            formData.append("file", data.file);
        }

        router.post(route("admin.prize.update", prizes.id), formData, {
            forceFormData: true,
            onStart: () => {
                setProcessing(true);
            },
            onError: (errors) => {
                console.log("Form errors:", errors);
                setErrors(errors);
                setProcessing(false);
            },
            onSuccess: (page) => {
                console.log("Form submitted successfully");
                setProcessing(false);
                handleModalClose();
                if (onSuccess) {
                    onSuccess();
                }
            },
            onFinish: () => {
                console.log("Request finished");
                setProcessing(false);
            },
        });
    };

    // Handle modal close
    const handleModalClose = () => {
        console.log("Modal closing manually");
        reset();
        onOpenChange(false);
    };

    // Handle file selection
    const handleFileSelect = (file) => {
        if (file && file.type.startsWith("image/")) {
            handleDataChange("file", file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);

            // Clear file error if exists
            if (errors.file) {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.file;
                    return newErrors;
                });
            }
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
        handleDataChange("file", null);
        setData((prev) => ({ ...prev, ImagePath: null }));
        setImagePreview(null);

        // Clear file error if exists
        if (errors.file) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.file;
                return newErrors;
            });
        }
    };

    const handleModalOpen = () => {
        console.log("Modal opening");
        // Reset form data with current prize data when opening
        setData({
            ItemName: prizes.ItemName || "",
            ImagePath: prizes.ImagePath || "",
            file: null,
            Point: prizes.Point || "",
            Price: prizes.Price || "",
            Stock: prizes.Stock || "",
            PeriodStart: prizes.PeriodStart || "",
            PeriodEnd: prizes.PeriodEnd || "",
        });
        // Reset image preview and errors when opening modal
        setImagePreview(null);
        clearErrors();
        onOpen();
    };

    // Function to trigger file input click
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Function to get the image source for display
    const getImageSrc = () => {
        // If there's a new image preview, show it
        if (imagePreview) {
            return imagePreview;
        }
        // If there's an existing image path and it's a string (URL), show it
        if (data.ImagePath && typeof data.ImagePath === "string") {
            return `http://reward.test/storage/${data.ImagePath}`;
        }
        return null;
    };

    // Check if there's any image to display
    const hasImage =
        imagePreview || (data.ImagePath && typeof data.ImagePath === "string");

    return (
        <>
            <Button
                onPress={handleModalOpen}
                startContent={<FaEdit />}
                size="sm"
                variant="light"
            >
                Edit
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
                        "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 z-40",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <IoGift className="text-primary" />
                                    <span>Edit Prize</span>
                                </div>
                                <p className="text-small text-default-500 font-normal">
                                    Fill in the prize information below
                                </p>
                            </ModalHeader>
                            <form onSubmit={handleSubmit}>
                                <ModalBody>
                                    {/* Show general error */}
                                    {errors.general && (
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                            {errors.general}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Left Column - Image Upload */}
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium">
                                                    Prize Image
                                                </label>

                                                {/* Image Upload Area */}
                                                <div
                                                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                                        dragActive
                                                            ? "border-primary bg-primary/10"
                                                            : errors.file
                                                              ? "border-red-500 bg-red-50"
                                                              : "border-gray-300 hover:border-primary"
                                                    }`}
                                                    onDragEnter={handleDrag}
                                                    onDragLeave={handleDrag}
                                                    onDragOver={handleDrag}
                                                    onDrop={handleDrop}
                                                >
                                                    {hasImage ? (
                                                        <div className="relative">
                                                            <img
                                                                src={getImageSrc()}
                                                                alt="Prize Image"
                                                                className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
                                                            />
                                                            <Button
                                                                isIconOnly
                                                                radius="lg"
                                                                color="danger"
                                                                className="absolute top-2 right-2 z-10"
                                                                onPress={
                                                                    removeImage
                                                                }
                                                            >
                                                                <IoMdClose />
                                                            </Button>

                                                            {/* Change Image Button */}
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

                                                    {/* Hidden file input */}
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={
                                                            handleFileInput
                                                        }
                                                        className="hidden"
                                                    />

                                                    {/* Invisible overlay for drag and drop when no image */}
                                                    {!hasImage && (
                                                        <div
                                                            className="absolute inset-0 w-full h-full cursor-pointer"
                                                            onClick={
                                                                triggerFileInput
                                                            }
                                                        />
                                                    )}
                                                </div>

                                                {errors.file && (
                                                    <p className="text-red-500 text-sm">
                                                        {errors.file}
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
                                                    handleDataChange(
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
                                                variant="bordered"
                                                label="Price Value"
                                                placeholder="Enter prize value"
                                                value={formatCurrency.rupiahNumber(
                                                    data.Price,
                                                )}
                                                onChange={(e) => {
                                                    const rawValue =
                                                        e.target.value.replace(
                                                            /\D/g,
                                                            "",
                                                        );
                                                    handleDataChange(
                                                        "Price",
                                                        rawValue,
                                                    );
                                                }}
                                                isInvalid={!!errors.Price}
                                                errorMessage={errors.Price}
                                                startContent={
                                                    <span className="text-default-400 text-sm">
                                                        Rp
                                                    </span>
                                                }
                                            />

                                            <Input
                                                variant="bordered"
                                                label="Points Required"
                                                placeholder="Enter points needed"
                                                type="number"
                                                value={data.Point}
                                                onChange={(e) =>
                                                    handleDataChange(
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
                                                variant="bordered"
                                                label="Stock Quantity"
                                                placeholder="Enter available stock"
                                                type="number"
                                                value={data.Stock}
                                                onChange={(e) =>
                                                    handleDataChange(
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
                                                    variant="bordered"
                                                    label="Period Start"
                                                    placeholder="Select start date"
                                                    type="date"
                                                    value={data.PeriodStart}
                                                    onChange={(e) =>
                                                        handleDataChange(
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
                                                    variant="bordered"
                                                    label="Period End"
                                                    placeholder="Select end date"
                                                    type="date"
                                                    value={data.PeriodEnd}
                                                    onChange={(e) =>
                                                        handleDataChange(
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
                                            ? "Updating..."
                                            : "Update Prize"}
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
