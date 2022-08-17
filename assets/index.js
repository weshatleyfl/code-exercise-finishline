let nextPage = null;

const handleAPIResponse = (result, clearDiv = false) => {
  nextPage = result.info.next;
  let cardContainer = $("#cardContainer");
  if (clearDiv) {
    cardContainer.empty();
  }
  result.results.forEach((item) => {
    cardContainer.append(`
    <div class="card-item" id="${item.id}">
        <img src="${item.image}" alt="${item.name}">
        <img src="./assets/images/close.png" alt="close" class="close-icon" onclick="deleteCard(${
          item.id
        })">
        <div class="content">
            <h2>${item.name}</h2>
            <div class="status">
            ${
              item.status === "Alive"
                ? `<div class="green dot"></div>`
                : `<div class="red dot"></div>`
            }
                <span>${item.status} - ${item.species}</span>
            </div>
            <span class="other-info">Last known location:</span><br>
            <span>${item.location.name}</span><br>
            <span class="other-info">Origin:</span><br>
            <span>${item.origin.name}</span>
        </div>
    </div>`);
    // Make next button visible if there is a next page
    if (nextPage) {
      $("#nextButton").css("display", "block");
    }
  });
};

const handleError = () => {
  let cardContainer = $("#cardContainer");
  cardContainer.empty();
  cardContainer.append(`<h1>No results found</h1>`);
  $("#nextButton").css("display", "none");
};

function delay(callback, ms) {
  var timer = 0;
  return function () {
    var context = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback.apply(context, args);
    }, ms || 0);
  };
}

const firstFetch = () => {
  let endpoint = "https://rickandmortyapi.com/api/character";
  $.ajax({
    url: endpoint,
    contentType: "application/json",
    dataType: "json",
    success: function (result) {
      handleAPIResponse(result, true);
    },
  });
};

$(document).ready(function () {
  // Search on enter key press
  $("#searchInput").keyup(
    delay(function (e) {
      if (!this.value) {
        firstFetch();
      } else {
        search(this.value);
      }
    }, 500)
  );

  // First fetch
  firstFetch();
});

const deleteCard = (id) => {
  $(`#${id}`).remove();
};

const nextPageClick = () => {
  if (nextPage) {
    $.ajax({
      url: nextPage,
      contentType: "application/json",
      dataType: "json",
      success: function (result) {
        handleAPIResponse(result, false);
      },
    });
  }
};

const search = (searchTerm) => {
  let endpoint = `https://rickandmortyapi.com/api/character/?name=${searchTerm}`;
  $.ajax({
    url: endpoint,
    contentType: "application/json",
    dataType: "json",
    success: function (result) {
      handleAPIResponse(result, true);
    },
    error: function (error) {
      console.log(error);
      handleError();
    },
  });
};
