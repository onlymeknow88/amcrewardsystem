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
import {
    MdOutlineArrowBackIosNew,
    MdOutlineArrowForwardIos,
} from "react-icons/md";
import { useCallback, useMemo, useState } from "react";

import AppLayout from "@/Layouts/AppLayout";
import Create from "./create";
import Edit from "./edit";
import { FaTrash } from "react-icons/fa";
import HeaderTitle from "@/Components/HeaderTitle";
import { SearchInput } from "@/Components/SearchInput";
import { router } from "@inertiajs/react";

export default function Index(props) {
    const { master_points, departments } = props;

    const columns = [
        { name: "Point Description", uid: "PointDesc" },
        { name: "Point Apply To", uid: "PointApplyTo" },
        { name: "Unit", uid: "Unit" },
        { name: "Department", uid: "Department" },
        { name: "Point Type", uid: "PointType" },
        { name: "Point Value", uid: "PointValue" },
        { name: "Action", uid: "actions" },
    ];

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [masterpointToDelete, setMasterPointToDelete] = useState(null);

    const [isDeleting, setIsDeleting] = useState(false);

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);

    const [keyword, setKeyword] = useState("");

    // Filter master_points based on search keyword
    const filteredMasterPoints = useMemo(() => {
        if (!keyword) return master_points;

        return master_points.filter((masterpoint) => {
            const searchTerm = keyword.toLowerCase();
            return (
                masterpoint.PointDesc?.toLowerCase().includes(searchTerm) ||
                masterpoint.Unit?.toLowerCase().includes(searchTerm) ||
                masterpoint.DepartmentName?.toLowerCase().includes(searchTerm) ||
                masterpoint.PointApplyTo?.toLowerCase().includes(searchTerm)
            );
        });
    }, [master_points, keyword]);

    const pages = Math.ceil(filteredMasterPoints.length / limit);

    const items = useMemo(() => {
        const start = (page - 1) * limit;
        const end = start + limit;

        return filteredMasterPoints.slice(start, end);
    }, [page, filteredMasterPoints, limit]);

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
            const maxPages = Math.ceil(filteredMasterPoints.length / limit);
            if (newPage <= maxPages && newPage >= 1) {
                setPage(newPage);
            }
        },
        [filteredMasterPoints.length, limit],
    );

    const handleDataRefresh = useCallback(() => {
        router.reload({
            only: ["master_points"],
            preserveScroll: true,
            preserveState: false,
        });
    }, []);

    const handleDeleteClick = useCallback(
        (masterpoint) => {
            setMasterPointToDelete(masterpoint);
            onOpen();
        },
        [onOpen],
    );

    const handleConfirmDelete = useCallback(() => {
        if (!masterpointToDelete) return;

        setIsDeleting(true);
        router.delete(
            route("admin.master-point.destroy", masterpointToDelete.id),
            {
                onSuccess: () => {
                    setIsDeleting(false);
                    setMasterPointToDelete(null);
                    onOpenChange(false);
                    // Data will be automatically refreshed by Inertia
                },
                onError: (errors) => {
                    setIsDeleting(false);
                    console.error("Delete failed:", errors);
                },
            },
        );
    }, [masterpointToDelete, onOpenChange]);

    const handleCancelDelete = useCallback(() => {
        setMasterPointToDelete(null);
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
                            placeholder="Search by description, unit, department, or apply to..."
                            onClear={() => setKeyword("")}
                            onValueChange={onSearchChange}
                            value={keyword}
                        />
                    </div>
                </div>
            </div>
        );
    }, [onRowsPerPageChange, limit, keyword, onSearchChange]);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {filteredMasterPoints.length === 0
                        ? keyword
                            ? "No master points found matching your search"
                            : "No master points"
                        : `${items.length} of ${filteredMasterPoints.length} master points${keyword ? ' (filtered)' : ''}`}
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
                        aria-label="BackIcon"
                        onPress={() => handlePageChange(page - 1)}
                    >
                        <MdOutlineArrowBackIosNew />
                    </Button>
                    <Button
                        isIconOnly
                        aria-label="ForwardIcon"
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
    }, [page, pages, items.length, filteredMasterPoints.length, handlePageChange, keyword]);

    const renderCell = useCallback((masterpoint, columnKey) => {
        const cellValue = masterpoint[columnKey];
        switch (columnKey) {
            case "PointType":
                return masterpoint.PointType == "plus" ? "+" : "-";
            case "Department":
                return masterpoint.DepartmentName;
            case "actions":
                return (
                    <div className="relative flex gap-2">
                        <div className="flex items-center">
                            <div>
                                <Edit
                                    masterpoint={masterpoint}
                                    departments={departments}
                                    onSuccess={handleDataRefresh}
                                />
                            </div>
                            <div>
                                <Button
                                    startContent={<FaTrash />}
                                    size="sm"
                                    variant="light"
                                    className="text-danger hover:text-danger-600"
                                    onPress={() =>
                                        handleDeleteClick(masterpoint)
                                    }
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
    }, [departments, handleDataRefresh, handleDeleteClick]);

    return (
        <div>
            <div className="flex flex-row justify-between align-items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                />
                <Create
                    onSuccess={handleDataRefresh}
                    departments={departments}
                />
            </div>
            <div className="mt-4">
                <Table
                    isStriped
                    isCompact
                    aria-label="Master Points List pagination"
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
                    <TableBody
                        items={items}
                        emptyContent={keyword ? "No master points found matching your search" : "No master points found"}
                    >
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
                                    <span>Delete Master Point</span>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-default-500">
                                    Are you sure you want to delete{" "}
                                    <span className="font-semibold text-default-700">
                                        {masterpointToDelete?.PointDesc}
                                    </span>
                                    ? This action cannot be undone.
                                </p>
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
