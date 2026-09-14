// =====================================================
// NOSSA CASA ❤️
// =====================================================

// =====================================================
// CONFIGURAÇÕES
// =====================================================

const GRID_TILE = 8;
const FURNITURE_GAP = 2;

// Guarda quais móveis já "nasceram" (já tocaram a
// animação de aparecer), pra não animar de novo
// toda vez que a gente re-renderiza a casa.
const animatedFurniture = new Set();

// Guarda o valor de moedas mostrado da última vez,
// só pra saber quando fazer o "pulinho" no contador.
let lastDisplayedCoins = null;


// =====================================================
// ESTADO DO JOGO
// =====================================================

const state = {

  house: 1,

  coins: 150,

  rate: 0,

  purchased: [],

  characters: [],

  startChoice: null,

  started: false

};


// =====================================================
// MÓVEIS
// =====================================================

// =====================================================
// ÍCONE (emoji OU imagem de sprite)
// =====================================================

function isImageIcon(icon) {

  return (
    typeof icon === "string" &&
    /\.(png|jpg|jpeg|gif|svg)$/i.test(
      icon
    )
  );

}


const furniture = [

  {
    id: "chair",
    name: "Cadeira",
    icon: "assets/furniture/chair.png",
    price: 30,
    rate: 2,
    w: 4,
    h: 4,
    quantity: 4
  },

  {
    id: "table",
    name: "Mesa",
    icon: "assets/furniture/table.png",
    price: 70,
    rate: 3,
    w: 8,
    h: 4,
    quantity: 1
  },

  {
    id: "bed",
    name: "Cama",
    icon: "assets/furniture/bed.png",
    price: 120,
    rate: 4,
    w: 12,
    h: 14,
    quantity: 1
  },

  {
    id: "sofa",
    name: "Sofá",
    icon: "assets/furniture/sofa.png",
    price: 180,
    rate: 5,
    w: 9,
    h: 6,
    quantity: 1
  },

  {
    id: "tv",
    name: "TV",
    icon: "assets/furniture/tv.png",
    price: 260,
    rate: 6,
    w: 7,
    h: 4,
    quantity: 1
  },

  {
    id: "fridge",
    name: "Geladeira",
    icon: "assets/furniture/fridge.png",
    price: 350,
    rate: 7,
    w: 5,
    h: 9,
    quantity: 1
  },

  {
    id: "wardrobe",
    name: "Guarda-roupa",
    icon: "assets/furniture/wardrobe.png",
    price: 500,
    rate: 8,
    w: 8,
    h: 10,
    quantity: 1
  },

  {
    id: "plant",
    name: "Planta",
    icon: "assets/furniture/plant.png",
    price: 650,
    rate: 10,
    w: 4,
    h: 8,
    quantity: 2
  },

  {
    id: "armario",
    name: "Armário",
    icon: "assets/furniture/armario.png",
    price: 400,
    rate: 10,
    w: 8,
    h: 7,
    quantity: 2
  },

  // =====================================================
  // ITENS DE BANHEIRO (novos)
  // =====================================================

  {
    id: "bathtub",
    name: "Banheira",
    icon: "assets/furniture/bathtub.png",
    price: 200,
    rate: 5,
    w: 12,
    h: 6,
    quantity: 1
  },

  {
    id: "sink",
    name: "Pia",
    icon: "assets/furniture/sink.png",
    price: 90,
    rate: 3,
    w: 6,
    h: 4,
    quantity: 1
  },

  {
    id: "toilet",
    name: "Vaso Sanitário",
    icon: "assets/furniture/toilet.png",
    price: 60,
    rate: 2,
    w: 4,
    h: 8,
    quantity: 1
  },

  // =====================================================
  // NOVOS ITENS (quarto, sala, cozinha, banheiro)
  // =====================================================

  {
    id: "nightstand",
    name: "Criado-mudo",
    icon: "assets/furniture/nightstand.png",
    price: 50,
    rate: 2,
    w: 4,
    h: 5,
    quantity: 2
  },

  {
    id: "dresser",
    name: "Cômoda",
    icon: "assets/furniture/dresser.png",
    price: 150,
    rate: 4,
    w: 7,
    h: 6,
    quantity: 1
  },

  {
    id: "bookshelf",
    name: "Estante",
    icon: "assets/furniture/bookshelf.png",
    price: 300,
    rate: 6,
    w: 7,
    h: 7,
    quantity: 1
  },

  {
    id: "lamp",
    name: "Luminária",
    icon: "assets/furniture/lamp.png",
    price: 80,
    rate: 3,
    w: 3,
    h: 8,
    quantity: 2
  },

  {
    id: "painting",
    name: "Quadro",
    icon: "assets/furniture/painting.png",
    price: 60,
    rate: 2,
    w: 6,
    h: 3,
    quantity: 2
  },

  {
    id: "rug",
    name: "Tapete",
    icon: "assets/furniture/rug.png",
    price: 100,
    rate: 3,
    w: 12,
    h: 6,
    quantity: 1
  },

  {
    id: "curtain",
    name: "Cortina",
    icon: "assets/furniture/curtain.png",
    price: 70,
    rate: 2,
    w: 6,
    h: 6,
    quantity: 1
  },

  {
    id: "stove",
    name: "Fogão",
    icon: "assets/furniture/stove.png",
    price: 300,
    rate: 6,
    w: 5,
    h: 7,
    quantity: 1
  },

  {
    id: "kitchensink",
    name: "Pia de Cozinha",
    icon: "assets/furniture/kitchensink.png",
    price: 150,
    rate: 4,
    w: 6,
    h: 3,
    quantity: 1
  }

];


// =====================================================
// PERSONAGENS
// =====================================================

const people = [

  {
    name: "Lucas",
    icon: "👦",
    price: 1000
  },

  {
    name: "Arthur",
    icon: "👦",
    price: 2000
  },

  {
    name: "Aurora",
    icon: "👶",
    price: 5000
  }

];


// =====================================================
// CASAS
// =====================================================

