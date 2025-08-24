import React from 'react';

const Modal = ({ setIsModalOpen }: { setIsModalOpen: (isOpen: boolean) => void }) => (
  <div id="myModal" className="modal" style={{ display: "block" }}>
    <div className="modal-content">
      <div className="modal-header">
        <div className="author">Made by: Tien Dang</div>
        <div className="close" onClick={() => setIsModalOpen(false)}>
          &times;
        </div>
      </div>
      <div className="modal-body">
        <ul>
          <li>
            Hand Writing Classification using CNN with Keras, Tensorflowjs, Nextjs CSR.
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
            rel="noopener noreferrer"
          >
            Here
          </a>
        </h3>
      </div>
    </div>
  </div>
);

export default Modal;
