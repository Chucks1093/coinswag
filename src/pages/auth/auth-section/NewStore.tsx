import { useNavigate } from "react-router-dom";
import "./auth.scss";
import FormInput from "../../../components/auth/form-input/FormInput";
import { Fragment, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import useCurrentUser from "../../../hooks/useCurrentUser";
import showToast from "../../../utils/showToast";
import Loader from "../../../components/loader/circle-loader/Loader";
import handleGoogleAuth from "../../../firebase/firebase.google";
import { FirebaseError } from "firebase/app";

import usePost from "../../../hooks/usePost";
import { ConnectAccount } from "@coinbase/onchainkit/wallet";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { merchStoreFactoryAbi, merchStoreFactoryAddress } from "@/src/lib/abi";
import { useCreateStore } from "@/src/hooks/useShopOnchain";

export interface LoginResponse {
  success: boolean;
  data: {
    _id: string;
    username: string;
    email: string;
    type: string;
    password: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    accessToken: string;
  };
  message: string;
}

function NewStore() {
  const { createStore, data, error, isConfirmed, isConfirming } =
    useCreateStore();
  const { isDisconnected } = useAccount();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useCurrentUser();
  const [searchParam, setSearchParam] = useSearchParams();
  const [newStore, seteNewStore] = useState({
    name: searchParam.get("name") ?? "",
  });
  const { postData } = usePost();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    seteNewStore((userData) => ({
      ...userData,
      [name]: value,
    }));
    if (name === "email") {
      setSearchParam({ ...searchParam, [name]: value });
    }
  };

  const handelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isDisconnected) {
        showToast.error("Please connect your wallet");
        setLoading(false);
        return;
      }
      await createStore(
        newStore.name,
        "MERCHANT",
        `${newStore.name}.coinSwag.shop`
      );

      if (error) {
        showToast.error(error.message);
        setLoading(false);
        return;
      }

      if (data && isConfirmed) {
        console.log("data", data);
        const reqBody = JSON.stringify({
          name: newStore.name,
          tokenId: data.logs[0].topics[3],
          url: `${newStore.name}.coinswag.shop`,
        });

        const result = await postData("/store", reqBody);
        console.log(result);
        showToast.success("Store created Successfully");
        navigate("/dashboard");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        showToast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth__modal">
      <div className="logo__container">coinswag</div>
      <h3 className="text-center text-gray-700 text-sm">
        Create you First shop.
      </h3>
      <form onSubmit={handelSubmit}>
        <FormInput
          name="name"
          type="text"
          label="Store Name"
          id="email"
          handleChange={handleChange}
          value={newStore.name}
          required
        />
        <FormInput
          name="url"
          type="text"
          label="Shop Url"
          id="url"
          handleChange={handleChange}
          value={newStore.name}
          required
          disabled
          text=".coinswag.shop"
        />
        <div className="social">
          <ConnectAccount />
        </div>
        <button className="submit__btn">
          {" "}
          {loading ? <Loader /> : "Create Shop"}
        </button>
      </form>
    </div>
  );
}
export default NewStore;
