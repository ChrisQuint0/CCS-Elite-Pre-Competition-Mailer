## CCS Elite — Pre-Competition Mailer

Send beautifully styled winner announcement emails for CCS Days 2025. This lightweight Node/Express service uses Nodemailer and an HTML template to deliver gold/silver/bronze messages with dynamic styling, ready for production SMTP or safe testing via Ethereal.

### Why this exists

- **Fast winner notifications**: One POST request to email winners with personalized, on-brand content.
- **No vendor lock-in**: Works with any SMTP provider.
- **Safe previews**: Ethereal support for instant web previews without sending real emails.

---

### Features

- **REST endpoint** to send winner emails: `POST /send-winner`
- **Dynamic theming** per placement (gold/silver/bronze)
- **Responsive HTML template** with inline styles
- **Production SMTP** and **Ethereal test** modes

---

### Tech stack

- Node.js (ES Modules)
- Express 5
- Nodemailer 7
- dotenv

---

### Project structure

```text
CCS-Elite-Pre-Competition-Mailer/
  server.js                  # Express server exposing REST endpoints
  send-winner-email.js       # Email sending logic with Nodemailer + template
  winner-email-template.html # Responsive, themed HTML email template
  templates/                 # (Legacy) handlebars scaffolding
  public/                    # Static assets (if any)
  assets/                    # Images/assets (if any)
  package.json
```

---

### Prerequisites

- Node.js 18+
- An SMTP account (e.g., Gmail SMTP, Outlook, SendGrid, Mailgun) or Ethereal for testing

---

### Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` in the project root:

```bash
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false        # true for port 465, false for 587/25
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

3. Start the server:

```bash
node server.js
```

The server listens on `http://localhost:3000`.

Note: `package.json` currently points `start` to `send-email.js`. You can either run `node server.js` directly or update the `start` script to:

```json
"scripts": {
  "start": "node server.js"
}
```

---

### API

#### POST /send-winner

Send a winner announcement email.

Request body (JSON):

```json
{
  "email": "winner@example.com",
  "name": "Alex Rivera",
  "place": "gold",
  "category": "Java",
  "score": 97
}
```

- **place**: one of `gold`, `silver`, `bronze`
- **category**: competition category (e.g., "Python", "Java", "Web")

Example `curl`:

```bash
curl -X POST http://localhost:3000/send-winner \
  -H "Content-Type: application/json" \
  -d '{
    "email": "winner@example.com",
    "name": "Alex Rivera",
    "place": "gold",
    "category": "Java",
    "score": 97
  }'
```

Response (success):

```json
{
  "success": true,
  "message": "Winner email sent successfully!",
  "previewUrl": null
}
```

If you enable Ethereal (see below), `previewUrl` will contain a link to view the email.

---

### Testing with Ethereal (no real emails)

Ethereal creates a fake SMTP account and returns a web preview link for each message.

Temporarily set `useEthereal: true` in `server.js` when calling `sendWinnerEmail`:

```startLine:endLine:server.js
48:      useEthereal: false, // change to true for testing with Ethereal
```

Then call the endpoint as usual. In the server logs you’ll see something like:

```
🧪 Ethereal preview link: https://ethereal.email/message/...
```

Open that URL to preview the exact email that would have been sent.

Tip: When using Ethereal, your `.env` SMTP values are ignored.

---

### Email template

The template is plain HTML with tokens that are replaced server-side.

Tokens used:

- `{{winner_name}}`
- `{{place_text}}` (derived from `place`)
- `{{programming_category}}`
- `{{score}}`
- `{{trophy_emoji}}` (derived from `place`)
- style tokens for dynamic colors (e.g., `{{border_color}}`, `{{banner_gradient}}`)

Edit `winner-email-template.html` to tweak copy or styling. Colors and text for each placement are configured in `send-winner-email.js`.

---

### Troubleshooting

- **Connection timed out / auth failed**: Verify `.env` `SMTP_*` values match your provider docs. Check port and `SMTP_SECURE`.
- **Nothing arrives**: Inspect server logs. If testing, switch to Ethereal to validate template/content and transport.
- **HTML not styled**: Ensure you’re editing `winner-email-template.html`. Many email clients support inline CSS; this template is built accordingly.
- **500: Failed to send winner email**: The JSON response includes an `error` message. Common causes are invalid SMTP creds or an unsupported `place` value.
