#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Root of mp-skills repo (where this CLI is located)
const REPO_ROOT = path.resolve(__dirname, "..");
const SKILLS_DIR = path.join(REPO_ROOT, "skills");
const PRESETS_FILE = path.join(REPO_ROOT, "presets.json");

// Current Working Directory (where the user is running the command)
const CWD = process.cwd();
const TARGET_AGENTS_SKILLS_DIR = path.join(CWD, ".agents", "skills");
const TARGET_CONFIG_FILE = path.join(CWD, "skills.json");

// Helper to locate a skill inside mp-skills/skills/ (handles nested category folders)
function findSkillSourceDir(skillName) {
  if (!fs.existsSync(SKILLS_DIR)) return null;

  function search(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const fullPath = path.join(dir, entry.name);
        if (
          entry.name === skillName &&
          fs.existsSync(path.join(fullPath, "SKILL.md"))
        ) {
          return fullPath;
        }
        const nested = search(fullPath);
        if (nested) return nested;
      }
    }
    return null;
  }

  return search(SKILLS_DIR);
}

// Helper to update skills.json in target project
function updateTargetSkillsJson(skillNames, presetName = null) {
  let config = { source: "haisenberg-creator/skills", skills: [] };
  if (fs.existsSync(TARGET_CONFIG_FILE)) {
    try {
      config = JSON.parse(fs.readFileSync(TARGET_CONFIG_FILE, "utf8"));
      if (!config.source) config.source = "haisenberg-creator/skills";
      if (!Array.isArray(config.skills)) config.skills = [];
    } catch (e) {
      console.warn(
        `Warning: Could not parse existing skills.json. Overwriting format.`
      );
    }
  }

  if (presetName) {
    config.preset = presetName;
  }

  for (const name of skillNames) {
    if (!config.skills.includes(name)) {
      config.skills.push(name);
    }
  }

  fs.writeFileSync(TARGET_CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");
}

// Install a single skill by name
function installSkill(skillName) {
  const sourcePath = findSkillSourceDir(skillName);
  if (!sourcePath) {
    console.error(`❌ Skill "${skillName}" not found in mp-skills repo.`);
    return false;
  }

  const destPath = path.join(TARGET_AGENTS_SKILLS_DIR, skillName);
  fs.mkdirSync(destPath, { recursive: true });
  fs.cpSync(sourcePath, destPath, { recursive: true });

  console.log(
    `✅ Installed skill "${skillName}" -> .agents/skills/${skillName}`
  );
  return true;
}

// CLI Command implementations
const args = process.argv.slice(2);
const command = args[0];

if (
  !command ||
  command === "help" ||
  command === "--help" ||
  command === "-h"
) {
  console.log(`
Usage: my-skills <command> [options]

Commands:
  add <skill1> [skill2...]    Install specified skill(s) into current project (.agents/skills)
  init [--preset <name>]      Initialize skills based on a preset bundle or skills.json
  update [--preset <name>]    Update all installed skills and sync preset changes
  list                        List all available skills in the master repository
  help                        Show this help message
  `);
  process.exit(0);
}

if (command === "add") {
  const skillsToAdd = args.slice(1);
  if (skillsToAdd.length === 0) {
    console.error(
      "Error: Please specify at least one skill name to add. Example: my-skills add ask-matt tdd"
    );
    process.exit(1);
  }

  const installed = [];
  for (const name of skillsToAdd) {
    if (installSkill(name)) {
      installed.push(name);
    }
  }

  if (installed.length > 0) {
    updateTargetSkillsJson(installed);
    console.log(`\n🎉 Updated skills.json with installed skills!`);
  }
} else if (command === "init") {
  let presetName = null;
  const presetIdx = args.indexOf("--preset");
  if (presetIdx !== -1 && args[presetIdx + 1]) {
    presetName = args[presetIdx + 1];
  }

  if (presetName) {
    if (!fs.existsSync(PRESETS_FILE)) {
      console.error(`❌ presets.json not found in mp-skills repository.`);
      process.exit(1);
    }
    let presets = {};
    try {
      presets = JSON.parse(fs.readFileSync(PRESETS_FILE, "utf8"));
    } catch (e) {
      console.error(`❌ Could not parse presets.json: ${e.message}`);
      process.exit(1);
    }

    const skillsInPreset = presets[presetName];
    if (
      !skillsInPreset ||
      !Array.isArray(skillsInPreset) ||
      skillsInPreset.length === 0
    ) {
      console.error(
        `❌ Preset "${presetName}" is not defined or is empty in presets.json.`
      );
      console.log(
        `Available presets: ${Object.keys(presets).join(", ").trim() || "(none)"}`
      );
      process.exit(1);
    }

    console.log(
      `Installing preset "${presetName}" (${skillsInPreset.length} skills)...`
    );
    const installed = [];
    for (const name of skillsInPreset) {
      if (installSkill(name)) {
        installed.push(name);
      }
    }
    if (installed.length > 0) {
      updateTargetSkillsJson(installed, presetName);
      console.log(`\n🎉 Preset "${presetName}" successfully installed!`);
    }
  } else if (fs.existsSync(TARGET_CONFIG_FILE)) {
    try {
      const config = JSON.parse(fs.readFileSync(TARGET_CONFIG_FILE, "utf8"));
      if (Array.isArray(config.skills) && config.skills.length > 0) {
        console.log(
          `Syncing ${config.skills.length} skills from skills.json...`
        );
        for (const name of config.skills) {
          installSkill(name);
        }
        console.log(`\n🎉 All skills synced from skills.json!`);
      } else {
        console.log(`skills.json found, but no skills are listed in it.`);
      }
    } catch (e) {
      console.error(`❌ Error reading skills.json: ${e.message}`);
    }
  } else {
    console.log(`Usage for init:
  my-skills init --preset <name>   Install a pre-defined group of skills
  my-skills init                  Sync skills defined in an existing skills.json
`);
  }
} else if (command === "update") {
  let presetName = null;
  const presetIdx = args.indexOf("--preset");
  if (presetIdx !== -1 && args[presetIdx + 1]) {
    presetName = args[presetIdx + 1];
  }

  let configPreset = null;
  let existingSkills = [];

  if (fs.existsSync(TARGET_CONFIG_FILE)) {
    try {
      const config = JSON.parse(fs.readFileSync(TARGET_CONFIG_FILE, "utf8"));
      if (Array.isArray(config.skills)) existingSkills = config.skills;
      if (config.preset) configPreset = config.preset;
    } catch (e) {
      console.warn(`Warning: Could not parse existing skills.json.`);
    }
  }

  const targetPreset = presetName || configPreset;
  let skillsToUpdate = [...existingSkills];
  let newSkillsFromPresetCount = 0;

  if (targetPreset) {
    if (fs.existsSync(PRESETS_FILE)) {
      try {
        const presets = JSON.parse(fs.readFileSync(PRESETS_FILE, "utf8"));
        const presetSkills = presets[targetPreset];
        if (Array.isArray(presetSkills)) {
          for (const s of presetSkills) {
            if (!skillsToUpdate.includes(s)) {
              skillsToUpdate.push(s);
              newSkillsFromPresetCount++;
            }
          }
        }
      } catch (e) {
        console.warn(
          `Warning: Could not read presets.json for preset "${targetPreset}".`
        );
      }
    }
  }

  if (skillsToUpdate.length === 0) {
    console.error(
      `❌ No skills found to update. Run "my-skills init --preset default" or "my-skills add <skill>" first.`
    );
    process.exit(1);
  }

  console.log(
    `🔄 Updating ${skillsToUpdate.length} skills in .agents/skills...`
  );
  let updatedCount = 0;
  for (const name of skillsToUpdate) {
    if (installSkill(name)) {
      updatedCount++;
    }
  }

  updateTargetSkillsJson(skillsToUpdate, targetPreset);

  const presetInfo = targetPreset
    ? ` (Preset: "${targetPreset}"${newSkillsFromPresetCount > 0 ? `, ${newSkillsFromPresetCount} new skill(s) added` : ""})`
    : "";
  console.log(
    `\n🎉 Successfully updated ${updatedCount} skill(s)${presetInfo}!`
  );
} else if (command === "list") {
  console.log(`Available skills in ${REPO_ROOT}:`);
  function listSkills(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const fullPath = path.join(dir, entry.name);
        if (fs.existsSync(path.join(fullPath, "SKILL.md"))) {
          console.log(`  - ${entry.name}`);
        } else {
          listSkills(fullPath);
        }
      }
    }
  }
  listSkills(SKILLS_DIR);
} else {
  console.error(`Unknown command: ${command}`);
  console.log(`Run "my-skills help" for usage.`);
  process.exit(1);
}
