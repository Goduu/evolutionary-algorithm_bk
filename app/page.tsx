import { Introduction } from "@/components/Introduction";
import { Main } from "@/components/Main";

export default function Home() {

  return (
    <main className="flex h-screen flex-col justify-between font-sans">
      <Introduction />
      <Main />
    </main>
  );
}
