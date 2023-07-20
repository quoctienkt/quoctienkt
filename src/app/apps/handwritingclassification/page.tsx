"use client";

import Script from "next/script";
import { useEffect } from "react";
import { AppImage } from "@/components/core_components/image/Image";
import { AppScript } from "@/components/core_components/script/Script";
import "./style.css";

function Page() {
  useEffect(() => {
    document.title = "Hand writing classification";

    let setupAppInternal = setInterval(async () => {
      // wait for $ loaded
      if ($ === undefined) {
        return;
      }

      (window as any).setupApp(); // async
      clearInterval(setupAppInternal);
    }, 500);
  }, []);

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></Script>
      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js"></Script>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"></Script>
      <AppScript src="/apps/handwritingclassification/js/paint.js"></AppScript>
      <AppScript src="/apps/handwritingclassification/js/index.js"></AppScript>

      <section className="app_handwritingclassification">
        <div id="notification_container"></div>
        <div className="container">
          <canvas id="myCanvas" width="300" height="350"></canvas>
          <div className="chart-container">
            <canvas id="chart_box" width="400" height="350"></canvas>
          </div>
        </div>

        <hr />

        <div className="actions">
          <button
            className="px-4 py-2 mr-1 font-bold text-white bg-blue-500 border border-blue-600 rounded action-btn hover:bg-blue-700"
            id="submit"
          >
            Predict
          </button>
          <button className="px-4 py-2 font-semibold text-blue-700 border border-blue-500 rounded clear-area action-btn bg-slate-400 hover:bg-blue-500 hover:text-white hover:border-transparent">
            Clear
          </button>
        </div>

        <>
          <div className="information">
            <AppImage
              src="/img/information.png"
              alt="Author info icon"
              className="h-auto max-w-lg transition-all duration-300 rounded-lg cursor-pointer filter hover:grayscale grayscale-0"
              width={50}
              height={50}
            />
          </div>

          <div id="myModal" className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <div className="author">Made by: Tien Dang</div>
                <div className="close">&times;</div>
              </div>
              <div className="modal-body">
                <ul style={{ textAlign: "left" }}>
                  <li>
                    Hand Writing Classification using CNN with Keras,
                    Tensorflowjs, Nextjs CSR.
                  </li>
                  <li>Train data: mnist. </li>
                  <li>Result is pretty good! </li>
                </ul>
              </div>
              <div className="modal-footer">
                <h3>
                  <span>Source code: </span>
                  <a
                    href="https://gitlab.com/17521121/handwritingclassification"
                    target="_blank"
                  >
                    Here
                  </a>
                </h3>
              </div>
            </div>
          </div>
        </>
      </section>
    </>
  );
}

export default Page;
