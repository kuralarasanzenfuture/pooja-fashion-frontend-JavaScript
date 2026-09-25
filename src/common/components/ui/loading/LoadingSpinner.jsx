export default function LoadingSpinner() {
  return (
    <>
      <style>{`
        .loading-spinner {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          background: #eee;
        }

        .loading-spinner__ring,
        .loading-spinner__ring-small,
        .loading-spinner__ring-big,
        .loading-spinner__inner,
        .loading-spinner__inner-inner {
          position: fixed;
          top: 50%;
          left: 50%;
          display: block;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .loading-spinner__ring {
          width: 180px;
          height: 180px;
          border: 10px inset rgb(133, 224, 242);
          margin-left: -100px;
          margin-top: -100px;
          animation: rotate 5s infinite linear;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        }

        .loading-spinner__ring-small {
          width: 150px;
          height: 150px;
          border: 6px outset rgb(133, 224, 242);
          margin-left: -81px;
          margin-top: -81px;
          animation: rotate-rev 3s infinite linear;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        }

        .loading-spinner__ring-big {
          width: 210px;
          height: 210px;
          border: 4px dotted rgb(133, 224, 242);
          margin-left: -109px;
          margin-top: -109px;
          animation: rotate-rev 10s infinite linear;
        }

        .loading-spinner__inner {
          width: 80px;
          height: 80px;
          background-color: rgb(133, 224, 242);
          margin-left: -40px;
          margin-top: -40px;
          animation: pulse 1.5s infinite ease-in;
          opacity: 1;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        }

        .loading-spinner__inner-inner {
          width: 100px;
          height: 100px;
          background-color: rgb(74, 124, 134);
          margin-left: -50px;
          margin-top: -50px;
          animation: pulse 1.5s infinite ease-in;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        }

        @keyframes rotate {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes rotate-rev {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(-360deg); }
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.1);
            opacity: 0.2;
          }
          50% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.1);
            opacity: 0.2;
          }
        }
      `}</style>

      <div className="loading-spinner" aria-label="Loading" role="status">
        <div className="loading-spinner__ring" />
        <div className="loading-spinner__ring-small" />
        <div className="loading-spinner__ring-big" />
        <div className="loading-spinner__inner-inner" />
        <div className="loading-spinner__inner" />
      </div>
    </>
  );
}
