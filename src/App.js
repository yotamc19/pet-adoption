import 'bootstrap/dist/css/bootstrap.min.css';
import SearchAppBar from './components/Header';
import SidebarContextProvider from './contexts/SidebarContext';
import WelcomePage from './pages/WelcomePage';
import videoBg from './img/AdorablePuppies.mp4';
import ModalsContextProvider from './contexts/ModalsContext';
import { useAuthContext } from './contexts/AuthContext';
import { usePetContext } from './contexts/PetContext';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SearchPage from './pages/SearchPage';
import MyPetsPage from './pages/MyPetsPage';
import PetPage from './pages/PetPage';
import PrivateRoutes from './components/PrivateRoutes';
import AdminPrivateRoutes from './components/AdminPrivateRoutes';
import SearchContextProvider from './contexts/SearchContext';
import { useEffect } from 'react';
import ProfilePage from './pages/ProfilePage';
import axios from 'axios';
import AddPetsPage from './pages/AddPetPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import DeashboardPage from './pages/DashboardPage';
import DashboardContextProvider from './contexts/DashboardContext';
import AddPetContextProvider from './contexts/AddPetContext';
// require('dotenv').config();

function App() {
  const { toggleLoginState, changeLoggedUser, changeProfileDetails } = useAuthContext();
  const { setSavedPets } = usePetContext();

  useEffect(() => {
    const cookies = document.cookie.split(' ');
    if (cookies.length > 1) {
      let email = '';
      cookies.map(cookie => {
        if (cookie.includes('email')) {
          email = cookie.substring(6).replace('%40', '@');
        }
      })
      toggleLoginState(true);

      const getCurrentUser = async (email) => {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/email/${email}`, { withCredentials: true });
        changeProfileDetails({
          email: res.data[0].email,
          phoneNumber: res.data[0].phoneNumber,
          firstName: res.data[0].firstName,
          lastName: res.data[0].lastName,
        });
        changeLoggedUser({
          _id: res.data[0]._id,
          email: res.data[0].email,
          phoneNumber: res.data[0].phoneNumber,
          firstName: res.data[0].firstName,
          lastName: res.data[0].lastName,
          isAdmin: res.data[0].isAdmin,
        });
        setSavedPets(res.data[0].savedPets);
      }

      getCurrentUser(email)
        .catch((err) => { console.log(err) });
    }
  }, [])

  return (
    <div id='app'>
      <video src={videoBg} autoPlay muted loop id='bgVideo' />
      <AddPetContextProvider>
        <DashboardContextProvider>
          <SearchContextProvider>
            <ModalsContextProvider>
              <SidebarContextProvider>
                <BrowserRouter>
                  <SearchAppBar />
                  <Routes>
                    <Route path='/' element={
                      <WelcomePage />
                    } />
                    <Route path='/search' element={
                      <SearchPage />
                    } />
                    <Route path='/pet/:id' element={
                      <PetPage />
                    } />
                    <Route element={<PrivateRoutes />}>
                      <Route path='/profile' element={
                        <ProfilePage />
                      } />
                      <Route path='/change-password' element={
                        <ChangePasswordPage />
                      } />
                      <Route path='/myPets' element={
                        <MyPetsPage />
                      } />
                      <Route element={<AdminPrivateRoutes />}>
                        <Route path='/dashboard' element={
                          <DeashboardPage />
                        } />
                        <Route path='/add-pet' element={
                          <AddPetsPage />
                        } />
                      </Route>
                    </Route>
                  </Routes>
                </BrowserRouter>
              </SidebarContextProvider>
            </ModalsContextProvider>
          </SearchContextProvider>
        </DashboardContextProvider>
      </AddPetContextProvider>
    </div>
  );
}

export default App;
