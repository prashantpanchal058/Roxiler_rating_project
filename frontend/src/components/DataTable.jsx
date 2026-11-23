
const DataTable = ({ columns, data }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full text-left">
                <thead className="bg-slate-100">
                    <tr>
                        {columns.map(column => (
                            <th key={column.key} className="p-4 font-semibold">
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.map((row, index) => (
                        <tr key={row.id || index} className="border-t hover:bg-slate-50">
                            {columns.map(column => (
                                <td key={column.key} className="p-4">
                                    {column.render
                                        ? column.render(row)
                                        : row[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))}

                    {data.length === 0 && (
                        <tr>
                            <td colSpan={columns.length}
                                className="p-6 text-center text-gray-500">
                                No records found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
