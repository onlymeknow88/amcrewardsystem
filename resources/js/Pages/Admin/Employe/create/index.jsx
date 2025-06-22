import {
    Button,
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
import { FaBriefcase, FaBuilding, FaUser } from "react-icons/fa";

import { useForm } from "@inertiajs/react";

export default function Create({onSuccess}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { data, setData, post, processing, errors, reset } = useForm({
        EmpName: "",
        Company: "",
        JobTitle: "",
        email: "",
        phone: "",
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.employe.store"), {
            onSuccess: () => {
                reset();
                onOpenChange(false);

                if (onSuccess) {
                    onSuccess();
                }
            },
            onError: (errors) => {
                console.error('Create failed:', errors);
            }
        });
    };

    // Handle modal close
    const handleModalClose = () => {
        reset();
        onOpenChange(false);
    };
    return (
        <>
            <Button onPress={onOpen} color="primary">Add</Button>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                size="2xl"
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
                                    <FaUser className="text-primary" />
                                    <span>Add New Employee</span>
                                </div>
                                <p className="text-small text-default-500 font-normal">
                                    Fill in the employee information below
                                </p>
                            </ModalHeader>
                            <form onSubmit={handleSubmit}>
                                <ModalBody>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            autoFocus
                                            label="Employee Name"
                                            placeholder="Enter employee name"
                                            startContent={
                                                <FaUser className="text-default-400 pointer-events-none flex-shrink-0" />
                                            }
                                            value={data.EmpName}
                                            onChange={(e) =>
                                                setData(
                                                    "EmpName",
                                                    e.target.value,
                                                )
                                            }
                                            isInvalid={
                                                errors.EmpName ? true : false
                                            }
                                            errorMessage={errors.EmpName}
                                            variant="bordered"
                                            className="col-span-1 md:col-span-2"
                                        />

                                        <Select
                                            label="Company"
                                            placeholder="Select a company"
                                            startContent={
                                                <FaBuilding className="text-default-400 pointer-events-none flex-shrink-0" />
                                            }
                                            selectedKeys={
                                                data.Company
                                                    ? [data.Company]
                                                    : []
                                            }
                                            onSelectionChange={(keys) =>
                                                setData(
                                                    "Company",
                                                    Array.from(keys)[0] || "",
                                                )
                                            }
                                            isInvalid={
                                                errors.Company ? true : false
                                            }
                                            errorMessage={errors.Company}
                                            variant="bordered"
                                        >
                                            {[
                                                {
                                                    id: "PT. Adaro Minerals Indonesia, Tbk",
                                                    name: "PT. Adaro Minerals Indonesia, Tbk",
                                                },
                                                {
                                                    id: "PT. Alam Tri Daya Indonesia",
                                                    name: "PT. Alam Tri Daya Indonesia",
                                                },
                                                {
                                                    id: "PT. Lahai Coal",
                                                    name: "PT. Lahai Coal",
                                                },
                                                {
                                                    id: "PT. Maruwai Coal",
                                                    name: "PT. Maruwai Coal",
                                                },
                                                {
                                                    id: "PT. Sumber Barito Coal",
                                                    name: "PT. Sumber Barito Coal",
                                                },
                                                {
                                                    id: "PT. Kalteng Coal",
                                                    name: "PT. Kalteng Coal",
                                                },
                                                {
                                                    id: "PT. Pari Coal",
                                                    name: "PT. Pari Coal",
                                                },
                                                {
                                                    id: "PT. Ratah Coal",
                                                    name: "PT. Ratah Coal",
                                                },
                                                {
                                                    id: "PT. Primac Perkasa Indonesia",
                                                    name: "PT. Primac Perkasa Indonesia",
                                                },
                                            ].map((company) => (
                                                <SelectItem
                                                    key={company.id}
                                                    value={company.name}
                                                >
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </Select>

                                        <Input
                                            label="Job Title"
                                            placeholder="Enter job title"
                                            startContent={
                                                <FaBriefcase className="text-default-400 pointer-events-none flex-shrink-0" />
                                            }
                                            value={data.JobTitle}
                                            onChange={(e) =>
                                                setData(
                                                    "JobTitle",
                                                    e.target.value,
                                                )
                                            }
                                            isInvalid={
                                                errors.JobTitle ? true : false
                                            }
                                            errorMessage={errors.JobTitle}
                                            variant="bordered"
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
                                            : "Create Employee"}
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
