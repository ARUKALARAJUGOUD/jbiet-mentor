// import { useEffect, useState } from "react";
import "../../css/loader/academicLoader.css";

// export default function AcademicLoader({ visible }) {
//   const [show, setShow] = useState(visible);

//   useEffect(() => {
//     if (!visible) {
//       const timer = setTimeout(() => setShow(false), 600);
//       return () => clearTimeout(timer);
//     } else {
//       setShow(true);
//     }
//   }, [visible]);

//   if (!show) return null;

//   return (
//     <div className={`academic-loader ${visible ? "fade-in" : "fade-out"}`}>
//       <div className="academic-content">

//         <div className="seal-spinner"></div>

//         <h1 className="academic-title">
//           JB Institute of Engineering & Technology
//         </h1>

//         <p className="academic-subtitle">
//           Student Academic Portal
//         </p>

//         <div className="progress-bar">
//           <div className="progress-fill"></div>
//         </div>

//         <p className="loading-text">Preparing your dashboard...</p>

//       </div>
//     </div>
//   );
// }
// import "../../css/Auth/academicLoader.css";

// export default function AcademicLoader() {
//   return (
//     <div className="academic-loader">
//       <div className="academic-content">

//         <div className="seal-spinner"></div>

//         <h1 className="academic-title">
//           JB Institute of Engineering & Technology
//         </h1>

//         <p className="academic-subtitle">
//           Student Academic Portal
//         </p>

//         <div className="progress-bar">
//           <div className="progress-fill"></div>
//         </div>

//         <p className="loading-text">
//           Preparing your dashboard...
//         </p>

//       </div>
//     </div>
//   );
// }

// export default function AcademicLoader() {
//   return (
//     <div className="academic-loader">
//       <div className="academic-content">

//         {/* Rotating Seal */}
//         <div className="seal-wrapper">
//           <div className="seal-ring">
//             <img
//               src={JbietLogo}
//               alt="College Logo"
//               className="seal-logo"
//             />
//           </div>
//         </div>

//         <h1 className="academic-title">
//           JB Institute of Engineering & Technology
//         </h1>

//         <p className="academic-subtitle">
//           Student Academic Portal
//         </p>

//         <div className="progress-bar">
//           <div className="progress-fill"></div>
//         </div>

//         <p className="loading-text">
//           Securing Academic Records...
//         </p>

//       </div>
//     </div>
//   );
// }

// import "../../css/Auth/premiumLoader.css";
import JbietLogo from "../../images/jbiet.png";

export default function PremiumLoader() {
  return (
    <div className="premium-loader">
      <div className="overlay"></div>

      <div className="premium-content">
        {/* Floating Particles */}
        <div className="particles"></div>

        {/* Gold Rotating Seal */}
        {/* <div className="seal-ring">
          <img src={JbietLogo} alt="College Logo" className="seal-logo" />
        </div> */}

        {/* Seal Container */}
        <div className="seal-container">
          {/* Rotating Ring */}
          <div className="rotating-ring"></div>

          {/* Fixed Logo */}
          <img src={JbietLogo} alt="College Logo" className="fixed-logo" />
        </div>

        <h1 className="premium-title">
          JB Institute of Engineering & Technology
        </h1>

        <p className="premium-subtitle">Autonomous • NAAC Accredited</p>

        <div className="divider"></div>

        <p className="motto">“Empowering Knowledge, Engineering Excellence”</p>

        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>

        <p className="loading-text">
          Initializing Secure Academic Environment...
        </p>
      </div>
    </div>
  );
}
