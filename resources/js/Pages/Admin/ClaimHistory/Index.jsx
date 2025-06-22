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
    Pagination,
    Select,
    SelectItem,
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
import { router, useForm } from "@inertiajs/react";
import { useCallback, useMemo, useState } from "react";

import AppLayout from "@/Layouts/AppLayout";
import Create from "./create";
import Edit from "./edit";
import { FaTrash } from "react-icons/fa";
import HeaderTitle from "@/Components/HeaderTitle";
import { SearchInput } from "@/Components/SearchInput";

export default function Index(props) {
    const { claimHistories, employes, prizes, filters } = props;

    const [showFilters, setShowFilters] = useState(false);
    const columns = [
        { name: "Employee Name", uid: "employe_id" },
        { name: "Prize", uid: "prize_id" },
        { name: "QTY", uid: "QTY" },
        { name: "Points Used", uid: "PointUsed" },
        { name: "Claim Date", uid: "created_at" },
        { name: "Action", uid: "actions" },
    ];

    const { data, setData, get, processing } = useForm({
        employe_id: filters.employe_id || "",
        prize_id: filters.prize_id || "",
        date_from: filters.date_from || "",
        date_to: filters.date_to || "",
    });

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [tPToDelete, setTPToDelete] = useState(null);

    const [isDeleting, setIsDeleting] = useState(false);

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);

    const [keyword, setKeyword] = useState("");

    // Filter claimHistories based on search keyword
    const filteredTClaimHistories = useMemo(() => {
        if (!keyword) return claimHistories;

        return claimHistories.filter((claimHistory) => {
            const searchTerm = keyword.toLowerCase();
            return (
                claimHistory.EntitleDate?.toLowerCase().includes(searchTerm) ||
                claimHistory.PointType?.toLowerCase().includes(searchTerm) ||
                claimHistory.PointValue?.toLowerCase().includes(searchTerm) ||
                claimHistory.PointDesc?.toLowerCase().includes(searchTerm)
            );
        });
    }, [claimHistories, keyword]);

    const pages = Math.ceil(filteredTClaimHistories.length / limit);

    const items = useMemo(() => {
        const start = (page - 1) * limit;
        const end = start + limit;

        return filteredTClaimHistories.slice(start, end);
    }, [page, filteredTClaimHistories, limit]);

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
            const maxPages = Math.ceil(filteredTClaimHistories.length / limit);
            if (newPage <= maxPages && newPage >= 1) {
                setPage(newPage);
            }
        },
        [filteredTClaimHistories.length, limit],
    );

    const handleDataRefresh = useCallback(() => {
        router.reload({
            only: ["claimHistories"],
            preserveScroll: true,
            preserveState: false,
        });
    }, []);

    const handleDeleteClick = useCallback(
        (transactionpoint) => {
            setTPToDelete(transactionpoint);
            onOpen();
        },
        [onOpen],
    );

    const handleConfirmDelete = useCallback(() => {
        if (!tPToDelete) return;

        setIsDeleting(true);
        router.delete(route("admin.claim-history.destroy", tPToDelete.id), {
            onSuccess: () => {
                setIsDeleting(false);
                setTPToDelete(null);
                onOpenChange(false);
                // Data will be automatically refreshed by Inertia
            },
            onError: (errors) => {
                setIsDeleting(false);
                console.error("Delete failed:", errors);
            },
        });
    }, [tPToDelete, onOpenChange]);

    const handleCancelDelete = useCallback(() => {
        setTPToDelete(null);
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
                    {filteredTClaimHistories.length === 0
                        ? keyword
                            ? "No transaction points found matching your search"
                            : "No transaction points"
                        : `${items.length} of ${filteredTClaimHistories.length} transaction points${keyword ? " (filtered)" : ""}`}
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
        filteredTClaimHistories.length,
        handlePageChange,
        keyword,
    ]);

    const calculateTotalPoints = (claim) => {
        return claim.prize.Point * claim.QTY;
    };

    const renderCell = useCallback(
        (claim, columnKey) => {
            const cellValue = claim[columnKey];
            switch (columnKey) {
                case "employe_id":
                    return claim.NameEmployee;
                case "prize_id":
                    return claim.prize.ItemName;
                case "PointUsed":
                    return calculateTotalPoints(claim);
                case "created_at":
                    return new Date(claim.created_at).toLocaleDateString();
                case "actions":
                    return (
                        <div className="relative flex gap-2">
                            <div className="flex items-center">
                                <div>
                                    <Edit
                                            claimHistories={claim}
                                            onSuccess={handleDataRefresh}
                                        />
                                </div>
                                <div>
                                    <Button
                                        startContent={<FaTrash />}
                                        size="sm"
                                        variant="light"
                                        className="text-danger hover:text-danger-600"
                                        onPress={() => handleDeleteClick(claim)}
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

    const handleFilter = (e) => {
        e.preventDefault();
        get(route("admin.claim-history.index"), {
             preserveScroll: true,
            preserveState: true,
        });
    };

    const clearFilters = () => {
        setData({
            employe_id: "",
            prize_id: "",
            date_from: "",
            date_to: "",
        });
        router.get(route("admin.claim-history.index"));
    };
    return (
        <div>
            <div className="flex flex-row justify-between align-items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                />
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-2">
                    <Button
                    variant="ghost"
                        onClick={() => setShowFilters(!showFilters)}
                        // className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                        {showFilters ? "Hide Filters" : "Show Filters"}
                    </Button>
                    <Create onSuccess={handleDataRefresh} />
                </div>
            </div>
            {showFilters && (
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <form
                        onSubmit={handleFilter}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Employee
                            </label>
                            <Autocomplete
                                color="primary"
                                // label="Employee Name"
                                placeholder="Select a Employee"
                                selectedKey={`${data.employe_id ?? ""}`}
                                onSelectionChange={(keys) =>
                                    setData("employe_id", keys)
                                }
                                // isInvalid={errors.employe_id ? true : false}
                                className="col-span-1 md:col-span-2"
                                classNames={{
                                    base: "bg-white rounded-lg",
                                }}
                                // errorMessage={errors.employe_id}
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
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Prize
                            </label>
                            <Autocomplete
                                color="primary"
                                selectedKey={`${data.prize_id ?? ""}`}
                                placeholder="Select a Prize"
                                onSelectionChange={(e) =>
                                    setData("prize_id", e)
                                }
                                className="col-span-1 md:col-span-2"
                                classNames={{
                                    base: "bg-white rounded-lg",
                                }}
                                variant="bordered"
                            >
                                {/* <option value="">All Prizes</option> */}
                                {prizes.map((prize) => (
                                    <AutocompleteItem
                                        key={prize.id}
                                        value={prize.id}
                                    >
                                        {prize.ItemName}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Date From
                            </label>
                            <Input
                                color="primary"
                                autoFocus
                                type="date"
                                variant="bordered"
                                placeholder="Select date"
                                className="col-span-1 md:col-span-2"
                                classNames={{
                                    base: "bg-white rounded-lg",
                                }}
                                value={data.date_from}
                                onChange={(e) =>
                                    setData("date_from", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Date To
                            </label>
                            <Input
                                autoFocus
                                color="primary"
                                type="date"
                                variant="bordered"
                                placeholder="Select date"
                                className="col-span-1 md:col-span-2"
                                classNames={{
                                    base: "bg-white rounded-lg",
                                }}
                                value={data.date_to}
                                onChange={(e) =>
                                    setData("date_to", e.target.value)
                                }
                            />
                        </div>

                        <div className="md:col-span-4 flex space-x-2">
                            <Button
                                type="submit"
                                color="primary"
                                disabled={processing}
                                // className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Apply Filters
                            </Button>
                            <Button
                                variant="light"
                                // type="button"
                                onClick={clearFilters}
                            >
                                Clear
                            </Button>
                        </div>
                    </form>
                </div>
            )}
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
                                ? "No claim history found matching your search"
                                : "No claim history found"
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
                                        {tPToDelete?.NameEmployee}
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