const houseData = {

  // ===================================================
  // CASA 2
  // ===================================================

  /*
    Planta com corredor central: a porta fica na
    parede de baixo do corredor, e dele dá pra
    chegar em qualquer cômodo da casa.

    Índices ficam iguais aos da versão antiga
    (Sala = 0, Quarto = 1) pra não bagunçar a
    lógica de compra dos móveis.
  */

  2: {

    rooms: [

      // 0
      {
        name: "Sala + Cozinha",
        x: 0,
        y: 0,
        w: 40,
        h: 60
      },

      // 1
      {
        name: "Quarto",
        x: 0,
        y: 60,
        w: 40,
        h: 40
      },

      // 2 — corredor central, liga tudo à porta
      {
        name: "Corredor",
        x: 40,
        y: 0,
        w: 20,
        h: 100,
        type: "corridor",
        entrance: {
          side: "bottom",
          from: 40,
          to: 60
        }
      },

      // 3
      {
        name: "Banheiro",
        x: 60,
        y: 0,
        w: 40,
        h: 35
      },

      // 4
      {
        name: "Área",
        x: 60,
        y: 35,
        w: 40,
        h: 65
      }

    ]

  },


  // ===================================================
  // CASA 3
  // ===================================================

  /*
    CASA 3 = GRADE 30 x 30

    O "Hall + Escada" é o corredor da casa: a porta
    de entrada fica nele, embaixo, e ele dá acesso
    à suíte, ao quarto/banheiro e à sala.
  */

  3: {

    rooms: [

      // 0 — hall de entrada / escada (corredor)
      {
        name: "Hall + Escada",
        x: 0,
        y: 0,
        w: 8,
        h: 30,
        type: "corridor",
        entrance: {
          side: "bottom",
          from: 2,
          to: 6
        }
      },

      // 1 — suíte
      {
        name: "Suíte",
        x: 8,
        y: 0,
        w: 22,
        h: 12
      },

      // 2 — quarto
      {
        name: "Quarto",
        x: 8,
        y: 12,
        w: 10,
        h: 8
      },

      // 3 — banheiro
      {
        name: "Banheiro",
        x: 18,
        y: 12,
        w: 12,
        h: 8
      },

      // 4 — sala + cozinha
      {
        name: "Sala + Cozinha",
        x: 8,
        y: 20,
        w: 22,
        h: 10
      }

    ]

  }

};


// =====================================================
// CASA 1
// =====================================================

/*
  Casa 1 — versão simples, só com os 3 cômodos
  básicos. Depois dá pra desenhar uma planta mais
  elaborada aqui; por enquanto o importante é
  Quarto, Banheiro e Sala + Cozinha existirem com
  índices fixos (0, 1, 2) pra combinar com a
  lógica de compra dos móveis.
*/

function getHouse1Rooms() {

  return [

    // 0 — quarto
    {
      name: "Quarto",
      x: 0,
      y: 0,
      w: 100,
      h: 50
    },

    // 1 — banheiro
    {
      name: "Banheiro",
      x: 70,
      y: 50,
      w: 30,
      h: 50
    },

    // 2 — sala + cozinha
    {
      name: "Sala + Cozinha",
      x: 0,
      y: 50,
      w: 70,
      h: 50
    }

  ];

}


// =====================================================
// FORMATAÇÃO
// =====================================================

function money(value) {

  return value.toLocaleString(
    "pt-BR"
  );

}


// =====================================================
// TAMANHO DO MÓVEL
// =====================================================

function getFurnitureSize(item, data) {

  const rotation =
    item.rotation || 0;

  if (
    rotation === 90 ||
    rotation === 270
  ) {

    return {

      w: data.h,

      h: data.w

    };

  }

  return {

    w: data.w,

    h: data.h

  };

}


// =====================================================
// TAMANHO DA GRADE DO CÔMODO
// =====================================================

function getRoomGridSize(roomElement) {

  const columns =
    parseInt(
      roomElement.dataset.columns
    ) || Math.floor(
      roomElement.clientWidth /
      GRID_TILE
    );


  const rows =
    parseInt(
      roomElement.dataset.rows
    ) || Math.floor(
      roomElement.clientHeight /
      GRID_TILE
    );


  return {

    columns: columns,

    rows: rows

  };

}


// =====================================================
// INICIAR JOGO
// =====================================================

function startGame(choice) {

  state.startChoice =
    choice;

  state.house =
    1;

  state.coins =
    150;

  state.rate =
    0;

  state.purchased =
    [];

  state.characters =
    [];

  state.started =
    true;


  const choiceScreen =
    document.getElementById(
      "choiceScreen"
    );


  if (
    choiceScreen
  ) {

    choiceScreen.classList.add(
      "hidden"
    );

  }


  render();

}


// =====================================================
// RENDER PRINCIPAL
// =====================================================

function render() {

  updateMoneyDisplay();

  renderHouse();

  renderShop();

  renderCharacters();

}


// =====================================================
// ATUALIZAR MOEDAS / TAXA
// =====================================================

/*
  Isso é chamado toda hora (a cada segundo) então
  fica separado do render() completo: só mexe no
  contador, sem tocar na casa — assim um móvel que
  está sendo arrastado não é "resetado" no meio do
  arrasto por causa do tique das moedas.
*/

function updateMoneyDisplay() {

  const coins =
    document.getElementById(
      "coins"
    );


  const rate =
    document.getElementById(
      "rate"
    );


  if (
    coins
  ) {

    coins.textContent =
      money(
        state.coins
      );


    // "Pulinho" no contador quando as moedas
    // aumentam (ganhando /s ou comprando algo)

    if (
      lastDisplayedCoins !== null &&
      state.coins !==
        lastDisplayedCoins
    ) {

      const moneyBox =
        coins.closest(
          ".money"
        );


      if (
        moneyBox
      ) {

        moneyBox.classList.remove(
          "bump"
        );


        // força o navegador a "esquecer" a
        // animação antes de tocar de novo

        void moneyBox.offsetWidth;


        moneyBox.classList.add(
          "bump"
        );

      }

    }


    lastDisplayedCoins =
      state.coins;

  }


  if (
    rate
  ) {

    rate.textContent =
      state.rate;

  }

}


