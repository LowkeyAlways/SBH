import React from "react";

function Contacts() {
  return (
      <div class="d-flex contacts justify-content-around">
        <div class="contact">
          <h1 className="my-5">Scheilla L. Saint-Juste</h1>
          <div>
            <div>
              <h3>Téléphone</h3>
              <p>+33 664693485</p>
              <h3>Email</h3>
              <a href="mailto:shbparis@gmail.com">shbparis@gmail.com</a>
            </div>
          </div>
        </div>
        <div class="contact">
          <h1 className="my-5">Donel Saint-Juste</h1>
          <div>
            <div>
              <h3>Téléphone</h3>
              <p>+33 651622913</p>
              <h3>Email</h3>
              <a href="mailto:shbparis@gmail.com">shbparis@gmail.com</a>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Contacts;
