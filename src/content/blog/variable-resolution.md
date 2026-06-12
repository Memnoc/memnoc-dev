---
title: "Variable resolution across scope boundaries"
date: 2026-06-10
description: "The resolver pass confused me more than any other chapter. Here is what finally made it click."
tags: [compilers, crafting_interpreters, c_language]
---

The resolver in Crafting Interpreters is a second pass over the AST — after parsing, before interpretation. Its job is purely semantic: walk the tree, figure out exactly which variable declaration each variable reference resolves to, and record the answer as a depth count. No evaluation, no side effects.

The depth count is the key. When the resolver sees `x` in a use site, it walks outward through the scope stack counting environments until it finds the one where `x` was declared. It stores that count — call it a *distance* — alongside the node. Later, at runtime, the interpreter uses that distance to look directly into the right environment instead of walking the chain again.

```c
static void resolveLocal(Compiler* compiler, Token name) {
  for (int i = compiler->localCount - 1; i >= 0; i--) {
    Local* local = &compiler->locals[i];
    if (identifiersEqual(&name, &local->name)) {
      if (local->depth == -1) {
        error("Can't read local variable in its own initializer.");
      }
      emitBytes(OP_GET_LOCAL, (uint8_t)i);
      return;
    }
  }
  resolveUpvalue(compiler, name);
}
```

What tripped me up was the separation of concerns between the resolver and the interpreter. They share state — the variable-to-depth map — but the resolver runs statically, once, while the interpreter runs dynamically, potentially many times through the same code. Closures make this concrete: a closure captures the environment at the point it was created, not at the point it is called. The resolver computes the depth at definition time; the interpreter uses that depth at call time regardless of what the call stack looks like then.

The moment I stopped thinking of the resolver as "part of" the interpreter and started thinking of it as a separate semantic analysis pass — same category as a type checker in a typed language — the design stopped feeling arbitrary and started feeling inevitable.
