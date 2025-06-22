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
    const { employes, masterPoints } = usePage().props;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeeTotalPoints, setEmployeeTotalPoints] = useState(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        employe_id: "",
        EntitleDate: "",
        PointType: "",
        PointDesc: "",
        PointValue: "",
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.transaction-point.store"), {
            onSuccess: () => {
                reset();
                onOpenChange(false);
                setSelectedEmployee(null);
                setEmployeeTotalPoints(0);
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
        // console.log(employeeId);
        const employee = employes.find((emp) => emp.id == employeeId);
        console.log(employee, "employee");
        setSelectedEmployee(employee);

        // console.log(selectedEmployee)

        // Fetch employee's total points
        if (employeeId) {
            try {
                const response = await fetch(
                    `/admin/transaction-point/employee-points?employe_id=${employeeId}`,
                );
                const result = await response.json();
                // console.log(result);
                setEmployeeTotalPoints(result.total_points);
            } catch (error) {
                console.error("Error fetching employee points:", error);
            }
        } else {
            setEmployeeTotalPoints(0);
        }
    };

    // Handle modal close
    const handleModalClose = () => {
        setSelectedEmployee(null);
        setEmployeeTotalPoints(0);
        reset();
        onOpenChange(false);
    };

    const handleMasterPointSelect = (masterPoint) => {
        // console.log(masterPoint)
        setData({
            ...data,
            PointApplyTo: masterPoint.PointApplyTo,
            PointDesc: masterPoint.PointDesc,
            PointValue:
                masterPoint.PointType === "plus"
                    ? masterPoint.PointValue
                    : -masterPoint.PointValue,
        });
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
                                    <IoGift className="text-primary" />
                                    <span>Add New Transaction Point</span>
                                </div>
                                <p className="text-small text-default-500 font-normal">
                                    Fill in the transaction point information
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
                                                                    Current
                                                                    Total
                                                                    Points:
                                                                </strong>{" "}
                                                                <span className="font-semibold">
                                                                    {
                                                                        employeeTotalPoints
                                                                    }
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Selected Point
                                                    </label>
                                                    <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
                                                        {masterPoints.map(
                                                            (masterPoint) => (
                                                                <button
                                                                    key={
                                                                        masterPoint.id
                                                                    }
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleMasterPointSelect(
                                                                            masterPoint,
                                                                        )
                                                                    }
                                                                    className="text-left p-2 hover:bg-gray-80 rounded border border-gray-200 transition-colors"
                                                                >
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-sm font-medium">
                                                                            {masterPoint.PointDesc +
                                                                                " " +
                                                                                masterPoint.Unit +
                                                                                " " +
                                                                                masterPoint.Department}
                                                                        </span>
                                                                        <span
                                                                            className={`text-sm font-bold ${masterPoint.PointType === "plus" ? "text-green-600" : "text-red-600"}`}
                                                                        >
                                                                            {masterPoint.PointType ===
                                                                            "plus"
                                                                                ? "+"
                                                                                : "-"}
                                                                            {
                                                                                masterPoint.PointValue
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {
                                                                            masterPoint.PointApplyTo
                                                                        }
                                                                    </div>
                                                                </button>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
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

                                            <Input
                                                autoFocus
                                                variant="bordered"
                                                label="Entitle Date"
                                                placeholder="Select date"
                                                type="date"
                                                value={data.EntitleDate}
                                                onChange={(e) =>
                                                    setData(
                                                        "EntitleDate",
                                                        e.target.value,
                                                    )
                                                }
                                                isInvalid={!!errors.EntitleDate}
                                                errorMessage={
                                                    errors.EntitleDate
                                                }
                                            />

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
                                                        Array.from(keys)[0] ||
                                                            "",
                                                    )
                                                }
                                                isInvalid={
                                                    errors.PointType
                                                        ? true
                                                        : false
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
                                                    errors.PointValue
                                                        ? true
                                                        : false
                                                }
                                                errorMessage={errors.PointValue}
                                                variant="bordered"
                                                className="col-span-1 md:col-span-2"
                                            />
                                            {data.PointValue &&
                                                selectedEmployee && (
                                                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                                                        <h4 className="text-sm font-medium text-gray-900">
                                                            Transaction Preview
                                                        </h4>
                                                        <div className="mt-4 gap-4 text-sm text-gray-700 flex flex-col">
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
                                                                    Current
                                                                    Points:
                                                                </strong>{" "}
                                                                {
                                                                    employeeTotalPoints
                                                                }
                                                            </p>
                                                            <p>
                                                                <strong>
                                                                    Transaction:
                                                                </strong>
                                                                <span
                                                                    className={`font-semibold ml-1 ${data.PointValue >= 0 ? "text-green-600" : "text-red-600"}`}
                                                                >
                                                                    {data.PointValue >
                                                                    0
                                                                        ? "+"
                                                                        : ""}
                                                                    {
                                                                        data.PointValue
                                                                    }
                                                                </span>
                                                            </p>
                                                            <p>
                                                                <strong>
                                                                    New Total:
                                                                </strong>
                                                                <span className="font-semibold ml-1">
                                                                     {employeeTotalPoints + Number.parseInt(data.PointValue || 0)}
                                                                </span>
                                                            </p>
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
                                        isLoading={processing}
                                        className="bg-[#063D56]"
                                    >
                                        {processing
                                            ? "Creating..."
                                            : "Create Transaction Point"}
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
