import Navbar from "../components/navigation/Navbar.jsx";
import Footer from "../components/navigation/Footer.jsx";

const MainLayout = ({ children }) => {
  return (
    <div className="container mx-auto px-4 min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="pt-14 md:pt-0">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
