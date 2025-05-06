# 🌍 Block Plane Metric

**Block Plane** is a professional-grade sustainability tool built to empower designers, builders, and architects with data-driven insights for low-impact construction. It calculates Lifecycle Impact Scores (LIS), Regenerative Impact Scores (RIS), and visualizes embodied energy, carbon, and material cost-to-impact ratios—all in one platform.

---

## 📊 What It Does

- **Embodied Energy & CO₂ Emissions (EII)**  
  Combines energy intensity, transport, construction energy, and lifecycle CO₂.

- **Lifecycle Impact Score (LIS)**  
  Aggregates carbon, transport, construction, and disposal phases.

- **Regenerative Impact Score (RIS)**  
  Evaluates performance across carbon, durability, health, and circularity.

- **Material Comparison**  
  Side-by-side visualization of impact + cost for better material choices.

- **Alternatives Engine**  
  AI-suggested materials with a lower environmental footprint.

- **Permitting & Planning Reports**  
  Export project summaries as PDF or CSV.

---

## 🛠 Technologies Used

| Layer      | Stack                          |
|------------|-------------------------------|
| Frontend   | Lovable                        |
| Backend    | SupaStack                      |
| AI Assist  | ChatGPT + Claude (cross-checking) |
| Deployment | Netlify (target platform)      |

---

## 📐 Core Metrics

| Metric | Description |
|--------|-------------|
| `EII`  | Embodied Energy + CO₂ Emissions |
| `LIS`  | Lifecycle Impact Score: carbon, transport, construction, disposal |
| `RIS`  | Regenerative Impact Score: carbon, durability, health, circularity |
| `CPI`  | Cost per Unit of Impact |

---

## 📦 MVP Features

- Material database with lifecycle phase visualizations  
- Horizontal bar charts showing environmental phase impacts  
- AI-generated takeaways and sustainability insights  
- Price visibility and Cost-Per-Impact (CPI) comparisons  
- **BlockPlane Navigator**: Beta-ready public-facing assistant

---

## 📈 Roadmap

| Milestone                        | Status       |
|----------------------------------|--------------|
| MVP Finalization                 | ✅ Q1 2025    |
| Beta Testing (Great Lakes)       | 🧪 In Progress |
| Public Launch (MI/MN/NY)         | 🌐 Phase 1    |
| Revit Plugin (Internal Use)      | 🔌 Planned    |
| Green Index + Lake Thread Integration | 🏗 Phase 2    |

---

## 💬 How to Use

To run locally:

```bash
git clone https://github.com/sylviesuite/Block-Plane-Metric.git
cd Block-Plane-Metric
npm install
npm run dev
