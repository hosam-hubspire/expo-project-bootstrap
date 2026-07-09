/**
 * Optional Figma Plugin API helpers for use_figma MCP.
 * Save JSON into src/theme/tokens/raw/ — discovery handles naming.
 */

async function resolveValue(v, modeId) {
  const val = v.valuesByMode[modeId];
  if (!val) return null;
  if (val.type === "VARIABLE_ALIAS") {
    const aliased = await figma.variables.getVariableByIdAsync(val.id);
    if (!aliased) return null;
    const firstMode = Object.keys(aliased.valuesByMode)[0];
    return resolveValue(aliased, firstMode);
  }
  if (v.resolvedType === "COLOR") {
    const c = val;
    const r = Math.round(c.r * 255);
    const g = Math.round(c.g * 255);
    const b = Math.round(c.b * 255);
    const a = c.a ?? 1;
    if (a < 1) return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
  }
  if (v.resolvedType === "FLOAT") return val;
  if (v.resolvedType === "STRING") return val;
  return val;
}

async function _exportCollection(collectionName) {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const collection = collections.find((c) => c.name === collectionName);
  if (!collection) return { error: `Collection not found: ${collectionName}` };

  const modes = collection.modes.map((m) => m.name);
  const variables = [];
  for (const varId of collection.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(varId);
    const values = {};
    for (const mode of collection.modes) {
      values[mode.name] = await resolveValue(v, mode.modeId);
    }
    variables.push({ name: v.name, type: v.resolvedType, values });
  }
  variables.sort((a, b) => a.name.localeCompare(b.name));
  return { collection: collection.name, modes, variables };
}

async function _listCollections() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  return collections.map((c) => ({
    name: c.name,
    modes: c.modes.map((m) => m.name),
    variableCount: c.variableIds.length,
  }));
}

async function _exportTextStyles() {
  return figma.getLocalTextStylesAsync();
}
