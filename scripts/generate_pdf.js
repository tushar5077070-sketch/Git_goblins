import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function generatePDF() {
  const pdfDoc = await PDFDocument.create();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // 16:9 Landscape Dimensions: 960 x 540 pt
  const width = 960;
  const height = 540;

  // Colors
  const bgDark = rgb(15 / 255, 23 / 255, 42 / 255);       // #0f172a
  const cardBg = rgb(30 / 255, 41 / 255, 59 / 255);       // #1e293b
  const cardBorder = rgb(51 / 255, 65 / 255, 85 / 255);   // #334155
  const cyanGlow = rgb(6 / 255, 182 / 255, 212 / 255);    // #06b6d4
  const purpleGlow = rgb(168 / 255, 85 / 255, 247 / 255); // #a855f7
  const amberGlow = rgb(245 / 255, 158 / 255, 11 / 255);  // #f59e0b
  const emeraldGlow = rgb(16 / 255, 185 / 255, 129 / 255);// #10b981
  const textWhite = rgb(248 / 255, 250 / 255, 252 / 255); // #f8fafc
  const textMuted = rgb(148 / 255, 163 / 255, 184 / 255); // #94a3b8
  const textCyan = rgb(56 / 255, 189 / 255, 248 / 255);   // #38bdf8
  const amber = rgb(251 / 255, 191 / 255, 36 / 255);      // #fbbf24

  const slides = [
    {
      title: "The Crystal Village: Educational Coding Adventure",
      subtitle: "Mastering Python, Web Development, and Git & GitHub Through Narrative Gaming",
      tag: "VISION & OVERVIEW",
      bullets: [
        "A gamified learning universe transforming computer science education from passive reading into active exploration.",
        "Comprehensive Tri-Track Curriculum: Full foundational mastery across Python, Web Development, and Git & GitHub.",
        "Peaceful Mentor System: District Masters deliver interactive video lessons and dynamic visual architectural simulations.",
        "Knowledge-Based Monster Duels: Players banish Glitch Fiends by answering scenario-based programming challenges.",
        "Full-featured RPG Mechanics: Custom character studio, in-game Codex, exploration shards, and an infinite Trials Arena."
      ],
      speakerNotes: "Welcome everyone. The Crystal Village bridges the gap between theoretical syntax and applied engineering intuition across three core pillars of modern computing: Python, Web Development, and Git version control."
    },
    {
      title: "The Problem in Computer Science Education",
      subtitle: "Why Traditional Tutorials and Rote Syntax Drills Lead to Dropouts",
      tag: "PEDAGOGICAL CHALLENGE",
      bullets: [
        "Syntax Fatigue: Beginners drown in language rules without understanding how code executes or connects to real projects.",
        "The Isolated Silo Trap: Teaching languages in isolation ignores how Python backends, Web frontends, and Git workflows coalesce.",
        "Fear of Breaking Things: Students develop acute anxiety around terminal errors, broken CSS layouts, and Git merge conflicts.",
        "Low Retention Rates: Non-interactive video tutorials and text documentation yield under 20% knowledge retention after one week.",
        "Our Mission: Replace intimidation with gamified psychological safety, where bugs are monsters to conquer and concepts are magic spells."
      ],
      speakerNotes: "Beginners don't struggle because code is inherently impossible; they struggle because traditional education isolates concepts and punishes failure. We turn debugging and conceptual hurdles into rewarding gameplay victories."
    },
    {
      title: "The Tri-Track Curriculum Architecture",
      subtitle: "Three Interconnected Realms of Modern Software Engineering",
      tag: "CURRICULUM OVERVIEW",
      bullets: [
        "Track 1 - Python (The Serpent Spires): From dynamic typing and flow control to data structures and Object-Oriented Programming.",
        "Track 2 - Web Development (The World Wide Archipelago): Semantic HTML5 architecture, modern CSS3 Flexbox/Grid, and interactive JavaScript DOM.",
        "Track 3 - Git & GitHub (The Repository Spires): Three Trees mental model, branch isolation, remote synchronization, and conflict resolution.",
        "Cross-Disciplinary Synergy: Students understand how frontends communicate with Python scripts, all versioned cleanly in Git repositories.",
        "Selectable at Will: Players can freely switch between subjects at the Academy Hub while tracking independent subject progress."
      ],
      speakerNotes: "Rather than treating Python, Web, and Git as three separate classes, The Crystal Village presents them as three realms of one grand digital world. A developer needs all three to be career-ready."
    },
    {
      title: "Curriculum Track 1: Python — The Serpent Spires",
      subtitle: "Foundational Logic, Algorithmic Thinking, and Object-Oriented Mastery",
      tag: "CURRICULUM - PYTHON",
      bullets: [
        "Realm Lore: Guided by Grandmaster Guido, students explore the sun-drenched oasis and algorithmic groves.",
        "Core Concepts Taught: Variables, dynamic typing, truthiness, conditional branching (if/elif/else), and while/for loops.",
        "Data Structures & Scope: Python lists, tuples, sets, hash dictionaries, and pure vs. stateful functions.",
        "Object-Oriented Programming: Class constructors (__init__), instance methods, attributes, and inheritance hierarchies.",
        "Climactic Boss Encounter: The GIL Leviathan - defeated by chaining modular functions and efficient data handling."
      ],
      speakerNotes: "In the Python track, students build algorithmic confidence. They learn not just how to write a loop, but how to choose the right data structure and write clean, readable Pythonic code."
    },
    {
      title: "Curriculum Track 2: Web Development — Frontend Bastion",
      subtitle: "Semantic HTML5, Responsive CSS Layouts, and JavaScript Interactivity",
      tag: "CURRICULUM - WEB DEV",
      bullets: [
        "Realm Lore: Guided by Grandmaster Tim & Cascade across the digital islands of the World Wide Archipelago.",
        "Semantic HTML5 & Accessibility: Document outlining, landmark tags (main, nav, article), forms, and ARIA accessibility standards.",
        "CSS3 Layouts & Responsive Design: The Box Model, Flexbox alignment, CSS Grid tracks, media queries, and fluid typography.",
        "Modern JavaScript DOM: Event bubbling, listeners, DOM tree manipulation, Promises, and asynchronous Fetch API calls.",
        "Climactic Boss Encounter: The Hydration Chimera - banished by synchronizing markup structure with dynamic JavaScript logic."
      ],
      speakerNotes: "The Web Development track gives learners immediate visual gratification. They learn how semantic HTML forms the skeleton, CSS provides the visual style, and JavaScript breathes life into the user interface."
    },
    {
      title: "Curriculum Track 3: Git & GitHub — Repository Spires",
      subtitle: "Version Control, Branch Pointers, Remotes, and Conflict Resolution",
      tag: "CURRICULUM - GIT & GITHUB",
      bullets: [
        "Realm Lore: Guided by Master Linus & Grandmaster Octocat within the ancient stone courtyards of the Repository Gate.",
        "The Three Trees Mental Model: Working Directory vs. Staging Area (git add) vs. Repository Commit Snapshots (git commit).",
        "Branching & The HEAD Pointer: Isolated experimentation, switching branches (git switch -c), and safe pointer manipulation.",
        "Remote Collaboration: Cloning, origin tracking, push/pull lifecycles, and diagnosing non-fast-forward push rejections.",
        "Merge Conflicts & Safe Time Travel: Resolving collision markers (<<<<<<< HEAD), pull requests, git stash, and non-destructive git revert."
      ],
      speakerNotes: "The Git track dismantles the fear of breaking code. Students visualize commits as an immutable snapshot graph, understanding exactly what occurs during merges, rebases, and remote pushes."
    },
    {
      title: "The Dual-Phase Learning Loop",
      subtitle: "Separating Stress-Free Mentorship from Active-Recall Testing",
      tag: "PEDAGOGICAL METHODOLOGY",
      bullets: [
        "Phase 1 - Exploration & Discovery: Walk through rich 2D districts, discovering Lore Stones and Knowledge Shards at player pace.",
        "Phase 2 - Peaceful Mentor Dialogue: Meet District Masters who explain engineering rationale before any test begins.",
        "Phase 3 - Interactive Visual Lessons: Watch animated architecture simulations (commit graphs, DOM trees, memory stacks) with scrubber controls.",
        "Phase 4 - Advance to the Roadblock: Walk forward along the path to confront corrupted Glitch Monsters guarding the gate.",
        "Phase 5 - Knowledge-Based Combat: Cast elemental code spells by correctly diagnosing code snippets; banishing the glitch unlocks the next zone."
      ],
      speakerNotes: "Notice how our gameplay loop strictly separates learning from testing. First comes psychological safety and mentorship; only then comes active recall in battle. If a student fails a duel, they can revisit the Master with zero penalty."
    },
    {
      title: "Gamification & Immersion Systems",
      subtitle: "Deep Player Agency and Engagement Architecture",
      tag: "GAME SYSTEMS",
      bullets: [
        "Custom Character Studio: Play as Lyra the Spellblade, Kael the Shadow Coder, Jax the Tech Paladin, or design custom avatars.",
        "The Living Ancient Codex: An automatic in-game encyclopedia recording all learned commands, syntax tips, and architectural diagrams.",
        "Exploration Shards & Lore: Hidden knowledge fragments reward curious players who explore off the beaten path.",
        "Synthesized Retro Audio Engine: Real-time procedural Web Audio API synthesizer generating music, hums, and victory fanfares.",
        "Multi-Subject Hub: Seamlessly switch between Python, Web Development, and Git tracks with preserved individual level progress."
      ],
      speakerNotes: "Gamification succeeds when it serves pedagogy. The Codex acts as a real-world reference manual, while customizable heroes and audio feedback sustain dopamine and intrinsic motivation."
    },
    {
      title: "Assessment & The 100-Answer Grand Milestone",
      subtitle: "Infinite Practice Arena and Cinematic Mastery Celebration",
      tag: "ASSESSMENT & RETENTION",
      bullets: [
        "The Hall of Trials: An infinite randomized practice arena drawing from a multi-disciplinary bank of 60+ programming scenarios.",
        "Broad Question Coverage: Edge cases, debugging exercises, syntax parsing, and architectural decision questions.",
        "Real-Time Analytics HUD: Live tracking of shards gathered, clues inspected, and total verified correct answers.",
        "The 100-Answer Milestone: Reaching 100 correct answers triggers an epic full-screen Grand Cinematic Awakening.",
        "Prestigious Honors: Players are awarded the permanent title: 'Grand Archon of the Crystal Academy'."
      ],
      speakerNotes: "For long-term retention, students need spaced repetition. The Hall of Trials provides endless practice, culminating in a celebration that makes reaching 100 correct answers feel like a monumental gaming triumph."
    },
    {
      title: "Technical Architecture & Future Horizons",
      subtitle: "High-Performance Modern Web Stack with Zero Overhead",
      tag: "ENGINEERING & ROADMAP",
      bullets: [
        "Modern Stack: React 19 + TypeScript + Vite delivering instantaneous UI reactivity and rock-solid type safety.",
        "Custom 2D Canvas Engine: 60 FPS pixel rendering with camera tracking, sprite animations, and particle ambient weather.",
        "Zero Asset Weight: Pure algorithmic Web Audio API synthesizer and Tailwind CSS v4 styling with zero external bundle bloat.",
        "Roadmap Expansion: Adding SQL & Databases Realm, Docker & Containerization Grove, and real-time multiplayer coding duels.",
        "Conclusion: The Crystal Village proves that computer science mastery can be thrilling, intuitive, and deeply empowering."
      ],
      speakerNotes: "Built with React 19 and HTML5 Canvas, the app runs smoothly on any device without plugins or downloads. We're laying the foundation for a complete educational gaming platform across all software disciplines. Thank you!"
    }
  ];

  function sanitizeText(str) {
    return str.replace(/[\u2018\u2019]/g, "'")
              .replace(/[\u201C\u201D]/g, '"')
              .replace(/[\u2013\u2014]/g, '-')
              .replace(/[^\x20-\x7E]/g, ' ');
  }

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const page = pdfDoc.addPage([width, height]);

    // 1. Background Fill
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: bgDark,
    });

    // 2. Top Accent Bar (Cycles colors: Cyan, Amber, Emerald, Purple)
    const accentColors = [cyanGlow, amberGlow, emeraldGlow, purpleGlow];
    const topAccent = accentColors[i % accentColors.length];

    page.drawRectangle({
      x: 0,
      y: height - 6,
      width,
      height: 6,
      color: topAccent,
    });

    // 3. Header Tag & Slide Counter
    page.drawText(sanitizeText(slide.tag), {
      x: 40,
      y: height - 36,
      size: 10,
      font: fontBold,
      color: topAccent,
    });

    const slideNumStr = `Slide ${i + 1} of ${slides.length}`;
    page.drawText(slideNumStr, {
      x: width - 130,
      y: height - 36,
      size: 10,
      font: fontBold,
      color: textMuted,
    });

    // 4. Slide Title
    page.drawText(sanitizeText(slide.title), {
      x: 40,
      y: height - 68,
      size: 21,
      font: fontBold,
      color: textWhite,
    });

    // 5. Slide Subtitle
    page.drawText(sanitizeText(slide.subtitle), {
      x: 40,
      y: height - 90,
      size: 12,
      font: fontItalic,
      color: textCyan,
    });

    // Divider line
    page.drawLine({
      start: { x: 40, y: height - 104 },
      end: { x: width - 40, y: height - 104 },
      thickness: 1,
      color: cardBorder,
    });

    // 6. Content Card (Main Bullets)
    const cardX = 40;
    const cardY = 110;
    const cardW = width - 80;
    const cardH = height - 230;

    page.drawRectangle({
      x: cardX,
      y: cardY,
      width: cardW,
      height: cardH,
      color: cardBg,
      borderColor: cardBorder,
      borderWidth: 1,
    });

    // Left accent strip on card
    page.drawRectangle({
      x: cardX,
      y: cardY,
      width: 4,
      height: cardH,
      color: topAccent,
    });

    // Draw bullet points
    let startY = cardY + cardH - 34;
    for (let b = 0; b < slide.bullets.length; b++) {
      const bulletText = sanitizeText(slide.bullets[b]);

      // Bullet marker
      page.drawRectangle({
        x: cardX + 22,
        y: startY + 2,
        width: 6,
        height: 6,
        color: topAccent,
      });

      // Word wrap bullet text
      const maxWidth = cardW - 70;
      const words = bulletText.split(' ');
      let currentLine = '';
      let lineY = startY;

      for (let w = 0; w < words.length; w++) {
        const testLine = currentLine ? `${currentLine} ${words[w]}` : words[w];
        const textWidth = fontRegular.widthOfTextAtSize(testLine, 12);

        if (textWidth > maxWidth && currentLine) {
          page.drawText(currentLine, {
            x: cardX + 38,
            y: lineY,
            size: 12,
            font: fontRegular,
            color: textWhite,
          });
          currentLine = words[w];
          lineY -= 17;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        page.drawText(currentLine, {
          x: cardX + 38,
          y: lineY,
          size: 12,
          font: fontRegular,
          color: textWhite,
        });
      }

      startY = lineY - 21;
    }

    // 7. Speaker Notes Card at the bottom
    const noteY = 24;
    const noteH = 68;
    page.drawRectangle({
      x: 40,
      y: noteY,
      width: cardW,
      height: noteH,
      color: rgb(10 / 255, 15 / 255, 30 / 255),
      borderColor: cardBorder,
      borderWidth: 1,
    });

    page.drawText("SPEAKER SCRIPT / PRESENTER NOTES:", {
      x: 54,
      y: noteY + noteH - 18,
      size: 8.5,
      font: fontBold,
      color: amber,
    });

    // Wrap speaker note
    const noteWords = sanitizeText(slide.speakerNotes).split(' ');
    let noteLine = '';
    let noteLineY = noteY + noteH - 34;
    for (let nw = 0; nw < noteWords.length; nw++) {
      const testNote = noteLine ? `${noteLine} ${noteWords[nw]}` : noteWords[nw];
      const noteWidth = fontItalic.widthOfTextAtSize(testNote, 9.5);
      if (noteWidth > cardW - 35 && noteLine) {
        page.drawText(noteLine, {
          x: 54,
          y: noteLineY,
          size: 9.5,
          font: fontItalic,
          color: textMuted,
        });
        noteLine = noteWords[nw];
        noteLineY -= 14;
      } else {
        noteLine = testNote;
      }
    }
    if (noteLine) {
      page.drawText(noteLine, {
        x: 54,
        y: noteLineY,
        size: 9.5,
        font: fontItalic,
        color: textMuted,
      });
    }
  }

  // Ensure output directory exists
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'The_Crystal_Village_Presentation.pdf');
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`Updated PDF successfully generated at: ${outputPath} (${pdfBytes.length} bytes)`);
}

generatePDF().catch(err => {
  console.error("Failed to generate PDF:", err);
  process.exit(1);
});
