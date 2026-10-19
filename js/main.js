/**
 * AutoLearnAR — Clean Academic Interactive Handlers
 * Handles Milestones assessment dropdown and Contact email form.
 */

document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // 1. Milestones Assessment Dropdown
  // ==========================================
  const sel = document.getElementById("ms");
  const out = document.getElementById("msout");

  if (sel && out) {
    const milestonesData = [
      {
        title: "Project Proposal",
        date: "March 2026",
        marks: "6%",
        status: "Completed",
        statusClass: "badge-done",
        deliverables: "Project Charter, Research Proposal Report, and Initial Concept Defense",
        scope: "Formulation of research problem in automotive vocational training, preliminary literature survey, identifying research gaps in offline on-device AR guidance, and establishing feasibility on low-cost hardware (Redmi 9C)."
      },
      {
        title: "Progress Presentation 1 (PP1)",
        date: "May 2026",
        marks: "15%",
        status: "Completed",
        statusClass: "badge-done",
        deliverables: "Component 50% Prototype Demonstration, Dataset Collection & MobileNetV2 Training",
        scope: "Demonstrated early markerless component recognition under variable lighting, designed JSON task workflow schemas, formulated 3D AR projection pipelines, and set up dynamic scoring metrics."
      },
      {
        title: "Progress Presentation 2 (PP2)",
        date: "August 2026",
        marks: "18%",
        status: "Completed",
        statusClass: "badge-done",
        deliverables: "90% System Implementation, End-to-End Inter-Component Data Contract Testing",
        scope: "Integrated all four subsystems via Android Jetpack Compose and local state controllers. Successfully ran real-time 3-second hold loops, safety violation triggers (~120ms), and automated scoring on a physical Suzuki Alto 800L."
      },
      {
        title: "Final Assessment & Demonstration",
        date: "October 2026",
        marks: "45% (25% Demo + 20% Report)",
        status: "Completed",
        statusClass: "badge-done",
        deliverables: "Full Physical System Demonstration, Common Integrated Solution Report, 4 Individual Theses",
        scope: "End-to-end evaluation against certified automobile instructors (89% score correlation), validated 26–30 FPS AR rendering on device, SUS benchmark evaluation (76.5 score), and full thesis submissions."
      },
      {
        title: "Viva Voce Examination",
        date: "November 2026",
        marks: "16%",
        status: "Scheduled",
        statusClass: "badge-progress",
        deliverables: "Individual Oral Defense, System Architecture Scrutiny & Research Validation",
        scope: "Individual oral assessment before external academic and industry examination panels, defending theoretical contributions, algorithms, quantization optimizations, and real-world deployment viability."
      }
    ];

    // Populate dropdown options
    sel.innerHTML = "";
    milestonesData.forEach(function (item, index) {
      const opt = document.createElement("option");
      opt.value = index;
      opt.textContent = `${item.title} — ${item.marks} (${item.date})`;
      sel.appendChild(opt);
    });

    function renderMilestone(index) {
      const m = milestonesData[index];
      out.innerHTML = `
        <div class="ms-header">
          <div>
            <div class="ms-title">${m.title}</div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.15rem;">
              SLIIT Comprehensive Design & Analysis Project (CDAP)
            </div>
          </div>
          <div>
            <span class="badge ${m.statusClass}">${m.status}</span>
          </div>
        </div>

        <div class="ms-grid">
          <div class="ms-item">
            <dt>Assessment Date</dt>
            <dd>${m.date}</dd>
          </div>
          <div class="ms-item">
            <dt>Marks Allocated</dt>
            <dd style="color: var(--color-primary);">${m.marks}</dd>
          </div>
          <div class="ms-item">
            <dt>Key Deliverables</dt>
            <dd>${m.deliverables}</dd>
          </div>
        </div>

        <div style="border-top: 1px solid var(--border-subtle); padding-top: 0.85rem; margin-top: 0.5rem;">
          <div style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; letter-spacing: 0.04em; margin-bottom: 0.25rem;">
            Evaluation Scope & Key Achievements
          </div>
          <div class="ms-desc">${m.scope}</div>
        </div>
      `;
    }

    sel.addEventListener("change", function () {
      renderMilestone(parseInt(sel.value, 10));
    });

    // Initial render
    renderMilestone(0);
  }

  // ==========================================
  // 2. Academic Contact Form Handler
  // ==========================================
  const sendBtn = document.getElementById("send");
  if (sendBtn) {
    sendBtn.addEventListener("click", function () {
      const name = document.getElementById("n") ? document.getElementById("n").value.trim() : "";
      const subject = document.getElementById("s") ? document.getElementById("s").value.trim() : "AutoLearnAR Research Inquiry";
      const message = document.getElementById("m") ? document.getElementById("m").value.trim() : "";
      const fullBody = `${message}\n\n---\nSender Name: ${name || "Visitor"}\nSent via AutoLearnAR Research Portal`;

      const mailtoUrl = `mailto:autolearnar.cdap@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;
      window.location.href = mailtoUrl;
    });
  }
});
