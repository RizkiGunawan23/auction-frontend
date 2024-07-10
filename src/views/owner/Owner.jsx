import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Menubar } from "primereact/menubar";
import { Navigate } from "react-router-dom";
import axios from "axios";

function Owner({ handleLogout }) {
  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => <Navigate to={"/owner"} />,
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: handleLogout,
    },
  ];

  const initialState = {
    _id: "",
    name: "",
    username: "",
    email: "",
    password: "", // Tambahkan field password di initialState untuk pembuatan user
  };

  const [user, setUser] = useState(initialState);
  const [users, setUsers] = useState([]);
  const [userDialog, setUserDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [dataChanged, setDataChanged] = useState(false);

  const toast = useRef(null);
  const dt = useRef(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/users", {
        withCredentials: true,
      });

      console.log(response.data);
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDataChange = () => {
    setDataChanged(!dataChanged);
  };

  useEffect(() => {
    fetchUsers();
  }, [dataChanged]);

  const openNew = () => {
    setUser(initialState);
    setSubmitted(false);
    setUserDialog(true);
    setIsEditMode(false); // Set to create mode
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const hideDeleteUsersDialog = () => {
    setDeleteUsersDialog(false);
  };

  const saveUser = async () => {
    setSubmitted(true);

    if (
      user.name.trim() &&
      user.username.trim() &&
      user.email.trim() &&
      (isEditMode || user.password.trim())
    ) {
      try {
        if (isEditMode) {
          // Update user
          await axios.put(
            `http://localhost:3000/api/v1/users/${user._id}`,
            {
              name: user.name,
              username: user.username,
              email: user.email,
            },
            { withCredentials: true }
          );

          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "User Updated",
            life: 3000,
          });
        } else {
          // Create new user
          await axios.post(
            "http://localhost:3000/api/v1/users",
            {
              name: user.name,
              username: user.username,
              email: user.email,
              password: user.password,
            },
            { withCredentials: true }
          );

          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "User Created",
            life: 3000,
          });
        }

        setUserDialog(false);
        setUser(initialState);
        handleDataChange();
      } catch (error) {
        console.error(error);

        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: error.response.data.message,
            life: 3000,
          });
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Operation Failed",
            life: 3000,
          });
        }
      }
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill in all required fields.",
        life: 3000,
      });
    }
  };

  const editUser = (user) => {
    setUser({ ...user, password: "" }); // Ensure password is empty
    setSubmitted(false);
    setUserDialog(true);
    setIsEditMode(true); // Set to edit mode
  };

  const confirmDeleteUser = (user) => {
    setUser(user);
    setDeleteUserDialog(true);
  };

  const deleteUser = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/users/${user._id}`, {
        withCredentials: true,
      });

      let _users = users.filter((val) => val._id !== user._id);

      setUsers(_users);
      setDeleteUserDialog(false);
      setUser(initialState);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User Deleted",
        life: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Delete Failed",
        life: 3000,
      });
    }
  };

  const deleteSelectedUsers = async () => {
    try {
      const deletePromises = selectedUsers.map((user) =>
        axios.delete(`http://localhost:3000/api/v1/users/${user._id}`, {
          withCredentials: true,
        })
      );

      await Promise.all(deletePromises);

      let _users = users.filter((val) => !selectedUsers.includes(val));

      setUsers(_users);
      setDeleteUsersDialog(false);
      setSelectedUsers(null);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Users Deleted",
        life: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Delete Failed",
        life: 3000,
      });
    }
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteUsersDialog(true);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _user = { ...user };

    _user[`${name}`] = val;

    setUser(_user);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="New"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedUsers || !selectedUsers.length}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="Export"
        icon="pi pi-upload"
        className="p-button-help"
        onClick={exportCSV}
      />
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editUser(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteUser(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Kelola User</h4>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </IconField>
    </div>
  );

  const userDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveUser} />
    </React.Fragment>
  );
  const deleteUserDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteUserDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteUser}
      />
    </React.Fragment>
  );
  const deleteUsersDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteUsersDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedUsers}
      />
    </React.Fragment>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <Menubar model={items} />
        <Toast ref={toast} />
        <div className="card">
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            ref={dt}
            value={users}
            selection={selectedUsers}
            onSelectionChange={(e) => setSelectedUsers(e.value)}
            dataKey="_id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Menampilkan {first} ke {last} dari {totalRecords} users"
            globalFilter={globalFilter}
            header={header}
          >
            <Column selectionMode="multiple" exportable={false}></Column>
            <Column
              field="_id"
              header="ID"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="name"
              header="Name"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="username"
              header="Username"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="email"
              header="Email"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: "8rem" }}
            ></Column>
          </DataTable>
        </div>

        <Dialog
          visible={userDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="User Details"
          modal
          className="p-fluid"
          footer={userDialogFooter}
          onHide={hideDialog}
        >
          <div className="field">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              value={user.name}
              onChange={(e) => onInputChange(e, "name")}
              required
              autoFocus
              className={classNames({ "p-invalid": submitted && !user.name })}
            />
            {submitted && !user.name && (
              <small className="p-error">Name is required.</small>
            )}
          </div>

          <div className="field">
            <label htmlFor="username">Username</label>
            <InputText
              id="username"
              value={user.username}
              onChange={(e) => onInputChange(e, "username")}
              required
              className={classNames({
                "p-invalid": submitted && !user.username,
              })}
            />
            {submitted && !user.username && (
              <small className="p-error">Username is required.</small>
            )}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              value={user.email}
              onChange={(e) => onInputChange(e, "email")}
              required
              className={classNames({
                "p-invalid": submitted && !user.email,
              })}
            />
            {submitted && !user.email && (
              <small className="p-error">Email is required.</small>
            )}
          </div>

          {!user._id && (
            <div className="field">
              <label htmlFor="password">Password</label>
              <InputText
                id="password"
                type="password"
                value={user.password}
                onChange={(e) => onInputChange(e, "password")}
                required
                className={classNames({
                  "p-invalid": submitted && !user.password,
                })}
              />
              {submitted && !user.password && (
                <small className="p-error">Password is required.</small>
              )}
            </div>
          )}
        </Dialog>

        <Dialog
          visible={deleteUserDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Confirm"
          modal
          footer={deleteUserDialogFooter}
          onHide={hideDeleteUserDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {user && (
              <span>
                Are you sure you want to delete <b>{user.name}</b>?
              </span>
            )}
          </div>
        </Dialog>

        <Dialog
          visible={deleteUsersDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Confirm"
          modal
          footer={deleteUsersDialogFooter}
          onHide={hideDeleteUsersDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {user && (
              <span>Are you sure you want to delete the selected users?</span>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default Owner;
