exports.getEmailTemplate = (url) => {
  return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Weekly Research Paper Recommendation</title>
      <style>
        /* Reset styles */
        body, p, h1 {
          margin: 0;
          padding: 0;
        }
    
        /* Container styles */
        .container {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
    
        /* Heading styles */
        h1 {
          font-size: 24px;
          margin-bottom: 20px;
          text-align: center;
        }
    
        /* Button styles */
        .button {
          display: block;
          width: 200px;
          margin: 0 auto;
          margin-top: 20px;
          text-align: center;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          font-size: 16px;
        }
    
        /* Button hover effect */
        .button:hover {
          background-color: #45a049;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Weekly Research Paper Recommendation</h1>
        <p>Dear Subscriber,</p>
        <p>We have selected a fascinating research paper for you to read this week. Click the button below to access it:</p>
        <a href=${url} class="button">Read Now</a>
      </div>
    </body>
    </html>
    `;
};
