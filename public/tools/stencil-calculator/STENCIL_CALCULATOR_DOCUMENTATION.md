# Tattoo Stencil Sizing, Placement & Cost Calculator

## Documentation v1.0

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Who Is This Tool For?](#who-is-this-tool-for)
3. [Key Features](#key-features)
4. [How to Use Each Tab](#how-to-use-each-tab)
5. [Understanding the Calculations](#understanding-the-calculations)
6. [Currency Converter](#currency-converter)
7. [Best Practices](#best-practices)
8. [Technical Specifications](#technical-specifications)
9. [Frequently Asked Questions](#frequently-asked-questions)

---

## Overview

The **Tattoo Stencil Sizing, Placement & Cost Calculator** is a professional tool designed to help tattoo clients and artists accurately plan tattoo projects. It combines stencil sizing calculations, body placement analysis, project templates, and cost estimation into one comprehensive calculator.

### Purpose

This tool solves four critical challenges in tattoo planning:

1. **Body Curvature Compensation**: Calculates how much larger to print stencils so they fit perfectly when applied to curved body parts
2. **Placement Verification**: Checks if a design will fit a body part without excessive wrapping or distortion
3. **Project Planning**: Provides pre-built templates for common large-scale tattoo projects (sleeves, back pieces, etc.)
4. **Cost Estimation**: Helps clients budget for multi-session tattoo projects

---

## Who Is This Tool For?

### Primary Users: **Tattoo Clients**

This tool is primarily designed for **clients planning to get tattooed**. It helps you:
- Understand how your design will fit your body
- Plan and budget for large tattoo projects
- Communicate more effectively with your tattoo artist
- Make informed decisions about sizing and placement

### Secondary Users: **Tattoo Artists**

Artists can use this tool to:
- Quickly calculate proper stencil sizes for different body parts
- Show clients realistic project timelines and costs
- Plan multi-session projects systematically
- Reference body part curvature data

---

## Key Features

### 🎯 4 Integrated Calculators

1. **Curvature Calculator** - Compensates for body part curvature when printing stencils
2. **Placement Guide** - Verifies design fit on specific body parts
3. **Template Library** - 15+ pre-built project templates with session breakdowns
4. **Multi-Session Planner** - Complete timeline and cost estimation for large projects

### 💱 Multi-Currency Support

- **USD** (US Dollar) - Default
- **EUR** (Euro)
- **GBP** (British Pound)

Exchange rates update automatically using live market data (updated daily via Frankfurter API).

### 📊 Comprehensive Database

- **50+ Body Parts** with curvature data
- **15+ Project Templates** (sleeves, back pieces, chest, legs, etc.)
- **Placement Guidelines** for each body part
- **Session Planning** with healing time recommendations

---

## How to Use Each Tab

### Tab 1: Curvature Calculator

**Purpose**: Calculate the correct stencil size to compensate for body curvature.

**When to Use**:
- Before printing a stencil for application
- When planning a tattoo on a curved body part (arms, legs, ribs, etc.)

**How to Use**:

1. **Enter Design Dimensions**
   - Input your desired final tattoo size (how it should look ON the skin)
   - Measurements in centimeters

2. **Select Body Part**
   - Choose from 50+ body parts organized by category:
     - Arms (upper arm, forearm, wrist, sleeves)
     - Legs (thigh, calf, ankle, leg sleeves)
     - Torso (chest, ribs, back, shoulder)
     - Neck & Head
     - Hands & Feet

3. **Choose Orientation**
   - **Vertical**: Design runs up/down the body
   - **Horizontal**: Design runs side to side
   - **Wraparound**: Design wraps around the body part

4. **Click "Calculate"**

**Results Explained**:

- **Stencil Size**: The exact size to print your stencil
- **Print Percentage**: The scale setting for your printer (e.g., "115%" means print at 115% of original size)
- **Curvature Factor**: The mathematical compensation applied (typically 1.12x - 1.30x)
- **Fit Check**: Whether the design will fit the body part without excessive wrapping
- **Placement Notes**: Professional tips for that specific body part

**Example**:
```
Desired Tattoo Size: 15cm × 20cm
Body Part: Outer Upper Arm
Orientation: Vertical

Results:
→ Stencil Size: 17.3cm × 23cm
→ Print at: 115% scale
→ Curvature Factor: 1.15x
→ ✅ Design fits well! Uses 52% of circumference
```

---

### Tab 2: Placement Guide

**Purpose**: Check if your design will fit a body part and how much it will wrap around.

**When to Use**:
- Verifying a design size before committing
- Understanding how much a tattoo will wrap around a body part
- Comparing different body part options

**How to Use**:

1. **Enter Design Width** (in cm)
2. **Select Body Part**
3. **Adjust Wrap Percentage Slider** (25%-100%)
   - Shows how much of the body part circumference your design uses
4. **Click "Check Fit & Placement"**

**Results Explained**:

- **✅ Green**: Design fits well (< 50% wrap)
- **⚠️ Yellow**: Significant wrapping (50%-100% wrap) - expect some distortion
- **❌ Red**: Design too large (> 100% wrap) - will not fit properly

**Recommendations**:
- **Under 50% wrap**: Ideal - minimal distortion
- **50-70% wrap**: Acceptable - moderate distortion, consider curvature carefully
- **70-100% wrap**: Significant distortion - requires skilled artist
- **Over 100%**: Design is too large for the body part

---

### Tab 3: Template Library

**Purpose**: Browse pre-built templates for common large tattoo projects.

**When to Use**:
- Planning a sleeve, back piece, or other large project
- Understanding typical project scope and timeline
- Estimating costs for common tattoo types

**Available Templates** (15 total):

**Sleeve Templates**:
- Traditional Half Sleeve (3 sessions, ~13 hours)
- Japanese Full Sleeve (6 sessions, ~28 hours)
- Forearm Sleeve (2 sessions, ~8 hours)

**Back Piece Templates**:
- Full Back Piece (8 sessions, ~38 hours)
- Upper Back Panel (2 sessions, ~9 hours)
- Lower Back Piece (2 sessions, ~7 hours)

**Other Templates**:
- Chest Panel (3 sessions, ~13 hours)
- Thigh Panel (3 sessions, ~14 hours)
- Full Leg Sleeve (8 sessions, ~38 hours)
- Rib Panel (3 sessions, ~11 hours)
- And more...

**Each Template Shows**:
- Estimated dimensions
- Number of sessions required
- Total hours
- Session-by-session breakdown
- Difficulty level (beginner, intermediate, advanced)
- Cost estimation
- Timeline with healing periods
- Professional notes and tips

**How to Use**:

1. **Filter by Category** (optional)
   - Sleeves
   - Back pieces
   - Legs
   - Chest
   - Standalone pieces

2. **Browse Templates**
   - Each card shows key information

3. **Click "View Full Details"**
   - Opens complete breakdown
   - Shows session plan
   - Displays timeline
   - Calculates costs

---

### Tab 4: Multi-Session Planner

**Purpose**: Plan large tattoo projects across multiple sessions with accurate timelines and cost estimates.

**When to Use**:
- Budgeting for a large tattoo project
- Understanding project timeline
- Planning session dates around healing periods

**How to Use**:

1. **Select Project Template**
   - Choose from 15+ project types (sleeves, back pieces, etc.)

2. **Weeks Between Sessions**
   - Default: 4 weeks (typical healing time)
   - Range: 2-12 weeks
   - Recommendation: 4-6 weeks for proper healing

3. **Hourly Rate**
   - Enter your artist's rate per hour
   - Default: $150/hour
   - Range: $50-500/hour
   - Varies by artist skill, location, and reputation

4. **Click "Generate Session Plan"**

**Results Include**:

- **Total Sessions**: Number of appointments needed
- **Total Hours**: Complete project time
- **Project Duration**: Timeline in weeks (including healing)
- **Total Cost Range**: Min-max cost estimate in your selected currency

**Session Breakdown Shows**:
- Session number
- What will be tattooed (e.g., "Outline entire sleeve", "Shading and color")
- Hours per session
- Week number
- Cost per session
- Healing recommendations

**Example Output**:
```
Project: Traditional Half Sleeve
Hourly Rate: $150
Healing Time: 4 weeks between sessions

Results:
→ 3 Sessions
→ 13 Total Hours
→ ~14 Week Timeline
→ $1,950 - $2,600 Total Cost

Session 1 (Week 0):
  Outline entire sleeve - 4 hours - $600
  Allow 4 weeks healing before next session

Session 2 (Week 4):
  Shading and color (outer) - 5 hours - $750
  Allow 4 weeks healing before next session

Session 3 (Week 8):
  Shading and color (inner), touch-ups - 4 hours - $600
  Final session - follow aftercare for 4-6 weeks
```

---

## Understanding the Calculations

### Curvature Compensation

**Why It's Needed**:
When a flat stencil is applied to a curved surface (like an arm or leg), it compresses. If you print the stencil at the size you want the final tattoo to be, it will end up smaller once applied.

**How We Calculate It**:

Each body part has a **curvature factor** based on:
- Average circumference
- Degree of curvature
- Typical wrapping

**Formula**:
```
Stencil Size = Design Size × Curvature Factor
```

**Curvature Factors by Body Part** (examples):

| Body Part | Factor | Reason |
|-----------|--------|--------|
| Outer Forearm | 1.12x | Relatively flat surface |
| Outer Upper Arm | 1.15x | Moderate curvature |
| Ribs | 1.25x | Extreme curvature, wraps significantly |
| Fingers | 1.30x | Very small, high curvature |
| Upper Back | 1.12x | Flat canvas |

**Orientation Adjustments**:
- **Wraparound**: +10% additional compensation
- **Horizontal**: +5% additional compensation
- **Vertical**: Base compensation only

---

### Placement Fit Checking

**Wrap Percentage Formula**:
```
Wrap % = (Design Width / Body Part Circumference) × 100
```

**Interpretation**:
- **< 50%**: ✅ Fits comfortably, minimal distortion
- **50-70%**: ⚠️ Moderate wrap, design will curve significantly
- **70-100%**: ⚠️ Heavy wrap, expect substantial distortion
- **> 100%**: ❌ Does not fit, design too large

**Example**:
```
Design Width: 15cm
Body Part: Outer Upper Arm (circumference: 33cm)

Wrap % = (15 / 33) × 100 = 45.5%
Result: ✅ Fits well! Uses 45.5% of circumference
```

---

### Cost Estimation

**Important**: Cost estimates are for CLIENT BUDGETING purposes. They represent what a client should expect to pay their tattoo artist.

**Cost Formula**:
```
Total Cost = Total Hours × Hourly Rate
Cost Range = (Hours × Rate) to (Hours × (Rate + $50))
```

The range accounts for:
- Complexity variations
- Additional detail work
- Touch-ups
- Uncertainty in exact timing

**Per-Session Costs**:
Each session cost is calculated individually:
```
Session Cost = Session Hours × Hourly Rate
```

**Currency Conversion**:
- All costs calculated in USD first
- Converted to selected currency using live exchange rates
- Rates update daily via Frankfurter API

---

## Currency Converter

### Available Currencies

- 💵 **USD** (United States Dollar) - Default
- 💶 **EUR** (Euro)
- 💷 **GBP** (British Pound Sterling)

### How It Works

1. **Live Exchange Rates**
   - Fetched from [Frankfurter API](https://www.frankfurter.app/) (free, reliable)
   - Updates automatically every 24 hours
   - No API key required

2. **Conversion Process**
   - All costs calculated in USD first
   - Converted to selected currency in real-time
   - Rates updated daily for accuracy

3. **Saved Preference**
   - Your currency selection is saved locally
   - Automatically applied on next visit

### Using the Currency Selector

1. **Location**: Top right of the header (next to Free Embed button)
2. **How to Change**:
   - Click the dropdown
   - Select USD, EUR, or GBP
   - All costs update immediately
3. **What Updates**:
   - Multi-session planner costs
   - Template library cost estimates
   - All currency displays throughout the tool

### Exchange Rate Information

**Default Rates** (fallback if API unavailable):
- 1 USD = 0.92 EUR
- 1 USD = 0.79 GBP

**Live Rates**: Updated daily from market data

**Note**: Exchange rates are approximate. Final costs may vary based on payment processing fees or artist preference.

---

## Best Practices

### For Clients

1. **Plan Ahead**
   - Use the multi-session planner to budget 4-6 months before starting
   - Account for healing time between sessions (typically 4 weeks minimum)

2. **Communicate with Your Artist**
   - Show them the stencil size calculations
   - Discuss the project timeline
   - Confirm their hourly rate for accurate cost estimates

3. **Allow Buffer in Budget**
   - Cost estimates are ranges - prepare for the higher end
   - Additional touch-ups may be needed
   - Some projects take longer than estimated

4. **Healing is Non-Negotiable**
   - Don't rush between sessions
   - Minimum 4 weeks healing for most areas
   - Ribs, chest, and other sensitive areas may need longer

5. **Body Changes Affect Fit**
   - Significant weight gain/loss will affect sizing
   - Muscle development can change placement
   - Discuss long-term considerations with your artist

### For Artists

1. **Stencil Sizing**
   - Use curvature calculator for complex placements
   - Always test stencil placement before application
   - Adjust for individual body variations

2. **Project Planning**
   - Show clients the multi-session planner during consultations
   - Set realistic expectations for timeline
   - Build in buffer time for complex projects

3. **Cost Communication**
   - Be upfront about hourly rates
   - Explain why some areas take longer
   - Clarify what's included in the quoted price

4. **Documentation**
   - Use this tool to create written project plans
   - Keep records of planned vs. actual session times
   - Adjust future estimates based on experience

### General Tips

1. **Body Part Selection**
   - Flatter areas (back, outer forearm) = less distortion
   - High-curvature areas (ribs, fingers) = more challenging
   - Consider pain tolerance for session length

2. **Design Considerations**
   - Fine-line work: Requires flatter placement
   - Bold traditional: More forgiving on curved areas
   - Geometric/symmetrical: Needs precise placement

3. **Timeline Planning**
   - Large projects typically take 6-18 months
   - Plan around major life events (weddings, vacations)
   - Some artists book 3-6 months in advance

4. **Budget Wisely**
   - Quality work isn't cheap
   - Factor in aftercare products ($20-50)
   - Plan for potential touch-ups

---

## Technical Specifications

### Body Part Database

- **Total Body Parts**: 50+
- **Categories**: 5 (Arms, Legs, Torso, Neck & Head, Hands & Feet)
- **Data Points per Body Part**:
  - Curvature factor (1.12x - 1.30x)
  - Average circumference (cm)
  - Wrap threshold (%)
  - Placement notes
  - Recommended orientations

### Project Templates

- **Total Templates**: 15
- **Categories**: Sleeves, Back pieces, Chest, Legs, Standalone
- **Complexity Levels**: Beginner, Intermediate, Advanced
- **Session Range**: 1-8 sessions per template
- **Hour Range**: 2-38 hours total per template

### Calculation Accuracy

- **Curvature Factors**: Based on anatomical averages
- **Individual Variation**: ±10% from averages
- **Cost Estimates**: ±20% accuracy range
- **Timeline Estimates**: Based on typical artist speed

### Currency Exchange

- **API**: Frankfurter.app (ECB data)
- **Update Frequency**: Every 24 hours
- **Supported Currencies**: USD, EUR, GBP
- **Fallback Rates**: Built-in defaults if API unavailable

---

## Frequently Asked Questions

### About the Tool

**Q: Is this tool free?**
A: Yes! Completely free for everyone. Use it as many times as you need.

**Q: Can I embed this on my website?**
A: Yes! Click the "Free Embed" button in the header for the embed code.

**Q: Do I need to create an account?**
A: No. The tool works without any registration.

**Q: Does this work on mobile?**
A: Yes! Fully responsive and works on all devices.

---

### About Sizing & Placement

**Q: Why do I need to make the stencil bigger?**
A: Body parts are curved. A flat stencil compresses when applied to a curve, making the design smaller. By printing it larger, it ends up the correct size after application.

**Q: What if my body part is different from the average?**
A: The tool uses anatomical averages. Discuss with your artist if you have significantly different measurements.

**Q: Can I use this for very small tattoos?**
A: Yes, but curvature compensation is less critical for small designs (< 5cm). It's most important for large pieces.

**Q: What if my design wraps more than 100%?**
A: The design is too large for that body part. Either reduce the size or choose a larger body part.

---

### About Costs

**Q: Are these costs what I'll actually pay?**
A: These are estimates for budgeting. Final costs depend on your specific artist, location, design complexity, and actual time taken.

**Q: Why is there a cost range?**
A: Projects rarely take exactly the estimated time. The range accounts for complexity variations, breaks, touch-ups, and uncertainty.

**Q: What should I expect to pay for a sleeve?**
A: A full sleeve typically costs $3,000-$8,000 depending on detail, color, artist reputation, and location. Use the multi-session planner with your artist's specific rate for accurate estimates.

**Q: Does this include tip?**
A: No. Tips (typically 15-20%) are additional. Always tip your artist!

**Q: What about touch-ups?**
A: Many artists include one free touch-up session (typically 6-8 weeks after completion). Additional touch-ups may cost extra.

---

### About Project Planning

**Q: How long should I wait between sessions?**
A: Minimum 4 weeks for most body parts. Some areas (ribs, chest, hands, feet) may need 6+ weeks. Always follow your artist's and doctor's advice.

**Q: Can I do sessions closer together?**
A: Not recommended. Proper healing is essential for the final result and your health. Rushing can cause scarring, poor color retention, and health complications.

**Q: How long does a full sleeve take?**
A: Typically 6-12 months including healing time. A full sleeve usually requires 6-8 sessions with 4-6 weeks between each.

**Q: Can I split a project across different artists?**
A: Technically yes, but not recommended. Different artists have different styles and techniques. Best results come from one artist completing the entire project.

---

### About the Currency Converter

**Q: How accurate are the exchange rates?**
A: Very accurate - they're updated daily from live market data (European Central Bank via Frankfurter API).

**Q: Can I add more currencies?**
A: Currently limited to USD, EUR, and GBP. These cover the majority of tattoo markets globally.

**Q: What if the API is down?**
A: The tool has fallback exchange rates built-in, so it always works even if the API is unavailable.

**Q: Will prices in different currencies be exactly what I pay?**
A: Exchange rates are accurate, but payment processing fees and artist preferences may affect the final amount. Always confirm with your artist.

---

## Support & Feedback

### Found an Issue?

If you encounter any problems or have suggestions for improvement:

**Email**: patrick@poli-international.com

**Feedback Form**: Available at the bottom of the calculator

### Feature Requests

We're always improving! Let us know if you'd like to see:
- Additional body parts
- More project templates
- Different currency options
- Other calculations or features

---

## Credits

**Developed by**: Poli International
**Version**: 1.0
**Last Updated**: January 2025
**Exchange Rate Data**: Frankfurter API (ECB data)
**License**: Free for personal and commercial use

---

## Disclaimer

This tool provides estimates and calculations based on anatomical averages and industry standards. Actual results may vary based on individual body characteristics, artist technique, design complexity, and other factors.

**This tool does NOT replace**:
- Professional artist consultation
- Custom measurements
- Individual assessment
- Medical advice regarding healing

Always consult with a professional, licensed tattoo artist for final planning and execution of your tattoo project.

---

**🎨 Thank you for using the Poli International Tattoo Stencil Sizing, Placement & Cost Calculator!**

*Building better tools for the body art community, together.* 💜
