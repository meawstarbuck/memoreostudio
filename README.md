# 📸 Memoreo Studio | Professional Photography Portfolio
**Live Site:** [https://memoreostudio.netlify.app](https://memoreostudio.netlify.app)

Welcome to the official repository of **Memoreo Studio**, a London-based Portrait & Lifestyle Photography service. This project showcases a high-performance, SEO-optimized portfolio designed for modern creative professionals.

---

## 🚀 Tech Stack
This site is built with the **JAMstack** architecture for ultimate speed and security:

* **SSG:** [Hugo](https://gohugo.io/) (The world’s fastest framework for building websites)
* **Theme:** Customized [Hugo-Profile](https://github.com/gurusabarish/hugo-profile)
* **Deployment:** [Netlify](https://www.netlify.com/) (Continuous Deployment via GitHub)
* **Styling:** Bootstrap 5 & Custom SCSS/CSS
* **Data Management:** YAML-based content structure for easy updates

---

## ✨ Key Features
* **Blazing Fast Performance:** Near-perfect Google PageSpeed scores for better SEO.
* **Interactive Portfolio:** Dynamic gallery with category filtering (Solo, Graduation, Couples).
* **Mobile-First Design:** Fully responsive layout for clients browsing on the go.
* **Automated Workflow:** New photos are added by simply updating `data/portfolio.yaml`.

---

## 🛠 Project Structure
```text
memoreostudio/
├── content/            # Site pages and blog posts (.md)
├── data/               # YAML files for portfolio & services data
├── layouts/            # Custom HTML overrides (Layout logic)
├── static/             # Images, icons, and assets
├── hugo.yaml           # Global site configuration
└── netlify.toml        # Build settings for Netlify
```

---

## Portfolio Image Import
Put new photos in `memoreostudio/image`, then run one of these commands from the `memoreostudio/` site folder:

```bash
node scripts/import-portfolio-images.mjs --category solo --apply
node scripts/import-portfolio-images.mjs --category party --apply
node scripts/import-portfolio-images.mjs --category graduation --apply
```

For couple photos:

```bash
node scripts/import-portfolio-images.mjs --category couple --apply
```

Use `--move --apply` instead of just `--apply` if you want to move files out of `image/` instead of copying them.
