let answers = [];
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const watchHistory = document.getElementById("history");
const clickHistory = document.getElementById("clickHistory");
const deleteBtn = document.getElementById("deleteBtn");
const gotoBtn = document.getElementById("goto");
const searchSection = document.getElementById("searched");

const bodyEL = document.body;
let divCardEl = document.createElement("div");
let mainCardEl = document.createElement("section");
let localValue = JSON.parse(localStorage.getItem("dictionary"));
let data = [];
searchBtn.addEventListener("click", () => {
  searchForWord(searchInput.value);
});
if (localValue?.length > 0) {
  watchHistory.style.display = "block";
}

clickHistory.addEventListener("click", () => {
  renderHistory();
});

const searchForWord = async (value) => {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${value}`
    );
    const res = await response.json();
    mainCardEl.innerHTML = "";
    answers = res;
    renderAnswer(answers);
  } catch (err) {
    console.log("🚀 ~ file: script.js:15 ~ searchForWord ~ err:", err);
  }
};

const renderAnswer = (answer) => {
  if (localValue?.length > 0) {
    data = localValue;
  }
  let formattedRes = {
    id: Math.floor(Math.random() * 1000 + 1),
    word: answer[0].word,
    searches: [],
  };
  answer[0].meanings.forEach((data) => {
    let searchItem = {
      partOfSpeech: data.partOfSpeech,
      definition: data.definitions[0].definition,
    };
    formattedRes.searches.push(searchItem);
  });
  data.push(formattedRes);
  localStorage.setItem("dictionary", JSON.stringify(data));
  mainCardEl.className = "searched-para-card";
  let searchedWord = document.createElement("div");
  searchedWord.id = "searched-word";
  let hElement = document.createElement("h2");
  hElement.innerHTML = `Word: ${answer[0].word}`;

  searchedWord.appendChild(hElement);
  mainCardEl.appendChild(searchedWord);
  let answerCard = document.createElement("ol");
  answerCard.id = "answer-card";
  answerCard.innerHTML = "";
  answer[0].meanings.map((data) => {
    let listItem = document.createElement("li");
    listItem.innerHTML += `
          <div class="speech-part">
          <h4 class="part">${data.partOfSpeech}</h4>
        </div>
        <div class="paragraph">
         ${data.definitions[0].definition}
        </div>
      
          `;
    answerCard.appendChild(listItem);
  });

  mainCardEl.appendChild(answerCard);
  bodyEL.appendChild(mainCardEl);
  gotoBtn.style.display = "block";
  watchHistory.style.display = "none";
};

const renderHistory = () => {
  watchHistory.style.display = "none";
  searchSection.style.display = "none";
  gotoBtn.style.display = "block";
  bodyEL.classList.remove("search-dictionary");
  bodyEL.classList.add("search-history-words");
  divCardEl = document.createElement("div");
  divCardEl.className = "card";
  localValue.forEach((localData) => {
    const mainCardEl = document.createElement("section");
    mainCardEl.className = "searched-para-card";
    const searchedWord = document.createElement("div");
    searchedWord.id = "searched-word";
    const hElement = document.createElement("h2");
    hElement.className = "title";
    const iElement = document.createElement("i");
    iElement.className = "fa-solid fa-trash-can";
    iElement.id = "deleteBtn";
    iElement.onclick = () => {
      // Call the handleDeleteClick function when the trash icon is clicked
      handleDeleteClick(localData.id);
    };

    hElement.innerHTML = `Word: ${localData.word}`;
    searchedWord.appendChild(hElement);
    searchedWord.appendChild(iElement);
    mainCardEl.appendChild(searchedWord);
    const answerCard = document.createElement("ol");
    answerCard.id = "answer-card";
    localData.searches.forEach((data) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
          <div class="speech-part">
            <h4 class="part">${data.partOfSpeech}</h4>
          </div>
          <div class="paragraph">
            ${data.definition}
          </div>
        `;
      answerCard.appendChild(listItem);
    });
    mainCardEl.appendChild(answerCard);
    divCardEl.appendChild(mainCardEl);
  });
  bodyEL.appendChild(divCardEl);
};
function handleDeleteClick(deleteId) {
  const res = localValue.filter((data) => data.id != deleteId);
  localStorage.setItem("dictionary", JSON.stringify(res));
  divCardEl.innerHTML = "";
  localValue = JSON.parse(localStorage.getItem("dictionary"));
  renderHistory();
}

gotoBtn.addEventListener("click", () => {
  window.location.reload();
});
