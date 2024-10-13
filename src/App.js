import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
    scheduled_time: '',
  });

  const [taskScheduled, setTaskScheduled] = useState(false);
  const [error, setError] = useState('');

  const serviceID = "service_mcxrkxk";  // Replace with your actual service ID
  const templateID = "template_jm23nub";  // Replace with your actual template ID
  const userID = "J5L_xgGhiH0DieUW7";  // Replace with your actual user ID from EmailJS

  const onSubmit = (e) => {
    e.preventDefault();

    // Calculate the delay until the scheduled time
    const scheduledDate = new Date(formData.scheduled_time);
    const currentTime = new Date();
    const delay = scheduledDate - currentTime;

    if (delay <= 0) {
      setError('Scheduled time must be in the future.');
      return;
    }

    setError(''); // Clear any previous error messages

    // Indicate that the task has been scheduled
    setTaskScheduled(true);

    // Set a timeout to send the email at the scheduled time
    setTimeout(() => {
      emailjs.send(serviceID, templateID, {
        ...formData,
        from_name: "Task Scheduler", // Set the sender's name
      }, userID)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
      })
      .catch((err) => {
        console.log('FAILED...', err);
        setError('Failed to send email. Please try again later.');
      });
    }, delay); // Delay in milliseconds
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="App">
      <h1>Task Scheduler</h1>
      {!taskScheduled ? (
        <form onSubmit={onSubmit}>
          <div>
            <label>Your Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Task Subject:</label>
            <input
              type="text"
              name="subject"
              placeholder="Enter task subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Task Message:</label>
            <textarea
              name="message"
              placeholder="Enter task message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Scheduled Time:</label>
            <input
              type="datetime-local"
              name="scheduled_time"
              value={formData.scheduled_time}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Schedule Task</button>
          {error && <p className="error">{error}</p>}
        </form>
      ) : (
        <div className="container">
          <h2>Task Scheduled Successfully!</h2>
          <p>Hello,</p>
          <p>Your task has been successfully scheduled with the following details:</p>
          <p><strong>Your Email:</strong> {formData.email}</p>
          <p><strong>Task Subject:</strong> {formData.subject}</p>
          <p><strong>Task Message:</strong> {formData.message}</p>
          <p><strong>Scheduled Time:</strong> {formData.scheduled_time}</p>
          <p>You will receive an email once the task is processed at the scheduled time.</p>
          <div className="footer">
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
