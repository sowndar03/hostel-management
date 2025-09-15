import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import api from '../../../api';
import { ThemeContext } from '../../../context/ThemeContext';
import { IoEye } from 'react-icons/io5';
import { displayDateformat, getUploadStatus } from '../../../utils/helper';
import { useNavigate } from 'react-router-dom';

const List = () => {
  const [list, setList] = useState([]);
  const { theme } = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(theme === "dark");
  const api_url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const getUploadLog = async () => {
    try {
      const res = await api.get(`${api_url}/admin/upload/list`);
      setList(res.data.data);
    } catch (err) {
      console.log(err.message);
    }
  }
  const handleView = (id) => {
    navigate(`/administration/uploads/view/${id}`);
  };

  const columns = [
    {
      name: "SNO", selector: (row, index) => (index + 1)
    },
    {
      name: "File name",
      selector: (row) => row.file_name || "-",
      sortable: true,
    },
    {
      name: "Created By",
      selector: (row) => row.created_by?.name || "-",
      sortable: true,
    },
    {
      name: "Created at",
      selector: (row) => displayDateformat(row.createdAt) || "-",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => getUploadStatus(row.status),
      wrap: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <IoEye
            onClick={() => handleView(row._id)}
            size={20}
            className="text-green-600  hover:text-green-800 cursor-pointer"
          />
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  const arrowColor = isDark ? "#ffffff" : "#111827";


  useEffect(() => {
    getUploadLog();
    setIsDark(theme === "dark");
  }, [theme]);
  return (
    <div className='min-h-screen bg-white dark:bg-[#101828] p-6'>
      <div className="border-b pb-3 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-700 dark:text-white">Upload Log</h2>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={list}
        striped
        highlightOnHover
        pagination
        fixedHeader
        fixedHeaderScrollHeight="500px"
        noDataComponent={
          <div
            className={`p-4 text-center ${isDark ? "bg-gray-900 text-gray-300" : "bg-white text-gray-700"
              }`}
            style={{ width: "100%" }}
          >
            No records to display
          </div>
        }
        paginationIconPrevious={<span style={{ color: arrowColor, fontSize: 18, fontWeight: 700 }}>&lt;</span>}
        paginationIconNext={<span style={{ color: arrowColor, fontSize: 18, fontWeight: 700 }}>&gt;</span>}
        paginationIconFirstPage={<span style={{ color: arrowColor, fontSize: 18, fontWeight: 700 }}>«</span>}
        paginationIconLastPage={<span style={{ color: arrowColor, fontSize: 18, fontWeight: 700 }}>»</span>}
        customStyles={{
          table: { style: { backgroundColor: isDark ? "#0f172a" : "#fff", zIndex: 0 } },
          head: {
            style: {
              backgroundColor: isDark ? "#1e293b" : "#f3f4f6",
              top: "0",
              position: "sticky",
              zIndex: 1
            }
          },
          headCells: {
            style: {
              fontWeight: "bold",
              fontSize: "14px",
              backgroundColor: isDark ? "#1e293b" : "#f9fafb",
              color: isDark ? "#e2e8f0" : "#111827"
            }
          },
          rows: {
            style: { backgroundColor: isDark ? "#111827" : "#fff", color: isDark ? "#f9fafb" : "#111827" },
            stripedStyle: { backgroundColor: isDark ? "#1f2937" : "#f3f4f6", color: isDark ? "#f9fafb" : "#111827" },
            highlightOnHoverStyle: { backgroundColor: isDark ? "#334155" : "#e5e7eb", color: isDark ? "#f9fafb" : "#111827", cursor: "pointer" },
          },
          pagination: {
            style: { backgroundColor: isDark ? "#1e293b" : "#fff", color: isDark ? "#e2e8f0" : "#111827", borderTop: `1px solid ${isDark ? "#374151" : "#d1d5db"}` },
            pageButtonsStyle: { borderRadius: "6px", margin: "0 4px", padding: "6px 12px", cursor: "pointer", transition: "all 0.2s", backgroundColor: isDark ? "#111827" : "#f9fafb", color: isDark ? "#e2e8f0" : "#111827" },
          },
        }}
      />
    </div>
  )
}

export default List
