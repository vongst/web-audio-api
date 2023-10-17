// Page-scoped data
let data = {
  posts: [],
  sortDirection: undefined,
};

// 3 public APIs, as per requirements doc.

/**
 * Fetches posts from the specified API URL and renders them in the view.
 * @param {string} apiUrl - The URL to fetch posts from.
 * @returns {Promise<void>} A promise that resolves when the posts are fetched and rendered.
 */
async function fetchAndRenderPosts(apiUrl) {
  data.posts = await fetchPosts(apiUrl);
  render(data.posts);
}

/**
 * Sorts the current posts in ascending or descending order and re-renders the view.
 * @returns {Promise<void>} A promise that resolves when the posts are sorted and rendered.
 */
async function sortAndRenderPosts() {
  if (data.posts.length === 0) {
    data.posts = await fetchPosts();
  }
  data.sortDirection = data.sortDirection === "asc" ? "desc" : "asc";
  data.posts = sortPosts(data.posts, data.sortDirection);
  render(data.posts);
}

/**
 * Groups the current posts by user and re-renders the view.
 * @returns {Promise<void>} A promise that resolves when the posts are grouped by user and rendered.
 */
async function groupAndRenderPosts() {
  if (data.posts.length === 0) {
    data.posts = await fetchPosts();
  }
  data.posts = groupByUser(data.posts);
  render(data.posts);
}

// Private APIs. Not called outsite this file.

/**
 * Renders a list of posts to the specified root element.
 * @param {Array} posts - An array of post objects to render.
 * @returns {void}
 */
function render(posts) {
  let rootElement = document.getElementById("posts");
  rootElement.innerHTML = "";
  posts.forEach((post) => {
    let element = buildPostElement(post.id, post.userId, post.title, post.body);
    rootElement.appendChild(element);
  });
}

/**
 * Fetches posts from the specified API URL.
 * @param {string} apiUrl - The URL to fetch posts from.
 * @returns {Promise<Array>} A promise that resolves to an array of post objects.
 */
async function fetchPosts(apiUrl) {
  try {
    let response = await fetch(apiUrl);
    return await response.json();
  } catch (err) {
    console.log(err);
    return [];
  }
}

/**
 * Sorts an array of posts by title in the specified direction.
 * @param {Array} posts - An array of post objects to sort.
 * @param {string} dir - The sorting direction ("asc" for ascending or "desc" for descending).
 * @returns {Array} A sorted array of post objects.
 */
function sortPosts(posts, dir = "asc") {
  let sorted = posts.sort(function (a, b) {
    if (a.title < b.title) {
      return 1;
    }
    if (a.title > b.title) {
      return -1;
    }
    return 0;
  });

  if (dir === "desc") {
    sorted.reverse();
  }

  return sorted;
}

/**
 * Groups an array of posts by user ID.
 * @param {Array} posts - An array of post objects to group.
 * @returns {Array} An array of post objects grouped by user.
 */
function groupByUser(posts) {
  let grouped = posts.reduce((acc, item) => {
    let key = item.userId;
    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(item);
    return acc;
  }, {});

  return Object.values(grouped).flat();
}

/**
 * Builds a DOM element representing a single post.
 * @param {number} postId - The ID of the post.
 * @param {number} userId - The ID of the user who created the post.
 * @param {string} title - The title of the post.
 * @param {string} postBody - The body content of the post.
 * @returns {HTMLElement} A DOM element representing a single post.
 */
function buildPostElement(postId, userId, title, postBody) {
  const newPost = document.createElement("li");
  newPost.id = `post-${postId}`;

  const spanPostId = document.createElement("span");
  const spanUserId = document.createElement("span");
  const spanTitle = document.createElement("span");
  const spanBody = document.createElement("span");

  spanPostId.textContent = "#" + postId;
  spanUserId.textContent = "User " + userId;
  spanTitle.textContent = title;
  spanBody.textContent = postBody;

  newPost.appendChild(spanPostId);
  newPost.appendChild(spanUserId);
  newPost.appendChild(spanTitle);
  newPost.appendChild(spanBody);

  // Styling
  newPost.classList.add("post");
  spanPostId.classList.add("post-id");
  spanUserId.classList.add("user-id");
  spanTitle.classList.add("post-title");
  spanBody.classList.add("post-body");

  return newPost;
}
