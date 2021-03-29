const searchBtn = document.querySelector(".search-btn");
const searchInfo = document.querySelector(".search-info");
const searchInput = document.querySelector(".search-input");
const list = document.querySelector(".content-list");
const paginationContainer = document.querySelector(".pagination-container");
const loadingDiv = document.querySelector(".loader-div");

const searchState = {
  value: "",
  pageCount: 0,
  currentPage: 1,
};

function liBuilder(title, authorName, firstPublishYear, subjects) {
  const titleElem = document.createElement("p");
  const authorNameElem = document.createElement("p");
  const firstPublishYearElem = document.createElement("p");
  const subjectElems = document.createElement("p");
  const div = document.createElement("div");
  const li = document.createElement("li");

  if (
    authorName !== undefined &&
    subjects !== undefined &&
    firstPublishYear !== undefined
  ) {
    div.classList.add("book-content");
    titleElem.innerHTML = `<b class='colored'>Title:</b>  ${title}`;
    authorNameElem.innerHTML = `<b class='colored'>Author Name:</b>  ${authorName}`;
    firstPublishYearElem.innerHTML = `<b class='colored'>Publish Year:</b>  ${firstPublishYear[0]}`;
    subjectElems.innerHTML = `<b class='colored'>Subjects:</b>  ${subjects
      .splice(0, 5)
      .join(" ,")}`;

    div.append(titleElem, authorNameElem, firstPublishYearElem, subjectElems);
    li.append(div);

    return li;
  }
}

function paginationMaker() {
  paginationContainer.innerHTML = "";
  paginationContainer.style.display = "flex";

  for (let i = 1; i <= searchState.pageCount; i += 1) {
    const span = document.createElement("span");
    span.textContent = i;
    span.classList.add("page-count");

    if (searchState.currentPage === i) {
      span.classList.add("active-page");
    }

    span.addEventListener("click", () => {
      searchState.currentPage = i;
      updateInfo();
      getBooks();
    });

    paginationContainer.append(span);
  }
}

function updateInfo() {
  if (searchState.value !== "") {
    list.innerHTML = "";
    paginationContainer.innerHTML = "";
    searchInfo.textContent = "Loading...";
    loadingDiv.classList.remove("hide");
  }
}

function getBooks() {
  let url = "http://openlibrary.org/search.json?q=";

  if (Boolean(searchState.value)) {
    if (searchState.value.split(" ").length === 1) {
      url += `${searchState.value}&page=${searchState.currentPage}`;
    } else {
      let joinedStrs = searchState.value.split(" ").reduce((acc, el) => {
        return acc + `+${el}`;
      });

      url += `${joinedStrs}&page=${searchState.currentPage}`;
    }
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((books) => {
        console.log(books.numFound);
        if (books.numFound !== 0) {
          loadingDiv.classList.add("hide");
          searchInfo.style.display = "block";
          searchInfo.textContent = `page: ${searchState.currentPage}`;
          searchState.pageCount = Math.ceil(books.numFound / 100);

          books.docs.forEach((el) => {
            let content = liBuilder(
              el.title,
              el.author_name,
              el.publish_year,
              el.subject
            );

            if (content !== undefined) {
              list.append(content);
            }
          });
          paginationMaker();
        } else {
          loadingDiv.classList.add("hide");
          searchInfo.textContent = "not found.";
          alert("nothing found,type a correct name");
        }
      })
      .catch((error) => {
        alert(`${error}`);
      });
  }
}

searchBtn.addEventListener("click", () => {
  searchState.value = searchInput.value.trim();

  updateInfo();
  getBooks();
});
