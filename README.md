# LinkedIn Automated Outreach Bot

An automated Node.js tool designed to search for job opportunities on LinkedIn, extract recruiter email addresses from recent posts, and send automated applications with a personalized cover letter and resume.

## 🚀 Features
- **Automated Login**: Securely logs into LinkedIn using credentials from environment variables.
- **Advanced Search**: Automatically navigates to filtered search results for specific keywords (e.g., "Java Developer Contract").
- **Visual Scrolling**: Scrolls through the feed smoothly to trigger lazy-loading of posts.
- **Brute-Force Scraper**: Extracts all visible text and uses Regex to find valid email addresses.
- **Automated Emailing**: Uses Nodemailer (Gmail SMTP) to send professional applications.
- **Live Verification**: Refreshes the Gmail "Sent" folder in the browser after each email for real-time tracking.
- **Human-Like Behavior**: Includes random delays and visual pauses to mimic human interaction.

## 🛠️ Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- A Gmail account with an **App Password** enabled.
- A LinkedIn account.

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd LinkedIn-Auto-Bot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (already ignored by `.gitignore`) and add your credentials:
   ```env
   LINKEDIN_EMAIL=your-email@example.com
   LINKEDIN_PASSWORD=your-linkedin-password
   GMAIL_USER=your-gmail@gmail.com
   GMAIL_APP_PASSWORD=your-16-digit-app-password
   ```

4. **Add your Resume**:
   Place your resume in the root directory and name it `resume.pdf`.

## 🚀 Usage

Run the bot with the following command:
```bash
node index.js
```

## ⚠️ Important Notes
- **App Password**: For Gmail, you must generate a 16-digit "App Password" in your Google Account security settings. Regular passwords will not work.
- **LinkedIn Security**: Excessive use of automation can lead to LinkedIn account restrictions. Use this tool responsibly.
- **Test Mode**: To test without sending real emails, comment out the `await transporter.sendMail(mailOptions);` line in `index.js`.

## 📄 License
This project is for educational purposes only.
