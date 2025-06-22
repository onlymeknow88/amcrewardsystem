import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure,
} from "@heroui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
    MdOutlineArrowBackIosNew,
    MdOutlineArrowForwardIos,
} from "react-icons/md";
import { useCallback, useMemo, useState } from "react";

import AppLayout from "@/Layouts/AppLayout";
import Create from "./create";
import Edit from "./edit";
import HeaderTitle from "@/Components/HeaderTitle";
import { SearchInput } from "@/Components/SearchInput";
import { router } from "@inertiajs/react";

export default function Index(props) {
    const { employes } = props;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    const [isDeleting, setIsDeleting] = useState(false);

    const columns = [
        { name: "Employe Name", uid: "EmpName" },
        { name: "Company", uid: "Company" },
        { name: "Job Title", uid: "JobTitle" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);

    const [keyword, setKeyword] = useState("");

    // Filter master_points based on search keyword
    const filteredEmployes = useMemo(() => {
        if (!keyword) return employes;

        return employes.filter((employe) => {
            const searchTerm = keyword.toLowerCase();
            return (
                employe.EmpName?.toLowerCase().includes(searchTerm) ||
                employe.Company?.toLowerCase().includes(searchTerm) ||
                employe.JobTitle?.toLowerCase().includes(searchTerm)
            );
        });
    }, [employes, keyword]);

    const pages = Math.ceil(filteredEmployes.length / limit);

    const items = useMemo(() => {
        const start = (page - 1) * limit;
        const end = start + limit;

        return filteredEmployes.slice(start, end);
    }, [page, filteredEmployes, limit]);

    const onRowsPerPageChange = useCallback((e) => {
        const newLimit = Number(e.target.value);
        setLimit(newLimit);
        setPage(1); // Reset to page 1 when changing limit
    }, []);

    // Handle search change
    const onSearchChange = useCallback((value) => {
        setKeyword(value);
        setPage(1); // Reset to page 1 when searching
    }, []);

    // Handle page change and ensure it doesn't exceed available pages
    const handlePageChange = useCallback(
        (newPage) => {
            const maxPages = Math.ceil(filteredEmployes.length / limit);
            if (newPage <= maxPages && newPage >= 1) {
                setPage(newPage);
            }
        },
        [filteredEmployes.length, limit],
    );

    const handleDataRefresh = useCallback(() => {
        router.reload({
            only: ["employes"],
            preserveScroll: true,
            preserveState: false,
        });
    }, []);

    const handleDeleteClick = useCallback(
        (employee) => {
            setEmployeeToDelete(employee);
            onOpen();
        },
        [onOpen],
    );

    const handleConfirmDelete = useCallback(() => {
        if (!employeeToDelete) return;

        setIsDeleting(true);
        router.delete(route("admin.employe.destroy", employeeToDelete.id), {
            onSuccess: () => {
                setIsDeleting(false);
                setEmployeeToDelete(null);
                onOpenChange(false);
                // Data will be automatically refreshed by Inertia
            },
            onError: (errors) => {
                setIsDeleting(false);
                console.error("Delete failed:", errors);
            },
        });
    }, [employeeToDelete, onOpenChange]);

    const handleCancelDelete = useCallback(() => {
        setEmployeeToDelete(null);
        onOpenChange(false);
    }, [onOpenChange]);

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex lg:flex-row flex-col justify-between lg:items-end items-center">
                    <span className="text-default-700 text-small">
                        Rows per page:
                        <select
                            className="bg-white outline-none border-default-200 text-default-700 p-2 ml-2 border-1 rounded-xl"
                            onChange={onRowsPerPageChange}
                            value={limit}
                        >
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="25">25</option>
                        </select>
                    </span>
                    <div className="flex lg:flex-row flex-col justify-between items-center gap-3 mt-4 lg:mt-0">
                        <SearchInput
                            onClear={() => setKeyword("")}
                            onValueChange={onSearchChange}
                            value={keyword}
                        />
                    </div>
                </div>
            </div>
        );
    }, [onRowsPerPageChange, limit, keyword, onSearchChange]);

    const renderCell = useCallback((employe, columnKey) => {
        const cellValue = employe[columnKey];
        switch (columnKey) {
            case "actions":
                return (
                    <div className="relative flex gap-2">
                        <div className="flex items-center">
                            <div>
                                <Edit
                                    employes={employe}
                                    onSuccess={handleDataRefresh}
                                />
                            </div>
                            <div>
                                <Button
                                    startContent={<FaTrash />}
                                    size="sm"
                                    variant="light"
                                    className="text-danger hover:text-danger-600"
                                    onPress={() => handleDeleteClick(employe)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {filteredEmployes.length === 0
                        ? "No employees"
                        : `${items.length} of ${filteredEmployes.length} employees`}
                </span>
                <Pagination
                    showShadow
                    color="primary"
                    variant="light"
                    radius="sm"
                    page={page}
                    total={pages}
                    onChange={handlePageChange}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button
                        isIconOnly
                        isDisabled={page === 1}
                        size="sm"
                        variant="flat"
                        onPress={() => handlePageChange(page - 1)}
                    >
                        <MdOutlineArrowBackIosNew />
                    </Button>
                    <Button
                        isIconOnly
                        isDisabled={page === pages}
                        size="sm"
                        variant="flat"
                        onPress={() => handlePageChange(page + 1)}
                    >
                        <MdOutlineArrowForwardIos />
                    </Button>
                </div>
            </div>
        );
    }, [page, pages, items.length, filteredEmployes.length, handlePageChange]);

    return (
        <div>
            <div className="flex flex-row justify-between align-items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                />
                <Create onSuccess={handleDataRefresh} />
            </div>
            <div className="mt-4">
                <Table
                    isStriped
                    isCompact
                    aria-label="Employe List pagination"
                    bottomContent={bottomContent}
                    topContent={topContent}
                    topContentPlacement="outside"
                    bottomContentPlacement="outside"
                >
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn
                                key={column.uid}
                                className={`bg-[#063D56] text-sm text-white ${
                                    column.uid == "actions"
                                        ? "!text-center"
                                        : ""
                                }`}
                            >
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody items={items} emptyContent="No employees found">
                        {(item) => (
                            <TableRow key={item.id}>
                                {(columnKey) => (
                                    <TableCell
                                        className={` ${columnKey === "actions" ? "w-5" : ""} ${
                                            columnKey === "no" ? "w-5" : ""
                                        }`}
                                    >
                                        {renderCell(item, columnKey)}
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                backdrop="blur"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-danger-100 rounded-full">
                                        <FaTrash className="text-danger text-lg" />
                                    </div>
                                    <span>Delete Employee</span>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-default-500">
                                    Are you sure you want to delete{" "}
                                    <span className="font-semibold text-default-700">
                                        {employeeToDelete?.EmpName}
                                    </span>
                                    ? This action cannot be undone.
                                </p>
                                {employeeToDelete?.Company && (
                                    <p className="text-small text-default-400">
                                        Company: {employeeToDelete.Company}
                                    </p>
                                )}
                                {employeeToDelete?.JobTitle && (
                                    <p className="text-small text-default-400">
                                        Job Title: {employeeToDelete.JobTitle}
                                    </p>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    variant="light"
                                    onPress={handleCancelDelete}
                                    isDisabled={isDeleting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={handleConfirmDelete}
                                    isLoading={isDeleting}
                                    startContent={!isDeleting && <FaTrash />}
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
Index.layout = (page) => (
    <AppLayout
        children={page}
        title={page.props.page_settings.title}
        heroSection={false}
    />
);