// =====================================================
// RENDER DA CASA
// =====================================================

function renderHouse() {

  const house =
    document.getElementById(
      "house"
    );


  if (
    !house
  ) {

    return;

  }


  house.innerHTML =
    "";


  // Cada casa tem seu próprio tamanho (casa 1 é a
  // menor, casa 3 é a maior) — a classe controla
  // isso no CSS.

  house.className =
    "house house-" +
    state.house;


  let rooms;


  if (
    state.house === 1
  ) {

    rooms =
      getHouse1Rooms();

  }
  else {

    rooms =
      houseData[
        state.house
      ].rooms;

  }


  rooms.forEach(
    (
      room,
      roomIndex
    ) => {

      const roomElement =
        document.createElement(
          "div"
        );


      roomElement.className =
        room.type === "corridor"
          ? "room room-corridor"
          : "room";


      roomElement.dataset.room =
        roomIndex;


      // =================================================
      // POSIÇÃO DO CÔMODO
      // =================================================

      roomElement.style.position =
        "absolute";


      /*
        CASA 3 usa grade 30x30.

        CASA 1 e CASA 2 usam porcentagem 100x100.
      */

      const HOUSE_GRID =
        state.house === 3
          ? 30
          : 100;


      roomElement.style.left =
        `${
          (room.x / HOUSE_GRID) * 100
        }%`;


      roomElement.style.top =
        `${
          (room.y / HOUSE_GRID) * 100
        }%`;


      roomElement.style.width =
        `${
          (room.w / HOUSE_GRID) * 100
        }%`;


      roomElement.style.height =
        `${
          (room.h / HOUSE_GRID) * 100
        }%`;


      // =================================================
      // ANEXAR O CÔMODO JÁ AQUI
      // =================================================

      /*
        ISSO PRECISA acontecer ANTES de medir
        clientWidth/clientHeight logo abaixo — um
        elemento fora da página sempre mede 0x0.
        Era exatamente esse o motivo dos móveis
        não conseguirem sair do canto: a grade
        interna sempre virava "1 coluna x 1 linha".
      */

      house.appendChild(
        roomElement
      );


      // =================================================
      // GRADE INTERNA
      // =================================================

      /*
        A grade é calculada pelo tamanho REAL
        do cômodo.

        Cada quadrado possui GRID_TILE pixels.
      */

      const roomColumns =
        Math.max(
          1,
          Math.round(
            roomElement.clientWidth /
            GRID_TILE
          )
        );


      const roomRows =
        Math.max(
          1,
          Math.round(
            roomElement.clientHeight /
            GRID_TILE
          )
        );


      roomElement.dataset.columns =
        roomColumns;


      roomElement.dataset.rows =
        roomRows;


      // =================================================
      // NOME DO CÔMODO
      // =================================================

      if (
        !room.noTitle
      ) {

        const roomTitle =
          document.createElement(
            "div"
          );


        roomTitle.className =
          "room-title";


        roomTitle.textContent =
          room.name;


        roomElement.appendChild(
          roomTitle
        );

      }


      // =================================================
      // PORTA DE ENTRADA
      // =================================================

      if (
        room.entrance
      ) {

        const HOUSE_GRID_DOOR =
          state.house === 3
            ? 30
            : 100;


        const door =
          document.createElement(
            "div"
          );


        door.className =
          "door-marker door-" +
          room.entrance.side;


        const doorFrom =
          room.entrance.from;


        const doorTo =
          room.entrance.to;


        if (
          room.entrance.side === "bottom" ||
          room.entrance.side === "top"
        ) {

          door.style.left =
            `${(doorFrom / HOUSE_GRID_DOOR) * 100}%`;


          door.style.width =
            `${((doorTo - doorFrom) / HOUSE_GRID_DOOR) * 100}%`;

        }
        else {

          door.style.top =
            `${(doorFrom / HOUSE_GRID_DOOR) * 100}%`;


          door.style.height =
            `${((doorTo - doorFrom) / HOUSE_GRID_DOOR) * 100}%`;

        }


        house.appendChild(
          door
        );

      }


      // =================================================
      // MÓVEIS DO CÔMODO
      // =================================================

      state.purchased
        .filter(
          item =>
            item.house ===
              state.house &&
            item.room ===
              roomIndex
        )
        .forEach(
          item => {

            const data =
              furniture.find(
                furnitureItem =>
                  furnitureItem.id ===
                  item.id
              );


            if (
              !data
            ) {

              return;

            }


            const furnitureElement =
              document.createElement(
                "div"
              );


            furnitureElement.className =
              "furniture";


            if (
              !animatedFurniture.has(
                item.uid
              )
            ) {

              furnitureElement.classList.add(
                "furniture-new"
              );


              animatedFurniture.add(
                item.uid
              );

            }


            if (
              isImageIcon(
                data.icon
              )
            ) {

              const iconImage =
                document.createElement(
                  "img"
                );


              iconImage.src =
                data.icon;


              iconImage.alt =
                data.name;


              iconImage.className =
                "sprite-icon";


              iconImage.draggable =
                false;


              furnitureElement.appendChild(
                iconImage
              );

            }

            else {

              furnitureElement.textContent =
                data.icon;

            }


            furnitureElement.dataset.uid =
              item.uid;


            furnitureElement.style.position =
              "absolute";


            furnitureElement.style.zIndex =
              "20";


            furnitureElement.style.cursor =
              "grab";


            furnitureElement.style.border =
              "none";


            furnitureElement.style.outline =
              "none";


            furnitureElement.style.boxShadow =
              "none";


            furnitureElement.style.userSelect =
              "none";


            furnitureElement.style.touchAction =
              "none";


            // =================================================
            // TAMANHO VISUAL
            // =================================================

            const visualSize =
              getFurnitureSize(
                item,
                data
              );


            furnitureElement.style.width =
              (
                visualSize.w *
                GRID_TILE -
                FURNITURE_GAP
              ) +
              "px";


            furnitureElement.style.height =
              (
                visualSize.h *
                GRID_TILE -
                FURNITURE_GAP
              ) +
              "px";


            furnitureElement.style.left =
              `${
                item.x *
                GRID_TILE +
                FURNITURE_GAP
              }px`;


            furnitureElement.style.top =
              `${
                item.y *
                GRID_TILE +
                FURNITURE_GAP
              }px`;


            furnitureElement.style.transformOrigin =
              "center center";


            furnitureElement.style.transform =
              `rotate(${
                item.rotation || 0
              }deg)`;

            const rotateHandle =
              document.createElement(
                "div"
              );


            rotateHandle.className =
              "rotate-handle";


            rotateHandle.textContent =
              "↻";


            // gira junto com o móvel pra ficar sempre
            // "de pé" pro jogador ler

            rotateHandle.style.transform =
              `rotate(${
                -(item.rotation || 0)
              }deg)`;


            rotateHandle.addEventListener(
              "pointerdown",
              event => {

                event.preventDefault();

                event.stopPropagation();

              }
            );


            rotateHandle.addEventListener(
              "click",
              event => {

                event.preventDefault();

                event.stopPropagation();


                rotateFurniture(
                  item,
                  data,
                  roomElement
                );

              }
            );


            furnitureElement.appendChild(
              rotateHandle
            );


            // =================================================
            // ARRASTAR MÓVEL
            //
            // Usa Pointer Events (funciona com mouse,
            // caneta e dedo/touch) + "captura de ponteiro":
            // uma vez que o dedo/mouse aperta o móvel, TODO
            // o movimento seguinte é entregue direto pra esse
            // elemento, não importa pra onde o dedo escorregue.
            // É isso que resolve o arrasto não funcionar em
            // celular/tablet.
            // =================================================

            let dragMoved =
              false;


            let dragStartX =
              0;


            let dragStartY =
              0;


            let dragOriginalX =
              item.x;


            let dragOriginalY =
              item.y;


            let dragOriginalRoom =
              item.room;


            let dragGrabOffsetX =
              0;


            let dragGrabOffsetY =
              0;


            furnitureElement.addEventListener(
              "pointerdown",
              event => {

                if (
                  event.button !== undefined &&
                  event.button !== 0
                ) {

                  return;

                }


                event.preventDefault();

                event.stopPropagation();


                try {

                  furnitureElement.setPointerCapture(
                    event.pointerId
                  );

                }

                catch (
                  error
                ) {

                  // alguns navegadores mais antigos não
                  // têm setPointerCapture; sem problema,
                  // o arrasto ainda funciona sem ela.

                }


                const furnitureRect =
                  furnitureElement.getBoundingClientRect();


                dragMoved =
                  false;


                dragStartX =
                  event.clientX;


                dragStartY =
                  event.clientY;


                dragOriginalX =
                  item.x;


                dragOriginalY =
                  item.y;


                dragOriginalRoom =
                  item.room;


                dragGrabOffsetX =
                  event.clientX -
                  furnitureRect.left;


                dragGrabOffsetY =
                  event.clientY -
                  furnitureRect.top;


                furnitureElement.style.cursor =
                  "grabbing";


                furnitureElement.style.zIndex =
                  "9999";


                furnitureElement.style.border =
                  "3px solid #fff";

              }
            );


            furnitureElement.addEventListener(
              "pointermove",
              event => {

                if (
                  !furnitureElement.hasPointerCapture ||
                  !furnitureElement.hasPointerCapture(
                    event.pointerId
                  )
                ) {

                  return;

                }


                event.preventDefault();


                const deltaX =
                  event.clientX -
                  dragStartX;


                const deltaY =
                  event.clientY -
                  dragStartY;


                if (
                  Math.abs(deltaX) > 5 ||
                  Math.abs(deltaY) > 5
                ) {

                  dragMoved =
                    true;

                }


                if (
                  !dragMoved
                ) {

                  return;

                }


                const currentRoom =
                  document.querySelectorAll(
                    ".room"
                  )[
                    dragOriginalRoom
                  ];


                if (
                  !currentRoom
                ) {

                  return;

                }


                const grid =
                  getRoomGridSize(
                    currentRoom
                  );


                const currentSize =
                  getFurnitureSize(
                    item,
                    data
                  );


                const roomRect =
                  currentRoom.getBoundingClientRect();


                const roomStyle =
                  getComputedStyle(
                    currentRoom
                  );


                const borderLeft =
                  parseFloat(
                    roomStyle.borderLeftWidth
                  ) || 0;


                const borderTop =
                  parseFloat(
                    roomStyle.borderTopWidth
                  ) || 0;


                const mouseX =
                  event.clientX -
                  roomRect.left -
                  borderLeft -
                  dragGrabOffsetX;


                const mouseY =
                  event.clientY -
                  roomRect.top -
                  borderTop -
                  dragGrabOffsetY;


                let newX =
                  Math.floor(
                    (mouseX /
                    roomRect.width) *
                    grid.columns
                  );


                let newY =
                  Math.floor(
                    (mouseY /
                    roomRect.height) *
                    grid.rows
                  );


                const maxX =
                  Math.max(
                    0,
                    grid.columns -
                    currentSize.w
                  );


                const maxY =
                  Math.max(
                    0,
                    grid.rows -
                    currentSize.h
                  );


                newX =
                  Math.max(
                    0,
                    Math.min(
                      newX,
                      maxX
                    )
                  );


                newY =
                  Math.max(
                    0,
                    Math.min(
                      newY,
                      maxY
                    )
                  );


                item.x =
                  newX;


                item.y =
                  newY;


                furnitureElement.style.left =
                  `${
                    newX *
                    GRID_TILE +
                    FURNITURE_GAP
                  }px`;


                furnitureElement.style.top =
                  `${
                    newY *
                    GRID_TILE +
                    FURNITURE_GAP
                  }px`;

              }
            );


            const finishDrag =
              event => {

                if (
                  furnitureElement.hasPointerCapture &&
                  furnitureElement.hasPointerCapture(
                    event.pointerId
                  )
                ) {

                  furnitureElement.releasePointerCapture(
                    event.pointerId
                  );

                }


                furnitureElement.style.cursor =
                  "grab";


                furnitureElement.style.zIndex =
                  "20";


                furnitureElement.style.border =
                  "none";


                furnitureElement.style.outline =
                  "none";


                furnitureElement.style.boxShadow =
                  "none";


                // CLIQUE SEM ARRASTAR = GIRAR
                // (o botão de girar já resolve isso
                // sozinho, isso aqui é só um bônus)

                if (
                  !dragMoved
                ) {

                  rotateFurniture(
                    item,
                    data,
                    roomElement
                  );

                  return;

                }


                // =========================================
                // ENCONTRAR CÔMODO DE DESTINO
                // =========================================

                const roomsElements =
                  document.querySelectorAll(
                    ".room"
                  );


                let targetRoom =
                  null;


                roomsElements.forEach(
                  (
                    roomElementTarget,
                    index
                  ) => {

                    const rect =
                      roomElementTarget
                        .getBoundingClientRect();


                    if (
                      event.clientX >=
                        rect.left &&
                      event.clientX <=
                        rect.right &&
                      event.clientY >=
                        rect.top &&
                      event.clientY <=
                        rect.bottom
                    ) {

                      targetRoom = {

                        element:
                          roomElementTarget,

                        index:
                          index

                      };

                    }

                  }
                );


                if (
                  targetRoom
                ) {

                  const target =
                    targetRoom.element;


                  const rect =
                    target.getBoundingClientRect();


                  const style =
                    getComputedStyle(
                      target
                    );


                  const borderLeft =
                    parseFloat(
                      style.borderLeftWidth
                    ) || 0;


                  const borderTop =
                    parseFloat(
                      style.borderTopWidth
                    ) || 0;


                  const mouseX =
                    event.clientX -
                    rect.left -
                    borderLeft -
                    dragGrabOffsetX;


                  const mouseY =
                    event.clientY -
                    rect.top -
                    borderTop -
                    dragGrabOffsetY;


                  const targetGrid =
                    getRoomGridSize(
                      target
                    );


                  const targetSize =
                    getFurnitureSize(
                      item,
                      data
                    );


                  let newX =
                    Math.floor(
                      (mouseX /
                      rect.width) *
                      targetGrid.columns
                    );


                  let newY =
                    Math.floor(
                      (mouseY /
                      rect.height) *
                      targetGrid.rows
                    );


                  const maxX =
                    Math.max(
                      0,
                      targetGrid.columns -
                      targetSize.w
                    );


                  const maxY =
                    Math.max(
                      0,
                      targetGrid.rows -
                      targetSize.h
                    );


                  newX =
                    Math.max(
                      0,
                      Math.min(
                        newX,
                        maxX
                      )
                    );


                  newY =
                    Math.max(
                      0,
                      Math.min(
                        newY,
                        maxY
                      )
                    );


                  item.room =
                    targetRoom.index;


                  item.x =
                    newX;


                  item.y =
                    newY;

                }

                else {

                  // Soltou fora da casa: volta pro
                  // lugar de antes.

                  item.room =
                    dragOriginalRoom;


                  item.x =
                    dragOriginalX;


                  item.y =
                    dragOriginalY;

                }


                dragMoved =
                  false;


                render();

              };


            furnitureElement.addEventListener(
              "pointerup",
              finishDrag
            );


            furnitureElement.addEventListener(
              "pointercancel",
              finishDrag
            );


            // =================================================
            // ADICIONAR MÓVEL AO CÔMODO
            // =================================================

            roomElement.appendChild(
              furnitureElement
            );

          }

        );


      // =================================================
      // (o cômodo já foi anexado à casa lá em cima,
      // antes de medir a grade interna — ver
      // comentário "ANEXAR O CÔMODO JÁ AQUI")

    }
  );


  renderCharactersInHouse(
    house
  );


  fitHouseToScreen();

}


