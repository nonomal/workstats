import Head from 'next/head';
import React from 'react';

const userList = () => {
  return (
    <Head>
      <title>User List - WorkStats</title>
      <meta
        name='description'
        content='WorkStats User Listing Page. You will see a list of other users you have connected to. Clicking on a user will take you to that users dashboard.'
      />
    </Head>
  );
};

export default userList;

userList.requiresAuth = true;
