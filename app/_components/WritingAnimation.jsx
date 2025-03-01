import React, { useEffect } from "react";
import anime from "animejs";

const WritingAnimation = () => {
  useEffect(() => {
    const svgPaths = document.querySelectorAll(".path");
    anime({
      targets: svgPaths,
      loop: true,
      direction: "alternate",
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: "easeInOutSine",
      duration: 700,
      delay: (el, i) => i * 500,
    });
  }, []);

  return (
    <h3>
      <svg
        version="1.1"
        className="subtitle"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 229.2 69.6"
        style={{ enableBackground: "new 0 0 229.2 69.6" }}
        xmlSpace="preserve"
      >
        <defs>
          {/* The clipPath ID has been renamed to reflect “Inquire Notes” */}
          <clipPath id="inquireNotesClip">
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize="24"
              fill="black"
            >
              Inquire Notes
            </text>
          </clipPath>
        </defs>
        <path
          className="path"
          clipPath="url(#inquireNotesClip)"
          d="M18.5,33.91S0,36.67,6.67,24.17c8-8.34,22.15-15.46,31.31-13.62,8.34,1-.95,9.34-8.81,24.5C23.34,46.29,15.08,55.23,18.5,57c1.67.86,12-8.3,21.33-20C49.55,24.8,58.23,9.57,61.17,9.5,67.83,9.33,49.88,35.43,40.83,52c-4.14,7.59-10.66,14.17-6.66,15.5C38,68.77,49.17,64,83,15.67c1.59-2.27,7-10.49,8.6-13"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="15"
        />
        <path
          className="path"
          clipPath="url(#inquireNotesClip)"
          d="M85.4,41.5s18.1-5.6,13.35-15.75c-2.89-6.18-9,.9-15.5,8.2,0,0-25.5,39.2,14.25,16,0,0,24.37-22.26,28.5-21.05,1.62,1.09-4.14,11-8,19-2.71,5.63-3,10.83-5.55,9.39-24,.28,15.13-45.9,9.21-48.09S94.4,63,94.4,63"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="9"
        />
        <path
          className="path"
          clipPath="url(#inquireNotesClip)"
          d="M150.24,20.5S138,26.75,136,31.75s-4.07,5,.43,13.1a9.25,9.25,0,0,1-.18,7.15c-1.75,3.5-2,9.75-7.75,5.75S134.24,42,150.24,37.5c0,0,4.41-4.3,8.51-8.6s-17.5,26-15.88,31.9L173.5,35.19,186.15,9.13s-28,50.42-25.1,51S178.75,38,195.5,41c0,0,20.9-14.33,5-15.75,0,0-26.5,15.25-17,31.25,0,0,8.5,3,18-4.5s22.5-21.2,24.75-4.1"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="10"
        />
        <path
          className="path"
          clipPath="url(#inquireNotesClip)"
          d="M171,9.13s-11.33,10.38-8,11.92,43-2.8,43-2.8"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="13"
        />
      </svg>
    </h3>
  );
};

export default WritingAnimation;