// =====================================================
// AJUSTAR TAMANHO DA CASA NA TELA
// =====================================================

/*
  Cada casa tem um tamanho de projeto fixo (definido
  no CSS: .house-1, .house-2, .house-3). Essa função
  calcula o "zoom" pra ela caber na tela do usuário —
  encolhendo a casa inteira (móveis incluídos, já que
  são filhos dela) sem bagunçar a proporção entre eles.
*/

function fitHouseToScreen() {

  const house =
    document.getElementById(
      "house"
    );


  const area =
    document.querySelector(
      ".house-area"
    );


  if (
    !house ||
    !area
  ) {

    return;

  }


  // zera o zoom antes de medir, senão a medição
  // pega o tamanho já encolhido de uma vez anterior

  house.style.transform =
    "scale(1)";


  const houseWidth =
    house.offsetWidth;


  const houseHeight =
    house.offsetHeight;


  const areaRect =
    area.getBoundingClientRect();


  const padding =
    40;


  const availableWidth =
    areaRect.width -
    padding;


  const availableHeight =
    areaRect.height -
    padding;


  let scale =
    Math.min(
      1,
      availableWidth /
        houseWidth,
      availableHeight /
        houseHeight
    );


  if (
    !isFinite(scale) ||
    scale <= 0
  ) {

    scale =
      1;

  }


  house.style.transform =
    `scale(${scale})`;

}


