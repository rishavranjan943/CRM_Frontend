import { Stack, Select, MenuItem, TextField, Button, Typography } from "@mui/material";

export default function RuleGroup({ node, onChange, onRemove, isRoot = false }) {
  const handleOpChange = (val) => onChange({ ...node, op: val });
  const handleChildChange = (i, updated) => {
    const newChildren = [...node.children];
    newChildren[i] = updated;
    onChange({ ...node, children: newChildren });
  };

  const addCondition = () => {
    onChange({
      ...node,
      children: [...node.children, { field: "total_spend", cmp: ">", value: "" }]
    });
  };

  const addGroup = () => {
    onChange({
      ...node,
      children: [...node.children, { op: "AND", children: [] }]
    });
  };

  const removeChild = (i) => {
    onChange({ ...node, children: node.children.filter((_, idx) => idx !== i) });
  };

  return (
    <Stack spacing={2} sx={{ border: "1px solid #ccc", p: 2, borderRadius: 2, mb: 2 }}>
      {!isRoot && (
        <Button color="error" onClick={onRemove} sx={{ alignSelf: "flex-end" }}>Remove Group</Button>
      )}

      <Stack direction="row" spacing={2} alignItems="center">
        <Typography>Combine with:</Typography>
        <Select value={node.op} onChange={(e) => handleOpChange(e.target.value)}>
          <MenuItem value="AND">AND</MenuItem>
          <MenuItem value="OR">OR</MenuItem>
        </Select>
      </Stack>

      {node.children.map((child, idx) =>
        child.children ? (
          <RuleGroup
            key={idx}
            node={child}
            onChange={(updated) => handleChildChange(idx, updated)}
            onRemove={() => removeChild(idx)}
          />
        ) : (
          <Stack key={idx} direction="row" spacing={2} alignItems="center">
            <Select value={child.field} onChange={(e) => handleChildChange(idx, { ...child, field: e.target.value })}>
              <MenuItem value="total_spend">Total Spend</MenuItem>
              <MenuItem value="visits">Visits</MenuItem>
              <MenuItem value="days_inactive">Days Inactive</MenuItem>
            </Select>
            <Select value={child.cmp} onChange={(e) => handleChildChange(idx, { ...child, cmp: e.target.value })}>
              <MenuItem value=">">&gt;</MenuItem>
              <MenuItem value="<">&lt;</MenuItem>
              <MenuItem value="=">=</MenuItem>
              <MenuItem value="!=">!=</MenuItem>
            </Select>
            <TextField
              type="number"
              value={child.value}
              onChange={(e) => handleChildChange(idx, { ...child, value: e.target.value })}
            />
            <Button color="error" onClick={() => removeChild(idx)}>Remove</Button>
          </Stack>
        )
      )}

      <Stack direction="row" spacing={2}>
        <Button onClick={addCondition}>+ Add Condition</Button>
        <Button onClick={addGroup}>+ Add Group</Button>
      </Stack>
    </Stack>
  );
}
