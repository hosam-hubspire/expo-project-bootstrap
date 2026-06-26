# Project bootstrap prompt

Thin entry point for scaffolding a new Expo app. **Canonical workflow** lives in the skill — do not duplicate it here.

## Recommended: use the skill

In Cursor:

```
use expo-project-bootstrap skill to bootstrap a project
```

Install or update the skill globally:

```bash
npx skills add hosam-hubspire/expo-project-bootstrap --skill expo-project-bootstrap -g -y
```

The agent reads:

| File | Purpose |
|------|---------|
| [skills/expo-project-bootstrap/SKILL.md](./skills/expo-project-bootstrap/SKILL.md) | Inputs, phase checklist, quick rules |
| [skills/expo-project-bootstrap/bootstrap.md](./skills/expo-project-bootstrap/bootstrap.md) | Full workflow (scaffold, Figma, verify, commit) |
| [skills/expo-project-bootstrap/addons.md](./skills/expo-project-bootstrap/addons.md) | Optional capability blocks |
| [templates/](./templates/) | Config, scripts, theme pipeline, app shell |

List skills in this repo:

```bash
npx skills add hosam-hubspire/expo-project-bootstrap --list
```

---

## Manual prompt (without skill)

Copy into a new agent chat and fill placeholders:

```
Bootstrap a new Expo React Native app.

Follow the full workflow in:
https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/skills/expo-project-bootstrap/bootstrap.md

Read templates from:
https://github.com/hosam-hubspire/expo-project-bootstrap/tree/main/templates

### Inputs
- **App name / slug:** <APP_NAME>
- **GitHub repo:** <GITHUB_REPO_URL or "local only">
- **Figma design system:** <FIGMA_FILE_URL or omit>
- **Figma icons section:** <FIGMA_ICONS_URL or omit>
- **Optional capabilities:** <Storybook, i18n, GraphQL subscriptions — list only what I want>
- **Platforms:** iOS and Android only (no web)
```

Do not paste the old monolithic prompt — it duplicated `bootstrap.md` and drifted from the skill.
