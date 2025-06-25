// import Navbar from "../component/Navbar";
// import Footer from "../component/Footer";

// const MainLayout = ({ children }) => {
//   return (
//     <div className="flex flex-col min-h-screen w-full">
//       <Navbar />
//       <main className="flex-grow w-full">
//         {children}{" "}
//         {/* Remove Container here if full width is needed globally */}
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default MainLayout;

import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
