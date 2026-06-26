import Lake
open Lake DSL

package «matematika» where
  version := v!"0.1.0"


@[default_target]
lean_lib Matematika where
  roots := #[`Matematika]
