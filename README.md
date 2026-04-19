# Swaraj Fugare Portfolio

Premium multi-page static portfolio website for Swaraj Vijay Fugare.

## Structure

```text
Portfolio/
├── index.html
├── about/
│   └── index.html
├── resume/
│   └── index.html
├── projects/
│   └── index.html
├── matoshree-collection/
│   └── index.html
├── contact/
│   └── index.html
├── assets/
│   ├── Swaraj-Fugare-Resume.pdf
│   ├── favicon.svg
│   ├── favicon.png
│   ├── apple-touch-icon.png
│   ├── swaraj-fugare-logo.svg
│   ├── swaraj-fugare-logo-brand.png
│   ├── swaraj-fugare-logo-mark.png
│   ├── swaraj-fugare-social-banner.png
│   ├── swaraj-fugare-official-portrait-2026.jpg
│   ├── nsui-vice-president-appointment-letter-2026.jpg
│   ├── swaraj-fugare-github-avatar.jpg
│   ├── swaraj-fugare-profile.jpg
│   ├── swaraj-fugare-resume-preview.jpg
│   └── matoshree-collection-logo.png
├── style.css
├── style.min.css
├── script.js
├── script.min.js
├── robots.txt
└── sitemap.xml
```

## Pages

- Home: personal brand overview for Swaraj Fugare
- About: biography, education, leadership, business, and skill story
- Resume: structured resume plus downloadable PDF
- Projects: dynamic GitHub API integration with fallback public repository data
- Business: Matoshree Collection brand page
- Contact: email form, WhatsApp, social links, and business links

## Data Sources Used

- Resume PDF: education, phone, email, address, skills, NSUI experience, objective
- Uploaded NSUI appointment letter: Vice President, Solapur District NSUI, dated 15 April 2026
- Uploaded portrait: main profile image on the home and about pages
- Uploaded SF logo: refined into transparent brand assets, favicon, and the social share banner
- GitHub API: profile facts and public repositories for `swarajfugare`
- Instagram Open Graph metadata: profile image and public count signals
- Matoshree Collection website metadata: business description, logo, services, organization schema facts
- LinkedIn and X: official profile links

## Preview locally

1. Run `python3 -m http.server 4173` from the project root.
2. Open `http://127.0.0.1:4173/`.
3. Use a local server because the site now uses root-relative links for the custom domain structure.

## Deploy on custom domain

1. Upload the full project to the hosting platform serving `https://portfolio.matoshreecollection.in`.
2. Keep the root structure exactly as provided so `/about/`, `/projects/`, `/resume/`, `/contact/`, and `/matoshree-collection/` resolve correctly.
3. Submit `https://portfolio.matoshreecollection.in/sitemap.xml` in Google Search Console.
4. Verify the custom domain serves the generated `robots.txt`, `sitemap.xml`, `style.min.css`, and `script.min.js` files.

## Notes Before Launch

- The contact form is Netlify Forms-ready. On Netlify, submissions appear in Netlify Dashboard > Site > Forms > contact.
- On GitHub Pages, the contact form falls back to opening the visitor's email app using `mailto:` because GitHub Pages does not store form submissions.
- The WhatsApp button uses the phone number extracted from the resume.
- GitHub projects load live in the browser and show fallback project cards if the API is blocked.
