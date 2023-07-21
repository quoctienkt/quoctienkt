"use client";
import { useEffect } from "react";
import "./style.css";
import { AppImage } from "@/components/core_components/image/Image";
import { UseScriptStatus, useScript } from "usehooks-ts";
import { getAssetPathWithBasePath } from "@/utils/assetUtil";

const appPrefix = "/apps/handwritingclassification";

interface ViewProps {
  basePath: string;
}

export default function View({ basePath }: ViewProps) {
  useEffect(() => {
    document.title = "Hand writing classification";
  }, []);

  const jqueryScriptStatus: UseScriptStatus = useScript(
    "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"
  );
  const tensorflowScriptStatus: UseScriptStatus = useScript(
    "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js"
  );
  const chartScriptStatus: UseScriptStatus = useScript(
    "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"
  );
  const painScriptStatus: UseScriptStatus = useScript(
    getAssetPathWithBasePath(basePath, appPrefix, "/js/paint.js")
  );
  const mainScriptStatus: UseScriptStatus = useScript(
    getAssetPathWithBasePath(basePath, appPrefix, "/js/main.js")
  );

  useEffect(() => {
    const allScriptsReady =
      jqueryScriptStatus === "ready" &&
      tensorflowScriptStatus === "ready" &&
      chartScriptStatus === "ready" &&
      painScriptStatus === "ready" &&
      mainScriptStatus === "ready";
    if (allScriptsReady) {
      (window as any).setupApp(appPrefix);
    }
  }, [
    tensorflowScriptStatus,
    chartScriptStatus,
    painScriptStatus,
    mainScriptStatus,
  ]);

  return (
    <>
      <section className="app_handwritingclassification">
        <div id="notification_container"></div>
        <div className="container">
          <canvas id="myCanvas" className="active" width="300" height="350"></canvas>
          <div className="chart-container">
            <canvas id="chart_box" width="400" height="350"></canvas>
          </div>
        </div>

        <hr className="hr_footer" />

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
              alt="App's info icon"
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
                    href="https://github.com/quoctienkt/quoctienkt/blob/main/src/app/apps/handwritingclassification/page.tsx"
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
