import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api";
import DataTable from "react-data-table-component";

const View = () => {
  const [upload, setUpload] = useState(null);
  const { theme } = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(theme === "dark");
  const api_url = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const getUploadLog = async () => {
    try {
      const res = await api.get(`${api_url}/admin/upload/view/${id}`);
      setUpload(res.data.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getUploadLog();
    setIsDark(theme === "dark");
  }, [id, theme]);

  let errorsArray = [];
  if (upload?.errors_reason) {
    try {
      errorsArray = JSON.parse(upload.errors_reason);
    } catch (e) {
      console.error("Invalid JSON in errors_reason", e);
    }
  }

  const arrowColor = isDark ? "#ffffff" : "#111827";

  let tableData = [];
  if (errorsArray.length > 0) {
    tableData = errorsArray.map((err, idx) => {
      if (err.error) {
        return {
          id: idx + 1,
          row: "-",
          fields: "-",
          messages: err.error,
        };
      }

      if (err.errors && typeof err.errors === "object") {
        return {
          id: idx + 1,
          row: err.row || "-",
          fields: Object.keys(err.errors).join(", "),
          messages: Object.values(err.errors).join(", "),
        };
      }

      return {
        id: idx + 1,
        row: "-",
        fields: "-",
        messages: JSON.stringify(err),
      };
    });
  }


  const columns = [
    {
      name: "Excel Row",
      selector: (row) => row.row,
      sortable: true,
      width: "120px",
    },
    {
      name: "Error Field(s)",
      selector: (row) => row.fields,
      wrap: true,
    },
    {
      name: "Error Message(s)",
      selector: (row) => row.messages,
      wrap: true,
    },
  ];

  return (
    <div
      className={`p-4 min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
    >
      {upload ? (
        <div>
          <div className="flex justify-between">
            <h2 className="text-xl font-bold mb-2">File: {upload.file_name}</h2>
            <button
              type="button"
              className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              onClick={() => navigate("/administration/uploads/list")}
            >
              Back
            </button>
          </div>

          <h3 className="text-lg font-semibold mt-4">Errors</h3>
          <DataTable
            columns={columns}
            data={tableData}
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
            paginationIconPrevious={
              <span style={{ color: arrowColor, fontSize: 18, fontWeight: 700 }}>
                &lt;
              </span>
            }
            paginationIconNext={
              <span style={{ color: arrowColor, fontSize: 18, fontWeight: 700 }}>
                &gt;
              </span>
            }
            paginationIconFirstPage={
              <span style={{ color: arrowColor, fontSize: 18, fontWeight: 700 }}>
                «
              </span>
            }
            paginationIconLastPage={
              <span style={{ color: arrowColor, fontSize: 18, fontWeight: 700 }}>
                »
              </span>
            }
            customStyles={{
              table: {
                style: {
                  backgroundColor: isDark ? "#0f172a" : "#fff",
                  zIndex: 0,
                },
              },
              head: {
                style: {
                  backgroundColor: isDark ? "#1e293b" : "#f3f4f6",
                  top: "0",
                  position: "sticky",
                  zIndex: 1,
                },
              },
              headCells: {
                style: {
                  fontWeight: "bold",
                  fontSize: "14px",
                  backgroundColor: isDark ? "#1e293b" : "#f9fafb",
                  color: isDark ? "#e2e8f0" : "#111827",
                },
              },
              rows: {
                style: {
                  backgroundColor: isDark ? "#111827" : "#fff",
                  color: isDark ? "#f9fafb" : "#111827",
                },
                stripedStyle: {
                  backgroundColor: isDark ? "#1f2937" : "#f3f4f6",
                  color: isDark ? "#f9fafb" : "#111827",
                },
                highlightOnHoverStyle: {
                  backgroundColor: isDark ? "#334155" : "#e5e7eb",
                  color: isDark ? "#f9fafb" : "#111827",
                  cursor: "pointer",
                },
              },
              pagination: {
                style: {
                  backgroundColor: isDark ? "#1e293b" : "#fff",
                  color: isDark ? "#e2e8f0" : "#111827",
                  borderTop: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                },
                pageButtonsStyle: {
                  borderRadius: "6px",
                  margin: "0 4px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  backgroundColor: isDark ? "#111827" : "#f9fafb",
                  color: isDark ? "#e2e8f0" : "#111827",
                },
              },
            }}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default View;
