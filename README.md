# Alexander Blair Portfolio

An interactive, Lofi-inspired portfolio website with parallax effects, day/night mode, and animated transitions.

## Quick Start

1. Open `index.html` in your browser (Chrome, Firefox, Safari, Edge)
1. That’s it! No server required for local viewing.

## File Structure

```
portfolio/
├── index.html      # Main webpage structure
├── style.css       # All styling (day/night themes, animations)
├── script.js       # GSAP animations, parallax, interactions
├── assets/         # Place your SVG artwork here
└── README.md       # You're reading it
```

## How It Works

### The Intro Sequence (3 seconds)

- Black screen → “ALEXANDER BLAIR PORTFOLIO” fades in
- Door draws itself line by line
- Intro text fades in sequentially
- “I do all three.” lands → door becomes clickable

### The Desk Scene

- Parallax effect: move your mouse, layers shift at different rates
- 7 clickable objects representing your disciplines
- Hover states: objects lift and glow
- Click to enter each section

### Day/Night Toggle

- Click the sun/moon button in the nav
- Night mode: darker colors, lamp glows, rain on window, dog appears
- Pet the dog for a tooltip!

## Customizing

### Replace Placeholder Objects

The desk objects are currently CSS shapes. To use your own illustrations:

1. Create SVG files for each object (monitor, laptop, headphones, etc.)
1. Save them in the `assets/` folder
1. In `index.html`, replace the `.object-shape` divs with `<img>` tags
1. Adjust sizing in `style.css`

### Change Colors

All colors are CSS variables at the top of `style.css`:

```css
:root {
    --bg-primary: #2a2438;      /* Main background */
    --accent-warm: #f4a261;      /* Orange accent */
    --accent-cool: #7c9885;      /* Green accent */
    /* etc... */
}
```

### Edit Section Content

In `script.js`, find `getSectionContent()` around line 280. Each section has placeholder HTML you can replace with your actual portfolio content.

### Adjust Timing

In `script.js`, the intro timing is in `playIntro()`. The `data-delay` attributes on intro lines control when each fades in.

### Parallax Intensity

In `style.css`, the `data-depth` values control how much each layer moves:

- `0.2` = moves least (background)
- `0.5` = moves medium (desk)
- `1.0` = moves most (foreground)

Adjust in the HTML `data-depth` attributes or the multipliers in `script.js`.

## Deploying Online

### GitHub Pages (free)

1. Create a repository on GitHub
1. Upload these files
1. Go to Settings → Pages → Select “main” branch
1. Your site will be at `yourusername.github.io/reponame`

### Netlify (free)

1. Go to netlify.com
1. Drag and drop the `portfolio` folder
1. Done! Get a free URL or connect your domain

### Vercel (free)

1. Go to vercel.com
1. Import from GitHub or drag and drop
1. Instant deployment

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Dependencies

- GSAP 3.12.2 (loaded from CDN, no installation needed)
- Google Fonts: Space Mono, Syne

## Next Steps

1. **View the prototype** - Open index.html and experience the flow
1. **Note what to change** - Object sizes, positions, colors
1. **Create your illustrations** - The desk, objects, door in your style
1. **Replace placeholders** - Swap CSS shapes for your SVGs
1. **Add real content** - Your actual portfolio pieces in each section
1. **Test on mobile** - Resize browser or use phone
1. **Deploy** - Push live when ready

## Questions?

The code is commented throughout. Each section in the CSS and JS files has a header explaining what it does.

Good luck with the portfolio! 🐕
