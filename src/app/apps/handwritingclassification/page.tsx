"use client";

import Head from "next/head";
import Script from "next/script";
import { getAssetPath } from "@/utils/AssetUtil";
import "./style.css";

export default function Page() {
  return (
    <>
      <Head>
        <title>Hand writing classification</title>
      </Head>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></Script>
      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js"></Script>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"></Script>
      <Script
        src={getAssetPath("apps/handwritingclassification/js/paint.js")}
      ></Script>
      <Script
        src={getAssetPath("apps/handwritingclassification/js/index.js")}
      ></Script>

      <section className="app_handwritingclassfication">
        <p id="load"></p>
        <div className="container">
          <canvas id="myCanvas" width="300" height="350"></canvas>
          <div className="chart-container">
            <canvas id="chart_box" width="400" height="400"></canvas>
          </div>
        </div>
        <hr />
        <div>
          Line width :
          <select id="selWidth" defaultValue={11}>
            <option value="9">9</option>
            <option value="11">11</option>
            <option value="13">13</option>
            <option value="15">15</option>
            <option value="17">17</option>
            <option value="19">19</option>
          </select>
          Color :
          <select id="selColor" defaultValue={"white"}>
            <option value="yellow">yellow</option>
            <option value="blue">blue</option>
            <option value="red">red</option>
            <option value="green">green</option>
            <option value="white">white</option>
            <option value="gray">gray</option>
          </select>
        </div>
        <br />
        <button id="submit">Submit</button>

        <button onClick={() => (window as any).clearArea()}>Clear Area</button>

        <div className="button_cont information">
          <p className="example_f">Information</p>
        </div>

        <div id="myModal" className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <span className="close">&times;</span>
              <h2>Made by: Đặng Quốc Tiến</h2>
            </div>
            <div className="modal-body">
              <ul style={{ textAlign: "left" }}>
                <li>
                  Hand Writing Classification using CNN with Keras,
                  Tensorflowjs, nodejs.{" "}
                </li>
                <li>Train data: mnist. </li>
                <li>Result is pretty good! </li>
              </ul>
            </div>
            <div className="modal-footer">
              <h3>
                Source code:{" "}
                <a
                  href="https://gitlab.com/17521121/handwritingclassification"
                  target="_blank"
                >
                  <code>Here!</code>
                </a>
              </h3>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
