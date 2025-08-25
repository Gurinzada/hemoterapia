import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { clearStateUser, fetchMyProfileUser } from "../../store/slices/userSlice";
import Loading from "../Loading/Loading";
import { useNavigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading } = useAppSelector((state) => state.user);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await dispatch(fetchMyProfileUser());

      if (fetchMyProfileUser.rejected.match(result)) {
        dispatch(clearStateUser());
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    checkAuth();
  }, []);

  if (loading === "pending") {
    return <Loading />;
  }

  console.log(loading);

  return <>{children}</>;
}
