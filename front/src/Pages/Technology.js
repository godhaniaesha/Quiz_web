import React, { useState } from "react";
import Layout from "../component/Layout";
import { MdClose, MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import "../style/z_style.css";

const Technology = () => {
  const [technologies, setTechnologies] = useState([
    { id: 1, name: "JavaScript", status: "Active" },
    { id: 2, name: "React", status: "Active" },
    { id: 3, name: "Python", status: "Inactive" },
  ]);
  const [showCreate, setShowCreate] = useState(false);
  const [newTech, setNewTech] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Add new technology
  const handleCreate = () => {
    if (
      newTech.trim() &&
      !technologies.some(
        (t) => t.name.toLowerCase() === newTech.trim().toLowerCase()
      )
    ) {
      setTechnologies([
        ...technologies,
        { id: Date.now(), name: newTech.trim(), status: "Active" },
      ]);
      setNewTech("");
      setShowCreate(false);
    }
  };

  // Edit technology
  const handleEdit = (id, name) => {
    setEditId(id);
    setEditName(name);
  };
  const handleEditSave = () => {
    if (
      editName.trim() &&
      !technologies.some(
        (t) =>
          t.name.toLowerCase() === editName.trim().toLowerCase() &&
          t.id !== editId
      )
    ) {
      setTechnologies(
        technologies.map((t) =>
          t.id === editId ? { ...t, name: editName.trim() } : t
        )
      );
      setEditId(null);
      setEditName("");
    }
  };

  // Status toggle
  const handleStatusToggle = (id) => {
    setTechnologies((prev) =>
      prev.map((tech) =>
        tech.id === id
          ? { ...tech, status: tech.status === "Active" ? "Inactive" : "Active" }
          : tech
      )
    );
  };
  const getStatusSwitch = (status, id) => {
    const isActive = status === "Active";
    return (
      <div className="Z_status_switch_container">
        <label className="Z_status_switch">
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => handleStatusToggle(id)}
            className="Z_status_switch_input"
          />
          <span className="Z_status_switch_slider"></span>
        </label>
      </div>
    );
  };

  // Delete technology
  const handleDelete = (id) => {
    setDeleteId(id);
  };
  const confirmDelete = () => {
    setTechnologies(technologies.filter((t) => t.id !== deleteId));
    setDeleteId(null);
  };
  const cancelDelete = () => setDeleteId(null);

  return (
    <Layout>
      <div className="Z_container">
        <div className="Z_page_header">
          <h1 className="Z_page_title">Manage Technologies</h1>
          <p className="Z_page_subtitle">Create, edit, and manage technologies for your quiz platform.</p>
        </div>
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
              {technologies.map((tech) => (
                <tr key={tech.id}>
                  <td>
                    {editId === tech.id ? (
                      <input
                        className="Z_search_input"
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={handleEditSave}
                        onKeyDown={(e) =>
                          e.key === "Enter" ? handleEditSave() : null
                        }
                        autoFocus
                        style={{ width: "90%" }}
                      />
                    ) : (
                      tech.name
                    )}
                  </td>
                  <td>{getStatusSwitch(tech.status, tech.id)}</td>
                  <td style={{ textAlign: "center" }}>
                    <div className="Z_action_buttons" style={{ justifyContent: "center" }}>
                      <button
                        className="Z_btn Z_btn_warning"
                        onClick={() => handleEdit(tech.id, tech.name)}
                        style={{ minWidth: 36 }}
                        title="Edit"
                      >
                        <span role="img" aria-label="edit"><MdOutlineEdit size={18} /></span>
                      </button>
                      <button
                        className="Z_btn Z_btn_danger"
                        onClick={() => handleDelete(tech.id)}
                        style={{ minWidth: 36 }}
                        title="Delete"
                      >
                        <span role="img" aria-label="delete"><MdDeleteOutline size={18} /></span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {showCreate && (
                <tr>
                  <td colSpan={3}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        className="Z_search_input"
                        type="text"
                        placeholder="Enter technology name"
                        value={newTech}
                        onChange={(e) => setNewTech(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        autoFocus
                        style={{ flex: 1 }}
                      />
                      <button className="Z_add_new_btn" onClick={handleCreate}>
                        Create
                      </button>
                      <button
                        className="Z_btn Z_btn_secondary"
                        style={{ fontWeight: "bold", fontSize: "1.1rem", padding: "9px 14px" }}
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
          {/* Create Button below the table */}
          {!showCreate && (
            <div style={{ marginTop: 8, marginBottom: 8, marginLeft: 8 }}>
              <button className="Z_add_new_btn" onClick={() => setShowCreate(true)}>
                + Create
              </button>
            </div>
          )}
        </div>

        {/* Custom Delete Confirmation */}
        {deleteId !== null && (
          <div className="Z_modal_overlay">
            <div className="Z_modal_box">
              <div className="Z_modal_title">Delete Technology</div>
              <div className="Z_modal_body">
                Are you sure you want to delete <b>
                  {technologies.find((t) => t.id === deleteId)?.name}
                </b>?
              </div>
              <div className="Z_modal_actions">
                <button className="Z_btn Z_btn_secondary" onClick={cancelDelete}>
                  Cancel
                </button>
                <button className="Z_btn Z_btn_danger" onClick={confirmDelete}>
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