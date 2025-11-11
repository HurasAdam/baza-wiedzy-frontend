import { FilePlus2 } from "lucide-react";

const CreateArticleHeader = () => {
  return (
    <header className="w-full max-w-5xl px-2 mx-auto flex items-center gap-4  ">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary shadow-sm">
        <FilePlus2 className="w-6 h-6" />
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dodaj nowy artykuł</h1>
        <p className="text-sm text-muted-foreground">Wprowadź nazwę i treść artykułu, aby rozpocząć.</p>
      </div>
    </header>
  );
};

export default CreateArticleHeader;
