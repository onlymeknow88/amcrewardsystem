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
import { formatCurrency } from "@/libs/utils";
import { router } from "@inertiajs/react";

export default function Index(props) {
    const { prizes } = props;
    const columns = [
        { name: "Item Name", uid: "ItemName" },
        { name: "Image Path", uid: "ImagePath" },
        { name: "Point", uid: "Point" },
        { name: "Price", uid: "Price" },
        { name: "Stock", uid: "Stock" },
        { name: "Period Start", uid: "PeriodStart" },
        { name: "Period End", uid: "PeriodEnd" },
        // {name: "Created By", uid: "CreatedBy"},
        // {name: "Updated By", uid: "UpdatedBy"},
        { name: "Action", uid: "actions" },
    ];

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [prizesToDelete, setPrizeToDelete] = useState(null);

    const [isDeleting, setIsDeleting] = useState(false);

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);

    const [keyword, setKeyword] = useState("");

    // Filter prizes based on search keyword
    const filteredPrizes = useMemo(() => {
        if (!keyword) return prizes;

        return prizes.filter((prize) => {
            const searchTerm = keyword.toLowerCase();
            return (
                prize.ItemName?.toLowerCase().includes(searchTerm) ||
                prize.Point?.toLowerCase().includes(searchTerm) ||
                prize.Price?.toLowerCase().includes(searchTerm)
            );
        });
    }, [prizes, keyword]);

    const pages = Math.ceil(filteredPrizes.length / limit);

    const items = useMemo(() => {
        const start = (page - 1) * limit;
        const end = start + limit;

        return filteredPrizes.slice(start, end);
    }, [page, filteredPrizes, limit]);

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
            const maxPages = Math.ceil(filteredPrizes.length / limit);
            if (newPage <= maxPages && newPage >= 1) {
                setPage(newPage);
            }
        },
        [filteredPrizes.length, limit],
    );

    const handleDataRefresh = useCallback(() => {
        router.reload({
            only: ["prizes"],
            preserveScroll: true,
            preserveState: false,
        });
    }, []);

    const handleDeleteClick = useCallback(
        (prize) => {
            setPrizeToDelete(prize);
            onOpen();
        },
        [onOpen],
    );

    const handleConfirmDelete = useCallback(() => {
        if (!prizesToDelete) return;

        setIsDeleting(true);
        router.delete(route("admin.prize.destroy", prizesToDelete.id), {
            onSuccess: () => {
                setIsDeleting(false);
                setPrizeToDelete(null);
                onOpenChange(false);
                // Data will be automatically refreshed by Inertia
            },
            onError: (errors) => {
                setIsDeleting(false);
                console.error("Delete failed:", errors);
            },
        });
    }, [prizesToDelete, onOpenChange]);

    const handleCancelDelete = useCallback(() => {
        setPrizeToDelete(null);
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
                    {filteredPrizes.length === 0
                        ? keyword
                            ? "No master points found matching your search"
                            : "No master points"
                        : `${items.length} of ${filteredPrizes.length} master points${keyword ? " (filtered)" : ""}`}
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
    }, [
        page,
        pages,
        items.length,
        filteredPrizes.length,
        handlePageChange,
        keyword,
    ]);

    const renderCell = useCallback(
        (prize, columnKey) => {
            const cellValue = prize[columnKey];
            switch (columnKey) {
                case "ImagePath":
                    return (
                        <div className="flex items-center gap-2">
                            <img
                                src={`http://reward.test/storage/${cellValue}`}
                                alt="Photo Item"
                                width={250}
                                height={250}
                                // className="rounded-full"
                            />
                        </div>
                    );
                    case "Price":	
                    return formatCurrency.rupiahWithSymbol(prize.Price);
                case "actions":
                    return (
                        <div className="relative flex gap-2">
                            <div className="flex items-center">
                                <div>
                                    <Edit
                                        prizes={prize}
                                        onSuccess={handleDataRefresh}
                                    />
                                </div>
                                <div>
                                    <Button
                                        startContent={<FaTrash />}
                                        size="sm"
                                        variant="light"
                                        className="text-danger hover:text-danger-600"
                                        onPress={() => handleDeleteClick(prize)}
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
        },
        [handleDataRefresh, handleDeleteClick],
    );
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
                        emptyContent={
                            keyword
                                ? "No master points found matching your search"
                                : "No master points found"
                        }
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
                                        {prizesToDelete?.PointDesc}
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
