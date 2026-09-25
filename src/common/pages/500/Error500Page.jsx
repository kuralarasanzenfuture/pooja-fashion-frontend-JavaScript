export default function Error500Page() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;500;700&display=swap');

        .error500-page {
          display: grid;
          place-items: center;
          width: 100%;
          min-height: 100vh;
          background: #f5f5f1;
          font-family: 'Inconsolata', monospace;
          color: #000;
          overflow: hidden;
        }

        .error500-page__content {
          position: relative;
          z-index: 2;
          margin: auto;
          padding: 20px;
          text-align: center;
        }

        .error500-page__box {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 1px solid #000;
          pointer-events: none;
        }

        .error500-page__box::before,
        .error500-page__box::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          box-shadow: inset 0px 0px 0px 1px #000;
          mix-blend-mode: multiply;
          animation: dance 2s infinite steps(1);
        }

        .error500-page__box::before {
          clip-path: polygon(0 0, 65% 0, 35% 100%, 0 100%);
          box-shadow: inset 0px 0px 0px 1px currentColor;
          color: #ff00ff;
        }

        .error500-page__box::after {
          clip-path: polygon(65% 0, 100% 0, 100% 100%, 35% 100%);
          animation-duration: 0.5s;
          animation-direction: alternate;
          box-shadow: inset 0px 0px 0px 1px currentColor;
          color: #00e5ff;
        }

        .error500-page__title {
          position: relative;
          font-size: clamp(2.8rem, 5vw, 5rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          animation: blink 1.3s infinite steps(1);
          margin: 0;
          display: inline-block;
          color: #000;
        }

        .error500-page__title::before,
        .error500-page__title::after {
          content: 'ERROR 500';
          position: absolute;
          top: -1px;
          left: 0;
          mix-blend-mode: soft-light;
          animation: dance 2s infinite steps(2);
        }

        .error500-page__title::before {
          clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
          color: #ff00ff;
          animation: shiftright 200ms steps(2) infinite;
        }

        .error500-page__title::after {
          clip-path: polygon(0 100%, 100% 100%, 100% 50%, 0 50%);
          color: #00e5ff;
          animation: shiftleft 200ms steps(2) infinite;
        }

        .error500-page__text {
          position: relative;
          margin: 8px 0 0;
          font-size: clamp(1rem, 1.8vw, 1.5rem);
          line-height: 1.5;
        }

        .error500-page__highlight {
          position: relative;
          display: inline-block;
          font-weight: 700;
          color: #000;
          animation: blink 3s steps(1) infinite;
        }

        .error500-page__highlight::before,
        .error500-page__highlight::after {
          content: 'unstable';
          position: absolute;
          top: -1px;
          left: 0;
          mix-blend-mode: multiply;
        }

        .error500-page__highlight::before {
          clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
          color: #ff00ff;
          animation: shiftright 1.5s steps(2) infinite;
        }

        .error500-page__highlight::after {
          clip-path: polygon(0 100%, 100% 100%, 100% 50%, 0 50%);
          color: #00e5ff;
          animation: shiftleft 1.7s steps(2) infinite;
        }

        @keyframes dance {
          0%, 84%, 94% { transform: skew(0deg); }
          85% { transform: skew(5deg); }
          90% { transform: skew(-5deg); }
          98% { transform: skew(3deg); }
        }

        @keyframes shiftleft {
          0%, 87%, 100% { transform: translate(0, 0) skew(0deg); }
          84%, 90% { transform: translate(-8px, 0) skew(20deg); }
        }

        @keyframes shiftright {
          0%, 87%, 100% { transform: translate(0, 0) skew(0deg); }
          84%, 90% { transform: translate(8px, 0) skew(20deg); }
        }

        @keyframes blink {
          0%, 50%, 85%, 100% { color: #000; }
          87%, 95% { color: transparent; }
        }

        @media (max-width: 640px) {
          .error500-page__content {
            max-width: 90vw;
          }
        }
      `}</style>

      <div className="error500-page">
        <div id="error" className="error500-page__content" aria-live="polite">
          <div id="box" className="error500-page__box" aria-hidden="true" />
          <h3 className="error500-page__title">ERROR 500</h3>
          <p className="error500-page__text">
            Things are a little <span className="error500-page__highlight">unstable</span> here
          </p>
          <p className="error500-page__text">I suggest come back later</p>
        </div>
      </div>
    </>
  );
}
