import React from "react";
import { Routes, Route } from "react-router-dom";
import MyPage from './pages/myPage/MyPage';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import AccountRecovery from "./pages/AccountRecovery";
import ProfileEdit from "./pages/ProfileEdit";
import Review from "./pages/Review";
import Header from "./pages/layout/Header";
import MakeCheckList from "./pages/makeCheckList/MakeCheckList";
import Information from "./pages/information/Information";
import ShareCheckList from "./pages/shareCheckList/ShareCheckList";
import Record from "./pages/record/Record";
import Main from "./pages/main/Main";



export default function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path= "/mypage" element={ <MyPage />}/>
        <Route path="/checkList" element= {<MakeCheckList/>}/>
        <Route path="/information" element= {<Information/>}/>
        <Route path="/record" element={<Record />} />
        <Route path="/shareCheckList" element={<ShareCheckList />}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/account-recovery" element={<AccountRecovery />} />
        <Route path="profile-edit" element={<ProfileEdit />} />
        <Route path="/review" element={<Review />} />
        <Route path="/record" element={<Record />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}








