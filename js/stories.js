"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" id="empty-fave-star" viewBox="0 0 16 16">
          <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
        </svg>

        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function getEmptyStar(){
  return $(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" id="empty-fave-star" viewBox="0 0 16 16">
  <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
  </svg>`);
}

function getFilledStar(){
  return $(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" id="filled-fave-star" viewBox="0 0 16 16">
  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
  </svg>`);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);

    //Sets the star to filled if story is a favorite
    if(currentUser.isFavorite(story)){
      $story.find("#empty-fave-star").remove();
      $story.prepend(getFilledStar());
    }

    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//NEW puts all of the user's favorite stories on the page
function putFavoriteStoriesOnpage() {
  $favoritedStoriesList.empty();

  if(currentUser.favorites.length === 0){
    $favoritedStoriesList.append("<h3>No favorites added!");
  } 
  else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $story.find("#empty-fave-star").remove();
      $story.prepend(getFilledStar());
      $favoritedStoriesList.append($story);
    }
  }

  $favoritedStoriesList.show();
}

//NEW puts all of the user's submitted stories on the page
function putMyStoriesOnpage() {
  $myStoriesList.empty();

  if(currentUser.ownStories.length === 0){
    $myStoriesList.append("<h3>No stories added by user yet!");
  } 
  else {
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story);
      $myStoriesList.append($story);
    }
  }

  $myStoriesList.show();
}

//NEW gets story info from submit form and sends it to the addStory function
$submitStoryForm.on("submit", submitStory);
async function submitStory(e) {

  const author = $("#submit-story-author").val();
  const title = $("#submit-story-title").val();
  const url = $("#submit-story-url").val();

  const newStory = {
    author,
    title,
    url
  };

  storyList.addStory(currentUser, newStory);
}

//NEW click empty star to add to fave list and change to full
$body.on("click", "#empty-fave-star", async function(evt){
  let $target = $(evt.target);
  let storyId = $target.parent().attr("id");

  if(storyId === "empty-fave-star"){
    $target = $(evt.target).parent();
    storyId = $target.parent().attr("id");
  }

  const thisStory = storyList.stories.find(
    stories => stories.storyId === storyId
  );

  await currentUser.addFavoriteStory(thisStory);

  $target.parent().prepend(getFilledStar());
  $target.remove();
})

//NEW click full star to remove from fave list and change to empty
$body.on("click", "#filled-fave-star", async function(evt){
  let $target = $(evt.target);
  let storyId = $target.parent().attr("id");

  if(storyId === "filled-fave-star"){
    $target = $(evt.target).parent();
    storyId = $target.parent().attr("id");
  }

  const thisStory = storyList.stories.find(
    stories => stories.storyId === storyId
  );

  await currentUser.removeFavoriteStory(thisStory);

  $target.parent().prepend(getEmptyStar());
  $target.remove();
})