window.addEventListener(
  "resize",
  () => {

    fitHouseToScreen();

  }
);


// =====================================================
// GIRAR MÓVEL
// =====================================================

function rotateFurniture(
  item,
  data,
  roomElement
) {

  item.rotation =
    (
      (item.rotation || 0) +
      90
    ) % 360;


  const size =
    getFurnitureSize(
      item,
      data
    );


  const grid =
    getRoomGridSize(
      roomElement
    );


  const maxX =
    Math.max(
      0,
      grid.columns -
      size.w
    );


  const maxY =
    Math.max(
      0,
      grid.rows -
      size.h
    );


  item.x =
    Math.max(
      0,
      Math.min(
        item.x,
        maxX
      )
    );


  item.y =
    Math.max(
      0,
      Math.min(
        item.y,
        maxY
      )
    );


  render();

}


// =====================================================
// PERSONAGENS DENTRO DA CASA
// =====================================================

function renderCharactersInHouse(
  house
) {

  if (
    !state.characters.length
  ) {

    return;

  }


  // ===================================================
  // CASA 1
  // ===================================================

  if (
    state.house === 1
  ) {

    const character =
      document.createElement(
        "div"
      );


    character.className =
      "character";


    character.textContent =
      state.startChoice === "dele"
        ? "👦"
        : "👩";


    character.style.position =
      "absolute";


    character.style.left =
      "46%";


    character.style.top =
      "35%";


    character.title =
      state.startChoice === "dele"
        ? "Ele"
        : "Ela";


    house.appendChild(
      character
    );

  }


  // ===================================================
  // CASA 2
  // ===================================================

  if (
    state.house === 2
  ) {

    const couple =
      document.createElement(
        "div"
      );


    couple.className =
      "character-couple";


    couple.innerHTML =
      "👦 ❤️ 👩";


    couple.style.position =
      "absolute";


    couple.style.left =
      "38%";


    couple.style.top =
      "42%";


    house.appendChild(
      couple
    );

  }


  // ===================================================
  // CASA 3
  // ===================================================

  if (
    state.house === 3
  ) {

    const family =
      document.createElement(
        "div"
      );


    family.className =
      "character-family";


    let content =
      "👦 👩";


    if (
      state.characters.includes(
        "Lucas"
      )
    ) {

      content +=
        " 👦";

    }


    if (
      state.characters.includes(
        "Arthur"
      )
    ) {

      content +=
        " 👦";

    }


    if (
      state.characters.includes(
        "Aurora"
      )
    ) {

      content +=
        " 👶";

    }


    family.innerHTML =
      content;


    family.style.position =
      "absolute";


    family.style.left =
      "30%";


    family.style.top =
      "35%";


    house.appendChild(
      family
    );

  }

}


