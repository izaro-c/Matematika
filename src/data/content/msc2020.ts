import type { BaseContent } from '@/data/content/types';

/**
 * Mapeo de tags existentes en los archivos MDX a códigos MSC2020.
 */
export const tagToMSC: Record<string, string> = {
  // Español
  "geometría": "51",
  "geometria": "51",
  "geometría de incidencia": "51A",
  "incidencia": "51A",
  "geometría absoluta": "51M",
  "geometria absoluta": "51M",
  "geometria-absoluta": "51M",
  "geometría euclidiana": "51M",
  "geometria euclidiana": "51M",
  "geometria-euclidiana": "51M",
  "geometría hiperbólica": "51M",
  "geometria hiperbolica": "51M",
  "geometria-hiperbolica": "51M",
  "geometría analítica": "51P",
  "geometria analitica": "51P",
  "geometría afín": "51A",
  "congruencia": "51M",
  "continuidad": "51M",
  "orden": "51",
  "paralelas": "51M",
  "primitivo": "51",
  "espacio": "51",
  "unidimensional": "51",
  "bidimensional": "51",
  "medida": "51M",
  "triangulos": "51M",
  "pasch": "51",
  "fundamentos": "03",
  "neutral": "51M",
  "absoluta": "51M",
  "euclidiana": "51M",
  "clasica": "51M",
  "hiperbolica": "51M",
  "no-euclidiana": "51M",
  "lógica": "03",
  "logica": "03",
  "sistemas formales": "03",
  "filosofía de las matemáticas": "00A",
  "filosofia de las matematicas": "00A",
  "álgebra": "15",
  "algebra": "15",
  "álgebra lineal": "15A",
  "algebra lineal": "15A",
  "análisis": "26",
  "analisis": "26",
  "cálculo": "26",
  "calculo": "26",
  "probabilidad": "60",
  "estadística": "62",
  "estadistica": "62",
  // Euskera
  "triangeluak": "51M",
  "azalerak": "51M",
  "intzidentzia": "51A",
  "intzidentzia-geometria": "51A",
  "kongruentzia": "51M",
  "jarraitutasuna": "51M",
  "ordena": "51",
  "paraleloak": "51M",
  "oinarrizkoa": "51",
  "oinarriak": "03",
  "logika": "03",
  "aljebra": "15",
  "analisia": "26",
  "kalkulua": "26",
  // English
  "geometry": "51",
  "incidence geometry": "51A",
  "absolute geometry": "51M",
  "euclidean geometry": "51M",
  "hyperbolic geometry": "51M",
  "analytic geometry": "51P",
  "affine geometry": "51A",
  "congruence": "51M",
  "continuity": "51M",
  "order": "51",
  "parallels": "51M",
  "primitive": "51",
  "space": "51",
  "triangles": "51M",
  "foundations": "03",
  "logic": "03",
  "formal systems": "03",
  "philosophy of mathematics": "00A",
  "linear algebra": "15A",
  "probability": "60",
  "statistics": "62",
};

