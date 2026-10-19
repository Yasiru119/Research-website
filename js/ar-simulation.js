/**
 * AutoLearnAR — Clean Academic Demonstration Script
 * Simulates an iPhone orbiting in 3D around an automobile engine bay,
 * executing on-device computer vision detection, 3-second hold step verification,
 * and synchronizing with the Component 3 execution pipeline.
 */

(function () {
  const components = [
    {
      id: "air-filter",
      name: "Air Filter Housing",
      angle: 0.95, // radians on orbit
      targetX: 205,
      targetY: 125,
      confidence: "94.8%",
      stepText: "Task 2/4: Unclip housing & inspect paper element",
      hazard: false,
      hazardText: "Hazard Status: CLEAR &bull; Safe distance maintained"
    },
    {
      id: "battery",
      name: "12V Battery & Terminals",
      angle: 2.35,
      targetX: 335,
      targetY: 120,
      confidence: "97.2%",
      stepText: "Task 1/4: Verify negative terminal isolation",
      hazard: true,
      hazardText: "⚠️ HAZARD DETECTED: Disconnect black (-) terminal first!"
    },
    {
      id: "spark-plugs",
      name: "Spark Plug Wells (Cyl 1–3)",
      angle: 3.9,
      targetX: 270,
      targetY: 175,
      confidence: "92.4%",
      stepText: "Task 3/4: Check torque specification (25 Nm)",
      hazard: false,
      hazardText: "Hazard Status: CLEAR &bull; Thread alignment verified"
    },
    {
      id: "alternator",
      name: "Alternator & Serpentine Belt",
      angle: 5.35,
      targetX: 330,
      targetY: 220,
      confidence: "89.5%",
      stepText: "Task 4/4: Check belt tension deflection (8–10mm limit)",
      hazard: true,
      hazardText: "⚠️ PINCH POINT: Keep tools clear of rotating pulleys"
    }
  ];

  let currentAngle = 0.95;
  let isPlaying = true;
  let orbitSpeed = 0.007;
  let activeCompIndex = 0;
  let holdProgress = 0; // 0 to 100%

  // Elements
  let phoneElement = null;
  let beamElement = null;
  let targetMarker = null;

  let hudPart = null;
  let hudConf = null;
  let hudStep = null;
  let hudTimerText = null;
  let hudTimerBarFg = null;
  let hudHazard = null;

  let pipeSteps = [];

  function init() {
    phoneElement = document.getElementById("sim-phone-device");
    beamElement = document.getElementById("sim-ar-scan-beam");
    targetMarker = document.getElementById("sim-target-reticle");

    hudPart = document.getElementById("hud-part-name");
    hudConf = document.getElementById("hud-confidence");
    hudStep = document.getElementById("hud-step-title");
    hudTimerText = document.getElementById("hud-timer-sec");
    hudTimerBarFg = document.getElementById("hold-bar-fg");
    hudHazard = document.getElementById("hud-hazard-alert");

    pipeSteps = [
      document.getElementById("pipe-step-1"),
      document.getElementById("pipe-step-2"),
      document.getElementById("pipe-step-3a"),
      document.getElementById("pipe-step-3b"),
      document.getElementById("pipe-step-4"),
      document.getElementById("pipe-step-5")
    ];

    const playBtn = document.getElementById("sim-btn-play");
    if (playBtn) {
      playBtn.addEventListener("click", function () {
        isPlaying = !isPlaying;
        playBtn.textContent = isPlaying ? "⏸ Pause Orbit" : "▶ Resume Orbit";
      });
    }

    const speedBtn = document.getElementById("sim-btn-speed");
    if (speedBtn) {
      speedBtn.addEventListener("click", function () {
        if (orbitSpeed === 0.007) {
          orbitSpeed = 0.015;
          speedBtn.textContent = "⚡ Speed: 2x";
        } else {
          orbitSpeed = 0.007;
          speedBtn.textContent = "⏱ Speed: 1x";
        }
      });
    }

    const partBtns = document.querySelectorAll(".sim-part-btn");
    partBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const pId = btn.getAttribute("data-part");
        const idx = components.findIndex((c) => c.id === pId);
        if (idx !== -1) {
          activeCompIndex = idx;
          currentAngle = components[idx].angle;
          holdProgress = 0;
          updateActiveComponentUI();
          updateButtons(btn);
        }
      });
    });

    updateActiveComponentUI();
    requestAnimationFrame(renderLoop);
  }

  function updateButtons(activeBtn) {
    document.querySelectorAll(".sim-part-btn").forEach((b) => b.classList.remove("active"));
    if (activeBtn) activeBtn.classList.add("active");
  }

  function renderLoop() {
    if (isPlaying) {
      currentAngle += orbitSpeed;
      if (currentAngle > Math.PI * 2) {
        currentAngle -= Math.PI * 2;
      }
      findClosestComponent();
    }

    // Elliptical Orbit Geometry (Center at 270, 175)
    const centerX = 270;
    const centerY = 175;
    const radiusX = 195;
    const radiusY = 105;

    const phoneX = centerX + Math.cos(currentAngle) * radiusX;
    const phoneY = centerY + Math.sin(currentAngle) * radiusY;

    const comp = components[activeCompIndex];
    const dx = comp.targetX - phoneX;
    const dy = comp.targetY - phoneY;
    const phoneRotation = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

    if (phoneElement) {
      phoneElement.setAttribute("transform", `translate(${phoneX}, ${phoneY}) rotate(${phoneRotation})`);
    }

    if (beamElement) {
      const p1X = phoneX;
      const p1Y = phoneY;
      const spread = 22;
      const p2X = comp.targetX - spread;
      const p2Y = comp.targetY + spread * 0.4;
      const p3X = comp.targetX + spread;
      const p3Y = comp.targetY - spread * 0.4;

      beamElement.setAttribute("points", `${p1X},${p1Y} ${p2X},${p2Y} ${p3X},${p3Y}`);
    }

    if (targetMarker) {
      targetMarker.setAttribute("transform", `translate(${comp.targetX}, ${comp.targetY})`);
    }

    // 3-Second Hold loop progress increment
    let angleDiff = Math.abs(currentAngle - comp.angle);
    if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;

    if (angleDiff < 0.5) {
      holdProgress = Math.min(100, holdProgress + 1.1);
    } else {
      holdProgress = Math.max(0, holdProgress - 1.4);
    }

    updateHUD(comp);
    updatePipeline(holdProgress);

    requestAnimationFrame(renderLoop);
  }

  function findClosestComponent() {
    let minDiff = 999;
    let closestIdx = 0;
    components.forEach((c, idx) => {
      let diff = Math.abs(currentAngle - c.angle);
      if (diff > Math.PI) diff = Math.PI * 2 - diff;
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    if (closestIdx !== activeCompIndex) {
      activeCompIndex = closestIdx;
      holdProgress = 0;
      updateActiveComponentUI();
      const matchBtn = document.querySelector(`.sim-part-btn[data-part="${components[closestIdx].id}"]`);
      if (matchBtn) updateButtons(matchBtn);
    }
  }

  function updateActiveComponentUI() {
    const comp = components[activeCompIndex];
    if (hudPart) hudPart.textContent = comp.name;
    if (hudConf) hudConf.textContent = comp.confidence;
    if (hudStep) hudStep.textContent = comp.stepText;

    if (hudHazard) {
      if (comp.hazard) {
        hudHazard.innerHTML = `<span style="color:#ef4444; font-weight:700;">${comp.hazardText}</span>`;
      } else {
        hudHazard.innerHTML = `<span style="color:#10b981;">${comp.hazardText}</span>`;
      }
    }
  }

  function updateHUD(comp) {
    if (hudTimerBarFg) {
      hudTimerBarFg.style.width = `${holdProgress}%`;
    }

    if (hudTimerText) {
      if (holdProgress >= 98) {
        hudTimerText.innerHTML = "<span style='color:#10b981; font-weight:700;'>STEP VERIFIED ✓</span>";
      } else {
        const sec = (3.0 - (holdProgress / 100) * 3.0).toFixed(1);
        hudTimerText.textContent = `${sec}s hold`;
      }
    }
  }

  function updatePipeline(p) {
    function setStep(idx, active) {
      if (pipeSteps[idx]) {
        if (active) pipeSteps[idx].classList.add("active-node");
        else pipeSteps[idx].classList.remove("active-node");
      }
    }

    setStep(0, p >= 5);  // Camera & model
    setStep(1, p >= 25); // Prediction stream
    setStep(2, p >= 45); // Step match + hold
    setStep(3, p >= 45); // 3D to 2D projection
    setStep(4, p >= 70); // Canvas overlay + voice
    setStep(5, p >= 90); // Score inputs
  }

  document.addEventListener("DOMContentLoaded", init);
})();
