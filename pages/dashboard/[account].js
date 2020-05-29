import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { replace } from "connected-next-router";

// Ethereum
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

// Actions
import { fetchAllContractData } from "../../redux/actions/contractActions";

// Layout
import Layout from "../../layouts";

// Sections
import ContractGrid from "pages-sections/Dashboard-Sections/contracts/ContractGrid";
import CreateContract from "pages-sections/Dashboard-Sections/CreateContract";

const ProfilePage = ({ contracts, userAddress, error, ...rest }) => {
  const dispatch = useDispatch();

  const profileRef = useRef();
  const accountReducer = useSelector((state) => state.accountReducer);
  const { activeTab } = useSelector((state) => state.dashboardReducer);
  const { pathname } = useSelector((state) => state.router.location);
  const { contractReducer } = useSelector((state) => state);
  let address =
    pathname === "/" ? userAddress : pathname.replace("/dashboard/", "");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  // Need to revisit if accountReducer.contracts is ever needed
  const contractListToWatch = isUserLoggedIn
    ? accountReducer.contracts
    : contracts;

  useEffect(() => {
    if (!accountReducer || !accountReducer.account) {
      return;
    }
    if (accountReducer.account === address && !isUserLoggedIn) {
      setIsUserLoggedIn(true);
    }

    if (accountReducer.account !== address && isUserLoggedIn) {
      setIsUserLoggedIn(false);
    }
  }, [accountReducer.account, address]);

  useEffect(() => {
    if (profileRef.current) {
      profileRef.current.innerHTML = svg;
    }
  }, [profileRef.current]);

  useEffect(() => {
    if (error) {
      console.log("redirecting via dispatch replace due to error: ", error);
      dispatch(replace("/"));
    }
  }, [error]);

  useEffect(() => {
    console.log("web3.version", web3.version);
    const userContractCountInRedux = Object.keys(contractReducer).length;
    if (contracts.length > 0) {
      // If the new fetch request returns contracts, but redux store is empty, then fetch all contracts

      if (userContractCountInRedux === 0) {
        dispatch(fetchAllContractData(contracts));
      } else if (contracts.length !== userContractCountInRedux) {
        // Find any contracts missing in redux store and add those individually
      }
    }

    // NEED TO HANDLE NEWLY CREATED CONTRACTS
  }, []);

  return (
    <Layout layout="dashboard">
      {/* Need to memoize contract grid to prevent unnecessary fetchAllContractData fetches */}
      <ContractGrid contracts={contractListToWatch} userAddress={userAddress} />
    </Layout>
  );
};

ProfilePage.getInitialProps = async function (props) {
  if (props.store) {
    console.log("PROPS.STORE", props.store);
  }
  const userAddress = props.query.account;
  try {
    const contracts = await factory.methods
      .getdeployedContracts()
      .call({}, { from: userAddress });
    return { userAddress, contracts };
  } catch (error) {
    console.log("ProfilePage.getInitialProps error", error.message);
    console.log("props.query.account", props.query.account);
    if (typeof window === "undefined" && props.res) {
      props.res.writeHead(302, { Location: "/dashboard" });
      props.res.end();
    } else {
      return { error: error.message };
    }
  }
};

export default ProfilePage;