export const mscNames: Record<string, string> = {
  "00": "Temas generales y globales; colecciones",
  "00A": "Generalidades, recreación, divulgación y filosofía de la matemática",
  "00B": "Actas de congresos y colecciones de artículos",
  "01": "Historia y biografía",
  "01A": "Historia de las matemáticas y biografías de matemáticos",
  "97": "Educación matemática",
  "97B": "Política educativa y sistemas educacionales",
  "97C": "Psicología de la educación matemática",
  "97G": "Geometría (educación)",
  "97H": "Álgebra (educación)",
  "97I": "Análisis (educación)",
  "03": "Lógica matemática y fundamentos",
  "03A": "Aspectos filosóficos y fundacionales",
  "03B": "Lógica general (proposicional, primer orden, modal)",
  "03C": "Teoría de modelos",
  "03D": "Teoría de la computabilidad y recursión",
  "03E": "Teoría de conjuntos (cardinales, ordinales, axioma de elección)",
  "03F": "Teoría de la demostración y matemática constructiva",
  "03G": "Lógica algebraica (álgebras de Boole)",
  "08": "Sistemas algebraicos generales",
  "08A": "Estructuras algebraicas y homomorfismos",
  "08B": "Variedades de álgebras",
  "08C": "Clases de álgebras",
  "11": "Teoría de números",
  "11A": "Teoría de números elemental",
  "11D": "Ecuaciones diofánticas",
  "11F": "Formas modulares y automorfas",
  "11R": "Teoría de números algebraica",
  "11Y": "Teoría de números computacional",
  "12": "Teoría de cuerpos y polinomios",
  "12F": "Extensiones de cuerpos y Teoría de Galois",
  "12H": "Álgebra diferencial",
  "13": "Álgebra conmutativa",
  "13B": "Extensiones de anillos",
  "13F": "Anillos aritméticos y de factorización única",
  "14": "Geometría algebraica",
  "14H": "Curvas algebraicas",
  "14J": "Superficies y variedades de dimensión superior",
  "14K": "Variedades abelianas",
  "15": "Álgebra lineal y multilineal; teoría de matrices",
  "15A": "Espacios vectoriales y transformaciones lineales básicas",
  "15B": "Matrices especiales (ortogonales, simétricas, booleanas)",
  "geometria-algebraica": "Geometría Algebraica",
  "algebra-abstracta": "Álgebra Abstracta (Anillos y Cuerpos)",
  "teoria-de-grupos-y-categorias": "Teoría de Grupos y Categorías",
  "18": "Teoría de categorías; álgebra homológica",
  "18A": "Teoría de categorías general",
  "18B": "Categorías especiales (topos)",
  "18G": "Álgebra homológica",
  "20": "Teoría de grupos y generalizaciones",
  "20D": "Grupos finitos abstractos",
  "20F": "Grupos infinitos especiales (presentaciones)",
  "20M": "Semigrupos",
  "analisis-real-y-funciones": "Análisis Real y Funciones",
  "analisis-complejo": "Análisis Complejo",
  "ecuaciones-diferenciales": "Ecuaciones Diferenciales",
  "analisis-funcional-y-armonico": "Análisis Funcional y Armónico",
  "26": "Funciones reales",
  "26A": "Funciones de una variable",
  "26B": "Funciones de varias variables",
  "30": "Funciones de una variable compleja",
  "30C": "Teoría geométrica de funciones",
  "30D": "Funciones analíticas y meromorfas",
  "34": "Ecuaciones diferenciales ordinarias",
  "34A": "Teoría general (existencia, unicidad)",
  "34C": "Teoría cualitativa",
  "34D": "Teoría de estabilidad",
  "46": "Análisis funcional",
  "46B": "Espacios de Banach",
  "46C": "Espacios de Hilbert",
  "46L": "Álgebras de operadores (Álgebras C*)",
  "geometria-clasica-y-diferencial": "Geometría Clásica y Diferencial",
  "topologia-general-y-algebraica": "Topología General y Algebraica",
  "51": "Geometría clásica",
  "51A": "Geometría de incidencia lineal",
  "51M": "Geometría euclidiana y absoluta real",
  "51P": "Geometría y física",
  "53": "Geometría diferencial",
  "53A": "Geometría diferencial clásica",
  "53C": "Geometría global (variedades de Riemann)",
  "53D": "Geometría simpléctica y de contacto",
  "54": "Topología general",
  "54D": "Propiedades de recubrimiento y separación (compacidad)",
  "54E": "Espacios con estructuras más ricas (espacios métricos)",
  "54F": "Espacios topológicos especiales (curvas, dimensión)",
  "55": "Topología algebraica",
  "55M": "Topología algebraica clásica",
  "55N": "Homología y cohomología",
  "55Q": "Teoría de homotopía",
  "05": "Combinatoria",
  "05A": "Combinatoria enumerativa",
  "05B": "Diseños y configuraciones",
  "05C": "Teoría de grafos",
  "68": "Ciencias de la computación",
  "68Q": "Teoría de la computación (Algoritmos, Complejidad P/NP)",
  "68R": "Informática discreta (Grafos en computación)",
  "68T": "Inteligencia artificial",
  "68W": "Algoritmos computacionales especializados",
  "optimizacion-y-teoria-de-juegos": "Optimización y Teoría de Juegos",
  "fisica-matematica-y-biologia": "Física Matemática y Biología",
  "49": "Cálculo de variaciones y control óptimo; optimización",
  "49J": "Existencia de soluciones",
  "49K": "Condiciones de optimalidad",
  "49L": "Ecuaciones de Hamilton-Jacobi",
  "60": "Teoría de la probabilidad y procesos estocásticos",
  "60B": "Probabilidad en estructuras algebraicas y topológicas",
  "60C": "Probabilidad combinatoria",
  "60E": "Distribuciones, funciones características",
  "60F": "Teoremas límite (Ley de los grandes números, Teorema central del límite)",
  "60G": "Procesos estocásticos",
  "60H": "Análisis estocástico (Integrales de Itô)",
  "60J": "Cadenas de Markov, procesos de salto",
  "62": "Estadística",
  "62C": "Teoría de decisión estadística",
  "62D": "Muestreo, encuestas",
  "62F": "Inferencia paramétrica (Estimación de máxima verosimilitud)",
  "62G": "Inferencia no paramétrica",
  "62H": "Análisis multivariante",
  "62J": "Modelos lineales (Regresión, ANOVA)",
  "62M": "Inferencia en procesos estocásticos",
  "62P": "Aplicaciones estadísticas (Biometría, Econometría)",
  "65": "Análisis numérico",
  "65D": "Aproximación numérica (Interpolación, Cuadratura)",
  "65F": "Álgebra lineal numérica",
  "65H": "Sistemas de ecuaciones no lineales",
  "65L": "Ecuaciones diferenciales ordinarias numéricas",
  "65M": "Ecuaciones en derivadas parciales numéricas (Elementos finitos)",
  "70": "Mecánica de partículas y sistemas",
  "70E": "Dinámica de cuerpos rígidos",
  "70F": "Dinámica de sistemas de partículas (Problema de los N cuerpos)",
  "70H": "Mecánica hamiltoniana y lagrangiana",
  "74": "Mecánica de sólidos deformables",
  "74B": "Elasticidad lineal",
  "74F": "Acoplamiento de campos mecánicos con térmicos/electromagnéticos",
  "76": "Mecánica de fluidos",
  "76B": "Fluidos incompresibles no viscosos",
  "76D": "Fluidos incompresibles viscosos (Ecuaciones de Navier-Stokes)",
  "78": "Óptica, teoría electromagnética",
  "78A": "Óptica clásica y electromagnetismo (Ecuaciones de Maxwell)",
  "80": "Termodinámica clásica, transferencia de calor",
  "80A": "Termodinámica y transferencia de calor",
  "81": "Teoría cuántica",
  "81P": "Fundamentos, teoría cuántica de la información y entrelazamiento",
  "81Q": "Mecánica cuántica general",
  "81T": "Teoría cuántica de campos",
  "82": "Mecánica estadística, estructura de la materia",
  "82B": "Mecánica estadística de equilibrio",
  "82C": "Mecánica estadística dependiente del tiempo",
  "83": "Relatividad y teoría gravitacional",
  "83C": "Relatividad general",
  "83E": "Teorías unificadas y gravedad cuántica (Teoría de cuerdas)",
  "85": "Astronomía y astrofísica",
  "85A": "Modelos matemáticos en astronomía",
  "86": "Geofísica",
  "86A": "Modelos matemáticos en geofísica (Sismología, meteorología)",
  "90": "Investigación operativa, programación matemática",
  "90B": "Investigación operativa (Inventario, logística, teoría de colas)",
  "90C": "Programación matemática (Lineal, entera, convexa)",
  "91": "Teoría de juegos, economía, ciencias sociales y del comportamiento",
  "91A": "Teoría de juegos (Juegos cooperativos y no cooperativos)",
  "91B": "Economía matemática (Finanzas, teoría del equilibrio)",
  "92": "Biología y otras ciencias naturales",
  "92B": "Biología matemática en general",
  "92C": "Biomecánica y fisiología",
  "92D": "Genética y dinámica de poblaciones",
  "metadatos-y-divulgacion": "Ciencia y Técnica",
  "fundamentos-y-logica": "Fundamentos y Lógica",
  "algebra-y-teoria-de-numeros": "Álgebra y Teoría de Números",
  "analisis-matematico": "Análisis Matemático",
  "geometria-y-topologia": "Geometría y Topología",
  "matematica-discreta-y-computacional": "Matemática Discreta y Computacional",
  "probabilidad-estadistica-y-aplicaciones": "Probabilidad, Estadística y Aplicaciones",
};

