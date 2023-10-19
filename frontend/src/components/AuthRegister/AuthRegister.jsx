import { useNavigate } from "react-router-dom";
import Register from "../../pages/Register/Register";
import { getItem } from "../../../localStorage/getItem";
import Home from "../../pages/Home/Home";

export const AuthRegister = ({ children }) => {
      const navigate = useNavigate();
      const data = getItem('user');
      if(!data.fullname ){
        return children
      }else if(!data.emailVerified){
        navigate('/verify-email')
      }
      return (
          <Home />
      )
  }