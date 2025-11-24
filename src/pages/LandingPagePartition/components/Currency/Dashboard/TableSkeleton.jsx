const TableSkeleton = ({ styles, isDark }) => {
    return (
        <div className="animate-pulse">
            {/* Header Skeleton */}
            <table className="w-full">
                <thead>
                <tr className="text-sm font-semibold">
                    <th className="w-16 py-2.5 hidden sm:table-cell">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    </th>
                    <th className="w-32 py-2.5">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    </th>
                    <th className="py-2.5 hidden lg:table-cell px-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                    </th>
                    <th className="w-32 py-2.5">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-auto" />
                    </th>
                    <th className="w-32 py-2.5">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-auto" />
                    </th>
                </tr>
                </thead>
            </table>

            {/* Body Skeleton */}
            <div className="max-h-[300px] sm:max-h-[480px] overflow-y-auto">
                <table className="w-full">
                    <tbody>
                    {[...Array(8)].map((_, index) => (
                        <tr key={index} className={`border-t ${styles.border}`}>
                            <td className="w-16 py-2.5 hidden sm:table-cell">
                                <div className="flex justify-center">
                                    <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded" />
                                </div>
                            </td>
                            <td className="w-32 py-2.5">
                                <div className="flex items-center gap-2">
                                    <div className="sm:hidden h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                                </div>
                            </td>
                            <td className="py-2.5 hidden lg:table-cell px-4">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                            </td>
                            <td className="w-32 py-2.5">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 ml-auto" />
                            </td>
                            <td className="w-32 py-2.5">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 ml-auto" />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

TableSkeleton.displayName = 'TableSkeleton';

export default TableSkeleton;