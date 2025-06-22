import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Textarea,
    useDisclosure,
} from "@heroui/react";
import { FaBriefcase, FaBuilding, FaUser } from "react-icons/fa";

import { TiFlashOutline } from "react-icons/ti";
import { useForm } from "@inertiajs/react";

export default function Create({ onSuccess, departments }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { data, setData, post, processing, errors, reset } = useForm({
        PointDesc: "",
        PointType: "",
        PointValue: "",
        PointApplyTo: "",
        Unit: "",
        Department: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.master-point.store"), {
            onSuccess: () => {
                reset();
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
        onOpenChange(false);
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
                size="5xl"
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
                                    <TiFlashOutline className="text-primary" />
                                    <span>Add New Master Points</span>
                                </div>
                                <p className="text-small text-default-500 font-normal">
                                    Fill in the master points information below
                                </p>
                            </ModalHeader>
                            <form onSubmit={handleSubmit}>
                                <ModalBody>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Textarea
                                            autoFocus
                                            label="Point Description"
                                            placeholder="Enter point description"
                                            value={data.PointDesc}
                                            onChange={(e) =>
                                                setData(
                                                    "PointDesc",
                                                    e.target.value,
                                                )
                                            }
                                            isInvalid={
                                                errors.PointDesc ? true : false
                                            }
                                            errorMessage={errors.PointDesc}
                                            variant="bordered"
                                            className="col-span-1 md:col-span-2"
                                        />
                                        <Select
                                            label="Point Apply To"
                                            placeholder="Select a company"
                                            selectedKeys={
                                                data.PointApplyTo
                                                    ? [data.PointApplyTo]
                                                    : []
                                            }
                                            onSelectionChange={(keys) =>
                                                setData(
                                                    "PointApplyTo",
                                                    Array.from(keys)[0] || "",
                                                )
                                            }
                                            isInvalid={
                                                errors.PointApplyTo ? true : false
                                            }
                                            errorMessage={errors.PointApplyTo}
                                            variant="bordered"
                                        >
                                            {[
                                                {
                                                    id: "All",
                                                    name: "All",
                                                },
                                                {
                                                    id: "Individual",
                                                    name: "Individual",
                                                },
                                            ].map((item) => (
                                                <SelectItem
                                                    key={item.id}
                                                    value={item.name}
                                                >
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                        <Select
                                            label="Unit"
                                            placeholder="Select a unit"
                                            selectedKeys={
                                                data.Unit
                                                    ? [data.Unit]
                                                    : []
                                            }
                                            onSelectionChange={(keys) =>
                                                setData(
                                                    "Unit",
                                                    Array.from(keys)[0] || "",
                                                )
                                            }
                                            isInvalid={
                                                errors.Unit ? true : false
                                            }
                                            errorMessage={errors.Unit}
                                            variant="bordered"
                                        >
                                            {[
                                                {
                                                    id: "Satuan",
                                                    name: "Satuan",
                                                },
                                                {
                                                    id: "Bulanan",
                                                    name: "Bulanan",
                                                },
                                            ].map((item) => (
                                                <SelectItem
                                                    key={item.id}
                                                    value={item.name}
                                                >
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                        <Autocomplete
                                            label="Department"
                                            placeholder="Select a department"
                                            selectedKeys={
                                                data.Department
                                                    ? [data.Department]
                                                    : []
                                            }
                                            onSelectionChange={(keys) =>
                                                setData(
                                                    "Department",
                                                    Array.from(keys)[0] || "",
                                                )
                                            }
                                            isInvalid={
                                                errors.Department ? true : false
                                            }
                                            errorMessage={errors.Department}
                                            variant="bordered"
                                        >
                                            {departments.map((item) => (
                                                <AutocompleteItem
                                                    key={item.id}
                                                    value={item.name}
                                                >
                                                    {item.name}
                                                </AutocompleteItem>
                                            ))}
                                        </Autocomplete>
                                        <Select
                                            label="Point Type"
                                            placeholder="Select a point type"
                                            selectedKeys={
                                                data.PointType
                                                    ? [data.PointType]
                                                    : []
                                            }
                                            onSelectionChange={(keys) =>
                                                setData(
                                                    "PointType",
                                                    Array.from(keys)[0] || "",
                                                )
                                            }
                                            isInvalid={
                                                errors.PointType ? true : false
                                            }
                                            errorMessage={errors.PointType}
                                            variant="bordered"
                                        >
                                            {[
                                                {
                                                    id: "plus",
                                                    name: "+",
                                                },
                                                {
                                                    id: "minus",
                                                    name: "-",
                                                },
                                            ].map((item) => (
                                                <SelectItem
                                                    key={item.id}
                                                    value={item.name}
                                                >
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                         <Input
                                            autoFocus
                                            label="Point Value"
                                            placeholder="Enter point value"
                                            value={data.PointValue}
                                            onChange={(e) =>
                                                setData(
                                                    "PointValue",
                                                    e.target.value,
                                                )
                                            }
                                            isInvalid={
                                                errors.PointValue ? true : false
                                            }
                                            errorMessage={errors.PointValue}
                                            variant="bordered"
                                            className="col-span-1 md:col-span-2"
                                        />
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        className="bg-transparent text-[#063D56]"
                                        // color="danger"
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
                                            : "Create Master Point"}
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
