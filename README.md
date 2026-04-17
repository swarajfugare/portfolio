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
│   ├── swaraj-fugare-logo.svg
│   ├── swaraj-fugare-official-portrait-2026.jpg
│   ├── nsui-vice-president-appointment-letter-2026.jpg
│   ├── swaraj-fugare-github-avatar.jpg
│   ├── swaraj-fugare-profile.jpg
│   ├── swaraj-fugare-resume-preview.jpg
│   └── matoshree-collection-logo.png
├── style.css
├── script.js
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
- GitHub API: profile facts and public repositories for `swarajfugare`
- Instagram Open Graph metadata: profile image and public count signals
- Matoshree Collection website metadata: business description, logo, services, organization schema facts
- LinkedIn and X: official profile links

## Deploy on GitHub Pages

1. Create a GitHub repository named `Portfolio`.
2. Upload all files from this folder to the repository root.
3. Open repository Settings, then Pages.
4. Choose `Deploy from a branch`, select the `main` branch and `/root`.
5. The expected URL is `https://swarajfugare.github.io/Portfolio/`.
6. Submit `https://swarajfugare.github.io/Portfolio/sitemap.xml` in Google Search Console.

## Deploy on Netlify

1. Go to Netlify and choose `Add new site`.
2. Select `Deploy manually`.
3. Drag the full `Portfolio` folder into Netlify.
4. After deployment, update the canonical URLs, Open Graph URLs, schema URLs, `robots.txt`, and `sitemap.xml` from `https://swarajfugare.github.io/Portfolio/` to the final Netlify or custom-domain URL.
5. Submit the deployed sitemap in Google Search Console.

## Notes Before Launch

- The contact form is Netlify Forms-ready. On Netlify, submissions appear in Netlify Dashboard > Site > Forms > contact.
- On GitHub Pages, the contact form falls back to opening the visitor's email app using `mailto:` because GitHub Pages does not store form submissions.
- The WhatsApp button uses the phone number extracted from the resume.
- GitHub projects load live in the browser and show fallback project cards if the API is blocked.
