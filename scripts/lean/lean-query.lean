import Lean
import Matematika

/-!
Lean-side query entrypoint for the staged Matematika bridge.

The TypeScript generator still parses annotations for Matematika-specific
metadata, dependencies, and tactic blocks. This command establishes the other
half of the contract: every annotated `leanId` must exist in Lean's elaborated
environment.
-/

open Lean Elab Command

private def jsonArray (values : Array String) : String :=
  let entries := values.toList.map fun value => s!"\"{value}\""
  s!"[{String.intercalate "," entries}]"

elab "#matematika_query" : command => do
  let env <- getEnv
  let mut declarations := #[]

  for (name, _) in env.constants do
    let declaration := name.toString
    if declaration.startsWith "Matematika." then
      declarations := declarations.push declaration

  liftIO <| IO.println (
    "{ \"module\": \"Matematika\", \"declarations\": " ++ jsonArray declarations ++ " }"
  )

#matematika_query
