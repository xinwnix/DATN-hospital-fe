import React, { useEffect, useState } from "react";

function useUserInformation() {
  const accountString = localStorage.getItem("account");
  const account = JSON.parse(accountString);
  return {
    userInformation: account,
  };
}

export default useUserInformation;