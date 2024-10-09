import { useEffect, useState } from "react";

const languges = [
  { code: "en", name: "Inglês" },
  { code: "es", name: "Espanhol" },
  { code: "fr", name: "Francês" },
  { code: "de", name: "Alemão" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
];

/*
   Lógica de Programação
     
    Passo a Passo das tarefas mais importante do Projeto.

[x] Selecionar idiomas inicias corretamente
[x] Saber quando o úsuario digitou algo no textarea
[x] Reunir as informações para enviar para o servidor
     [x] idioma atual
     [x] idioma a ser traduzido
     [x] texto a traduzir
  [x] ativar o loading
  [x] mandar os dados para o servidor
  [x] Desativar o Loading
     [x] Erro - mostrar o erro na tele
     [x] Mostrar o texto traduzido na tela 
  [x] Função de inverte os idiomas
  [x] Refazer a busca de tradução
*/

function App() {
  const [sourceLang, setSourceLang] = useState("pt");
  const [targetLang, setTargetLang] = useState("en");
  const [sourceText, setSourceText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Lingua de Origem - sourceLang
    // Lingua que será traduzido - targetLang
    // Do texto para traduzir - sourceText

    if (sourceText) {
      const delay = setTimeout(() => {
        handleTranslate();
      }, 500);

      return () => clearTimeout(delay);
    }
  }, [sourceText, targetLang, sourceLang]);

  // Toda vez você acessar uma função ou dados do servidor tem que ser tipo async
  const handleTranslate = async () => {
    setIsLoading(true);
    setError(""); // Limpar qualquer erro anterior

    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${sourceText}&langpair=${sourceLang}|${targetLang}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ERROR: ${response.status}`);
      }

      const data = await response.json();
      console.log(data); // Verifique a resposta da API

      if (data.responseData) {
        setTranslatedText(data.responseData.translatedText);
      } else {
        setError("Não foi possível traduzir o texto.");
      }
    } catch (err) {
      console.error(err); // Adicione este log
      setError(`Erro ao tentar traduzir: ${err.message}. Tente novamente.`);
    } finally {
      setIsLoading(false);
    }
  };

  const swapTransLate = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white shadow-sn">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center">
          <h1 className="text-headerColor text-2xl font-bold">Tradutor Dev</h1>
        </div>
      </header>
      <main className="flex-grow flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <select
              value={sourceLang}
              onChange={(event) => setSourceLang(event.target.value)}
              className="text-sm text-textColor bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {languges.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>

            <button
              className="p-2 rounded-full hover:bg-gray-100 outline-none"
              onCanPlay={swapTransLate}
            >
              <svg
                className="w-5 h-5 text-headerColor"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>

            <select
              value={targetLang}
              onChange={(event) => setTargetLang(event.target.value)}
              className="text-sn text-textColor bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {languges.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-4">
              <textarea
                value={sourceText}
                onChange={(event) => setSourceText(event.target.value)}
                placeholder="Digite seu texto"
                className="w-full h-40 text-lg text-textColor bg-transparente resize-none border-none outline-none"
              ></textarea>
            </div>

            <div className="p-4 relative bg-secondaryBackground border-l border-gray-200">
              <div className="absolute inset-0 flex items-center justify-center">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                ) : (
                  // Lógica do Loading if e else
                  <p className="text-lg text-textColor">{translatedText}</p>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-100 border-red-400 text-red-700">
              {error}
            </div>
          )}
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-3 text-sm text-headerColor">
          &copy; {new Date().getFullYear()}Tradutor Dev
        </div>
      </footer>
    </div>
  );
}

export default App;