// =====================================================
// LOJA
// =====================================================

function renderShop() {

  const shop =
    document.getElementById(
      "shop"
    );


  if (
    !shop
  ) {

    return;

  }


  shop.innerHTML =
    "";


  furniture.forEach(
    item => {

      const purchased =
        state.purchased.filter(
          p =>
            p.id ===
              item.id &&
            p.house ===
              state.house
        ).length;


      const maxQuantity =
        item.quantity || 1;


      const limitReached =
        purchased >=
        maxQuantity;


      const button =
        document.createElement(
          "button"
        );


      button.className =
        "shop-item";


      button.innerHTML = `

        <span class="shop-icon">
          ${
            isImageIcon(item.icon)
              ? `<img src="${item.icon}" alt="${item.name}" class="sprite-icon">`
              : item.icon
          }
        </span>

        <span class="shop-name">
          ${item.name}
        </span>

        <span class="shop-price">
          🪙 ${money(item.price)} cada
        </span>

        <span class="shop-rate">
          +${item.rate}/s
        </span>

        <span class="shop-size">
          ${item.w}x${item.h}
        </span>

        <span class="shop-quantity">
          ${purchased}/${maxQuantity}
        </span>

      `;


      if (
        limitReached
      ) {

        button.disabled =
          true;


        button.classList.add(
          "purchased"
        );

      }


      button.onclick =
        () => {

          buyFurniture(
            item
          );

        };


      shop.appendChild(
        button
      );

    }
  );

}


// =====================================================
// COMPRAR MÓVEL
// =====================================================

