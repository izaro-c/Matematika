import Lean
import Matematika

/-!
Lean-side query entrypoint for the staged Matematika bridge.

The TypeScript generator currently parses Matematika annotation comments from
`.lean` files so the bridge can run even before the full environment extractor
is mature. This file is kept as the future `lake env lean --run` entrypoint for
serializing elaborated declarations directly from Lean's environment.
-/

open Lean

def main : IO Unit := do
  IO.println "{ \"status\": \"annotation-parser-bridge\", \"module\": \"Matematika\" }"