export const mscNamesEu: Record<string, string> = {
  "00": "Gai orokorrak eta globalak; bildumak",
  "00A": "Orokorrak, aisialdia, dibulgazioa eta matematikaren filosofia",
  "00B": "Biltzarretako aktak eta artikulu-bildumak",
  "01": "Historia eta biografiak",
  "01A": "Matematikaren historia eta matematikarien biografiak",
  "97": "Matematika-hezkuntza",
  "97B": "Hezkuntza-politika eta hezkuntza-sistemak",
  "97C": "Matematika-hezkuntzaren psikologia",
  "97G": "Geometria (hezkuntza)",
  "97H": "Aljebra (hezkuntza)",
  "97I": "Analisia (hezkuntza)",
  "03": "Logika matematikoa eta oinarriak",
  "03A": "Filosofia- eta oinarri-alderdiak",
  "03B": "Logika orokorra (proposiziozkoa, lehen mailakoa, modala)",
  "03C": "Ereduen teoria",
  "03D": "Konputagarritasunaren teoria eta errekurtsioa",
  "03E": "Multzo-teoria (kardinalak, ordinalak, hautapenaren axioma)",
  "03F": "Frogen teoria eta matematika konstruktiboa",
  "03G": "Logika aljebraikoa (Booleren aljebrak)",
  "08": "Sistema aljebraiko orokorrak",
  "08A": "Egitura aljebraikoak eta homomorfismoak",
  "08B": "Aljebren barietateak",
  "08C": "Aljebra-klaseak",
  "11": "Zenbaki-teoria",
  "11A": "Zenbaki-teoria elementala",
  "11D": "Ekuazio diofantikoak",
  "11F": "Forma modularrak eta automorfoak",
  "11R": "Zenbaki-teoria aljebraikoa",
  "11Y": "Zenbaki-teoria konputazionala",
  "12": "Gorputzen teoria eta polinomioak",
  "12F": "Gorputz-hedapenak eta Galoisen teoria",
  "12H": "Aljebra diferentziala",
  "13": "Aljebra trukakorra",
  "13B": "Eraztun-hedapenak",
  "13F": "Eraztun aritmetikoak eta faktorizazio bakarrekoak",
  "14": "Geometria aljebraikoa",
  "14H": "Kurba aljebraikoak",
  "14J": "Gainazalak eta dimentsio handiagoko barietateak",
  "14K": "Abelen barietateak",
  "15": "Aljebra lineala eta multilineala; matrizeen teoria",
  "15A": "Bektore-espazioak eta oinarrizko transformazio linealak",
  "15B": "Matrize bereziak (ortogonalak, simetrikoak, boolearrak)",
  "geometria-algebraica": "Geometria Aljebraikoa",
  "algebra-abstracta": "Aljebra Abstraktua (Eraztunak eta Gorputzak)",
  "teoria-de-grupos-y-categorias": "Taldeen Teoria eta Kategoriak",
  "18": "Kategorien teoria; aljebra homologikoa",
  "18A": "Kategorien teoria orokorra",
  "18B": "Kategoria bereziak (toposak)",
  "18G": "Aljebra homologikoa",
  "20": "Taldeen teoria eta orokortzeak",
  "20D": "Talde finitu abstraktuak",
  "20F": "Talde bereziak eta egitura-propietateak",
  "20G": "Talde linealak eta aljebraikoak",
  "20M": "Erditaldeak",
  "26": "Aldagai errealeko funtzioak",
  "26A": "Aldagai bakarreko funtzioak (kalkulu diferentziala eta integrala)",
  "26B": "Hainbat aldagaitako funtzioak",
  "28": "Neurria eta integrazioa",
  "28A": "Neurri klasikoak eta Lebesguen integrala",
  "30": "Aldagai konplexuko funtzioak",
  "30C": "Funtzio analitikoen teoria geometrikoa",
  "30D": "Funtzio osoak eta meromorfoak",
  "34": "Ekuazio diferentzial arruntak",
  "34A": "Teoria orokorra, existentzia eta bakartasuna",
  "34C": "Sistema dinamikoak eta soluzio kualitatiboak",
  "34D": "Egonkortasun-teoria",
  "35": "Deribatu partzialetako ekuazio diferentzialak",
  "35A": "Teoria orokorra",
  "35J": "Ekuazio eliptikoak",
  "35K": "Ekuazio parabolikoak",
  "35L": "Ekuazio hiperbolikoak",
  "46": "Analisi funtzionala",
  "46B": "Banach eta Hilbert espazio normatuak",
  "46C": "Biderketa barruko espazioak",
  "46L": "Eragileen aljebrak (C*-aljebrak, von Neumannen aljebrak)",
  "analisis-real-y-funciones": "Analisi Erreala eta Funtzioak",
  "analisis-complejo": "Analisi Konplexua",
  "ecuaciones-diferenciales": "Ekuazio Diferentzialak",
  "analisis-funcional-y-armonico": "Analisi Funtzionala eta Harmonikoa",
  "geometria-clasica-y-diferencial": "Geometria Klasikoa eta Diferentziala",
  "topologia-general-y-algebraica": "Topologia Orokorra eta Aljebraikoa",
  "51": "Geometria klasikoa",
  "51A": "Intzidentzia-geometria lineala",
  "51M": "Geometria euklidearra eta ez-euklidearra",
  "51P": "Geometria analitikoa",
  "53": "Geometria diferentziala",
  "53A": "Kurba eta gainazalen geometria diferentzial klasikoa",
  "53C": "Barietate diferentziagarriak eta Riemannen geometria",
  "53D": "Geometria sinplektikoa eta kontaktuzkoa",
  "54": "Topologia orokorra",
  "54D": "Banaketa- eta konpaktutasun-propietateak",
  "54E": "Espazio metrikoak eta uniformeak",
  "54F": "Espazio bereziak (kontinuoak)",
  "55": "Topologia aljebraikoa",
  "55M": "Homologia eta kohomologia klasikoa",
  "55N": "Homologia orokortuaren teoriak",
  "55Q": "Homotopia-taldeak",
  "05": "Konbinatoria",
  "05A": "Konbinatoria zenbakizkoa",
  "05B": "Diseinuak eta konfigurazioak",
  "05C": "Grafo-teoria",
  "68": "Informatika",
  "68Q": "Konputazioaren teoria eta algoritmoak",
  "68R": "Matematika diskretua informatikan",
  "68T": "Adimen artifiziala",
  "68W": "Algoritmoen analisia eta diseinua",
  "optimizacion-y-teoria-de-juegos": "Optimizazioa eta Joko-Teoria",
  "fisica-matematica-y-biologia": "Fisika Matematikoa eta Biologia",
  "49": "Aldakuntzen kalkulua eta kontrol optimoa",
  "49J": "Existentzia-teoria eta baldintza beharrezkoak",
  "49K": "Baldintza nahikoak eta muturrak",
  "49L": "Hamilton-Jacobi teoria",
  "60": "Probabilitate-teoria eta prozesu estokastikoak",
  "60B": "Probabilitate-neurriak espazio abstraktuetan",
  "60C": "Probabilitate konbinatorioa",
  "60E": "Banaketen teoria",
  "60F": "Muga-teoremak",
  "60G": "Prozesu estokastikoak",
  "60H": "Analisi estokastikoa eta ekuazio diferentzial estokastikoak",
  "60J": "Markov prozesuak",
  "62": "Estatistika",
  "62C": "Erabakien teoria",
  "62D": "Laginketa-teoria",
  "62F": "Inferentzia parametrikoa",
  "62G": "Inferentzia ez-parametrikoa",
  "62H": "Analisi multivariantea",
  "62J": "Erregresio lineala eta bariantza-analisia",
  "62M": "Inferentzia prozesu estokastikoetatik",
  "62P": "Aplikazio estatistikoak",
  "65": "Zenbakizko analisia",
  "65D": "Zenbakizko hurbilketa eta interpolazioa",
  "65F": "Aljebra lineal zenbakizkoa",
  "65H": "Ekuazio ez-linealen ebazpen zenbakizkoa",
  "65L": "Ekuazio diferentzial arrunten ebazpen zenbakizkoa",
  "65M": "Deribatu partzialetako ekuazioen ebazpen zenbakizkoa",
  "70": "Partikulen eta sistemen mekanika",
  "70E": "Gorputz solidoen dinamika",
  "70F": "Sistema mugatuen dinamika",
  "70H": "Mekanika hamiltoniarra eta lagrangiarra",
  "74": "Solido deformagarrien mekanika",
  "74B": "Elastikotasun klasikoa",
  "74F": "Efektu akoplatuak",
  "76": "Fluidoen mekanika",
  "76B": "Fluido konprimaezin ez-likatsuak",
  "76D": "Fluido likatsuak eta mugako geruzak",
  "78": "Optika eta elektromagnetismoa",
  "78A": "Elektromagnetismo orokorra",
  "80": "Termodinamika klasikoa eta bero-transferentzia",
  "80A": "Termodinamika klasikoa",
  "81": "Teoria kuantikoa",
  "81P": "Mekanika kuantikoaren oinarriak",
  "81Q": "Metodo kuantiko orokorrak",
  "81T": "Eremu-teoria kuantikoa",
  "82": "Mekanika estatistikoa eta materiaren egitura",
  "82B": "Oreka mekanika estatistikoa",
  "82C": "Orekatik kanpoko mekanika estatistikoa",
  "83": "Erlatibitatearen teoria eta grabitazioa",
  "83C": "Erlatibitate orokorra",
  "83E": "Dimentsio gehigarrien teoriak eta bateratzeak",
  "85": "Astronomia eta astrofisika",
  "85A": "Astrofisika teorikoa",
  "86": "Geofisika",
  "86A": "Geofisika teorikoa",
  "90": "Eragiketa-ikerketa eta programazio matematikoa",
  "90B": "Logistika, ekoizpena eta inbentarioak",
  "90C": "Programazio matematikoa (lineala, ez-lineala, osoa)",
  "91": "Joko-teoria, ekonomia eta gizarte-zientziak",
  "91A": "Joko-teoria",
  "91B": "Ekonomia matematikoa",
  "92": "Biologia eta beste zientzia naturalak",
  "92B": "Biologia matematikoa",
  "92C": "Biologia fisiologikoa eta zelularra",
  "92D": "Genetika eta populazio-dinamika",
  "metadatos-y-divulgacion": "Metadatuak eta Dibulgazioa",
  "fundamentos-y-logica": "Oinarriak eta Logika",
  "algebra-y-teoria-de-numeros": "Aljebra eta Zenbaki Teoria",
  "analisis-matematico": "Analisi Matematikoa",
  "geometria-y-topologia": "Geometria eta Topologia",
  "matematica-discreta-y-computacional": "Matematika Diskretua eta Konputazionala",
  "probabilidad-estadistica-y-aplicaciones": "Probabilitatea, Estatistika eta Aplikazioak",
};

