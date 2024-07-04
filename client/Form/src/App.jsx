import React, { useState } from 'react';
import './App.css'; // Import the CSS file

const App = () => {
  const [cred, setCred] = useState({
    name: "",
    tel: "",
    email: "",
    subject: "",
    message: "",
    position: "", // New field for position
  });

  const [resume, setResume] = useState(null); // New state for file input
  const [status, setStatus] = useState(""); // To handle form submission status

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCred(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (event) => {
    setResume(event.target.files[0]);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('resume', resume);
    for (const key in cred) {
      formData.append(key, cred[key]);
    }

    try {
      const response = await fetch("https://node-mailer-api-1.vercel.app/", {
        method: "POST",
        credentials: "include",
        body: formData, // Use FormData to include the file and other form data
      });

      if (!response.ok) {
        const errorData = await response.json();
        setStatus(`Error: ${errorData.message}`);
        console.error(errorData);
      } else {
        const data = await response.json();
        setStatus("Message sent successfully!");
        console.log(data);
        setCred({ name: "", tel: "", email: "", subject: "", message: "", position: "" }); // Clear form fields
        setResume(null); // Clear file input
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      console.error("Submission failed:", error);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <h2>Contact Us</h2>
        {status && <p>{status}</p>} {/* Display submission status */}
        <form id="myform" onSubmit={submitHandler}>
          <div className="row">
            <div className="col-md-8 py-3 py-md-5">
              <div className="contactSec">
                <div className="row">
                  <div className="col-md-6 mt-3">
                    <input
                      type="text"
                      placeholder="Your Name"
                      id="contact-name"
                      name="name"
                      value={cred.name}
                      onChange={handleChange}
                      required
                      className="customField"
                    />
                  </div>

                  <div className="col-md-6 mt-3">
                    <input
                      type="number"
                      placeholder="Your Phone Number"
                      id="contact-phone"
                      name="tel"
                      value={cred.tel}
                      onChange={handleChange}
                      className="customField"
                    />
                  </div>

                  <div className="col-md-6 mt-3">
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={cred.email}
                      onChange={handleChange}
                      required
                      placeholder="Your Email"
                      className="customField"
                    />
                  </div>

                  <div className="col-md-6 mt-3">
                    <select
                      id="position"
                      name="position"
                      value={cred.position}
                      onChange={handleChange}
                      className="customField"
                    >
                      <option value="">Select Position</option>
                      <option value="Key Accounts Management">Key Accounts Management</option>
                      <option value="Distribution Management">Distribution Management</option>
                      <option value="Trade Marketing">Trade Marketing</option>
                      <option value="Sales Information & Sales Capability">Sales Information & Sales Capability</option>
                      <option value="Supply Chain and Logistics">Supply Chain and Logistics</option>
                      <option value="Human Resources & Corporate Services">Human Resources & Corporate Services</option>
                      <option value="Finance and Accounting">Finance and Accounting</option>
                      <option value="Management Trainee">Management Trainee</option>
                    </select>
                  </div>

                  <div className="col-md-12 mt-3">
                    <input
                      type="text"
                      id="contact-subject"
                      placeholder="Subject"
                      name="subject"
                      value={cred.subject}
                      onChange={handleChange}
                      className="customField"
                    />
                  </div>

                  <div className="col-md-12 mt-3">
                    <textarea
                      rows="4"
                      id="contact-message"
                      name="message"
                      value={cred.message}
                      onChange={handleChange}
                      className="customField"
                      placeholder="Message"
                    ></textarea>
                  </div>

                  <div className="col-md-12 mt-3">
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      onChange={handleFileChange}
                      className="customField"
                    />
                  </div>

                  <div className="col-md-12 mt-3">
                    <button type="submit" className="submitButton">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default App;
