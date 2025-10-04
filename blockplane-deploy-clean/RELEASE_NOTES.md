# BlockPlane Metric: Release Notes

## Version 2.8 - October 2025

This release integrates the updated BlockPlane Metric calculator with critical fixes and improvements into the GitHub repository, making it ready for Netlify deployment.

### Key Features

The BlockPlane Metric calculator is a professional-grade, free sustainability tool designed for architects, builders, and designers. It provides comprehensive environmental impact analysis for construction materials, including lifecycle assessments, regenerative impact scoring, and cost-per-impact analysis.

### What's New in This Release

#### 1. Repository Structure Updates

The repository has been reorganized to support both static assets and future TypeScript development. The new structure includes a `public` directory that serves as the deployment root for Netlify, containing both the landing page and the calculator.

**New Directory Structure:**

```
Block-Plane-Metric/
├── public/
│   ├── index.html              # Landing page
│   └── metric/
│       └── index.html          # Calculator application
├── src/                        # TypeScript source code
├── backend/                    # Backend utilities
├── netlify.toml                # Netlify configuration
├── DEPLOYMENT.md               # Deployment guide
├── RELEASE_NOTES.md            # This file
└── README.md                   # Updated README
```

#### 2. Calculator Fixes and Improvements

All critical fixes from the previous development cycle have been integrated into the calculator:

**Terminology Corrections:**
- Updated all references from "RIS" to "Regenerative Impact Score" for clarity and professionalism
- Ensured consistent terminology throughout the interface

**Feature Gating:**
- CPI (Cost Per Impact) values are now properly hidden in the free version
- Users see a clear upgrade prompt to unlock CPI analysis
- Paris Agreement Aligned badge is now gated and only appears after a valid calculation when both LIS and RIS scores are ≥ 60

**Pricing Updates:**
- Project Pass pricing updated to $199 (from previous placeholder values)
- Clear differentiation between one-time Project Pass and ongoing subscription options

**User Experience Enhancements:**
- Dark mode is now the default theme for better visual comfort
- "BlockPlane Metric" title is now larger and styled in vibrant gold (#FFD700) for brand recognition
- Navigation buttons are properly separated for improved usability
- Professional appearance maintained throughout (no emoji, no vanity metrics)

#### 3. Deployment Configuration

A comprehensive Netlify configuration has been added to ensure seamless deployment:

**Netlify Configuration (`netlify.toml`):**
- Automatic routing for the `/metric` path
- Security headers for enhanced protection
- Static site deployment with no build step required
- Publish directory set to `public`

**Documentation:**
- New `DEPLOYMENT.md` file with step-by-step Netlify deployment instructions
- Updated `README.md` with deployment quick start guide
- This release notes document for tracking changes

### Technical Details

**Technology Stack:**
- Frontend: Vanilla HTML/CSS/JavaScript (no framework dependencies)
- Styling: CSS custom properties for theming
- Storage: localStorage for user preferences
- Deployment: Netlify-ready static site

**Browser Compatibility:**
- Modern browsers with ES6+ support
- Responsive design for mobile, tablet, and desktop
- Dark mode support with system preference detection

### Deployment Instructions

To deploy this version to Netlify:

1. Connect your GitHub repository to Netlify
2. Netlify will automatically detect the `netlify.toml` configuration
3. Deploy with the default settings (no build command required)
4. Your site will be live at `https://your-site.netlify.app`
5. The calculator will be accessible at `https://your-site.netlify.app/metric`

For detailed instructions, see the [Deployment Guide](DEPLOYMENT.md).

### Verification Checklist

After deployment, verify the following:

- [ ] Landing page loads at the root URL
- [ ] "Launch Free Calculator" button navigates to `/metric`
- [ ] Calculator loads with dark mode as default
- [ ] "BlockPlane Metric" title appears in gold (#FFD700)
- [ ] "Regenerative Impact Score" terminology is used (not "RIS")
- [ ] CPI values are hidden with upgrade prompt
- [ ] Paris badge is hidden by default
- [ ] Paris badge appears only after valid calculation with LIS ≥ 60 and RIS ≥ 60
- [ ] Project Pass pricing shows $199
- [ ] Navigation buttons are properly separated
- [ ] Theme toggle works correctly
- [ ] All calculations produce accurate results

### Known Limitations

The free version of BlockPlane Metric includes the following limitations by design:

- CPI analysis is locked and requires upgrade
- PDF/CSV export is not available
- Material database is limited compared to the paid version
- Regional pricing data is not included

These limitations are intentional and serve to differentiate the free calculator from the enhanced paid version (BlockPlane Enhanced/MarginShield).

### Future Enhancements

Planned improvements for future releases:

- Integration with Supabase backend for data persistence
- React component library for enhanced interactivity
- Revit plugin for direct integration with design workflows
- Green Index and Lake Thread integration
- Expanded material database
- Regional pricing and VE recommendations

### Support and Feedback

For questions, issues, or feedback regarding this release:

- GitHub Issues: [https://github.com/sylviesuite/Block-Plane-Metric/issues](https://github.com/sylviesuite/Block-Plane-Metric/issues)
- Documentation: See `README.md` and `DEPLOYMENT.md`

---

**Release Date:** October 4, 2025  
**Version:** 2.8  
**Status:** Production Ready
