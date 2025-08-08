import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTechs,
  createTech,
  updateTech,
  deleteTech,
  toggleTechStatus,
  resetCreateSuccess,
  resetUpdateSuccess,
} from "../redux/slice/tech.slice";

import Layout from "../component/Layout";
import { MdClose, MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import "../style/z_style.css";

const ITEMS_PER_PAGE = 5;

const Technology = () => {
  const dispatch = useDispatch();
  const { techs, loading, error, createSuccess, updateSuccess } = useSelector(
    state => state.tech
  );

  const [showCreate, setShowCreate] = useState(false);
  const [newTech, setNewTech] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTechs());
  }, [dispatch, createSuccess, updateSuccess]);

  useEffect(() => {
    if (createSuccess) dispatch(resetCreateSuccess());
    if (updateSuccess) dispatch(resetUpdateSuccess());
  }, [createSuccess, updateSuccess, dispatch]);

  const handleCreate = () => {
    if (newTech.trim()) {
      const formData = new FormData();
      formData.append("name", newTech.trim());
      dispatch(createTech(formData));
      setNewTech("");
      setShowCreate(false);
    }
  };

  const handleEditSave = () => {
    if (editName.trim()) {
      const formData = new FormData();
      formData.append("name", editName.trim());
      dispatch(updateTech({ id: editId, formData }));
      setEditId(null);
      setEditName("");
    }
  };

  const handleStatusToggle = id => dispatch(toggleTechStatus(id));

  const confirmDelete = () => {
    dispatch(deleteTech(deleteId));
    setDeleteId(null);
  };

  const cancelDelete = () => setDeleteId(null);

const paginatedTechs = Array.isArray(techs)
  ? [...techs].reverse()
  : [...(techs.result || [])].reverse();

  const totalPages = Math.ceil(paginatedTechs.length / ITEMS_PER_PAGE);
  const visibleTechs = paginatedTechs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Layout>
      <div className="Z_container">
        <div className="Z_page_header">
          <h1 className="Z_page_title">Manage Technologies</h1>
          <p className="Z_page_subtitle">
            Create, edit, and manage technologies for your quiz platform.
          </p>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        <div className="Z_table_container">
          <table className="Z_table">
            <thead className="Z_table_header">
              <tr>
                <th>Technology Name</th>
                <th>Status</th>
                <th style={{ width: 120, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody className="Z_table_body">
              {visibleTechs.map(tech => (
                <tr key={tech._id}>
                  <td>
                    {editId === tech._id ? (
                      <input
                        className="Z_search_input"
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onBlur={handleEditSave}
                        onKeyDown={e =>
                          e.key === "Enter" ? handleEditSave() : null
                        }
                        autoFocus
                        style={{ width: "90%" }}
                      />
                    ) : (
                      tech.name
                    )}
                  </td>
                  <td>
                    <div className="Z_status_switch_container">
                      <label className="Z_status_switch">
                        <input
                          type="checkbox"
                          checked={tech.active}
                          onChange={() => handleStatusToggle(tech._id)}
                          className="Z_status_switch_input"
                        />
                        <span className="Z_status_switch_slider"></span>
                      </label>
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <div
                      className="Z_action_buttons"
                      style={{ justifyContent: "center" }}
                    >
                      <button
                        className="Z_btn Z_btn_warning"
                        onClick={() => {
                          setEditId(tech._id);
                          setEditName(tech.name);
                        }}
                        title="Edit"
                        style={{ minWidth: 36 }}
                      >
                        <MdOutlineEdit size={18} />
                      </button>
                      <button
                        className="Z_btn Z_btn_danger"
                        onClick={() => setDeleteId(tech._id)}
                        title="Delete"
                        style={{ minWidth: 36 }}
                      >
                        <MdDeleteOutline size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {showCreate && (
                <tr>
                  <td colSpan={3}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <input
                        className="Z_search_input"
                        type="text"
                        placeholder="Enter technology name"
                        value={newTech}
                        onChange={e => setNewTech(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleCreate()}
                        autoFocus
                        style={{ flex: 1 }}
                      />
                      <button className="Z_add_new_btn" onClick={handleCreate}>
                        Create
                      </button>
                      <button
                        className="Z_btn Z_btn_secondary"
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                          padding: "9px 14px",
                        }}
                        onClick={() => {
                          setShowCreate(false);
                          setNewTech("");
                        }}
                        title="Close"
                      >
                        <MdClose />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {!showCreate && (
            <div style={{ margin: "8px" }}>
              <button
                className="Z_add_new_btn"
                onClick={() => setShowCreate(true)}
              >
                + Create
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="Z_pagination">
            <button
              className="Z_pagination_btn"
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 1}
            >
              <FaAngleDoubleLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`Z_pagination_btn ${
                  currentPage === page ? "Z_pagination_btn_active" : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="Z_pagination_btn"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === totalPages}
            >
              <FaAngleDoubleRight />
            </button>
          </div>
        )}

        {/* Delete confirmation */}
        {deleteId && (
          <div className="Z_modal_overlay">
            <div className="Z_modal_box">
              <div className="Z_modal_title">Delete Technology</div>
              <div className="Z_modal_body">
                Are you sure you want to delete{" "}
                <b>
                  {techs.find(t => t._id === deleteId)?.name}
                </b>
                ?
              </div>
              <div className="Z_modal_actions">
                <button
                  className="Z_btn Z_btn_secondary"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
                <button
                  className="Z_btn Z_btn_danger"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Technology;
