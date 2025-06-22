import {
    Autocomplete,
    AutocompleteItem,
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
import { useForm, usePage } from "@inertiajs/react";
import { useRef, useState } from "react";

import { IoGift } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { formatCurrency } from "@/libs/utils";

export default function Create({ onSuccess }) {
    const { employes, prizes } = usePage().props;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedPrize, setSelectedPrize] = useState(null);
    const [availablePoints, setAvailablePoints] = useState(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        employe_id: "",
        prize_id: "",
        QTY: 1,
    });
    const handleSubmit = (e) => {
        console.log(data)
        e.preventDefault();
        post(route("admin.claim-history.store"), {
            onSuccess: () => {
                reset();
                onOpenChange(false);
                setSelectedEmployee(null);
                // setEmployeeTotalPoints(0);
                if (onSuccess) {
                    onSuccess();
                }
            },
            onError: (errors) => {
                console.error("Create failed:", errors);
            },
        });
    };

    const handleEmployeeChange = async (employeeId) => {
        setData("employe_id", employeeId);

        const employee = employes.find((emp) => emp.id == employeeId);
        setSelectedEmployee(employee);

        // Fetch employee's available points
        if (employeeId) {
            try {
                const response = await fetch(
                    `/admin/claim-history/employee-points?employe_id=${employeeId}`,
                );
                const result = await response.json();
                setAvailablePoints(result.available_points);
            } catch (error) {
                console.error("Error fetching employee points:", error);
                setAvailablePoints(0);
            }
        } else {
            setAvailablePoints(0);
        }
    };

    // Handle modal close
    const handleModalClose = () => {
        setSelectedEmployee(null);

        // Reset available points
        setAvailablePoints(0);

        // Reset selected prize
        setSelectedPrize(null);

        reset();
        onOpenChange(false);
    };

    const handlePrizeChange = (prizeId) => {
        setData("prize_id", prizeId);

        const prize = prizes.find((p) => p.id === Number.parseInt(prizeId));
        setSelectedPrize(prize);

        // Reset quantity when prize changes
        setData("QTY", 1);
    };

    const calculateTotalPoints = () => {
        if (!selectedPrize || !data.QTY) return 0;
        return selectedPrize.Point * data.QTY;
    };

    const canAfford = () => {
        return availablePoints >= calculateTotalPoints();
    };

    const maxAffordableQty = () => {
        if (!selectedPrize || selectedPrize.Point === 0) return 0;
        return Math.min(
            Math.floor(availablePoints / selectedPrize.Point),
            selectedPrize.Stock,
        );
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
                scrollBehavior="outside"
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
                                    <span>Add New Claim Prize History</span>
                                </div>
                                <p className="text-small text-default-500 font-normal">
                                    Fill in the claim prize history information
                                    below
                                </p>
                            </ModalHeader>
                            <form onSubmit={handleSubmit}>
                                <ModalBody>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Left Column - Employee */}
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-2">
                                                {selectedEmployee && (
                                                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                                        <h4 className="text-sm font-medium text-blue-900">
                                                            Employee Information
                                                        </h4>
                                                        <div className="mt-4 text-sm text-blue-700 gap-4 flex flex-col">
                                                            <p>
                                                                <strong>
                                                                    Name:
                                                                </strong>{" "}
                                                                {
                                                                    selectedEmployee.EmpName
                                                                }
                                                            </p>
                                                            <p>
                                                                <strong>
                                                                    Company:
                                                                </strong>{" "}
                                                                {
                                                                    selectedEmployee.Company
                                                                }
                                                            </p>
                                                            <p>
                                                                <strong>
                                                                    Job Title:
                                                                </strong>{" "}
                                                                {
                                                                    selectedEmployee.JobTitle
                                                                }
                                                            </p>
                                                            <p>
                                                                <strong>
                                                                    Available
                                                                    Points:
                                                                </strong>{" "}
                                                                <span className="font-semibold text-lg">
                                                                    {
                                                                        availablePoints
                                                                    }
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <Autocomplete
                                                label="Employee Name"
                                                placeholder="Select a Employee"
                                                selectedKeys={
                                                    data.employe_id
                                                        ? [data.employe_id]
                                                        : []
                                                }
                                                onSelectionChange={(keys) =>
                                                    handleEmployeeChange(keys)
                                                }
                                                isInvalid={
                                                    errors.employe_id
                                                        ? true
                                                        : false
                                                }
                                                className="col-span-1 md:col-span-2"
                                                errorMessage={errors.employe_id}
                                                variant="bordered"
                                            >
                                                {employes.map((item) => (
                                                    <AutocompleteItem
                                                        key={item.id}
                                                        value={item.EmpName}
                                                    >
                                                        {item.EmpName}
                                                    </AutocompleteItem>
                                                ))}
                                            </Autocomplete>

                                            <Select
                                                label="Point Type"
                                                placeholder="Select a point type"
                                                selectedKeys={
                                                    data.prize_id
                                                        ? [data.prize_id]
                                                        : []
                                                }
                                                onSelectionChange={
                                                    (keys) =>
                                                        handlePrizeChange(
                                                            Array.from(
                                                                keys,
                                                            )[0] || "",
                                                        )
                                                }
                                                isInvalid={
                                                    errors.prize_id
                                                        ? true
                                                        : false
                                                }
                                                errorMessage={errors.prize_id}
                                                variant="bordered"
                                            >
                                                {prizes.map((item) => (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={item.ItemName}
                                                    >
                                                        {item.ItemName}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                            {/* Prize Info Card */}
                                            {selectedPrize && (
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                    <h4 className="text-sm font-medium text-green-900">
                                                        Prize Information
                                                    </h4>
                                                    <div className="mt-2 flex items-start space-x-4">
                                                        {selectedPrize.image_path && (
                                                            <img
                                                                src={`/storage/${selectedPrize.image_path}`}
                                                                alt={
                                                                    selectedPrize.item_name
                                                                }
                                                                className="h-20 w-20 object-cover rounded-lg"
                                                            />
                                                        )}
                                                        <div className="text-sm text-green-700">
                                                            <p>
                                                                <strong>
                                                                    Item:
                                                                </strong>{" "}
                                                                {
                                                                    selectedPrize.ItemName
                                                                }
                                                            </p>
                                                            <p>
                                                                <strong>
                                                                    Points
                                                                    Required:
                                                                </strong>{" "}
                                                                {
                                                                    selectedPrize.Point
                                                                }{" "}
                                                                per item
                                                            </p>
                                                            <p>
                                                                <strong>
                                                                    Price:
                                                                </strong>{" "}
                                                                {formatCurrency.rupiahWithSymbol(
                                                                    selectedPrize.Price,
                                                                )}
                                                            </p>
                                                            <p>
                                                                <strong>
                                                                    Available
                                                                    Stock:
                                                                </strong>{" "}
                                                                {
                                                                    selectedPrize.Stock
                                                                }
                                                            </p>
                                                            <p>
                                                                <strong>
                                                                    Max You Can
                                                                    Claim Prize:
                                                                </strong>{" "}
                                                                {maxAffordableQty()}{" "}
                                                                items
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Quantity *
                                                </label>

                                                <Input
                                                    autoFocus
                                                    label="Qty"
                                                    placeholder="Enter Qty"
                                                    value={data.QTY}
                                                    onChange={(e) =>
                                                        setData(
                                                            "QTY",
                                                            e.target.value,
                                                        )
                                                    }
                                                    isInvalid={
                                                        errors.QTY
                                                            ? true
                                                            : false
                                                    }
                                                    type="number"
                                                    errorMessage={errors.QTY}
                                                    variant="bordered"
                                                    className="col-span-1 md:col-span-2"
                                                    min="1"
                                                    max={
                                                        selectedPrize
                                                            ? Math.min(
                                                                  selectedPrize.Stock,
                                                                  maxAffordableQty(),
                                                              )
                                                            : 1
                                                    }
                                                />
                                                {selectedPrize && (
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Maximum available:{" "}
                                                        {Math.min(
                                                            selectedPrize.Stock,
                                                            maxAffordableQty(),
                                                        )}{" "}
                                                        items
                                                    </p>
                                                )}
                                            </div>

                                            {/* Transaction Preview */}
                                            {selectedEmployee &&
                                                selectedPrize &&
                                                data.QTY && (
                                                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                                                        <h4 className="text-sm font-medium text-gray-900">
                                                            Claim Preview
                                                        </h4>
                                                        <div className="mt-2 text-sm text-gray-700">
                                                            <p>
                                                                <strong>
                                                                    Employee:
                                                                </strong>{" "}
                                                                {
                                                                    selectedEmployee.EmpName
                                                                }
                                                            </p>
                                                            <p>
                                                                <strong>
                                                                    Prize:
                                                                </strong>{" "}
                                                                {
                                                                    selectedPrize.ItemName
                                                                }
                                                            </p>
                                                            <p>
                                                                <strong>
                                                                    Quantity:
                                                                </strong>{" "}
                                                                {data.QTY}
                                                            </p>
                                                            <p>
                                                                <strong>
                                                                    Points per
                                                                    Item:
                                                                </strong>{" "}
                                                                {
                                                                    selectedPrize.Point
                                                                }
                                                            </p>
                                                            <p>
                                                                <strong>
                                                                    Total Points
                                                                    Required:
                                                                </strong>{" "}
                                                                <span className="font-semibold text-red-600">
                                                                    {calculateTotalPoints()}
                                                                </span>
                                                            </p>
                                                            <p>
                                                                <strong>
                                                                    Available
                                                                    Points:
                                                                </strong>{" "}
                                                                {
                                                                    availablePoints
                                                                }
                                                            </p>
                                                            <p>
                                                                <strong>
                                                                    Remaining
                                                                    Points:
                                                                </strong>{" "}
                                                                <span
                                                                    className={`font-semibold ${canAfford() ? "text-green-600" : "text-red-600"}`}
                                                                >
                                                                    {availablePoints -
                                                                        calculateTotalPoints()}
                                                                </span>
                                                            </p>
                                                            {!canAfford() && (
                                                                <p className="text-red-600 font-medium mt-2">
                                                                    ⚠️
                                                                   Poin tidak cukup untuk klaim ini!
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
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
                                        isDisabled={processing || !canAfford()}
                                        isLoading={processing}
                                        className="bg-[#063D56]"
                                    >
                                        {processing
                                            ? "Creating..."
                                            : "Create Claim Prize"}
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
