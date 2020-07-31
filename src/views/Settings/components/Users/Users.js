import React, {useState} from "react";
import MaterialTable from "material-table";

import {forwardRef} from "react";
import AddBox from "@material-ui/icons/AddBox";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import Error from "../../../Error/Error";
import UserInvite from "./UserInvite/UserInvite";
import {ArrowDownward, Remove, ViewColumn} from "@material-ui/icons";

const Users = (props) => {
    const [open, setOpen] = useState(false);
    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
        Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
        DetailPanel: forwardRef((props, ref) => (
            <ChevronRight {...props} ref={ref}/>
        )),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
        PreviousPage: forwardRef((props, ref) => (
            <ChevronLeft {...props} ref={ref}/>
        )),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
        SortArrow: forwardRef((props, ref) => (
            <ArrowDownward {...props} ref={ref}/>
        )),
        ThirdStateCheck: forwardRef((props, ref) => (
            <Remove {...props} ref={ref}/>
        )),
        ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>),
    };

    const columns = [
        {title: "First Name", field: "given_name"},
        {title: "Last Name", field: "family_name"},
        {title: "Email", field: "email", type: "string"},
        {title: "Phone Number", field: "phone_number", type: "string"},
    ];

    const [state, setState] = useState(props.value);

    if (props.error) {
        return <Error error={props.error} message={"Something went wrong with users."}/>
    }

    console.log('Users')

    return (

        state &&
        <div>
        <MaterialTable
            title=""
            icons={tableIcons}
            options={{
                actionsColumnIndex: -1,
                pageSizeOptions: [5]
            }}
            columns={columns}
            data={state.users}
            actions={[
                {
                    icon: tableIcons.Add,
                    tooltip: 'Invite User',
                    isFreeAction: true,
                    onClick: () => setOpen(true)
                }
            ]}
            editable={{
                onRowUpdate: (newUsers, oldUsers) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                            if (oldUsers) {
                                setState((prevState) => {
                                    const users = [...prevState.users];
                                    users[users.indexOf(oldUsers)] = newUsers;
                                    return {...prevState, users};
                                });
                            }
                        }, 600);
                    }),
                onRowDelete: (oldUsers) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                            setState((prevState) => {
                                const users = [...prevState.users];
                                users.splice(users.indexOf(oldUsers), 1);
                                return {...prevState, users};
                            });
                        }, 600);
                    }),
            }}
        />
            <UserInvite open={open} onClose={() => setOpen(false)}/>
        </div>
    );
};

export default Users;
