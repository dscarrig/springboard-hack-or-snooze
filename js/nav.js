"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}


//NEW code for navigating to the submit form
$body.on("click", "#nav-submit", navSubmitClick)

function navSubmitClick(evt) {
  hidePageComponents();
  $submitStoryForm.show();
}


//NEW code for navigating to the favorited list
$body.on("click", "#nav-favorites", navFavoritesClick)

function navFavoritesClick(evt) {
  hidePageComponents();
  putFavoriteStoriesOnpage();
}


//NEW code for navigating to the user's stories
$body.on("click", "#nav-my-stories", navMyStoriesClick)

function navMyStoriesClick(evt) {
  hidePageComponents();
  putMyStoriesOnpage();
}