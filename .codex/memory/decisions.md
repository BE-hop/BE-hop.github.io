# Durable Decisions

## 2026-07-10 - Local editor and publishing boundary

- Decision: provide a structured local editor with advanced source views and session-scoped publishing.
- Evidence: owner-approved system upgrade plan and existing local Ruby editor.
- Invalidation: owner requests a hosted CMS or changes the deployment model.
- Consequence: pre-existing dirty files are never auto-staged; publishing requires preflight and confirmation.

## 2026-07-10 - English-first public experience

- Decision: first visits render English; Chinese remains a complete switchable mirror and the preference is remembered locally.
- Evidence: owner selection and career positioning memory.
- Invalidation: owner changes target audience or language strategy.

## 2026-07-10 - Locally compiled Tailwind

- Decision: Tailwind 3.4.17 is compiled into a committed static stylesheet; production pages do not use the Tailwind CDN.
- Evidence: browser audit showed the runtime theme configuration was ignored and custom colors/gradients failed.
- Invalidation: migration to another design system or build pipeline.
