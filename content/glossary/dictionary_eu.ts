import type { GlossaryEntry } from './types';

export const dictionaryEu: Record<string, Partial<GlossaryEntry>> = {
  // OINARRIZKO KONTZEPTUAK
  axioma: {
    title: 'Axioma',
    definition: 'Frogarik gabe onartzen den proposizio argi eta agerikoa. Edozein teoria matematiko eraikitzeko oinarrizko adreilua da.',
    category: 'Oinarrizko Kontzeptuak' as any,
  },
  hipotesis: {
    title: 'Hipotesia',
    definition: 'Dedukzio edo froga baterako abiapuntutzat hartzen den hasierako premisa edo suposizioa.',
    category: 'Oinarrizko Kontzeptuak' as any,
  },
  lema: {
    title: 'Lema',
    definition: 'Teorema nagusi bat frogatzeko aldez aurreko urrats gisa frogatzen den teorema laguntzaile edo sekundarioa.',
    category: 'Oinarrizko Kontzeptuak' as any,
  },
  qed: {
    title: 'Quod Erat Demonstrandum ( ∎ )',
    definition: "Froga matematiko baten amaiera adierazten du. Latinezko 'frogatu nahi zena' esalditik dator.",
    category: 'Oinarrizko Kontzeptuak' as any,
  },

  // LOGIKA
  implies: {
    title: 'Inplikazioa ( ⟹ )',
    definition: "Baldintza nahikoa ezartzen duen konektore logikoa: 'Lehenengoa gertatzen bada, orduan bigarrena ezinbestean gertatzen da'.",
    category: 'Logika' as any,
  },
  equiv: {
    title: 'Baliokidetasuna ( ⟺ )',
    definition: 'Bi proposizio logikoki baliokideak direla adierazten du: biak batera dira egiazkoak edo biak batera gezurrezkoak.',
    category: 'Logika' as any,
  },
  forall: {
    title: 'Kuantifikatzaile Unibertsala ( ∀ )',
    definition: "'Guztientzat' irakurtzen da. Propietate edo baieztapen bat emandako multzoko elementu guztientzat betetzen dela adierazten du.",
    category: 'Logika' as any,
  },
  exists: {
    title: 'Kuantifikatzaile Existentziala ( ∃ )',
    definition: "'Gutxienez bat existitzen da' irakurtzen da. Multzo batean propietate jakin bat betetzen duen elementu bat behintzat badagoela baieztatzen du.",
    category: 'Logika' as any,
  },
  not: {
    title: 'Ukazio Logikoa ( ¬ )',
    definition: 'Proposizio baten egia-balioa alderantzikatzen du. P egiazkoa bada, ¬P gezurrezkoa da, eta alderantziz.',
    category: 'Logika' as any,
  },
  and: {
    title: 'Konjuntzio Logikoa ( ∧ )',
    definition: "'ETA' eragile logikoa. Proposizio osoa egiazkoa da bi azpi-proposizioak egiazkoak badira soilik.",
    category: 'Logika' as any,
  },
  or: {
    title: 'Disjuntzio Logikoa ( ∨ )',
    definition: "'EDO' eragile logikoa. Proposizio osoa egiazkoa da azpi-proposizioetako bat gutxienez egiazkoa bada.",
    category: 'Logika' as any,
  },
  contrapositiva: {
    title: 'Kontrajarria',
    definition: 'Inplikazio logiko bat emanda (P-k Q dakar), bere kontrajarria (Ez Q-k Ez P dakar) da. Bi proposizioak logikoki baliokideak dira.',
    category: 'Logika' as any,
  },
  modus_ponens: {
    title: 'Modus Ponens',
    definition: 'Oinarrizko inferentzia-araua: P ⟹ Q egiazkoa bada eta P egiazkoa bada, orduan Q ezinbestean egiazkoa da.',
    category: 'Logika' as any,
  },
  modus_tollens: {
    title: 'Modus Tollens',
    definition: 'Inferentzia-arau formala: P ⟹ Q egiazkoa bada eta Q gezurrezkoa bada (¬Q), orduan P gezurrezkoa izan behar da (¬P).',
    category: 'Logika' as any,
  },
  silogismo_hipotetico: {
    title: 'Silogismo Hipotetikoa',
    definition: 'Baldintzazko iragankortasunaren araua: P ⟹ Q eta Q ⟹ R badira, orduan P ⟹ R ondorioztatzen da.',
    category: 'Logika' as any,
  },
  silogismo_disyuntivo: {
    title: 'Silogismo Disjuntiboa',
    definition: 'Inferentzia-araua: P ∨ Q disjuntzioa emanda eta ¬P jakinda, orduan Q ondorioztatzen da nahitaez.',
    category: 'Logika' as any,
  },
  doble_negacion: {
    title: 'Ukazio Bikoitza',
    definition: 'Logika klasikoaren printzipioa: proposizio bat bere ukazioaren ukazioaren baliokidea da.',
    category: 'Logika' as any,
  },
  leyes_de_morgan: {
    title: 'De Morganen Legeak',
    definition: 'Baliokidetasun logikoko arauak, konjuntzioen ukazioa eta disjuntzioen ukazioa erlazionatzen dituztenak.',
    category: 'Logika' as any,
  },
  simplificacion: {
    title: 'Sinplifikazio Logikoa',
    definition: 'P ∧ Q konjuntzio egiazko batetik bere edozein gai ondorioztatzeko aukera ematen duen araua.',
    category: 'Logika' as any,
  },
  adicion: {
    title: 'Batuketa Logikoa',
    definition: 'P premisa egiazko batetik P ∨ Q disjuntzioa baliozkotasunez ondorioztatzeko aukera ematen duen araua.',
    category: 'Logika' as any,
  },
  resolucion: {
    title: 'Ebazpen Logikoa',
    definition: '(P ∨ Q) eta (¬P ∨ R) premisetatik (Q ∨ R) ondorioztatzeko inferentzia-araua.',
    category: 'Logika' as any,
  },
  reduccion_al_absurdo: {
    title: 'Absurdora Murriztea',
    definition: 'P proposizio bat frogatzeko metodoa, ¬P ukazioak kontraesan formal batera daramala erakutsiz.',
    category: 'Logika' as any,
  },

  // ALJEBRA
  sustitucion: {
    title: 'Ordezkapen Printzipioa',
    definition: 'Berdintzaren propietatea: bi adierazpen berdinak badira (a = b), bata bestearekin ordezka daiteke edozein testuinguru matematikotan.',
    category: 'Aljebra' as any,
  },
  propiedad_distributiva: {
    title: 'Banakortasuna (Propietate banatzailea)',
    definition: 'Eragiketa aljebraikoen propietatea non biderketa batuketarekiko banatzen den.',
    category: 'Aljebra' as any,
  },
  propiedad_conmutativa: {
    title: 'Kommutatibitatea (Propietate trukakorra)',
    definition: 'Eragikigaien ordenak eragiketaren emaitza aldatzen ez dueneko propietatea.',
    category: 'Aljebra' as any,
  },
  propiedad_asociativa: {
    title: 'Asoziatibitatea (Propietate elkartzailea)',
    definition: 'Segidako eragiketetan gaiak taldekatzeko moduak azken emaitza aldatzen ez dueneko propietatea.',
    category: 'Aljebra' as any,
  },
  propiedad_transitiva: {
    title: 'Berdintzaren Propietate Trantsitiboa',
    definition: 'Baliokidetasun-erlazioen oinarrizko propietatea: a = b eta b = c badira, orduan a = c.',
    category: 'Aljebra' as any,
  },
  propiedad_cancelativa: {
    title: 'Ezabatze Legea (Ezeztatze Legea)',
    definition: 'Berdintza baten bi aldeetako gai komunak deuseztatzeko aukera ematen duen arau aljebraikoa.',
    category: 'Aljebra' as any,
  },
  equals: {
    title: 'Berdintza ( = )',
    definition: 'Bi adierazpen matematikok balio edo entitate bera adierazten dutela adierazten du.',
    category: 'Aljebra' as any,
  },
  neq: {
    title: 'Desberdintza ( ≠ )',
    definition: 'Bi adierazpen matematikok balio bera EZ dutela adierazten du.',
    category: 'Aljebra' as any,
  },
  less_than: {
    title: 'Txikiago ( < )',
    definition: 'Ordena-erlazio zorrotza ezartzen du, lehen balioa bigarrena baino txikiagoa dela adieraziz.',
    category: 'Aljebra' as any,
  },
  greater_than: {
    title: 'Handiago ( > )',
    definition: 'Ordena-erlazio zorrotza ezartzen du, lehen balioa bigarrena baino handiagoa dela adieraziz.',
    category: 'Aljebra' as any,
  },
  leq: {
    title: 'Txikiago edo berdina ( ≤ )',
    definition: 'Ordena-erlazio ez-zorrotza. Lehen balioa bigarrena baino txikiagoa edo zehazki berdina da.',
    category: 'Aljebra' as any,
  },
  geq: {
    title: 'Handiago edo berdina ( ≥ )',
    definition: 'Ordena-erlazio ez-zorrotza. Lehen balioa bigarrena baino handiagoa edo zehazki berdina da.',
    category: 'Aljebra' as any,
  },
  sum: {
    title: 'Batura ( ∑ )',
    definition: 'Termino anitzen batura laburtzen duen notazioa. Beheko zatiak indize-aldagaia eta hasierako balioa adierazten ditu, goikoak amaierako balioa.',
    category: 'Aljebra' as any,
  },
  sqrt: {
    title: 'Erro Karratua ( √ )',
    definition: 'Bere buruarekin biderkatuta jatorrizko balioa ematen duen zenbakia aurkitzeko eragiketa.',
    category: 'Aljebra' as any,
  },
  approx: {
    title: 'Gutxi gorabehera berdina ( ≈ )',
    definition: 'Bi balio oso hurbil daudela baina ez direla zehazki berdinak adierazten du.',
    category: 'Aljebra' as any,
  },
  rank: {
    title: 'Matrize baten Maila ( rg )',
    definition: 'Matrize bateko zutabe edo errenkada linealki independenteen gehieneko kopurua.',
    category: 'Aljebra' as any,
  },
  det: {
    title: 'Determinantea ( det, | | )',
    definition: 'Matrize karratu bati lotutako balio eskalarra, bere zutabe-bektoreek osatutako paralelepipedoaren bolumen edo eskala-faktore gisa uler daitekeena.',
    category: 'Aljebra' as any,
  },
  transpose: {
    title: 'Matrize Transposatua ( T )',
    definition: 'Jatorrizko matrize baten errenkadak eta zutabeak sistematikoki elkarrekin trukatzearen emaitza.',
    category: 'Aljebra' as any,
  },
  identity: {
    title: 'Identitate Matrizea ( I )',
    definition: 'Diagonal nagusian batekoak eta gainerakoan zeroak dituen matrize karratua. Matrizeen biderketaren elementu neutroa da.',
    category: 'Aljebra' as any,
  },
  augmented: {
    title: 'Matrize Handitua ( * )',
    definition: 'Sistema baten koefiziente-matrizeari gai independenteen zutabea gehitzearen emaitza den matrizea.',
    category: 'Aljebra' as any,
  },
  par: {
    title: 'Zenbaki Bikoitia',
    definition: '2ren multiploa den zenbaki osoa.',
    category: 'Aljebra' as any,
  },
  plus: {
    title: 'Batura ( + )',
    definition: 'Kantitateak edo magnitudeak bakarrean konbinatzen dituen eragiketa aritmetikoa.',
    category: 'Aljebra' as any,
  },
  minus: {
    title: 'Kenketa ( - )',
    definition: 'Bilduma batetik elementuak kentzea edo bi magnituderen arteko aldea adierazten duen eragiketa aritmetikoa.',
    category: 'Aljebra' as any,
  },
  times: {
    title: 'Biderketa ( ×, · )',
    definition: 'Zenbaki beraren batura errepikatua. Aljebran maiz puntu baten bidez edo aldamenean idatziz adierazten da.',
    category: 'Aljebra' as any,
  },
  divide: {
    title: 'Zatiketa ( ÷, / )',
    definition: 'Kantitate bat zati berdinetan banatzea. Biderketaren alderantzizko eragiketa.',
    category: 'Aljebra' as any,
  },
  pm: {
    title: 'Gehi/Gutxi ( ± )',
    definition: 'Kantitate batek balio positiboa zein negatiboa har dezakeela adierazten du.',
    category: 'Aljebra' as any,
  },
  fraccion: {
    title: 'Zatiki ( / )',
    definition: 'Zenbakitzailearen eta izendatzailearen arteko zatidura.',
    category: 'Aljebra' as any,
  },
  sistema_lineal: {
    title: 'Ekuazio Linealen Sistema',
    definition: 'Termino bakoitza konstante bat edo konstante baten eta ezezagun baten biderkadura den ekuazio-multzoa.',
    category: 'Aljebra' as any,
  },
  incognita: {
    title: 'Ezezaguna',
    definition: 'Balioa ezezaguna den eta ekuazio-sistema bat ebaztean zehaztu nahi den aldagaia.',
    category: 'Aljebra' as any,
  },
  menor: {
    title: 'Matrize baten Menorea',
    definition: 'Jatorrizko matrizetik errenkada eta zutabe kopuru jakin bat ezabatzean lortzen den azpimatrize karratuaren determinantea.',
    category: 'Aljebra' as any,
  },
  grado_libertad: {
    title: 'Askatasun-Gradua',
    definition: 'Sistema indeterminatu batean, soluzio orokorra adierazteko behar diren parametro independenteen kopurua.',
    category: 'Aljebra' as any,
  },

  // ANALISIA
  integral: {
    title: 'Integrala ( ∫ )',
    definition: 'Kurba baten azpiko azalera garbia adierazten du.',
    category: 'Analisi Matematikoa' as any,
  },
  limit: {
    title: 'Muga ( lim )',
    definition: 'Funtzio baten portaera ebaluatzen du bere aldagaiak puntu zehatz batera hurbiltzen denean.',
    category: 'Analisi Matematikoa' as any,
  },
  infinity: {
    title: 'Infinitua ( ∞ )',
    definition: 'Mugarik edo amaierarik gabeko zerbait deskribatzen duen kontzeptua.',
    category: 'Analisi Matematikoa' as any,
  },
  euler: {
    title: 'Eulerren Zenbakia ( e )',
    definition: 'Logaritmo naturalen oinarria. e ≈ 2.718 gisa definitzen den zenbaki transzendentea.',
    category: 'Analisi Matematikoa' as any,
  },
  imaginary: {
    title: 'Unitate Irudikaria ( i )',
    definition: 'Karratura igotzean -1 ematen duen zenbakia.',
    category: 'Analisi Matematikoa' as any,
  },
  composition: {
    title: 'Funtzioen Konposizioa ( ∘ )',
    definition: 'Funtzio baten emaitza beste funtzio baten sarrera gisa aplikatzea.',
    category: 'Analisi Matematikoa' as any,
  },
  derivada: {
    title: 'Deribatua ( f\' )',
    definition: 'Funtzio baten berehalako aldaketa-tasa neurtzen du. Ikuspegi geometrikotik ukitzailearen maldaren baliokidea da.',
    category: 'Analisi Matematikoa' as any,
  },
  diferencial: {
    title: 'Diferentziala ( dx )',
    definition: 'X aldagai independentean gertatutako aldaketa infinitesimala adierazten du.',
    category: 'Analisi Matematikoa' as any,
  },
  primitiva: {
    title: 'Primitiba ( F )',
    definition: 'F(x) funtzioa f(x)-ren primitiba da F(x)-ren deribatua zehazki f(x) bada.',
    category: 'Analisi Matematikoa' as any,
  },
  pendiente_secante: {
    title: 'Malda Ebakitzailea ( m_{sec} )',
    definition: 'Kurbaren bi puntu diskretu ebakiz kalkulatutako batez besteko aldaketa-tasa.',
    category: 'Analisi Matematikoa' as any,
  },
  tiende_a: {
    title: 'Hurbiltzen da ( → )',
    definition: 'Aldagai bat helburuko balio batera infinituki hurbiltzen dela adierazten du.',
    category: 'Analisi Matematikoa' as any,
  },

  // GEOMETRIA
  traza: {
    title: 'Puntu-Trazadura ( tr )',
    definition: 'Egitura sintetiko politipatu batean elementu geometriko batekin (zuzen edo plano) intziditzen duten oinarrizko domeinuko puntuen multzoa.',
    category: 'Geometria' as any,
  },
  incidencia: {
    title: 'Intzidentzia ( I )',
    definition: 'Egitura geometriko sintetiko batean puntu, zuzen eta planoen arteko posizio-erlazio primitiboa.',
    category: 'Geometria' as any,
  },
  congruencia: {
    title: 'Kongruentzia ( ≅ )',
    definition: 'Zuzenkien artean zein angeluen artean tamaina eta forma baliokidetasuna formalizatzen duen zurruntasun-erlazio primitiboa.',
    category: 'Geometria' as any,
  },
  perpendicular: {
    title: 'Perpendikulartasuna ( ⊥ )',
    definition: 'Elkarren artean angelu zuzen kongruenteak osatzen dituzten zuzen ebakitzaileen arteko erlazioa.',
    category: 'Geometria' as any,
  },
  paralelas: {
    title: 'Paralelotasuna ( ∥ )',
    definition: 'Puntu komunik partekatzen ez duten plano bereko zuzenen arteko erlazioa (traza disjuntuak).',
    category: 'Geometria' as any,
  },
  estar_entre: {
    title: 'Bitartekotasuna ( * )',
    definition: 'Zuzen bereko hiru punturen ordena lineala formalizatzen duen hiru aldagaiko oinarrizko erlazioa.',
    category: 'Geometria' as any,
  },
  producto_cruz: {
    title: 'Biderketa Bektoriala ( × )',
    definition: 'R³-ko eragiketa geometrikoa, bi bektore hartu eta biekiko ortogonala den hirugarren bat ematen duena.',
    category: 'Geometria' as any,
  },
  hipotenusa: {
    title: 'Hipotenusa',
    definition: 'Triangelu angeluzuzen baten luzera handieneko aldea, angelu zuzenaren aurrez aurre dagoena.',
    category: 'Geometria' as any,
  },
  pi: {
    title: 'Pi Zenbakia ( π )',
    definition: 'Zirkunferentzia baten luzeraren eta bere diametroaren arteko erlazio konstantea.',
    category: 'Geometria' as any,
  },

  // MULTZO-TEORIA
  in: {
    title: 'Kidetza ( ∈ )',
    definition: 'Elementu bat multzo batekin erlazionatzen du, elementua bilduma horren parte dela adieraziz.',
    category: 'Multzo-Teoria' as any,
  },
  notin: {
    title: 'Ez-kidetza ( ∉ )',
    definition: 'Elementu bat multzo jakin baten parte ez dela esplizituki adierazten du.',
    category: 'Multzo-Teoria' as any,
  },
  subset: {
    title: 'Azpimultzoa ( ⊂ )',
    definition: 'Multzo bateko elementu guztiak beste multzo baten barruan guztiz jasota daudela adierazten du.',
    category: 'Multzo-Teoria' as any,
  },
  union: {
    title: 'Multzoen Elkarketa ( ∪ )',
    definition: 'Bi multzotako elementuak konbinatuz bien elementu guztiak dituen multzo berri bat sortzen duen eragiketa.',
    category: 'Multzo-Teoria' as any,
  },
  intersection: {
    title: 'Multzoen Ebakidura ( ∩ )',
    definition: 'Bi multzoek partekatzen dituzten elementuak soilik dituen multzo berria sortzen duen eragiketa.',
    category: 'Multzo-Teoria' as any,
  },
  emptyset: {
    title: 'Multzo Hutsa ( ∅ )',
    definition: 'Batere elementurik ez duen multzo bakarra.',
    category: 'Multzo-Teoria' as any,
  },
  real_numbers: {
    title: 'Zenbaki Errealak ( ℝ )',
    definition: 'Zenbaki arrazional eta irrazional guztien multzoa.',
    category: 'Multzo-Teoria' as any,
  },
  natural_numbers: {
    title: 'Zenbaki Naturalak ( ℕ )',
    definition: 'Objektuak zenbatzeko erabiltzen ditugun zenbakien multzoa, batetik edo zerotik aurrera.',
    category: 'Multzo-Teoria' as any,
  },
  integers: {
    title: 'Zenbaki Osoak ( ℤ )',
    definition: 'Naturalak, zeroa eta zenbaki negatiboak biltzen dituen multzoa.',
    category: 'Multzo-Teoria' as any,
  },
  rational_numbers: {
    title: 'Zenbaki Arrazionalak ( ℚ )',
    definition: 'Bi osoren zatidura zehatz gisa adieraz daitezkeen zenbakien multzoa.',
    category: 'Multzo-Teoria' as any,
  },
  complex_numbers: {
    title: 'Zenbaki Konplexuak ( ℂ )',
    definition: 'Zati erreal batekin eta zati irudikari batekin eraikitzen diren zenbakien multzoa.',
    category: 'Multzo-Teoria' as any,
  },
  setminus: {
    title: 'Multzoen Diferentzia ( ∖ )',
    definition: 'Lehenengoan dauden baina bigarrenean ez dauden elementuen multzoa (A ken B).',
    category: 'Multzo-Teoria' as any,
  },
  set_brackets: {
    title: 'Multzo-Giltzak ( { } )',
    definition: 'Multzo bat osatzen duten elementuak esplizituki zerrendatzeko erabiltzen diren mugatzaileak.',
    category: 'Multzo-Teoria' as any,
  },
  conjunto_potencia: {
    title: 'Potentzia-Multzoa / Multzoaren Parteak ( 𝒫 )',
    definition: 'Emandako A multzo baten azpimultzo posible guztien multzoa, multzo hutsa eta A bera barne.',
    category: 'Multzo-Teoria' as any,
  },
  mapeo_funcion: {
    title: 'Funtzioa / Aplikazioa ( f: A → B )',
    definition: 'Hasierako A multzoko (domeinuko) elementu bakoitzari amaierako B multzoko (kodomeinuko) elementu bakar bat esleitzen dion korrespondentzia matematikoa.',
    category: 'Multzo-Teoria' as any,
  },
  mapsto: {
    title: 'Esleipena / Mapeatzea ( ↦ )',
    definition: 'Domeinuko elementu jakin bati (x) kodomeinuko balio zehatz bat (f(x)) esleitzen dion korrespondentzia-arau esplizitua adierazten du.',
    category: 'Multzo-Teoria' as any,
  },
};
