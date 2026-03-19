import React from "react";

interface CustomInfoWindowProps {
  title: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  walkingInfo?: string; // HTML string for walking distance/link
}

const CustomInfoWindow: React.FC<CustomInfoWindowProps> = ({
  title,
  description = "",
  buttonText,
  buttonLink,
  walkingInfo = "",
}) => {
  return (
    <div className="custom-info-window">
      <button
        className="custom-info-window-close"
        {...({ onclick: "window.closeMapInfoWindow()" } as any)}
      >
        ×
      </button>
      <h3>{title}</h3>
      {description && <p className="description">{description}</p>}
      {walkingInfo && (
        <div
          className="walking-info"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: walkingInfo }}
        />
      )}
      <a href={buttonLink} className="page-btn-primary">
        {buttonText}
      </a>
    </div>
  );
};

export default CustomInfoWindow;