function buyFurniture(
  item
) {

  const maxQuantity =
    item.quantity || 1;


  const currentQuantity =
    state.purchased.filter(
      p =>
        p.id ===
          item.id &&
        p.house ===
          state.house
    ).length;


  if (
    currentQuantity >=
    maxQuantity
  ) {

    showMessage(
      `Você já possui o máximo de ${item.name}.`
    );

    return;

  }


  if (
    state.coins <
    item.price
  ) {

    showMessage(
      "Você ainda não tem moedas suficientes. 🪙"
    );

    return;

  }


  state.coins -=
    item.price;


  // ===================================================
  // DEFINIR CÔMODO
  // ===================================================

  let room =
    0;


  // ===================================================
  // CASA 1
  // ===================================================

  if (
    state.house === 1
  ) {

    if (
      item.id === "bed" ||
      item.id === "nightstand" ||
      item.id === "dresser"
    ) {

      room =
        0;

    }

    else if (
      item.id === "bathtub" ||
      item.id === "sink" ||
      item.id === "toilet" ||
      item.id === "curtain"
    ) {

      // Banheiro é o índice 1 na casa 1

      room =
        1;

    }

    else {

      // Sala + Cozinha é o índice 2 na
      // casa 1 (3 cômodos: quarto, banheiro,
      // sala+cozinha)

      room =
        2;

    }

  }


  // ===================================================
  // CASA 2
  // ===================================================

  if (
    state.house === 2
  ) {

    if (
      item.id === "bed" ||
      item.id === "nightstand" ||
      item.id === "dresser"
    ) {

      room =
        1;

    }

    else if (
      item.id === "bathtub" ||
      item.id === "sink" ||
      item.id === "toilet" ||
      item.id === "curtain"
    ) {

      // Banheiro é o índice 3 na casa 2

      room =
        3;

    }

    else {

      room =
        0;

    }

  }


  // ===================================================
  // CASA 3
  // ===================================================

  if (
    state.house === 3
  ) {

    // CAMA / CRIADO-MUDO / CÔMODA → QUARTO

    if (
      item.id === "bed" ||
      item.id === "nightstand" ||
      item.id === "dresser"
    ) {

      room =
        2;

    }

    // SOFÁ / TV / MESA / CADEIRA /
    // GELADEIRA → SALA + COZINHA

    else if (
      item.id === "sofa" ||
      item.id === "tv" ||
      item.id === "table" ||
      item.id === "chair" ||
      item.id === "fridge"
    ) {

      room =
        4;

    }

    // GUARDA-ROUPA / ARMÁRIO → SUÍTE

    else if (
      item.id === "wardrobe" ||
      item.id === "armario"
    ) {

      room =
        1;

    }

    // BANHEIRA / PIA / VASO / CORTINA → BANHEIRO

    else if (
      item.id === "bathtub" ||
      item.id === "sink" ||
      item.id === "toilet" ||
      item.id === "curtain"
    ) {

      // Banheiro é o índice 3 na casa 3

      room =
        3;

    }

    // PLANTA / ESTANTE / LUMINÁRIA / QUADRO /
    // TAPETE / FOGÃO / PIA DE COZINHA → SALA

    else {

      room =
        4;

    }

  }


  // ===================================================
  // POSIÇÃO INICIAL
  // ===================================================

  let x =
    1 +
    (
      currentQuantity %
      4
    );


  let y =
    1 +
    Math.floor(
      currentQuantity /
      4
    );


  // ===================================================
  // PEGAR CÔMODOS
  // ===================================================

  let rooms;


  if (
    state.house === 1
  ) {

    rooms =
      getHouse1Rooms();

  }

  else {

    rooms =
      houseData[
        state.house
      ].rooms;

  }


  const selectedRoom =
    rooms[
      room
    ] || rooms[0];


  // ===================================================
  // CALCULAR TAMANHO DA GRADE
  // ===================================================

  const houseElement =
    document.getElementById(
      "house"
    );


  let roomColumns;
  let roomRows;


  if (
    state.house === 3
  ) {

    /*
      CASA 3 usa 30x30.
    */

    const houseWidth =
      houseElement.clientWidth;


    const houseHeight =
      houseElement.clientHeight;


    const roomPixelWidth =
      houseWidth *
      (
        selectedRoom.w /
        30
      );


    const roomPixelHeight =
      houseHeight *
      (
        selectedRoom.h /
        30
      );


    roomColumns =
      Math.max(
        1,
        Math.round(
          roomPixelWidth /
          GRID_TILE
        )
      );


    roomRows =
      Math.max(
        1,
        Math.round(
          roomPixelHeight /
          GRID_TILE
        )
      );

  }

  else {

    /*
      CASA 1 e CASA 2 usam porcentagem.
    */

    const houseWidth =
      houseElement.clientWidth;


    const houseHeight =
      houseElement.clientHeight;


    const roomPixelWidth =
      houseWidth *
      (
        selectedRoom.w /
        100
      );


    const roomPixelHeight =
      houseHeight *
      (
        selectedRoom.h /
        100
      );


    roomColumns =
      Math.max(
        1,
        Math.round(
          roomPixelWidth /
          GRID_TILE
        )
      );


    roomRows =
      Math.max(
        1,
        Math.round(
          roomPixelHeight /
          GRID_TILE
        )
      );

  }


  // ===================================================
  // TAMANHO DO MÓVEL
  // ===================================================

  const size =
    getFurnitureSize(
      {
        rotation: 0
      },
      item
    );


  const maxX =
    Math.max(
      0,
      roomColumns -
      size.w
    );


  const maxY =
    Math.max(
      0,
      roomRows -
      size.h
    );


  x =
    Math.min(
      x,
      maxX
    );


  y =
    Math.min(
      y,
      maxY
    );


  // ===================================================
  // ID ÚNICO
  // ===================================================

  const uid =
    item.id +
    "_" +
    Date.now() +
    "_" +
    Math.random()
      .toString(36)
      .substring(2, 8);


  // ===================================================
  // ADICIONAR MÓVEL
  // ===================================================

  state.purchased.push({

    uid:
      uid,

    id:
      item.id,

    house:
      state.house,

    room:
      room,

    x:
      x,

    y:
      y,

    rotation:
      0

  });


  // ===================================================
  // PRODUÇÃO
  // ===================================================

  state.rate +=
    item.rate;


  // ===================================================
  // ATUALIZAR
  // ===================================================

  render();


  showMessage(
    `${item.name} comprado! +${item.rate} moedas/s`
  );


  checkNextHouse();

}


// =====================================================
// PERSONAGENS
// =====================================================

function renderCharacters() {

  const container =
    document.getElementById(
      "characters"
    );


  if (
    !container
  ) {

    return;

  }


  container.innerHTML =
    "";


  if (
    state.house < 3
  ) {

    container.innerHTML = `

      <p class="hint">
        Algumas pessoas ainda fazem parte
        apenas dos sonhos...
      </p>

    `;

    return;

  }


  people.forEach(
    person => {

      const unlocked =
        state.characters.includes(
          person.name
        );


      const button =
        document.createElement(
          "button"
        );


      button.className =
        "character-shop-item";


      button.innerHTML = `

        <span>
          ${person.icon}
          ${person.name}
        </span>

        <span>
          ${
            unlocked
              ? "Desbloqueado ❤️"
              : "🪙 " +
                money(
                  person.price
                )
          }
        </span>

      `;


      if (
        unlocked
      ) {

        button.disabled =
          true;


        button.classList.add(
          "unlocked"
        );

      }


      button.onclick =
        () => {

          unlockCharacter(
            person
          );

        };


      container.appendChild(
        button
      );

    }
  );

}


// =====================================================
// DESBLOQUEAR PERSONAGEM
// =====================================================

function unlockCharacter(
  person
) {

  if (
    state.characters.includes(
      person.name
    )
  ) {

    return;

  }


  if (
    state.coins <
    person.price
  ) {

    showMessage(
      `Ainda faltam moedas para desbloquear ${person.name}. 🪙`
    );

    return;

  }


  state.coins -=
    person.price;


  state.characters.push(
    person.name
  );


  render();

  celebrate();


  if (
    person.name ===
    "Aurora"
  ) {

    showMessage(
      "Aurora chegou. ❤️ Algumas coisas a gente constrói com moedas. Outras, com sonhos."
    );

  }

  else {

    showMessage(
      `${person.name} agora faz parte da família! ❤️`
    );

  }

}


