"use client"

import Head from "next/head";
import Script from "next/script";
import Image from "next/image";
import { getAssetPath } from "@/utils/AssetUtil";
import "./style.css";


export default function Page() {
  const paintJsPath = getAssetPath(
    "apps/handwritingclassification/js/paint.js"
  );
  const indexJsPath = getAssetPath(
    "apps/handwritingclassification/js/index.js"
  );
  return (
    <>
      <Head>
        <title>Hand writing classification</title>
      </Head>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></Script>
      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js"></Script>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"></Script>
      <Script src={paintJsPath}></Script>
      <Script src={indexJsPath}></Script>

      <section className="app_handwritingclassfication">
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
            className="action-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-600 rounded mr-1"
            id="submit"
          >
            Predict
          </button>
          <button
            className="action-btn bg-slate-400 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={() => (window as any).clearArea()}
          >
            Clear
          </button>
        </div>

        <>
          <div className="information">
            <Image
              src={getAssetPath("img/information.png")}
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
