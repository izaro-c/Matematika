def ExistsUnique {α : Sort u} (p : α → Prop) : Prop := ∃ x, p x ∧ ∀ y, p y → y = x\nnotation:max "∃! " v:max ", " p => ExistsUnique (fun v => p)\n#check ∃! x, x = 1
