require('dotenv').config();
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const path = require('path');

// To use this, run: npm install nodemailer
async function sendEmail(recipientEmail) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPass) {
    console.error('Missing GMAIL_USER or GMAIL_APP_PASSWORD in .env');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailAppPass
    }
  });

  const mailOptions = {
    from: gmailUser,
    to: recipientEmail,
    subject: 'Application for Java Developer (Contract) Role',
    text: `Hi,

I am writing to express my interest in the Java Developer (Contract) role. I have extensive experience building robust backend systems using Java, Spring Boot, and Microservices.

Furthermore, I have hands-on experience in managing complex contract-based projects and ensuring high-quality deliverables within tight deadlines. I believe my technical background and professional approach make me a strong candidate for this position.

Please find my resume attached for your review. I look forward to hearing from you.

Best regards,
Java Developer`,
    attachments: [
      {
        filename: 'resume.pdf',
        path: path.join(__dirname, 'resume.pdf')
      }
    ]
  };

  try {
    // LIVE MODE: Sending the actual email
    await transporter.sendMail(mailOptions);
    console.log('LIVE MODE: Successfully sent email with resume to ' + recipientEmail);
  } catch (error) {
    console.error(`Failed to send email to ${recipientEmail}:`, error.message);
  }
}

async function scrollDown(page, scrolls = 4) {
  for (let i = 0; i < scrolls; i++) {
    console.log(`Scrolling (${i + 1}/${scrolls})...`);
    await page.evaluate(() => {
      window.scrollBy({
        top: window.innerHeight * 0.8,
        behavior: 'smooth'
      });
    });
    const scrollDelay = Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000;
    await new Promise(resolve => setTimeout(resolve, scrollDelay));
  }
}

(async () => {
  const email = process.env.LINKEDIN_EMAIL;
  const password = process.env.LINKEDIN_PASSWORD;

  if (!email || !password) {
    console.error('Please provide LINKEDIN_EMAIL and LINKEDIN_PASSWORD in the .env file.');
    process.exit(1);
  }

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--start-maximized'],
    defaultViewport: null
  });

  const page = await browser.newPage();

  try {
    console.log('Navigating to LinkedIn login page...');
    await page.goto('https://www.linkedin.com/login', {
      waitUntil: 'domcontentloaded',
      timeout: 90000 // Increased timeout to 90 seconds
    });

    // Added an extra 10-second wait to ensure all elements render on slow connections
    console.log('Waiting for the login page elements to settle...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Ensure the page body exists
    await page.waitForSelector('body');
    console.log('Login page fully loaded.');

    try {
      console.log('Filling credentials...');
      await page.bringToFront(); // Bring window to focus
      await new Promise(resolve => setTimeout(resolve, 2000)); // Short pause for user to watch

      await page.waitForSelector('#username', { timeout: 5000 });
      await page.type('#username', email, { delay: 100 });

      await page.waitForSelector('#password', { timeout: 5000 });
      await page.type('#password', password, { delay: 100 });

      console.log('Clicking Sign in...');
      await page.click('button[type="submit"]');
    } catch (selectorError) {
      console.log('Login selectors not found. Proceeding...');
    }

    const delay = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000;
    console.log(`Waiting for ${delay / 1000} seconds to mimic human behavior...`);
    await new Promise(resolve => setTimeout(resolve, delay));

    const searchUrl = 'https://www.linkedin.com/search/results/content/?datePosted=%22past-24h%22&keywords=%22JAVA%20DEVELOPER%22%20AND%20%22CONTRACT%22';
    console.log(`Navigating to search results: ${searchUrl}`);
    await page.goto(searchUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    console.log('Waiting for the page to settle...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    await scrollDown(page, 4);

    console.log('Extracting all text from the page...');
    const fullText = await page.evaluate(() => document.body.innerText);

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
    const foundEmails = fullText.match(emailRegex) || [];
    const uniqueEmails = [...new Set(foundEmails.map(email => email.toLowerCase()))];

    if (uniqueEmails.length > 0) {
      console.log('Extracted Emails:', uniqueEmails);
      
      console.log(`\n--- Starting Automated Email Phase (LIVE MODE) - Total: ${uniqueEmails.length} ---`);
      for (let i = 0; i < uniqueEmails.length; i++) {
        const recipient = uniqueEmails[i];
        console.log(`[${i + 1}/${uniqueEmails.length}] Sending email to ${recipient}...`);
        await sendEmail(recipient);
        
        // Visual Update: Go to Gmail Sent folder after each email
        console.log(`Refreshing Gmail Sent folder to show email to ${recipient}...`);
        await page.goto('https://mail.google.com/mail/u/0/#sent', { waitUntil: 'domcontentloaded' });

        // 5-second delay to prevent spam detection
        if (i < uniqueEmails.length - 1) {
          console.log('Waiting 5 seconds before next email...');
          await new Promise(r => setTimeout(r, 5000));
        }
      }
      console.log('--- All Emails Sent Successfully ---\n');
    } else {
      console.log('No emails found in the recent posts.');
    }

  } catch (error) {
    console.error('An error occurred during execution:', error);
  } finally {
    console.log('Automation task finished. Browser will remain open.');
  }
})();