export const mscNamesEn: Record<string, string> = {
  "00": "General and overarching topics; collections",
  "00A": "Generalities, recreation, outreach, and philosophy of mathematics",
  "00B": "Conference proceedings and collections of articles",
  "01": "History and biography",
  "01A": "History of mathematics and mathematicians' biographies",
  "97": "Mathematics education",
  "97B": "Educational policy and educational systems",
  "97C": "Psychology of mathematics education",
  "97G": "Geometry (education)",
  "97H": "Algebra (education)",
  "97I": "Analysis (education)",
  "03": "Mathematical logic and foundations",
  "03A": "Philosophical and foundational aspects",
  "03B": "General logic (propositional, first-order, modal)",
  "03C": "Model theory",
  "03D": "Computability theory and recursion",
  "03E": "Set theory (cardinals, ordinals, axiom of choice)",
  "03F": "Proof theory and constructive mathematics",
  "03G": "Algebraic logic (Boolean algebras)",
  "08": "General algebraic systems",
  "08A": "Algebraic structures and homomorphisms",
  "08B": "Varieties of algebras",
  "08C": "Classes of algebras",
  "11": "Number theory",
  "11A": "Elementary number theory",
  "11D": "Diophantine equations",
  "11F": "Modular and automorphic forms",
  "11R": "Algebraic number theory",
  "11Y": "Computational number theory",
  "12": "Field theory and polynomials",
  "12F": "Field extensions and Galois theory",
  "12H": "Differential algebra",
  "13": "Commutative algebra",
  "13B": "Ring extensions",
  "13F": "Arithmetic rings and unique factorization domains",
  "14": "Algebraic geometry",
  "14H": "Algebraic curves",
  "14J": "Surfaces and higher-dimensional varieties",
  "14K": "Abelian varieties",
  "15": "Linear and multilinear algebra; matrix theory",
  "15A": "Vector spaces and basic linear transformations",
  "15B": "Special matrices (orthogonal, symmetric, boolean)",
  "geometria-algebraica": "Algebraic Geometry",
  "algebra-abstracta": "Abstract Algebra (Rings and Fields)",
  "teoria-de-grupos-y-categorias": "Group Theory and Categories",
  "18": "Category theory; homological algebra",
  "18A": "General category theory",
  "18B": "Special categories (topoi)",
  "18G": "Homological algebra",
  "20": "Group theory and generalizations",
  "20D": "Abstract finite groups",
  "20F": "Special infinite groups (presentations)",
  "20G": "Linear and algebraic groups",
  "20M": "Semigroups",
  "26": "Real functions",
  "26A": "Functions of one real variable",
  "26B": "Functions of several real variables",
  "28": "Measure and integration",
  "28A": "Classical measures and Lebesgue integral",
  "30": "Functions of a complex variable",
  "30C": "Geometric function theory",
  "30D": "Entire and meromorphic functions",
  "34": "Ordinary differential equations",
  "34A": "General theory (existence, uniqueness)",
  "34C": "Qualitative theory and dynamical systems",
  "34D": "Stability theory",
  "35": "Partial differential equations",
  "35A": "General theory",
  "35J": "Elliptic equations",
  "35K": "Parabolic equations",
  "35L": "Hyperbolic equations",
  "46": "Functional analysis",
  "46B": "Normed spaces, Banach and Hilbert spaces",
  "46C": "Inner product spaces",
  "46L": "Operator algebras (C*-algebras, von Neumann algebras)",
  "analisis-real-y-funciones": "Real Analysis and Functions",
  "analisis-complejo": "Complex Analysis",
  "ecuaciones-diferenciales": "Differential Equations",
  "analisis-funcional-y-armonico": "Functional and Harmonic Analysis",
  "geometria-clasica-y-diferencial": "Classical and Differential Geometry",
  "topologia-general-y-algebraica": "General and Algebraic Topology",
  "51": "Classical geometry",
  "51A": "Linear incidence geometry",
  "51M": "Real Euclidean and absolute geometry",
  "51P": "Geometry and physics",
  "53": "Differential geometry",
  "53A": "Classical differential geometry of curves and surfaces",
  "53C": "Global differential geometry (Riemannian manifolds)",
  "53D": "Symplectic and contact geometry",
  "54": "General topology",
  "54D": "Fairness, separation and compactness properties",
  "54E": "Spaces with richer structures (metric spaces)",
  "54F": "Special topological spaces (continuums, dimension)",
  "55": "Algebraic topology",
  "55M": "Classical homological topology",
  "55N": "Homology and cohomology theories",
  "55Q": "Homotopy groups",
  "05": "Combinatorics",
  "05A": "Enumerative combinatorics",
  "05B": "Designs and configurations",
  "05C": "Graph theory",
  "68": "Computer science",
  "68Q": "Theory of computation (Algorithms, P/NP Complexity)",
  "68R": "Discrete computer science (Graphs in computing)",
  "68T": "Artificial intelligence",
  "68W": "Specialized computational algorithms",
  "optimizacion-y-teoria-de-juegos": "Optimization and Game Theory",
  "fisica-matematica-y-biologia": "Mathematical Physics and Biology",
  "49": "Calculus of variations and optimal control; optimization",
  "49J": "Existence of solutions",
  "49K": "Optimality conditions",
  "49L": "Hamilton-Jacobi equations",
  "60": "Probability theory and stochastic processes",
  "60B": "Probability on algebraic and topological structures",
  "60C": "Combinatorial probability",
  "60E": "Distributions, characteristic functions",
  "60F": "Limit theorems (Law of large numbers, Central limit theorem)",
  "60G": "Stochastic processes",
  "60H": "Stochastic analysis (Itô integrals)",
  "60J": "Markov chains, jump processes",
  "62": "Statistics",
  "62C": "Statistical decision theory",
  "62D": "Sampling, surveys",
  "62F": "Parametric inference (Maximum likelihood estimation)",
  "62G": "Nonparametric inference",
  "62H": "Multivariate analysis",
  "62J": "Linear models (Regression, ANOVA)",
  "62M": "Inference from stochastic processes",
  "62P": "Applications of statistics (Biometrics, Econometrics)",
  "65": "Numerical analysis",
  "65D": "Numerical approximation (Interpolation, Quadrature)",
  "65F": "Numerical linear algebra",
  "65H": "Nonlinear equations systems",
  "65L": "Numerical ordinary differential equations",
  "65M": "Numerical partial differential equations (Finite elements)",
  "70": "Mechanics of particles and systems",
  "70E": "Rigid body dynamics",
  "70F": "Particles dynamics (N-body problem)",
  "70H": "Hamiltonian and Lagrangian mechanics",
  "74": "Mechanics of deformable solids",
  "74B": "Linear elasticity",
  "74F": "Coupling of mechanical fields with thermal/electromagnetic fields",
  "76": "Fluid mechanics",
  "76B": "Incompressible inviscid fluids",
  "76D": "Incompressible viscous fluids (Navier-Stokes equations)",
  "78": "Optics, electromagnetic theory",
  "78A": "Classical optics and electromagnetism (Maxwell equations)",
  "80": "Classical thermodynamics, heat transfer",
  "80A": "Thermodynamics and heat transfer",
  "81": "Quantum theory",
  "81P": "Foundations, quantum information theory and entanglement",
  "81Q": "General quantum mechanics",
  "81T": "Quantum field theory",
  "82": "Statistical mechanics, structure of matter",
  "82B": "Equilibrium statistical mechanics",
  "82C": "Time-dependent statistical mechanics",
  "83": "Relativity and gravitational theory",
  "83C": "General relativity",
  "83E": "Unified theories and quantum gravity (String theory)",
  "85": "Astronomy and astrophysics",
  "85A": "Mathematical models in astronomy",
  "86": "Geophysics",
  "86A": "Mathematical models in geophysics (Seismology, meteorology)",
  "90": "Operations research, mathematical programming",
  "90B": "Operations research (Inventory, logistics, queueing theory)",
  "90C": "Mathematical programming (Linear, integer, convex)",
  "91": "Game theory, economics, social and behavioral sciences",
  "91A": "Game theory (Cooperative and non-cooperative games)",
  "91B": "Mathematical economics (Finance, equilibrium theory)",
  "92": "Biology and other natural sciences",
  "92B": "Mathematical biology in general",
  "92C": "Biomechanics and physiology",
  "92D": "Genetics and population dynamics",
  "metadatos-y-divulgacion": "Science and Technology",
  "fundamentos-y-logica": "Foundations and Logic",
  "algebra-y-teoria-de-numeros": "Algebra and Number Theory",
  "analisis-matematico": "Mathematical Analysis",
  "geometria-y-topologia": "Geometry and Topology",
  "matematica-discreta-y-computacional": "Discrete Mathematics and Computing",
  "probabilidad-estadistica-y-aplicaciones": "Probability, Statistics and Applications",
};

