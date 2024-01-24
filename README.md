# LTTS_Webpage

**Project Title: Basic Registration Module**

### Technologies Used:
- Frontend: HTML, CSS, JavaScript (React for UI)
- Backend: Node.js, Express
- Database: MongoDB

### Project Description:

#### Overview:
A basic registration module implemented as a web application. Users can register by providing their name, email, and phone number. After registration, a verification email is sent with an activation link. Upon successful activation, users can log in, and a welcome screen displays their name.

#### Project Structure:

- **frontend**: Contains HTML, CSS, and React components for the user interface.
- **backend**: Implements the server using Node.js and Express.
- **database**: Handles database-related configurations and MongoDB schemas.
- **mailer**: Manages email verification and sending activation links.
- **public**: Holds static assets like images or stylesheets.

#### Getting Started:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/basic-registration-module.git
   ```

2. Install dependencies:
   ```bash
   cd basic-registration-module
   npm install
   ```

3. Configure the environment variables:
   - Create a `.env` file in the backend folder and add the necessary configurations like MongoDB connection string, email service credentials, etc.

4. Run the application:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000` to access the registration module.

#### Usage:

1. Click on the "Register" button to open the registration form.
2. Fill in the mandatory fields: Name, Email, Phone Number.
3. Click "Submit" to register. A verification email will be sent to the provided email address.
4. Check your email and click on the activation link to activate your account.
5. Once activated, go back to the application and click on the "Login" button.
6. Provide your registered email and click "Login."
7. If the user is registered, a welcome screen will appear with the user's name.

#### Note:
- Ensure that you have Node.js and MongoDB installed on your system.
- Customize the project according to your needs, such as email service configuration, database setup, or UI enhancements.

