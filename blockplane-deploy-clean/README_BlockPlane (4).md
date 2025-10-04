# 🧱 BlockPlane: Sustainable Building Impact Tool

**BlockPlane** is a professional-grade sustainability calculator designed to help architects, builders, and policy teams evaluate the environmental and lifecycle impacts of construction materials.

It uses standardized lifecycle phases, cross-checked AI scoring, and a clear visual interface to guide better building decisions.

---

## 🌍 Key Features

- 🔢 **Lifecycle Impact Score (LIS)** — Measures embodied energy, transport, construction, and disposal
- 🌱 **Regenerative Impact Score (RIS)** — Scores materials based on carbon storage, circularity, health, and recovery
- 💰 **Cost-Per-Impact (CPI)** — Links material cost to environmental footprint
- 🧠 **AI Assistant** *(coming soon)* — Claude + ChatGPT integrated for compliance, LIS/RIS explanation, and alternatives
- 📦 **Export Reports** — CSV + PDF downloads for permitting, clients, and documentation
- 📊 **Visual Dashboards** — Interactive bar charts, comparisons, and alternative material suggestions

---

## 🛣️ Roadmap

| Milestone                             | Status       |
|--------------------------------------|--------------|
| ✅ MVP Finalization                   | Q1 2025      |
| 🔧 Beta Testing (Great Lakes)        | In Progress  |
| 🌐 Public Launch (MI/MN/NY)          | Phase 1      |
| 🏗️ Revit Plugin (Internal Use)       | Planned      |
| 🔁 Green Index + Lake Thread Connect | Phase 2      |

---

## 📦 Folder Structure

```
/components       # Reusable UI components
/pages            # App routes (Next.js)
/api              # AI scoring endpoints
/styles           # Tailwind/custom styling
/utils            # Data handling + helpers
```

---

## 💻 How to Use

To run BlockPlane locally:

```bash
git clone https://github.com/sylviesuite/Block-Plane-Metric.git
cd Block-Plane-Metric
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env.local` file with:

```
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
```

> Never expose these keys in frontend code.

---

## 🧠 AI Integration (Coming Soon)

BlockPlane includes dual scoring using:
- **OpenAI GPT-4** — Fast LIS/RIS scoring + material comparisons
- **Anthropic Claude** — Regenerative analysis + compliance checks

These tools will support permitting pathways and reduce the burden on sustainability teams.

---

## 🤝 Contributions

We welcome feedback, issue reports, and ideas!  
For collaboration or testing inquiries, please contact us via [GitHub Issues](https://github.com/sylviesuite/blockplane-impact-vision/issues).

---

## 🪵 License

MIT License – Use freely with attribution.  
BlockPlane is part of the **Sylvie Metrics Suite**, committed to regenerative design and transparent environmental tools.