const mscNamesByLang: Record<string, Record<string, string>> = {
  eu: mscNamesEu,
  es: mscNames,
  en: mscNamesEn,
};

export function getMscName(code: string, lang: string = 'es'): string {
  const table = mscNamesByLang[lang];
  if (table && table[code]) {
    return table[code];
  }
  return mscNames[code] || code;
}

export const mscHierarchy: Record<string, string[]> = {
  "00": ["00A", "00B"],
  "01": ["01A"],
  "97": ["97B", "97C", "97G", "97H", "97I"],
  "03": ["03A", "03B", "03C", "03D", "03E", "03F", "03G"],
  "08": ["08A", "08B", "08C"],
  "geometria-algebraica": ["14"],
  "algebra-abstracta": ["12", "13"],
  "teoria-de-grupos-y-categorias": ["18", "20"],
  "11": ["11A", "11D", "11F", "11R", "11Y"],
  "12": ["12F", "12H"],
  "13": ["13B", "13F"],
  "14": ["14H", "14J", "14K"],
  "15": ["15A", "15B"],
  "18": ["18A", "18B", "18G"],
  "20": ["20D", "20F", "20M"],
  "analisis-real-y-funciones": ["26"],
  "analisis-complejo": ["30"],
  "ecuaciones-diferenciales": ["34"],
  "analisis-funcional-y-armonico": ["46"],
  "26": ["26A", "26B"],
  "30": ["30C", "30D"],
  "34": ["34A", "34C", "34D"],
  "46": ["46B", "46C", "46L"],
  "geometria-clasica-y-diferencial": ["51", "53"],
  "topologia-general-y-algebraica": ["54", "55"],
  "51": ["51A", "51M", "51P"],
  "53": ["53A", "53C", "53D"],
  "54": ["54D", "54E", "54F"],
  "55": ["55M", "55N", "55Q"],
  "05": ["05A", "05B", "05C"],
  "68": ["68Q", "68R", "68T", "68W"],
  "optimizacion-y-teoria-de-juegos": ["49", "90", "91"],
  "fisica-matematica-y-biologia": ["70", "74", "76", "78", "80", "81", "82", "83", "85", "86", "92"],
  "49": ["49J", "49K", "49L"],
  "60": ["60B", "60C", "60E", "60F", "60G", "60H", "60J"],
  "62": ["62C", "62D", "62F", "62G", "62H", "62J", "62M", "62P"],
  "65": ["65D", "65F", "65H", "65L", "65M"],
  "70": ["70E", "70F", "70H"],
  "74": ["74B", "74F"],
  "76": ["76B", "76D"],
  "78": ["78A"],
  "80": ["80A"],
  "81": ["81P", "81Q", "81T"],
  "82": ["82B", "82C"],
  "83": ["83C", "83E"],
  "85": ["85A"],
  "86": ["86A"],
  "90": ["90B", "90C"],
  "91": ["91A", "91B"],
  "92": ["92B", "92C", "92D"],
  "metadatos-y-divulgacion": ["00", "01", "97"],
  "fundamentos-y-logica": ["03", "08"],
  "algebra-y-teoria-de-numeros": ["11", "15", "geometria-algebraica", "algebra-abstracta", "teoria-de-grupos-y-categorias"],
  "analisis-matematico": ["analisis-real-y-funciones", "analisis-complejo", "ecuaciones-diferenciales", "analisis-funcional-y-armonico"],
  "geometria-y-topologia": ["geometria-clasica-y-diferencial", "topologia-general-y-algebraica"],
  "matematica-discreta-y-computacional": ["05", "68"],
  "probabilidad-estadistica-y-aplicaciones": ["optimizacion-y-teoria-de-juegos", "fisica-matematica-y-biologia", "60", "62", "65"],
};

