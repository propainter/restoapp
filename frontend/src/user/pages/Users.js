import React, { useEffect, useState, useContext } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import {GET_USERS_URL} from '../../Constants';
import { AuthContext } from '../../shared/context/auth-context';

const Users = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          GET_USERS_URL,'GET',null,{
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token
          }
        );

        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest, auth.token]);

  const userDeleteHandler = deletedUserId => {
    setLoadedUsers(
      prevUsers => prevUsers.filter(user => user.id !== deletedUserId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} onDelete={userDeleteHandler} />}
    </React.Fragment>
  );
};

export default Users;
