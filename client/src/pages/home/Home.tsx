import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import Footer from '../../components/footer/Footer'
import './Home.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Banner from '../../components/banner/Banner'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import AdminDashboard from '../../components/adminDashboard/AdminDshboard'
import TeachersDashboard from '../../components/teachersDashboard/TeachersDashboard'
// import About from '../../components/about/About'



function Home() {
  const userType: string = useSelector((state: RootState) => state.user.userType) || 'student';
  return (
    <div className='home'>
      <div className="top">
          <Navbar/>
      </div>
      <div className="middle">
        <div className="middle-left">
        <Sidebar/>
        </div>
        <div className="middle-right">
        {userType === 'student' && <Banner />}
           {userType === 'teacher' && <TeachersDashboard />}
        {/* <Banner/>
      <About/> */}
      {userType === 'admin' && <AdminDashboard/>}
        </div>
      </div>
      {/* <div className="footer-home">
  <Footer />
</div>  */}
    </div>
  )
}
 
export default Home