export const mscParent: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const [parent, children] of Object.entries(mscHierarchy)) {
    for (const child of children) {
      map[child] = parent;
    }
  }
  return map;
})();

export const codeInheritance: Record<string, string[]> = mscHierarchy;

export function resolveBranchCode(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (mscNames[trimmed] || mscNamesEu[trimmed]) return trimmed;
  const upper = trimmed.toUpperCase();
  if (mscNames[upper] || mscNamesEu[upper]) return upper;
  const lower = trimmed.toLowerCase();
  if (mscNames[lower] || mscNamesEu[lower]) return lower;
  const mapped = tagToMSC[lower] || tagToMSC[trimmed];
  if (mapped) return mapped;
  const slugMapped = tagToMSC[lower.replace(/-/g, ' ')];
  if (slugMapped) return slugMapped;
  if (/^\d{2}[A-Z]?$/i.test(trimmed)) return upper;
  return trimmed;
}

export function getChildCodes(parentCode: string): string[] {
  return codeInheritance[parentCode] || [];
}

export function getAllDescendantCodes(code: string): string[] {
  const children = getChildCodes(code);
  const descendants = [...children];
  for (const child of children) {
    const grand = getAllDescendantCodes(child);
    descendants.push(...grand);
  }
  return descendants;
}

export function getItemBranchCodes(item: BaseContent & Record<string, unknown>): string[] {
  const codes = new Set<string>();

  // 1. Direct 'branch' property (highest priority)
  if (typeof item.branch === 'string' && item.branch.trim()) {
    const resolved = resolveBranchCode(item.branch);
    if (resolved) codes.add(resolved);
  }

  // 2. Multiple 'branches' property
  if (Array.isArray(item.branches)) {
    for (const b of item.branches) {
      if (typeof b === 'string' && b.trim()) {
        const resolved = resolveBranchCode(b);
        if (resolved) codes.add(resolved);
      }
    }
  }

  // 3. Fallback to tags
  if (Array.isArray(item.tags)) {
    for (const t of item.tags) {
      if (typeof t === 'string' && t.trim()) {
        const resolved = resolveBranchCode(t);
        if (resolved && (mscNames[resolved] || mscNamesEu[resolved] || codeInheritance[resolved] || mscParent[resolved])) {
          codes.add(resolved);
        }
      }
    }
  }

  return Array.from(codes);
}

