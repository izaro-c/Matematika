import { TopBar } from "@/widgets/navigation/TopBar";
import { SearchOmnibar } from "@/widgets/navigation/SearchOmnibar";
import { MarginaliaPanel } from "@/widgets/content/MarginaliaPanel";
import { SymbolDictionaryManager } from "@/widgets/content/SymbolDictionaryManager";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-lienzo text-carbon font-serif selection:bg-terracota/20">
      <SymbolDictionaryManager />
      <TopBar />
      <SearchOmnibar />
      <MarginaliaPanel />

      <div className="w-full">{children}</div>
    </div>
  );
};
