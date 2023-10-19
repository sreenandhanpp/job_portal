import { useNavigate } from "react-router-dom";
import Register from "../../pages/Register/Register";
import { getItem } from "../../../localStorage/getItem";
import Home from "../../pages/Home/Home";

export const AuthAdmin = ({ children }) => {
      const navigate = useNavigate();
      const data = getItem('user');
      if(data){
        if(data.admin){
          return children
        }
      }else{
        navigate('/')
      }
      return (
        <Home />
      )
  }