export interface BranchTaxonomy {
  id: string;
  slug: string;
  name: string;
  subBranches: { name: string; slug: string }[];
  directItems: { type: string; item: BaseContent & { tags?: string[] }; subBranchSlug?: string }[];
  breadcrumbs: { name: string; slug: string }[];
}

function buildBreadcrumbs(branchCode: string, lang?: string): BranchTaxonomy['breadcrumbs'] {
  const breadcrumbs: BranchTaxonomy['breadcrumbs'] = [];
  const chain: string[] = [];
  const seen = new Set<string>();
  let cur: string | undefined = branchCode;
  while (cur && !seen.has(cur)) {
    seen.add(cur);
    chain.unshift(cur);
    cur = mscParent[cur];
  }
  for (let i = 0; i < chain.length - 1; i++) {
    breadcrumbs.push({ name: getMscName(chain[i], lang), slug: chain[i] });
  }
  return breadcrumbs;
}

function classifyItem(
  item: BaseContent & Record<string, unknown>,
  branchCode: string,
  childCodes: string[],
  allDescendantCodes: string[],
): { type: string; item: BaseContent & { tags?: string[] }; subBranchSlug?: string } | null {
  const itemCodes = getItemBranchCodes(item);
  if (itemCodes.length === 0) return null;

  const directMatch = itemCodes.includes(branchCode);
  const matchedDescendant = directMatch ? undefined : allDescendantCodes.find(c => itemCodes.includes(c));

  if (!directMatch && !matchedDescendant) return null;

  let subBranchSlug: string | undefined;
  if (directMatch) {
    subBranchSlug = childCodes.find(c => itemCodes.includes(c) || getAllDescendantCodes(c).some(d => itemCodes.includes(d)));
  } else if (matchedDescendant) {
    subBranchSlug = childCodes.find(c => c === matchedDescendant || getAllDescendantCodes(c).includes(matchedDescendant));
  }

  return { type: 'classified', item, subBranchSlug };
}

