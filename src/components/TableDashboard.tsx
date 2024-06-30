import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Comment {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
}

const TableDashboard: React.FC = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Comment, direction: 'ascending' | 'descending' } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/comments')
            .then(response => {
                setComments(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the comments!', error);
            });
    }, []);

    const sortedComments = React.useMemo(() => {
        let sortableComments = [...comments];

        if (sortConfig !== null) {
            sortableComments.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortableComments.filter(comment =>
            comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.body.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [comments, sortConfig, searchTerm]);

    const requestSort = (key: keyof Comment) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Calculate the index of the first and last items on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentComments = sortedComments.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="flex items-center justify-between p-4 bg-white shadow">
                <div>
                    <img src='/logo.svg' alt='logo' className="h-10" />
                </div>
                <div className="flex items-center space-x-4">
                    <img className="w-10 h-10 rounded-full" src="/avatar.svg" alt="Rounded avatar" />
                    <div className="text-gray-700">John Doe</div>
                </div>
            </nav>
            <main className="p-4">
                <div className="flex items-center space-x-4 p-4 bg-white shadow rounded">
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        onClick={() => requestSort('postId')}
                    >
                        Sort Post ID
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        onClick={() => requestSort('name')}
                    >
                        Sort Name
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        onClick={() => requestSort('email')}
                    >
                        Sort Email
                    </button>
                    <div className="flex-grow">
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Search name, email, comment"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <table className="min-w-full bg-white border rounded shadow">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Post ID</th>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Comment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentComments.map(comment => (
                                <tr key={comment.id}>
                                    <td className="py-2 px-4 border-b">{comment.postId}</td>
                                    <td className="py-2 px-4 border-b">{comment.name}</td>
                                    <td className="py-2 px-4 border-b">{comment.email}</td>
                                    <td className="py-2 px-4 border-b">{comment.body}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-4">
                        <div>
                            <label htmlFor="itemsPerPage" className="mr-2">Show:</label>
                            <select
                                id="itemsPerPage"
                                className="px-2 py-1 border rounded"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                <option value={10}>10</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                        <div>
                            {Array.from({ length: Math.ceil(sortedComments.length / itemsPerPage) }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => paginate(index + 1)}
                                    className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TableDashboard;
