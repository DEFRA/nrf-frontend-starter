---
description: Create, update, or delete a feature or piece of functionality
args:
  - name: description
    description: What the feature should do
    required: true
  - name: write_plan
    description: Whether to write the plan to .claude/tasks/{CURRENT_DATE_TIME}_feature.md (true) or just outline in chat (false)
    required: false
---

# New Feature: {{description}}

Follow the NRF implementation process:

1. **Understand, research, ask and plan** - Ensure you have completely understood the problem, spent time inspecting the code base and utilise MCP tools like Chrome dev tools if needed. Ask questions if you have any doubts or are unsure on anything. Do no make assumptions. Create a concise plan fomatted in a list with checkboxes{{#if write_plan}} and write it to `.claude/tasks/{CURRENT_DATE_TIME}_feature.md`{{else}} and outline it in the chat{{/if}}
2. **Ask for approval** before implementing
3. **Implement** following the plan
4. **Do not deviate** - Stay focused on the plan and do not make unecessary changes
5. **Think Minimal Viable Feature** - Do the bear minimimum to get a chunk of work working. Test yourself. Check in with the human to validate. Repeat until all tasks are complete
6. **Test with Chrome DevTools MCP** - Start server with `PORT=3001 npm run dev`
7. **Check comments** - Check any comments you have written. Code should be simple, self explanatory and "usually" not require comments. Remove any that seem to state the obvious.
8. **Format & lint** - Run `npm run format` and `npm run lint`
9. **Summary** - Provide concise summary of changes, referencing the plan. Highlight any changes from the plan and the reasoning.{{#if write_plan}} Update the orginal plan, checking of items that are complete, highlighting changes to the plan and providing a summary{{/if}}
