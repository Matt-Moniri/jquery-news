// -------------------------------  N E W S    R A K E  ---------------------------------
//                                     By Matt Moniri

// -----------------------------------   S U M M A R Y  ----------------------------------------
/**
 * The program is written as an object called "app". It makes use of global variables
 * for communication between functions. All these global variables and functions are
 * properties of the "app" object. Although it may seem that we could implement this program
 * withput OOP, I used OOP because of the problems occured related to global variables
 * when the functions communicated and changed them. If you are using "VSCODE" you can easily
 * see the structure. To do so, click on the "EXPLORER" icon on the top left and open "OUTLINE"
 * section. I have put some dummy scripts in my code that act like bookmarks in the OUTLINE view.
 *
 * I have used "chain of functions" that execute one after the other consecutively. It is
 * inspired by the prodction line of manufacturing factories.
 * Imagine a shirt manufacturing factory. The input is fabric and the output is shirts.
 * If you put fabric at the beginning of the production line, the fabric goes through the line
 * and the shirts comes out from the end side. All done automatically.
 * Now if you want to change the color of the shirts to yellow, you need to
 * go to the relevant machine in the production line and change the settings
 * and all the machines after that will automatically do their job and give you yellow shirts.
 *
 * Similar to the above model, the idea is that the data travels through the
 * chain of functions and the result is shown on the screen at the end of the chain.
 * When we want to make a certain change to the data shown we first inform it by
 * changing the global variables and then
 * stimulate the "chain" in the appropriate "point" and then all the functions
 * that are after that "point" will be automatically executed.
 *
 * I have tried to keep the structure of the program as simple and clear as I can.
 * So I have tried to keep nesting functions to a minimum. This enables the reader to
 * clearly see the flow of the program.
 *
 * here is the outline of the code:
 * PART 1: Declair app={}
 * PART 2: Declare "chain" functions
 * PART 3: Declare "auxiliary" functions that are not in the chain
 * PART 4: Prepare global variables and other objects in the root
 *         of the program that are necessary for the start of the program.
 *
 * Lastly I have to add that although I have used jQuery and vanilla-JS,
 * I don't recommend writing such a program using jQuery and vanilla JS.
 * I did so only to test and show the capabilities of jQuery and vanilla JS.
 * React.js is much better for state management and cleaner code.
 */