export function buildBranchTaxonomy(
  branchId: string,
  items: { type: string; item: BaseContent & { tags?: string[] } }[],
  lang?: string,
): BranchTaxonomy {
  const branchCode = resolveBranchCode(branchId);
  const branchName = getMscName(branchCode, lang);
  const childCodes = getChildCodes(branchCode);
  const allDescendantCodes = getAllDescendantCodes(branchCode);

  const directItems: BranchTaxonomy['directItems'] = [];
  for (const { type, item } of items) {
    const classified = classifyItem(item as BaseContent & Record<string, unknown>, branchCode, childCodes, allDescendantCodes);
    if (classified) directItems.push({ type, item: classified.item, subBranchSlug: classified.subBranchSlug });
  }

  const breadcrumbs = buildBreadcrumbs(branchCode, lang);
  const subBranches = childCodes
    .map(code => ({ name: getMscName(code, lang), slug: code }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    id: branchCode,
    slug: branchCode.toLowerCase(),
    name: branchName,
    subBranches,
    directItems,
    breadcrumbs,
  };
}

export function getItemsByBranch(
  branch: string,
  items: { type: string; item: BaseContent & { tags?: string[] } }[],
): { type: string; item: BaseContent & { tags?: string[] } }[] {
  const branchCode = resolveBranchCode(branch);
  const allDescendantCodes = getAllDescendantCodes(branchCode);
  const results: { type: string; item: BaseContent & { tags?: string[] } }[] = [];

  for (const { type, item } of items) {
    const itemCodes = getItemBranchCodes(item as BaseContent & Record<string, unknown>);
    if (itemCodes.includes(branchCode) || allDescendantCodes.some(c => itemCodes.includes(c))) {
      results.push({ type, item });
    }
  }
  return results;
}

