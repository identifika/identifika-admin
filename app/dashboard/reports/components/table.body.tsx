

async function fetchReport(
    page: number,
    limit: number,
    search: string
) {
    const res = await fetch(
        `http://localhost:3000/api/report?page=${page}&limit=${limit}&search=${search}`,
    )
    if (!res.ok) {
        return {
            data: [],
            meta: {
                total_pages: 1,
                total: 0,
                page: 1,
            },
        }
    }
    const data = await res.json()
    return data
}

type ReportTableBodyProps = {
    page: number
    limit: number
    search: string
}


export default async function ReportTableBody(props: ReportTableBodyProps) {

    const data = await fetchReport(props.page, props.limit, props.search)

    return (
        <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">

            {
                data.data.map((report: any) => (
                    <tr key={report.id}>
                        <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                            <div>
                                <h2 className="font-medium text-gray-800 dark:text-white ">
                                    {report.endpoint}
                                </h2>
                            </div>
                        </td>
                        <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                            <div>
                                <h2 className="font-medium text-gray-800 dark:text-white ">
                                    {report.method}
                                </h2>
                            </div>
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                            <div>
                                <h2 className="font-medium text-gray-800 dark:text-white ">
                                    {report.elapsed_time}
                                </h2>
                            </div>
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                            <div>
                                <h2 className="font-medium text-gray-800 dark:text-white ">
                                    {/* make timestamp more readable */}
                                    {new Date(report.timestamp).toLocaleString()}
                                </h2>
                            </div>
                        </td>
                    </tr>
                ))
            }

        </tbody>
    )
}