// jQuery tradition to make sure DOM is ready before executing the code
$(document).ready(() => {
  var ______bookmark = {}; // dummy object to use as bookmark

  ______bookmark.____declare_APP_start________ = () => {}; // Dummy code used as bookmark

  var app = {};

  ______bookmark.____declare_APP_end________ = () => {}; // Dummy code used as bookmark

  //-------------------------------  The Main Chain functions start here   ----------------------------------

  ______bookmark.____CHAIN______start_______ = () => {}; // Dummy code used as bookmark

  // Show the STEP1 page
  app.startPage = function () {
    $("#results").detach(); //remove #results table created in the previous itteration
    $("#arrangeResults").css({ display: "none" }); //remove #arrangeResults form relating to STEP2
    $("#queryForm").css({ display: "unset" }); //show the #queryForm or STEP1
  };

  /**
   * The bringNews() makes a url based on the newsapi.org API. Then puts the received data into
   * app.receivedData. This function is asyncronous.
   */
  app.bringNews = async function () {
    $("#loadingSign") // Show the loading animation
      .css({
        display: "block",
      })
      .find("#loadingBarFiller")
      .css({ "animation-play-state": "running" });
    $("#queryForm").css({
      //Hide the #queryForm relating to STEP1
      display: "none",
    });

    var url = // create the url based on the API of newsapi.org
      "https://newsapi.org/v2/everything?" +
      `q=${app.queryText}&` + // these properties are captured by the listeners set on #queryForm
      `from=${app.queryDateMin}&` +
      `to=${app.queryDateMax}&` +
      `sortBy=${$("#top100BasedOn").prop("value")}&` +
      "apiKey=d4790d31bcae4ecea37c33de1a636ef2&" +
      "pageSize=100";
    console.log(url);
    app.statusCode = "Script Problem.";
    await $.ajax({
      // wait for the result of ajax()
      url: url,
      success: function (data) {
        if (data.isOk == false) alert(result.message);
        app.receivedData = data;
        console.log("receivedData", app.receivedData); // log it for debugging purposes
      },
      async: true,
      error: function () {
        app.errorAjax = true;
      },
      statusCode: {
        // Assign received statusCode to app.statusCode
        200: function () {
          app.statusCode = "200: The request was executed successfully.";
        },
        400: function () {
          app.statusCode =
            "400: Bad Request. The request was unacceptable," +
            " often due to a missing or misconfigured parameter.";
        },
        404: function () {
          app.statusCode = "404";
        },
        401: function () {
          app.statusCode =
            "401: Unauthorized. Your API key was missing" +
            " from the request, or wasn't correct.";
        },
        426: function () {
          app.statusCode = `You are trying to request results 
          too far in the past.`;
        },
        429: function () {
          app.statusCode =
            "429: Too Many Requests. You made too many" +
            " requests within a window of time and have been" +
            " rate limited. Back off for a while.";
        },

        500: function () {
          app.statusCode =
            "500: Server Error. Something went wrong on our side.";
        },
      },
    });

    // An intentional delay to make loading animation look nicer
    delayPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 10);
    });
    // we have to "await" the above promise, otherwise the compiler will not waite for it to finish.
    await delayPromise.then();

    // if newsapi.come can not find any news the receivedData.articles will be an empty array.
    // We memorize this in app.resultsExist.
    app.resultsExist = app.receivedData.articles.length > 0 ? true : false;

    console.log("after delay");
  };

  /**
   * This function takes out the array containing the news and puts it in app.initialArray
   */

  app.obj2array = function () {
    /**
     *  If there are no news found by newapi.com, we fill app.initialArray with
     * only one element that has the properties we want which
     * are declaired in app.wantedProperties.
     * Please refer to next parts of this function to know about app.wantedProperties
     */

    if (app.resultsExist == false) {
      app.initialArray = [{}];
      app.wantedProperties.forEach(function (property) {
        app.initialArray[0][property] = "";
      });
      return; // do not continue this function
    }

    // If there are news found by newapi.com, we arrive here...
    var tempObj = app.receivedData; // make a copy of receivedData to keep the receivedData intact

    /**
     * Because I have examined the receivedData before, I already know what part of it is needed.
     * So I pass in an array of "probes" which are in fact the properties of that receivedData that
     * "point" to the "wanted part of the object"
     * For example lets assume the receivedData={a:1,b:2,c:{first:'11',second:[1,2,3]}}
     * And assume that we already know that we are looking for the array [1,2,3].
     * So we set the app.diggingProbes=['c','second'] and call the app.obj2array().
     * The called function first copies the app.receivedData into "tempObj" to work on it.
     * Then goes to first element of app.diggingProbes. That is "c". Now it finds the value of
     * tempObj.c and sets that value in tempObj. So tempObj becomes {first:'11',second:[1,2,3]}.
     * At the next step same things happen for ".second" and so tempObj becomes [1,2,3].
     * Now we have found what we looking for which is [1,2,3].
     * It looks like peeling the layers of an onion one by one.
     */
    app.diggingProbes.forEach((probe) => {
      tempObj = tempObj[probe];
    });

    /**
     * Now the tempObj is an array and free from unwanted data and ready to be worked on.
     * I go through each element of this tempObj and create a new element based on that
     * Then append this new element to initialArray.
     * This initialArray is global and can be used by other functions.
     */
    app.initialArray = [];
    tempObj.forEach((article, index) => {
      var arrayElement = {}; // create an empty object
      arrayElement.id = index + 1; // add an id property for the new element

      /**
       * You remember I created a tempObj to work on.
       * "tempObj" is now an array of objects and each object is a news article.
       * I have also passed in an array of properties.
       * These properties are the ones that I need from each news article.
       * The new element will have the same property but I convert it to lower case for convenience
       * If the value of the property is of string type,
       * I have to eliminate strange characters using regex
       * Also if the value is null I put "" instead.
       */

      app.wantedProperties.forEach((property) => {
        if (typeof article[property] == "string") {
          arrayElement[property.toLowerCase()] = article[property]
            .replace(/<.*>/g, "")
            .replace(/^\s*(.*)\s*$/g, "$1");
        } else {
          arrayElement[property.toLowerCase()] = article[property];
        }
        if (!arrayElement[property.toLowerCase()]) {
          arrayElement[property.toLowerCase()] = "";
        }
      });

      /**
       * I use an auxiliary function to ceate a jQuery object for each article.
       * Each of these jQuery objects is in fact a row in the results table.
       */
      let $row = app.create$Row(article, index);
      arrayElement.$row = $row; // save the jQuery object in elements.$row property
      app.initialArray.push(arrayElement); //Finally I push the new element to the initialArray
    });

    // add the results table to the DOM
    $("body").append($(`<table id="results"><tbody></tbody></table>`));
  };

  /**
   * This function resets the filters in STEP2 In fact this is the
   * function which is called by the listener on "Reset Filters" button
   * You will notice that I have to reset each global value and at the same time
   * reset the corresponding DOM object.
   */
  app.resetFilter = function () {
    app.searchText = "";
    $("#searchText").val("");
    [app.sliderMin, app.sliderMax] = [1, 100];
    $("#slider").slider("values", 0, 1);
    $("#slider").slider("values", 1, 100);

    /**
     * Here I reset the sort buttons. Please refer to app.activateListeners() where you find
     * the listener set on $(".sortButton").click(...).
     */
    app.sortState = {};
    app.sortState.id = "";
    // automatically apply the needed changes to DOM Objects of sort buttons.
    $("#sortButton0").click();
  };

  /**
   * This searchFilter() function is kept simple.
   * I simply filter the initialArray elements whose ".title" contain the "app.searchText",
   * and save the result in "app.searchedArray".
   * app.searchText is a global variable whose value is the value of the
   * #searchText element on the DOM. You see that as a search  field on the STEP2 webpage.
   */
  app.searchFilter = function () {
    app.searchText = $("#searchText")
      .val()
      .replace(/[.*+?^${}()|\[\]\\\/]/g, ""); // sanitize the input string
    app.searchedArray = [];
    app.searchedArray = app.initialArray.filter((element) => {
      return element.title.toLowerCase().includes(app.searchText.toLowerCase());
    });
  };

  /**
   * When we ceate a slider using jQuery-UI,
   * it gives access to min and max values by ".slider()" methode.
   * They are copied to "app.sliderMin" and "app.sliderMax" using a listener.
   * Using those min and max, I filter the "app.searchedArray"
   * and save the results in "app.searchedRangedArray"
   * Please refer to app.activateListeners() where you find the "$("#slider").slider(...)".
   * The slider itself is defined in program's root using the same
   * "$("#slider").slider(...)" notation.
   */
  app.idRangeFilter = function () {
    if (!app.sliderMin) {
      // fallback
      app.sliderMin = 1;
    }
    if (!app.sliderMax) {
      // fallback
      app.sliderMax = 100;
    }
    app.searchedRangedArray = app.searchedArray.filter((row) => {
      // filter

      return app.sliderMin - 1 < row.id && row.id < app.sliderMax + 1;
    });
  };

  /**
   * This function used for sorting the app.searchedRangedArray.
   * It uses the global variable app.sortState, which is an object containing
   * the needed flags to execute the app.columnSort() function.
   * Those flags are set using the listeners created on ".sortButton" buttons on the DOM.
   * Please refer to "app.activateListeners()" where you find "$(".sortButton").click(..)".
   * And refer to the "root" part and find the part where "app.sortFunctions" is declared.
   * Also refer to "$(".sortButton").click(...)" in the "root".
   * The listener "$(".sortButton").click(...)" updates the object "app.sortState" and then
   * calls "app.columnSort()". The "app.columnSort()" sorts the "app.searchedRangedArray"
   * based on "app.sortState".
   * Each ".sortButton" on the html has a "data-infoType" attribute, which indicates
   * the type of data it is corresponds, e.g. date or text.
   * I have declared a "sort" functions for each infoType
   * and those "sort" functions are encapsulated in the object named sortFunctions.
   * for example if infoType is "date" the sort function "sortFunctions.date()"
   * will be used to sort the "app.searchedRangedArray"
   */
  app.columnSort = function () {
    if (app.sortState.infoType in app.sortFunctions) {
      // check if the needed sort function exist in sortFunctions
      app.searchedRangedArray.sort((a, b) => {
        // if so, pass the related values to that sort function
        return app.sortFunctions[app.sortState.infoType](
          a[app.sortState.property],
          b[app.sortState.property]
        );
      });
    } else {
      // if we have not a specific sort function available for the infoType,
      // normal sorting is done.
      app.searchedRangedArray.sort((a, b) => {
        return a[app.sortState.property] < b[app.sortState.property] ? -1 : 1;
      });
    }

    // If app.sortState.order == "asc" we do nothing.
    // Otherwisewe we have to reverse the order of the array.
    app.searchedRangedArray =
      app.sortState.order == "asc"
        ? app.searchedRangedArray
        : app.searchedRangedArray.reverse();
  };

  /**
   * The showData() function is responsible for showing "STEP2" page.
   */
  app.showData = function () {
    $("#loadingSign").css({ display: "none" }); // remove "#loadingSign"
    $("#arrangeResults").css({ display: "unset" }); // show "#arrangeResults"
    let instructions = ``; // a string variable to keep the instructions
    if (app.errorAjax) {
      // if the AJAX operation has been unseccessful
      instructions = `! Error >> ${app.statusCode} Please click "Resatart" button`;
    }
    if (!app.errorAjax) {
      // if AJAX is ok, we show a summary of the articles fetched
      console.log(`in SHOWDATA app.queryDateMin=${app.queryDateMin}`);
      instructions =
        app.resultsExist == false
          ? `Your entered data did not match any news. Please click "Restart" button. `
          : `We found ${app.receivedData.totalResults} news containing words "${
              app.queryText
            }"
           published from ${app.queryDateMin} to ${app.queryDateMax}  ${
              app.initialArray.length < 100
                ? "You can see below"
                : // Read the value of the <select> then show the text of the corresponding <option>
                  `and picked the top 100 ${$(
                    `#${$("#top100BasedOn").prop("value")}`
                  ).text()}.`
            } 
        You can filter them further in this page... `;
    }
    $("#step2Instructions").text(instructions); // Put instruction on The DOM
    $("tr").detach(); // remove any $row that may have been attached to DOM
    app.searchedRangedArray.forEach(function (article, index) {
      const colourPallet = [
        // an array of 4 colors in rgb
        [240, 79, 182],
        [240, 219, 81],
        [81, 240, 140],
        [81, 103, 240],
      ];
      colorIndex = index % 4; // colorIndex is 0,1,2 or 3 based On the index of each article
      // choose a color from the above array based on colorIndex
      // and assign that color to the background of the $row
      backgroundColor = `rgba(${colourPallet[colorIndex][0]},
        ${colourPallet[colorIndex][1]},
        ${colourPallet[colorIndex][2]},0.15)`;
      article.$row.css({ "background-color": backgroundColor });
      $("#results tbody").append(article.$row); // at last put each $row on the DOM
    });
  };

  /**
   * After each image is loaded, the ".load()" event fires on that image
   * and that listner calls a function to adjust the dimensions of the image,
   * in order to make the images fit inside their square container
   */
  app.adjustImages = function () {
    // Adjust height and width.
    $(".td-id img").each(function (index, element) {
      $(element).load(function () {
        // Read the dimensions of the <img> and the container <div>.
        let imgWidth = $(element).width();
        let divWidth = $(element).parent().width();
        let imgHeight = $(element).height();
        let divHeight = $(element).parent().height();
        let imgHor2Ver = imgWidth / imgHeight;
        let divHor2Ver = divWidth / divHeight;

        /**
         * Please refer to "td.td-id div img" selector in the css file.
         * There you will see that for <img> we have {height: "100%"}.
         * That means the <img> will be resized to a size in which
         * the height of the <img> is equal to height of the <div>.
         * The div is a square and the ratio of the <img> will not change,
         * So if <img> is a landscapr image and <img>'s ratio is different from <div>'s ratio,
         * a part of <img> will be outside of the <div> and will be hidden.
         * What we do here is we move the <img> in a way that the center of the <img>
         * falls exactly on the center of the <div>,
         * so one part from right and one part from the left of the image fall outside of the <div>.
         * But what happens if the <img> is a portrait image?
         * In that case for the <img> we set {height: "unset",width: "100%"}.
         * So the same thing happens but this time vertically.
         */
        if (imgHor2Ver < divHor2Ver) {
          $(element).css({
            height: "unset",
            width: "100%",
          });
        }

        $(element).css({
          // move to center
          left: `-${(imgWidth - divWidth) / 2}px`,
          top: `-${(imgHeight - divHeight) / 2}px`,
        });
      });
    });
  };
  ______bookmark.____CHAIN______end_______ = () => {}; // Dummy code used as bookmark

  //-------------------------------  FUNCTION CHAIN ends here      ----------------------------------

  //-------------------------------   AUXILIARY FUNCTIONS start here   ----------------------------------
  ______bookmark.____AUXILIARY__start_______ = () => {}; // Dummy code used as bookmark

  /**
   * Hereafter I declare some listeners and other functions
   * that are outside of the "main chain" and act like asssistants to the functions
   * in the main chain.
   */

  /**
   * app.sortFunctions is an object that contains functions for sorting various types of data
   */
  app.sortFunctions = {};

  // Declare a compare function for date to use for sorting arrays
  app.sortFunctions.date = (a, b) => {
    aT = new Date(a).getTime(); //convert a to milliseconds
    bT = new Date(b).getTime(); //convert b to milliseconds
    return aT - bT; //This means sorting in ascending order
  };

  // Declare a compare function for text to use for sorting arrays
  app.sortFunctions.text = (a, b) => {
    var shapeStringForCompare = (string) =>
      (string == null ? "" : string)
        .replace(/^\s+/, "") //convert a to a good shape
        .replace(/[.*+?^${}()|\[\]\\'"\u2018\u2019\u201C\u201D\>\<,\/]/g, "")
        .toLowerCase();

    //This means sorting in ascending order
    return shapeStringForCompare(a) > shapeStringForCompare(b) ? 1 : -1;
  };

  // Declare a function that creates a <tr> jQuery object for an article.
  app.create$Row = function (article, index) {
    $row = $(`<tr></tr>`); // create a jQuery object of <tr> tag which is a table row

    let [linkUrl, urlToImage] = [article.url, article.urlToImage];
    $td = $(
      // create a <td> containing the image and make the image a link to the article webpage
      `<td class="td-id"> <a href="${linkUrl}">
          <div class="imgDiv"><span>${
            parseInt(index) + 1
          }</span><img src="${urlToImage}"> </div>
          </a></td>`
    );
    $row.append($td); // append to the above <tr>
    $td = $(
      // create a <td> containing other information
      `<td class="td-details">
        <a href="${linkUrl}">
          <p>${article.title}</p>
        </a>
        <div class="timeAuthor">
          <time>Published on:${article.publishedAt}</time>
          <address>by ${article.author}</address>
        </div> 
        
      </td>`
    );
    $row.append($td); // append to the above <tr>

    // At last the <td> is appended to the $row which is a <tr>.
    return $row; //return the created $row out
  };

  /**
   * This function is the backbone of the main chain. It takes a function's name
   * and executes it and then executes all the functions after it one by one.
   */
  app.executeChain = async function (functionName) {
    app.chainIsRunning = true; // a flag. it is not used but it may be useful later
    // an array containing the names of the main chain function in the correct order
    var functionChain = [
      "bringNews",
      "obj2array",
      "resetFilter",
      "searchFilter",
      "idRangeFilter",
      "columnSort",
      "showData",
      "adjustImages",
    ];
    // Find the index of the wanted function in the array
    var startIndex = functionChain.findIndex((element) => {
      return element == functionName;
    });
    // Execute the wanted function and all functions after it in the chain
    for (let i = startIndex; i < functionChain.length; i++) {
      console.log(`functionChain[i]=${functionChain[i]}`);
      /**
       * Sometimes the async functions and promises return error, and if w don't catch them,
       * the app wil crash. Below, the app[functionChain[i]]() may call an async function
       * or a promise and so we need the try-catch block to protect the app from crashing.
       */
      try {
        await app[functionChain[i]]();
      } catch (error) {} // only to make the program work
    }
    app.chainIsRunning = false;
  };

  /**
   * This function is a long function that contains almost all the listeners.
   */
  app.activateListeners = function () {
    /**
     * This listener checks if a keyword is entered in "Keywords" field
     * Also it sanitises the input phrase.
     */
    $("#queryPhraseInput").blur(function (e) {
      e.preventDefault();
      $target = $(e.currentTarget);
      app.queryText = $target
        .val()
        .replace(/[.*+?^${}()|\[\]\\\/]/g, "") // sanitise
        .replace(/^\s+/g, "") // remove starting spaces
        .replace(/\s+&/g, "") // remove ending spaces
        .replace(/\s+/g, " "); // rplace long spaces with a single space
      let message = "\u2713"; //default value of alert message is a tick
      let backColor = "white"; // default value of background color of the input field is white
      let messagColor = "lightgreen"; // default value of alert message text is light green
      if (!app.queryText) {
        // if the input field is empty
        app.queryFormFillError = true; // record error
        message = "\u26A0 Please enter at least one keyword"; // set alert message
        backColor = "yellow"; // change background color of the field
        messagColor = "red"; //change text color of the alert message
      }

      $target // put the alert message on the DOM beneath the input field
        .css({ backgroundColor: backColor })
        .parent()
        .next()
        .css({ color: messagColor })
        .text(message);
    });

    /**
     * These listeners check if a date is entered in the fields
     * "Date From (UTC):" and "Date Until (UTC):"
     */
    $("#queryDateMin,#queryDateMax").blur(function (e) {
      e.preventDefault();
      let message = "\u2713"; // default value of alert message is a tick
      let backColor = "white"; // default value of background color of the input field is white
      let messagColor = "lightgreen"; // default value of alert message text is light green
      // record the entered date in the appropriate property of app
      app[$(e.currentTarget).attr("id")] = $(e.currentTarget).val();
      if (!$(e.currentTarget).val()) {
        // if there is nothing entered the colors and alert text change
        message = `\u26A0 Please choose an Approprate date.`;
        backColor = "white";
        messagColor = "red";
        app.queryFormFillError = true;
      }
      // apply the alert text color, background color and alert message to the DOM
      $(e.currentTarget)
        .css({ backgroundColor: backColor })
        .parent()
        .next()
        .css({ color: messagColor })
        .text(message);
    });

    // The submit listener of STEP1 page
    $("#queryForm").submit((e) => {
      e.preventDefault();
      app.queryFormFillError = false; // reset app.queryFormFillError

      /**
       * Here I fire the ".blur()" listeners of the input fields in the form
       * so that if any error has happened, the listeners will find out
       * and set the "app.queryFormFillError=true"
       * they will also show their own alert messages bellow each field
       *
       */
      $("#queryPhraseInput,#queryDateMin,#queryDateMax").blur();

      // if there is an error, we announce that they need to be corrected
      if (app.queryFormFillError) {
        $(e.currentTarget)
          .find(".submit .alertMessage")
          .text("\u26A0 Please correct the errors and then click this button");
      } else {
        // if no errors, execute the chain starting from app.bringNews()
        app.executeChain("bringNews");
      }
    });

    /**
     * When "Search Titles" button is pressed,
     * this listener executes chain strating from "app.searchFilter()"
     */
    $("#searchForm").submit((e) => {
      e.preventDefault();
      app.executeChain("searchFilter");
    });

    /**
     * This listener handles the operation of sort buttons in STEP2 page.
     * It updates "app.sortState" then executes the chain starting from "app.columnSort()".
     * The app.columnSort() will use the app.sortState to sort the data.
     */
    $(".sortButton").click(function (e) {
      e.preventDefault();
      // if the same button is pressed twice we toggle the app.sortState.order
      if ($(e.currentTarget).attr("id") == app.sortState.id) {
        app.sortState.order = app.sortState.order == "asc" ? "desc" : "asc"; //  toggle
      } else {
        // if a new button is pressed we record all the attributes of that button
        app.sortState.id = $(e.currentTarget).attr("id");
        app.sortState.infoType = $(e.currentTarget).data("infoType");
        app.sortState.property = $(e.currentTarget).data("property");
        app.sortState.order = "asc";
        app.sortState.buttonText = $(e.currentTarget)
          .val()
          .replace(/([a-zA-Z0-9]+)[\u25BC\u25B2]*/, "$1");
      }

      /**
       * In this part we control the appariance of the upward or downward arrows
       * on the sort buttons.
       */
      $(".sortButton").each(function (index, element) {
        // remove arrows
        let faceValue = $(element).val(); // read the value of each button
        // remove any arrow character
        faceValue = faceValue.replace(/([a-zA-Z0-9]+)[\u25BC\u25B2]*/, "$1");
        $(element).val(faceValue);
      });
      // Create a string containing an up or down arrow based on the "app.sortState.order"
      arrow = app.sortState.order == "asc" ? "\u25B2" : "\u25BC";
      $(e.currentTarget).val(app.sortState.buttonText + arrow);
      // Finally execute the chain starting from app.columnSort()
      app.executeChain("columnSort");
    });

    /**
     * A slider is created using jQuery-UI in the root of the program.
     * Here I put a listener on it so that when a handle stop the listener fires
     * and after recording the slider values executes the chain starting
     * from app.idRangeFilter().
     */
    $("#slider").slider({
      stop: () => {
        [app.sliderMin, app.sliderMax] = $("#slider").slider("values");
        app.sliderMin = app.sliderMin == 0 ? 1 : app.sliderMin;
        app.executeChain("idRangeFilter");
      },
    });

    /**
     * When the user presses "Reset Filters" on STEP2 page,
     * this listener executes chain starting at app.resetFilter()
     * which resets all the inputs on STEP2 page.
     */
    $("#resetResults").click((e) => {
      e.preventDefault();
      app.executeChain("resetFilter");
    });

    // This listener shows the STEP1 screen when the "Restart" button is pressed.
    $("#restart").click(() => {
      $("#noResults").detach();
      app.startPage();
    });
  };
  ______bookmark.____AUXILIARY__end_______ = () => {};

  //-------------------------------  AUXILIARY_FUNCTIONS end here   ----------------------------------

  //-------------------------------   ROOT of the program starts here   ----------------------------------

  ______bookmark.____ROOT__start_______ = () => {};
  /**
   * Here in the root of the program I set initial values for the objects and variables
   * that are necessary for the program at the start. Also I create some elements on the DOM.
   */
  app.errorAjax = false;
  app.arrows = [];
  app.chainIsRunning = false;
  dd = new Date();
  console.log(dd);
  // This part creates a slider for ID Range in "STEP2" using jQueryUI.
  $("#arrangeResults").css({
    display: "none",
  });
  $("#slider").slider({
    animate: false,
    type: "number",
    min: 0,
    max: 100,
    range: true,
    step: 5,
    values: [1, 100],
  });

  /**
   * If the screen is landscape, the forms' width will be 60% of veiwport width.
   * Otherwise they will be 90%.
   */
  $(window).resize(function () {
    if ($(window).height() > $(window).width()) {
      $(".entryBlock").css({ width: "90vw" });
    } else {
      $(".entryBlock").css({ width: "60vw" });
    }
  });

  // fire the above listener manually to adjust the width for the first time
  $(window).resize();

  // read "Keyword(s)" field for the first time
  app.queryText = $("#queryPhraseInput").val();

  // A string that contains today's UTC date
  var today = new Date().toISOString().slice(0, 10);

  // A string that contains yesterday's UTC date
  var yesterday = new Date(new Date().getTime() - 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 10);

  // Set today and yesterday as the default values of the date input field
  $("#queryDateMin").attr("value", yesterday);
  $("#queryDateMax").attr("value", today);

  // UTC date 28 days ago
  var limitUTC = new Date(new Date().getTime() - 28 * 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 10);

  // put min and max limit on date inputs
  $("#queryDateMin").attr({ min: limitUTC, max: today });
  $("#queryDateMax").attr({ min: limitUTC, max: today });

  // When the chain executes for the first time, the app.columnSort() will need "app.sortState"
  app.sortState = {
    id: "sortButton0",
    infoType: "number",
    buttonText: "Number",
    order: "asc",
    property: "id",
  };

  // This object is used by app.obj2array()
  app.diggingProbes = ["articles"];
  app.wantedProperties = [
    "content",
    "publishedAt",
    "author",
    "description",
    "title",
  ];

  // activate all the listeners
  app.activateListeners();

  ______bookmark.____ROOT__start_______ = () => {};

  //-------------------------------   ROOT of the program ends here   ----------------------------------
});