// =====================================================
// VERIFICAR PRÓXIMA CASA
// =====================================================

function checkNextHouse() {

  const button =
    document.getElementById(
      "nextHouse"
    );


  if (
    !button
  ) {

    return;

  }


  const furnitureTypes =
    new Set(

      state.purchased
        .filter(
          p =>
            p.house ===
            state.house
        )
        .map(
          p =>
            p.id
        )

    );


  const amount =
    furnitureTypes.size;


  if (
    state.house === 1 &&
    amount >= 3
  ) {

    button.classList.remove(
      "hidden"
    );

    return;

  }


  if (
    state.house === 2 &&
    amount >= 6
  ) {

    button.classList.remove(
      "hidden"
    );

    return;

  }


  button.classList.add(
    "hidden"
  );

}


// =====================================================
// PRÓXIMA CASA
// =====================================================

function nextHouse() {

  if (
    state.house >= 3
  ) {

    showMessage(
      "Você chegou à nossa família. ❤️"
    );

    return;

  }


  state.house++;


  if (
    state.house === 2
  ) {

    state.characters = [
      "Ele",
      "Ela"
    ];


    showMessage(
      "Agora não é mais você ou eu. Agora somos nós. ❤️"
    );

  }


  if (
    state.house === 3
  ) {

    state.characters = [
      "Ele",
      "Ela"
    ];


    showMessage(
      "E aquilo que começou com nós dois agora pode virar uma família. ❤️"
    );

  }


  render();

  checkNextHouse();

  celebrate();

}


// =====================================================
// CHUVA DE CORAÇÕES (comemoração)
// =====================================================

function celebrate() {

  const icons =
    ["❤️", "✨", "💛"];


  for (
    let i = 0;
    i < 10;
    i++
  ) {

    const particle =
      document.createElement(
        "div"
      );


    particle.className =
      "celebrate-particle";


    particle.textContent =
      icons[
        Math.floor(
          Math.random() *
          icons.length
        )
      ];


    particle.style.left =
      `${
        45 +
        Math.random() * 10
      }%`;


    particle.style.bottom =
      `${
        20 +
        Math.random() * 10
      }%`;


    particle.style.animationDelay =
      `${Math.random() * 0.3}s`;


    document.body.appendChild(
      particle
    );


    setTimeout(
      () => {

        particle.remove();

      },
      2000
    );

  }

}


// =====================================================
// MENSAGEM
// =====================================================

function showMessage(
  text
) {

  const message =
    document.getElementById(
      "message"
    );


  if (
    !message
  ) {

    return;

  }


  message.textContent =
    text;


  message.classList.remove(
    "hidden"
  );


  // dois "requestAnimationFrame" garantem que o
  // navegador já pintou o estado "hidden" antes
  // de tirar, e assim a transição desliza de
  // verdade em vez de aparecer seca

  requestAnimationFrame(
    () => {

      requestAnimationFrame(
        () => {

          message.classList.add(
            "show"
          );

        }
      );

    }
  );


  clearTimeout(
    showMessage.timeout
  );


  showMessage.timeout =
    setTimeout(
      () => {

        message.classList.remove(
          "show"
        );


        setTimeout(
          () => {

            message.classList.add(
              "hidden"
            );

          },
          250
        );

      },
      3500
    );

}


// =====================================================
// BOTÃO — ESCOLHER ELE
// =====================================================

const chooseDele =
  document.getElementById(
    "chooseDele"
  );


if (
  chooseDele
) {

  chooseDele.onclick =
    () => {

      startGame(
        "dele"
      );

    };

}


// =====================================================
// BOTÃO — ESCOLHER ELA
// =====================================================

const chooseDela =
  document.getElementById(
    "chooseDela"
  );


if (
  chooseDela
) {

  chooseDela.onclick =
    () => {

      startGame(
        "dela"
      );

    };

}


// =====================================================
// BOTÃO — PRÓXIMA CASA
// =====================================================

const nextHouseButton =
  document.getElementById(
    "nextHouse"
  );


if (
  nextHouseButton
) {

  nextHouseButton.onclick =
    () => {

      nextHouse();

    };

}


// =====================================================
// MOEDAS POR SEGUNDO
// =====================================================

setInterval(
  () => {

    if (
      !state.started
    ) {

      return;

    }


    state.coins +=
      state.rate;


    updateMoneyDisplay();

    checkNextHouse();

  },
  1000
);


// =====================================================
// ABRIR / FECHAR LOJA
// =====================================================

const openShop =
  document.getElementById(
    "openShop"
  );


const closeShop =
  document.getElementById(
    "closeShop"
  );


const shopPanel =
  document.getElementById(
    "shopPanel"
  );


if (
  openShop
) {

  openShop.onclick =
    () => {

      if (
        !shopPanel
      ) {

        return;

      }


      shopPanel.classList.remove(
        "hidden"
      );

    };

}


if (
  closeShop
) {

  closeShop.onclick =
    () => {

      if (
        !shopPanel
      ) {

        return;

      }


      shopPanel.classList.add(
        "hidden"
      );

    };

}


// =====================================================
// ABRIR / FECHAR PERSONAGENS
// =====================================================

const openCharacters =
  document.getElementById(
    "openCharacters"
  );


const closeCharacters =
  document.getElementById(
    "closeCharacters"
  );


const charactersPanel =
  document.getElementById(
    "charactersPanel"
  );


if (
  openCharacters
) {

  openCharacters.onclick =
    () => {

      if (
        !charactersPanel
      ) {

        return;

      }


      charactersPanel.classList.remove(
        "hidden"
      );

    };

}


if (
  closeCharacters
) {

  closeCharacters.onclick =
    () => {

      if (
        !charactersPanel
      ) {

        return;

      }


      charactersPanel.classList.add(
        "hidden"
      );

    };

}


// =====================================================
// INICIALIZAÇÃO
// =====================================================

render();