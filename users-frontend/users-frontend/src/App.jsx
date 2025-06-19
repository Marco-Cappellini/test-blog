import { Routes, Route } from "react-router-dom";
import SubscriptionForm from "./components/subscriptionGrid.jsx";
import LoginForm from "./components/loginGrid.jsx";
import { Navigate } from "react-router-dom";
import UpdateUserForm from "./components/editProfile.jsx";
import { Context } from "./context.js";
import { DarkModeContext } from "./darkModeContext.js";
import { useState } from "react";
import UsersDataGrid from "./components/usersDataGrid.jsx";
import EditUserForm from "./components/edituserById.jsx";
import UserPage from "./components/userPage.jsx";
import { darkTheme } from "./theme.js";
import { ThemeProvider } from "@emotion/react";
import PostCreation from "./components/postForm.jsx";
import HomePage from "./components/homePage.jsx";
import { PostIdContext } from "./postIdContext.js";
import Reply from "./components/replyToPost.jsx";
import RepliesHistoryPage from "./components/repliesHistory.jsx";
import LikedPage from "./components/likedPage.jsx";
import { SWRConfig } from "swr";

export default function App() {
  const [context, setContext] = useState(
    {
      userName: "",
      id: "",
      email: "",
      role: ""
    }
  );

  const [darkModeContext, setdarkModeContext] = useState(darkTheme);

  const [postIdContext, stePostIdContext] = useState("")
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}>
      <ThemeProvider theme={darkModeContext}>
        <PostIdContext.Provider value={[postIdContext, stePostIdContext]}>
          <DarkModeContext.Provider value={[darkModeContext, setdarkModeContext]}>
            <Context.Provider value={[context, setContext]}>
              <Routes>
                <Route path="/" element={<SubscriptionForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/updateUser" element={<UpdateUserForm />} />
                <Route path="/usersData" element={<UsersDataGrid />} />
                <Route path="/editById/:id" element={<EditUserForm />} />
                <Route path="/userPage" element={<UserPage />} />
                <Route path="/post" element={<PostCreation />} />
                <Route path="/homePage" element={<HomePage />} />
                <Route path="/reply/:id" element={<Reply />} />
                <Route path="/repliesHistory" element={<RepliesHistoryPage />} />
                <Route path="/allLiked" element={<LikedPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Context.Provider>
          </DarkModeContext.Provider>
        </PostIdContext.Provider>
      </ThemeProvider>
    </SWRConfig>

  );
}

//!PER LA SINGLE PAGE!

// import { useState } from "react";
// import SubscriptionForm from "./components/subscriptionGrid.jsx";
// import LoginForm from "./components/loginGrid.jsx";

// export default function App() {
//   const [showLogin, setShowLogin] = useState(false);

//   const toggleForm = () => setShowLogin((prev) => !prev);

//   return (
//     <>
//       {showLogin ? (
//         <LoginForm onSwitchForm={toggleForm} />
//       ) : (
//         <SubscriptionForm onSwitchForm={toggleForm} />
//       )}
//     </>
//   );
// }